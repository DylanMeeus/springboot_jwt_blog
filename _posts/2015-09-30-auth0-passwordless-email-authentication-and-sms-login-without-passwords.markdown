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
  bg_color: "#2E3A51"
  image: https://cdn.auth0.com/blog/post-images/idcard-white.png
  image_size: "60%"
  image_bg_color: "#455572"
tags:
- passwordless
- sms login
- email authentication
- password sms
---

**tl;dr**: Auth0 Passwordless is a drop-in authentication system based Email, SMS, or Apple's TouchID that improves security and user experience. Check it out [auth0.com/passwordless](https://auth0.com/passwordless).

---

It’s clear that passwords are not fun anymore. According to the website [haveibeenpwned.com](haveibeenpwned.com), **210,378,948 accounts were exposed on the top 10 breaches**, and **152,450,038 of them were compromised this past year**. On the other hand, according to a [study](https://www.passwordboss.com/password-habits-survey-part-1/), **more than half (59%)** of the users surveyed admit they **reuse the same password** because it’s hard to remember them. 

What is our industry doing to address this problem?

<ol>
  <li>Second factor of authentication (Google Authenticator, SMS, etc.)</li>
  <li>Password Managers</li>
</ol>

A second factor reduces significantly the risk of your account being compromised. We support multi-factor at Auth0 and it has been a very popular feature, but you still have a password to remember and the second factor introduces more complexity and friction to the average user. Password Managers are useful (I personally use one) but still they feel like a band-aid to the problem, not addressing the real issue.

A third trend we started to see is to **remove the password input from the login box altogether**. Companies like Medium, Slack, Twitter, WhatsApp are already doing it, and even Google’s new login screens [hints at a future beyond passwords](techcrunch.com/2015/05/13/gmails-new-login-screens-hints-at-a-future-beyond-passwords/).

![trend to remove password input from login box](https://cdn.auth0.com/blog/passwordless/pwdless1.png)


We’ve been experimenting over the past few months, and we’re ready to release our first version today. With [Auth0 Passwordless](https://auth0.com/passwordless) you can use one time codes or “magic links” delivered via SMS or e-mail. Or use iPhone’s TouchID without having to worry about the implementation details.

![SMS authentication, email authentication and TouchID authentication](https://cdn.auth0.com/blog/passwordless/pwdless-locks.png)

## Log in via e-mail or SMS, simplified

Following our philosophy of "just a few lines of code", here is how you trigger a "magic link" that will be sent to the user email:


```
var lock = new Auth0LockPasswordless('FFM5kk2bVwxecbTHWXt15zrRJIX2Kvp3', 
                                     'pwdlessdemo.auth0.com');
lock.magiclink();
```

And log in via SMS is this simple as well:


```
lock.sms(options, function(err, profile, jwt) {
  alert('welcome ' + profile.phone_number);
});
```

Try this yourself on the [playground](https://auth0.github.io/lock-passwordless).

## What's behind this?

Although conceptually simple, implementing passwordless authentication requires coordination of many components. And Auth0 Passwordless takes care of all that. These components include:

* A [public API](https://auth0.com/docs/auth-api#passwordless) with appropriate rate limiting that prevents abuse.
* A beautiful, extensible and open client [JavaScript API](https://github.com/auth0/auth0.js#passwordless-authentication) library and [UI widget](https://github.com/auth0/lock-passwordless) for Web apps.
* A native component and UI widget for [iOS](https://github.com/auth0/Lock.iOS-OSX) and [Android](https://github.com/auth0/Lock.Android).
* Integration with well known, scalable and secure Email (SendGrid, Mandrill and Amazon SES) and SMS providers (Twilio).
* A admin dashboard to manage and customize all of the above.

We implemented all of these and made it easy, accessible and secure to everyone.

## Works everywhere

Auth0 Passwordless can be used on all platforms: native apps, web apps, mobile web, command line interfaces or anything that can send an HTTP request over the net.

## Conclusion

We are seeing a trend that web applications are moving to longer session expirations so that users are not asked to log in frequently - like a native app on a mobile device. Then, whenever a user asks to perform a sensitive operation, they’re asked for "step up" authentication (think "sudo" command on Linux). Auth0 Passwordless is a way to implement such mechanism quickly and securely.

Auth0 Passwordless is **ready to be used in production** today and it is **included in every Auth0 plan**.

We can’t wait to see what you will build. And we look forward to continuing to contribute toimprove identity and security on the web 🔐. 