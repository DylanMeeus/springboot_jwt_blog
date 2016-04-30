---
layout: post
title: "Creating your first Angular 2 app: From authentication to calling an API and everything in between"
description: "Learn how to create a real world angular 2 app using Pipes, Directives, Components, DI, ES6 and much more! We'll implement from Authentication to calling an API and everything in between"
reply:
 twitter: https://twitter.com/auth0/status/598909226111631360
date: 2015-05-14 09:54AM
date_override: "2015-10-07 12:30"
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60design
design:
  image: https://angular.io/resources/images/logos/standard/shield-large.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- authentication
- angular2
- pipes
- component
- directive
- angular 2
- di
- bind
- real world
- example
- talk
related:
- 2015-08-11-create-your-first-ember-2-dot-0-app-from-authentication-to-calling-an-api
- 2015-04-09-adding-authentication-to-your-react-flux-app
- 2015-08-05-creating-your-first-aurelia-app-from-authentication-to-calling-an-api
---
----

**TL;DR:** Get the sample Angular 2 app from [this Github repository](https://github.com/auth0/angular2-authentication-sample). Also, check out [this talk](https://www.youtube.com/watch?v=pgFtp2LgwoE) I did where I explain and live-code this same example.

----

Last week, the Angular team [announced](https://twitter.com/angularjs/status/593797019258359809) that **Angular 2 was moving from Alpha to Developer Preview**. Therefore, we figured **it was time to give it a try**.

After looking around the internet, I learned that **all of the existing examples were only one single page** with just 1 or 2 components. Those examples, while nice, weren't really useful for creating a real world app. Therefore, in order to learn and help the community, we decided to **create a fully working, real life small application that would have multiple pages and would handle authentication as well as calling an API**. In order to do all this, we'd use most of the new Angular 2 features like the router, components, directives, pipes and DI, as well as [Fetch](https://fetch.spec.whatwg.org/) for calling an API. In this article, we'll explain how we did it.

<!-- more -->

## Before we start

### Warning!
Before we start, I wanted to give you a warning. Angular 2 is changing constantly since it's still in a Developer Preview, which means we'll be working with the bleeding edge. Therefore, this example might become outdated. However, we'll work on updating the source code as often as we can to stay up to date.

### Seed project
In order to start working with Angular 2, I strongly recommend checking [Pawel](https://twitter.com/pkozlowski_os)'s [ng2-play](https://github.com/pkozlowski-opensource/ng2-play). It makes it really easy to install and spin up a new project with Angular 2.

### Read the comments!
Throughout this example, please **read the comments on the code**, which will give you insights about what each of the lines does.

## Let's code!

### Setting up the router
The first thing we should do is set up the router. For each URL, our job is to setup which component should be loaded and where.

First, we need to create our [App](https://github.com/auth0/angular2-authentication-sample/blob/master/src/app/app.js) component, which will set up the routes:

```js
// app.js
// … imports
@Component({
  // HTML selector for this component
  selector: 'auth-app'
})
@View({
  template: `
    <!-- The router-outlet displays the template for the current component based on the URL -->
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet]
})
export class App {
  // We inject the created router via DI
  constructor(router: Router) {
    this.router = router;
    // Here we configure, for each route, which component should be added and its alias for URL linking
    router
      .config('/home', Home, 'home')
      .then((_) => router.config('/login', Login, 'login'))
      .then((_) => router.navigate('/home'))
  }
}

bootstrap(App, [
  // Here we're creating the Router.
  // We're also configuring DI, so that each time a Router is requested, it's automatically returned.
  bind(Router).toValue(new RootRouter(new Pipeline()))
)
```

### Creating the login page

Now, it's time to create our [Login](https://github.com/auth0/angular2-authentication-sample/blob/master/src/login/login.js) component. Its main function will be displaying the login form and calling the Login API using Fetch. Once the server successfully authenticates the user, we'll save the [JWT](http://jwt.io/) we get back in `localStorage` and then redirect the user to the home page.

```js
// login.js
@Component({
  selector: 'login'
})
@View({
  // Template for this component. You can see it below
  templateUrl: 'login/login.html'
})
export class Login {
  // We inject the router via DI
  constructor(router: Router) {
    this.router = router;
  }

  login(event, username, password) {
    // This will be called when the user clicks on the Login button
    event.preventDefault();

    // We call our API to log the user in. The username and password are entered by the user
    fetch('http://localhost:3001/sessions/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, password
      })
    })
    .then(status)
    .then(json)
    .then((response) => {
      // Once we get the JWT in the response, we save it into localStorage
      localStorage.setItem('jwt', response.id_token);
      // and then we redirect the user to the home
      this.router.parent.navigate('/home');
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.message);
    });
  }
}
```

```html
 <!-- template -->
 <!-- On form submit, we call the Login event with the username and the password from the inputs -->
 <form (submit)="login($event, username.value, password.value)">
   <label for="username">Username</label>
   <!-- Using #username, we can identify this input to get the value on the form's submit event -->
   <input type="text" #username class="form-control" id="username" placeholder="Username">
   <label for="password">Password</label>
   <!-- Using #password we can identify this input to get its value -->
   <input type="password" #password class="form-control" id="password" placeholder="Password">
   <button type="submit">Submit</button>
 </form>
```

### Creating the Home component

The user is logged in. It's time to create the [Home](https://github.com/auth0/angular2-authentication-sample/blob/master/src/home/home.js) component, to which the user will arrive upon successful login. It will let the user call an authenticated API as well as displaying the JWT information.

```js
@Component({
  selector: 'home'
})
@View({
  // Here we specify the template we'll use
  templateUrl: 'home/home.html',
  // We also specify which directives will be used in our template
  directives: [If]
})
export class Home {
  // Here we define this component's instance variables
  // They're accessible from the template
  jwt: string;
  decodedJwt: string;

  constructor(router: Router) {
    this.router = router;
    // We get the JWT from localStorage.
    // We set them as instance variables to be able to use it in this component's JS and HTML template
    this.jwt = localStorage.getItem('jwt');
    // We also store the decoded JSON from this JWT
    this.decodedJwt = this.jwt && jwt_decode(this.jwt);
  }

  logout() {
    // Method to be called when the user wants to logout
    // Logging out means just deleting the JWT from localStorage and redirecting the user to the Login page
    localStorage.removeItem('jwt');
    this.router.parent.navigate('/login');
  }

  callSecuredApi() {
    // We call the secured API
    fetch('http://localhost:3001/api/protected/random-quote', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // To authenticate the user in this API call, we send the JWT we got from localStorage
        'Authorization': 'Bearer ' + this.jwt
      }
    })
    .then(status)
    .then(text)
    .then((response) => {
      alert(response)
    })
    .catch((error) => {
      alert("Error " + error.message);
    });
  }
}
```
```html
 <!-- template -->
 <div class="home">
   <!-- If there's a JWT, we display it -->
   <pre *if="jwt" class="jwt"><code>{{ "{{jwt" }}}}</code></pre>
   <!-- Here, we're using pipes to display the JSON content of the JWT nicely. We'll learn how to  create the JSON pipe in the next section -->
   <pre *if="jwt" class="jwt"><code>{{ "{{decodedJwt | json" }}}}</code></pre>
    <!-- Anchor to call the secured API -->
   <p><a (click)="callSecuredApi()">Call Se cure API</a></p>
    <!-- Anchor to log the user out -->
   <p><a (click)="logout()">Logout</a></p>
 </div>
```

### Creating the JSON pipe
Do you remember AngularJS's [filters](https://docs.angularjs.org/guide/filter)? Do you remember Shai Reznik's [ngWat talk](https://www.youtube.com/watch?v=M_Wp-2XA9ZU) saying how filter naming was weird? Well, the Angular team has heard us. Filters are now called pipes.
In this case, we'll create a JSON pipe, which takes care of pretty printing any JSON / JS object.

```js
//… imports

// We must extend Pipe and JSONPipeFactory to create a singleton pipe first
export class JSONPipeFactory extends Pipe {
  // In this method we must return which objects can be used with this pipe. In this case, we accept any object.
  supports(obj):boolean {
    return true;
  }

  // Given any JSON object, we pretty print it using JSON.stringify
  transform(value):string {
    return JSON.stringify(value, null, 2);
  }

  // This method creates a new pipe. Since we're going to use a singleton pipe, we'll always return this in this case.
  create():Pipe {
    return this;
  }
}

// We need to create a list of all the pipes that will be set when bootstrapping the Angular 2 app. In this case, we'll only have one other than the default ones
import { defaultPipes } from 'angular2/change_detection';
export var pipes = Object.assign({}, defaultPipes, {
  'json': [
    new JSONPipeFactory()
  ]
});
```

In the `app.js`, when bootstrapping the app, besides creating the router, we must also set the pipes that are available.

```js
// app.js
bootstrap(App, [
  bind(Router).toValue(new RootRouter(new Pipeline())),
  bind(PipeRegistry).toValue(new PipeRegistry(pipes))
]);
```

### Restricting access to pages
Now, we have the Login and Home components finished. We don't want anonymous users to be able to access the Home. For that, we can create our own RouterOutlet, which will only let authenticated users access the home.
For that, we need to do two things. First of all, we need to modify our `app.js` to use the new LoggedInRouterOutlet we'll create, rather than using the default one.

```js
@Component({
  // HTML selector for this component
  selector: 'auth-app'
})
@View({
  template: `
    <!-- We use the new outlet in our HTML template -->
    <loggedin-router-outlet></loggedin-router-outlet>
  `,
   // Here we include the new RouterOutlet directive we'll create
  directives: [LoggedInRouterOutlet]
})
export class App {
// …
```
```js
// We specify that this outlet will be called when the `loggedin-router-outlet` tag is used.
@Directive({selector: 'loggedin-router-outlet'})
// We inherit from the default RouterOutlet
export class LoggedInOutlet extends RouterOutlet {

  // We call the parent constructor
  constructor(viewContainer, compiler, router, injector) {
    super(viewContainer, compiler, router, injector);
  }

  canActivate(instruction) {
    var url = this._router.lastNavigationAttempt;
    // If the user is going to a URL that requires authentication and is not logged in (meaning we don't have the JWT saved in localStorage), we redirect the user to the login page.
    if (url !== '/login' && !localStorage.getItem('jwt')) {
      instruction.component = Login;
    }
    return PromiseWrapper.resolve(true);
  }
}
```

## Aside: Using Angular with Auth0

Auth0 issues **JSON Web Tokens** on every login for your users. That means that you can have a solid identity infrastructure, including Single Sign On, User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. We implemented a tight integration with Angular 1. Angular 2 integration is coming as soon as it's on Beta! You can read the [documentation here](https://auth0.com/docs/client-platforms/angularjs) or you can checkout the [SDK on Github](https://github.com/auth0/auth0-angular)

<img src="https://docs.google.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/pub?w=1219&amp;h=559" style="border: 1px solid #ccc;padding: 10px;">



## Conclusions

In this article, we've learned how to create a multiple page Angular 2 app that uses the new router, pipes, templates, directives and components to implement both authentication and calling an API. You can see the complete example on [Github](https://github.com/auth0/angular2-authentication-sample), as well as a [talk that I did](https://www.youtube.com/watch?v=pgFtp2LgwoE), where this example is live-coded.

Before ending, I want to thank [David East](https://twitter.com/_davideast) for his support with some questions, [PatrickJS](https://twitter.com/gdi2290) for his help on coding parts of the example and to [Jesus Rodriguez](https://twitter.com/Foxandxss) for cleaning up some of the unused code.

Happy hacking :).


