---
layout: post
title: "Automating SharePoint Federation Setup with Auth0"
date: 2013-03-27 8:49
outdated: true
alias: /2013/03/27/Automating-SharePoint-Federation-Setup-With-Auth0/
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Supporting SharePoint is a prime scenario in Auth0 and it's fully integrated into it. In this post we show how SharePoint can accept users authenticated"
related:
- 2013-03-05-On-Premises-SharePoint-Federated-with-Office-365-and-Google
- 2013-03-07-On-Premises-SharePoint-Federated-with-Partner-AD
- 2013-03-15-Integrating-Auth0-with-Rights-Management-Services
tags:
- microsoft
---


Supporting SharePoint is a prime scenario in Auth0 and it's fully integrated into it. In [this post](http://blog.auth0.com/2013/03/04/On-Premises-SharePoint-Federated-with-Office-365-and-Google/) we show how SharePoint can accept users authenticated in Google and Office365. In [this other one](http://blog.auth0.com/2013/03/07/On-Premises-SharePoint-Federated-with-Partner-AD/) we do the same with a partner using Active Directory.

In this post, we show how easy it is to **configure** SharePoint for claims based authentication.

<!-- more -->

We have fully integrated the experience into Auth0 control panel so setup is as simple as:

-1. Entering your SharePoint URL
-2. Running the PowerShell scripts we generate for you on your SharePoint box

And that's it!

![SharePoint SAML Federation](https://s3.amazonaws.com/blog.auth0.com/img/auth0-sharepoint-setup.png)

Another example of our "just works" approach to identity management in Auth0.

[Try Auth0 yourself!](https://auth0.com)
