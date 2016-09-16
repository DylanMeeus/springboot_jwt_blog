---
layout: post
title: "AngularJS Authentication Screencast Series - Part 1"
description: 'Learn how to add JWT authentication to your AngularJS 1.x app'
date: 2016-04-15 08:30
alias: /2016/04/15/angularjs-authentication-screencast-series-part-1/
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
- 2016-04-20-angularjs-authentication-screencast-series-part-2
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2016-01-07-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest
---

> Adding authentication to any single page app comes with a set of challenges, and this includes apps built with AngularJS. Auth0 makes the process a lot easier with some open source libraries for saving and sending JSON Web Tokens, as well as a full authentication service that removes the need to write authentication logic yourself. If you want to get all the details of how to add auth to your AngularJS 1.x app, this screencast series is for you. If you'd like, you can go straight to the [code](https://github.com/auth0-blog/angular-auth) or checkout the [AngularJS + Auth0 docs](https://auth0.com/docs/quickstart/spa/angularjs/no-api).

In the first part of the screencast series, we'll take a look at how authentication works for round-trip apps, and the challenges that exist when it comes to using these traditional methods in single page apps. We'll then learn about [JSON Web Tokens](https://jwt.io/introduction), which provide a better way to do [authentication in AngularJS apps](https://auth0.com/learn/angularjs-authentication/).

* **<a class="screencast-anchor" href="#what-well-build" target="_self">What We'll Build</a>**
* **<a class="screencast-anchor" href="#traditional-authentication" target="_self">Traditional Authentication</a>**
* **<a class="screencast-anchor" href="#the-tricky-parts" target="_self">The Tricky Parts of AngularJS Auth</a>**
* **<a class="screencast-anchor" href="#json-web-tokens" target="_self">JSON Web Tokens</a>**

<h2 id="what-well-build">What We'll Build</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/RuubsWkjwrM" frameborder="0" allowfullscreen></iframe>

### **Transcript**

So this course is going to cover all about how to authenticate our angular apps with JSON Web Tokens and we're going to use Auth0 to do this.

So this is a service that provides a really nice login box that's ready to go. And really all we need to do is provide some functions to our application to tie into the service. And once we've done that, we'll be able to get our users' profile and their token, and save those in local storage. And then we can use the token to make requests for secured resources on our server.

So this is what the application will look like in the end. Now let's dive right in and get started.

<hr>

<h2 id="traditional-authentication">Traditional Authentication</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/V_9XLxOGXp8" frameborder="0" allowfullscreen></iframe>

### **Transcript**

To lay the ground work for this course, let's take a look at how authentication is done in what I'll call a traditional web app. A traditional web app has a lot of definitions. I'll think of it as an application where the user has to refresh the page to get some new data or to send data to the server. If the user comes to your website or your web app and they want to submit some data to be saved in the database, when they do that to get a response back, they actually have to go through a full page refresh. Likewise, when they want to get some new data from the server, they actually have to refresh the page to get that data. 

We're probably all quite familiar with this. This is kind of how the web was built. You have to send a request and refresh the page to get new stuff. As you probably know, since you're working with Angular, it's a framework for building what we call single page apps. The single page app, of course, is one where you don't have to go through that full page refresh to submit data or to get new data. Single page apps actually send and receive data through XHR requests which happen behind the scenes. What we get with that ultimately is the feel of a native desktop application which makes for a much nicer user experience. That's probably why you're building applications with Angular. You want to have that snappy fluid desktop-like feel. 

Back to authentication. How does it actually happen in a traditional web app? Typically it looks like this. The user will come to your application. They will log in with their credentials, their user name and their password. Those credentials get submitted and sent to the server where they're checked against a database. If everything matches up, a session gets created on the backend (on the server) for that user. The session is this piece of data that the server can use to know that the user is authenticated. Now when the user needs to navigate to another spot in the application, let's say they go to their profile page next (and that happens through a round trip request), the server is able to know that the user is authenticated. 

This raises the question: how does the server actually know who it is that's making these requests for data. It would seem that the server needs some way to actually be able to verify that the user who has sent the request is the user that's actually authenticated. 

This is where cookies come in. You might be familiar with cookies. These are the small pieces of data that get saved in the user's browser. Cookies actually get automatically sent to the server on every request to it. Since cookies hold pieces of information, what we can do is have that cookie store an identifier for the user. This is typically what happens. When the user's authentication is valid, the response that comes back to them contains a cookie that gets saved. This cookie has an identifier for that user. Then, the cookie automatically gets sent to the server whenever the user navigates to another page. It's the cookie's information that gets verified against the session that tells the server whether or not that user is who they say they are. The server is then able to know that the user should still be authenticated when that session exists on it. Because this happens automatically, the user doesn't need to send their credentials every time and their credentials don't need to be checked against the database every time they make a request, or at least not until the cookie has expired. 

This method of authentication works pretty well for traditional web apps (for those that require the full page refresh), but there are some limitations to using cookies and sessions together for modern applications like the ones that we build with AngularJS. We'll talk about what those limitations are and how to get around them in the next lecture.

<hr>

<h2 id="the-tricky-parts">The Tricky Parts of AngularJS Auth</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/AglJkyH1dt0" frameborder="0" allowfullscreen></iframe>

### **Transcript**

So if you've worked with Angular for any amount of time, you're probably aware that one of the best ways to work with a backend is through a data API, and in particular, a data API that accepts and returns JSON data. Now, this obviously isn't the only way that we can work with data in our Angular application, but it's ultimately one of the easiest and most flexible ways to go about it.

So when we do this, what we're effectively doing is we're building two different applications, two distinct and separate apps. And one of them is for the client side. That's the Angular application. And it's really just concerned with the user's browser. And then we have our server side application, which is built with something like Node.js or Ruby on Rails or PHP or whatever server side language or framework we like.

And then we connect these two applications through a data API. And that communication happens via XHR requests from the client to the server. So when we build our data API, chances are that we're going to want to build a RESTful API. And one of the core tenets of REST is that things should be stateless. And so what this means is that when we construct a request that goes to our API, that request should always return the same resource.

And with traditional roundtrip authentication where we set up sessions to check if the user is authenticated, well that sets up some state on our server, which can effectively change the result that we get back for a given request. And so this breaks that core tenet or REST being stateless. And then there's some issues related to how modern application ecosystems work. And so things are changing with the way that we build and distribute applications these days, and this has some implications for authentication.

So for instance, we can't easily share a user's session across multiple servers. What we're seeing more and more these days is that an application is not going to use just a single server for all of its resources and all of the things it needs to do, but rather it's going to rely on multiple different servers. So with traditional authentication, everything works fine if we have just a single server, but as soon as we get more than one involved, then things get tricky.

There are ways to share sessions across different servers, but it's not really easily done. Another issue is that cookies don't flow downstream. So another pattern that we're starting to see in modern application development is that our server--our application server--might rely on a downstream server or multiple downstream servers to get its work done. Now, the problem with this is that since we need cookies to properly authenticate in a traditional authentication setup, well, cookies can't flow to those downstream servers so we can't really go beyond our single application server.

And then we ultimately want to be able to share our API across different applications. We want to be able to write an application for the web and then maybe also a mobile application. And then, who knows, maybe even a desktop app. But we don't want to have to rely on different data resources for each of those applications. Instead, what we want to be able to do is use that same API across our different apps. And with traditional authentication, this is just pretty tricky when we have to deal with cookies.

So those are some of the issues that are more related to the server side, but what about the front end? What about Angular in particular? Well, like we talked about, in a good Angular setup, our Angular app doesn't have any kind of stateful connection to a backend. Rather, it's going to fulfill its data needs, whatever those needs may be, for sending data or receiving data, through XHR requests to the API.

And so because of this, because of this statelessness, we need to take some things into consideration. So firstly, we need to be able to limit access to certain routes in our Angular app. So certain parts of the application should only be accessible to users who are authenticated. This is just sensible application design. So even though we don't have any kind of stateful authentication going on, we still need to make it possible for Angular to know that a user is logged in or not.

We also need to be able to show or hide certain parts of the user interface depending on the user's authentication state. So for example, we might have a spot in our navbar where the user's name and profile photo show up. Well, we need to be able to either hide or show that depending on whether or not the user is logged in. So again, Angular isn't connected in a stateful way to a backend. 

And given this, how can Angular know whether or not the user is authenticated if there's no kind of session or stateful connection made? And even more fundamentally, how are we able to do any authentication at all if we don't involve sessions and cookies and state? Well, it turns out there's a really nice way to do this with a newer standard called the JSON Web Token. And we'll talk about the JSON Web Token and what it's all about in the next lecture.

<hr>

<h2 id="json-web-tokens">JSON Web Tokens</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/LLWX1Cd8vJ0" frameborder="0" allowfullscreen></iframe>

### **Transcript**

So what exactly is a JSON Web Token? Well it's an open standard under RFC that describes a way to transmit what are known as claims between two parties in a secure way. Now that's a mouthful, so let's break it down. 

Essentially, JWTs communicate JSON objects, and one of the objects in them is a set of claims. So what exactly is a claim? Well put simply, it's a piece of information that is asserted about a subject. And for the case of authentication, the subject is the user. 

So what exactly does a JWT look like? Well here's an example. And as you can see here, this doesn't really mean a whole lot to us as humans, and that's because JWTs are encoded. And in fact, there are three distinct parts that are each encoded as you might have guessed here by this dot separator. 

All right, so why don't we take a look at what a decoded JWT looks like so that we can see what's going on with these three parts. Okay so I'm over here at jwt.io, and this is a website made by Auth0 that gives us some really nice resources and information about JSON Web Tokens and also a really nice debugging tool so that we can actually inspect our tokens. 

So over here on the left, we can drop in and encode a JWT. And then over here on the right, we get the decoded values from it. And this actually reveals to us the three different parts on the token. We've got a header, a payload, and a signature. So let's run through each of these three parts. 

The header contains information about the algorithm and the token type. And so we can see here, our algorithm that we're going to be using is HS256 and the type is JWT for "JSON Web Token". 

Now the payload is where we actually store the claims that we were talking about. So those claims--being assertions about a subject--are going to be stored in this object within the payload. And there are certain claims that are registered with the JWT specification, and these are claims like `sub` for subject, which in this case is our username of John Doe, and `iat` for issued at, that's the time that the token was issued at, and also `exp` for expiry and this gives us an expiry time for the token so that we can limit how long it can be used for. 

And then we've also got claims that we can define our self. So we can provide claims like `name`, and `admin`, and those can be any kind of arbitrary keys and values that we like. Now we aren't forced to use any of the registered claims, and we can provide any kind of arbitrary claims that we want within the payload as well. So this gets really useful for transferring information. 

Now the header and the payload obviously look different over here in the encoded JWT than they do over in the decoded JWT and that's because each of these is Base64 URL encoded. So the objects are encoded and then they're tacked together with this dot separator. 

We also see down here in the signature what looks to be encoding but it's actually a bit different. So what's happening in the signature is that we're taking the encoded header, plus the encoded payload, plus a secret--so this will be a secret that lives on our server--and then we're hashing that using the HS256 algorithm. And so what this does is it effectively secures or digitally signs our token because as long as we have an unguessable secret key, we can be sure that the information within the JSON Web Token doesn't get tampered with.

So obviously the key that we see here which is just the word "secret" isn't all that secure. In reality, we would want a long and unguessable secret key. 

Okay so that's what JSON Web Tokens look like but how are they used for authentication in Angular apps? Well essentially what we need to make that possible is a way for the user to send their credentials to a server and then receive a JSON Web Token back if everything checks out. And then on every subsequent request that gets made to the server for secured resources, the user sends the JSON Web Token back. 

And then back at the server it can be checked against that secret key and be verified. And so how does the user send the JWT back to the server once they have it? Well what we do is we attach it as an `Authorization` header using the `Bearer` scheme. So HTTP requests just need to attach an extra header, which is the JWT and that gives us a way to authenticate and verify our user's identity. 

So that covers what JSON Web Tokens are and how they work. Now that we have that understanding, let's start implementing it in an angular application.

<script>
$(window).load(function() {
  $('.screencast-anchor').attr('target', '_self');
});
</script>
