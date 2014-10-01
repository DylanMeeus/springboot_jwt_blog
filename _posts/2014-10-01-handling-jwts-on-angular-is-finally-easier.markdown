---
layout: post
title: "Handling JWTs on Angular is finally easier!"
date: 2014-10-01 18:51
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

Following our blog post about [how to use JWTs on AngularJS](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/#comment-1506375766), we've decided to take one step further to make this simpler.

**We've created a library called [angular-jwt](https://github.com/auth0/angular-jwt)**. We'll soon be using this library in our own [auth0-angular](https://github.com/auth0/auth0-angular) to handle JWTs as well.

### Let's get our hands dirty

Now that we've finished the introduction, let's actually get our hands dirty and let's improve the code we've created in the previous blog post.

As a reminder, we had 2 main endpoints in our server:

* **`/authenticate`**: It receives a user and returns a [JWT](http://jwt.io/). It authenticates the user.
* **`/api/restricted`**: It returns a text if the user is authenticated (sends the JWT correctly).

Now, we're also making our `/authenticated` endpoint return a **[Refresh Token](http://docs.auth0.com/refresh-token)** as well. JWTs expire at some point in time. **A refresh token can be used to get a new JWT after the original one expires**.

So, first, let's authenticate the user:

````js
myApp.controller('UserCtrl', function ($scope, $http, $window) {
  $scope.user = {username: 'john.doe', password: 'foobar'};
  $scope.message = '';
  $scope.submit = function () {
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $window.sessionStorage.refreshToken = data.refreshToken;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.refreshToken;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
});
````

Please notice that we're saving the `JWT` and the `refreshToken` on `sessionStorage` so that we can send it to the protected API then. We'll now use `angular-jwt` to take care of that:

````js
myApp.config(function(jwtInterceptorProvider, $httpProvider) {
  jwtInterceptorProvider.tokenGetter = function($window, jwtHelper, $http) {

    var token = $window.sessionStorage.token;
    if (token && !jwtHelper.isTokenExpired(token)) {
      // If we have the token in the session and it's not expired
      // we'll send that to the server
      return token;
    } else {
      var refreshToken = $window.sessionStorage.refreshToken;
      if (!refreshToken) {
        // If we don't have a refresh token, that's it. We're not authenticated
        return null;
      } else {
        // We can return a promise here.
        // Therefore, we're returning a promise of a new JWT that we'll get
        return $http({
          url: '/api/delegation',
          refresh_token: refreshToken,
        }).then(function(data) {
          // We store the new JWT for the next time
          $window.sessionStorage.token = data.token;
          return data.token;
        });
      }
    }
  }

  // We add the JWT interceptor which will send the header
  $httpProvider.interceptors.push('jwtInterceptor');
});
````

With this, we've configured our JWT Interceptor to send the `Authorization` header with the JWT. If we have a JWT saved and it's not expired, we'll send that one to the server. Otherwise, we'll get a new JWT by calling the `/delegation` endpoint with our Refresh Token.

Now, we can just code the call to the restricted API.

````js
$http({url: '/api/restricted', method: 'GET'})
.success(function (data, status, headers, config) {
  console.log(data.name); // Should log 'foo'
});
````

That's it :).

Now you're using JWTs to authenticated and to call your API as well as Refresh Tokens to never show the Login Window again to your users. Congrats!

**Now, add [angular-jwt](https://github.com/auth0/angular-jwt) to your `bower.json` or `package.json` and start hacking!**



