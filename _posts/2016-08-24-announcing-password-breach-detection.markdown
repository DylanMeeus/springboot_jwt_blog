---
layout: post
title: "Announcing Password Breach Detection for Auth0"
description: "A new feature that could save you and your users a lot of trouble!"
date: 2016-08-24 13:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/breach/logo.png
  image_size: "100%"
  image_bg_color: "#f5f7f9"
  blog_series: false
tags:
- security
- password
- leak
- breach
- prevention
- detection
- auth0
related:
- 2016-06-21-avoiding-password-reuse-attacks
- 2016-01-27-setting-up-passwordless-authentication-with-the-auth0-dashboard
- 2015-10-22-5-ways-to-make-your-app-more-secure-in-less-than-20-minutes

---

Today, we are introducing a new feature for all of our users: [password breach detection](https://auth0.com/breached-passwords)! Read on to find out how it works and how to enable it for your account.

{% include tweet_quote.html quote_text="Introducing a new feature for all Auth0 users: Password breach detection!" %}

-----

## Protect your users from password leaks
You have seen it [again](https://techcrunch.com/2016/06/08/twitter-hack/) and [again](http://arstechnica.com/security/2014/10/7-million-dropbox-usernamepassword-pairs-apparently-leaked/): passwords get leaked. Bad security practices, careless users, negligent password storage, reused passwords. All of these play a part in the big leaks. But when they happen, the first thing you need to do is *react fast*. Changing passwords, blocking access to compromised accounts can make all the difference between a scare and a big problem.

{% include tweet_quote.html quote_text="When password leaks happen, the first thing you need to do is react fast." %}

This is why we have developed our password breach detection solution: to allow you and your users to react as quickly as possible.

## How it works
Our security team keeps a keeps a keen eye on leaks in the wild. We have built a strong database of leaked passwords that gets updated every day. Whenever a user attempts to access his or her account, we first perform a check against our leaked password database. If a leak is suspected, the user is notified and action is taken.

<video autoplay loop width="600">
  <source src="https://cdn.auth0.com/blog/breach/lock.m4v"/>
<img src="https://cdn.auth0.com/blog/breach/lock.gif"/>
</video>

What are the actions taken?

1. An e-mail is sent to notify the user of the situation.
2. Logins are blocked until the user changes the password.

Of course, you can enable or disable these actions independently in the dashboard.

## How to enable it
To enable password breach protection, you only need to [toggle an option in the dashboard](https://manage.auth0.com/#/anomaly). It really is as simple as that!

![Lock's password leak notification](https://cdn.auth0.com/blog/breach/enable.png)

You can also read the docs and learn more about [Anomaly Detection](https://auth0.com/docs/anomaly-detection).

If you haven't signed-up, do it now! <a href="javascript:signup()">Try Auth0 and password breach protection for free</a>.
