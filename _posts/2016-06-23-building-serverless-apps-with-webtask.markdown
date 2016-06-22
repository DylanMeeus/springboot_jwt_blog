---
layout: post
title: "Building Serverless Apps with Webtask.io"
description: "Webtask is function-as-a-service platform for building serverless apps. Learn how to build applications without worrying about servers and common use-cases where serverless shines."
date: 2016-06-23 08:30
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
- Function as a Service
- Serverless Authentication
related:
- 2016-06-09-what-is-serverless
- 2015-10-07-extensibility-through-code-using-webtasks
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
---

---

**TL;DR** Webtask.io allows you to build applications without thinking about infrastructure. Simply write your server-side logic, deploy your functions via the Webtask CLI and access your serverless backend over HTTP. Preferring code to configuration, the Webtask platform comes with a familiar programming model, excellent authentication and authorization support, and more to ensure a pleasant development experience.

For our tutorial today, we'll enhance a static blog with some dynamic functionality that would normally require a traditional backend. Check out the Github repo for the code to follow along. 

---

[Webtask.io](https://webtask.io) is a Function-as-a-Service (FaaS) platform that allows you to build serverless applications. Built by the team that brought you Auth0, Webtask features a familiar programming model, an easy to use CLI and a powerful infrastructure to help you accomplish your goals.

Webtasks are secure, self-contained functions accessed over the HTTP protocol that perform server-side logic. With Webtasks, you can securely call APIs that requires secret keys, set up as webhooks that get triggered after certain actions in your application are performed, or even talk directly to your existing database or backend just to name a few. The power of serverless computing is that it is there for you when you need it and out of the way when you don't.

## What is Serverless?

Serverless computing is a fairly recent trend is software development that allows developers to focus on writing application logic and not worry about provisioning and managing servers. It's akin to the Platform-as-a-Service (PaaS) architecture where a company provides an API that developers use to accomplish their goals. In fact, serverless computing is a level of abstraction higher than the traditional PaaS - and is often referred to as Function-as-a-Service.
 
Serverless, and by extension Webtask, is there for you when you need it and out of the way when you don't. You can extend your current backend with Webtask, build your entire backend around Webtask functions and never provision any servers or set up infrastructure yourself, or use it for more specialized cases such as webhooks. To learn more about serverless computing, check out this [blog post](https://auth0.com/blog/2016/06/09/what-is-serverless/).

## Serverless Use-Cases

Serverless and FaaS can prove useful in various use-cases. If you are building a static website, but would like to add the ability to capture user emails for a newsletter, you would either need to setup a backend or register with a 3rd party email service and use their widget or API to capture emails. If a 3rd party API you wanted to use required secret keys, you would have to build a backend so that you could safely make calls to the API. If you are building an app with [Firebase](https://firebase.google.com), you could have an entire application running client-side, but again if you ever needed to have some data secret, you would be looking at needing some sort of backend. Webtask and serverless solves this problem.

## Building a Serverless App with Webtask

Today we will build a serverless application. The app we are building is a blog called Serverless Stories, where the authors write about the latest and greatest serverless trends. Before we get started, let's look at **why** a blog might be a great fit for serverless.

### The Problem

Blogs tend to have large spikes in traffic when breaking news happen. Many blogs are hosted on small budgets, often on shared hosting providers and more often than not on a Content Management System like Wordpress which requires a backend and database. As soon as traffic spikes, the blog crashes and burns. It's such a common occurrence that we even have a phrase for it: [slashdot effect](https://en.wikipedia.org/wiki/Slashdot_effect) - or more recently Reddit hug of death.

### The Solution

With these assumptions in mind, our Serverless Stories blog will be completely static, but we'll augment it with Webtask to add functionality readers have come to expect. Our Serverless Stories blog could use any number of static site generators, like [Jekyll](https://jekyllrb.com/) or [Hugo](https://gohugo.io/), or it could be totally hand-crafted - we're crazy like that sometimes.

Our blog is comprised of HTML, CSS and JS files. We don't have a backend nor do we rely on a database. This makes our website much more resilient when a traffic surge occurs. A static site is simply not enough in the modern day though. We will add two common features readers have come to expect of websites: a newsletter sign up and the ability to send tips and information to the authors. Normally, both of these would require a backend system, but we'll accomplish it with Webtasks. Let's get started.

## User Interface

Our blog has three main views. The **homepage**, where we can see a list of stories and subscribe to the newsletter. A **tips** page, where users can submit tips to our authors. Finally, the individual **article** page, which contains the full content for each article. We'll use [Bootstrap](http://getbootstrap.com/) to help us build out a clean UI. Get the code from the Github repo to follow along.

### Homepage

![Serverless Stories Homepage](https://cdn.auth0.com/blog/webtask/homepage.png)

Let's look at our homepage implementation. To reduce the length, we've omitted the second and third article, as they are structurally the same as the first.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Serverless Stories</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  </head>
  <body>
    <header>
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="/">Serverless Stories</a>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li class="active"><a href=#">Top Stories</a></li>
              <li><a href="/tips">Tips</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li id="login"></li>
              <li id="user"></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <div class="col-sm-12">
        <h1>Top Stories</h1>
        <div class="row">
          <div class="col-sm-4">
            <div class="panel panel-default">
              <div class="panel-body">
                <img src="https://images.unsplash.com/photo-1425036458755-dc303a604201?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=e12ee8718536181ecd9bf16967e81530" style="width: 100%; height: 170px;"/>
                <h4>Serverless Computing Takes Over the World!</h4>
                <p>The Serverless Computing trend shows no sings of slowing down. Companies are buring their servers and going serverless...</p>
                <a href="/post/serverless-computing-takes-over-the-world/">Read Story</a>
              </div>
            </div>
          </div>
          <!-- ... -->
        </div>
        <div class="row">
          <div class="col-sm-12 well">
            <form id="newsletter">
              <div class="form-group">
                <label>Subscribe to Our Newsletter!</label>
                <input type="email" class="form-control" id="email" />
              </div>
              <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>
            <div id="response"></div>
          </div>
        </div>
      </div>
    </div>
    <script src="./assets/app.js"></script>
  </body>
</html>
```

### Tips Page

![Serverless Stories Tips Page](https://cdn.auth0.com/blog/webtask/tips.png)

The tips page allows users to submit tips to our authors. Many elements are carried over from the homepage so we'll just show the main container which displays the tip submission form.

```html
 <!-- ... -->
    <div class="container">
      <div class="col-sm-12">
        <h1>Tips</h1>
        <form id="tip">
          <div class="form-group">
            <label>What's the drop?</label>
            <textarea class="form-control" id="message"></textarea>
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
        <div id="response"></div>
      </div>
    </div>    
 <!-- ... -->
```

### Article Page

![Serverless Stories Article Page](https://cdn.auth0.com/blog/webtask/article.png)

Finally, the article page contains the full-length text for each of our articles. Again, we're just showing the code unique to this view.

```
  <!-- ... -->
    <div class="container">
      <div class="col-sm-12">
        <h1>Function as a Service (FaaS)</h1>
        <p>Lorem ipsum dolor sit amet...</p>
      </div>
    </div>
  <!-- ... -->
```

These three views make up our Serverless Stories blog. To see the blog in action, you can just open up any of the pages in your browser. I recommend throwing these files up on a local server though. As the blog is just HTML, CSS and JS, you can use any server. I recommend installing the simple http-server via npm. Run `npm install http-server -g`, then in your directory run the `http-server` command. This will launch a local server on port `:8080` by default. Navigate to `localhost:8080` to see the blog. Next, we'll write our Webtasks.

## Adding Functionality with Webtasks

With our static blog up and running, it's time to add some dynamic functionality. We are going to be creating two Webtasks. The first will give us the ability to capture a users email address when they fill out the newsletter form and the second will allow an authenticated user to submit tips to our authors.

### Getting Started with Webtask

To start working with Webtasks we will need to install the Webtask CLI. You will need [Node.js](https://nodejs.org/en/) and [npm](https://npmjs.com) installed on your machine, then run the `npm install wt-cli -g` command. This will install the Webtask CLI globally so you can access it from anywhere on your computer. Once the install is complete, run the `wt -v` command to ensure that Webtask is properly working. If it is, you'll get the current version, which as of this article is 3.1.0.

{% include tweet_quote.html quote_text="Write your application logic. Run wt create webtask_name. Done. You can deploy a Webtask faster than it took to write this tweet." %}

With the Webtask CLI installed, we are ready to start creating Webtasks. One final step, we'll need a Webtask account. To get an account, run the `wt init` command. You will prompted to enter a phone number or email address. Once you provide a phone number or email address, you'll get a confirmation code. Input this confirmation code, and you will be set. In the future, if you want to log in to a different account, run the `wt init` command and you'll have the option to login with a new account.

### Our First Webtask - Newsletter Email Capture

Our first Webtask will capture and save a users email address. To create this Webtask, first create a file called `newsletter.js`. If you've ever worked with Node.js, you should feel right at home writing Webtasks. Each Webtask exports a single function with a callback. Let's quickly write the quintessential **Hello World** app.

```js
module.exports = function(callback){
  callback(null, "Hello Webtask");
}
```

To see this Webtask in action, we can deploy it by running the `wt create {name}` command - so in your terminal execute `wt create newsletter.js`. In a few seconds, you'll see a link to your Webtask in the format of `https://webtask.it.auth0.com/api/run/{YOUR_ACCOUNT}/newsletter`. If you navigate to this page in your browser, you'll see the message **"Hello Webtask"** displayed.

Now that we know the essentials of creating and deploying Webtasks, let's go back and actually implement our Newsletter functionality.

```js
// We can use over 800 of the most popular JavaScript modules.
// Get the full list here https://tehsis.github.io/webtaskio-canirequire/
// If the module you need is not here, you can manually bundle it with
// https://github.com/auth0/webtask-bundle
var _ = require('lodash');

// We'll set up some generic response messages based on what our Webtask does
const RESPONSE = {
  OK : {
    statusCode : 200,
    message: "You have successfully subscribed to the newsletter!",
  },
  DUPLICATE : {
    statusCode : 400,
    message : "You are already subscribed."
  },
  ERROR : {
    statusCode : 400,
    message: "Something went wrong. Please try again."
  }
};

// The module.exports function can operate in 3 ways
// function(callback): takes just a callback so that it can send a response
// function(context, callback): the context attribute allows us to capture common request parameters such as query strings
// function(context, req, res): gives us full control over the HTTP request and response
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
      exists = _.indexOf(data, email);
      
      // If it does not exist, we'll go ahead and add it.
      if(exists == -1){
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
    cb(null, RESPONSE.ERROR)
  }
};
```

Now let's deploy this Webtask. Run the `wt create newsletter.js` command again. This will overwrite the existing code. Navigate to the provided URL. You should see the error response we wrote displayed. This is because we did not add the email query string. Try the URL but append `?email=john.doe@email.com`. Now you should see a message saying that the email was successfully added. If you try it again with the same email address, you'll get the email exists error message. So far so good.

### Submit Tips Webtask 

The Newsletter Webtask was fairly simple. For our next Webtask, we'll make use of some of the more advanced features of the platform. We'll secure our Webtask, connect to an external API and use the Express framework in our Webtask. Let's take a look at the code and explanation below.

```js
// First things first, we'll include the required libraries
var app = new (require('express'))();
// webtask-tools allows for additional helper functions
var wt = require('webtask-tools');
// We'll import the Twilio SDK and set it up with our account
var client = require('twilio')('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

const RESPONSE = {
  OK : {
    statusCode : 200,
    message: "Tip successfully sent! Thank you!",
  },
  ERROR : {
    statusCode : 400,
    message: "Something went wrong. Please try again."
  }
};

// We are using the Express way of declaring routes
// In this instance, we're filtering our Webtask requests to only work
// with a POST request. By default, they'll work across all the HTTP verbs
app.post('/', function (req, res) {
    // Unlike Express, we can't simply access req.body
    // But we can use the webtaskContext
    var body = req.webtaskContext.body;
    // If the POST request does contain a message in the body,
    // We'll process it and send an SMS to the author
    if(body.message){
        client.sendMessage({
          to:'PHONE_NUMBER_YOU_WANT_TO_RECEIVE_TEXT',
          from: 'YOUR_TWILLIO_PHONE_NUMBER', 
          body: body.message
        }, function(err, responseData) {
          if(!err){
            // Instead of using res.json, we use the res.end() function
            res.end(JSON.stringify(RESPONSE.OK));
          } else {
            res.end(JSON.stringify(RESPONSE.ERROR));
          }
        });
    } else {
      res.end(JSON.stringify(RESPONSE.ERROR));
    }
});

// We export our app and append the auth0() function
// Appending .auth() will require us to be authenticated to access this request
module.exports = wt.fromExpress(app).auth0();
```

Our Tips Webtask has a lot more going on. Let's deploy the Webtask by running `wt create tips.js` and try to access the provided url. First thing we'll notice is that we'll get an error message saying that we must pass our Auth0 credentials. Webtask relies on [Auth0](https://auth0.com) for authentication and authorization. [Sign up](https://auth0.com/signup) for a free Auth0 account to continue.

Once you have created your Auth0 account, navigate to the [management dashboard](https://manage.auth0.com) and navigate into your newly created app. From here you will want to get the Client ID, Client Secret and Domain. Now, we'll deploy a new version of our Tips Webtask with our Auth0 app credentials. Let's see how to do this:

```bash
wt create tips.js 
 -s AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
 -s AUTH0_CLIENT_SECRET=YOUR_AUTHO_CLIENT_SECRET 
 -s AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN.auth0.com
```

With the deployment complete, navigate to the provided url. You will be redirected to a login page. Here, either create a new account or login and you will be redirected back to the Webtask - but you'll get an error message saying `Cannot GET /api/...`. What happened ? Well remember in our `tips.js` Webtask, we used Express and set our code to work only on a POST request - so our Webtask is not going to return anything on a GET request.
 
 Let's make a POST request to our Tips Webtask. I prefer [Postman](https://www.getpostman.com/) when testing HTTP requests, but you can use any utility. With your utility of choice selected, type in the your provided Webtask URL without any additional query strings or parameters. You will get back a `401 Unauthorized` error. Next, copy the link from your browser, which will have your Webtask URL as well as a query parameter called `access_token` appended to it. Now, you will see your error message saying that something went wrong. 
 
 We didn't add a message to the body of the request. Add an `application/json` body request in the format `{ "message" : "Hello from Webtask.io"}` and make the request again. In a few seconds, you should receive a message from Twilio, with the text **"Hello from Webtask"**.
 
## Integrating Webtasks into Serverless Stories

We have our Serverless Stories blog and our Webtasks built. Next, let's integrate the two and add some dynamic functionality to our blog. We will do this in three parts: implement user login and registraton with Auth0 and Lock, implement the newsletter Webtask, and finally implement the tips Webtask.

### Auth0 and Lock

Auth0 provides an intuitive and easy to use widget called [Lock](https://auth0.com/lock) that can handle both user login and registration. We'll use Lock in our application. We'll use the hosted Lock off the Auth0 CDN, so in your `index.html` files, add the following snippet:

```html
 <script src="https://cdn.auth0.com/js/lock-9.min.js"></script>
```

Next, we'll create an `app.js` file in our assets folder. This file will contain our client-side app logic. Let's implement the Auth0 Lock widget.

```js
// We'll instantiate lock, passing our Auth0 Client ID and Domain
var lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN.auth0.com');

// The login function once invoked will display the Lock widget
// Upon successful login, we'll store the user profile and token in localStorage
function login(){
  lock.show(function(err, profile, id_token) {
    if (err) {
      return alert(err.message);
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('token', id_token);
    getUser();
  });
};

// The logout function, will remove the user information and token from localStorage
function logout(){
  localStorage.removeItem('profile');
  localStorage.removeItem('token');
  getUser();
};

// The getUser helper function will get the current status of our user
// and display user information or a link to login if there is no
// authenticated user
function getUser(){
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
  getUser();
});
```

Pretty easy implementation right? Refresh your browser and you should see a login button displayed in the right side of the nav. Clicking on the login button will bring up the Lock UI where you can login or create a new account. Upon successful login, the login button will disappear and you will see the logged in users email address and have the option to log out. The Lock widget has many configuration options and settings for you to play with, read all about them in the [docs](https://auth0.com/docs/libraries/lock).

![Lock in Action](https://cdn.auth0.com/blog/webtask/login.png)

### Newsletter Webtask Integration

Let's add the functionality for our newsletter. We have the user interface and the Webtask up and running, so all we need to do is send a request to the Webtask after a user has added their email address. The implementation looks like:

```js
$('#newsletter').submit(function(e){
  $.ajax({
    type : 'GET',
    url : 'https://webtask.it.auth0.com/api/run/{YOUR_WEBTASK_ACCOUNT}/newsletter?email=' + $('#email').val()
  }).done(function(data) {
    if(data.statusCode == 200){
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-success">' + data.message + '</div>')
    } else {
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-danger">' + data.message + '</div>')
    }
  });
  e.preventDefault();
})
```

If all went well, after you enter an email address and hit the **Submit** button, you'll see a message saying that your email was added. You can try sending the same email again, and you'll see the duplicate error message telling you that you've already subscribed.

![Successful Subscription](https://cdn.auth0.com/blog/webtask/subscribe.png)

### Tips Webtask Integration

Just like the Newsletter Webtask, we have the ui and the Webtask ready to go, we just need to have them talk to each other. Check out the implementation below.

```js
$('#tip').submit(function(e){
  $.ajax({
    type : 'POST',
    url : 'https://webtask.it.auth0.com/api/run/{YOUR_WEBTASK_ACCOUNT}/tips?access_token=' + localStorage.getItem('token'),
    data : {message : $('#message').val()},
    dataType    : 'json'
  }).done(function(data) {
    $('#response').empty();
    if(data.statusCode == 200){
      $('#tip').hide();
      $('#response').append('<div class="alert alert-success">' + data.message + '</div>')
    } else {
      $('#tip').hide();
      $('#response').append('<div class="alert alert-danger">' + data.message + '</div>')
    }
  }).error(function(data){
    $('#response').empty();
    if(data.status == 401){
      $('#response').append('<div class="alert alert-danger">You must be logged in to submit tips. :(</div>')
    }
  });
  e.preventDefault();
})
```

The big difference between the two Webtasks we created is that the Tips Webtask requires a user to be logged in. In our implementation, we send the request and catch the error if the user is not logged in. We could have checked to see if there was a valid token before making the request. With this code implemented, try sending a tip without being logged in and examine the results. Then, log in and try it with an authenticated user. 

![Successful Tip Submit](https://cdn.auth0.com/blog/webtask/tip-submit.png)

## Putting It All Together

Our app is finally complete. We built a static website that can be hosted anywhere, but added common functionality with Webtask that would normally require a backend. Integrating with an API that requires secret keys and tokens would not be possible without a backend or serverless setup. We showed how much easier it is to just write your application logic and run the `wt create` command versus provisioning servers yourself.

You can try [Webtask.io](https://webtask.io) for free and get started today. When you are ready to scale, paid plans offer additional features to meet your needs.

## Conclusion

Serverless and function-as-a-service platforms provide an essential utility to modern day software development. Today, we showed just one use case where serverless saved the day, but that's barely scratching the surface. Webhooks, cron jobs, and much more can easily be accomplished with Webtask. Focus on development, not servers with Webtask. [Start here](https://webtask.io/docs/101) to learn more about Webtask and how it can simplify and enhance your development experience.

{% include tweet_quote.html quote_text="Focus on building your application, not provisioning servers with Webtask." %}