---
layout: post
title: "AngularJS Authentication Screencast Series - Part 2"
description: "Learn how to add JWT authentication to your AngularJS 1.x app"
date: 2016-04-20 13:30
permalink: /2016/04/20/angularjs-authentication-screencast-series-part-2/
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  bg_color: "#333"
  image: https://cdn.auth0.com/blog/angular-auth-screencasts/angular-logo.png
  image_size: "85%"
tags: 
- angularjs
- nodejs
- jwt
- authentication
- api
- spa
- post-series
related:
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2016-04-22-angularjs-authentication-screencast-series-part-3
- 2015-09-02-angular2-series-working-with-pipes
---

> Adding authentication to any single page app comes with a set of challenges, and this includes apps built with AngularJS. Auth0 makes the process a lot easier with some open source libraries for saving and sending JSON Web Tokens, as well as a full authentication service that removes the need to write authentication logic yourself. If you want to get all the details of how to add auth to your AngularJS 1.x app, this screencast series is for you. If you'd like, you can go straight to the [code](https://github.com/auth0-blog/angular-auth) or checkout the [AngularJS + Auth0 docs](https://auth0.com/docs/quickstart/spa/angularjs/no-api).

In the second part of the screencast series, we'll first go through the steps of signing up for an Auth0 account. After that we'll set up the skeleton for our front end AngularJS application. Finally, we'll set up the backend NodeJS app and have it serve data at two different endpoints.

* **<a class="screencast-anchor" href="#sign-up" target="_self">Signing Up for Auth0</a>**
* **<a class="screencast-anchor" href="#setting-up-angular" target="_self">Setting Up the AngularJS App</a>**
* **<a class="screencast-anchor" href="#setting-up-node" target="_self">Setting Up the NodeJS App</a>**

<h2 id="sign-up">Signing Up for Auth0</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/8vOjY_DP0Co" frameborder="0" allowfullscreen></iframe>

### **Transcript**

So, ultimately, for this application we're going to need some way to get JSON Web Tokens for our users. And these tokens are going to have to come from some server. And we could spend the time going through the steps of setting up authentication on our own server, but instead what we're going to do here is actually use an authentication service called Auth0. And you can kind of think of Auth0 as an authentication broker.

And so Auth0 gives us a service where we can put all of our users into their database and then all we need to do is have our users send their credentials to Auth0. And if everything checks out with their credentials, they'll get a JWT back from Auth0. And then after that, we can use that JWT to secure our own server. So basically, Auth0 kind of offloads all of the tricky parts of authentication for us.

So there are a lot of other features around authentication that we would eventually want to put in our applications. Things like social login, so people want to be able to log in with their Google or their Twitter accounts. And then we might want some other authentication features as well, like multifactor authentication or single sign-on or passwordless login. And Auth0 allows us to do this really just at the flip of a switch.

Okay, so here's the game plan for the rest of the course. First, we're going to sign up for an Auth0 account. And then we'll register a user. And then we'll use AngularJS to set up a really simple front end for our application. And then we'll also create a very simple NodeJS app using Express for the backend. On the Angular side, we'll set up some logic to get the user's JSON Web Token and then save it in local storage. And then on the backend, we'll set up some middleware so that our API resources are protected. Then we'll see how to attach the JWT as an authorization header when the user makes a request to the backend so that they'll be able to get the resources that they should be able to get. All right, so to get started let's go over here to Auth0.com/angularjs. So as you can see here, there's some really good documentation provided by Auth0 that shows us exactly how to set up authentication for our applications. 

#### Signing up for Auth0

But the first thing we actually need to do is sign up for an account. So let's go over here to the login button. And then we've got an option here to sign up for a new account. So I'm just going to put in one of my email addresses and we'll see exactly how to sign up here. All right, so once you have your email address and password input there, let's go over here and see the rest of the steps.

So in this welcome message, we get the option to say that we're either technical or we're not. But we're all pretty technical here so let's say that's me. And then we're going to need to provide an account name. And this will be a domain name that is used to call Auth0's API. So this can be anything, really. It could be the name of your organization or just the name of your application. One consideration here is that we can have multiple applications under the same domain.

So if you plan to have multiple applications under this same account name, just pick something that makes sense for that situation. So I'll call this AngularJS Auth. And then we want to pick a region. And the region here can either be Australia, US West, or Europe Central. So I'm in North America and therefore I'll just pick US West. And then we can provide a company name. And then we'll just say Angular JS Testing. And then the role that we'll pick here is software developer.

And then there's a clause down here that we just need to read and accept. So if that checks out for you just hit this checkbox here and we're good to go. So the first thing that we'll see her is this popup that says, "What type of authentication do you want for your apps?" Now, it's okay to leave the defaults here because we can go back and change this later on. So I'm just going to come down here and hit save.

#### Auth0's Plans

Now, Auth0 has a really good free plan. They give us 7,000 regular active users. And the free plan is production ready, so you can create a full production account with up to 7,000 regular users and you're good to go for no cost. So when we sign up for our Auth0 account, we actually get this default app created for us. So let's take a look inside this default app and see what we have.

#### Application Settings

So we've got some quick start documentation available to us right within the dashboard. Then we've also got this settings area. And this is the area that's going to be important for when we set up our AngularJS app. So we've got our Auth0 domain, and that's going to be used to call the Auth0 API from our application. And then we've got this client ID here. And this is a public client ID that we need to use in our Angular app.

So this one will be public-facing, but here we've got our client secret. And it is this secret that's used to sign the tokens that our users get back. And this secret also needs to go on the NodeJS server so that our users' JWTs can be checked and verified when they reach the middleware. So let's take a look at just a couple more things here. I'm going to go over to the connections link. And this is where we get to see the different types of connections we can use with Auth0.

#### Social Connections 

And one that we should take a look at right now is this social connections area. And the social connections listed here are ones that we can use in our application. So if you're building an application that has a lot of users that have, say, GitHub accounts, then you can use the GitHub social authentication. And on the free plan, we're able to use two of these identity providers. Finally here, let's go over to the users link and this is where we can manage our users.

So, what we can do here is create our first user. And we just need to give an email address, password, and then the connection type, which in our case is going to be username password authentication for now. So I'll just put in the same email that I used to log in. And we'll put in a password there. And then we can keep username password authentication there. And we'll hit save.

So here we go. Our first user is created. And this is a really nice dashboard to manage users. You can see all sorts of information about them, their login count, where they're logging in from, that sort of thing. And as you can see here, we've got this pending notice here next to the email address. And that's because we've just had an email sent to this address that requires us to click a link to verify ourselves.

And so once we click that link in the email, this will go away. All right, so take some more time to get familiar with the backend here. And once you've done that, in the next video we'll get started on the AngularJS app.

<hr>

<h2 id="setting-up-angular">Setting Up the AngularJS App</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Pkykx1FMe6w" frameborder="0" allowfullscreen></iframe>

### **Transcript**

Okay, so let's get our Angular app started up here. We'll use **npm** to get all of the dependencies that we need. And so let's head over to the command line and let's do a new folder wherever you put your code. I've got mine in this code directory here. Let's just make a new directory. We'll call it `angularjs-auth`. And let's `cd` into there. Then, within there, let's initialize npm, so we'll do `npm init`. And you can just keep the defaults for the most part. Feel free to put whatever you want in these spots.

#### Installing the Dependencies 

So we'll say okay to that. Once that's done, let's actually install the dependencies. So there are quite a few of them we'll need, so let's take a look at each one of them. So we'll do `npm install`. We need `angular` for the AngularJS framework, so we'll do `angular`. And then we'll also want `angular-material` and that's just going to let us have some nice styling for our application. And with `angular-material` we'll need some supporting packages like `angular-aria` and `angular-messages`, and then `angular-animate` as well.

All right, then we'll want to do some routing, so let's grab `angular-ui-router`. And then for the JWT authentication parts, let's grab some packages that help us specifically with that. So Auth0 gives us this `angular-jwt` package and that just makes it easier to do JWT authentication in Angular apps as we'll see. Then we'll also want this `angular-storage` package, and that's going to be helpful for storing the user's JWT in their local storage.

And then finally, we need this `auth0-angular` package, and that's going to allow us to use Auth0 in our app. So let's hit enter on that and we'll see if everything installs properly. All right, so it looks like we got everything together. Now, let's open that up in our code editor. So I'm using VS Code here. And why don't we start by created an `index.html` file. So let's come over here and say we want an `index.html`. And then let's grab some boilerplate HTML and we can just call this "AngularJS Auth" for the title.

And then why don't we bring in the CSS and the scripts we'll need. So we'll come over here. We'll say we want a link to our `node_modules` folder and we want to go to `angular-material`. And we want `angular-material.css`. All right, so then let's bring in the scripts. Down here, just before the closing body tag let's do a new script tag. And the source for this will be our `node_modules` folder.

We want `angular` and then `angular.js`. We'll use the unminified version. So now if we copy this over, let's come down below and we can grab the `angular-material` stuff. But first let's grab `angular-animate`. Let's copy this one, make it a bit quicker for the next one. So we also want `angular-aria`. And then finally, below it, it's going to be `angular-material`.

All right, so then let's grab our `angular-jwt` package, so we can just paste that below again. So `node_modules` in this case is going to be `angular-jwt` and it's within the `dist` folder. And we want `angularjwt.js`. Let's copy this one. We want `angular-storage`. And then let's grab `auth0-angular`. So let's copy this. This one's going to look a little bit different, so let's take this out. It's going to be `auth0-angular` and it's in the `build` directory within there.

And then we want `auth0-angular` here. And then finally, let's grab UI Router. So let's come down here. We'll paste this. And just say that we want `angular-ui-router`. It's in the `release` directory, and we'll say `angular-ui-router` here. So then we know we're going to need an `app.js`. Why don't we put that down below. This will be the first of our actual application scripts. And so let's just say we want `app.js`. 

#### Bringing in the Lock Widget

So when we do authentication with Auth0, we can either us the login widget that they provide, which is called Lock, or we can create our own login box that calls their API. For this course, we're just going to use the Lock widget because it's really easy to integrate and really easy to get going with. So let's come over here to our browser and let's head over once again to `auth0.com/angularjs`.

So that takes us here to the Angular quick start page. And what we can actually do is come down here and grab the Auth0Lock script. And this is going to grab the Lock widget script from Auth0's CDN. So let's copy this over and we'll paste this just below the title here. And then we should also set the `viewport` to the recommendation given by Auth0. And this is going to help on mobile devices. So let's set that as such. 

#### Bootstrapping the Angular App

All right, cool. So let's do some Angular specific stuff now. So on our `html` tag, why don't we use this as the point that we bootstrap the application. So to bootstrap we use `ng-app`. And let's call this `authApp`. And so now let's save that and let's come over here and create a new file. This one's going to be for our `app.js`. And let's get things going here. So we'll do `'use strict'` and then let's say we want `angular`. We want a module called `authApp`.

And here, of course, we need to put our dependencies. So we can say that we want `auth0`. That's the `auth0-angular` package. We also want `angular-storage`. We need `angular-jwt`. `ngMaterial` is our Angular Material package. And then finally, we want `ui.router`. All right, cool. So now let's test things out, just to make sure everything is working. And maybe we'll just come over here to the body tag and we can say, maybe, `ng-init` has this `hello` property that is equal to the message of `hello, world`.

All right, so let's see if we can successfully template this out. We come back over to the command line and we do an `http-server` to get going. That's going to serve the app at `localhost:8080`. So let's come over here and we'll do `localhost:8080`. And there we go. We've got `hello, world`. Cool. So now what we're going to want to do is set up our components for this app.

#### Setting up the Components

So for this simple app, we'll need three components. We'll need a home component, a profile component, and then a toolbar component, which will just be a directive for our toolbar up at the top. So let's head back over to VS Code and we'll set up those components. So we'll want a new directory here. We'll call it `components`. And then within `components`, let's set up our three subdirectories. So we'll want `home` and then we are also going to want `profile`. And then finally, what we'll want is our `toolbar`. So for the `home` component, really all we need is a simple HTML file that's going to give us a little bit of a message that we can display when the user first arrives at the application. So here within `home`, let's create our new file, and it's going to be `home.tpl.html`. And then how about we just do a simple `md-content` tag. So within that content, we can actually put our message.

So we'll do an `h1` and let's just say, "Welcome to the Angular auth app." Cool. So then after that, maybe we'll have an `h3`. And within there we can say, "Login from the toolbar above to access your profile." And that'll give us some simple messaging for the home page. And then over here in our profile, we're actually going to need a controller as well. So let's say we want `profile.ctr.js`. 

And then we'll also want our `profile.tpl.html`. So first, let's go through the steps of setting up our controller. So we're going to want our IIFE here, our Immediately Invoked Function expression. So let's do `'use strict'`, to use strict mode. And then we want our module, which we've called `authApp`. And we want to create a controller. This one will be called `profileController`. And let's say that the callback here is going to be pointed to a function called `profileController`.

So we want a function called `profileController` and it's going to need `$http`. We're going to need `$http` to make some requests afterward. And let's bind our local capture variable, so we'll say we want var `vm` for view model. And it's going to be pointing to `this`. And why don't we just test things out for now. So we'll say `vm.message = 'hello'`. We can use that just to make sure everything is coming through properly.

Then over here in our template, for the time being, why don't we just say that we want, maybe, and `h1` and we want to say we want to get our message. All right, so then let's set up our `toolbar` directive. So our directive is going to need two files as well. The first one is going to be for the actual directive code, so we'll say `toolbar.dir.js`. But we also need a template for it, so let's do `toolbar.tpl.html`. 

And then within the directive, let's just set it up in a simple way for now, just again to test things out. So we can come down here. We'll do `'use strict'` again. And then let's do `angular` and we'll do our module `authApp`. This time we want our directive, so it's going to be called `toolbar`. That's how we'll get ahold of it in our templates. And let's pass as a callback a function that we'll define below called `toolbar`.

#### Setting up the Toolbar

So we want a function called `toolbar`, which is going to return an object, our directive definition object. So we will return a template URL. Let's go to `components`, `toolbar`, and `toolbar.tpl.html`. That's the file we just created over here. And then let's give it a controller. And we'll say controller is going to be `toolbarController`, which we'll define below in just a second. And then, of course, we want to use `controller as`, and we'll say we want to use it as `toolbar`.

All right, so that's the directive definition object, the DDO that we need to return for the directive. And so let's put in our controller function now. So function `toolbarController`. And for now, we don't really need too much in here. Let's just leave it as is for the time being. We'll come back to it and put in what we need in just a little while. All right, so then to test things out here in our template, let's get our `md-toolbar` going.

So we can do md toolbar. And within the toolbar, let's do a `div`. We want to give this a class of `md-toolbar-tools`. And then let's give it an `h2` right within there and we'll say that we want to call this "Angular Auth". And then if we come over here and we give it a `span` with some `flex`, then that's going to put some space between this spot within the toolbar, which is going to show up on the left, and whatever we want to have show up on the right side of the toolbar.

So on the right side of the toolbar, let's have some buttons that are going to allow us to control our login and logout. So we want an `md-button`. And let's just put "Login" within that for now. We're going to come back to these and put some conditions on these buttons once we have everything set up. But for now, let's just put "Login" there. And then this one's going to say "Profile". And then let's have our "Logout" button. 

And as I'm sure you're probably thinking, we need to conditionally hide and show these buttons, which we'll get back to you in just a little while. All right, so now of course, we need to come over to our `index.html` and get some references to those files we just created. So let's do a script tag and we'll point first to our directive, maybe. So we'll say we want to get our components folder and we need our toolbar folder within there. And let's grab `toolbar.dir.js`.

#### Setting Up Routing

So there's our directive. And then we also want our `profileController`. So over here, let's call this `profile`. And then we want `profile.ctr`. So what we can do up here now is we can take out our "hello" message. And since we've got our directive coming through, we can just do a toolbar like this. So that will be the top toolbar, but we also need an area where we can have our different views show up that we set up with routing.

So let's have a `div` and let's give it a `layout-padding` attribute, so that's going to give it some padding around it from ng material. And within here, we'll want our `ui-view`. This is going to be where we place all of the different views that come through via our routing. And they will show up right here within this `div`. So to set up routing, we can come over here to our app.js and let's do some configuration now.

We'll want to configure our module, so let's do `config`. And we need to pass it a function. We need some providers now so that we can actually use these different packages that we've pulled in. So firstly, we'll need `provide`. And then we'll also need `authProvider`, so that's going to be the provider that's given by Auth0. For our routing, we'll need `urlRouterProvider`. We'll need `stateProvider` so that we can set up our different states.

We'll also want `httpProvider`, because we need to actually do some HTTP interceptors, which we'll see in a little while. And then finally, we want this provider called the `jwtInterceptorProvider`. All right, so now within the `config` body, what we can do first is just set up our routing. Before we set up any of the authentication pieces, let's just make sure that our routing works. So let's do `urlRouterProvider`. And we want to say effectively anything other than the routing we've set up, we want to send the user to the home route. Then `stateProvider`, let's set up our routing so we can do `stateProvider`. And let's say the first state that we want is going to be the `home` state. And then object that we pass in, we can give it a URL of `/home`. And the template is going to be coming from our `components` directory, and `home` and then `home.tpl.html`.

So then below, we can set up another state and let's call this one `profile`. And the URL for this can just be `/profile`. And then we want a `templateUrl` of `components`. And we want the `profile` directory in this case. We want our `profile.tpl.html`. And I'm just realizing, I forgot to put `templateUrl` here. I just put template, so let's fix that up. And so now the controller for this state, for our `profile` state, let's do `controller as`.

So we'll say controller is going to be `profileController as user`. We'll do an alias of user for this case. Okay, so now we can actually test this out to see if it works. And there's probably a good chance that I've made some mistake somewhere, but let's check things out. So we get our message, we get our welcome message, but we're not getting our toolbar up there. So let's see if we get any error in the console. 

We don't have any errors. Let's see what's going on here. So here, in the directive, I see what it is. I've forgotten to actually execute this immediately invoked function expression. And I bet that I also forgot it over here in the profile controller. Yes, I did. So that's a silly mistake on my part, but just make sure you are actually executing these functions here. All right, so back over here. Let's test it out again.

So if we refresh. There we go. We've got our toolbar coming through and we've got our login, profile, and logout buttons up top. And if we want to, we can try navigating to, say, the profile route. And if we go to the profile route, we don't have anything coming through. And I think what we forgot to do is, over in the template, we forgot to use our alias. So `user.message` is what we need there.

Let's check this out again. There we go. We've got our `hello` message coming through. Okay, so we've got the base of the application set up. In the next lecture, we're actually going to flip over to the backend and set up a really simple server with NodeJS. And then once that's in place, we'll be able to actually flip over and finish up the rest of our Angular app.

<hr>

<h2 id="the-tricky-parts">The Tricky Parts of AngularJS Auth</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/uiQoiuw_6Hg" frameborder="0" allowfullscreen></iframe>

### **Transcript**

#### Setting Up Middleware

Okay, the next thing we're going to want to do is set up our server. So let's head over to the command line, and what we need to do is actually set up a brand new project. We need to set up a separate project for the backend, because remember, our front end and our backends are effectively separated. So we need to go through the `npm init` stages again for a separate project. 

But why don't we keep the same route directory. Let's go into our `angularjs-auth` directory that we've already set up, and let's create a new directory called `server`. So we'll `mkdir server`, and then let's go into `server`. Within `server`, why don't we actually do `npm init` again. So `npm init`. And the name for this one can be kept as `server`, or we can do something like `angularjs-auth-server`. We can keep the defaults here. We'll say okay to that.

And then we need to install the dependencies here. What we'll need are just a few dependencies, so let's install Express. We'll also want express-jwt, which is going to be a package that provides us some middleware that allows us to check for a JSON Web Token when it comes in, and then pass the user through to access the resource they're looking for if they have a valid JWT. And then, because we're doing cross-origin requests, we'll need cors. 

Once that gets installed, let's head back over to our editor, and we can actually set things up in our server directory here. So you see, we've got our `node_modules` and our `package.json` file. Let's set up just one more file that we'll need, and let's call this one `index.js`. 

And then here, within our `index` file, let's `require` the things we'll need. So we're going to need express. So our `var express = require('express')`, and then we can initialize our app. So we can say our `var app = express()`. Then we'll need our JWT middleware, so let's say our `var jwt = require('express-jwt')`. And then, finally, we'll need cors. So our `var cors = require('cors')`. Then after this, the first thing we should actually do is tell our app that it should be using cors. So we can do `app.use(cors())`. 

Then why don't we set up our middleware next? If you're not too familiar with middleware, essentially what it does is it allows us to provide this layer of protection that requests to our endpoints have to pass through in order to get at what they're looking for. This is useful for us, because it allows us to set up some checks before the request is able to pass through to the resource.

So instead of checking within each of our endpoints explicitly, whether the user has a valid JSON Web Token, what we can do is instead set up a middleware once, and then just apply that middleware to our different endpoints. So let's see what that looks like. We can say `var authCheck`. That will be the name of our middleware. We'll say that's equal to `jwt`, which is our middleware package. What we want to do is provide it a configuration object. On this object, what we need is our secret. This is going to come from Auth0. 

The secret keys that come from Auth0 are Base64URL encoded, so we need to actually decode these. So let's do a `new Buffer`, and the first argument to this is going to be our secret. To get the secret, we can go over here to our Auth0 dashboard, and then within our applications that we have listed here, we can go to our default app. And we can just copy over our secret.

I'll be changing this secret key of mine right after this video is done, so there's no sense in trying to use it, just as a heads up. Then after this argument, we need to say `base64`. So that's going to decode it as Base64. And then the next key is going to be our `audience`. The `audience` is going to be our Auth0 Client ID. So we come over here, we can grab our public client ID. We'll copy that over, and we can just put that in as a string.

#### Setting Up the Endpoints

All right, so that's our JWT middleware. And this middleware can now be applied anywhere we want. And we can get a sense of that if we set up some endpoints. This is going to be a really simple app. All we really need are two endpoints, one being public and the other being private, just so we can see how it works when we actually protect our data api.

The first one we'll do is our public endpoint. So we'll do `app.get`, and we want to point this to `api/public`. So a really simple endpoint called `public`, and then let's give a callback that takes a `request` and a `response`. For the `response`, let's respond with some JSON. So we'll do `response.json`, and it's going to be an object that we return with a message. And we'll say, maybe, "Hello, from a public endpoint. You don't need to be authenticated." All right, cool. So that's our public endpoint.

Now, let's just do what is, essentially, almost the same thing, except protected by our middleware for a private endpoint. So up here, let's change this over to private. And within the message now, we can say, "This is going to be a private endpoint." And we do need to be authenticated to see this endpoint. 

Now, all we really need to do to protect this endpoint is pass in our middleware. And the middleware goes as the second argument. So we can pass in `authCheck`, just like that. So now, this endpoint will be protected by our `authCheck` middleware, and it will require that there's an `Authorization` header present before it allows the user to get through to this endpoint.

Then, as the final step, let's just do `app.listen`. We'll listen, maybe, on port 3001. And then, maybe let's just log to the console that everything is working. So we'll say, "Listening on localhost 3001." 

Okay, so now we can test this out to see if it's working properly. So let's go over here to the console, and let's do `node index.js` to fire up the server. We get "Listening on port 3001." And then we can just go over to a new tab, and let's go to localhost 3001. We'll go to `api`, and let's try the `public` endpoint. So there we go. We've got our JSON response. We've got our message coming through just fine.

And if we go to `private` now, what we see is we've got "No authorization token found." So this private endpoint is now protected and not accessible unless the user sends a valid json web token.

So this is really powerful, because now you can set up any kind of private endpoints that you want. You can set up endpoints where you maybe retrieve some data from a database, and only if the user has a valid JWT will they be able to get that data. So the routes are protected. But, of course, now we need to actually get a json web token for our users, and we need to be able to send it from Angular to our back end when we make an HTTP request for these resources.

We'll take a look at how to do that in the next lecture.


<hr>

<script>
$(window).load(function() {
  $('.screencast-anchor').attr('target', '_self');
});
</script>
