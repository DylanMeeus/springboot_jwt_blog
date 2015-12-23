---
layout: post
title: "Securing your NodeBots with JSON Web Tokens"
description: "Secure your internet-connected NodeBots projects with JSON Web Tokens."
date: 2015-12-22 9:00
permalink: /2015/12/22/securing-nodebots-with-JWT
author: 
  name: Kassandra Perch
  url: https://twitter.com/nodebotanist
  mail: kassandra.perch@auth0.com
  avatar: https://s.gravatar.com/avatar/bc94ff6211e645a2bdb4fdc60e23ad85.jpg?s=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "120%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags: 
- product 
- JWT
- NodeBots
- hardware
---

# Securing your NodeBots with JSON Web Tokens

NodeBots are amazing! One of the best things about them is that you can connect them to the internet in new and amazing ways. This can include controlling NodeBots via your own Node.JS API! 

However, this can lead to some interesting scenarios regarding security-- especially if you choose to control a system like a door lock via NodeBots. Without a cloud service like Particle's Cloud or Electric Imp's agent/client system, security can be tricky! Even with third-party cloud solutions providing basic security, this security mainly covers your API's communication with your NodeBot-- not the internet's communication with your API!

Luckily for us, NodeBots means Node, and Node has several easy-to-use security systems. One way is to use JSON Web Tokens as a bolstered authentication system for your NodeBots server.

## JSON Web Tokens

When using your own Node server for robotics control and code, JSON Web Tokens can provide an extra level of security-- especially when you're stuck on HTTP. JSON Web Tokens use a payload, encyption, and either a secret or private/public key pair in order to provide a signed token that allows you to verify that your NodeBots APIs are only being used by you (or other NodeBots and users that you approve)!

In order to use JSON Web Tokens with NodeBots, you'll want to look into [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). This library allows you to create JSON Web Tokens:

```javascript
var jwt = require('jsonwebtoken');
var myToken = jwt.sign({ user: 'username' }, 'my secret');
```

the `.sign()` method takes a payload (which is a javascript object that will be converted to JSON), and a secret-- JWT, unlike other token types, allows for not only the use of secrets, but the use of public/private key pairs:

```javascript
var cert = fs.readFileSync('private.key');  // get private key
var token = jwt.sign({ sensorData: 1024 }, cert, { algorithm: 'RS256'});
```

Once you have your token, it's safe to pass as an authentication header:

```
Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidGVzdCIsImlhdCI6MTQ0NjUyNDM5NH0.NDlWo8qunNFJvU9GGTeniAfUxwV0z38LhgkN57m-hvI
```

Want to learn even more about JWT tokens before getting started? Check out Auth0's [extensive documentation on the subject at JWT.io](http://jwt.io). You can also read about the different ways to sign JWT's in [this blog post.](https://auth0.com/blog/2015/12/17/json-web-token-signing-algorithms-overview/)

## Using JWT for request authentication

But how do we check for a valid token on our API requests? You can check headers manually using your own methods, but a very easy way is to use [express-jwt](https://www.npmjs.com/package/express-jwt), an npm module and express middleware. All you have to do is set up this middleware:

```javascript
var express = require('express');
var jwt = require('express-jwt');

var app = express();

app.use(jwt({ secret: 'my secret'});
```

Now all of your requests to this API will require the authentication header to contain a valid JWT token signed with your secret in order to complete-- otherwise they will return with a 401. 

## When is this useful for NodeBots?

This technique is mainly useful for Johnny-Five, and other NodeBots projects, that are accessible via the internet. This can include thin clients (e.g. [Particle Photons](http://particle.io) using the [Javascript SDK](https://www.npmjs.com/package/spark)), or [Johnny-Five](http://johnny-five.io) bots that have been made available via local wireless.

This is also useful in situations where you use an external client (be it a client-side app, a different API server, or even a third-party service) to work with your NodeBot. For instance, if you have a GET route that moves a servo, and you don't want someone hacking together a script in a few minutes that takes over movement using that GET request, you can use JWT to lock down that route so only scripts that you've written, containing tokens signed with your secret, can move that servo.

## Aside: User Management with Auth0

If you want to provide a user login for your NodeBots project, you can use Auth0 to manage your users and easily create a login dialog! Check out [lock](https://auth0.com/lock) for more information. You can implement lock easily on your front-end and your Node.JS server [with just a few lines of javascript](https://auth0.com/docs/quickstart/spa/vanillajs/nodejs).

For instance, in your web interface's index.html, add

```html
  <!-- index.html -->

  ...

  <!-- Auth0 Lock script -->
  <script src="//cdn.auth0.com/js/lock-7.11.1.min.js"></script>

  ...
```

To call in the Auth0 Lock script. Then, add a login button:

```html
	<!-- index.html -->

	...

	<!-- Login Button -->
	<input id="btn-login" class="btn-login" type="submit" />

	...
```

To wrap-up the front-end, add a call to Lock from the login button:

```javascript
document.getElementById('btn-login').addEventListener('click', function() {
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback
      console.error("Something went wrong: ", err);
      alert("Something went wrong, check the Console errors");
    } else {
      // Success calback  

      // Save the JWT token.
      localStorage.setItem('userToken', token);

      // Save the profile
      userProfile = profile;

      document.getElementById('nick').textContent = profile.nickname;
    }
  });
});
```

Then, on your server, we're going to modify our use of express-jwt to work with the JWTs that Auth0 creates to authenticate users:

```javascript
var express = require('express');
var app = express();
var jwt = require('express-jwt');

var jwtCheck = jwt({
  secret: new Buffer('YOUR_CLIENT_SECRET', 'base64'),
  audience: 'YOUR_CLIENT_ID'
});
```

This way, you can easily allow users to log into your NodeBots interface, with jsut a few lines of javascript!

## Other tips

Some things to keep in mind when using this method to protect your robotics APIs:

* **You can revoke access in multiple ways, quickly:** the `jsonwebtoken` API gives you ways to revoke specific tokens, but you can quickly invalidate all tokens by changing your secret. 
* **You can provide a login, but you don't have to!:** as long as you can use the API to generate tokens using your secret, you don't need to provide a login interface to the rest of the world.
* **Be sure to set expirations on your tokens:** security is a "better safe than sorry" topic, so be sure to set a lifetime on your tokens to prevent an old token coming back to haunt you!

Hopefully now you're on your way to taking the first steps to secure communications with your NodeBots APIs! I'd really like to see what you build-- let me know [on Twitter](https://twitter.com/nodebotanist).
