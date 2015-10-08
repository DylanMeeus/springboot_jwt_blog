---
published: "true"
layout: post
title: Connecting WS-Fed (WIF) based apps to Auth0
date: "2013-10-18 19:50"
outdated: true
author:
  name: Sebastian Iacomuzzi
  mail: sebastian@auth0.com
  url: https://github.com/siacomuzzi
  avatar: https://secure.gravatar.com/avatar/c35416d45481332127c88e4cd355555f?s=400&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png
description: "WS-Federation has been supported in Auth0 for quite some time. After all, it is the protocol used by SharePoint, MS-CRM, Rights Management Server, all of them supported by Auth0 from the very beginning"
---


WS-Federation has been supported in Auth0 for quite some time. After all, it is the protocol used by SharePoint, MS-CRM, Rights Management Server, all of them supported by Auth0 from the very beginning. Not surprisignly, `WS-Fed` is primarly a Microsoft centered protocol.

We have now opened up the protocol to any app, by adding a `WS-FED` application type. We expect it will be used mostly by developers in the Microsoft platform using Windows Identity Foundation.

With this, you can do protocol transition between WS-Fed and [any of the supported identity providers](https://docs.auth0.com/identityproviders) in Auth0 regardless of what protocol they implement: SAML-P, OpenID, OAuth2, OAuth1, databases, etc.

<!-- more -->
So, for example, you can authenticate users in Salesforce (using OAuth2), or Twitter (Oauth1) and send back SAML tokens to your WIF based apps seamlessly.

##How to use it?

Go to __Applications__ and create a new __"WS-Fed (WIF) Web App"__, enter a couple parameters and your done!

![](https://s3.amazonaws.com/blog.auth0.com/img/ws-fed-wif-apptype.png)

All common parameters are readily available. We also provide a metadata endpoint for importing this directly into the app (e.g. "Add STS Reference" in Visual Studio).

We also provide the entire `web.config` section that you can paste into your apps.

[Try Auth0 yourself!](http://developers.auth0.com)
