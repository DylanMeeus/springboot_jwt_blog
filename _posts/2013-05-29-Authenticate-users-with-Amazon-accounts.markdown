---
layout: post
title: "Authenticate users with Amazon accounts"
date: 2013-05-29 16:57
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Today Amazon announced a new Login Service, which allows you to connect with millions of their customers"
related:
- 2013-04-02-Auth0-Adds-Support-For-LinkedIn-PayPal-GitHub-Twitter-and-Facebook
- 2013-05-22-SSO-with-Dropbox-only-a-checkbox-away
- 2013-06-04-introducing-db-connections
tags:
- announcements
---


Today Amazon announced [a new Login Service](http://login.amazon.com), which allows you to connect with millions of their customers:

From their [press release](http://phx.corporate-ir.net/phoenix.zhtml?c=176060&p=irol-newsArticle&ID=1824961&highlight=):
> Today, Amazon launched __Login with Amazon__, a new service that will enable the over 200 million active Amazon customers to securely and simply login to apps, games, and websites. Login with Amazon allows developers to easily reduce sign-in friction for their customers, leading to higher engagement and order conversion.

The good news for those using Auth0, is that connecting with Amazon is just a click away. We launched support for Amazon today:

![SSO Amazon](https://s3.amazonaws.com/blog.auth0.com/img/auth0-amazon-connection.png)

<!-- more -->

Auth0 gives you the ability to connect Amazon accounts with _any_ application: web, mobile or native; regardless of what platform it is written on, or what identity protocols it supports. Auth0 supports .NET, Java, Ruby, iOS, Android, Windows, and others with very few lines of code, and minimum intrusion.

And this extends of course to popular apps like __Salesforce__, __Zendesk__, __Dropbox__, __SharePoint__, __MSCRM__, among others. We keep adding popular apps and the list grows quickly!

There are two permission scopes available today in Amazon:

* __Basic Profile__, the default permission that allows you to retrieve the user's name, e-mail and a unique id.
* __Postal Code__, that allows you to retrieve the location of the user.

These two are very easily configured with Auth0 dashboard:

![SSO Amazon](https://s3.amazonaws.com/blog.auth0.com/img/auth0-amazon-dashboard.png)

Registration of your instance of Auth0 with Amazon is very straightforward and [fully documented](https://docs.auth0.com/amazon-clientid) right were you need it.

[Try Auth0 yourself!](https://auth0.com)
