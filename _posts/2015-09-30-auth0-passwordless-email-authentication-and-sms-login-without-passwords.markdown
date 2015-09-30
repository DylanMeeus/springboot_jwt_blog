---
layout: post
title: "Log in without Passwords: <br>Introducing Auth0 Passwordless"
description: SMS Authentication and Email Authentication made easy and secure.
date: 2015-09-30 09:00
author:
  name: Matias Woloski
  url: http://www.twitter.com/woloski
  mail: matiasauth0.com
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=200
design:
  bg_color: "#00221b"
  image: https://cdn.auth0.com/blog/passwordless/pwdless-blog-icon.png
  image_size: "80%"
  image_bg_color: "#001d17"
  image_tw: https://cdn.auth0.com/blog/passwordless/social-card.png
  image_fb: https://cdn.auth0.com/blog/passwordless/social-card.png
tags:
- passwordless
- sms login
- email authentication
- password sms
---

**tl;dr**: Auth0 Passwordless is a drop-in authentication system based on Email, SMS, or Apple's TouchID that improves security and user experience. Check it out [auth0.com/passwordless](https://auth0.com/passwordless).

---

It’s clear that passwords are not fun anymore. According to the website [haveibeenpwned.com](http://haveibeenpwned.com), **220,385,281 accounts were exposed in the top 10 breaches**, and **152,450,038 of them were compromised this past year**. On the other hand, according to a [study](https://www.passwordboss.com/password-habits-survey-part-1/), **more than half (59%)** of the users surveyed admit they **reuse the same password** because it’s hard to remember them.

What is our industry doing to address this problem?

<ol>
  <li>A second factor of authentication (Google Authenticator, SMS, etc.)</li>
  <li>Password managers</li>
</ol>

A second factor  significantly reduces the risk of your account being compromised. We support [multi-factor](https://auth0.com/docs/mfa) at Auth0 and it has been a very popular feature, but you still have a password to remember and the second factor introduces more complexity and friction to the average user. Password managers are useful (I personally use one) but still they feel like a band-aid on the problem, not addressing the real issue.

A third trend we've started to see is to **remove the password input from the login box altogether**. Companies like Medium, Slack, Twitter, and WhatsApp are already doing it, and even Google’s new login screens [hints at a future beyond passwords](http://techcrunch.com/2015/05/13/gmails-new-login-screens-hints-at-a-future-beyond-passwords/).

![trend to remove password input from login box](https://cdn.auth0.com/blog/passwordless/pwdless1.png)


We’ve been experimenting over the past few months, and we’re ready to release our first version today. With [Auth0 Passwordless](https://auth0.com/passwordless) you can use one time codes or “magic links” delivered via SMS or e-mail, or use the iPhone’s TouchID without having to worry about the implementation details.

![SMS authentication, email authentication and TouchID authentication](https://cdn.auth0.com/blog/passwordless/pwdless-locks.png)

## Log in via e-mail or SMS, simplified

Following our philosophy of "just a few lines of code", here is how you trigger a "magic link" that will be sent to the user’s email:


```
var lock = new Auth0LockPasswordless('client-id', 'yours.auth0.com');
lock.magiclink();
```

And log in via SMS is this simple as well:


```
var lock = new Auth0LockPasswordless('client-id', 'yours.auth0.com');
lock.sms(options, function(err, profile, jwt) {
  alert('welcome ' + profile.phone_number);
});
```

Try this yourself on the [playground](https://auth0.github.io/lock-passwordless).

## What's behind this?

Although conceptually simple, implementing passwordless authentication requires coordination of many components. And [Auth0 Passwordless](https://auth0.com/passwordless) takes care of them all. These components include:

* A [public API](https://auth0.com/docs/auth-api#passwordless) with appropriate rate limiting that prevents abuse.
* A beautiful, extensible and open source client [JavaScript API](https://github.com/auth0/auth0.js#passwordless-authentication) library and [UI widget](https://github.com/auth0/lock-passwordless) for Web apps.
* An open source native component and UI widget for [iOS](https://github.com/auth0/Lock.iOS-OSX) and [Android](https://github.com/auth0/Lock.Android).
* Integration with well known, scalable and secure Email (SendGrid, Mandrill and Amazon SES) and SMS providers (Twilio).
* An admin dashboard to manage and customize all of the above.

We implemented all of these and made it easy, accessible and secure to everyone.

## Works everywhere

As developers we have to deal with a handful of devices, screen sizes, and browser-specific challenges. We wanted the [Lock Passwordless](https://github.com/auth0/lock-passswordless) widget to automatically adapt to mobile web browsers on various iOS and Android versions.

Auth0 Passwordless can be used on all platforms: native apps, web apps, mobile web, command line interfaces or anything that can send an HTTP request over the net. It's a great way to achieve Single Sign On across everything with a single uniform authentication scheme across the board.

## Future directions

We are seeing a trend that web applications are moving to longer session expirations so that **users are not asked to log in frequently** - similar to a native app on a mobile device. Then, whenever a user asks to perform a sensitive operation, they’re asked for **"step up" authentication** (think "sudo" command on Linux). [Auth0 Passwordless](https://auth0.com/passwordless) is a way to implement such a mechanism quickly and securely. Combine this with **anomaly detection**, **suspicuous logins** and **centralized session revocation** and you have a robust yet usable authentication system. 

Auth0 Passwordless is **ready to be used in production** today and it is **included in every Auth0 plan**.

We can’t wait to see what you will build. And we look forward to continuing to contribute  more improvments to identity and security on the web 🔐.
