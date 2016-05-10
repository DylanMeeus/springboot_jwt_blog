---
layout: post
title: "Custom Authentication With Auth0"
date: 2013-04-16 14:11
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Many companies rely on databases to store user credentials. Either because they use pre-built systems like ASP.NET Membership, or because they wanted to keep"
related:
- 2013-04-02-Auth0-Adds-Support-For-LinkedIn-PayPal-GitHub-Twitter-and-Facebook
- 2013-06-05-connect-windows-azure-active-directory-with-salesforce-dropbox-sharepoint-zendesk
- 2013-06-04-introducing-db-connections
tags:
- announcements
---


Many companies rely on databases to store user credentials. Either because they use pre-built systems like ASP.NET Membership, or because they wanted to keep those users outside their main identity system (e.g. Active Directory) or just because of historical reasons ... (a.k.a. legacy)

In fact, one of the most requested features in ADFS was the ability to authenticate users _outside_ AD. A very annoying limitation in the product, that still has not been addressed.

Because this is so common, we decided to support it out of the box in Auth0. The __Auth0 Custom Connector__ is a component that you deploy to your infrastructure, that connects to any database (or anything really), and seamlessly integrates with Auth0.

Once setup is done (a very simple process in itself), you can continue to leverage those identities and connect them with any apps supported by Auth0: SharePoint, CRM, mobile, etc.

Here's the entire process in less than 3 minutes:

<!-- more -->

<iframe width="700" height="394" src="http://www.youtube.com/embed/p3rK7fgPEN0?rel=0" frameborder="0" allowfullscreen></iframe>

Notice that authentication with SQL (and MongoDb) is straight forward, but you can actually connect with whatever you want. This video shows an example that uses [edge](https://github.com/tjanczuk/edge) to call .NET code.

[Try Auth0 yourself!](https://auth0.com)
