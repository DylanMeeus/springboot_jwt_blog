---
layout: post
title: "AngularJS Authentication Screencast Series - Part 3"
description: "Learn how to add JWT authentication to your AngularJS 1.x app"
date: 2016-04-22 08:30
permalink: /2016/04/22/angularjs-authentication-screencast-series-part-3/
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
- 2016-04-25-angularjs-authentication-screencast-series-part-4
- 2015-09-25-incremental-dom
---

> Adding authentication to any single page app comes with a set of challenges, and this includes apps built with AngularJS. Auth0 makes the process a lot easier with some open source libraries for saving and sending JSON Web Tokens, as well as a full authentication service that removes the need to write authentication logic yourself. If you want to get all the details of how to add auth to your AngularJS 1.x app, this screencast series is for you. If you'd like, you can go straight to the [code](https://github.com/auth0-blog/angular-auth) or checkout the [AngularJS + Auth0 docs](https://auth0.com/docs/quickstart/spa/angularjs/no-api).

In the third part of the screencast series, we'll get to work on adding authentication to our Angular application using Auth0. There are a number of things we need to do to make this happen, such as creating a way to let users log in and out of the app, attaching the user's JSON Web Token as an `Authorization` header to HTTP requests, and also setting up some logic to let the Angular app know that the user is authenticated when they have an unexpired JWT.

* **<a class="screencast-anchor" href="#login-logout" target="_self">Login and Logout</a>**
* **<a class="screencast-anchor" href="#authenticated-http-requests" target="_self">Sending Authenticated HTTP Requests</a>**
* **<a class="screencast-anchor" href="#preserving-auth" target="_self">Preserving Auth on the Front End</a>**
* **<a class="screencast-anchor" href="#redirecting-invalid-requests" target="_self">Redirecting on Invalid Requests</a>**

<h2 id="login-logout">Login and Logout</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/WiD3V_gmzA8" frameborder="0" allowfullscreen></iframe>

### **Transcript**

Okay, so we've got the structure of our application for the front end in place. And we've also got a working API now. It's a very simple API built with Express. But we've got our backend working. So now let's actually set up authentication in AngularJS. And like I mentioned, we'll make use of this lock widget that Auth0 provides. So, if you come over here to auth0.com/lock, what you'll see is just a little bit of information about the lock widget. 

And basically, it's a login box that is provided for us without us really needing to do any kind of coding for that login box ourselves. All we really need to do is write a little bit of configuration so that we can make it work for us. And so to get started with this, we'll actually need to use our auth provider that we brought in over here in our app.js file. So this auth provider is given to us from Auth0.

And so what we'll want to do is initialize it with init, and then pass an object that configures it. And on this object, we'll need to pass our domain. And so that's going to be our domain, which we can grab from our application settings over here. We can copy it here and just plug it right in. And then we also need our client ID. So the client ID comes from Auth0 again. That's over here and we can copy that and we can put it in as a string as well.

All right, so we've got our initialization in place for our auth provider. And what we can do now is hop over to our toolbar directive and set up some functions that will take care of logging the user in and also logging them out. And so what we'll need here are a few dependencies. We'll want the auth service that comes from Auth0. And we'll need store, which is from Angular storage.

This is going to let us work with local storage really easily. And then we'll also want location, so this is the location service that comes from AngularJS and it's going to allow us to redirect the user once they log in. Okay, so setting up our controller, we can start with our capture variable. We can do var vm equals this. And then right up top here, let's point to a couple functions that we will create.

We want a login function, so we'll say vm login is equal to a login function that will be coming next. And we want logout as well. It's going to be equal to a logout function. And then let's do this. Let's do vm auth is equal to the auth service. And what will happen here is in the functions we're about to create for logging in and logging out, we'll use this auth service to actually open the lock widget and make that request for logging in. 

And then this auth service is going to hold a few properties for us that will be useful for our template. For instance, it's going to hold a property that will tell us whether or not the user is logged in and that's going to be useful for hiding and showing things. And so we put it here on our capture variable so that we can use it later in our template. All right, so we want a function for logging in and that's our login function here.

And within this login function, we need to call sign in from the auth service. So this auth service provided by Auth0 gives us this sign in method. And within sign in, the first thing that we'll pass is an empty object. And this object is where we can do some configuration for the lock widget if we want to. But we'll just leave it empty for now to get a sense for how this works first. So then we need to pass this callback. And the callback is going to have parameters for a profile and a token.

The profile is going to come back from Auth0 and it's going to be a JSON object that contains our users' profile details. So it's going to have their name and their email and their avatar URL and that sort of thing. And then the token here is going to be their JWT. It's going to be the JSON Web Token that gets returned when the user signs in. So now within this callback, let's define what we want to happen on a successful login.

So what we want to do is we want to set these items in local storage. So we can say store set. We want to set the profile and we'll pass in that profile that comes back from the call to Auth0. And likewise, we want to set our token. So we'll do store set and you can give this a name that you like. Most people do token or ID token, so maybe we'll just do ID token. And this will be the token that comes back.

And so if things are successful here, we can redirect the user to, say, the home page. So this may or may not be the way that you want to set things up in your own application, but it's just an example of what you could do. So we can say location, and we want the path to be home. So that will redirect the user to the home route in this success condition if everything checks out with that login.

Now, the third argument here is going to be another function that's going to handle any kind of error conditions. So we can say that we'll get an error back, and for now let's just log that to the console. You can choose to handle this error however you like, but for now we'll just get that message in the console. All right, and so that is our login function. It's going to make the call to sign in, which comes from the auth service provided by Auth0.

And that is then going to send a request to Auth0's servers and it's going to send the credentials that the user provides into the lock widget, which we'll see in a second. And if everything checks out it's going to set the user's profile and token within local storage. And then we're just, again, logging any possible errors to the console for now. So we've got our login function and we also need a logout function.

So logout goes here. And logging out with JSON Web Tokens really just comes down to removing those tokens from local storage. Now, something to keep in mind is that even if we remove the JWT from local storage, well it's still going to be usable as a token to access the backend for however long that token lives. So, if a token hasn't yet expired, and if somehow somebody was able to get ahold of it, it would still be usable as a token to access resources.

So one of the keys to security here is to say your token is to have kind of a short lifetime, something like an hour. And the lifetime of your token is going to really depend on your application and how secure you need to make it. If you're creating a banking application or something like that, you're going to want a really short-lived token. So this raises the question, if we have a short-lived token does that mean that the user has to sign in every hour or however long the expiry is set for?

And the answer is that by default, yes, they would have to sign in again. But what we can do to get around this is set up token refreshing, which we'll talk about a little bit more later and I'll point you to some resources to see how that works. So that's a bit of an aside, but I just wanted to put some more context and give a bit more description on how logging out with JSON Web Tokens works.

So again, here, all we really need to do to log the user out on the front end is remove their token. So we can do store remove, and we'll say that we want to remove the profile first. And then let's just copy this. And we'll say that we also want to remove the ID token. And then our auth service gives us a sign out method. And this sign out method will just kind of clear the state from the auth service.

And it'll set that property that tells us whether or not the user is authenticated back to false. So for that, we just do auth sign out. And then finally, we'll want to redirect the user to the home route again. So we'll do location and it's a path of home. All right, so now that we've got these methods in place and we've got them sitting on our capture variables here, let's make use of them over here in the template.

So we need to attach ng clicks to each of these buttons. The first one we'll do here is the login. And just for best practice, why don't we do an aria label for accessibility. And this will say login. And then let's do ng click. And this ng click is going to be pointing to that login method. And again, the capture variable is aliased to toolbar. So toolbar login. Okay, so that's for our login button. 

And maybe we can just clean this up a little, just to make this look a little more presentable. So we'll come down here like this. All right, cool. And so on our logout button now, we'll attach that ng click again. So let's come up here, give it an aria label, and we'll say logout. And then ng click is going to point to toolbar logout. All right, so let's see if this works. Let's save that and we'll come over here to the browser again.

And let's check out our app. So we refresh, and if we click login now, what we see is we get the login box popping up. So again, this is great. We didn't need to provide any of our own code to make this login box work. It's nicely designed for us, and really, it's ready to go out of the box. So now what we can do is actually try signing in that user that we created earlier. But the first thing that we'll actually have to do is make a change to the settings within our application in the Auth0 dashboard.

And the change that we need to make is we need to tell it which domains should be allowed to make requests to Auth0. So right now we're testing with local host 8080. So let's copy this here and then over here in our dashboard, let's look for the allowed origins. And we'll just plug that right in. So now we can save those changes. And now if we come back over to our application we can plug in the email for the user that we created and their password.

And let's try logging in. So what we see now is that we got redirected. And now, let's actually take a look into our local storage to see what we've got. So if we come over here to local storage, what we see is we get our ID token. And that is our JSON Web Token. We've also got that object that comes through for our profile. It's got the email address, whether our email was verified or not. And it's also got things like our avatar URL.

So there we go. We have successfully logged our user in. Now, let's try the logout button here to see what happens. If we click the logout up here, everything gets removed from local storage just like we would expect. So like we touched on earlier, we don't want to have all three of these buttons showing up all the time. We want the login button to be present if the user isn't logged in. 

But if they are, we want to have the profile button and the logout button. So let's do some work to actually hide and show these conditionally, given the context. So back over here in vs code, let's head over to the template once again. And what we can do is set up an ng if condition on these buttons. So on our login button, why don't we come down here and we'll say ng if. And we'll say that we want this button to be shown if the user isn't logged in.

So for that, we can use our toolbar alias and we can say auth. And then we can look at the is authenticated property. And that is authenticated property, once again, is on the auth service that Auth0 provides. And it's going to be true or false, depending on whether or not the user has a valid JSON Web Token. So then for our profile and our logout button, it's going to be kind of the same, but just the opposite.

So over here in profile, why don't we actually do the full setup? So we can come over here and give it an aria label of profile. And then right now we can actually link this using ui sreth to the profile area, so ui sreth is going to point to profile. And then we'll give it the if condition. So this time, it's going to be if the user is authenticated, then we want this button to show up. And now we can paste that ng if down here as well.

And I'll just clean this up and make it look a little bit more unified. All right, so everything should be working there. Let's head back over and check it out. So right now, we just get the login button because we don't have anything in local storage. The user is effectively not logged in. But let's see what happens if we do log in. So go login and it remembers our last user that signed in.

It kind of stores their email. So we can just click this button again. So now what we see if we've got the profile and the token in local storage. And our buttons are showing up as they should be here. We've got our profile and we can head over to our profile. Right now, we just have that hello message. And we've got our logout button. Once we click logout, we head back over to the home route, just as we'd expect.

All right, so now we've got tokens coming back to us from Auth0. We're saving them in local storage. And so now the token can be used to get access to our protected resources. We'll take a look at how to send authenticated HTTP requests in the next lecture.

<hr>

<h2 id="authenticated-http-requests">Sending Authenticated HTTP Requests</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/KNzM_bgihHY" frameborder="0" allowfullscreen></iframe>

### **Transcript**

All right, so we've now got our user logged in. We've got their token here in local storage, as well as their profile. So we've got those things in place. Now what we need to do is set things up so that Angular can send our token as an authorization header to access our private resources from our server. So let's maybe just take a step back and talk again about how we're going to access these private resources. So let's take a look at this in Postman. 

So Postman is an application that allows us to send and inspect our HTTP requests really easily. So let's send a get request to the public endpoint. And as you see here, we've got our message coming back. And that's what we would expect. We don't need to have any kind of authentication to get at this message, but if we tried to go to the private endpoint, because we've set up middleware, we get "no authorization token was found". 

And so that's also what we'd expect. We don't want to let just anybody through this private endpoint. So why don't we go ahead and see what it looks like to attach an authorization header? So let's go over to headers here, and we can choose authorization from the list here. And what we want to do is use the Bearer scheme. So this is the scheme that's used along with our authorization header to send our JSON web token. 

So what we need next is to put our token just after this space here. So coming back over to our local storage, let's grab the token and put it next to Bearer here. And we need to get rid of these quotes that show up at the end. That's just how things are stored in local storage. But we don't want to send those through Postman. Back up at the front, we'll get rid of that first quote. And now, if we send this request again, we see "Hello from a private endpoint. 

You do need to be authenticated." And the reason we're getting through, the reason we're passing through that JWT authentication middleware is because we've got our token as an authorization header here. So now what we need is a way for Angular to attach authorization headers for us when we make our HTTP requests. And to do that, we're actually going to need to make use of this JWT interceptor provider that we see here. 

And to get a sense for what this JWT interceptor provider does, let's head over to the Node modules folder here. Let's go to Angular JWT. And then within Angular JWT.js, let's take a look at this JWT interceptor provider right here. And the way that this works is it makes use of Angular's HTTP interceptors. So and HTTP interceptor in Angular is basically a way for requests to be intercepted and transformed before they go out. 

And likewise, when responses come back, they can be intercepted and transformed as well. And the transformation that we want to make in this case is that we want to attach our JWT as an authorization header before the request goes out. And essentially, what this gives us is a way to have our JWT authorization header automatically attach to all our requests. So let's configure things with our JWT interceptor provider. 

Back over in app.js, let's come over here and we want to do JWT interceptor provider and we need to set the token getter function, so token getter. It's going to be equal to a function that has ahold of Angular storage, so we want to inject store there. And all we want to do is return the JWT from local storage. So we'll say return store get ID token. And so this will go to local storage and it will return that token and give it to the JWT interceptor provider to attach as an authorization header on our requests. 

So now that we've got our configuration set up here, we actually need to push this interceptor onto the array of HTTP interceptors that comes from Angular. So down below here, let's go down just to the bottom here, under our stay provider. And let's tap into HTTP provider. And we'll say that we want the interceptor's array and we want to push onto it our JWT interceptor. And so just a note here, we're actually pushing on the JWT interceptor, which is the name of the interceptor as defined in Angular JWT and not actually the provider that we just configured. 

Okay, so let's save that. And now what we can do is start working on our profile. So if we come back over here to our profile controller. So we've got our message coming through right now in our controller. Let's get rid of that. And let's give this controller a few more things. We're going to want a couple functions to get our messages. So let's do vm get message and that's going to be a function that we'll define in just a second that is going to be responsible for going to our public endpoint and getting our public message. 

And then we're going to want a very similar function down below, but this one is going to get secret messages. So in this case, we'll say we want to get secret message. All right, so then we want a property that's going to hold our messages. So we can say "vm.message" and that's going to be where we assign the data that comes back from the endpoint. And now why don't we set up the profile for our users? So we'll have a profile property. 

And let's say that we'll go to store get profile to get our user's profile. And we need to inject store up here to make use of it. So this will get the profile object from local storage. And now this profile is going to give us access to properties like the user's nickname and their email and their profile photo so we can use that in our template. All right, so let's set up our functions now for getting our messages. 

The first one is going to be the one for getting public messages, so we'll say "get message". And what we'll do is we'll make an HTTP request. We'll do an HTTP get request to our HTTP local host 3001, API public endpoint. So now before we actually go handle the response for this, what we can do is set up some configuration that tells HTTP not to include the authorization header in this case. 

Remember, this is going to our public endpoint and we don't really need to send our JWT to that endpoint. We could, and it wouldn't really hurt a whole lot, but we might as well forego it. It'll save us a bit of room in the request that goes out. So let's put in skip authorization as true here. So now we can use the promise response to get ahold of the data that comes back. So we'll put in a function that has a response. 

And then let's set vm message equal to the response data message. So this message property is going to be coming back from the data in the response, and it will be assigned to vm message. And then let's not worry too much about handling errors just for the time being. We'll come down here and we'll say function get secret message and that's going to be much the same thing, except this time we won't skip authorization because for this endpoint we're actually going to need that authorization header to be present. 

So let's do HTTP get. It'll go to HTTP local host 3001. And it's going to go to API private. And now what we can do, because we're not passing any kind of configuration to skip the authorization header, let's do then we'll get our function in there with a response. And the response can, again, be assigned to vm message. Vm message equals response data message. All right, so that looks pretty good. I think we're all set here in our controller. So let's save that. 

And now let's do some work in our template. So we can get rid of this message that we had coming through earlier. And now let's use some of the features from Angular material to set up our page. So we want the outer element to be md content. And within that element, let's set a class. Let's give it md padding. And that's going to put some padding around everything. And we'll set layout as column. And this will align things in a column fashion. 

Within md content, let's give it a card. We want an md card. And in there we want md card title. And then md card title media. Then, within this element, let's give it a div and let's give it a class of md media, and also card media. We'll want layout padding as an attribute there. And this is where we can put the image for our user. So we'll want an image tag and we'll use the ng source directive. And the length that we want here is going to come from our user profile picture. 

So we've got this picture property coming from our user's profile and that's the link to their avatar. Then, within the alt for now, let's just give it a profile picture. And that'll be good for now. All right, so then down below here, let's give it md card actions. And we'll want layout as column in this case, so layout column. And then let's give it some alignment, so layout align should be end center. 

And this is the spot within the md card actions where we can put some buttons for getting our messages. So let's do an md button and this one will be get message. And then the ng click within here can be pointing to our get message function. So we'll do ng click and that'll point to user get message. Now we can just copy this button over and paste it below. And this will be for our secret message, so we'll say get secret message there and get secret message there as well. 

All right, down below the md card title media, let's put in another element. This one is going to be md card title text, so md card title text. And within this element, let's put in some user info and also this will be the spot where we can put our message. So let's maybe put a span here and let's give it a class of md headline. And then within the span we can just template out our user's nickname, so it'll be user profile nickname. And then let's go down below. 

We'll give it a span with a class of subhead now. And in this case, let's template out the user's email, so user profile email. And then finally, below, we can maybe give it an H3 and this is where we can put the message that comes through, so this will be user message. So these properties, nickname and email, they're coming from the profile that we set up, which is coming from local storage. 

And then the message that comes through here is what's being assigned to that message property as the result of the HTTP requests that go through from the click of these buttons here. So let's check this out. Let's see if everything works out. We'll come over to Chrome and go back to our application, give it a refresh. And as you see here, everything's coming through. The profile photo is quite large so we can fix that up. 

What we'll do is we'll come over and let's just tack on large there. So let's come back over and that should shrink things up well. It does. And so now we've got our photo, our nickname, and also the email coming through in our profile area. And so now let's check to see if our requests go through. If we hit get message, we see we've got our message coming back. And then if we test out our secret message, we click secret message, there we go. 

We've got our private endpoint's message coming through. And why don't we actually take a look at that request that just went out. Over here in the network tab, if we take a look at the latest request there it is, our authorization header with the Bearer scheme and our JSON web token. Okay, so we've got the user's profile information coming through and we also have a way to get at our private endpoints with our JSON web token, but there's still a problem with our Angular app. 

And that is if somebody refreshes the page, what happens here is that we kind of lose our state. We've got our login button back now because that is authenticated Boolean from the auth service kind of gets reset. And so this obviously isn't what we want to happen. We want to persist our state. We want to let the application know that the user is still authenticated. We can set up some logic to do that and we'll take a look at it in the next lecture.

<hr>

<h2 id="preserving-auth">Preserving Auth on the Front End</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/-_QubA7rpcg" frameborder="0" allowfullscreen></iframe>

### **Transcript**

All right, so we're in a pretty good spot here with our application. We've got authentication happening with Auth0, so we can login and we can get a JSON Web Token for our user and get their profile saved here in local storage. But the problem is if we go to refresh, what we see is that our state goes away. So you'll see here that the profile and the logout button go away because that is authenticated Boolean that is sitting on the auth service gets flipped to its default, which is false.

Now, ideally, in an AngularJS app, there wouldn't really be a whole lot of page refreshing happening, but it might be necessary from time to time. And if the user goes away from the app, if they close their tab and then come back to it, and if they still do have a valid JWT in local storage, they're going to be prompted to login once again. And so obviously, this isn't really a very good user experience.

So why don't we take some time to fix that up? And what we can do is we can put in some code that watches for any changes to the location we're at in our application. So right now, we're at the home route, for example. And we can also go to the profile route. It's going to watch for any changes to that location and when that location changes, we'll have the app check for whether or not the user still has a valid JWT in local storage.

And if they do, we'll just make sure that the Angular app knows that they are authenticated. So let's head over here to our app.js file. And to make this happen, we'll need to tap into the run block for our application. So we've got our config block happening here, and it's setting up our auth provider and then also all of our routing and everything. And here in the run block, we can define some logic that we want to have happen after the application is running.

So run takes a function, and it's here that we can inject any dependencies that we'll need to make this block of code work. So we're going to need route scope. That is going to be the spot at which we look for changes to our app's location. And then we'll also want our auth service and we'll need store. Then we'll need JWT helper. And that's a service coming from Angular JWT that gives us some tools for inspecting JSON Web Tokens.

And then finally, let's get location. So again, that will allow us to navigate to a different spot in our application. So then within the body here, what we'll do is we'll watch for changes to the location. And the way that we can do that is we can use the route scope on method. So we'll do route scope $ on. And that's going to accept the name of an event to watch for. So we want to watch for location change start.

So this event, this location change start event, gets fired any time that we move to a new spot within our application, any time the routing changes. And this event's also going to happen any time the page gets refreshed so we can use it to check for the user's authentication state. So then the second parameter is our callback. And so we'll just define some logic within this block here that says let's look for a token. So we'll do var token equals store get ID token. 

And then we'll say if there is a token, if that was successful in grabbing a token, then we want to check for whether or not it is expired. So we'll do another if block here and we'll say if that token is not expired, and we can do that by doing JWT helper. Is token expired? And we'll pass in our token. If that's the case, and also if the user is not authenticated, and we can check that with our auth service, auth is authenticated, what we want to do is authenticate the user.

So what we can do for that is use our auth service and call authenticate. And we can pass in our profile, so we can do store get profile. And then the second argument is going to be the token, so we can just pass in our token like that. So there's a fair bit going on here, so let's step through it one line at a time. So we're looking for a token called ID token in our local storage. And if that is present, we want to check whether or not it is expired. 

So we can use the JWT helper is token expired method, passing in our token. If the JWT is not expired, and if the user is not authenticated, then we want to go ahead and authenticate the user. The reason being, that if a token isn't expired, well, the user is effectively authenticated as far as the application is concerned. So that's all going to take place if there's a token, but if there's not, let's define some other behavior.

The other behavior simply being that we want to redirect the user to the home route so that they can login again. So for that, we'll do location and we'll go to the path of home. Okay, so why don't we save that? And let's go over and see if this is going to work. So, the first thing I'll do is just delete our items here from local storage. And we'll go through the step of logging in again. Let's go back to the home route here and let's do login.

And then we'll login with our user. So we've got our items in local storage. Now, let's go to the profile and let's try refreshing. And so when we refresh, now you see that we've still got our profile and our logout button up here. So our state is being preserved. We've gone through the process of checking for our user's JWT in local storage. And if it's there and it's valid, well we just use it to authenticate the user on the front end again.

Notice here that we're not doing any kind of request to Auth0 to check for a new JSON Web Token or anything. We're just dealing with the front end. And if we check our get message buttons here, we can do a regular public message. And that still works. And then if we do a secret message, we see that still works. But now, here's a scenario that we should think about. What happens if we're here in our application and it's working just fine, and then all of a sudden our token expires?

Well, we aren't redirected or anything. We're rather still here at our profile area. What happens if we go to, say, get a secret message? Well, that request will go through and it will, of course, attach this JSON Web Token in local storage. But on the backend it's going to be rejected because it will be expired. And what will happen is we'll get some kind of 400 series error back. Now, what's the best way to handle this on the Angular side?

Well, we can either show a message to the user saying that their token is expired, but that's not really all that intuitive, I don't think, for most users. I think probably the better option would be to redirect the user to wherever they can login again. And in our application, that's going to be the home route. So we want to redirect the user to the home route, and then have them login again from here. And we can do that by wiring up an HTTP interceptor. We'll do that in the next lecture.

<hr>

<h2 id="redirecting-invalid-requests">Redirecting on Invalid Requests</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/MVdxw94R5vU" frameborder="0" allowfullscreen></iframe>

### **Transcript**

Okay, so we need some way to handle the case where a user makes a request to the server with a JSON Web Token that is no longer valid. Maybe it expired or somebody tried tampering with it so the digital signature can no longer be verified. Whatever the case might be, it would signal to us that the user needs to login again. And what we can do to handle this is register an HTTP interceptor that looks for a status code, like a 401, for example.

And if that status code is received, it will sign the user out on the front end and redirect them to the home route where they can login again. So let's set up that interceptor. We'll go back over here to our app.js file. And let's set up the interceptor in the config block. So let's come down just above this HTTP provider here. And this is where we can create a function to register the interceptor. 

So we'll call it redirect. So function redirect. And this will take any dependencies that we need to inject. We're going to need Q, which is the async service from AngularJS. We'll need Angular's injector. And then we're going to need our auth service and our store service. And then also, once again, location. All right, so here in the function body is where we actually set the interceptor up. 

And what we'll do is return an object. So this object is going to have a response error, so response error goes here as the first property. And that's going to be a function. And this will receive a rejection if there's one present, so that can go in as our parameter to our function. And what we want to check for is if we get a rejection, so if a rejection comes through in the response, and if the status of that rejection is 401, so if the server tells us that we're not authorized, well then we can go auth signout.

And that will set the user's authentication status in our auth service to false. And then we also want to remove the items in local storage so we'll remove the profile and we'll also remove the ID token. And then we want to send the user back to the home route, so we'll do location path home. And that, of course, will be the spot from which they can again login. And so this function is going to need to return something. And what we need to do is return a rejection from Q.

So we'll do return Q reject the rejection. Okay, so we've wired up what we want to happen when a 401 rejection comes back, but we still need to let Angular know about this interceptor. And to make that happen, we first need to create a factory out of it. So we can use the provide service that we injected up here, and we can use the factory method to create a quick factory. So we want to create a factory called redirect.

And that is going to take our redirect function. And now, with this redirect factory in place, we can actually push it onto the array of HTTP interceptors. So we'll just copy this, paste it here, and let's push onto it this redirect factory. Okay, so let's see if this all works now in our application. Back over here at our app, let's logout and then let's refresh. And we'll login once again.

So we've got our JSON Web Token and our profile. Now, let's go to the profile page and we can get a secret message. And that goes through as we'd expect. And what we'll do now is we'll say, maybe, tamper with the JSON Web Token a little bit. Let's remove just one letter. And the way that our Angular storage library works is it actually caches what we have here in local storage. So, just to see the effects of this, let's refresh one more time.

And now, let's send a request. We'll do get secret message. And as you see, we get redirected here to the home route. And if we take a look at some other areas here in our dev tools, we can see we've got our 401 error being reported in the console. And then if we take a look at the network tab, in the requests that went through we see we've got our 401 unauthorized error. So now, anytime that the JSON Web Token gets expired, whenever the user makes a request with it and that request inevitably gets rejected, it will send the user to the home route so that they can go in and login again.

So, as far as the Angular side goes, we've pretty much got all of our bases covered for handling authentication. In the next lecture, we'll cover some more of the features that Auth0 provides and we'll see how to get up and running with social login, and also multi-factor authentication.

<hr>

<script>
$(window).load(function() {
  $('.screencast-anchor').attr('target', '_self');
});
</script>
