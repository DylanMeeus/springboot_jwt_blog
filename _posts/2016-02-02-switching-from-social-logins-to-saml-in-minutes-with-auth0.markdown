---
layout: post
title: "Switching from Social Authentication to SAML in Minutes with Auth0"
description: "Setting up SAML authentication with Auth0 is as easy as setting any social connection (like Google!)"
date: 2016-02-02 10:00
author: 
  name: Kassandra Perch
  url: https://twitter.com/nodebotanist
  mail: kassandra.perch@auth0.com
  avatar: https://s.gravatar.com/avatar/bc94ff6211e645a2bdb4fdc60e23ad85.jpg?s=200
design: 
  bg_color: "#333333"
  image: "https://cdn.auth0.com/styleguide/1.0.0/img/badge.png"
  image_size: "50%"
tags: 
- SAML
- Enterprise
- Social
- Tutorial
---

Today's video is about how easy it is to make the switch from social identity providers like Google to more complex providers, like those using SAML, using Auth0. We'll cover how in minutes, with no change to client or server code, you can easily allow users from SAML systems to log in to your Auth0 application. We've included the video, as well as a short written summary, below:

<iframe src="//fast.wistia.net/embed/iframe/2xrll0d056" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="640" height="400"></iframe>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

Today we'll talk about how easy it is to integrate SAML logins with Auth0.

So let's start with a hypothetical: you're building a SaaS product, and some of your enterprise customers want their employees to be able to access your product through Single Sign-On (SSO)...and their Identity Provider (IdP) happens to use SAML.

SAML is a complex standard, and so implementing Federation yourself, even with [already existing libraries](https://www.npmjs.org/package/saml2-js) can be quite a nightmare, and require lots of code and maintennance.

Luckily, Auth0 supports SAML login (you can even use [Lock](https://auth0.com/lock)) with just a few lines of code and some configuration.

So what we're going to go over today is how to get that started and how easy it is to switch over to SAML from a social login provider like Google.

First, we have an express implementation (you can read more about this in [our quickstart guide for Express](https://auth0.com/docs/quickstart/webapp/nodejs/)) of Auth0 logins. All I needed to do is include [passport.js](https://npmjs.org/package/passport) and [the Auth0 strategy](https://npmjs.org/package/passport-auth0). I then use these tools in my route to check that the user has logged in once Lock has redirected the app, and logged out once Lock's logout function has redirected me:

```javascript
var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(req.user);
});

router.get('/authenticate',
  passport.authenticate('auth0', { failureRedirect: '/error' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  });

router.get('/logout', function(req, res){
	req.logout();
	res.redirect("/");
})

module.exports = router;
```

So on the client side, once you've [required the Lock.js library](https://auth0.com/docs/quickstart/webapp/nodejs/#6-triggering-login-manually-or-integrating-the-auth0lock), we just need to call `lock.show()` and `lock.logout()` to allow users to log in and out, respectively:

```javascript
$(function(){
	var lock = new Auth0Lock('FIluNL0AWyBE3hYs3exbawhJD9rZNdh3', 'kperch.auth0.com');

	$('.js-login').on('click', function(event){
		event.preventDefault();
		lock.show({
			callbackURL: 'http://localhost:3000/users/authenticate',
			rememberLastLogin: false,
			// connections: ['google-oauth2', 'auth0']
		});
	});

	$('.js-logout').on('click', function(event){
		event.preventDefault();
		lock.logout({
			returnTo: 'http://localhost:3000/users/logout'
		});
	});
})
```

So let's enable Google logins and see how this works. First, [go to the dashboard](https://manage.auth0.com/), and select 'Connections', then 'Social' from the menu on the left. 

We're going to leave the 'Client ID' and 'Client Secret' blank in order to test using Auth0's API keys. Then, simply hit 'Save' at the bottom of the window. You can now use Google accounts to log in to your app.

Next, we'll take a look at how to configure SAML without changing *any* of the code we've already written.

First, you'll need some information from your SAML IdP. We have [documentation on many common third-party IdPs in our docs](https://auth0.com/docs/saml-configuration), including a list of the information you'll need for this tutorial:

* SSO Sign In URL
* SSO Sign Out URL
* X509 Signing Certificate

First, I turn off my Google provider. Then, click 'Enterprise' under 'Connections' in the left menu. Click 'SAMLP Identity Provider' to enter the connection management menu. Click 'Create new Connection'.

Enter a name in 'Connection Name'. Then, place your SSO Sign In and Sign Out URLs in the fields labeled 'Sign In URL' and 'Sign Out URL', respectively. Finally, upload the X509 Signing Certificate by clicking the orange 'Upload Certificate' button.

You can enter domains under 'Email Domains' in order to tell Lock which user emails should be filtered through to this SSO connection.

That's it for SAML configuration! Click 'Save' and 'Continue'. You will see a list of instructions-- you will need to provide these instructions to your IdP in order to complete the process (if you are using a third-party, like we do in this tutorial with SSOCircle, check [our docs](https://auth0.com/docs/saml-configuration) to see if your next steps are up to you).

Once you have done this, you can test your new SAML connection in the Dashboard. Go to 'Connections' > 'Enterprise', then select 'SAMLP Identity Provider'. Next to your connection name, you should see a play icon. Click it to try your SAML login from the dashboard. If this works, you are ready to log in using SAML in your Auth0 app!

With just a few minutes and no code changes, we have incorporated a SAML SSO into our Auth0 app! Want to learn more? [try our free plan](https://auth0.com/pricing), and you can checkout the [30+ social IdPs](https://auth0.com/docs/identityproviders#social) and the [enterprise IdPs](https://auth0.com/docs/identityproviders#enterprise) that we support. 

I'm Kassandra from Auth0, and thanks for reading!


