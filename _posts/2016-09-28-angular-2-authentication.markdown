---
layout: post
title: "Angular 2 Authentication Tutorial"
description: "Angular 2.0 has officially been released. Learn how to quickly build apps and add authentication the right way."
date: 2016-09-28 08:30
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- angular2-jwt
- angular2-authentication
related:
- angular-2-ngmodules
- introducing-angular2-jwt-a-library-for-angular2-authentication
- create-a-desktop-app-with-angular-2-and-electron
---

---

**TL;DR** Angular 2.0 has finally been released. In this tutorial we are going to look at how to build applications with Angular 2 as well as how to add token based authentication to Angular 2 apps the right way. Check out the completed code example from our [Github repo]().

---

[Angular 2](https://angular.io/) finally hit the major [2.0 release](http://angularjs.blogspot.com/2016/09/angular2-final.html) milestone just a few weeks ago. The final release of Angular 2 did not have many breaking changes. The Release Candidate 5 (RC5) release, released just a few weeks prior to final, introduced major breaking changes and additions such as the [@NgModule decorator](https://angular.io/docs/ts/latest/guide/ngmodule.html), [Ahead-of-Time (AOT)](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/) compiler and more.

In today's tutorial, we are going to utilize some of these new features to build an entire Angular 2 application. We'll make use of the new @NgModule decorator, use some of the latest features like route guards, services and more. Finally, we'll implement token based authentication with [Auth0](https://auth0.com).

## The Angular 2 Ecosystem

[Angular 1.x](https://angularjs.org/) was highly regarded as a powerful framework for building single page applications (SPAs). It did a lot of things well, fell short on some, but overall allowed developers to quickly build powerful applications.

While Angular 1.x is a framework, [Angular 2](https://angular.io/) is an entire platform for building modern applications. Alongside the core Angular 2 library, the platform ships with a powerful Command Line Interface (CLI), called [Angular CLI](https://cli.angular.io), that allows developers to easily scaffold their applications as well as control the build system. [Angular Universal](https://universal.angular.io) brings server-side rendering to Angular 2 applications. [Angular Material 2](https://material.angular.io) is the official implementation of the Material Design which allows developers to build beautiful applications with ease.

Angular 2.0 has officially shipped, but the other components of the platform are still in alpha and beta stages. For our application today, we will make use of the Angular CLI and the core Angular 2 framework, we'll let the other components bake a little longer.  

{% include tweet_quote.html quote_text="While Angular 1 is a framework, Angular 2 is an entire platform for building modern applications" %}

## Our App: Daily Deals

The app we are building today is called Daily Deals. The Daily Deals app displays a list of deals and discounts on various products. We'll have a list of publically available deals that anyone can see and a list of private deals available only to registered members. The private deals are exclusive to registered members, and should hopefully be better.

### Serving the Daily Deals

We'll have to get our daily deals from somewhere. Let's build a very simple [Node.js](https://nodejs.org) backend to serve the deals. We'll have a publically accessible route serving public deals and a protected private route that can only be called by authenticated users. For now, we'll make both of the routes public and worry about the authentication piece later. Take a look at our implementation below:

```js
'use strict';
// Load dependencies
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Public route
app.get('/api/deals/public', (req, res)=>{
  let deals = [
    // Array of public deals here
  ];
  res.json(deals);
})

// Private route 
app.get('/api/deals/private', (req,res)=>{
  let deals = [
    // Array of Private Deals here
  ];
  res.json(deals);
})

app.listen(3001);
console.log('Serving deals on localhost:3001');
```

Both our server and the Angular 2 app we are building will require Node.js and [NPM](https://npmjs.com), so be sure to have those installed before continuing. Check out the [Github repo]() to get our list of daily deals or create your own. The model for each deal will be as follows:

```js
 {
    id: 1234,
    name: 'Name of Product',
    description: 'Description of Product',
    originalPrice: 19.99, // Original price of product
    salePrice: 9.99 // Sale price of product
}
```

When you are happy with the public and private deals, launch the server by running `node server` and navigate to both `localhost:3001/api/deals/public` and `localhost:3001/api/deals/private` to make sure you can see the list of deals you added. Next, let's set up our Angular 2 front-end.

### Angular 2 Front-End Setup

One of the best ways to start building a new Angular 2 app is with the official Angular 2 CLI. The CLI can take care of scaffolding the initial app, adding additional components, takes care of the build system and much more. In this tutorial we will scaffold our initial app with the CLI.

If you don't already have it installed, run `npm install angular-cli -g` to install the Angular CLI. We'll interact with the CLI using the `ng` command. To create a new application, choose a directory and run `ng init`. This will create a new Angular 2 application in selected directory, download all of the required NPM packages, and basically set everything up for us.

Once `ng init` is finished, run the `ng serve` command and the Webpack based build system will take care of compiling our app from TypeScript to JavaScript and will serve our app on `localhost:4200`. The `ng serve` command will also kick off a live sync process, so any time we make a change our app will automatically recompile.

Let's head over the `localhost:4200` for now to make sure that everything is working as expected so far. If you see a message saying "app works!" you are golden. Next, let's examine how our Angular 2 app is scaffolded.

The `ng init` command scaffolded our Angular 2 app and added a lot of files. Many of these we can ignore for now like the `e2e` folder, which would contain our end to end tests. Open up the `src` directory. In the `src` directory, we can see some familiar files like `index.html`, `styles.css`, and so on. Open up the `app` directory.

The `app` directory contains the bulk of our application. By default we are presented with the following files:

```
- app.component.css - // Holds the CSS styles for our root component
- app.component.html - // Holds the HTML view for our root component
- app.component.spec - // Holds the tests for our root component
- app.component.ts - // Holds the TypeScript logic for our root component
- app.module.ts - // Defines our global app dependencies
- index.ts - // Exports our application
- shared - // This directory holds any shared components we may have
```

Each Angular 2 component we write will have at a minimum the `*.component.ts` file, the others are optional. Our application is going to have three components. The main or root component, a component to display the public deals, and a component to display private deals. For our root component, we'll inline the template, and we won't write any tests so let's make the following edits:

* Delete `app.component.css`, `app.component.html` and `app.component.spec` files. We'll define all we need for our root component in the `app.component.ts` file.
* Create a `public-deals.component.ts`, `public-deals.component.html`, and `public-deals.component.css` file. This component will take care of getting and displaying the public deals data.
* Create a `private-deals.component.ts`, `private-deals.component.html`, and `private-deals.component.css` file. This component will take care of getting and displaying the private deals data.
* Create a `deal.ts` file. This component will hold our `deal` class which will let Angular 2 know the structure of a `deal`.
* Create a `deal.service.ts` file. Here we'll add the functionality to get and retrieve the deal data from our API.
* Finally, create an `app.routing.ts` file which will take care of our routes.

### Building the Root Component

Every Angular 2 application must have a root component. We can name it whatever we want, but the important thing is that we have one. In our application, the `app.component.ts` file will be our root component. Let's take a look at our implementation of this component.

```js
// Import the Component decorator
import { Component } from '@angular/core';

@Component({
  // We'll call our root component daily-deals
  selector: 'daily-deals',
  template: `
  <div class="container">
    <nav class="navbar navbar-default">
        <div class="navbar-header">
          <a class="navbar-brand" routerLink="/dashboard">{{title}}</a>
        </div>
        <!-- On the left side of our navbar we'll display the two links for public and private deals -->
        <ul class="nav navbar-nav">
          <li>
            <a routerLink="/deals" routerLinkActive="active">Deals</a>
          </li>
          <li>
            <a routerLink="/special" routerLinkActive="active">Private Deals</a>
          </li>
        </ul>
        <!-- On the right side of our navbar we'll display the login and logout actions depending on user state -->
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a>Log In</a>
          </li>
          <li>
            <a>Log Out</a>
          </li>
        </ul>
    </nav>
    <div class="col-sm-12">
      <!-- The router-outlet directive will display the component based on the route we are on, more on this soon -->
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  // We'll add an inline style to properly display the navbar
  styles : ['.navbar-right { margin-right: 0px !important}']
})
export class AppComponent {

  title = 'Daily Deals';

  constructor() {}
}
```

We've created our root component. We added an inline template and some inline styles. We haven't added all the functionality yet, so every user will be able to see all the links and the login and logout buttons. We'll wait to implement those a little bit.

To use this component, open the `index.html` file in your directory and replace `<my-app></my-app>` with `<daily-deals></daily-deals>`. We left the class name `AppComponent` so we don't need to make any edits to our `app.module.ts` file. We can just navigate to `localhost:4200` and see our app displayed. We won't see much yet, just the top navbar.

### The Deal Type

[TypeScript](https://www.typescriptlang.org/) allows us to define the structure or type of our objects. This serves a bunch of useful purposes. For one, if we define the structure of an object, we'll be able to get all of the object's data via intellisense. We can additionally test our components easier by knowing the data structure or type of object we are dealing with.

For our app, we'll create one such type. In the `deal.ts` file, we'll define a type of Deal. Let's see how we'll accomplish this.

```
export class Deal {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
}
```

Now we can declare objects in our Angular 2 application to be a type of `deal`. These objects will gain all of the properties and methods of the deal type. We are only defining properties here, we won't have any methods.

### Public and Private Deals components

The public and private deals components are very similar. In fact, the only difference between the two implementations is that one will display deals from the public API and the other will display deals from the private API. For posterity, we'll just show one of the component implementations. Let's implement the `public-deals.component.ts`.

```js
import { Component, OnInit } from '@angular/core';
import { Deal } from './deal';
// We haven't defined these services yet
import { AuthService } from './auth.service';
import { DealService } from './deal.service';

@Component({
  selector: 'public-deals',
  // We'll use an external file for both the CSS styles and HTML view
  templateUrl: 'public-deals.component.html',
  styleUrls: ['public-deals.component.css']
})
export class PublicDealsComponent implements OnInit {
  publicDeals: Deal[];
  
  // Note: We haven't implemented the Deal or Auth Services yet.
  constructor(
    private dealService: DealService,
    private authService: AuthService) {
  }
  // When this component is loaded, we'll call the dealService and get our public deals.
  ngOnInit(): void {
    this.dealService.getPublicDeals()
      .then(deals => this.publicDeals = deals);
  }
  
  purchase(item){
    alert("You bought the: " + item.name);
  }
}
```

Next, let's build the view of our public deals component. We'll do this in the `public-deals.component.html` file. Our view will be a mixture of HTML and Angular 2 sugar. Let's take a look at our implementation.

```html
<h3 class="text-center">Daily Deals</h3>

<!-- We are going to get an array of deals stored in the publicDeals variable. We'll loop over that variable here using the ngFor directive -->
<div class="col-sm-4" *ngFor="let deal of publicDeals">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">{{deal.name}}</h3>
    </div>
    <div class="panel-body">
      {{deal.description}}
    </div>
    <div class="panel-footer">
      <ul class="list-inline">
        <li>Original</li>
        <li class="pull-right">Sale</li>
      </ul>
      <ul class="list-inline">
        <li><a class="btn btn-danger">${{deal.originalPrice | number}}</a></li>
        <li class="pull-right"><a class="btn btn-success">${{deal.salePrice | number}}</a></li>
      </ul>
    </div>
  </div>
</div>

<!-- We are going to use the authService.loggedIn() method to see if the user is logged in or not. If they are not logged in we'll encourage them to login, otherwise if they are logged in, we'll provide a handy link to private deals. We haven't implemented the authService yet, so don't worry about the functionality just yet -->
<div class="col-sm-12" *ngIf="!authService.loggedIn()">
  <div class="jumbotron text-center">
    <h2>Get More Deals By Logging In</h2>
  </div>
</div>

<div class="col-sm-12" *ngIf="authService.loggedIn()">
  <div class="jumbotron text-center">
    <h2>View Private Deals</h2>
    <a class="btn btn-lg btn-success" routerLink="/special">Private Deals</a>
  </div>
</div>
```

Finally, let's add a custom style. In the `public-deals.component.css` file add the following:

```css
.panel-body {
	min-height: 100px;
}
```

This will ensure that each of the products displays nicely on our page.

Our private deals component will look very similar. For posterity, we won't display the scaffold. We'll cover the changes a little later on. If you'd like to see what it looks like, you can view it from our [Github repo]().

### Accessing our Deals API

Earlier in the tutorial we wrote a very simple API that exposed two routes. Now, let's write an Angular 2 service that will interact with these two endpoints. We'll do this in the `deal.service.ts` file. The implementation is as follows:

```
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Deal } from './deal';

@Injectable()
export class DealService {
  // Define the routes we are going to interact with
  private publicDealsUrl = 'http://localhost:3001/api/deals/public';
  private privateDealsUrl = 'http://localhost:3001/api/deals/private';

  constructor(private http: Http) { }
  
  // Implement a method to get the public deals
  getPublicDeals() {
    return this.http
      .get(this.publicDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }

  // Implement a method to get the private deals
  getPrivateDeals() {
    return this.http
      .get(this.privateDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }

  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
``` 

Now you can see where the getPublicDeals() method fits in from our `public-deals.component.ts` file. We also have written a `getPrivateDeals()` method that will get our list of private deals. Implement this method in your `private-deals.component.ts` file.

### Implementing the Routes

Now that we have our two components created, let's implement routing so that we can display the appropriate component. Routing in Angular 2 has changed a couple of different times. The new new new router is really great though and supports many features developers have been asking for such as lazy loading.

For our application, we will create two routes. The `/deals` route will display the publically available deals, and the `/special` route will display the exclusive private deals that only registered users will have access to. We'll also add a redirect, so that when the user lands on the homepage, we'll automatically redirect them to the deals page. Let's see how we are going to implement this. 

```js
import { Routes, RouterModule} from '@angular/router';

// Import our components
import { PublicDealsComponent } from './public-deals.component';
import { PrivateDealsComponent } from './private-deals.component';

const appRoutes: Routes = [
  // Add the redirect
  {
    path: '',
    redirectTo: '/deals',
    pathMatch: 'full'
  },
  // Add our routes
  {
    path: 'deals',
    component: PublicDealsComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent
  }
];
// Here we are exporting our routes
export const routing = RouterModule.forRoot(appRoutes);
// Here we are combining our routing components into a single array. We will use this a little later when we update our root module
export const routedComponents = [PublicDealsComponent, PrivateDealsComponent];
```

Our routing is looking good. Our entire application should be ready to test now. Before we test our application, there is one final thing we need to do to ensure that everything works correctly. *Note: If you decide to test your application before the conclusion of the tutorial, you will need to remove the `AuthService` from your deals components, otherwise Angular will complain.*

We need to update our root @NgModule to include all of the new components and services we've written. To do this, open the `app.module.ts` file. In this file, you'll see the root module that the Angular bootstrap created for us. We are going to edit it as follows:

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Import our dependencies
import { AppComponent } from './app.component';
import { routing, routedComponents } from './app.routing';

import { DealService } from './deal.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // Include the routing module
    routing,
    HttpModule,
  ],
  declarations: [
    AppComponent,
    // Include our array of routing components. This saves us from having to type out the entire list of components twice
    routedComponents
  ],
  providers: [
    // Add our deal service we created earlier
    DealService
  ],
  // Declare our root component, which is the AppComponent
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now we are ready to test our app. If you would like more information on how @NgModule works, check out this post. Navigate to `localhost:4200` and you should see be redirected to the deals page automatically. Notice that you can freely navigate to the `/secret` route and see the exclusive deals as well. You can do this because we haven't added user authentication yet. Let's do that now.

## Adding Authentication to Your Angular 2 App

The majority of apps require some type of authentication. Our application today is no different. In the next section I am going to show you how to add authentication to your Angular 2 application the right way. We are going to be using [Auth0](https://auth0.com) as our identity platform. We'll use Auth0 as it allows us to easily issue [JSON Web Tokens (JWTs)](https://jwt.io), but the concepts we'll cover can be applied to any token based authentication system. If you don't already have an Auth0 account, [sign up](https://auth0.com/signup) for a free one now.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and navigate to the client app you wish to use. Get the **Domain**, **Client Id**, and **Client Secret** of this app. That's all we'll need for now.

### Securing our server

Before we implement authentication on the front end in our Angular 2 application, let's secure our backend server. Open up the `server.js` file located in your `server` directory and make the following edits:

```js
'use strict';

const express = require('express');
const app = express();
// Import the required dependencies
const jwt = require('express-jwt');
const cors = require('cors');

app.use(cors());

// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid token sent in the Authorization header
const authCheck = jwt({
  secret: new Buffer('YOUR-AUTH0-SECRET', 'base64'),
  audience: 'YOUR-AUTH0-CLIENT-ID'
});

app.get('/api/deals/public', (req, res)=>{
  let deals = [
    // Array of public deals
  ];
  res.json(deals);
})

// For the private route, we'll add this authCheck middleware
app.get('/api/deals/private', authCheck, (req,res)=>{
  let deals = [
    // Array of private deals
  ];
  res.json(deals);
})

app.listen(3001);
console.log('Listening on localhost:3001');
```

That's all we'll need to do on the server. Restart the server and try to navigate to `localhost:3001/api/deals/private` and you'll see an error message saying missing authorization header. Our private API route is now secured. Let's get to implementing authentication in our Angular 2 app.

### Adding Authentication to the Front-end

We'll make use of the [Angular 2 JWT library](https://github.com/auth0/angular2-jwt) to provide us the foundation for implementing authentication in our app. You can get the library for your app by running `npm install angular2-jwt --save`.

 We'll first start by creating an authentication service that we can use throughout our app. Create a new file titled `auth.service.ts`. Out auth service implementation follows:

```js
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // We'll use the Auth0 Lock widget for capturing user credentials
  lock = new Auth0Lock('YOUR-AUTH0-CLIENTID', 'YOUR-AUTH0-DOMAIN.auth0.com');

  constructor(private router: Router) {
    // We'll listen for an authentication event to be raised and if successful will log the user in.
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

  // This method will display the lock widget
  login() {
    this.lock.show();
  }
  
  // This method will log the use out
  logout() {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');

    // Send the user back to the public deals page after logout
    this.router.navigateByUrl('/deals');
  }

  // Finally, this method will check to see if the user is logged in. We'll be able to tell by checking to see if they have a token and whether that token is valid or not.
  loggedIn() {
    return tokenNotExpired();
  }
}
```

As we saw from our authentication service, we'll be using the Auth0 [Lock widget](https://auth0.com/lock). Lock is a powerful and beautiful widget that handles many authentication use cases including username and password sign in, account sign up, social connections, enterprise federation, and more. You can learn about all of Lock's functionality from the [docs](https://auth0.com/docs/libraries/lock).

Let's make sure to include the Lock widget in our application. Open your `index.html` file and we'll load Lock from the Auth0 CDN.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ng2auth</title>
  <base href="/">
  <!-- Add Lock -->
  <script src="//cdn.auth0.com/js/lock/10.2.2/lock.min.js"></script>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  
</head>
<body>
  <!-- Body -->
</body>
</html>
```

### Angular 2 Authentication All In

The Angular 2 router comes with a powerful feature called [route guards](https://angular.io/docs/ts/latest/guide/router.html#!#guards) that allows us to programmatically determine whether a user can access the route or not. Route guards in Angular 2 can be compared to middleware in Express.js for example. 

We'll create an authentication route guard that will check to see if a user is logged in before displaying the route. Create a new file titled `auth-guard.service.ts` and add the following code:

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
// Import our authentication service
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // If user is not logged in we'll send them to the homepage 
    if (!this.auth.loggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
```

To implement this route guard in our routes, let's go ahead and open our `app.routing.ts` file. Here, we'll include our auth guard service and enable it on our secret route. Let's take a look at the implementation.

```js
// Here we're also including the CanActivate API
import { Routes, RouterModule, CanActivate } from '@angular/router';
// Add the AuthGuard service
import { AuthGuard } from './auth-guard.service';

import { PublicDealsComponent } from './public-deals.component';
import { PrivateDealsComponent } from './private-deals.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/deals',
    pathMatch: 'full'
  },
  {
    path: 'deals',
    component: PublicDealsComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent,
    // We'll use the canActivate API and pass in our AuthGuard. Now any time the /special route is hit, the AuthGuard will run first to make sure the user is logged in before activating and loading this route.
    canActivate: [AuthGuard]
  }
];

export const routing = RouterModule.forRoot(appRoutes);

export const routedComponents = [PublicDealsComponent, PrivateDealsComponent];
```

That's all there is to it. Our route is now protected at the routing level. 

If you recall we included a stub for the AuthService in our deal components. Since the authentication service is now implemented our placeholder functionality will just work. We'll see the correct behavior displayed based on user state.

We will need to update our root component though as we didn't include authentication specific functionality there. I did this on purpose so we could go through the example line by line. Let's do that next.

```js
import { Component } from '@angular/core';
// First and foremost we'll include our authentication service
import { AuthService } from './auth.service';

@Component({
  selector: 'daily-deals',
  template: `
  <div class="container">
    <nav class="navbar navbar-default">
        <div class="navbar-header">
          <a class="navbar-brand" routerLink="/dashboard">{{title}}</a>
        </div>
        <ul class="nav navbar-nav">
          <li>
            <a routerLink="/deals" routerLinkActive="active">Deals</a>
          </li>
          <li>
            <!-- We'll only show the private deals link if the user is logged in -->
            <a routerLink="/special" *ngIf="authService.loggedIn()" routerLinkActive="active">Private Deals</a>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <!-- We'll show the login link if the user is not currently logged in -->
            <a (click)=authService.login() *ngIf="!authService.loggedIn()">Log In</a>
          </li>
          <li>
            <!-- On the other hand, if the user is logged in, we'll show a log out link -->
            <a (click)=authService.logout() *ngIf="authService.loggedIn()">Log Out</a>
          </li>
        </ul>
    </nav>
    <div class="col-sm-12">
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  styles : ['.navbar-right { margin-right: 0px !important}']
})
export class AppComponent {

  title = 'Daily Deals';

  // We'll need to include a reference to our authService in the constructor to gain access to the API's in the view
  constructor(private authService: AuthService) {}
}
```

There is one final update we need to make. If you try to access the `/secret` route now, even if you are logged in, you won't get the list of secret deals. This is because we are not passing the JWT to the backend. We'll have to update our deal service.

### Updating the Deal Service

We need to update the call to the `/api/deals/private` to include our JWT. There are a couple of different ways to accomplish this. We could use the existing `http` call and add the correct header, but there is an easier way. The Angular 2 JWT library comes with an AuthHTTP method that will automatically take care of this for us. Let's see how we're going to implement this in our application.

```js
  // Be sure to include the HttpAuth API from the Angular 2 JWT library
  import { AuthHttp } from 'angular2-jwt';

  ...

  // We'll need to include the AuthHTTP method in our constructor
  constructor(private http: Http, private authHttp: AuthHttp) { }

  ...
  getPrivateDeals() {
    // Instead of this.http, we'll use the this.authHttp method. Everything else remains the same.
    return this.authHttp
      .get(this.privateDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }
```

That's it. We are now ready to test our application. If your Node.js server is not running, make sure to start it up first. Head over to `localhost:4200` and you should automatically be redirected to `localhost:4200/deals` and see the list of public deals.

Next, click on the login screen and you will be presented with the Lock widget. Login or sign up and you will be redirected back to the deals page, but now the UI will look slightly different. The main menu will have a new option for Private Deals, and the message at the bottom will also show you a link to the private deals. Instead of the Login link in the navbar, you'll also be presented with a Logout link instead. Finally click on the Public Deals link to see our list of exclusive private deals. 

You just wrote and authenticated an Angular 2.0 app. Congrats!

## Conclusion

Angular 2 is finally out and ready for prime time. It's been a long time coming, but it's finally here and I couldn't be more excited. In this tutorial, we looked at some of the ways you can write Angular 2 components and services. We implemented token based authentication with Auth0 and Lock. But that's just scratching the surface.

Angular 2 provides a lot of great features out of the box like pipes, i18n, and much more. Auth0 can help secure your Angular 2 apps with not just state of the art authentication, but enhanced features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. [Sign up](https://auth0.com/signup) today so you can focus on building features unique to your app.