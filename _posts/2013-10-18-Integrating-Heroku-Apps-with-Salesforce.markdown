---
published: "true"
layout: post
title: Integrating Heroku Apps with Salesforce
date: "2013-10-18 19:50"
author:
  name: José F. Romaniello
  url: "http://joseoncode.com"
  mail: "jfromaniello@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png"
---


In this post, I'll show you how easy it is with Auth0 to get an app running on Heroku, authenticating users with Google, Salesforce and more traditional Usernames & Passwords.

> Check the link at the end of the post for the complete source of the example.

Auth0 ships SDKs for all popluar dev platforms, but for this tutorial I will use a very simple node.js application. If you are a Rails developer, check out our [Rails tutorial](https://devcenter.heroku.com/articles/auth0#using-with-rails)

I'll also use __OpenID Connect__ as the underlying protocol.

<!-- more -->

## Provision Auth0 add-on in Heroku

The first thing you have to do, is tell Heroku that you want to use Auth0. For this, just run this command:

    heroku addon:add auth0

This command also creates some basic configuration. I want to use the same settings to develop on my local machine. So I run this command to get these config settings and copy them to a `.env` file:

    heroku config -s | grep 'AUTH0_CLIENT_ID\|AUTH0_CLIENT_SECRET\|AUTH0_DOMAIN' | tee -a .env

I will also add a callback url pointing to our dev box:

    echo "\nAUTH0_CALLBACK_URL=http://localhost:5000/callback" >> .env

We will see more about how these parameters are used in the code below.


## Setup the code

Because we are using node.js we will use `Passport` as the authenitcation middleware. Auth0 ships with a passport strategy `Passport-Auth0` to save you time:

    npm install passport passport-auth0 --save

Add a new module called `setup_passport.js` with the following content:

    var passport = require('passport');
    var Auth0Strategy = require('passport-auth0');

    var strategy = new Auth0Strategy({
        domain: process.env['AUTH0_DOMAIN'],
        clientID: process.env['AUTH0_CLIENT_ID'],
        clientSecret: process.env['AUTH0_CLIENT_SECRET'],
        callbackURL: process.env['AUTH0_CALLBACK_URL']
      }, function(accessToken, refreshToken, profile, done) {
        console.log('profile is', profile);
        return done(null, profile);
      });

    passport.use(strategy);

    // you can use this section to keep a smaller payload
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    module.exports = strategy;

> Notice the __process.env[...]__ calls? These are just retrieving the config parameters from the __.env__ file.

Next step is to configure our express app:

    app.configure (function () {
      this.use(express.cookieParser());
      this.use(express.session({secret: 'foo'}));

      //..
      this.use(passport.initialize());
      this.use(passport.session());
      //..

      this.use(app.router);
    });

    // Auth0 callback handler
    app.get('/callback',
      passport.authenticate('auth0'),
      function(req, res) {
        res.redirect("/");
      });

    app.get('/', function (req, res) {
      res.render('home', {
        user: req.user, //use this to display user information
        env: process.env
      })
    });

## Add Auth0 Login Widget

This is not required but we provide a beautiful, ready to use, fully customizable login widget. We will add this code to one of our home pages:

    <script id="auth0" src="https://sdk.auth0.com/auth0.js#client=<%= env["AUTH0_CLIENT_ID"] %>&redirect_uri=<%= env["AUTH0_CALLBACK_URL"] %>">></script>
    <button onclick="window.Auth0.signIn({onestep: true})">Login</button>

## Verify everything is working

Run `foreman start` and you should see this:

![ss-2013-10-18T10-51-16.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T10-51-16.png)

With almost no effort you already have __Google__ authentication but also __Username&Password__ authentication. User and password authentication comes with the sign-up and forgot-password tango already working. Later on you can change the e-mail templates in Auth0's dashboard.

## Add Salesforce to the combo

By default the add-on comes with Google and Username & Password, you can disable these or enable new ones. Let's try out Salesforce as an Identity provider:

    heroku addons:open auth0

Enabling Salesforce is as simple as turning the switch to __ON__:

![ss-2013-10-18T11-01-43.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T11-01-43.png)

Refresh your app and now you'll see the Salesforce login button next to __Google__:

![ss-2013-10-18T11-04-50.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T11-04-50.png)

## Complete the setup of the identity providers

We already can login with Salesforce and Google but by default you will see this at the time of sign on:

![ss-2013-10-18T11-10-37.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T11-10-37.png)

You usually will want your application's logo there. Follow the instructions available on every identity provider to register your application (How to obtain a Consumer Key link in Salesforce case):

![ss-2013-10-18T11-12-54.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T11-12-54.png)

## Using Salesforce API

Suppose now you need your app to work with Salesforce's API. Since you are already loged in with Salesforce, you can use the access_token from the profile as follows:

    app.post('/chatter', function (req, res) {
      if (!req.user || req.user.identities[0].provider !== 'salesforce') {
        return res.redirect('/');
      }

      var access_token = req.user.identities[0].access_token;
      var urls = req.user._json.urls;
      var salesforce_client = new Salesforce(access_token, urls);

      salesforce_client.getGroups(function (err, groups) {
        if (err) return res.send(500);
        salesforce_client.postToChatter({
          group:   groups[0],
          message: req.body.message
        }, function (err) {
          if (err) return res.send(500);
          res.redirect('/');
        });
      });
    });

This endpoint does a POST to the chatter feed of the first group using [Salesforce's Chatter API](http://www.salesforce.com/us/developer/docs/chatterapi/) and redirects back to the home page. I wrote a very small wrapper of Salesforce REST API [here](https://github.com/auth0/heroku-salesforce/blob/master/lib/salesforce.js).

The result is this:

![ss-2013-10-18T15-31-58.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-10-18T15-31-58.png)


## Example application

The code used in this example is hosted in [github.com/auth0/heroku-salesforce](https://github.com/auth0/heroku-salesforce)

## The tip of the iceberg...

Auth0 has many more cool features. Check out these topics:

  -  [User management](http://blog.auth0.com/2013/10/04/Much-better-insights-into-your-users/)
  -  [Enterprise Identity providers](https://docs.auth0.com/identityproviders)


[Try Auth0 yourself!](http://developers.auth0.com)