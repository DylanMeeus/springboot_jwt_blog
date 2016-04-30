---
layout: post
title: "Build an App with Vue.js: From Authentication to Calling an API"
description: "Learn how to build a Vue.js app and how to easily get up and running with JWT authentication."
date: 2015-11-16 12:00
permalink: /2015/11/13/build-an-app-with-vuejs/
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image: https://cdn.auth0.com/blog/vuejs/vue-logo.png
  bg_color: "#35495e"
  image_size: "80%"
  image_bg_color: "#fff"
tags: 
- vue
- vuejs
- javascript
- jwt
- authentication
related:
- 2016-01-13-rise-of-the-high-boilerplate-framework-a-look-at-falcor-and-relay
- 2016-04-20-angularjs-authentication-screencast-series-part-2
- 2016-03-07-hapijs-authentication-secure-your-api-with-json-web-tokens
---

---

**TL;DR:** There are a ton of great JavaScript frameworks out there, and it can be a little overwhelming to keep up with them all. The learning curve for these frameworks can also be a bit steep. [Vue.js](http://vuejs.org/) is a breath of fresh air in this regard. In this tutorial, we'll see how easy it is to get up and running with a Vue.js app and how we can easily add authentication to it. Check out the [repo](https://github.com/auth0/vue-jwt-authentication) to get the code.

---

We are lucky to have plenty of JavaScript frameworks to choose from these days but, at the same time, it can be quite fatiguing to keep up with all of them. Some have a steep learning curve and require a lot of time for developers and their teams to become comfortable with. Others might be easy to learn, but perhaps lack some features that are crucial to a project. In either case, the level of complexity associated with learning a new framework can often hinder adoption and leave developers and teams frustrated.

If you're still choosing a framework for your Single Page App (SPA), or if you just want to learn a new technology, I believe [Vue.js](http://vuejs.org/) is one of the best frameworks you can pick. I love Vue.js for its simplicity and elegance, and how I can be super productive with it without needing to spend tons of time learning. In my experience, Vue.js **just works** and gets out of my way when developing applications.

Those are some anecdotal selling points, but let's cut to the hard facts: what exactly is Vue.js and how does it differ from other frameworks? If you're familiar with AngularJS 1.x, then Vue.js will probably look pretty familiar. In fact, Vue is heavily inspired by Angular. So what's the difference then? Essentially, Vue has a much simpler and cleaner API, is more flexible, and claims better performance. 

Vue.js is firstly a view layer for applications that allows for reactive data binding and composable view components, and many developers use it only for their view layers. However, when combined with other tools in the Vue ecosystem, such as **[vue-router](https://github.com/vuejs/vue-router)**, **[vue-resource](https://github.com/vuejs/vue-resource)**, and **[vue-loader](https://github.com/vuejs/vue-loader)**, we get all the benefits of a great SPA framework while simplicity and developer experience are maintained.

## What We'll Build: A Vue.js Authentication App

To demonstrate how easy it is to get up and running with a full SPA using Vue, we'll build a simple app that retrieves Chuck Norris quotes from a NodeJS backend. Vue can easily be mixed with other technologies, and you can use Vue for as much or as little of your app as you wish. To demonstrate Vue's full potential though, we'll build the whole front-end SPA with Vue components and follow Vue's pattern for large-scale applications. The front-end app will be totally decoupled from the back end, and we'll make HTTP requets to RESTful endpoints on our server.

We'll also demonstrate how we can easily add authentication to our Vue.js app. We'll put **Login** and **Signup** components in place to show how we can retrieve and save a user's JWT, and then send it back to the server for accessing protected endpoints.

Rather than listing out how Vue implements certain features and comparing them to other frameworks, we'll let the code speak for itself. Again, if you're familiar with Angular, it will be easy to reason about Vue's features and syntax.

## Installation and Setup

Everything we need to start our component-based Vue.js app is on NPM. To get started, let's pull down what we need by creating our `package.json` file and specifying the packages we need. We can take full advantage of ES6 for our Vue components, and to make that happen, we'll use [Babel](https://babeljs.io/). We'll also bundle everything up with [Webpack](https://webpack.github.io/) and use **hot reloading** to see changes to our modules happen immediately. If you wish, you can also use other build tools (like Browserify) instead of Webpack.

```js
// package.json

...

  "devDependencies": {
    "babel-core": "^6.1.2",
    "babel-loader": "^6.1.0",
    "babel-plugin-transform-runtime": "^6.1.2",
    "babel-preset-es2015": "^6.1.2",
    "babel-runtime": "^6.0.14",
    "css-loader": "^0.21.0",
    "style-loader": "^0.13.0",
    "vue-hot-reload-api": "^1.2.1",
    "vue-html-loader": "^1.0.0",
    "vue-loader": "^7.0.1",
    "webpack": "^1.12.3",
    "webpack-dev-server": "^1.12.1"
  },
  "dependencies": {
    "bootstrap": "^3.3.5",
    "vue-resource": "^0.1.17",
    "vue-router": "^0.7.5",
    "vue": "^1.0.7"
  }

...
```

Once the rest of our `package.json` file is in place, we can install everything.

```bash
npm install
```

To make **Webpack** work, we need a configuration file for it. Let's put in a file called `webpack.config.js` and populate it.

```js
// webpack.config.js

module.exports = {
  // the main entry of our app
  entry: ['./src/index.js', './src/auth/index.js'],
  // output configuration
  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: 'build.js'
  },

  module: {
    loaders: [
      // process *.vue files using vue-loader
      { test: /\.vue$/, loader: 'vue' },
      // process *.js files using babel-loader
      // the exclude pattern is important so that we don't
      // apply babel transform to all the dependencies!
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}
```

In this config file, we're first specifying where our app's main entry point is and what the output path should be. The bundled JavaScript will be served as one file called `build.js`.

In the `module.loaders` array, we're setting up processing for our Vue components. These components have an extension of `.vue` and are processed by `vue-loader`. 

That's all the configuration we need for now. Once we have our files in place, we just need to run `webpack-dev-server --inline --hot` to bundle and serve everything.

## Setting Up the Back End

We're using our trusty [nodejs-jwt-authentication-sample](https://github.com/auth0/nodejs-jwt-authentication-sample) to retrieve Chuck Norris quotes. Clone the repo wherever you like (here we're putting it in a `server` directory) and follow the readme for installation steps.

## Setting Up the Vue Components

Let's get started with the actual components for our app. But first, what exactly is a Vue component and how does it work? Vue components allow us to specify a **template**, a **script**, and **style** rules all in one file. If you're familiar with React, this will likely be familiar. This move toward composition and splitting the app into small components is helpful for maintainence and reasoning about the app.

To see how this works, let's start with the `Home` component.

```html
  <!-- src/components/Home.vue -->

  <template>
    <div class="col-sm-6 col-sm-offset-3">
      <h1>Get a Free Chuck Norris Quote!</h1>
      <button class="btn btn-primary" v-on:click="getQuote()">Get a Quote</button>
      <div class="quote-area" v-if="quote">
        <h2><blockquote>{{ "{{ quote " }}}}</blockquote></h2>      
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        quote: ''
      }
    },
    methods: {
      getQuote() {
        this.$http
          .get('http://localhost:3001/api/random-quote', (data) => {
            this.quote = data;
          })
          .error((err) => console.log(err))
      }
    }
  }
  </script>
```

The **template** is just some simple markup with a button that calls the method `getQuote`. We can notice some similarities to Angular in this code already. The template uses directives like `v-on:click` for click events, and `v-if` to conditionally show and hide the `quote-area` div. Vue also uses the double curly brace syntax for templating, which is how we take care of rendering the `quote` property. 

The **script** area exports an object that is converted into a **component constructor function** by Vue. It has on it a `data` method and a `methods` object where we can register custom methods. When we want to register a data property to be used in the template, we need to do so in the `data` method. If we were to leave out the `quote` property from the returned object, that property wouldn't be rendered in the template. The `getQuote` method makes an HTTP request to our back end and sets the returned data on the `quote` property.

This gives us a good idea of what Vue components look like, but this won't work quite yet because we need to set up our app's main entry point, as well as a main **App** component. Here's how this component will render once everything is set up:

![vue vuejs authentication quote](https://cdn.auth0.com/blog/vuejs/vuejs-1.png)

## Setting Up index.js and App.vue

The `index.js` file is the place where we set up our main imports and do other configuration like routing. Let's set up everything we'll need for the whole app right now.

```js
// src/index.js

import Vue from 'vue'
import App from './components/App.vue'
import Home from './components/Home.vue'
import SecretQuote from './components/SecretQuote.vue'
import Signup from './components/Signup.vue'
import Login from './components/Login.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(VueRouter)

export var router = new VueRouter()

// Set up routing and match routes to components
router.map({
  '/home': {
    component: Home
  },
  'secretquote': {
    component: SecretQuote
  },
  '/login': {
    component: Login
  },
  '/signup': {
    component: Signup
  }
})

// Redirect to the home route if any routes are unmatched
router.redirect({
  '*': '/home'
})

// Start the app on the #app div
router.start(App, '#app')
```

We're importing some components we've yet to create, as well as `vue-router` and `vue-resource`. For the app to recognize `vue-router` and `vue-resource`, we just need to call `Vue.use` on them. We can set up our route definitions with the simple `map` method on our instance of `vue-router`. The reason we're exporting this instance is so we can get a reference to it in our other components.

```html
  <!-- src/components/App.vue -->

  <template>
    <nav class="navbar navbar-default">
      <div class="container">
        <ul class="nav navbar-nav">
          <li><a v-link="'home'">Home</a></li>
          <li><a v-link="'login'">Login</a></li>
          <li><a v-link="'signup'">Sign Up</a></li>
          <li><a v-link="'secretquote'">Secret Quote</a></li>
          <li><a v-link="'login'">Logout</a></li>
        </ul>
      </div>    
    </nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </template>
```

To start out, our `App` component just needs a template. This top-level component has a `navbar` and exposes a `router-view` which is where our various routes will be rendered. Linking to routes is as simple as placing `v-link` on the anchor tags.

Finally, we need to be sure to place a div with an id of **app** within `index.html`, as this is where the whole app will be exposed.

```html
 <!-- index.html -->

 ...

 <body>
 <div id="app"></div>      
   <script src="build/build.js"></script>
 </body>

 ...
 ```

## User Authentication - Login and Signup Components

To log users in, we'll need to make an HTTP request to our authentication endpoint and save the JWT that is returned in `localStorage`. We could place this logic right within our **Login** component, but we should really have a service to make it more reusable. Let's create a directory called **auth** and provide an `index.js` file there.

```js
// src/auth/index.js

import {router} from '../index'

// URL and endpoint constants
const API_URL = 'http://localhost:3001/'
const LOGIN_URL = API_URL + 'sessions/create/'
const SIGNUP_URL = API_URL + 'users/'

export default {
  
  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)

      this.user.authenticated = true

      // Redirect to a specified route
      if(redirect) {
        router.go(redirect)        
      }

    }).error((err) => {
      context.error = err
    })
  },

  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)        
      }

    }).error((err) => {
      context.error = err
    })
  },

  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('id_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false      
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  }
}
```

Our `auth` service exposes methods for logging users in and out, signing them up, and checking their authentication status. Note that "logging in" is just a matter of saving the JWT that is returned by the server. These methods and properties will all be useful throughout the app. For example, we can use the `user.authenticated` property to conditionally show elements in the app.

## Implementing the Login Component

The **Login** component will need some HTML for the user inputs and a method to call our **auth** service.

```html
  <!-- src/components/Login.vue -->

  <template>
    <div class="col-sm-4 col-sm-offset-4">
      <h2>Log In</h2>
      <p>Log in to your account to get some great quotes.</p>
      <div class="alert alert-danger" v-if="error">
        <p>{{ "{{ error " }}}}</p>
      </div>
      <div class="form-group">
        <input 
          type="text" 
          class="form-control"
          placeholder="Enter your username"
          v-model="credentials.username"
        >
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Enter your password"
          v-model="credentials.password"
        >
      </div>
      <button class="btn btn-primary" @click="submit()">Access</button>
    </div>
  </template>

  <script>
  import auth from '../auth'
  export default {
    data() {
      return {
        // We need to initialize the component with any
        // properties that will be used in it
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      submit() {
        var credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        // We need to pass the component's this context
        // to properly make use of http in the auth service
        auth.login(this, credentials, 'secretquote')
      }
    }
    
  }
  </script>
```

HTTP calls made with `vue-resource` require a component's context, and since we're abstracting that logic to a service, we need to pass the **Login** component's `this` context to the service. The second argument is the object with the user's credentials, and the third is the route we want to redirect to upon successfully authenticating.

Note that we're using `@click` on our submit button here. This is a shorthand alternative to `v-on:click`.

![vue vuejs authentication login](https://cdn.auth0.com/blog/vuejs/vuejs-2.png)

The **Signup** component is nearly identical, except it will use the `signup` method from the `auth` service to send the user's credentials to a different endpoint.

![vue vuejs authentication signup](https://cdn.auth0.com/blog/vuejs/vuejs-4.png)

## Implementing the Secret Quote Component

When a user successfully authenticates, they will be able to access the **secret-quote** route from the API. The **SecretQuote** component will look similar to the **Home** component, but we'll attach the user's JWT as an `Authorization` header when requests are sent.

```html
  <!-- src/components/SecretQuote.vue -->

  <template>
    <div class="col-sm-6 col-sm-offset-3">
      <h1>Get a Secret Chuck Norris Quote!</h1>
      <button class="btn btn-warning" v-on:click="getQuote()">Get a Quote</button>
      <div class="quote-area" v-if="quote">
        <h2><blockquote>{{ "{{ quote " }}}}</blockquote></h2>      
      </div>
    </div>
  </template>

  <script>
  import auth from '../auth'
  export default {
    data() {
      return {
        quote: ''
      }
    },
    methods: {
      getQuote() {
        this.$http
          .get('http://localhost:3001/api/protected/random-quote', (data) => {
            this.quote = data;
          }, {
            // Attach the JWT header 
            headers: auth.getAuthHeader()
          })
          .error((err) => console.log(err))
      }
    },
    route: {
      // Check the users auth status before
      // allowing navigation to the route
      canActivate() {
        return auth.user.authenticated
      }
    }
  }
  </script>
```

The header is attached by providing an options object as the third argument to the HTTP request. To get the JWT header, we call the `getAuthHeader` method from the `auth` service.

Since we don't want users to access this route if they are not authenticated, we can tap into `vue-router`'s transition pipeline. Specifically, we use the `canActivate` hook and consult the `auth` service to check if the user is authenticated. If so, the route can be navigated to.

![vue vuejs authentication secretquote](https://cdn.auth0.com/blog/vuejs/vuejs-3.png)

## Final Touches

We're nearly done, but there are a couple of improvements we can make before we finish out. It would be good to conditionally show and hide menu items based on the user's `auth` status. To do that, we'll use `v-if`.

```html
  <!-- src/components/App.vue -->

  <template>
    <nav class="navbar navbar-default">
      <div class="container">
        <ul class="nav navbar-nav">
          <li><a v-link="'home'">Home</a></li>
          <li><a v-link="'login'" v-if="!user.authenticated">Login</a></li>
          <li><a v-link="'signup'" v-if="!user.authenticated">Sign Up</a></li>
          <li><a v-link="'secretquote'" v-if="user.authenticated">Secret Quote</a></li>
          <li><a v-link="'login'" v-if="user.authenticated" @click="logout()">Logout</a></li>
        </ul>
      </div>    
    </nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </template>

  <script>
  import auth from '../auth'
  export default {
    data() {
      return {
        user: auth.user
      }
    },
    methods: {
      logout() {
        auth.logout()
      }
    }
  }
  </script>
```

The `auth` service sets the user's authentication status when the `login` or `logout` methods are used, but if the page is refreshed or the app closed and reopened, that status will be lost. To get around that, let's call `checkLogin` when the app is first loaded.

```js
// src/index.js

...

import auth from './auth'

// Check the users auth status when the app starts
auth.checkAuth()

...
```

### Setting Global Headers

When we make a request to the protected `secret-quote` route, we pass an options object that has the `Authorization` header and user's JWT on it. If, instead, we wanted to globally set the `Authorization` header and not worry about setting it on each HTTP request, we could set up a global header.

```js
// src/index.js

...

// Optional
Vue.http.headers.common['Authorization'] = auth.getAuthHeader();

...
```

## Aside: Using Auth0 With Your Vue.js App

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in our Vue.js apps by using the **[Lock Widget](https://auth0.com/lock)**.

![auth0 lock vuejs](https://cdn.auth0.com/blog/node-knockout/node-knockout-1.png)

### Step 1: Include Auth0's Lock Widget

```html
  <!-- index.html -->

  ...

  <!-- Auth0 Lock script -->
  <script src="//cdn.auth0.com/js/lock-7.11.1.min.js"></script>

  ...
```

### Step 2: Instantiate Lock in index.js

```js
// src/index.js

...

// Instantiate a Lock
export var lock = new Auth0Lock(YOUR_CLIENT_ID, YOUR_CLIENT_DOMAIN)

...
```

### Step 3: Call the Lock Widget from a Vue.js Component

```html
  <!-- src/components/Login.vue -->

  <template>
    <div class="col-sm-4 col-sm-offset-4">
      <h2>Log In</h2>
      <p>Log In with Auth0's Lock Widget.</p>
      <button class="btn btn-primary" @click="login()">Log In</button>
    </div>
  </template>

  <script>
  // Import the Lock instance
  import {lock} from '../index'

  export default {

    methods: {
      
      login() {

        // Show the Lock Widget and save the user's JWT on a successful login
        lock.show((err, profile, id_token) => {

          localStorage.setItem('profile', JSON.stringify(profile))
          localStorage.setItem('id_token', id_token)

        })
      },

      logout() {

        // Remove the profile and token from localStorage
        localStorage.removeItem('profile')
        localStorage.removeItem('id_token')

      }
    }
    
  }

  </script>
```

## Wrapping Up

We have many great choices for SPA frameworks these days, and this can easily cause analysis paralysis. Further, it can be fatiguing to keep up with the pace of new framework development and to learn their ins and outs.

I find Vue.js to be a breath of fresh air in this regard. The library and ecosystem are feature-rich, but they get out of your way as you develop your apps. I've found that the learning curve with Vue.js isn't as steep as it can be with other frameworks, and from my experience, it seems to always **just work**.

As we saw in this tutorial, we can easily add authentication to our Vue.js apps. Also, Vue's HTTP library, `vue-resource`, makes it trivial to send requests with an `Authorization` header.

I hope you'll consider Vue.js for your next project--it really is great to work with!
