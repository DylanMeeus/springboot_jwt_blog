---
layout: post
title: "Handling JWTs on Angular is finally easier!"
date: 2014-10-01 18:51
outdated: true
author:
  name: Martin Gontovnikas
  url: https://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764?size=200
tags:
- angularjs
- jwts
- interceptor
- $http
---

Following our blog post about [how to use JWTs on AngularJS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/#comment-1506375766), we've decided to go one step further to make this simpler.

**We've created a library called [angular-jwt](https://github.com/auth0/angular-jwt)** to handle some of the common problems that arise when dealing with JWTs. We'll soon be using this library in our own [Angular SDK](https://github.com/auth0/auth0-angular) to handle JWTs as well.

Throughout this article we'll go over some of the common questions asked by our customers that we aim to solve with [angular-jwt](https://github.com/auth0/angular-jwt).

<!-- more -->

### How do you get the information (claims) from a [JWT](http://jwt.io/)?

As you know, a [JWT](http://jwt.io/) is a token that's not opaque, thus it has information. To get that information, you can use the following code:

````js
angular.module('app', ['angular-jwt'])
.controller('Controller', function Controller(jwtHelper) {
  var aToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQXV0aDAiLCJleHAiOjE0MTIyMzQ3MzB9.ZJzxkw4DNohrdk209erOGyVhfZiAQTRLHMR0BuNUuBA';

  var tokenPayload = jwtHelper.decodeToken(aToken);
})
````


> **Note**: You can try this out online in this [JSFiddle](http://jsfiddle.net/mgonto/s4tkms31/)

### How can I check if a JWT has expired?

Most JWTs will eventually [expire](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#expDef). In order to know when and if a token is expired you can use the following code:

````js
angular.module('app', ['angular-jwt'])
.controller('Controller', function Controller(jwtHelper) {
  var aToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQXV0aDAiLCJleHAiOjE0MTIyMzQ3MzB9.ZJzxkw4DNohrdk209erOGyVhfZiAQTRLHMR0BuNUuBA';

  var expireDate = jwtHelper.getTokenExpirationDate(aToken);
  var isExpired = jwtHelper.isTokenExpired(aToken);
});
````


> **Note**: You can try this out online in this [JSFiddle](http://jsfiddle.net/mgonto/w588gy87/)

### How can I send the JWT on every request to the server?

Once you have the JWT, you want to send it to the server on every request in the `Authorization` header. For that, you can use the following code:

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function() {
    return localStorage.getItem('JWT');
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // If localStorage contains the id_token it will be sent in the request
  // Authorization: Bearer [yourToken] will be sent
  $http({
    url: '/hi',
    method: 'GET'
  });
}
````

> **Note**: You can try this out online in this [JSFiddle](http://jsfiddle.net/mgonto/dqo5q2xn/)

### How do I refresh a token that expired?

As we've covered in the previous question, JWTs expire. Once a JWT expire, if you send it to the server, you'll get a 401 Status Code.

However, you can use [refresh tokens](https://docs.auth0.com/refresh-token) to get a new (not expired) JWT from your server. For that, you can use a [delegation endpoint](https://docs.auth0.com/auth-api#post--delegation).

This is how you'd accomplish that with `angular-jwt`:


````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http) {
    var jwt = localStorage.getItem('JWT');
    var refreshToken = localStorage.getItem('refresh_token');
    if (jwtHelper.isTokenExpired(jwt)) {
      // This is a promise of a JWT id_token
      return $http({
        url: '/delegation',
        // This will not send the JWT for this call
        skipAuthorization: true,
        method: 'POST',
        refresh_token : refreshToken
      }).then(function(response) {
        localStorage.setItem('JWT', response.data.jwt);
        return jwt;
      });
    } else {
      return jwt;
    }
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // Authorization: Bearer [yourToken] will be sent.
  // That token might be a new one which was got from the refresh token
  $http({
    url: '/hi',
    method: 'GET'
  });
})
````

> **Note**: You can try this out online in this [JSFiddle](http://jsfiddle.net/mgonto/my5dgktj/)

These are only some of the things that you can do with [angular-jwt](https://github.com/auth0/angular-jwt).

Now, add angular-jwt to your `bower.json` or `package.json` and start hacking!
