---
layout: post
title: "How Passwordless SMS Authentication Can Improve Your App"
description: Enhancing Your App's security through SMS Authentication in simple steps
date: 2016-05-14 8:30
alias: /2016/05/14/how-passwordless-sms-authentication-can-improve-your-app/
author:
  name: Diego Poza
  mail: diego.poza@auth0.com
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design:
  bg_color: "#454543"
  image: https://cdn.auth0.com/blog/sms-authentication/logo.png
tags:
- passwordless
- sms-authentication
related:
- 2016-01-27-setting-up-passwordless-authentication-with-the-auth0-dashboard
- 2016-02-10-getting-started-with-lock-episode-2-using-customization-options
- 2016-05-10-how-fingerprint-auth-gives-you-security
---

Passwordless SMS doesn’t just make your users’ accounts safer, it makes their lives easier too. Here’s how it works, why it’s important, and how Auth0 makes implementing it a breeze.

{% include tweet_quote.html quote_text="Passwordless SMS doesn’t just make your users’ accounts safer, it makes their lives easier too." %}

## How Does SMS Authentication Work?

SMS authentication is a form of passwordless authentication, where users are authenticated on their access to another secure platform, instead of authenticated based on their possession of a password.

In the case of SMS authentication, that secure platform is the user’s cell phone. Authentication requires the users to have both the correct cell phone number, and physical access to that phone.

In Auth0’s SMS authentication, users enter their phone number into a login field:

<div class="phone-mockup">
  <img src="https://cdn.auth0.com/blog/sms-authentication/sms-lock.png" alt="Auth0 SMS lock">
</div>

Users then receive a text message with a one-time password:

<div class="phone-mockup">
  <img src="https://cdn.auth0.com/blog/sms-authentication/auth0-sms.png" alt="Auth0's SMS received">
</div>

And then have five minutes to input that password into the app:

<div class="phone-mockup">
  <img src="https://cdn.auth0.com/blog/sms-authentication/sms-confirmation.png" alt="Entering SMS Confirmation">
</div>

If this is a user’s first time logging in, a new account is created for their phone number. If their phone number matches an existing account, they are authenticated and logged into that account.

## Why Use Passwordless SMS Authentication?

Passwordless SMS authentication offers two key advantages:

* **Convenience: **The average internet user has at least [90 accounts](http://blog.dashlane.com/infographic-online-overload-its-worse-than-you-thought/). Passwordless SMS authentication removes the friction of having to create and remember a password, and because one-time passwords are sent to cell phones, users can authenticate by simply reaching in their pocket.
* **Security: **[59%](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/) of internet users admit to using the same password for multiple accounts. By stealing a password, attackers can compromise all accounts with the same password. However, removing the password limits an attacker’s points of entry. In order to hijack an account authenticated via SMS, an attacker would have to steal the user’s cell phone or SIM card.

## Why Is Passwordless SMS So Hard To Develop?

Building a SMS API in-house requires a great deal of resources. The burdens involved break into two categories:

* **Security:** While SMS authentication lets users think less about security, it makes developers focus on it even more. If your SMS API is exploited, attackers will not only have access to users’ phone numbers, they’ll be able to send messages from your server. The higher stakes increase a developer’s security burden.
* **Cost: **Building an SMS API requires a large infrastructure. The developers must negotiate with network carriers around the world in order to access their networks and reach users. Developers must choose between exorbitant costs or limited geographic reach for their API.

Using Auth0 for SMS authentication lets you circumvent both of these burdens.

## How Auth0 Uses Twilio To Keep SMS Safe And Affordable

Auth0 uses [Twilio](https://www.twilio.com/) to handle SMS authentication in our Passwordless API. Twilio is a service that offers secure messaging APIs used by companies like Coca-Cola, Uber, and Box.

Box services [92%](http://thenextweb.com/insider/2012/10/09/aaron-levie-boxworks-2012-the-state-of-box/) of Fortune’s 500, which puts their security under intense scrutiny. Using Twilio's SMS API, they were able to build a secure SMS authentication process that protects 240,000 businesses worldwide.

![Box Authentication](https://cdn.auth0.com/blog/sms-authentication/box-device.png)

Auth0 offers you this same security with simple implementation. With Twilio, you have powerful and secure SMS API that already has access to networks worldwide. With Auth0, you can implement Twilio’s API quickly and easily.

## How Easy Is It To Implement Passwordless SMS In Auth0?

Auth0 makes passwordless SMS easy and powerful in three key ways:

* **Minimal coding:** Implementing an instance of passwordless SMS requires only the following simple code snippet:

    ```
    <button id="signin-sms">Login</button>

    <script src="//cdn.auth0.com/js/lock-passwordless-1.0.min.js"></script>
    <script type="text/javascript">
      document.getElementById('signin-sms').onclick = function () {
        var pwdless = new Auth0LockPasswordless('client-id', 'app-domain');
        pwdless.sms(function (err, profile, id_token) {
          // Passwordless Authentication handler
        });
      }
    </script>
    ```


* **Cross Platform Compatibility: **Because passwordless SMS authentication is a built-in feature of Auth0 Lock, it will adapt to whatever platform a user accesses it from, whether it be iOS, Android, or a desktop.
* **Easy Customizability: **Combining passwordless SMS authentication with email or TouchID authentication is as easy as toggling a button inside Auth0’s Passwordless Connections dashboard:

![Passwordless Connections Dashboard](https://cdn.auth0.com/blog/sms-authentication/passwordless-connections.png)

## How To Link SMS With Social Authentication In Auth0

With Auth0 account linking, you can provide a custom UI for users to link their account to social platforms. For a more in-depth walkthrough of implementing account linking, see [our tutorial](https://auth0.com/docs/link-accounts).

![Single Page Application User Settings](https://cdn.auth0.com/blog/sms-authentication/spa-user-settings.png)

There are three key benefits to account linking in Auth0:

* **Centralized Information:** Linking with social allows users to authenticate with multiple identity providers, while only creating one account.
* **Minimal Friction:  **Because Auth0 does not support automatic account linking, all account linking is user initiated. If users find linking accounts to be inconvenient, then they don’t have to.
* **Expanded Engagement: **With social, you can pull information on users’ contacts and target new opportunities.
