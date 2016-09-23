---
layout: post
title: "Yahoo Confirms Data Breach of Half a Billion User Accounts"
description: "Yahoo has confirmed that in late 2014, at least 500 million user accounts were stolen in a large-scale data breach, exposing names, emails, and more."
date: 2016-09-22
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/yahoo-data-breach/logo.png
  bg_color: "#592C71"
tags:
  - data-breaches
  - yahoo
  - security
  - attacks
  - password-breach
related:
  - 2016-08-24-announcing-password-breach-detection
  - 2016-06-21-avoiding-password-reuse-attacks
  - 2016-03-17-data-breach-response-planning-for-startups

---

---

## Half a billion Yahoo accounts were leaked in large-scale data breach

Yahoo has confirmed that 500 million user accounts were exposed in a massive data breach that occurred in late 2014. Breached data potentially included users' names, emails, phone numbers, birthdates, hashed passwords, and in some cases, encrypted or unencrypted security questions and answers. Yahoo claims that financial information such as bank accounts or credit card credentials were not included in the breached data.

The official notification from Yahoo's Chief Information Security Officer Bob Lord can be read here: [An Important Message About Yahoo User Security](https://yahoo.tumblr.com/post/150781911849/an-important-message-about-yahoo-user-security).

Yahoo announced that the company believes the hacker to be a state-sponsored actor: a hacker acting on behalf of a non-US government. A spokesperson for the FBI said they are aware of the intrusion and investigation is underway.

[Verizon is currently in the process of acquiring Yahoo for $4.8 billion](http://www.usatoday.com/story/tech/news/2016/07/25/verizon-winner-yahoo-sale/87500668/). Verizon was made aware of the data breach within the last couple of days, but a spokesperson for the communications company claims Verizon has "limited information and understanding of the impact [of the security incident]."

To comprehend the scope of this attack, let's compare it to another within the last decade. In 2007, the [TJX data breach](http://www.nbcnews.com/id/21454847/ns/technology_and_science-security/t/tjx-breach-could-top-million-accounts/#.V-RR99yClTY) exposed 94 million credit and debit card accounts. At the time, it headlined as the biggest cybersecurity attack ever. At an estimated minimum of 500 million, the Yahoo incident leaked over five times as many accounts, making it the new largest data breach in history.

Yahoo asserts that they are notifying potentially affected users. The company is also recommending that users update their passwords and security questions if they have not done so since 2014. 

Although financial data may not have been leaked in the Yahoo data breach, Yahoo also provides login for [Flickr](https://www.flickr.com/) as well as [Oauth](https://developer.yahoo.com/oauth/) for third party websites. In addition, users frequently reuse the same email addresses and passwords for multiple accounts. When user credentials are leaked, it can compromise many more accounts than the one specifically exposed.  

## Aside: Protect your users from password leaks with Auth0

Auth0 provides breached password detection that can be enabled simply and easily. The Auth0 security team maintains a database of third party breached credentials. This database is updated daily. On each login, user credentials are checked against the leaked passwords database. If a breach is suspected, the user is notified and cannot log in until they change the compromised password.

<video autoplay loop width="600">
  <source src="https://cdn.auth0.com/blog/breach/lock-2.m4v"/>
<img src="https://cdn.auth0.com/blog/breach/lock.gif"/>
</video>

Read about [Breached Passwords](https://auth0.com/breached-passwords) and [Anomaly Detection](https://auth0.com/docs/anomaly-detection) to learn more about how to protect users and their credentials with Auth0. You can also [sign up for a free Auth0 account](https://auth0.com/signup)!

