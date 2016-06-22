---
layout: post
title: "Avoiding Password Reuse Attacks with Auth0"
description: Anomaly Detection can protect your users from password reuse attacks
date: 2016-06-21 11:00
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
design:
  bg_color: "#910012"
  image: https://cdn.auth0.com/blog/anomaly-detection/logo.png
tags:
- anomaly-detection
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

Just last week, [GitHub](https://github.com/blog/2190-github-security-update-reused-password-attack) reported that there were several unauthorized attempts—some of them successful—to access a large number of accounts. A thorough investigation revealed that it was an attacker using lists of email addresses and passwords from other online services that have been compromised in the past. As many people use the same password on multiple online services, attackers were able to log in to a number of GitHub accounts. Thankfully, GitHub was not compromised, but some of the accounts were due to this reason.
At **Auth0**, we are aware of this problem and we can help you deal effectively with cases like this. Let's take a deeper look at what Auth0 can do for this kind of situations.  

##  How Auth0 Can Help Protecting Your Users' Accounts

Auth0 provides an awesome security feature called **Anomaly Detection**. It comprises in-built tools that help you detect suspicious activities on your users' accounts, alert them of these activities, and it can also stop malicious attempts to access your application. **Anomaly Detection** provides the following benefits:

- **Breached Password Detections**: Auth0 tracks large security breaches that are happening on major third-party sites to help keep your users and systems secure. By enabling Breached Password Detection, your users can be notified and/or blocked from logging in if we suspect that their credentials were part of a published security breach. The best part? It is enabled just by flipping a switch.


<img src="http://cdn.auth0.com/blog/anomaly-detection/breached-pass-lock.png" alt="Breached Password Lock Error"/>
> Lock Error on Login

<img src="http://cdn.auth0.com/blog/anomaly-detection/breached-pass-dashboard.png" alt="Breached Password Dashboard"/>
> Enabling Breached Password Detection on the Dashboard

<img src="https://cdn.auth0.com/blog/anomaly-detection/breached-pass-email.png" alt="Breached Password Email" />
> Notification Email Sent to the user when a breached password is used.

- **Brute Force Protection**: Using Auth0, you can easily set a certain number of failed login attempts on your account. If it exceeds that set number, you can block the user, send him an email, and also notify dashboard owners.

Using Auth0, you can easily set up **Anomaly Detection** on your dashboard to protect your users.

<img src="https://cdn.auth0.com/docs/media/articles/anomaly-detection/anomaly-detection-overview.png" alt="Anomaly Detection Overview"/>

You can use the switches to enable/disable all the actions of a certain shield.

<img src="https://cdn.auth0.com/docs/media/articles/anomaly-detection/changing-actions.png" alt="Changing Actions" />

> Read more about Auth0's Anomaly Detection [here](https://auth0.com/docs/anomaly-detection)

## 5 tips for protecting your passwords

Anomaly Detection is a great tool for protecting your users' accounts, but security should be a concern for all parties. Here are 5 tips that users can take into account to protect their passwords.

### 1 - Don't use the same password across multiple online services

If hackers get hold of your Github password, it shouldn't be an automatic entry visa to your Facebook, Twitter, Instagram, and Snapchat accounts. Having to remember several passwords involves a strong muscle memory, so you can decide to use a password manager to take care of that, but ensure it's a really trusted and secured one.

### 2 - Guard your password

Your password is valuable. Don't share it with anyone, even friends or family. Don't store it in your mail inbox. Make sure it is confidential. If you use someone else's system to log in and perform a certain activity on an online service, don't forget to log out!

### 3 - Change passwords frequently

As bigger companies get hacked, the likelihood that your password is leaked increases. Make a habit of frequently changing your passwords.

### 4 - Two-factor Authentication

**Two-factor Authentication (TFA)** is a method of authenticating users by adding a second factor to validate the user's identity. Typically, it involves entering a one-time token that is dynamically generated and delivered through a method that only the user has access to.

> Learn more about Multifactor Authentication, in the [Get Started with MFA landing page](https://auth0.com/learn/get-started-with-mfa).

With TFA, a hacker must have access to your mobile phone or second factor to be able to gain access to your account.

### 5 - Passwordless Login via SMS and email

With Passwordless Login you can use one-time codes or “magic links” delivered via SMS or email. In this way, only users who have access to the registered email account or registered phone will be able to login.

> Read more about Passwordless [here](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/).

![Passwordless Login](https://cdn.auth0.com/blog/passwordless/pwdless-locks.png)

## Conclusion

Online services are getting hacked on a daily basis, and hackers are also getting smarter every day. We have seen several big companies like Slack, Paypal and LinkedIn experience data breaches. It is never too late to start guarding your users, data, money, and your precious reputation more seriously; until it is too late.
