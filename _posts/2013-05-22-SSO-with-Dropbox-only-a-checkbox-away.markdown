---
layout: post
title: "SSO with Dropbox. Only a checkbox away"
date: 2013-05-22 7:09
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---


We keep adding great apps to Auth0's portfolio. You can now setup SSO with [Dropbox](http://www.dropbox.com) in just a few simple steps.

As usual, any of our [supported Identity Providers](https://docs.auth0.com/identityproviders) would work of course.

##How does it work?

Like other services, Dropbox implements the SAML Protocol for authentication and identity federation. Auth0 bridges SAML-P with whatever your preferred Identity Provider implements: SAML, OAuth 1, OAuth 2, LDAP, a SQL database, __anything__.

<!-- more -->

![](https://s3.amazonaws.com/blog.auth0.com/img/dropbox-architecture.png)

##Setup

Configuring Dropbox in Auth0 is reduced to a single checkbox: __enable__. That's all you need to do.

![](https://s3.amazonaws.com/blog.auth0.com/img/dropbox-auth0-setup.png)

After you enable it, you will need to complete the configuration on Dropbox. Just follow the instructions on the same page where you enabled it. You need two parameters:

1. The signing certificate
2. The Login URL

You are done!

> You can read more about Dropbox SAML SSO [here](https://www.dropbox.com/help/1909/en).

##Demo

In this very short demo you will see SSO with Dropbox, with users authenticating in Google Apps:

<iframe width="700" height="315" src="http://www.youtube.com/embed/NulZ33yrdwE?rel=0&vq=hd1080" frameborder="0" allowfullscreen></iframe>

[Try Auth0 yourself!](https://auth0.com)
