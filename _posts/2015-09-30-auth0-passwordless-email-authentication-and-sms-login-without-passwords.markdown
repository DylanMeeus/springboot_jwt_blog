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
  image: https://cldup.com/fvFQELOy-K.png
  image_size: "80%"
  image_bg_color: "#001d17"
tags:
- passwordless
- sms login
- email authentication
- password sms
---

**tl;dr**: Auth0 Passwordless is a drop-in authentication system based on one-time codes sent via e-mail or SMS, or Apple’s TouchID that improves security and user experience. Check it out [auth0.com/passwordless](https://auth0.com/passwordless)

---

It’s clear that passwords are not fun anymore. According to the website [haveibeenpwned.com](haveibeenpwned.com), **210,378,948 accounts were exposed on the top 10 breaches**, and **152,450,038 of them were compromised this past year**. On the other hand, according to a [study](https://www.passwordboss.com/password-habits-survey-part-1/), **more than half (59%)** of the users surveyed admit they **reuse the same password** because it’s hard to remember them.

What is our industry doing to address this problem?

<ol>
  <li>Second factor of authentication (Google Authenticator, SMS, etc.)</li>
  <li>Password Managers</li>
</ol>

A second factor reduces significantly the risk of your account being compromised. We support multi-factor at Auth0 and it has been a very popular feature, but you still have a password to rememeber and the second factor introduces more complexity and friction to a the average user. Password Managers are useful (I personally use one) but still they feel like a band-aid to the problem, not addressing the real issue.

A third trend we started to see is to **remove the password input from the login box altogether**. Companies like Medium, Slack, Twitter, WhatsApp are already doing it, and even Google’s new login screens [hints at a future beyond passwords](techcrunch.com/2015/05/13/gmails-new-login-screens-hints-at-a-future-beyond-passwords/).

![login with magic link and sms](https://files.slack.com/files-pri/T025590N6-F0BGEA2BW/blog-asset.png)

We wondered whether we could create something that encapsulates this experience, make it looks great, easy to integrate, and results in a better and more secure login experience for users on web, mobile, devices and even command line interfaces.

We’ve been experimenting over the past few months, and we’re ready to release our first version today. With [Auth0 Passwordless](https://auth0.com/passwordless) you can use one time codes or “magic links” delivered via SMS or e-mail. Or use the iPhone’s TouchID without having to worry about the implementation details.

![](https://cldup.com/7bfdgcURKV.png)

## Log in via e-mail or SMS, simplified

Following our philosophy of "just a few lines of code", here is how you trigger a "magic link" that will be sent to the user email:


```
var lock = new Auth0LockPasswordless('FFM5kk2bVwxecbTHWXt15zrRJIX2Kvp3',
                                     'pwdlessdemo.auth0.com');
lock.magiclink();
```

And log in via SMS is this simple as well:


```
lock.sms({}, function(err, profile, jwt) {
  alert('welcome ' + profile.phone_number);
});
```


Try this yourself on the [playground](https://auth0.github.io/lock-passwordless)

<script src="https://cdn.auth0.com/js/lock-passwordless-0.1.min.js"></script>
<script type="text/javascript">
var cid = 'FFM5kk2bVwxecbTHWXt15zrRJIX2Kvp3', domain = 'pwdlessdemo.auth0.com';

function sms() {
  var lockpwdless = new Auth0LockPasswordless(cid, domain);
  lockpwdless.sms({autoclose: true}, function (err, profile, id_token) {
    if (err) return;
    $('#result').text('Hello, ' + profile.phone_number + '.\nYour JWT: ' + id_token);
  });
}

function emailcode() {
  var lockpwdless = new Auth0LockPasswordless(cid, domain);
  lockpwdless.emailcode({autoclose: true}, function (err, profile, id_token) {
    if (err) return;
    $('#result').text('Hello, ' + profile.email + '.\nYour JWT: ' + id_token);
  });
}

function emaillink() {
  var lockpwdless = new Auth0LockPasswordless(cid, domain);
  lockpwdless.magiclink({autoclose: true});
}

$(document).ready(function(){
  var lockpwdless = new Auth0LockPasswordless(cid, domain);
  var hash = lockpwdless.parseHash(window.location.hash);

  if (hash && hash.error) {
    alert('There was an error: ' + hash.error + '\n' + hash.error_description);
  } else if (hash && hash.id_token) {
    //retrieve profile
    lock.getProfile(hash.id_token, function (err, profile) {
      if (err) return;
      $('#result').text('Hello, ' + profile.email + '.\nYour JWT: ' + id_token);
      $('#result').focus();
    });
  }
});



</script>

<!-- <button onclick="sms()">Login with your Phone</button>
<button onclick="emailcode()">Login with your Email</button>
<button onclick="emaillink()">Login with your Email (magic link)</button>
<pre id="result" tabindex="1"></pre>
 -->

## What's behind this?

Setting up a passwordless authentication system requires various things:

* A [public API](https://auth0.com/docs/auth-api#passwordless) with appropiate rate limitting
* An open source [JavaScript API](https://github.com/auth0/auth0.js#passwordless-authentication) and customizable [UI widget](https://github.com/auth0/lock-passwordless) for Web
* A native component and UI widget for [iOS](https://github.com/auth0/Lock.iOS-OSX) and [Android](https://github.com/auth0/Lock.Android).
* Integration with E-mail providers (SendGrid, Mandrill and Amazon SES) and SMS providers (Twilio).
* A dashboard to manage and customize all these settings.

We implemented each of these and made it easy, accesible and secure to anyone.

## Works everywhere

Finally, Auth0 Passwordless can be used on all platforms: native apps, web apps, mobile web, command line interfaces or anything that can speak to the HTTP API.

## Conclusion

We are seeing a trend that web applications are moving to longer session expirations so that users are not asked to log in frequently - like a native app on a mobile device. Then, whenever a user asks to perform a sensitive operation, they’re asked for "step up" authentication (think "sudo" command on Linux). Auth0 Passwordless is a way to implement such mechanism.

Auth0 Passwordless is ready to be used in production today and it is included in every Auth0 plan.

We’re looking forward to seeing what you build, and to doing our part to help improve identity and security on the web 🔐.
