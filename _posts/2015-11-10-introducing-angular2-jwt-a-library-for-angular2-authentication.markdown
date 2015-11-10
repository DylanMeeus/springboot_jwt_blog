---
layout: post
title: "Introducing angular2-jwt: A Library for Angular 2 Authentication"
description: "Learn about what's new with Angular 2 authentication and how to use angular2-jwt to make it easier."
date: 2015-11-10 16:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image_bg_color: "linear-gradient(#0143A3,#0273D4)"
  bg_color: "#7C161E"
  image: https://cdn.auth0.com/blog/angular2-series/angular2-logo.png
  image_size: "70%"
  blog_series: true
tags: 
- angular2
- angularjs
- observables
- http
- javascript
- jwt
- post-series
---

---
**TL;DR:** We've just released **[angular2-jwt](https://github.com/auth0/angular2-jwt)**, an open-source library for working with JWTs in Angular 2. With it, you can do authenticated HTTP requests, check the user's JWT, and more. Read on for more details, or check out the [repo](https://github.com/auth0/angular2-jwt).

---

We're big fans of Angular and OSS at Auth0, and that's why we've contributed packages that make it easier to work with JWTs in Angular. For Angular 1.x, we have **[angular-jwt](https://github.com/auth0/angular-jwt)**, a generic library that lets you decode JWTs, send one on every HTTP request, and easily handle refresh tokens.

Naturally, we wanted to provide the same package for Angular 2. Even though Angular 2 is still in alpha, we wanted to create a package early on to help the community get going with JWT authentication as soon as possible. Today we announce **[angular2-jwt](https://github.com/auth0/angular2-jwt)**, an Angular 2 JWT helper library.

## How is Angular 2 Authentication Different from Angular 1.x?

If you've handled JWTs in Angular 1.x, you're likely accustomed to things like HTTP interceptors. These allow us to intercept requests and responses so we can do things like attach an `Authorization` header that has the token.

Although the **Http** API for Angular 2 is still in flux, the team has noted that they're moving away from a global interceptor model; instead, composition will be favored. This means that as opposed to setting up a mechanism for attaching an `Authorization` header globally, there should be some way of doing it on a per-request basis. For that, we've created the `AuthHttp` class.

## Basic Setup

```bash
npm install angular2-jwt
```

If you're using **SystemJS**, you can `map` to `angular2-jwt` in your configuration.

```html
  <!-- index.html -->

  <script>
  System.config({
    defaultJSExtensions: true,
    map: {
      "angular2-jwt": "node_modules/angular2-jwt"
    }
  });
  </script>
```

## Using AuthHttp for Authenticated Requests

It should be noted that **angular2-jwt** makes no assumptions about how you authenticate your users. If you're using Auth0, though, we've got an [example](https://github.com/auth0/auth0-angular2) of how it can be done in just a few lines of code.

The `AuthHttp` class lets you send any HTTP request with an authentication header atttached. The class wraps regular HTTP requests and is injected and accessed in much the same way as `Http`.

> Note: These examples assume you have a user's JWT saved.

```js
// app.ts

import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';

...

class App {

  thing: string;

  constructor(public authHttp:AuthHttp) {}

  getThing() {
    this.authHttp.get('http://example.com/api/thing')
      .map(res => res.json())
      .subscribe(
        data => this.thing = data,
        err => console.log(error),
        () => console.log('Request Complete')
      );
  }
}

bootstrap(App, [
  HTTP_PROVIDERS,
  provide(AuthHttp, { useFactory: () => {
    return new AuthHttp()
  }})
])
```

With the `AuthHttp` class, we use `this.authHttp.get` instead of `this.http.get`. The response is still an observable that can be subscribed to. When we bootstrap the application, we provide `AuthHttp` with `useFactory`. This is useful for when we want to supply our own configuration for the class.

The class has the following defaults:

* Header Name: `Authorization`
* Header Prefix: `Bearer`
* Token Name: `id_token`
* Token Getter Function: `(() => localStorage.getItem(tokenName))`
* Error thrown if no JWT is saved: `true`

We can override any of these with anything we want. To do so, just pass a config object when the class is instantiated.

```
// app.ts

...

bootstrap(App, [
  HTTP_PROVIDERS,
  provide(AuthHttp, { useFactory: () => {
    return new AuthHttp({
      headerName: YOUR_HEADER_NAME,
      headerPrefix: YOUR_HEADER_PREFIX,
      tokenName: YOUR_TOKEN_NAME,
      tokenGetter: YOUR_TOKEN_GETTER_FUNCTION,
      noJwtError: true 
    })
  }})
])
```

An error is thrown by default if there is no JWT saved, or if it's invalid. If you'd rather have a regular HTTP request go through when an invalid JWT is encountered, you can set `noJwtError` to `true`.

Using an explicit `AuthHttp` request is nice because we can use it in tandem with regular `Http`. If we have requests that we know will never require authentication, we can use `Http` instead.

## Handling Routing in Angular 2

We'll often find ourselves needing to protect certain routes from unauthenticated users. Even though our data from the API will be safe since a valid JWT is required to access it, unless we put some blocks in place, users will still be able to navigate to routes that are designated for authenticated users only.

In Angular 1.x, if we use UI Router, we might put a property on our route declarations that says a given route requires authentication. Angular 2's Router gives us some lifecycle hooks that are useful for tapping into various events along the routing pipeline. One of these hooks is called `CanActivate` and it is fired **before** a route is navigated to and its component class is instantiated. This is the perfect hook for checking whether the user has a valid JWT.

```js
// app.ts

...

import {Component, View, bootstrap, provide} from 'angular2/http';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {RouteConfig, RouteParams, ROUTER_DIRECTIVES, APP_BASE_HREF, ROUTER_PROVIDERS, CanActivate} from 'angular2/router'

@Component({
  selector: 'secret-route'
})

@View({
  template: `<h1>If you see this, you have a JWT</h1>`
})

@CanActivate(() => tokenNotExpired())

class SecretRoute {}
```

In this example, we have a route that we want protected called **secret-route**. By putting the `@CanActivate` annotation before the class declaration, we can tell Angular whether or not the route should be accessed. The annotation is looking for a `boolean` to determine navigation, and that's what is given with the `tokenNotExpired` function. The function checks whether there is a JWT saved, and if there is, whether it is valid.

## Accessing the JwtHelper Class

The library includes a class called `JwtHelper` which is used for things like decoding tokens and checking validity. This is the class that is used by `tokenNotExpired`, but we can use it directly in our components too. These methods might be useful for doing things such as finding the user's information from the JWT payload.

```js
// app.ts

...

jwtHelper: JwtHelper = new JwtHelper();

...

useJwtHelper() {
  var token = localStorage.getItem('id_token');

  console.log(
    this.jwtHelper.decodeToken(token),
    this.jwtHelper.getTokenExpirationDate(token),
    this.jwtHelper.isTokenExpired(token)
  );
}

...
```

## Using JWTs as Observable Streams

Angular 2's `Http` returns an observable, and thus `AuthHttp` does as well. Since we're going to be seeing a lot more use of observables in the framework, it would be useful to have a way to use our JWT as an observable stream. For that, `AuthHttp` gives you a `tokenStream`. This stream can be subscribed to and will be useful if you want to combine it with other streams that do HTTP requests. The details of how you put it to use are up to you.

```js
// app.ts

tokenSubscription() {
  this.authHttp.tokenStream.subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('Complete')
    );
}
```

## Aside: Angular 2 Authentication with Auth0 with angular2-jwt

Using Auth0 with **angular2-jwt** is easy. The first step is to bring in Auth0's Lock widget.

```html
 <!-- index.html -->

 <!-- Auth0 Lock script and AngularJS module -->
 <script src="//cdn.auth0.com/js/lock-7.9.min.js"></script>
```

Next, we just need to put in some simple controls for logging in and out.

```js
// app.ts

...

@Component({
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, NgIf ],
  selector: 'app',
  template: `
    <h1>Welcome to Angular2 with Auth0</h1>
    <button *ng-if="!loggedIn()" (click)="login()">Login</button>
    <button *ng-if="loggedIn()" (click)="logout()">Logout</button>
  `
})

export class AuthApp {

  lock: Auth0Lock = new Auth0Lock(YOUR_CLIENT_ID, YOUR_CLIENT_DOMAIN);

  constructor() {}

  login() {
    this.lock.show(function(err, profile, id_token) {

      if(err) {
        throw new Error(err);
      }

      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', id_token);

    });
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }

}

...
```

When the user clicks the **Login** button, they will be shown the Lock widget.

![auth0 lock angular2](https://cdn.auth0.com/blog/node-knockout/node-knockout-1.png)

Once the user authenticates, their profile and JWT will be saved in local storage. Logging out is then simply a matter of removing those items.

Already excited about implementing this? <a href=“javascript:signup()”>Sign up</a> for your free Auth0 account!

## Wrapping Up

Handling JWTs in Angular 2 just became a little bit easier with **[angular2-jwt](https://github.com/auth0/angular2-jwt)**. It saves us time and code by abstracting away all the details involved with setting headers for requests. We can also do useful things like check the user's authentication status, which is helpful for determining whether or not we should let them navigate to particular routes.

We hope this package is useful for your Angular 2 apps. We also welcome pull requests! Feel free to [contribute](https://github.com/auth0/angular2-jwt) to make this module even better.
