---
layout: post
title: "SSO with Box"
date: 2013-06-30 7:09
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Another great app is added to the Auth0's portfolio. You can now setup SSO with Box. As usual, it will take just a few, very simple steps."
related:
- 2013-04-02-Auth0-Adds-Support-For-LinkedIn-PayPal-GitHub-Twitter-and-Facebook
- 2013-04-16-Custom-Authentication-With-Auth0
- 2013-06-04-introducing-db-connections
tags:
- announcements
---


Another great app is added to the Auth0's portfolio. You can now setup SSO with [Box](http://www.box.com). As usual, it will take just a few, very simple steps.

Any of our [supported Identity Providers](https://docs.auth0.com/identityproviders) would work of course, including Active Directory, LDAP, SQL, Google Apps, Office365, or any social ones.

##How does it work?

As many others, Box implements the SAML Protocol for authentication and identity federation. Auth0 bridges SAML-P with whatever your preferred Identity Provider implements: SAML, OAuth 1, OAuth 2, LDAP, a SQL database, __anything__.

<!-- more -->

##Setup

Configuring Box in Auth0 takes just a single checkbox. That's all!

![](https://puu.sh/3sjU4.png)

You will need to contact Box support team to enable SAML on your account. To make things simpler for you, you will find all the information they will request from you on the Auth0 Dashboard:

1. The signing certificate.
2. The EntityID.
3. The claim that identifies your users.
4. The redirectURL.

Once configuration is completed on their side, you are done!

We want to thank Arif Shenoy, Nick Lee & Weisen Li from Box, for their help, and great support.

[Try Auth0 yourself!](https://auth0.com)
