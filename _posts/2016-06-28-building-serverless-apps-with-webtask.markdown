---
layout: post
title: "Building Serverless Apps with Webtask.io"
description: "Webtask is Function-as-a-Service platform for building serverless apps. Learn how to build applications without worrying about servers, and common use-cases where serverless shines."
date: 2016-06-28 08:30
alias: /2016/06/28/building-serverless-apps-with-webtask/
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#5F3237"
  image: "https://cdn.auth0.com/blog/webtask/logo.png"
tags:
- Serverless
- Webtask
- Webtask.io
- Function-as-a-Service
- faas
- Serverless-Authentication
related:
- 2016-06-09-what-is-serverless
- 2015-10-07-extensibility-through-code-using-webtasks
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
---

---

**TL;DR** Webtask.io allows you to build applications without thinking about infrastructure. Simply write your server-side logic, deploy your functions via the Webtask CLI, and access your serverless backend over HTTP. Preferring code to configuration, the Webtask platform comes with a familiar programming model, excellent authentication and authorization support, and more to ensure a pleasant development experience.

For our tutorial today, we'll enhance a static blog with some dynamic functionality that would normally require a traditional backend. Check out the [Github repo](https://github.com/auth0-blog/serverless-stories) for the code to follow along.

---

[Webtask.io](https://webtask.io) is a Function-as-a-Service (FaaS) platform that allows you to build serverless applications. Built by the team that brought you Auth0, Webtask features a familiar programming model, an easy to use CLI and a powerful infrastructure to help you accomplish your goals.

Webtasks are secure, self-contained functions accessed over the HTTPS protocol that perform server-side logic. With Webtasks, you can securely call APIs that require secret keys, set up webhooks that get triggered after certain actions in your application are performed, or talk directly to your existing database or backend just to name a few. The power of serverless computing is that it is there for you when you need it and out of the way when you don't.

## Serverless? Function as a Service? What?

Serverless computing is a fairly recent trend is software development that allows developers to focus on writing application logic and not worry about provisioning and managing servers. It's akin to the Platform-as-a-Service (PaaS) architecture where a company provides an API that developers use to accomplish their goals. In fact, serverless computing is a level of abstraction higher than the traditional PaaS - and is often referred to as Function-as-a-Service.

Serverless, and by extension Webtask, is there for you when you need it and out of the way when you don't. You can extend your current backend with Webtask, build your entire backend around Webtask functions and never provision any servers or set up infrastructure yourself, or use it for more specialized cases such as webhooks. To learn more about serverless computing, check out this [blog post](https://auth0.com/blog/2016/06/09/what-is-serverless/).

## Serverless Use Cases

Serverless and FaaS can prove useful in various use-cases. If you are building a static website, but would like to add the ability to capture user emails for a newsletter, you would either need to setup a backend or register with a 3rd party email service and use their widget or API to capture emails. If a 3rd party API you want to use requires secret keys, you would have to build a backend so that you could safely make calls to the API. Webtasks, like other first class backends, allow the developer to create a trust boundary between the client and server.

## Building a Serverless App with Webtask

Today we will build a serverless application. The app we are building is a blog called Serverless Stories, where the authors write about the latest and greatest serverless trends. Before we get started, let's look at **why** a blog might be a great fit for serverless.

### The Problem

Blogs tend to have large spikes in traffic when breaking news happen. Many blogs are hosted on small budgets, often on shared hosting providers and more often than not on a Content Management System like Wordpress which requires a backend and database. As soon as traffic spikes, the blog crashes and burns. It's such a common occurrence that we even have a phrase for it: [slashdot effect](https://en.wikipedia.org/wiki/Slashdot_effect) - or more recently Reddit hug of death.

### The Solution

With these assumptions in mind, our Serverless Stories blog will be completely static, but we'll augment it with Webtasks to add functionality readers have come to expect. Our Serverless Stories blog could use any number of static site generators, like [Jekyll](https://jekyllrb.com/) or [Hugo](https://gohugo.io/), or it could be totally hand-crafted - we're crazy like that sometimes.

Our blog is comprised of HTML, CSS and JS files. We don't have a backend nor do we rely on a database. This makes our website much more resilient when a traffic surge occurs. A static site is simply not enough in the modern day though. We will add the ability to allow users to sign up for our newsletter. Normally, this would require a backend system, but we'll accomplish it with Webtasks. Let's get started.

## Serverless Stories

![Serverless Stories Homepage](https://cdn.auth0.com/blog/webtask/app.png)

Our blog has three views. The **homepage**, where we can see a list of stories and subscribe to the newsletter. An **article** page, which contains the full content for each article. Finally, a secret **admin** page, where authenticated users can see who has subscribed to the newsletter. We'll use [Bootstrap](http://getbootstrap.com/) to help us build out a clean UI.

We will omit the HTML code for brevity. Pull the code from the [Github repo](https://github.com/auth0-blog/serverless-stories) to follow along.

## Adding Functionality with Webtasks

With our static blog up and running, it's time to add some dynamic functionality. The Webtask we are creating is called Newsletter. We have two goals to achieve: add the ability to capture a users email address and display an authenticated user the list of subscribers.

### Getting Started with Webtask

To start working with Webtasks we will need to install the Webtask CLI. You will need [Node.js](https://nodejs.org/en/) and [npm](https://npmjs.com) installed on your machine, then run the `npm install wt-cli -g` command. This will install the Webtask CLI globally so you can access it from anywhere on your computer. Once the install is complete, run the `wt -v` command to ensure that Webtask is properly working. If it is, you'll get the current version, which as of this article is 3.1.0.

{% include tweet_quote.html quote_text="Write your application logic. Run wt create webtask_name. Done. You can deploy a Webtask faster than it took to write this tweet." %}

With the Webtask CLI installed, our next step is to get a Webtask account. To get an account, run the `wt init` command. You will prompted to enter a phone number or email address. Once you provide a phone number or email address, you'll get a confirmation code. Input this confirmation code, and you will be ready to start creating Webtasks.

In the future, if you want to log in to a different account, run the `wt init` command and you'll have the option to login with a new account.

### Webtask Programming Model

If you've ever worked with Node.js, you should feel right at home writing Webtasks. Each webtask exports a single function (which is the typical unit of logic in Function-as-a-Service). There are [several](https://webtask.io/docs/model) programming models supported. The simplest programming model is a function that accepts a single parameter - a callback. An example of this would be:

```js
module.exports = function(callback){
  // Prints the message "Hello Webtask" when accessed
  callback(null, "Hello Webtask");
}
```

Next, a more advanced programming model that accepts two parameters: `context` and `callback`. The `context` parameter is a JavaScript object that contains various properties such as `query`, `secrets`, `body`. The `context` parameter also offers access to the `context.storage.get` and `context.storage.set` API which allow access to Webtasks durable storage. An example of a Webtask using this programming model:

```js
module.exports = function(context, callback){
  var name = context.query.name;
  // Prints the message "Hello {name}", where the {name} is the contents of the name query string.
  // If no name query string is provided then it will simply print "Hello"
  callback(null, "Hello " + name);
}
```

Finally, the most advanced programming model gives us full control over the HTTP request and response. This model takes three parameters: `context`, `request`, `response`. An example of a Webtask using this programming model:

```js
module.exports = function(context, request, response){
  response.writeHead(200, { 'Content-Type': 'text/html '});
  response.end('<h1>Hello Webtask!</h1>');
}
```

These three programming options give you flexibility to decide on just how much control you need.

### Our First Webtask - Newsletter Email Capture

Our first Webtask will capture and save a users email address. To create this Webtask, create a file called `newsletter.js`. Our implementation is below:

```js
// We can use over 800 of the most popular JavaScript modules.
// Get the full list here https://tehsis.github.io/webtaskio-canirequire/
// If the module you need is not here, you can manually bundle it with
// https://github.com/auth0/webtask-bundle
var _ = require('lodash');

// We'll set up some generic response messages based on what our Webtask does
const RESPONSE = {
  OK : {
    status : "ok",
    message: "You have successfully subscribed to the newsletter!",
  },
  DUPLICATE : {
    status : "error",
    message : "You are already subscribed."
  },
  ERROR : {
    status : "error",
    message: "Something went wrong. Please try again."
  }
};

// We'll use the programming model where we...
module.exports = function(context, cb){
  // We use the context to extract the email query string.
  var email = context.query.email;

  // If we get an email, we proceed, otherwise we stop execution and send error message
  if(email){
    // Each Webtask comes with 500kb of storage
    // You can store any valid JSON in this storage variable
    // Useful for when you just need to store a small amount and setting up an external database would be overkill
    // Here we retrieve the contents of the storage
    context.storage.get(function(err, data){
      if(err){
        cb(null, RESPONSE.ERROR);
      }

      data = data || [];

      // We use the lodash library we required earlier to check if the email sent already exists in our storage
      // If it does not, we'll add it.
      if(_.indexOf(data, email)){
        data.push(email);
        // Here we use the set method to add data to the storage variable
        context.storage.set(data, function(err){
          if(err){
            cb(null, RESPONSE.ERROR);
          } else {
            cb(null, RESPONSE.OK);
          }
        })
      } else {
        // If it is already in storage, we'll send an appropriate message.
        cb(null, RESPONSE.DUPLICATE);
      }
    })
  } else {
    // If we didn't get a query parameter named email, we'll return the error response
    cb(null, RESPONSE.ERROR)
  }
};
```

To see this Webtask in action, we can deploy it by running the `wt create {name}` command - so in your terminal execute `wt create newsletter.js`. In a few seconds, you'll see a link to your Webtask in the format of `https://webtask.it.auth0.com/api/run/{YOUR_ACCOUNT}/newsletter?webtask_no_cache=1`. Navigate to the URL and you will see the error response we wrote displayed. This is because we did not add the email query string. Let's try again, but this time append `&email=john.doe@email.com` so the URL looks like `https://webtask.it.auth0.com/api/run/{YOUR_ACCOUNT}/newsletter?webtask_no_cache=1&email=john.doe@email.com`. Now you should see a message saying that the email was successfully added. If you try it again with the same email address, you'll get the email exists error message. So far so good.

### Webtask to Retrieve Subscribers

The email capture Webtask was fairly simple. For our next Webtask, we'll make use of some of the more advanced features of the platform. We'll secure our Webtask, set up additional routes, and use the Express framework in our Webtask. Let's take a look at the code and explanation below. We'll update our existing Webtask to support this new functionality. Let's walk through the code.

```js
// First things first, we'll include the required libraries
var app = new (require('express'))();
// webtask-tools allows for additional helper functions
var wt = require('webtask-tools');
var _ = require('lodash');

// We're going to update our response messages and actually include the status code
// as we're going to take full control of the HTTP request and response objects
const RESPONSE = {
  OK : {
    statusCode : 200,
    message: "You have successfully subscribed to the newsletter!",
  },
  DUPLICATE : {
    status : 400,
    message : "You are already subscribed."
  },
  ERROR : {
    statusCode : 400,
    message: "Something went wrong. Please try again."
  },
  UNAUTHORIZED : {
    statusCode : 401,
    message : "You must be logged in to access this resource."
  }
};

// We will register a new route '/subscribe' which will allow users
// to subscribe to the newsletter. Since we are sending data, it may be more
// fitting to send the email through a POST request, so we'll do that here.
// The pattern is pretty similar to how traditional Express apps are written
app.post('/subscribe', function(req, res){
  // The 'context' parameter from the earlier example is now accessed through
  // 'webtaskContext'.
  var email = req.webtaskContext.body.email;
  if(email){
    req.webtaskContext.storage.get(function(err, data){
      if(err){
        // Taking full control over the HTTP response allows us to full
        // flexibility, so we'll set an response code as well as content-type
        res.writeHead(400, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(RESPONSE.ERROR));
      }

      data = data || [];

      if(_.indexOf(data, email) == -1){
        data.push(email);
        req.webtaskContext.storage.set(data, function(err){
          if(err){
            res.writeHead(400, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(RESPONSE.ERROR));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify(RESPONSE.OK));
          }
        })
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(RESPONSE.DUPLICATE));
      }
    })
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(RESPONSE.ERROR));
  }
})

// We are going to add a new route '/subscribers/ that will retrieve
// the list of users subscribed to our newsletter. The route will be accessed
// via a GET request - but the user will need to be authenticated
app.get('/subscribers', function(req,res){
  req.webtaskContext.storage.get(function(err, data){
      if(!err){
        res.writeHead(400, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
      }
  });
});

// Here we are exporting our express app using the wt helper library
module.exports = wt.fromExpress(app).auth0({
  // We are excluding the 'subscribe' route, so that anyone can subscribe to the newsletter
  exclude : [
    '/subscribe'
  ],
  // Here we are implementing a custom login error function which will send
  // the user an appropriate message if the request is not authorized
  loginError: function (error, ctx, req, res, baseUrl) {
        res.writeHead(401, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify(RESPONSE.UNAUTHORIZED))
    }
});
```

Our updated Webtask has a lot more going on. Since we are adding Auth0 to the Webtask now, we'll need to get our Auth0 credentials and pass them when we deploy the Webtask. [Sign up](https://auth0.com/signup) for a free Auth0 account to continue.

Once you have created your Auth0 account, navigate to the [management dashboard](https://manage.auth0.com) and navigate into your newly created app. From here you will want to get the **Client ID**, **Client Secret** and **Domain**. Now, we'll deploy a new version of our newsletter Webtask with our Auth0 app credentials. Let's see how to do this:

```bash
wt create newsletter.js
    -s AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
    -s AUTH0_CLIENT_SECRET=YOUR_AUTHO_CLIENT_SECRET
    -s AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN.auth0.com
```

With the deployment complete, we are ready to integrate our Webtask into our Serverless Stories blog.

## Integrating Webtasks into Serverless Stories

We have our Serverless Stories blog and our Webtask built. Next, let's integrate the two and add some dynamic functionality to our blog. We will do this in three parts: implement the newsletter subscription so that users can sign up for the newsletter, add user login and registration with Auth0 and Lock, and finally add the functionality for logged in users to view the list of newsletter subscribers.

### Newsletter Webtask Integration

Let's add the functionality for our newsletter. We have the user interface and the Webtask up and running, so all we need to do is send a POST request to the Webtask after a user has added their email address. The implementation looks like:

```js
$('#newsletter').submit(function(e){
  // When the newsletter form is submitted, we'll make an AJAX request to our Webtask and pass the provided email.
  $.ajax({
    type : 'POST',
    url : 'https://webtask.it.auth0.com/api/run/{YOUR_WEBTASK_ACCOUNT}/newsletter/subscribe?webtask_no_cache=1',
    data : {email : $('#email').val()},
    dataType    : 'json'
  }).done(function(data) {
    if(data.statusCode == 200){
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-success">'+ data.message +'</div>')
    } else {
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-danger">'+ data.message +'</div>')
    }
  });
  e.preventDefault();
})
```

If all went well, after you enter an email address and hit the **Submit** button, you'll see a message saying that your email was added. You can try sending the same email again, and you'll see the duplicate error message telling you that you've already subscribed.

![Successful Subscription](https://cdn.auth0.com/blog/webtask/subscribed.png)

### Auth0 and Lock

Auth0 provides an intuitive and easy to use widget called [Lock](https://auth0.com/lock) that can handle both user login and registration. We'll use Lock in our application. We'll use the hosted Lock off the Auth0 CDN, so in your `index.html` files, add the following snippet:

```html
 <script src="https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>
```

Let's use the Auth0 Lock widget in our HTML5 application. Open up the `app.js` file to get started.

```js
// We'll instantiate lock, passing our Auth0 Client ID and Domain
var lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN.auth0.com');

// The login function once invoked will display the Lock widget
// Upon successful login, we'll store the user profile and token in localStorage
function login(){
  lock.show();
};

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {

    if (error) {
       return alert(error.message);
    }

    localStorage.setItem('profile', JSON.stringify(profile))
    localStorage.setItem('token', authResult.idToken)
    updateAuthenticationStatus();
  });
});


// The logout function, will remove the user information and token from localStorage
function logout(){
  localStorage.removeItem('profile');
  localStorage.removeItem('token');
  updateAuthenticationStatus();
};

// The getUser helper function will get the current status of our user
// and display user information or a link to login if there is no
// authenticated user
function updateAuthenticationStatus(){
  $('#user').empty();
  $('#login').empty();
  var user = localStorage.getItem('profile');
  if(user){
    user = JSON.parse(user);
    $('#user').show().append('<a onclick="logout()">' + user.email + ' (Log out)</a>');
    $('#login').hide();
  } else {
    $('#login').show().append('<a onclick="login()">Log in</a>');
    $('#user').hide();
  }
}

// Any time a page is loaded, we'll check to see if there is a user.
$(document).ready(function(){
  updateAuthenticationStatus();
});
```

Pretty easy implementation right? Refresh your browser and you should see a login button displayed in the right side of the nav. Clicking on the login button will bring up the Lock UI where you can login or create a new account. Upon successful login, the login button will disappear and you will see the logged in users email address and have the option to log out. The Lock widget has many configuration options and settings for you to play with, read all about them in the [docs](https://auth0.com/docs/libraries/lock).

![Lock in Action](https://cdn.auth0.com/blog/webtask/login.png)

### Super Secret Admin Page

Finally, we'll build an admin page, that will give us a list of all the users that have subscribed to our newsletter. Take a look at the implementation below.

```js
function loadAdmin(){
  // This code will only run if we are on the admin page
  if(window.location.pathname == '/admin/'){
    // We'll check localStorage to see if a user is logged in and has a token
    if(localStorage.getItem('token')){
      // If they do, we'll go ahead and make the AJAX call to get the list of users
      $.ajax({
        type : 'GET',
        url : 'https://webtask.it.auth0.com/api/run/wt-kukicadnan-gmail_com-0/newsletter-complex/subscribers?webtask_no_cache=1',
        // As this endpoint requires the user to be authenticated, we'll pass an Authorization header with the users JWT
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem('token')
        }
      // If the JWT is valid, we'll get back the list of users, and display it in the UI
      }).done(function(data) {
        for(var i = 0; i < data.length; i++){
          $('#subscribers').append('<h4>' + data[i] + '</h4>');
        }
      });
    } else {
      window.location = '/';
    }
  }
}
```

With this implementation in place, let's launch our app and test the functionality. First try subscribing to the newsletter. Next, try accessing the `localhost:8080/admin`, you will be redirected to the homepage. Finally, login and then try accessing the admin route and you will see the list of subscribed users. How cool is that?

![Secret Admin Page](https://cdn.auth0.com/blog/webtask/admin.png)

## Putting It All Together

Our app is finally complete. We built a static website that can be hosted anywhere, but added common functionality with Webtask that would normally require a backend but that's barely scratching the surface. In the current application, any logged in user would be able to see the list of subscribers. We could write a rule in either the Auth0 dashboard, or our Webtask to authorize only specific users, but consider that your homework.

You can try [Webtask.io](https://webtask.io) for free and get started today. When you are ready to scale, paid plans offer additional features to meet your needs.

## Conclusion

Serverless and function-as-a-service platforms provide an essential utility to modern day software development. Today, we showed just one use case where serverless saved the day, but that's barely scratching the surface. Webhooks, cron jobs, and much more can easily be accomplished with Webtask. [Start here](https://webtask.io/docs/101) to learn more about Webtask and how it can simplify and enhance your development experience.

{% include tweet_quote.html quote_text="With Webtasks, you can focus on development rather than servers." %}