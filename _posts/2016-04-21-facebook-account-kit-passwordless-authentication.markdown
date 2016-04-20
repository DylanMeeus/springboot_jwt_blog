---
layout: post
title: "Passwordless Login with Facebook Account Kit"
description: "Learn about passwordless authentication and how Facebook Account Kit can help your app become password free."
date: 2016-04-21 08:30
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#333333"
  image: "https://cdn.auth0.com/blog/go-auth/gopher-main.png"
tags: 
- Facebook Account Kit
- Password Free Login
- Passwordless Authentication
- Passwordless Login
- SMS Login
---

---

**TL;DR** **Pending**

---

App developers have to walk a fine line between usability and security. If your authentication system is too complex, you'll lose customers, but if you skimp on security you could lose a lot more. Social login providers like Google, Facebook and Twitter have streamlined the registration process. Two-factor authentication has made it harder to compromise accounts and passwordless authentication is making it easier than ever to provide a seamless user experience. 

Nobody likes having to remember yet another password. The end user has trouble remembering a unique password for each service so they tend to [reuse](https://www.passwordboss.com/password-habits-survey-part-1/) a single password, the developer has to figure out the best way to hash, salt, store and retrieve the password. Then, there's the password complexity requirements, password reset forms to implement and a whole bunch of other items to check off that will make you ask "isn't there a better way?" There is! Password free login!

## Password Free Login and Single Sign On (SSO)
**Passwordless** or **password free** authentication allows a user to signup and login to your app without a password. Rather than enter a password, the user is given a one-time code or link delivered via SMS or email, which acts as the verification for the user. Many companies are embracing password free authentication including [Medium](), **TWO**, **THREE**.

Single Sign On (SSO) allows users to login to multiple services with a single account. SSO integrations are commonly found in enterprise environments utilizing many disparate services. Combining passwordless authentication with SSO can greatly enhance the security and usability of such environments.

## Introduction to Facebook Account Kit

Facebook is embracing password free authentication with the release of [**Facebook Account Kit**](). Facebook Account Kit allows developers to add passwordless authentication to their applications. Users authenticating through the Facebook Account Kit do not have to be registered Facebook users.

## Integrating Passwordless Authentication with Facebook Account Kit

In today's tutorial, we are going to show you how to integrate Facebook Account Kit into your application. Facebook has released SDKs for Android, iOS and JavaScript. We'll use the JavaScript SDK to build our application. The app we'll be building will run on a NodeJS backend.

### Getting Started

To get started you will need to have a Facebook Developer account and a Facebook app with Account Kit enabled. To enable Account Kit, simply navigate to the **Account Kit** tab and follow the directions. For the backend to process the requests, you'll need your `App ID` which can be found on the dashboard of your Facebook app and your `Account Kit App Secret` which is located in the **Account Kit** tab.
 
 With our credentials in order, let's implement the backend. 

```
// Get our dependencies
const fs = require('fs');
const Guid = require('guid');
const express = require('express');
const bodyParser = require("body-parser");
const Mustache  = require('mustache');
const Request  = require('request');
const Querystring  = require('querystring');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
var csrf_guid = Guid.raw();
const api_version = "v1.0";
const app_id = YOUR_FACEBOOK_APP_ID;
const app_secret = YOUR_ACCOUNT_KIT_SECRET_;
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token'; 

function loadLogin() {
  return fs.readFileSync('dist/login.html').toString();
}

app.get('/', function(request, response){
  var view = {
    appId: app_id,
    csrf: csrf_guid,
    version: api_version,
  };

  var html = Mustache.to_html(loadLogin(), view);
  response.send(html);
});

function loadLoginSuccess() {
  return fs.readFileSync('dist/login_success.html').toString();
}

app.post('/sendcode', function(request, response){
  // CSRF check
  if (request.body.csrf_nonce === csrf_guid) {
    var app_access_token = ['AA', app_id, app_secret].join('|');
    var params = {
      grant_type: 'authorization_code',
      code: request.body.code,
      access_token: app_access_token
      //appsecret_proof: app_secret
    };
  
    // exchange tokens
    var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
    Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
      console.log(respBody);
      var view = {
        user_access_token: respBody.access_token,
        expires_at: respBody.expires_at,
        user_id: respBody.id,	
      };
      // get account details at /me endpoint
      var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
      Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
        // send login_success.html
        console.log(respBody);
        if (respBody.phone) {
          view.method = "SMS"
          view.identity = respBody.phone.number;
        } else if (respBody.email) {
          view.method = "Email"
          view.identity = respBody.email.address;
        }
        var html = Mustache.to_html(loadLoginSuccess(), view);
        response.send(html);
      });
    });
  } 
  else {
    // login failed
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Something went wrong. :( ");
  }
});

app.listen(3000);
```

### Building the UI

Our frontend will have two views. A **login** view and an **authenticated** view that will show the logged in users information.

#### Login View

We have omitted common code that is not relevant for readability. You will find the complete example in the GitHub repo.

```
<!DOCTYPE html>
<html>
  <head>
	<title>Password Free: Facebook Account Kit</title>
	<!-- Include the Account Kit SDK -->	
	<script src="https://sdk.accountkit.com/en_US/sdk.js"></script>
  </head>
  <body>
	...
    <h1>Passwordless Authentication</h1>
    <h2>Facebook Account Kit</h2>
    <p><strong>Login via:</strong></p>
    <ul class="demo-list-icon mdl-list">
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <button onclick="loginWithSMS();">SMS</button>
        </span>
      </li>
      <li class="mdl-list__item">
        <button onclick="loginWithEmail();"> Email</button>
      </li>
    </ul>
    ...
	<script>
	  function loginWithSMS(){
	    // Login with SMS
	  }

      function loginWithEmail(){
        // Login with Email
      }
	</script>
  </body>
</html>
```

#### Authenticated View

As with the logged view, some code was omitted for readability.

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AccountKitJS App</title>
  </head>
  <body>
    ...
    <h1>Passwordless Authentication</h1>
    <h2>You're In!</h2>
    <p><strong>Details:</strong></p>
    <ul class="demo-list-icon mdl-list">
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons mdl-list__item-icon">fingerprint</i>
          <span id="token">{{method}}</span>
        </span>
      </li>
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons mdl-list__item-icon">face</i>
          <span id="nickname">{{identity}}</span>
        </span>
      </li>
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <i class="material-icons mdl-list__item-icon">person</i>
          <span id="user_id">{{user_id}}</span>
        </span>
      </li>
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">
          <button onclick="goToLogin()">Try Another</button>
        </span>
      </li>
    </ul>
	...
	<script>
      function goToLogin(){
	    window.location.href = "/";
	  }
	</script>
  </body>
</html>
```

### Integrating Facebook Account Kit

With the backend and frontend complete, we are ready to implement Facebook Account Kit. We have already included the SDK in our view, so we can jump straight into the implementation. 

```
<script>
  // Initialize Account Kit with csrf protection
  AccountKit_OnInteractive = function(){
    AccountKit.init(
      {
        appId:153852245012351, 
        state:"{{csrf}}", 
        version:"v1.0"
      }
    );
  };
  function loginWithSMS(){
    // Add Passwordless Authentication via SMS
    AccountKit.login("PHONE",{}, loginCallback);
  }

  function loginWithEmail(){
    // Add Passwordless Authentication via Email
    AccountKit.login("PHONE",{}, loginCallback);
  }
  
  // Implement the callback which is called after
  // a user has attempted to verify their one-time code
  function loginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
      // If the token is ok we will send a request to our server
      // to exchange the token for the user info
      document.getElementById("code").value = response.code;
      document.getElementById("csrf_nonce").value = response.state;
      document.getElementById("my_form").submit();
    }
    else if (response.status === "NOT_AUTHENTICATED") {
      // handle authentication failure
    }
    else if (response.status === "BAD_PARAMS") {
      // handle bad parameters
    }
  }
</script>
<!-- Add the form which makes the request to the server -->
<form id="my_form" name="my_form" action="/sendcode" method="POST" style="display: none;">
    <input type="text" id="code" name="code">
    <input type="text" id="csrf_nonce" name="csrf_nonce">
    <input type="submit" value="Submit">
</form>
```

### Passwordless Authentication in Action

Let's walk through the steps of how passwordless authentication works with the Facebook Account Kit.

1. User clicks on the login with **SMS** or **Email** button
2. User enters their phone number or email address
3. User receives a one-time code to their phone or receives a link to click in their inbox
4. User enters code or clicks on the link
5. Account Kit verifies that this code is accurate or link valid and if it is returns a token
6. A second request is made to Account Kit to exchange the token with the users information

## Aside: Passwordless Authentication with Auth0

At Auth0, we are huge proponents of making the authentication experience the best it can be. Passwordless authentication is something we believe in and offer in all of our packages. Some of the benefits of integrating passwordless authentication with Auth0 include:

* Email, SMS and [Apple Touch ID]() support
* Unified Authentication Workflow through Lock
* Cloud and Self-hosted options
* 20+ Social login providers including Facebook, Twitter and Google
* Enterprise connections and Single Sign On (SSO) integration

### Getting Started

For the best comparison, we'll keep our app as close as possible to the one we've built with the Facebook Account Kit. For Auth0 Passwordless, you will need an Auth0 account. If you don't already have one, you can sign up for one free of charge. As we won't be exchanging the token server side, our backend will be much simpler.

```
// Load in dependencies
const fs = require('fs');
const express = require('express');
const Mustache  = require('mustache');

const app = express();

function loadLogin() {
  return fs.readFileSync('dist/login.html').toString();
}

function loadCallback(){
  return fs.readFileSync('dist/callback.html').toString();
}

app.get('/', function(request, response){
  var view = {};
  var html = Mustache.to_html(loadLogin(), view);
  response.send(html);
});

app.get('/callback', function(request, response){
  var view = {};
  var html = Mustache.to_html(loadCallback(), view);
  response.send(html);
})

app.listen(3000);
```

### Building the UI

The frontend for our Auth0 Passwordless app will be identical to that of the Account Kit app we built earlier. The only notable difference will be the different authentication options. Auth0 provides various options for passwordless authentication. In addition to SMS code and email link verification options, Auth0 provides the ability to send verification codes to emails as well as combining multiple authentication options within a single workflow. You can see the UI changes in the GitHub repo.

### Adding Passwordless Authentication with Auth0

To integrate passwordless authentication we'll use the Auth0 Passwordless Lock SDK. We'll show how to integrate passwordless in four different ways: **SMS**, **Email Code**, **Email Magiclink** and **Social or SMS**. For additional ways, check out the docs.

```
  var AUTH0_CLIENT_ID = 'YOUR-AUTH0-CLIENT-ID';
  var AUTH0_DOMAIN = 'YOUR-AUTH0-DOMAIN.auth0.com';
  // Make sure you set the proper callback URL in your Auth0 Dashboard
  var AUTH0_CALLBACKURL = 'YOUR-AUTH0-APP-CALLBACK-URL';
  
  // User will recieve a one-time verification code via SMS
  function loginWithSMS(){
    var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    lock.sms({
      responseType: 'token',
      callbackURL: AUTH0_CALLBACKURL
    })
   }
  
  // User will receive a one-time verification code in their email
  function loginWithEmailCode(){
    var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    lock.emailcode({
      responseType:'token', 
      callbackURL: AUTH0_CALLBACKURL
    });
  }
  
  // User will receive a one-time link that they will click to login
  function loginWithEmailLink(){
    var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    lock.magiclink({
      responseType: 'token',
      callbackURL: AUTH0_CALLBACKURL
    })
  }
  
  // User will login with either Facebook or Twitter
  // or receive a one-time verification code via SMS
  function loginWithSocialOrSms(){
    var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    lock.socialOrSms({
      connections: ["facebook", "twitter"],
      responseType: 'token',
      callbackURL : AUTH0_CALLBACKURL
    });
  }
```

Something Else here
## Conclusion