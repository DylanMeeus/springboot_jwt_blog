---
layout: post
title: "Understanding Angular 2 change detection"
description: "Angular 2 introduces a new change detection system that makes apps much faster and allows developers fine-tune the process."
date: 2016-09-23 8:30
author:
  name: "Wojciech Kwiatek"
  url: "https://twitter.com/WojciechKwiatek"
  mail: "wojtek.kwiatek@gmail.com"
  avatar: "https://en.gravatar.com/userimage/102277541/a28d70be6ae2b9389db9ad815cab510e.png?size=200"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- angularjs
- change-detection
- performance
- immutable
related:
- introducing-angular2-jwt-a-library-for-angular2-authentication
- create-a-desktop-app-with-angular-2-and-electron
- creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between

---

---

**TL;DR** Angular 2 introduces a reinvented change detection system that drops digest cycles in favor of one-way flow. Additionally, change detection can now be controlled and fine-tuned by developers to get the most of the framework's performance.

---

## Introduction to Change Detection
Angular 2 final has been released. You've probably heard about some of the changes due to the major version bump: it's has been completely rewritten, TypeScript was selected as the language of choice, reinvented forms, RxJS, a completely new router, etc. In my opinion, the most valuable thing is the redesign of the core change detection system. As you may remember, the digest loop performance of AngularJS (aka Angular 1) was problematic. Now it's not.

### Why Do We Need Change Detection?
Why bother? Generally, the power of modern JavaScript frameworks works something like this: an event changes in the model and forcing a change in the UI. This is change detection, the system that monitors events and acts on them. Something has to trigger this propagation to the view. As mentioned before, in Angular 1 we had digest loops that checked every single reference that was set to be watched for value changes. When Angular found out that everything was stable (no infinite loops, etc.), it propagated changes to the view. Although this was not efficient, it worked for a long time. Also, the problem was tracking asynchronous events. You also probably used `$scope.$apply(...)` if you worked with Angular 1. To understand why it was needed, let's start from the beginning.

### How Javascript works
The JavaScript runtime works on a single threaded engine. You've probably heard about the stack (possibly from other programming languages). Let's take the code below:

```js
console.log('Hey')
setTimeout(() => {
   console.log('Hello from timeout!')
}, 1000);
console.log('Hi')
```

We'll see this in a console as:

```html
Hey
Hi
Hello from timeout!
```

Moreover, nothing is blocked during the one-second wait period. So how would the JS engine do this with a single thread?

#### Synchronous code
Let's go step by step. If you have code like this:

```js
console.log('1')
console.log('2')
console.log('3')
```

every instruction will be put onto the stack and will run one by one. There's no possibility of seeing 3 before 2 or 1. So we'll end up with the following:

```
1
2
3
```

Every time. Everywhere.

#### Asynchronous code
But let's go back to the timeout:

```js
console.log('1')
setTimeout(() => {
  console.log('2')
}, 0)
console.log('3')
```

What happens now? On the stack, we'll have:

```js
console.log
setTimeout
console.log
```

The trick here is how `setTimeout` works and what it really is. Yes, it will be invoked as a normal synchronous action, but all the JS engine does is give the wheel to something else. There's a bunch of browser APIs that aren't part of this single threaded process. And there's a thing called event loop. This event loop goes one by one through the stack instructions, and if it's empty, it then goes to the *callback queue*. The reference to the `setTimeout` code is there. Once callback is done, the code will go to the stack.

What does it mean? Two things:

- Everything that's inside an asynchronous callback (as in `setTimeout`) will be run *after* any other synchronous code; this is why hacks like `setTimeout(() => {}, 0)` work.
- We have no way of ensuring 1000ms is *exactly* 1000ms (but we know it's at least 1000ms).

For complete understanding of event loop and what's going on in the browser, I encourage you to take a look at this [Philip Roberts talk](https://www.youtube.com/watch?v=8aGhZQkoFbQ).

### How Zones Relate to Change Detection
How does all of this relate to Angular and change detection? Tracking objects with synchronous code is fairly easy. However, when it comes to asynchronous code, things get complicated. That's because Angular 1 forced us to use `$scope.$apply(...)` each time an asynchronous action was made or use the Angular way of doing asynchronous actions: `$timeout`, `$http`, and so on. The thing is, if something was made outside of the controller (even a perfectly valid change to the reference object), Angular didn't know about it, so it didn't fire any event to reflect changes to the UI.

On the other hand, we now have Angular 2. It dropped all of the stuff connected to digest cycles and now uses *Zones*. Zones are able to track the context of asynchronous actions by monkey-patching them (i.e., overwriting them with its own code), which then invokes the desired action but with some additional information attached. This additional information is the context. This way, Angular will know which component the asynchronous action was invoked from.

The big win of this approach is that we can use the browser APIs natively, and Angular will know what's going on without forcing us to manually tell it a change has occured. The drawback is that Zones overwrite asynchronous actions, which is kind of a hacky solution and may affect other (existing) code if we're not relying only on Angular in the app.

But exactly how is Angular notified of the change? Angular uses its own version of the Zone called `NgZone`, which relays finished asynchronous actions with the `onTurnDone` event. Angular change detection waits for the event to perform change detection and checks what needs to be updated in the UI. That's the core behavior.

## Make Use of Change Detection In Your App
Everything described above is going on under the hood. Equally important is how we can make use of it. Unlike Angular 1, Angular 2 gives us the possibility of controlling the change detection. However, the Angular team claims that even without any performance tweaking, it's 3 to 10 times faster than the previous one, and for most apps this will be fast enough. But it can be much faster. Let's look at an example.

<iframe src="https://embed.plnkr.co/HR7ssEuPaWwlVKJPzZtJ/" width="100%" height="800"></iframe>

Here's a very typical problem: rendering a list. There's one component containing a list of other components that have some input data. Generally, we have a container with data and a dumb component just for rendering a single list item. Nothing fancy here, just the getter and `ngOnChange`. What's being done here? `ngOnChange` reacts on every input change, and the getter adds additional logging each time `rowData` are fetched. Note that we're not using it anywhere outside of the template.

This means the getter is fired by Angular itself. And guess what happens? We have a single change on the input, but there are hundreds of getter logs over there.

Why is that?

Angular is notified about the change from some component and has to check how that affects the current state, so it checks all the values for the change. Actually, the team says it can make thousands of such checks in milliseconds, but it's still a waste of time and can even harm our big data-driven application.

### Immutability
The cool thing about the new change detection system is that now we can tune it. Let's take a break from Angular and consider following code:

```js
const users = [{
  name: 'John',
  age: 27
}, {
  name: 'Anna',
  age: 23
}]

users.push({
  name: 'Max',
  age: 30
})
```

The most important thing here is the `const` declaration. If `users` is constant, how can we modify it? Well, that's how JavaScript works! The `const` prevents us from modifying a reference to the particular object in JavaScript. What the `push` method of `Array` is really doing is appending another object to the existing array (with no reference change). Let's go on to another very typical example:

```js
const user = {
  name: 'Max',
  age: 30
}

user.age = 31
```

The same thing applies. Although we can't modify the whole object to make it be another one (reference change), we still can change part of the object!

This is why the checks we discussed before aren't so good. If you want to check whether the object is the same as it was before, you have to *deeply check all of its properties*. It's not efficient.

How can we force the object to be a new one with the changed property? It's actually quite easy with the new [ECMAScript Object spread properties proposal](https://github.com/sebmarkbage/ecmascript-rest-spread):

```js
const user = {
  name: 'Max',
  age: 30
}

const modifiedUser = { ...user, age: 31 }
```

### Change Detection Strategies
The good part about all this is that now we can say to Angular that *we know what we're doing*. To modify the change detection behavior, we can use the `ChangeDetectionStrategy` API, which has one very interesting value: `OnPush`. It makes a component with this strategy applied look at the values inside only when the reference on the input changes or some event has been fired from the component.

Let's add the `OnPush` strategy to our previous example:

```ts
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'row',
  template: `
    <pre>{{ rowData }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {
  ...
}
```

You can try it on Plunker and see the difference.

<iframe src="https://embed.plnkr.co/d9b07qginx7z9hGYyeME/" width="100%" height="800"></iframe>

 The huge improvement is that there's now only one getter call for one change! We didn't need anything more as our input data are strings that are being changed, so that reference on input changes. The reference for the rest of the components hasn't changed, so Angular doesn't even look at it.

### App Structure
How can we build a highly performing app? With Angular 2, it's actually quite easy. As in all of the component frameworks nowadays, you should have dumb and smart components. The dumb components, which are meant only for displaying data from the input or handling user events, are ideal volunteers for having the `OnPush` strategy. Smart components will sometimes require that you watch for more things than the input and the events, so be careful with setting the `OnPush` strategy there.

## Aside: Using Angular 2 with Auth0

Auth0 issues **JSON Web Tokens** on every login for your users. That means that you can have a solid identity infrastructure, including single sign-on, user management, support for social (Facebook, Github, Twitter, etc.), enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

You can add Auth0 to an Angular 2 app really easily. There are just a few simple steps:

### Step 0: Sign Up for Auth0 and Configure

If you don't already have any Auth0 account, [sign up](https://auth0.com/signup) for one now to follow along with the other steps.

### Step 1: Add Auth0Lock to Your App

[Lock](https://auth0.com/lock) is the beautiful (and totally customizable) login box widget that comes with Auth0. The script for it can be brought in from a CDN link or with npm.

> Note: If you use npm to get Auth0Lock, you will need to include it in your build step.

```html

  <!-- src/client/index.html -->

  ...

  <!-- Auth0 Lock script -->
  <script src=“https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>

  <!-- Setting the right viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

  ...
```

### Step 2: Add an Authentication Service

It's best to set up an injectable service for authentication that can be used across the application.

With Auth0, we get access to the user's profile and JWT in the `lock.on` callback where we listen for the `authenticated` event that is fired when a user succesfully logs in and these items can be saved in local storage for use later.

```js
// src/client/shared/auth.service.ts

import {Injectable, NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN');
  refreshSubscription: any;
  user: Object;
  zoneImpl: NgZone;

  constructor(private authHttp: AuthHttp, zone: NgZone, private router: Router) {
    this.zoneImpl = zone;
    this.user = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock `authenticated` event
    var self = this;
    this.lock.on("authenticated", authResult => {
      self.lock.getProfile(authResult.idToken, (error, profile) => {

        if (error) {
          // handle error
          return;
        }

        // If authentication is successful, save the items
        // in local storage
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('id_token', authResult.idToken);
        self.zoneImpl.run(() => self.user = profile);
      });
    });
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
  }

  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }

  public logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.zoneImpl.run(() => this.user = null);
    this.router.navigate(['Home']);
  }
}
```

### Step 3: Add a Click Handler to Login

To be able to use the "Login" and "Logout" methods, we need to inject the Auth service in the `app.components.ts` file.

```
 <!-- src/client/app.components.ts -->
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

...
```

In your root NgModule, declare the service provider, as shown in the following code.

```
 <!-- src/client/app.module.ts -->

...
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AUTH_PROVIDERS,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Now, we can use the methods from our authentication service in any of our components which means we can easily add a click handler to a "Login" and "Logout" button.

```html
  <!-- src/client/app.component.ts -->

  ...

  <button (click)="authService.login()" *ngIf="!authService.authenticated()">Log In</button>
  <button (click)="authService.logout()" *ngIf="authService.authenticated()">Log Out</button>

  ...
```

Once the user logs in, a [JSON Web Token](https://jwt.io/introduction) will be saved for them in local storage. This JWT can then be used to make authenticated HTTP requests to an API.

### Step 5: Make Authenticated HTTP Requests

With [**anuglar2-jwt**](https://github.com/auth0/angular2-jwt), we can automatically have our JWTs sent in HTTP requests. To do so, we need to inject and use `AuthHttp`.

```js
// src/client/ping/ping.component.ts

import {Component} from 'angular2/core';
import {Http} from 'angular2/http';

import {AuthHttp} from 'angular2-jwt';
import {Auth} from './auth.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'ping',
  template: `
    <h1>Send a Ping to the Server</h1>
    <button class="btn btn-primary" (click)="securedPing()" *ngIf="auth.authenticated()">Secured Ping</button>
    <h2>{{message}}</h2>
  `
})
export class Ping {
  API_URL: string = 'http://localhost:3001';
  message: string;

  constructor(private http: Http, private authHttp: AuthHttp, private auth: Auth) {}

  securedPing() {
    this.authHttp.get(`${this.API_URL}/secured/ping`)
      .map(res => res.json())
      .subscribe(
        data => this.message= data.text,
        error => this.message = error._body
      );
  }
}
```

### Step 5: Done!

That's all there is to it to add authentication to your Angular 2 app with Auth0!

## Conclusions

### Performance Advantages
One of the big advantages of using stricter change detection is the performance gains. Angular is meant to be used for large applications that can handle lots of dynamic data. The Angular team has given the developer the tools necessary to fine-tune and improve performance from the get-go. By default, every change should be reflected on the UI, as Angular takes care of that, but the price is lower performance. Immutable or reactive code is harder to write but easier to maintain and reason out. The choice is yours.

### Eventually Angular can be tweaked
The good thing is that we have a choice with Angular 2. In Angular 1, it was impossible to get away from the digest cycle. At a certain point, it was advantageous to use React or another library to render UI instead of Angular templates, as it was too slow when handling a large amount of dynamic data. Now, you have a complete solution with much more control over the internal behavior. This, in combination with the other changes made to Angular 2, makes the learning curve of the framework steeper but worth it.