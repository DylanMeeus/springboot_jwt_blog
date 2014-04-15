---
published: "true"
layout: post
title: Cookies vs Tokens. Getting auth right with Angular.JS
date: "2014-01-07 12:30"
author:
  name: Alberto Pose
  mail: alberto@auth0.com
  url: http://twitter.com/thepose
  avatar: https://pbs.twimg.com/profile_images/3275858589/fd80792e3615b83c812c27353608ca10_bigger.jpeg
---


<img src="https://s3.amazonaws.com/blog.auth0.com/img/poisoned-cookies.jpg" style="width: 400px; margin-left: auto; margin-right: auto; display: block;" />

### Introduction

There are basically two different ways of implementing server side authentication for apps with a frontend and an API:

* The most adopted one, is **Cookie-Based Authentication** (you can find an example [here](http://frederiknakstad.com/authentication-in-single-page-applications-with-angular-js/)) that uses server side cookies to authenticate the user on every request.

* A newer approach, **Token-Based Authentication**, relies on a signed token that is sent to the server on each request.

<!-- more -->

### Token based vs. Cookie based

The following diagram explains how both of these methods work.

<a target="_new" href="https://docs.google.com/drawings/d/1wtiF_UK2e4sZVorvfBUZh2UCaZq9sTCGoaDojSdwp7I/edit?usp=sharing"><img src="https://dl.dropboxusercontent.com/u/21665105/cookie-token-auth.png" alt="cookie-based vs. modern token-based auth"></a>

What are the benefits of using a token-based approach?

* **Cross-domain / CORS**: cookies + CORS don't play well across different domains. A token-based approach allows you to make AJAX calls to any server, on any domain because you use an HTTP header to transmit the user information.
* **Stateless (a.k.a. Server side scalability)**: there is no need to keep a session store, the token is a self-contanined entity that conveys all the user information. The rest of the state lives in cookies or local storage on the client side.
* **CDN**: you can serve all the assets of your app from a CDN (e.g. javascript, HTML, images, etc.), and your server side is just the API.
* **Decoupling**: you are not tied to a particular authentication scheme. The token might be generated anywhere, hence your API can be called from anywhere with a single way of authenticating those calls.
* **Mobile ready**: when you start working on a native platform (iOS, Android, Windows 8, etc.) cookies are not ideal when consuming a secure API (you have to deal with cookie containers). Adopting a token-based approach simplifies this a lot.
* **CSRF**: since you are not relying on cookies, you don't need to protect against cross site requests (e.g. it would not be possible to `<iframe>` your site, generate a POST request and re-use the existing authentication cookie because there will be none).
* **Performance**: we are not presenting any hard perf benchmarks here, but a network roundtrip (e.g. finding a session on database) is likely to take more time than calculating an [`HMACSHA256`](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code) to validate a token and parsing its contents.
* **Login page is not an special case**: If you are using [Protractor](https://github.com/angular/protractor) to write your functional tests, you don't need to handle [any special case for login](https://github.com/angular/protractor/issues/51).
* **Standard-based**: your API could accepts a standard [JSON Web Token](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token) (JWT). This is a standard and there are multiple backend libraries ([.NET](https://www.nuget.org/packages?q=JWT), [Ruby](http://rubygems.org/search?utf8=%E2%9C%93&query=jwt), [Java](https://code.google.com/p/jsontoken/), [Python](https://github.com/davedoesdev/python-jwt), [PHP](https://github.com/firebase/php-jwt)) and companies backing their infrastructure (e.g. [Firebase](https://www.firebase.com/docs/security/custom-login.html), [Google](https://developers.google.com/accounts/docs/OAuth2ServiceAccount#overview), [Microsoft](https://github.com/MSOpenTech/AzureAD-Node-Sample/wiki/Windows-Azure-Active-Directory-Graph-API-Access-Using-OAuth-2.0)). As an example, [Firebase](https://www.firebase.com/docs/security/custom-login.html) allows their customers to use any authentication mechanism, as long as you generate a JWT with certain pre-defined properties, and signed with the shared secret to call their API.

>  What's JSON Web Token? **JSON Web Token** (**JWT**, pronounced *jot*) is a relatively new token format used in space-constrained environments such as HTTP Authorization headers. *JWT* is architected as a method for transferring security [*claims based*](http://en.wikipedia.org/wiki/Claims-based_identity) between parties.

## Implementation

Asuming you have a node.js app, below you can find the components of this architecture.

### Server Side

Let's start by installing `express-jwt` and `jsonwebtoken`:

    $ npm install express-jwt jsonwebtoken

Configure the express middleware to protect every call to `/api`.

    var expressJwt = require('express-jwt');
    var jwt = require('jsonwebtoken');

    // We are going to protect /api routes with JWT
    app.use('/api', expressJwt({secret: secret}));

    app.use(express.json());
    app.use(express.urlencoded());

The angular app will perform a POST through AJAX with the user's credentials:

    app.post('/authenticate', function (req, res) {
      //TODO validate req.body.username and req.body.password
      //if is invalid, return 401
      if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
        res.send(401, 'Wrong user or password');
        return;
      }

      var profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
      };

      // We are sending the profile inside the token
      var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

      res.json({ token: token });
    });

GET'ing a resource named `/api/restricted` is straight forward. Notice that the credentials check is performed by the `expressJwt` middleware.

    app.get('/api/restricted', function (req, res) {
      console.log('user ' + req.user.email + ' is calling /api/restricted');
      res.json({
        name: 'foo'
      });
    });

### Angular Side

The first step on the client side using AngularJS is to retrieve the JWT Token. In order to do that we will need user credentials. We will start by creating a view with a form where the user can input its username and password.

    <div ng-controller="UserCtrl">
      <span>{{message}}</span>
      <form ng-submit="submit()">
        <input ng-model="user.username" type="text" name="user" placeholder="Username" />
        <input ng-model="user.password" type="password" name="pass" placeholder="Password" />
        <input type="submit" value="Login" />
      </form>
    </div>

And a controller where to handle the submit action:

    myApp.controller('UserCtrl', function ($scope, $http, $window) {
      $scope.user = {username: 'john.doe', password: 'foobar'};
      $scope.message = '';
      $scope.submit = function () {
        $http
          .post('/authenticate', $scope.user)
          .success(function (data, status, headers, config) {
            $window.sessionStorage.token = data.token;
            $scope.message = 'Welcome';
          })
          .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;

            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
          });
      };
    });

Now we have the JWT saved on `sessionStorage`. If the token is set, we are going to set the `Authorization` header for every outgoing request done using `$http`. As value part of that header we are going to use `Bearer <token>`.

> `sessionStorage`: Although is not supported in all browsers (you can use a [polyfill](https://github.com/inexorabletash/polyfill/blob/master/storage.js)) is a good idea to use it instead of cookies (`$cookies`, `$cookieStore`) and `localStorage`: The data persisted there lives until the browser tab is closed.

    myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },
        response: function (response) {
          if (response.status === 401) {
            // handle the case where the user is not authenticated
          }
          return response || $q.when(response);
        }
      };
    });

    myApp.config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    });

After that, we can send a request to a restricted resource:

    $http({url: '/api/restricted', method: 'GET'})
    .success(function (data, status, headers, config) {
      console.log(data.name); // Should log 'foo'
    });

The server logged to the console:

    user foo@bar.com is calling /api/restricted

The [source code is here](https://github.com/auth0/angular-token-auth) together with an AngularJS seed app.

### What's next?

In upcoming posts we will revisit:

* How to handle social authentication?
* How to handle session expiration?

<h3 style="color: rgb(255, 90, 136)"> UPDATE: we published two new blog posts</h3>

* [Token based authentication in realtime frameworks like Socket.io](/2014/01/15/auth-with-socket-io/)
* [10 Things you should know about Tokens](/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/)


### Bottom Line

When building Single Page Applications, consider using a token-based authentication design over cookie-based authentication. Leave a comment or [discuss on HN](https://news.ycombinator.com/item?id=7018529).

### Aside: how it works with Auth0?

Auth0 issue **JSON Web Tokens** on every login. That means that you can have a solid identity infrastructure, including **Single Sign On**, **User Management**, support for **Social**, **Enterprise** and **your own database** of users with just a few lines of code. We implemented a tight integration with Angular: <https://github.com/auth0/auth0-angular>

<a href="https://docs.google.com/a/auth10.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/edit"><img src="https://docs.google.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/pub?w=1219&amp;h=559" style="border: 1px solid #ccc;padding: 10px;"></a>

More about Auth0 and Angular: <https://github.com/auth0/auth0-angular>
