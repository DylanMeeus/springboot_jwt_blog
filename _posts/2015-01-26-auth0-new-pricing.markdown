---
layout: post
title: "Auth0 New Pricing"
description: "We have modified our pricing structure to be much more flexible, allowing you to create custom packages that best fit your needs."
date: 2015-01-26 08:00
author:
  name: "Gianpaolo Carraro"
  url:  http://www.twitter.com/gcarraro
  avatar: https://www.gravatar.com/avatar/aad435650eb4a93583d6aaa19f3a91f4.png?s=60
design:
  image: https://cldup.com/1RGPQw_s8c.png
  image_top: "45%"
  image_size: "180%"
  image_bg_color: "none"
  bg_color: "#212430"
tags:
- pricing
- price
- announcements
related:
- 2015-02-06-auth0-startup-plan
- 2015-06-23-another-big-milestone
- 2015-11-05-announcing-our-new-pricing-including-a-production-ready-free-account
---

### Introduction

Today we are very pleased to announce Auth0 [new pricing](https://auth0.com/pricing), along with a new **free** and **full-featured** [developer plan](https://auth0.com/signup).

{% include tweet_quote.html quote_text="Today we are very pleased to announce Auth0 new pricing." %}

### New Pricing

<p class="alert alert-warning"><i class="icon icon-budicon-179"></i>Heads up! We now have even <b>newer</b> pricing. Check out the <a href="https://auth0.com/blog/2015/11/05/announcing-our-new-pricing-including-a-production-ready-free-account/">details</a> and <a href="mailto:support@auth0.com">get in touch</a> if you have any questions!</p>

Based on the feedback we received over the last few months, we have modified our pricing structure to be much more **flexible**, allowing you to create **custom packages** that best fit your needs.

Instead of fixed tiered packages, Auth0 subscriptions can now be tailored by:

* Identity provider types: Social, Social+ and Enterprise.
* Number of __active__ users.
* Optional features, such as premium support or guaranteed SLA.
* We have also introduced a yearly commitment option.

![](https://cloudup.com/cBnh8ziTKea+)

### Always Free for Developers

The other key change is our new __developer__ subscription:

* It now includes **all the features** of the Auth0 platform.
* It has **no** time limit.
* It is **free** for non-production use (up to 20 active users).  

No more trial period. When you create a free account with Auth0, you now get access to the entirety of the Auth0 platform, for as long as you need. You can test all the required use cases and move to a paid plan only when it is the right time to do so, typically when you go in production.  

The 20 active users limit is well above what we have seen in pre-production developer accounts, where the active users are usually the developer herself, a few members of the team, and a couple of test users; but don't worry if you are still developing and testing your application and you occasionally spike over 20, we won't ever block you.
<!-- more -->

### How the new pricing works

#### (1) Choose the identity provider type

The first step is to choose the identity provider type you need:

* **Social** : This subscription enables Google, Facebook and Twitter authentication by default, and offers, by selecting the *Any Social IdP* feature, the option to authenticate to [many more popular social IdPs](https://docs.auth0.com/identityproviders#2).

* **Social +** : This subscription includes [all popular social IdPs](https://docs.auth0.com/identityproviders#2) as well as username and password database management.

* **Enterprise** : In addition to all the Social+ capabilities, this subscription includes support for [all popular enterprise IdPs](https://docs.auth0.com/identityproviders#1) (e.g. AD, LDAP, ADFS, Google Apps, SAML-P, etc). The Enterprise subscription optionally supports 3rd party application single sign-on (e.g. SSO for Salesforce, O365, Concur, Zendesk and many others).


#### (2) Choose how many active users

The second step is to choose how many __active__ users you want to include in your plan. Note that Auth0 counts only __active__ users, not registered users, meaning that you pay only for users that actually authenticate to your app, API or IoT device and not for the dormant people in your database or enterprise, which in some cases could be the majority of your population.

> An active user is ___a user that has authenticated at least once in the past 30 days.___

__Active users__ are counted "per application". For example, if you have two distinct applications, let’s say an inventory management application and a timesheet application and your users authenticate against both of them, they will be counted as two __active__ users (one __active__ user per app).

Note that we define an application as a _client id_ and _client secret_ pair, if multiple applications (say one on iOS and one on Android) share the same _client id_ and _client secret_ pair, they are a single app in this definition.

You can choose up to 100,000 Social or Social+ __active__ users and up to 5,000 enterprise __active__ users through our self service platform.  For higher volumes or specific needs please [contact us](mailto: sales@auth0.com).

#### (3) Choose optional features

##### Trust, Reliability and Premium Support
Auth0 is regularly audited for [SOC 2 compliance](https://auth0.com/blog/2014/12/11/auth0-achieves-soc-2-certification/) to demonstrate the trust we've earned from our worldwide base of sophisticated and exacting subscribers. We now also offer [Premium Support](https://auth0.com/docs/premium-support) and a [Guaranteed SLA](https://auth0.com/docs/sla) as optional features.

##### Public Cloud, Private Cloud or On-Prem
The vast majority of Auth0 subscribers' needs are fulfilled by our public cloud service.  However, if you have compliance or other constraints that require a private cloud or on-premises deployment, please [contact us](mailto:sales@auth0.com).

### Existing Subscribers
If you are an existing subscriber, you have two options:

* You can stay on your existing plan as long as you like (same price, same __active__ users allowance as you have today).
* You move to a new plan that you like better and you will charged accordingly. We will give you a pro-rated refund of the month you have already paid on your current plan.

As per those of you currently in trial mode, you will automatically be moved to the new free developer account, giving you access to even more features than your current Pro account trial.

### Conclusion

We are very excited about both our new [new pricing](https://auth0.com/pricing) and our new free and full-featured [developer plan](https://auth0.com/signup). Give them a go and do not hesitate to [share your feedback](mailto:sales@auth0.com).  
