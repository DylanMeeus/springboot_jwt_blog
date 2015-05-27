---
layout: post
title: "SSO with any SAML App"
date: 2013-07-17 11:46
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---


You probably noticed that we are adding apps at a very fast pace. This past week we added [SpringCM](http://www.springcm.com) and [EchoSign](http://www.echosign.com). And we have a few more in the pipeline, as customers request them. There's no magic here, and we are a small team. So, how we do it? The secret is that it really takes very little effort. Auth0 ships with a generic __SAML App__ that is completely configurable:

![](https://s3.amazonaws.com/blog.auth0.com/img/saml2-config.png)

Supported apps like Box, Dropbox, Zendesk, Salesforce, SpringCM, EchoSign, etc. are just _templates_ to simplify and streamline configuration. But they are not strictly needed.

###Any app that supports __SAML__ is automagically supported by Auth0.

The integrations that have taken longer to publish, are with those companies that have chosen not to offer a self-service experience, and require us to call their support and enable/setup the feature for us. Human intervention adds a lot of latency in the process.

> Special kudos to [SpringCM](http://www.springcm.com) and [EchoSign](http://www.echosign.com) for a fantastic onboarding experience and great support.

<!-- more -->

##Setup

Configuring a SAML aware app is usually a matter of tweaking a few parameters. We've chosen to surface these as a Json object that you can edit online:

![](https://s3.amazonaws.com/blog.auth0.com/img/saml2-config-param.png)

We've even included an online __SAML debugger__ that shows exactly the `SAMLResponse` (encoded and decoded) that we generate. One step forward in simplifying troubleshooting of integrations. When you click on __Debug__, we will initiate the authentication process to whatever identity providers you have configured. After successful authentication we will return and display the result:

![](https://s3.amazonaws.com/blog.auth0.com/img/saml-debugger.png)

You can easily look for attributes, mappings, signatures and other SAML artifacts to quickly identify mis-configurations.

So, if you don't see the app you need on our list, fear not! Use this feature or let us know: [support@auth0.com](mailto://support@auth0.com)

[Try Auth0 yourself!](https://auth0.com)
