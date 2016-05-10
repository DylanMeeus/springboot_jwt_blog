---
layout: post
title: "5 Steps to Add Modern Authentication to Legacy Apps Using JWTs"
description: "Conventional authentication is challenging for today's web applications. Learn about the reasons and how to use JSON Web Tokens (JWT) for modern authentication."
date: 2015-09-28 13:00
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image: //cdn.auth0.com/blog/jwt/logo-400.png
  image_bg_color: "#000"
  bg_color: "#000"
  image_size: "170%"
tags: 
- authentication
- jwt
- javascript
- nodejs
- modern authentication
- legacy apps
- cookie authentication
related:
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
- 2016-02-02-switching-from-social-logins-to-saml-in-minutes-with-auth0
- 2016-04-05-quicktip-use-jhipster
---

---

**TL;DR:** Traditional session-based authentication with cookies presents difficulties, especially for modern web applications. We can instead use JSON Web Tokens (JWT), which make our apps stateless. Migrating a legacy app over to JWT authentication can be done piece by piece, and if we need to, we can use cookies to handle JWTs. To see how this is done, take a look at the [repo](https://github.com/auth0/cookie-jwt-auth) for this tutorial.

---
Authentication for web applications has historically been fairly straightforward and followed a common pattern, but this has been changing significantly in recent years. There are several reasons for these changes, and the prominent ones are related to the way in which modern applications are built and distributed.  In this article, we'll see how things have changed and also some ways we can adapt legacy applications to modern day practices.

## Traditional Web Applications

In a general sense, traditional websites and applications typically implement user authentication using **sessions** and **cookies**. When a user logs in to a site, his or her username and password are matched against database entries. If the login is successful, the server saves the user's authentication state in memory and sends a cookie back in the reponse that contains some data, which in most cases includes the user's ID. Browsers will save the cookie for the domain from which it came and then automatically send it back when subsequent requests are made. For example, if a cookie is saved with a domain of auth0.com, it will be sent back on any future request to auth0.com as long as it is valid. This works great for traditional web apps.

![modern authentication jwt](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-1.png)

Even though we've labeled the process described above as being "traditional", it should be noted that *most* of the web still operates this way. While this approach is still perfectly valid for a lot of use cases, we're going to explore some of the reasons why relying on it has become challenging for modern web applications.

## Authentication Challenges for Modern Web Apps

Modern web applications present a few challenges for authentication that are difficult to solve using conventional methods. The reasons for this have to do with how applications are crafted and the environment in which applications reside.

### 1. Apps are distributed across many servers

Many of today's applications aren't deployed the same way they were in the past. It is now very common--and often necessary--for apps to be distributed across many servers so that up-time is increased and latency issues are mitigated. With this comes the side effect that, when a user accesses an application, it is no longer guaranteed that they are always accessing the same server. 

Since traditional authentication relies on the server to keep the user's authentication state in memory, things break down when the app is accessed from different servers. The user might be logged in on one server but not on the others that the application is distributed across.

We can get around this by using methods like [**sticky sessions**](http://stackoverflow.com/questions/10494431/sticky-and-non-sticky-sessions). A sticky session will essentially route the user to the server instance from which they logged in so that the authentication state can be presevered. This type of workaround will do the job, but as we'll see, stateful servers in general don't play that well with modern applications.

### 2. Apps use APIs for data

A common pattern for modern applications, especially single-page apps, is to retrieve and consume JSON data from a [RESTful API](http://www.restapitutorial.com/). Serving data from an API has several distinct advantages, one of them being the ability for data to be used in more than just one application. For example, an organization might start with the intent to build an internally facing application, but may soon realize that some of its functionality could be used in a public-facing app. Down the road, the organization might also decide that some of its data should be accessible by other application developers to build third-party apps with. This can all be made possible with an API.

Using APIs in this fashion is great, but things can become challenging when it comes to authentication. The traditional approach of using sessions and cookies for the user's identity doesn't work so well in these cases because their use introduces **state** to the application. One of the tenets of a RESTful API is that it should be **stateless**, meaning that, when a request is made, a response within certain parameters can always be anticipated without side effects. A user's authentication state introduces such a side effect, which breaks this principle. Keeping the API stateless and therefore without side effect means that maintainability and debugging are made much easier.

Another challenge here is that it is quite common for an API to be served from one server and for the actual application to consume it from another. To make this happen, we need to enable [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). Since cookies can only be used for the domain from which they originated, they aren't much help for APIs on different domains than the application.

### 3. Apps rely on downstream services

Another common pattern seen with modern web applications is that they often rely on downstream services. For example, a call to the main application server might make a request to a downstream server before the original request is resolved. The issue here is that cookies don't "flow" easily to the downstream servers and can't tell those servers about the user's authentication state. Since each server has its own scheme for cookies, there is a lot of resistance to flow, and connecting to them is difficult. 

## A Modern Alternative: The JSON Web Token (JWT)

To combat the issues detailed above, we can take a token-based approach by using JSON Web Tokens (JWTs) for authentication. A JWT contains three parts:

**1. Header**

The header tells us about the algorithm and token type. It is Base64URL encoded.

**2. Payload**

The payload contains any arbitrary information in the form of claims that we as developers find useful for our applications. The user's ID must be sent as a `sub` claim, but we can also send other useful information, such as the username, email, and more. The payload is also Base64URL encoded.

**3. Signature**

The signature is used to verify the authenticity of the JWT. There are several different algorithms that can be used for the signature. Some algorithms implement a shared secret (HMAC), and others use public-private key secrets (RSA).

![modern authentication jwt](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-5.png)

From the user's perspective, logging in to an application that uses JWTs looks much like traditional authentication. The user enters his or her credentials as usual, but instead of the server creating a session and returning a cookie, it will respond with a JSON object that contains a JWT. The JWT then needs to be saved locally, which is normally done with local storage. However, as we'll see in the next section, it is possible to save the JWT in a cookie.

The JWT must be sent to the server to access protected routes, and it is typically sent as an `Authorization` header. The scheme used for this header is `Bearer`, so the full header looks like this:

```js
Authorization: Bearer <token>
```

Middleware on the protected API routes will check for a valid JWT, and if there is one, it will let the request through and return the data being requested. Since the user's information is contained within the JWT itself, there is no need to look the user up in a database, so there is less latency in the application.

It should be reiterated that the user's state is never saved in memory on the server, meaning that the user isn't "logged in" in the conventional sense. However, a valid JWT gives the user the keys to access data each time a request is made, and in this way, a stateless authentication mechanism is in place.

![](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-2.png)

Using a JWT for authentication helps to solve the challenges noted above. We can fully rely on data APIs that are stateless and even make requests to downstream services. Since JWT is a specification [implemented nearly everywhere](http://jwt.io), connecting to downstream services built on a stack other than our own is easy. It also doesn't matter which domain is serving our API, nor does it matter which specific server a request goes to if the app is deployed across many.


## Bridging the Gap: Using JWTs in Cookies

Modernizing legacy applications by implementing token-based authentication can lead to many gains. If it isn't feasible for an organization to totally throw away cookies, there are still ways to make token authentication viable. Let's take a look at how this can be done with NodeJS and the **express-jwt** package.

### Step 1: Set Up a Back End

To follow along, you can download Auth0's [NodeJS seed project](https://auth0.com/docs/node-auth0/master/create-package?path=examples/nodejs-api&filePath=&type=server) from the [docs page](https://auth0.com/docs/quickstart/backend/nodejs/). Even though we're using an Auth0 seed project here, doing cookie-based authentication in this way will work with any service.

### Step 2: Install Cookie Parser

Once the dependencies for the seed project are installed by following the [installation steps](https://github.com/auth0/node-auth0/tree/master/examples/nodejs-api), we'll need to add one more package: **cookie-parser**. This package will allow us to read JWTs from cookies that are sent to the server.

```bash
npm install cookie-parser --save
```

With **cookie-parser** installed, we now need to require and use it in `server.js`.

```js
// server.js

...

var cookieParser = require('cookie-parser');

...

app.configure(function() {
  
  app.use(cookieParser());

  ...

});
```

### Step 3: Save the JWT as a Cookie

We'll need to retrieve a JWT for a user and save it locally as a cookie. If you're using Auth0 for this tutorial, you can find out more about retrieving JWTs for users in your Auth0 account by reading the [API documentation](https://auth0.com/docs/api/v2). We'll use jQuery in this example to make the AJAX calls easy.

Lets make a call to Auth0 to get a JWT.

```js
// app.js

$('.btn-login').click(function() {
  $.ajax({
    type: 'POST',
    url: 'https://{your-auth0-account}.auth0.com/oauth/ro',
    data: {
      client_id: '{your-client-id}',
      username: document.querySelector('#username').value,
      password: document.querySelector('#password').value,
      grant_type: 'password',
      scope: 'openid',
      connection:'Username-Password-Authentication'
    },
    success: function(data) {
      getJwtCookie(data.id_token);
    },
    error: function(error) {
      console.log('There was an error: ' + error)
    }

  });
});
```

In the success handler, we're calling a function called `getJwtCookie` and passing in the token that was received from Auth0. We need to create an endpoint on our application server that can validate the JWT that was received from Auth0 and send it back to us as a cookie, and we can do that in the `getJwtCookie` function.

```js
// app.js

function getJwtCookie(token) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3001/secured/authorize-cookie',
    data: {
      token: token
    },
    headers: {
      'Authorization' : 'Bearer ' + token
    },
    success: function() {
      console.log('Cookie received!');
    },
    error: function() {
      console.log('Problem with cookie');
    }
  });
}

```
Next, lets set up the `authorize-cookie` endpoint to handle this call.

```js
// server.js

app.post('/secured/authorize-cookie', authenticate, function(req, res) {
  res.cookie('id_token', req.body.token, { 
    expires: new Date(Date.now() + 36000),
    httpOnly: true 
  });
  res.send(200, { message: 'Cookie set!' });
});
```

In the next step, we'll set up our **express-jwt** middleware, but we're making use of it already in the `authorize-cookie` route by passing it in as the second argument, `authenticate`. The middleware secures the endpoint and a valid JWT will be needed to access it. If the JWT is valid, we simply reflect it back as a cookie and set the `httpOnly` flag to `true` so that the cookie can only be accessed by the server. This route accomplishes the steps of validating the JWT that was received from Auth0, as well as the step of setting a cookie with the JWT.

**Note:** We are using an `Authorization` header to accomplish our cookie JWT in this example. This is the only place we would need to make a request using this header--the rest of the application will handle JWTs with cookies.

### Step 4: Set Up Middleware to Check for the Cookie
Normally, the **express-jwt** middleware will look for the presence of a header and retrieve the JWT from there. However, we can also create a custom function to define how the token should be retrieved.

```js
// server.js

...

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID,
  // Custom function to retrieve the JWT
  // We first look for the JWT in a header and if it isn't there,
  // we look for it in a cookie
  getToken: function fromHeaderOrCookie(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if(req.cookies && req.cookies.id_token) {
      return req.cookies.id_token;
    }
    return null;
  }
});

...
```

We've added the `getToken` function as an option on the object that is passed into `jwt`. Our implementation here says that we want to first look for the presence of a JWT as an `Authorization` header, and if there isn't anything there, we want to check whether there is a cookie with the name `id_token`.

### Step 5: Test the Secured Route

With the `id_token` cookie in place, we can see that requests to the `secured/ping` endpoint go through just fine.

![modern authentication jwt](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-3.png)

## Aside: JWT Authentication Is Easy with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [Single Sign On](https://auth0.com/docs/sso/single-sign-on), User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. Auth0 is perfect for [Single Page Applications](https://auth0.com/docs/sequence-diagrams) and very easy to set up.

As we saw in this tutorial, switching to JWT authentication from traditional session-based authentication is very easy, and there are many advantages to doing so. Using Auth0 for JWT authentication makes the process of switching to JWT authentication even easier. If you'd like to see how Auth0 can be used in your legacy application, feel free to [get in touch](mailto:support@auth0.com)-we're here to help!

## Wrapping Up

As we've seen, modern web applications are crafted and deployed in ways that make conventional user authentication challenging. JWT authentication is an excellent way to get around these challenges and allows us to keep our application server stateless. If we need to lean on old practices, such as using cookies, we can do so and still support JWT authentication with a little tweaking on the server.


