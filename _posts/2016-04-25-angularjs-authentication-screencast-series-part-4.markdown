---
layout: post
title: "AngularJS Authentication Screencast Series - Part 4"
description: "Learn how to add JWT authentication to your AngularJS 1.x app"
date: 2016-04-25 08:30
alias: /2016/04/25/angularjs-authentication-screencast-series-part-4/
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
- 2016-04-19-react-router-alternatives
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

> Adding authentication to any single page app comes with a set of challenges, and this includes apps built with AngularJS. Auth0 makes the process a lot easier with some open source libraries for saving and sending JSON Web Tokens, as well as a full authentication service that removes the need to write authentication logic yourself. If you want to get all the details of how to add auth to your AngularJS 1.x app, this screencast series is for you. If you'd like, you can go straight to the [code](https://github.com/auth0-blog/angular-auth) or checkout the [AngularJS + Auth0 docs](https://auth0.com/docs/quickstart/spa/angularjs/no-api).

In the last part of our AngularJS authentication series, we'll take a closer look at some of the features that Auth0 provides. Specifically, we'll see how we can easily add social login with Twitter and enable multifactor authentication with Google Authenticator. These features are available with just some simple configuration, which saves us a lot of time and effort.

* **<a class="screencast-anchor" href="#enabling-social-login" target="_self">Enabling Social Login</a>**
* **<a class="screencast-anchor" href="#enabling-multifactor-authentication" target="_self">Enabling Multifactor Authentication</a>**
* **<a class="screencast-anchor" href="#wrapping-up" target="_self">Wrapping Up</a>**

<h2 id="enabling-social-login">Enabling Social Login</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/zzcX-kbvHHQ" frameborder="0" allowfullscreen></iframe>

### **Transcript**

Why don't we go through the steps to see how to enable another social provider in our application. If we remember, when we log in, we've got this option to sign in with Google, and that came by default for us because that's the only social provider that's enabled by default when we sign up for Auth0. But let's say that we want users to also be able to sign in with their Twitter account. To do this, let's go over to our Auth0 dashboard, and that's at `manage.auth0.com`. And then, over here in the connections area, we can go to "Social" and we can see a list of all of the social providers that we can use for our Auth0 account.

And, once again, we're able to use two of these social providers at no cost at all, with the free plan. So let's say we want to use Twitter, well, we can just come over here and enable it like this. And what we'll see right away is that we've got to enable some settings here for our Twitter connection, and we need a consumer key and a consumer secret. So why don't we go through the steps to get a consumer key. And right at the start here, what we get is a link to go the Twitter application management area where we can register a new application.

So let's create a new app, and this is where we'll put in some of the details for our application. The name, for this case, can be "AngularJS Auth", and the description will be "AngularJS authentication sample". And the website, I'll just use my own in this case. And the callback URL is going to come from Auth0. So this is going to be specific to our Auth0 account, and we can actually just grab it from the documentation right down here in step number three. So let's grab that here, and we'll copy it over to our callback URL input right there.

And then we'll come down below, and let's just agree to the terms and we'll go create our application. So here we can see the application has been created, and we're able to get our keys and access tokens from this tab right here. And just like always, I'm going to be regenerating my keys right after I'm finished recording, so no sense in trying to use them. But anyhow, this is where we get our consumer API key and our consumer secret. So let's head back over here to the documentation and just check for any additional steps that we need to take.

So what we can do next is copy over our consumer key, so let's grab this. We'll just copy it as such and come back over to our social connections, and let's paste that in here. And, likewise, let's grab our consumer secret. And now let's hit "save". And it says, "Connection settings saved." What we can do is test it out. So we've saved that, let's get out of here, and let's give it a try. We'll flip this to the on position and we can try it if we hit "continue". Let's give it a try down here. So we get, "Authorize AngularJS Auth to use your account," we'll say, "Sign in." And this where we can sign in with our Twitter credentials. And we get the message, it works. All right, perfect.

We can close down all of these tabs now, and let's head back over to our application and let's try signing in with our Twitter ID. So let's try logging in again. Here we can see that my Twitter account is still remembered because I've just tested it out in the Auth0 dashboard. So if I click there, what we'll get is a redirection back to the application after the authentication goes through. And just like we were authenticated with username and password before, we see that we've got a JSON Web Token in local storage. We've got our ID token and our profile, so we're good to go to access our application. So there's an example of how we can enable a social connection in Auth0, and then make use of it in our application. In the next lecture, we'll see how to use multi-factor authentication so that we can make our app even more secure.
<hr>

<h2 id="enabling-multifactor-authentication">Enabling Multifactor Authentication</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/1f169IVVvgk" frameborder="0" allowfullscreen></iframe>

### **Transcript**

Depending on how secure we want our app to be, we might benefit from using something like multifactor authentication. Perhaps you've seen this before in some other application you use. It's where you sign in with your credentials, say your user name and your password, and then you get sent a verification number to your phone which you then need to enter into the application to verify your identity. This is something that can be a little bit tricky to code from scratch, but thankfully Auth0 makes it really simple.

Let's go back over to our dashboard, `manage.auth0.com`. If we come over here to the "Multifactor Auth" link we can enable multifactor auth, then we've got our choice of two different providers. We can use Google Authenticator or Duo. Let's just try Google Authenticator in this case. What we're going to need to do is actually download Google Authenticator on our phones. If you're building this into your own application, you would need to instruct your users to get Google Authenticator so that they can go through the multifactor auth steps.

What we see down here is a code snippet that we need to modify so that we can tell Auth0 to use multifactor auth in our Angular application. To do that, we actually need to provide the client ID for any application that we want to enable multifactor auth on right here within this array. Let's do that. Let's go over to our applications link, and let's find the client ID for the app. Let's grab this client ID here. We'll come back over to multifactor auth. Let's just place that right here within this array. We'll get rid of everything there. We will paste in our client ID.

Now let's give it a shot in our application. Back over here in our app let's log out. Then, let's log in again. We'll go to log in. We'll choose our Twitter account. What we'll see here is that we need to enter our two step verification code. The way that this works with Google Authenticator is we go into our Google Authenticator app. I'm just opening the application on my phone right now. We actually need to scan this QR code here. If you're in your Google Authenticator app it's just the plus sign up at the top right. We can scan barcode. Then, let's place it up to the screen. There we go. I've got my code and I'm going to enter it now. If the code checks out, we should be able to get in. There we go. We've got our profile and our token saved again.

Applying multifactor auth to our application is very simple with Auth0. I'm sure you can see the benefits of it. It's a really big step in securing our application even more.

{% include tweet_quote.html quote_text="Applying multifactor auth to our application is very simple with Auth0." %}

<hr>

<h2 id="wrapping-up">Wrapping Up</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Dcs5WdtJHno" frameborder="0" allowfullscreen></iframe>

<script>
$(window).load(function() {
  $('.screencast-anchor').attr('target', '_self');
});
</script>
