---
layout: post
title: "How PayPal could have easily avoided the last account hack"
description: In this post you'll learn 5 techniques that can prevent your user's accounts from being hacked and would have made Brian happier
date: 2015-12-29 18:00
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design: 
  bg_color: "#222D65"
  image: https://cdn.auth0.com/blog/paypal/logo.png 
tags: 
- paypal hack
- security
- multifactor authentication
- single sign on
- passwordless
---

Yesterday, _Brian Krebs_ from [Krebs on Security](http://krebsonsecurity.com/2015/12/2016-reality-lazy-authentication-still-the-norm/) reported that his PayPal account was hacked using of of the oldest hacking methods: **social engineering**, and knowing some pieces of static information about the account owner —the last four digits of an old credit card and the last four digits of the social security number—.

Being a known security expert, Brian's account password was strong, that is, long, using all types of characters, and complex. A strong password is mandatory, especially for a service that is directly linked to your credit cards. Soon he discovered that his password was not compromised, but the cyber criminal called PayPal customer support, impersonated him and got access to his account in a matter a minutes, only providing that static and easy-to-obtain information about the user, not once but twice.

## 5 things that could have prevented the hack

In this post, we'll teach you 5 things you can implement to avoid having your users hacked. Make Brian safe again!

### 1 - Multifactor Authentication

**Multifactor authentication (MFA)** is a method of identifying users by presenting several separate authentication stages. Some of those stages could be Time-based One-Time Password (TOTP), Mobile verification, a hardware token, among others. 

> Learn more about MFA, in the [Get Started with MFA landing page](https://auth0.com/learn/get-started-with-mfa).

Believe it or not, most of the biggest retail stores don't provide these additional layers of security or are just starting to provide them. For example [**Amazon**](http://www.amazon.com) added this option in mid-November without making an official announcement, as stated by [The Verge](http://www.theverge.com/2015/11/18/9753888/amazon-two-factor-authentication-2fa).

With MFA besides knowing the password, a mobile phone or token device needs to be in possession of the user to access the account. Some companies believe that enforcing multifactor authentication can make them lose a significant number of users, but an intermediate solution can be achieved by requiring a second factor only for resetting the password.

PayPal have this option available by using hardware tokens, but evidently this is not required in their password reset flow.

<div class="" style="text-align: center;"><img style="margin: 0; max-width: 200px;" src="https://cdn.auth0.com/docs/media/landings/why-is-mfa-necessary/why-is-mfa-necessary.png" alt="Multifactor Authentication" />
</div>

### 2 - Passwordless Login via sms y email
With Passwordless Login you can use one time codes or `magic links` delivered via SMS or e-mail. In this way only users that have access to the registered email account or registered phone will be able to login. If Paypal support would have this option, they could have ensured that the person claiming access was the legitimate owner by sending an email or SMS with a code or link.
​​
> You can read more about Passwordless [here](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/).

![Passwordless Login](https://cdn.auth0.com/blog/passwordless/pwdless-locks.png)

### 3 - Step Up Security
With **Step Up security**, critical action in user accounts —adding or changing email accounts, changing passwords, and so on— require additional security measures. The attacker called customer support to reset a password. This critical action needs stronger security measures —such as multifactor or passwordless—, as the company needs to ensure that the legitimate user is performing it. 

![Step Up Security](https://cdn.auth0.com/blog/paypal/step-up-security.png)

### 4 - Trained Support
Companies **must invest** in training their customer support employees in security procedures. This point is often missconsidered, which leads to situations like granting access to anyone with the sufficient static information. And this in turn will make the company lose its reputation.

![Trained Support](https://cdn.auth0.com/blog/paypal/trained-support.png)

### 5 - Single Sign On with Another Service
Using Single Sign On, once you log into one trusted service or provider, you won't have to enter your credentials again when entering another application that supports it, as you will be automatically logged in all supported applications, regardless of the platform, technology, or domain.
If Paypal, allowed Single Sign On with another trusted service, it will be an additional security layer to prevent the hack. A legitimate user that lost its password and is logged into a trusted service could easily reset his password without needing to go trough customer support.

> Learn more about [Single Sign On](https://auth0.com/learn/how-to-implement-single-sign-on).

<div class="" style="text-align: center;"><img style="margin: 0; max-width: 200px;" src="https://cdn.auth0.com/docs/media/landings/login/bg-login.png" alt="Single Sign On" />
</div>

## Aside: How Auth0 can help you strengthen the security of your application's accounts
Using Auth0 you can add the following features to your application in a breeze.

- **Multifactor Authentication**: Using Auth0 you can have MFA implemented in minutes! You can use the out-of-the-box providers or easily integrate any different provider using Auth0's extensibility.

- **Passwordless**: [Auth0 Passwordless](https://auth0.com/passwordless) supports one time codes or “magic links” delivered via SMS or e-mail, or use the iPhone’s TouchID without having to worry about the implementation details.

- **Single Sign On**: By taking advantage of our wide range of SDKs you will have Single Sign-On with any Identity Provider running in minutes. Provide your users with a seamless authentication experience when they navigate either through the applications you built and/or third party apps.

## Final Words
What it is interesting is that **PayPal**, populated by a lot of smart people and with more actual experience in online payment systems than almost anyone, relies on inherently insecure procedures. They certainly know everything Krebs talks about in its post, they have the resources to do something different, and they don’t. Why Paypal doesn’t have tighter procedures? The answer to that question is probably because their cost of fraud is lower than the cost of implementation. You can be 100% sure they’ve modeled it out and believe that tighter security drives away customers or some other cost factor that outweighs the cost of fraud. As we always say, if companies don't handle security properly, that could lead to losing their most precious asset, its reputation.
