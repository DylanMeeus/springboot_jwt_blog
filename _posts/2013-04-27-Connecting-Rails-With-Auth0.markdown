---
layout: post
title: "Connecting Rails With Auth0"
date: 2013-04-27 10:15
outdated: true
alias: /2013/04/27/Connecting-Rails-With-Auth0/
author:
  name: Ezequiel Morito
  mail: ezequiel@auth0.com
  url: https://github.com/ezequielm
  avatar: https://secure.gravatar.com/avatar/6c62cc9e6d7c17e49debf1bc3755fe3a?s=400&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png
description: "We have good news for our colleagues developing on Ruby. Last week we relased the Auth0 OmniAuth Strategy that makes it a bliss to connect Ruby apps"
related:
- 2013-09-10-auth0-for-Heroku-hosted-apps
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2013-07-17-SSO-with-any-saml-app
---


We have good news for our colleagues developing on Ruby. Last week we relased the [Auth0 OmniAuth Strategy](https://github.com/auth0/ruby-auth0) that makes it a bliss to connect Ruby apps with Auth0.

> [OmniAuth](https://github.com/intridea/omniauth/wiki) is a Ruby authentication framework aimed to abstract away the difficulties of working with various types of authentication providers. It is meant to be hooked up to just about any system, from social networks to enterprise systems to simple username and password authentication.

Once you connect to Auth0, you can automagically accept users from __anywhere__: LDAP, AD, SQL, Office365, Google Apps, LiveID, Facebook, Twitter, PayPal, LinkedIn, etc.

<!-- more -->

![](https://s3.amazonaws.com/blog.auth0.com/img/ruby-tutorial.png)

All you need is a couple steps to get it running in your app:

##1. Install the Strategy

```
gem install auth0
```

##2. Initialize the auth0 gem

Add the `auth0.rb` file under the `config/initializers` folder with the following settings:

	Rails.application.config.middleware.use OmniAuth::Builder do
	  provider :auth0, YOUR_CLIENT_ID, YOUR_SECRET, YOUR_NAMESPACE
	end

##3. Create a Callback Controller

	rails generate controller callback store failure

Open the `callback_controller.rb` under the `app/controllers` folder and implement the methods `store` (used to store the user profile in session), and `failure` (to display error messages):

	class CallbackController < ApplicationController
		def store
			session[:userinfo] = request.env['omniauth.auth']
			redirect_to user_index_path
		end

		def failure
			@error_msg = request.params['message']
		end
	end

Update the callback routes in the `routes.rb` under `config` folder:

	match "auth/auth0/callback" => "callback#store"
	match "auth/failure" => "callback#failure"


You are essentially done!

Complete tutorial is available [here](https://docs.auth0.com/rails-tutorial). As with other tutorials, all parameters (e.g. ClientID, ClientSecret, etc.) will be replaced in the docs automagically with your own settings if you are signed up with Auth0.

[Try Auth0 yourself!](https://auth0.com)
