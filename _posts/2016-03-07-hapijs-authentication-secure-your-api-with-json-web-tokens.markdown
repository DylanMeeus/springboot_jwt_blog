---
layout: post
title: "HapiJS Authentication - Secure Your API With JWT"
description: "HapiJS is a great framework for building NodeJS APIs. Get started with HapiJS Authentication to create users and protect your API endpoints."
date: 2016-03-07 08:30
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  bg_color: "#4f4d40"
  image: https://cdn.auth0.com/blog/hapi/hapi-logo-1.png
  image_size: "83%"
tags: 
- nodejs
- hapijs
- hapi
- joi
- boom
- api
- jwt
related:
- 2015-11-30-build-an-api-in-rust-with-jwt-authentication-using-nickelrs
- 2014-01-27-ten-things-you-should-know-about-tokens-and-cookies
- 2014-02-26-openid-connect-final-spec-10
---

---

**TL;DR:** Securing your Hapi API with JWT authentication is easy to do, and in this article we explore how to create and authenticate users and issue JWTs to them. We'll store our user data in MongoDB and use Mongoose to simplify database interaction. Head over to the [repo](https://github.com/auth0/hapi-jwt-authentication) to go straight to the code.

---

If you've built an app on NodeJS--especially an API--there's a good chance that you're familiar with [Express](https://github.com/expressjs/express). Many people are introduced to this framework when they start learning NodeJS development, and it does a great job. Just as its tagline says, it's fast, unopinionated, and minimalist.

A lesser-known alternative that has been gaining traction in recent years is [HapiJS](https://github.com/hapijs/hapi). Hapi is a server framework for Node that helps with building applications, and it does so in an interesting and elegant way. It puts a strong focus on reusability and configuration, meaning that developers can spend more time on business logic and less on implementing the infrastructure for their apps.

In this article we'll look at how to build an API with HapiJS that connects to MongoDB. We'll use some of the great tools in the HapiJS ecosystem, such as **[Joi](https://github.com/hapijs/joi)** for input validation and **[Boom](https://github.com/hapijs/boom)** for error handling. We'll use Mongoose to interact with the database, although you might prefer to skip this and interact with Mongo directly. We'll use the **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** package to create JWTs and **[hapi-auth-jwt](https://github.com/ryanfitz/hapi-auth-jwt)** to verify them when they arrive as `Authorization` headers.

The API we build will be mostly focused on authentication. As such, we'll create enpoints for creating user accounts, authenticating users, and displaying a list of registered users for those who have admin access. When users successfully authenticate, they will be issued [JSON Web Tokens (JWT)](http://jwt.io/introduction) which can be used to access other endpoints. We'll store a `scope` claim in the JWT which will give us a simple way to implement access control.

## Getting Started with HapiJS Authentication

Let's start by installing some of the dependencies we'll need.

```bash
npm install hapi joi boom hapi-auth-jwt mongoose glob --save
```

Creating and starting a Hapi server is easy. Let's set one up and also add configuration for our database and authentication strategy.

```js
// server.js

'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 3000 });

const dbUrl = 'mongodb://localhost:27017/hapi-app';

server.register(require('hapi-auth-jwt'), (err) => {
  
  // We're giving the strategy both a name
  // and scheme of 'jwt'
  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    verifyOptions: { algorithms: ['HS256'] }
  });
  
  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('api/**/routes/*.js', { 
    root: __dirname 
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(dbUrl, {}, (err) => {
    if (err) {
      throw err;
    }
  });
});
```

We're going to have individual files for each of our API routes, so here we're using `glob` to find all of these files so that we can create a new route for each. When we set up our authentication strategy, we need to provide a key to use which gets verified against the key provided in the JWT. This key is set up in a `config.js` file so we can share it in other locations. We're also specifying that the algorithm that should be used is `HS256`, but we could of course use other algorithms. Finally, we connect to our database through `mongoose` once the server is started and look for errors along the way.

We need to set up a secret key in `config.js`. This should be a long and unguessable string for production apps, but we'll just use something simple for now.

```js
// config.js

const key = 'secretkey';

module.exports = key;
```

## Peparing for our Routes

Our goal with this API is to take advantage of some of the tools that the Hapi ecosystem provides, such as **Joi** for form validation. We're also using Mongoose, which means that we need to set up a schema (model) for our data resources. To keep things clean, we'll split up our resources into several different files:

```bash
|-- route
  |-- model
  |-- routes
  |-- schemas
  |-- util
```

We'll keep our Mongoose model in the `model` directory, and any validation schemas we may have in `schemas`. We also have a `util` directory for any utility functions that are specific to the route.

## Creating Users

The first route that we should work on is the one for creating new users. This endpoint will accept a username, email, and password, and then save the user in the database. We'll of course want to salt and hash the password so that it is stored securely, and we can do that with **bcrypt**.

```bash
npm install bcrypt
```

First, let's set up the Mongoose model for the `users` resource.

```js
// api/users/model/User.js

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userModel);
```

This model describes how the `users` resource should be shaped, and also does *some* validation for us. As we'll see below, we'll get even better validation with **Joi**.

```js
'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [
      { method: verifyUniqueUser }
    ],
    handler: (req, res) => {
      
      let user = new User();
      user.email = req.payload.email;
      user.username = req.payload.username;
      user.admin = false;
      hashPassword(req.payload.password, (err, hash) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        user.password = hash;
        user.save((err, user) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          // If the user is saved successfully, issue a JWT
          res({ id_token: createToken(user) }).code(201);
        });
      });
      
    },
    // Validate the payload against the Joi schema
    validate: {
      payload: createUserSchema
    }
  }  
}
```

Hapi routes need to have a route `method` and `path` at a minimum, and a `handler` if they are to be useful. Configuring these details here is self-explanatory, but a few things are likely unfamiliar. Down at the bottom, we have a spot for validating input, and in this case, we want to validate the `payload` that comes in. If we were accepting params from the user, then we could specify our validation on the `params` key. This validation is coming from the `createUserSchema` within the `schemas` subdirectory.

```js
// api/users/schemas/createUser.js

'use strict';

const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = createUserSchema;
```

The schema is fairly readable--we want to make sure that each item is a string and we're saying that they are all required. We can go beyond this though, like we're doing with `username` and `email`. There are plenty of options for Joi schemas, and you can see the full API documentation [here](https://github.com/hapijs/joi/blob/master/API.md). Setting up validation with Joi is great, because it will automatically reject any inputs that don't match what the schema contains and will provide sensible error messages without requiring any configuration.

Another potentially unfamiliar item in the route is `pre` array within the `config` object. With Hapi, we can define any number of **prerequisite** functions to run **before** the route handler is reached. This is great if we need to do some processing on the data payload that comes in, and is the perfect spot for us to verify that the `username` and `email` provided to the endpoint are unique and that no users already exist with those details. We're pointing the `pre` method to `verifyUniqueUser` in our `userFunctions.js` file.

We can do a lot with `pre` methods, and since they fully support async and parallelization, there are many great possibilities available to us for abstracting parts of our route logic. With this, our handlers become very small and more maintainable.

```js
// api/users/util/userFunctions.js

'use strict';

const Boom = require('boom');
const User = require('../model/User');

function verifyUniqueUser(req, res) {
  // Find an entry from the database that
  // matches either the email or username
  User.findOne({ 
    $or: [ 
      { email: req.payload.email }, 
      { username: req.payload.username }
    ]
  }, (err, user) => {
    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
      if (user.username === req.payload.username) {
        res(Boom.badRequest('Username taken'));
      }
      if (user.email === req.payload.email) {
        res(Boom.badRequest('Email taken'));
      }
    }
    // If everything checks out, send the payload through
    // to the route handler
    res(req.payload);
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser
}
```

This function looks in the database for a user with the same username or email address that is delivered in the payload, and if one is found, returns the appropriate error message. If everything checks out, the payload is sent on for the `handler` to use.

## Signing JSON Web Tokens

In the `createUser` route above, the user's JWT is sent back to them when they successfully create an account. We need a function called `createToken` to actually sign the JWT.

```js
// api/users/util/token.js

'use strict';

const jwt = require('jsonwebtoken');
const secret = require('../../../config');

function createToken(user) {
  let scopes;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.admin) {
    scopes = 'admin';
  }
  // Sign the JWT
  return jwt.sign({ id: user._id, username: user.username, scope: scopes }, secret, { algorithm: 'HS256', expiresIn: "1h" } );
}

module.exports = createToken;
``` 

You'll likely have noticed that we are defaulting to `admin` to `false` in the `createUser` route handler above. When we go to sign the JWT, we're checking whether the user is an administrator first, and if so, we attach the appropriate scope. We're also specifying here that we want to use `HS256` as our algorithm and have the JWT expire in one hour.

> **Note:** The way you would implement attaching user scopes to newly created users in your own appications will likely differ from what we're doing here, but we can get a quick sense of it this way.

Now when a user successfully registers, their JWT is returned.

![hapijs authentication](https://cdn.auth0.com/blog/hapi/hapi-auth-1.png)

We can see the `verifyUniqueUser` function at work if we tried to save the same user again.

![hapijs authentication](https://cdn.auth0.com/blog/hapi/hapi-auth-2.png)

## Authenticating Users

We'll see how to protect various routes a little later, but first, let's put in a route that allows users to authenticate themselves after they've signed up. We'll need to have some logic that checks the password that the user passes in against the hashed password stored in the database. If the two match, then we can issue a JWT to the user. This is another spot where we can use a `pre` method, and we'll stick a new function called `verifyCredentials` onto it.

```js
// api/users/util/userFunctions.js

...

function verifyCredentials(req, res) {
  
  const password = req.payload.password;
  
  // Find an entry from the database that
  // matches either the email or username
  User.findOne({ 
    $or: [ 
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          res(user);
        }
        else {
          res(Boom.badRequest('Incorrect password!'));
        }
      });
    } else {
      res(Boom.badRequest('Incorrect username or email!'));
    }
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials
}
```

This function uses `bcrypt` to check the password sent in the payload against the database entry for the user, and if it is valid, the user object is sent through to the handler. We're using **boom** to respond the error cases, and they will bubble up to the handler if they are encountered. 

Our route setup can now be very small.

```js
// api/users/routes/authenticateUser.js

'use strict';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../util/userFunctions').verifyCredentials;
const createToken = require('../util/token');

module.exports = {
  method: 'POST',
  path: '/api/users/authenticate',
  config: {
    // Check the user's password against the DB
    pre: [
      { method: verifyCredentials, assign: 'user' }
    ],
    handler: (req, res) => {
      // If the user's password is correct, we can issue a token.
      // If it was incorrect, the error will bubble up from the pre method
      res({ id_token: createToken(req.pre.user) }).code(201);
    },
    validate: {
      payload: authenticateUserSchema
    }
  }  
}
```

Now we need to set up our `authenticateUserSchema` so that we can have **Joi** validation for this route, but this time it will work a bit differently. The user was required to sign up with a username *and* email, but when they go to authenticate, they should only need one or the other. For this, we can use `Joi.alternatives`. 

```js
// api/users/schema/authenticateUser.js

'use strict';

const Joi = require('joi');


const authenticateUserSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
);

module.exports = authenticateUserSchema;
```

The `try` method accepts arguments for whichever validation alternatives we wan to attempt. These can be things like `Joi.string()`, or we can pass individual `Joi` objects. In this case, we're passing two objects--one for handling the `username` case and the other for handling `email`. This will let the user authenticate with either their `username` or `email`.

## Listing Users

For this simple API, we'll say that admins should be the only ones able to get a list of all users in the database. Using JWT authentication with scopes in a Hapi application makes it easy to create fine-grained user access, but for now we'll just have two levels: admins and everyone else. Remember that we coded our `createUser` route to set new users' `admin` scope to `false` by default. We can set this to `true` temporarily in the handler to get a user with admin access, or we can just change that value in the database. See the [repo](https://github.com/auth0/hapi-jwt-authentication) for an endpoint that responds to `PATCH` requests which lets admins change this scope for other users. 

After setting `admin` to `true` for one of our users, let's see how we can limit API access for an endpoint that displays a list of all users.

```js
// api/users/routes/getUsers.js

'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/api/users',
  config: {
    handler: (req, res) => {
      User
        .find()
        // Deselect the password and version fields
        .select('-password -__v')
        .exec((err, users) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!users.length) {
            throw Boom.notFound('No users found!');
          }
          res(users);
        })
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'jwt',
      scope: ['admin']
    }
  }
}
```

We've specified that this route should implement the `jwt` auth strategy (which we defined in `server.js`), and that the user must have a scope of `admin` to access the route. If we [inspect our JWT](http://jwt.io), we can see that we've got a `scope` of `admin`. 

![hapijs authentication](https://cdn.auth0.com/blog/hapi/hapi-auth-3.png)

You might be wondering if this is secure. Since we can inspect and change the content of the JWT in the debugger, couldn't a malicious user either change an existing JWT or create a new one that could compromise the API? Remember that the beauty of JWTs is that they are digitally signed with the secret key on our server. For the modified JWT to be valid, the attacker would need to know the secret. As long as we have a strong private key, our JWTs are secure.

![hapijs authentication](https://cdn.auth0.com/blog/hapi/hapi-auth-4.png)

Now that we've got endpoints for creating and authenticating users, we can simply apply our authentication strategy to whichever other endpoints we like.

## Other Hapi Authentication Features

We've seen how easy it is to apply authentication to individual endpoints in our Hapi app. We simply need to attach the auth strategy to the route object and we're good to go. However, if we wanted to apply authentication for every endpoint, it becomes even easier. For that, we just need to set the `mode` when we register the strategy, and we can do this by passing in `true` or `'required'` as the third argument.

```js
// server.js

...

server.auth.strategy('jwt', 'jwt', 'required', {
  key: secret,
  verifyOptions: { algorithms: ['HS256'] }
});

...
```

Hapi comes with some other interesting authentication features as well, and one of them is the ability to make authentication optional. Passing `'optional'` or `'try'` as the mode will allow users to access the route whether or not they are authenticated. The difference between them is that with `optional`, the user's authentication data must be valid, whereas with `try`, the authentication data will still be accepted even if it is invalid.

## Aside: Hapi Authentication with Auth0

We've successfully rolled our own authentication with Hapi, but this was really just the tip of the iceberg. There are a lot more details around authentication that we need to think about to have a robust system. If we want to support modern authentication features such as social login, multi-factor auth, and single sign-on, then implementing our own end-to-end authentication can be tricky. Thankfully, Auth0 does all of this (and much more) for us out of the box!

With Auth0, Hapi authentication becomes very simple.

### Step 0: Sign Up for Your Free Auth0 Account

If you haven't yet done so, sign up for your [free Auth0 account](https://auth0.com/signup). The free plan gives you 7,000 regular active users and two social identity providers, which is plenty for many real world apps.

### Step 1: Add Your Auth0 Private Key

We already have an authentication strategy for Hapi that we set up above using **hapi-auth-jwt**. All we need to do now is use our Auth0 private key instead of the simple one we set up in `config.js`.

```js
// config.js

const key = 'your_auth0_secret';

module.exports = key;
```

Now we can protect our endpoints with any of the methods we described above. We can either apply the auth strategy to each route individually, or we can set it globally by setting the mode to `required`.

### Step 2: Issue JWTs for your Users

By default, Auth0 stores user data for you, meaning that when a user authenticates in your app, the call doesn't go to your server. Instead, Auth0 is responsible for checking the user's credentials and issuing them a JWT on a successful login.

There are a few different ways that your users can authenticate and have a JWT issued to them, but the easiest is to use the ready-to-go Lock widget on the front end of your application. We can add Lock to our project easily and trigger it with some simple JavaScript.

> **Note:** Auth0 provides SDKs and integration samples for all popular frameworks and you can check out the [docs](https://auth0.com/docs) for code samples that apply to your specific project.

First, add the Lock library to your front end.

```html
  <!-- index.html -->
  
  ...
  
  <!-- Auth0Lock script -->
  <script src="https://cdn.auth0.com/js/lock-8.2.min.js"></script>

  <!-- Setting the right viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  
  ...
```

Next, configure an instance of `Auth0Lock`.

```js
// app.js

var lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_DOMAIN');
```

You can attach an event listener to a button click and call `lock.show` to open the Lock widget.

```js
// app.js

document.getElementById('btn-login').addEventListener('click', function() {
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback
      console.error("Something went wrong: ", err);
    } else {
      // Success calback  

      // Save the JWT token.
      localStorage.setItem('id_token', token);
      // Save the profile
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  });
});
```

When the user successfully logs in, their JWT and profile are saved in local storage.

To make secure calls to your API, simply attach the user's JWT as an `Authorization` header.

### Step 3: Add Scopes with Auth0 Rules (optional)

The API we built above checks for a simple `admin` scope which gives us at least some level of access control. We can, however, get much more granular than this by making the scopes specific to individual endpoints and operations (create, update etc) that our users should have. With Auth0, we can store arbitrary metadata for users, which is where we can keep their scopes. Storing metadata is very easy--we can either enter it manually, or we can create [rules](https://auth0.com/docs/rules) to automate the process.

![hapijs authentication](https://cdn.auth0.com/blog/hapi/hapi-auth-5.png)

## Wrapping Up

HapiJS is an awesome framework for Node that makes building APIs simple and flexible. Other packages in the Hapi ecosystem, including **Joi** and **Boom** make it easy to create a robust app and spares us from doing a lot of the heavy lifting. As we've seen, JWT authentication for Hapi is really simple as well--we just need to use **hapi-auth-jwt** and register our authentication strategy.

What are your thoughts on HapiJS? Does it seem like a good alternative to Express? Let us know!
