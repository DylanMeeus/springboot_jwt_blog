---
layout: post
title: "Analyzing Social Connections Data: What can we learn?"
description: How To Use Social Connections To Improve Retention And Security
date: 2016-07-21 12:45
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design: 
  bg_color: "#1F3C5E"
  image: https://cdn.auth0.com/blog/social-login-stats/logo.png
tags: 
- social-login
- social-connections
- auth0
related:
- 2016-07-01-why-staying-agile-is-key-to-startup-success
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-14-safely-use-best-customer-retention-tactics
---

Facebook. Instagram. Twitter. Today, most of us have countless social media accounts that we use to stay connected.

The average digital consumer has, in total, about [25 username and password combinations](http://blog.gemalto.com/security/2015/02/05/its-time-to-move-away-from-traditional-passwords-and-prioritize-online-security/). So, it shouldn't be surprising that when a new app asks them to come up with a new one, [86% of users](https://auth0.com/learn/social-login/) report being frustrated. To ease this frustration, Auth0 supports over 30 social networks as forms of authentication.???

To determine how customers are using Auth0, data was collected throughout 2015 on end user login choices. In this article we analyze which social connections were used most, how often they were used and how developers can continue to improve security through the use of social connections.

## What Are Social Connections?

With *social connections*, an external verification page authenticates the identity of the user. You use existing login information from a social network provider instead of creating a new account on the application/website. It's quick, it's frictionless, and that can have a powerful lift effect on conversion rates—as much as [8-60%](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/).

Authenticating through social networks also means you can request specific types of data from your users, such as location, interests, and more. This is invaluable for [personalized marketing](https://auth0.com/learn/social-login/).

![Enabling Social Connections](https://cdn.auth0.com/blog/social-login-stats/enabling-social-connections.png )

Auth0 [simplifies the process](https://auth0.com/learn/social-login/) of reconciling the profile properties, required headers, and response formats of all the different social APIs. A simple “ON” switch controls each authentication, allowing developers to pick and choose which they want to enable and which they don't. 

### What social connections are being used?

Throughout 2015, we collected data to find out which social connection options were being used most often:

![Social Connections Usage](https://cdn.auth0.com/blog/social-login-stats/social-connections-usage.png)

**Findings:**

* Google and Facebook represent more than **76%** of Social Connections.
* Google is the most popular (**51%**) and almost doubles Facebook (**26%**).
* Twitter (**4.7%**) comes in 4th place after Windows Live (**6.7%**).

Looking closer at the social connections results shows that the distributions are reflected in the estimated monthly site visits of each of these sites (according to data from July 2016 on [Alexa.com](http://alexa.com/)) with Google having more than 4.5 billion users, about 2x Facebook's 2.28 billion. These numbers far exceed Windows Live's 534 million or Twitter's 444 million.

![Social Connections vs Monthly Site Visits](https://cdn.auth0.com/blog/social-login-stats/social-connections-vs-monthly-site-visits.png )

Google and Facebook are clearly the biggest players, which makes sense—they have the most users. But most businesses will want to look into smaller networks that tie into their user base more closely because of the information they can gather:

* **Developer-focused apps**: GitHub and BitBucket will draw the same audience and give you information on the code they are developing to determine how your product can better help them.
* **Sales-focused apps:** A Salesforce login can provide information on the customers your user is targeting allowing you to direct them to applicable features of your app.
* **Fitness apps:** A Fitbit login would allow users to sync their account information with another complementary platform that they might also be using for this niche. 

To personalize your app's experience, dig deeper than Google/Facebook and think about what smaller social networks your users are on.

## How Often Are Social Connections Used?

Auth0 allows developers to use enterprise, conventional username/password, and Passwordless logins alongside Social Connections. We will group Passwordless and Social Connections in the Single Sign On category. Here is the split of total users by connection type:

![Total Users per Connection Type](https://cdn.auth0.com/blog/social-login-stats/total-users.png)

**Findings:**

* Only 4.7% of all logins are social connections.
* Username and password logins still dominate at 70.5%.
* Passwordless logins currently account for less than 1%.

It's alarming that such a large percentage of logins are still username and password-based for 3 reasons:

* Most users don't bother coming up with a complicated password, use the same password for many accounts or share passwords with friends, making the “[security through obscurity](http://www.makeuseof.com/tag/usernames-passwords-thing-past-cope/)” of passwords ineffective.
* If a username or password is forgotten, most of the times a long and [inconvenient](http://www.networkcomputing.com/network-security/why-we-need-move-beyond-passwords/1521264108) email recovery and reset process is necessary to recover that information.
* Offering only username & password login is [less effective](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/) as companies who added additional login options, such as social connections, saw conversion rates increase up to 50%.

There needs to be an increased use of social connections and Passwordless authentication, especially for B2C companies.

If your users are likely to have accounts on popular social providers and if your application can gain additional features by interacting with the social provider’s API, social authentication may prove beneficial. 

By requesting additional user attributes through social connections, such as location, birthday or friends, you can create an extremely [personal onboarding experience](https://auth0.com/blog/2016/05/13/7-lessons-that-will-save-your-user-onboarding). With such a [quick Aha! moment](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/), such as seeing which other friends are using the app, users are more likely to stay.

## Conclusion

Major findings:

1. **Majority of social connections are Google or Facebook accounts**. Adding these can greatly increase retention.
2. **Only 4.7% of all connections are social**. This means there's much room for growth, and the trend shows that the usage is constantly increasing.
3. **Social connections can give you access to personalized data for better onboarding**.
4. **Social connections still hold up against the rise of Passwordless because of this additional data.**

Moving forward, businesses can use social connection options, particularly Google and Facebook, to improve user retention. Getting away from username and password logins, toward either social connections or Passwordless login, is also the surest way to make apps more secure.
The good news is that not only Auth0 can make your life easier when adding social connections to your apps, but you can use the free tier and get social connections with up to two providers. So if you pick Google and Facebook you got 76% of social connections covered for free! An excellent reason to try Auth0 today, so what are you waiting to click the button below 😄.
