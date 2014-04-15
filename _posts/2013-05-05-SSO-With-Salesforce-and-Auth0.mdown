---
layout: post
title: "SSO with Salesforce.com and Auth0"
date: 2013-05-05 8:29
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---


Last week we added support to Auth0 to integrate with Salesforce.com. This means that you can now enjoy SSO with Salesforce with any of our [supported Identity Providers](https://docs.auth0.com/identityproviders) in minutes.

##How does it work?

Salesforce implements the SAML Protocol for authentication and identity federation. Auth0 bridges SAML-P with whatever your preferred Identity Provider implements: SAML, OAuth 1, OAuth 2, LDAP, a SQL database, __anything__.

<!-- more -->

![](https://s3.amazonaws.com/blog.auth0.com/img/salesforce-architecture.png)

> Salesforce provides a very handy SAML Validator that allows you to test the [SAML Responses](http://login.salesforce.com/help/doc/en/sso_saml_assertion_examples.htm) it expects. One small glitch is that even though the Validator will accept _deflated_ content, Salesforce itself won't. Not that you need to use this option, as responses will typically be small payloads. It's just a small inconsistency in the docs that might leave you scratching your heads.

##Setup

Configuring Salesforce in Auth0 is reduced to a single checkbox: __enable__. Can you think of a simpler way?

![](https://s3.amazonaws.com/blog.auth0.com/img/salesforce-auth0-setup.png)

Once you enable it, you need to complete configuration on Salesforce itself. You get all the instructions on the same page where you enable it. Three parameters are used on Salesforce:

1. The signing certifcate
2. The Issuer name
3. The Login URL

You are done!

##Demo

In this very short demo you will see SSO open Salesforce with users authenticating in Office365:

<iframe width="700" height="394" src="http://www.youtube.com/embed/bpJxCcQG4xY?rel=0&vq=hd1080" frameborder="0" allowfullscreen></iframe>

[Try Auth0 yourself!](https://auth0.com)
