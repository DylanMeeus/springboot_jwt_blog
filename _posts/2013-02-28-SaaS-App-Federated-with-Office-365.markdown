---
layout: post
title: "SaaS App Federated with Office 365"
date: 2013-02-28 10:00
outdated: true
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Auth0 supports many common identity scenarios. One of them is a SaaS app being used by companies with their own identity systems. This is the classic"
---


Auth0 supports many common identity scenarios. One of them is a SaaS app being used by companies with their own identity systems. This is the classic federation scenario.

To illustrate this, lets start by introducing the characters:

- Fabrikom is a small business, using Office365
- [MDOCS](http://mdocs.io) is a document sharing app hosted in the cloud

![](https://s3.amazonaws.com/blog.auth0.com/img/auth0-mdocs-0365.png)

<!-- more -->

There are four challenges here for _MDOCS_:

1. How to simplify the __on-boarding__ of new customers. This involves automating the trust relationship between the app and their customers' identity systems (Office365 in this example)

2. How to do __Single-Sign-On__ so customers can use their Office365 credentials, but mdocs being a multi-tenant app, how to easily accept other platforms like Google Apps or Active Directory.

3. How to __query the user directory__ when there is one, so mdocs can implement a "people picker" that is relevant to the organization using the app.

4. How to keep track of who uses what, __for access audit__.

###1. Self-Service on-boarding:

In this first video, you will see Bob (admin @ Fabrikom), connecting _MDOCS_ to their instance of Office 365:

<iframe width="640" height="480" src="http://www.youtube.com/embed/1_xsBw0qTA8?rel=0" frameborder="0" allowfullscreen></iframe>

###2. Single-Sign-On, Directory Query:

In this second video, you will see Tom (an employee @ Fabrikom) that logs into _MDOCS_ using his Office 365 credentials. He accomplishes this through the __Auth0 Login Widget__.

Then he creates a document and shares it with a colleage John. The "people picker" UI is using __Auth0 API__ to query users in Fabrikom's user directory (Office 365 in this case).

<iframe width="640" height="480" src="http://www.youtube.com/embed/VEtQJMdNfwM?rel=0" frameborder="0" allowfullscreen></iframe>

###3 Dashboard:

In this last video, you will see an _MDOCS_ administrator using Auth0 dashboard. He explores all connections (social and enterprise). Notice the Fabrikom connection created automatically in the on-boarding phase. He then browses the __Auth0 API Explorer__ and uses it to retrieve all Fabrikom users (returned as a JSON array). This API call is in essence the same used in _MDOCS_ on the "people picker". The __Auth0 API Explorer__ allows you to explore the API capabilities without the need to write any code.

<iframe width="640" height="480" src="http://www.youtube.com/embed/7UbtRhumX5s?rel=0" frameborder="0" allowfullscreen></iframe>

[Try Auth0 yourself!](https://auth0.com)
