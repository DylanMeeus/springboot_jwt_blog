---
layout: post
title: "Use @NgModule to Manage Dependencies in your Angular 2 Apps"
description: "The Angular 2 @NgModule decorator allows for easier management of dependencies within the Angular 2 framework."
date: 2016-09-15 08:30
author:
  name: "Martin Gontovnikas"
  url: "https://twitter.com/mgonto"
  mail: "gonto@auth0.com"
  avatar: "https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- ngmodule
- angular
related:
- introducing-angular2-jwt-a-library-for-angular2-authentication
- create-a-desktop-app-with-angular-2-and-electron
- creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between
---

---

**TL;DR** Angular 2 RC 5 introduced a series of new features including [@NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html), lazy loading support for the router, and [Ahead-of-Time (AoT)](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/) compilation. In this post, we'll look at the new `@NgModule` decorator and see how it can make managing dependencies a lot easier. 

---

[Angular 2](https://angular.io/) has officially reached a major milestone, the [final 2.0 release](http://angularjs.blogspot.com/2016/09/angular2-final.html). The Release Candidate (RC) 5 version of the framework, released just a few weeks ago, introduced many new features that will make developing Angular 2 applications easier but also run better and faster. Among the new features is lazy loading support for the official router, Ahead-of-Time (AoT) compilation for components and services, a new and improved forms module, and a new decorator called @NgModule. 

**NgModule** aims to simplify the way you define and manage dependencies in your Angular 2 applications. Using `@NgModule` you can consolidate different components and services into cohesive blocks of functionality.  

{% include tweet_quote.html quote_text="@NgModule simplifies the way you define and manage dependencies in your Angular 2 apps." %}

## Angular 2 Without @NgModule

NgModule is a late, but greatly welcomed addition to the Angular 2 framework. Before diving into working with `@NgModule`, let's briefly look at life without it. If you've worked with Angular 2 applications before RC5, your components probably looked a little like this:

```js
@Component({
  selector: 'my-component',
  styles: [`
  h1 {
    font-size: 200px
  }
  `]
  template: `
  <h1>Hello from MyComponent.</h1>
  <my-other-component></my-other-component>
  `,
  providers: [MyProvider], // MyProvider is a fictional service
  directives: [MyOtherComponent] // MyOtherDirective is a fictional component
})
export class MyComponent {}
```

For each and every component you created, you had to declare the relationship it had with the various other components, services, and pipes within your application. It was very easy to forget to include the right component and it made managing all these dependencies very cumbersome. In addition to that, the error reporting was subpar, so you wouldn't even know why your components aren't loading or functionality seems broken.

## Enter @NgModule

`@NgModule` for the most part solves the problem of managing dependencies for your Angular 2 application. With `@NgModule`, you can group a certain feature, business logic, utility, or other logical unit of functionality into a module that contains all of the dependencies, components and services for that module. Then you are free to focus on building out your components, services, pipes, and directives without having to re-declare any of the dependencies again.

Let's see how this works in practice. We'll start by writing our root module. RC5 and future versions of Angular 2 will be bootstrapped with a module rather than a component, so our application must have a root module. We'll create our root module below.

```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

Our `app.component.ts` file will be fairly simple:

```
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: '<h1>NgModule Demo Application</h1>',
})
export class AppComponent {}
```

So far our syntax doesn't look drastically different from the pre-RC5 way of declaring our Angular 2 application. Sure the syntax has slightly changed, but is that really worth rewriting all of our code?

Next, let's add a component to our application. We'll call this component `WelcomeComponent` and it will simply display a welcome message. The implementation will be as follows:

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: '<p>Welcome to our awesome app</p>',
})
export class WelcomeComponent {}
```

Now say we want to use this component in our `AppComponent`. Prior to RC5, we would:

1. Go into our `app.component.ts` file and import the `WelcomeComponent`
2. In the @Component decorator we'd add a directives key and pass the `WelcomeComponent` to it
3. Finally we'd add the `<app-welcome></app-welcome>` directive in our template.

This process would have to be repeated anywhere we wanted to use the `WelcomeComponent`. In a small application, it may be a slight annoyance, but as your application grows, it would quickly become tedious and unmanageable. 

Since we are writing an application that makes use of `@NgModule` we can omit steps one and two, and simply add the appropriate component in our template. Then, in our root `@NgModule`, we'd simply add the `WelcomeComponent` as a dependency.

```
// ...
@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, WelcomeComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
// ...
```

Since we declared this component in our root module, we can now use this `WelcomeComponent` anywhere in our application without needing to declare or import it again. In essence, the `@NgModule` handles dependency injection for us, so any component we declare will have the inherent knowledge of our other dependencies. We are not limited to declaring only components here, we could additionally write a directive or service, and declare use it the exact same way.

Let's talk a bit about the `imports` key. The `imports` key in the context of an `@NgModule` defines additional modules that will be imported into the current module. For example, we imported the `BrowserModule`, which adds a lot of common functionality like such as `ngIf` and `ngFor`. By importing the `BrowserModule` we get access to all of these directives without having to manually declare them ourselves. This really cuts down on having to redeclare and reimport a lot of common functionality. 

This was a minimalistic example showing how we can leverage the `@NgModule` decorator to simplify how we manage dependencies in our Angular 2 application. This was barely scratching the surface though. Check out the official [docs](https://angular.io/docs/ts/latest/guide/ngmodule.html) to learn all the ins and outs of `@NgModule`. In the next section, we'll look at how we can leverage the new NgModule features and add authentication to our Angular 2 app. 

## Aside: Angular 2 Authentication

We've shown how you can add JSON Web Token (JWT) authentication to your Angular 2 applications in the past. Many of these posts were written pre-RC5, so today I'll briefly discuss how you can combine our [Angular 2 JWT](https://github.com/auth0/angular2-jwt) library with `@NgModule` to write better, easier to understand, and more performant code. 

You may be familiar with the official Angular 2 demo application [Tour of Heroes](https://angular.io/docs/ts/latest/tutorial/). We have forked this app and created [Tour of Secret Heroes](https://github.com/auth0-blog/angular2-tour-of-heroes). In addition to familiarizing you with how Angular 2 works, our version also supports JSON Web Token based authentication. Let's take a look at how we accomplished this.

First and foremost, we used the Angular 2 JWT library, created by Auth0. To install it in your application simply run `npm install angular2-jwt --save`.

Next, we created an authentication service in a file called `auth.service.ts`. The implementation is as follows:

```
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Get the AUTH0_CLIENT_ID and AUTH0_DOMAIN from your management dashboard.
  lock = new Auth0Lock('AUTH0_CLIENT_ID', 'AUTH0_DOMAIN');

  constructor(private router: Router) {
    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);

      this.lock.getProfile(authResult.idToken, (error: any, profile: any) => {
        if (error) {
          console.log(error);
        }

        localStorage.setItem('profile', JSON.stringify(profile));
      });

      this.lock.hide();
    });
  }

  login() {
    this.lock.show();
  }

  logout() {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');

    // Send the user back to the dashboard after logout
    this.router.navigateByUrl('/dashboard');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}
```

The implementation uses the [Auth0 Lock](https://auth0.com/lock) widget. The Lock widget is a modern, easy to use, and very configurable login widget that can handle almost any authentication use case. To add the Lock widget to your application, in your `index.html` page add the following code:

```html
 
  <!-- Auth0Lock script -->
  <script src="//cdn.auth0.com/js/lock/10.2.2/lock.min.js"></script>

```

Next, we implemented an auth guard, which determines if the route should load or not. Our implementation is below:

```
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (!this.auth.loggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
```

The `AuthGuard` checks to see if a user is authenticated. For routes protected with the `AuthGuard`, the user must be logged in, otherwise the route does not load and they are redirected to the homepage. We've added a couple of routes to the Tour of Heroes that have this guard in place.


```
// ...
const appRoutes: Routes = [
  const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  },
  {
    path: 'heroes',
    component: HeroesComponent
  },
  {
    path: 'secret-heroes',
    component: SecretHeroesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'secret-detail/:id',
    component: SecretHeroDetailComponent,
    canActivate: [AuthGuard]
  },
];
];
// ...
```

The additional routes have the `AuthGuard` activate meaning we'll check if the user is logged in only on these routes. For this application, we only created one `NgModule` and that was the root module. Let's take a look at it's implementation.

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import './rxjs-extensions';
import { AppComponent } from './app.component';
import { routing, routedComponents } from './app.routing';
import { HeroService } from './hero.service';
import { HeroSearchComponent } from './hero-search.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule
  ],
  declarations: [
    AppComponent,
    HeroSearchComponent,
    routedComponents
  ],
  providers: [
    HeroService,
    AUTH_PROVIDERS,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

As you can see, we added a couple of different `imports`, `declarations`, and `providers`. Since this is our root module, we've also added a `bootstrap` key and passed in the correct component we want loaded first. One item to note is that we did not include all of our components here. The `DashboardComponent`, `HeroDetailComponent`, and others are not present here. Does this mean our app will not work? Not quite. Notice the `routedComponents` we added to our `declarations`. If we look in the `app.routing.ts` file, you'll notice that we grouped all of the components that we use in our routes in this array, and then exported it. This is totally valid and will work, while making our code a bit easier to read and understand.

The last change we made was in the `app.component.ts` file. Here we updated the template and added our `AuthService` so that we could conditionally display menu options based on the user state. Check out the implementation below:

```
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
      <a routerLink="/secret-heroes" *ngIf="authService.loggedIn()" routerLinkActive="active">Secret Heroes</a>
      <a (click)=authService.login() *ngIf="!authService.loggedIn()">Log In</a>
      <a (click)=authService.logout() *ngIf="authService.loggedIn()">Log Out</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {

  title = 'Tour of Heroes';

  constructor(private authService: AuthService) {}
}
```

That is it. We did create a `secret-heroes.component.ts` and `secret-hero-details.component.ts` components, but their functionality is equivalent to that of the regular `heroes.component.ts` and `hero-details.component.ts` components. Download the full Tour of Secret Heroes app from our [GitHub repo](https://github.com/auth0-blog/angular2-tour-of-heroes).

Stay tuned. We will be releasing a follow up post early next week that will walk you through building the Tour of Secret Heroes app from scratch and will go into further detail on how to add authentication to your Angular 2.0 apps.

## Conclusion

NgModule is a great and welcome addition to the Angular 2 framework. Managing dependencies in an application is never an easy task, but the `@NgModule` decorator is a great leap towards getting it right. If you aren't already using it in your Angular 2 applications, updating to RC5 and beyond is well worth it for this functionality alone. If you are building Angular 2 applications and are looking to do authentication right, check out our [Angular 2 JWT library](https://github.com/auth0/angular2-jwt) and [sign up](https://auth0.com/signup) for a free Auth0 account to get up and running in no time.