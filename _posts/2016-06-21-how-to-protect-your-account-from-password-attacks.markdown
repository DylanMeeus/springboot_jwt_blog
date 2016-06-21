---
layout: post
title: "How to protect your account from password attacks"
description: In this post you'll learn how to protect your user accounts and prevent them from being hacked
date: 2016-06-21 6:00
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
design:
  bg_color: "#910012"
  image: https://cdn.auth0.com/blog/paypal/logo.png
  image_tw: http://cdn.auth0.com/blog/paypal/twitter-card.png
  image_fb: http://cdn.auth0.com/blog/paypal/twitter-card.png
tags:
- github-hack
- security
- multifactor-authentication
- single-sign-on
- passwordless
related:
- 2015-10-22-5-ways-to-make-your-app-more-secure-in-less-than-20-minutes
- 2015-09-23-what-is-and-how-does-single-sign-on-work
- 2016-01-27-setting-up-passwordless-authentication-with-the-auth0-dashboard
---

Just last week, [GitHub](github.com) reported that there were several unauthorized attempts to access a large number of their accounts. A thorough investigation revealed that it was an attacker using lists of email addresses and passwords from other online services that have been compromised in the past on several [Github](github.com) accounts. So many people use the same password on multiple online services thus allowing the attacker to log in to a number of GitHub accounts. Thankfully, GitHub was not compromised. **Auth0** can help deal effectively with cases like this. Let's take a deeper look at how **Auth0** can handle password attacks.  

##  How Auth0 Can Help Protect Your Account

Auth0 provides an awesome security feature called **Anomaly Detection**. There are in-built tools that help detect suspicious activities on your users account, alerts them of these activities and also stops malicious attempts to access your application. **Anomaly Detection** provides the following benefits below:

- **Breached Password Detections**: Auth0 tracks large security breaches that are happening on major third party sites to help keep your users and system secure. By enabling Breached Password Detection, your users can be notified and/or blocked from logging in if we suspect their credentials were part of a published security breach.

- **Brute Force Protection**: Using Auth0, you can easily set a certain number of failed login attempts on your account. if it exceeds that set number, you can block the suspicious user, send an email to the affected user and also notify dashboard owners.

Using Auth0, you can set up [Anomaly Detection](Anomaly Detection) on your dashboard.

<img src="https://cdn.auth0.com/docs/media/articles/anomaly-detection/anomaly-detection-overview.png" alt="Anomaly Detection Overview"/>

You can use the toggle to enable/disable all the actions of a certain shield.

<img src="https://cdn.auth0.com/docs/media/articles/anomaly-detection/changing-actions.png" alt="Changing Actions" />

> Read more about Auth0's Anomaly Detection [here](https://auth0.com/docs/anomaly-detection)

In addition to this, here are 5 tips for protecting your passwords.

### 1 - Don't use the same password across multiple online services

If hackers get hold of your Github password, it shouldn't be an automatic entry visa to your Facebook, Twitter, Instagram and Snapchat accounts. Having to remember several passwords involves a strong muscle memory, so you can decide to use a password manager to take care of that but ensure it's a really trusted and secured one.

### 2 - Guard your password

Your password is valuable. Don't share it with anyone, even friends. Don't store it in your mail inbox. Make sure it is confidential. If you use someone else's system to log in and perform a certain activity on an online service, don't forget to log out!  

### 3 - Change passwords frequently

As bigger companies get hacked, the likelihood that your password is leaked increases. Make it a habit to frequently change your passwords.

### 4 - Two-factor Authentication

**Two-factor Authentication (TFA)** is a method of authenticating users by sending a text message with a temporary password to the user's phone. This technique is otherwise known as **Multi-factor Authentication**

> Learn more about MFA, in the [Get Started with MFA landing page](https://auth0.com/learn/get-started-with-mfa).

With TFA, a hacker must have access to your mobile phone and text message containing the password to be able to gain access to your account.

### 5 - Passwordless Login via sms and email

With Passwordless Login you can use one-time codes or “magic links” delivered via SMS or email. In this way, only users who have access to the registered email account or registered phone will be able to login.

> Read more about Passwordless [here](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/).

![Passwordless Login](https://cdn.auth0.com/blog/passwordless/pwdless-locks.png)

## Conclusion

Online services are getting hacked on a daily basis, Hackers are also getting smarter daily. We have seen several big companies like Slack, Paypal and Github experience data breach. It's hightime you guarded your users, data, money and your precious reputation more seriously.
