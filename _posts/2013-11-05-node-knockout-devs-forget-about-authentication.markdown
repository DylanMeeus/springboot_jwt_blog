---
published: "true"
layout: post
title: Node Knockout Devs - Forget about Authentication!
date: "2013-11-06 10:30"
outdated: true
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---


Node Knockout is a 48-hour hackathon where devs across the world gather in teams and implement an application using node.js.

The knockout time goes really fast. Don't waste time on things that are not the core of your idea.

**Auth0 takes authentication out of your way**. Auth0 allows you to connect with [+10 identity providers](https://docs.auth0.com/identityproviders): Amazon, Google, Facebook, Twitter, LiveID, GitHub, 37Signals, PayPal, LinkedIn, Yandex, Fitbit. It also provides a ready to use **username/password** store (including signup and forgot password flow). It all works out of the box with just a few lines of code.

<div style="text-align:center"><img src="https://s3.amazonaws.com/blog.auth0.com/img/login-widget.gif" alt="Auth0 Login Widget"></div>

## Quick Start in 3 easy steps:

###1. <a href="javascript: widget.show()">Create a free account in Auth0</a>

<!-- more -->

###2. Add code to your app
Add the following code to your HTML and node app:

<div style="float: left; width: 48%; padding-right: 10px; text-align:center;font-weight: bold">BROWSER</div>
<div style="float: left; width: 48%; text-align:center;font-weight: bold">SERVER</div>
<pre style="float: left; width: 48%; padding-right: 10px;margin:0">
<code>&lt;button onclick="auth0.show()">Login&lt;/button>

&lt;script src="https://d19p4zemcycm7a.cloudfront.net/w2/auth0-widget-1.3.1.min.js">&lt;/script>

&lt;script type="text/javascript">
var auth0 = new Auth0Widget({
  domain:       'YOUR_DOMAIN.auth0.com',
  clientID:     'YOUR_CLIENT_ID',
  callbackURL:  'http://localhost:3000/',
  callbackOnLocationHash: true
});

// parse the response and store the token in a cookie (or local storage)
auth0.parseHash(window.location.hash, function (profile, id_token) {
  $.cookie('profile', profile);
  $.cookie('id_token', id_token);
});
&lt;script>

</code>
</pre>

<pre style="float: left; width: 48%;margin:0">
<code>var jwt = require('express-jwt');

var authenticate = jwt({
  secret: new Buffer('YOUR_CLIENT_SECRET', 'base64')
  audience: 'YOUR_CLIENT_ID'
});

app.configure(function() {
  ...
  // intercept all /api calls and validate the token
  app.use('/api', authenticate);
});

app.post('/api/foo',
  function(req, res) {
    // req.user will have all the user attributes
    res.send(200);
  });

</code>
</pre>
<div style="clear: both;"></div>
###3. Call your APIs
Once the user is logged in, you can call your APIs sending the token in the Authorization header.

	$.ajaxSetup({
	  'beforeSend': function(xhr) {
		if ($.cookie('id_token')) {
	      xhr.setRequestHeader('Authorization',
	       		'Bearer ' + $.cookie('id_token'));
	    }
	  }
	});

###You are done!

---

**Want to use passport.js?**
We also support [passport.js](http://passportjs.org/) for server side auhtentication. Here is a tutorial [docs.auth0.com/nodejs-tutorial](https://docs.auth0.com/nodejs-tutorial).

**Don't want to use the Login Widget?**
The [widget is customizable](https://docs.auth0.com/login-widget2) but if you want to have your own login UI, you can use Auth0's API instead: [github.com/auth0/auth0.js](http://github.com/auth0/auth0.js).

> By using Auth0 you don't have to worry about about user management, single sign on, flow user attributes across layers of your app, integrate with social providers and enterprises and see who is using your app.

During the event we'll be available on our chat room [http://chat.auth0.com](http://chat.auth0.com) and Twitter ([@auth0](http://auth0.com)) to help you out if you have any issue.

Happy Noding!

<script src="https://d19p4zemcycm7a.cloudfront.net/w2/auth0-widget-1.3.1.min.js"></script>
<script type="text/javascript">
    var widget = new Auth0Widget({
        domain:       'auth0.auth0.com',
        clientID:     'zEYfpoFzUMEzilhkHilcWoNkrFfJ3hAI',
        callbackURL:  'https://app.auth0.com/callback'
    });
</script>
