---
layout: post
title: "Analyzing Passwordless Connections Data: What can we learn?"
description: Why Passwordless Login Is The Way Of The Future 
date: 2016-09-09 12:30
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design: 
  bg_color: "#18181C"
  image: https://cdn.auth0.com/blog/analyzing-passwordless/logo.png
tags:
- passwordless
- JWT
- auth0
related:
- 2016-07-21-analysis-of-social-connection-data
- 2016-08-02-analysis-of-enterprise-connections-data
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
---

Last year we launched [Auth0 Passwordless](https://auth0.com/passwordless) and since then, we've seen increasing success. Passwordless is a method of removing passwords from the login process completely. Instead, it uses one-time codes or “magic links” sent to your user's SMS or email, or uses the iPhone's TouchID as a method of authentication. 

With [59% of users](https://www.passwordboss.com/password-habits-survey-part-1/) admitting to reusing passwords to avoid having to remember multiple, and the process of recovering a lost password being unnecessarily unpleasant, Passwordless offers a much simpler and more streamlined user experience.

Throughout 2015 and early 2016, data was gathered on how Auth0's users and our user's users were using Auth0. We noticed some inspiring trends regarding Passwordless growth.

## The Data So Far

Passwordless was officially announced in September of 2015. The interesting thing to note is that people were already using Passwordless connections way before it was even announced, lending to the argument that it's definitely a good option. 

In January of 2015 there were about 50,000 connections, with steady growth of about 10,000 every month until September when it spiked. Since then, there's been a steady 10,000-20,000 growth in connections per month and it's still rising.

![Passwordless Connections from Jan 2015 to May 2016](https://cdn.auth0.com/blog/analyzing-passwordless/passwordless-connections-from-jan2015-may2016.png)

In the 17 months from January 2015 until May 2016 when we collected our last data point, Passwordless connections have seen 6X growth. In the first few months of 2016, growth of username and password usage was only 0.83%. In the same time span, an increase in Passwordless usage was over 11%.

Passwordless continues to grow for a [number of reasons](https://auth0.com/blog/how-passwordless-sms-authentication-can-improve-your-app/):

* **Improved User Experience**: Passwordless means that you don't add to the growing number of passwords that your users have to remember. Instead you remove the friction for them using your app and allow them to quickly sign up.
* **Increased Security**: By using a randomly-generated code sent to SMS or e-mail, logins are now much harder to hack. It is no longer possible for someone to simply use encrypted malware to steal your private information. 

Passwordless is almost as [easy to use for developers](https://auth0.com/blog/auth0-passwordless-email-authentication-and-sms-login-without-passwords/) as it is for users, making it a welcome change for both parties.

## When Passwordless Will Overtake Passwords

Using the data we collected, we projected growth estimates for Passwordless implementation in relation to Username/Password (U/P) usage. We can see that Passwordless is projected to overtake U/P in mid-2027, which is impressive considering how long U/P has been around.

![Forecast: User/Password Connections vs Passwordless Connections](https://cdn.auth0.com/blog/analyzing-passwordless/forecast-up-vs-passwordless.png)

Of course, it's even more important to note that these projections were made while keeping U/P constant. In reality, it's likely that while Passwordless grows, U/P is likely to fall. With so many other options available for authentication, including [Social Connections](https://auth0.com/blog/how-to-use-social-login-to-drive-your-apps-growth/) and Passwordless, the number of people using U/P is likely to decrease significantly, as it is the most inconvenient and least secure option. 

### What Could The Future Hold?

We drew up another projection of Passwordless growth based on the almost exponential rate of growth that Passwordless has seen so far. The estimate shown above is much more conservative in that it only takes into account a very linear rate of growth.

In this projection, we see that even when U/P is estimated with a similar increasing rate of growth, Passwordless overtakes it within a year. This is much faster compared to the estimate above of ~10 years.

![Passwordless Connections Growth with Previous Growth Rates](https://cdn.auth0.com/blog/analyzing-passwordless/passwordless-growth-with-previous-growth-rates.png)

So which of these is the “real” estimate? The truth likely lies somewhere in the middle. While we don’t think Passwordless will grow as fast as the exponential growth projects, we do think that as more people see the benefits of Passwordless, the rate of growth will no doubt increase. Expect to never have to remember a password again somewhere in the early 2020s!

## How To Implement Passwordless To Add Your Users To These Numbers

Developing your own in-house SMS API for passwordless login is both [difficult and costly](https://auth0.com/blog/how-passwordless-sms-authentication-can-improve-your-app/). Luckily, implementation of Auth0’s Passwordless Logins is quick and easy to achieve. 

Within the Auth0 Dashboard, you can choose to configure SMS, Email, TouchID or all three Passwordless options. Using SMS and Email will send a magic code or link that your user can type in or click to login. TouchID is a biometric authentication method storing the user's fingerprint and when detected, using that to log them in.

![Passwordless Connections](https://cdn.auth0.com/blog/analyzing-passwordless/passwordless-connections.png)

Even the documentation is simple for developers to implement, and Auth0 provides [tutorials](https://auth0.com/docs/connections/passwordless) to guide you every step of the way. 

![Adding Passwordless - Code Snippet](https://cdn.auth0.com/blog/analyzing-passwordless/adding-passwordlessa.png)

Using Auth0's Passwordless greatly simplifies the process of making your authentication method much safer for your users.

## Passwordless Is The Future

With Passwordless connections seeing 6X growth in just 17 months, there is no question that Passwordless is steadily growing and will continue to do so. It is projected to overtake U/P usage as soon as late 2017 and no later than mid 2027, making it clear that the time to switch is now.

This really is a great thing for both developers and users as it will increase convenience and security on both ends. You can test it out using the [demo](https://auth0.github.io/lock-passwordless/) and when you're convinced, it's easy to [get started](https://auth0.com/passwordless)!
