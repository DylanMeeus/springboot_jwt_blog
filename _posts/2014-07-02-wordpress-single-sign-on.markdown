---
layout: post
title: "WordPress Single Sign On with Auth0"
date: 2014-07-02 09:01
outdated: true
author:
  name: Ricardo Rauch
  mail: ricky@auth0.com
  url: http://twitter.com/gravityonmars
  avatar: https://www.gravatar.com/avatar/27396b3fa24389198ef5d3e7e410e9c4?size=60
tags:
- authentication
- WordPress
- single-sign-on
- auth0
description: "We recently published the first version of the WordPress plugin for Auth0, which provides:  Single Sign On with Enterprise Directories (LDAP, AD, Google Apps"
---

![WordPress and auth0](https://s3.amazonaws.com/blog.auth0.com/wp-banner.png)

We recently published the first version of the WordPress plugin for Auth0, which provides:

* Single Sign On with **Enterprise Directories** (LDAP, AD, Google Apps, Office365 and SAML Providers).
* Shared **User/Password between multiple WordPress instances** for Single Sign On.
* Single Sign On with **[+30 Social Providers](https://docs.auth0.com/identityproviders)**.
* **User Management** Dashboard.
* Optional **Multi Factor Authentication**.
* Single Sign On between WordPress and other Applications.
* **Reporting and Analytics**.

<!-- more -->

## What can I achieve with Auth0 + WordPress?

Here are some common scenarios:

### Integrating with Enterprise

Allow users on enterprise identity system to login to WordPress with their existing corporate credentials.

<img src="https://docs.google.com/drawings/d/1RwLqfRCmmohc37e3NxXgCY4-yWL5y2mE-L6bq6T_qbQ/pub?w=1129&amp;h=717">

### Integrating with APIs

Call Facebook, Google, Salesforce, LinkedIn and other OAuth APIs from WordPress. Auth0 gives you the `access_token`, you just need to call the APIs you want.

<img src="https://docs.google.com/drawings/d/1A-ZGE1kfboIfMr2Qsca58mHwlDkJBnBVxy0emDSSt18/pub?w=888&amp;h=785">

### Single Sign On across Multiple WordPress

If you have multiple WordPress instances and you want users to have a single User/Password among them, you can use Auth0 as the central user store for all.

<img src="https://docs.google.com/drawings/d/1hRDRfsNmGOseY1_dEu_ig-JUWWBWD0gdzrqF0Aoc8ME/pub?w=865&amp;h=841">

## How it works?

When you install the plugin, the default Login box from WordPress gets replaced with our Login Widget.

![](https://s3.amazonaws.com/blog.auth0.com/wp-login.png)

Once installed, users can sign in using: Active Directory, ADFS, LDAP, Google Apps, Office365, SQL, PingFederate, Any SAML-P or WS-Federation system, SharePoint Online Apps (beta), Amazon, Facebook, LinkedIn, Twitter, Microsoft Account (formerly LiveID), Google, PayPal, Yahoo!, GitHub, vKontakte, Yandex, 37Signals, Box, Salesforce, Fitbit, Baidu, RenRen, Weibo, AOL, Shopify, WordPress, Dwolla, miiCard, Yammer, SoundCloud, Instagram, Evernote

The plugin comes with an admin page to configure things like: Allow Sign Up, Require Email Verification, Customize Logo, etc.

![](https://s3.amazonaws.com/blog.auth0.com/wp-settings.png)

## FAQs

### What happens with my existing users?

If you already have users on your WordPress installation, we just use the users' email address to link it with the existing account. This is assuming the user has the email verified.

### How do I get User Profile information?

Once the user logged in, you can access all the profile information like `name`, `email`, `nickname`, etc. and provider-specific attributes such as `work profile`, `phone number`. To do that we provide a this function: `get_currentauth0userinfo`.

## Feedback

We would love to hear your feedback. Feel free to join us in our chat room <http://chat.auth0.com>.

**Login Demo**: <http://auth0-wp.azurewebsites.net/wp-login.php>

**Plugin**: <http://WordPress.org/plugins/auth0/>

We would like to thanks the crew from [LaunchPeople](http://launchpeople.dk/) who did the initial work for this plugin.

Happy auth!
