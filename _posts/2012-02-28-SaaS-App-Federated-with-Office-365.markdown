---
layout: post
title: "SaaS App Federated with Office 365"
date: 2012-02-28 10:00
author: 
  name: Eugenio Pace
  mail: eugeniop@auth0.com
---

Auth0 supports many common identity scenarios. One of them is a SaaS app being used by companies with their own identity systems. This is the classic federation scenario.

To illustrate this, lets start by introducing the characters:

- Fabrikom is a small business, using Office365
- [MDOCS](mdocs.io) is a document sharing app hosted in the cloud

![](/img/auth0-mdocs-0365.png)

There are four challenges here for _MDOCS_:

1. How to simplify the __on-boarding__ of new customers. This involves automating the trust relationship between the app and their customers' identity systems (Office365 in this example)

2. How to do __Single-Sign-On__ so customers can use their Office365 credentials, but mdocs being a multi-tenant app, how to easily accept other platforms like Google Apps or Active Directory.

3. How to __query the user directory__ when there is one, so mdocs can implement a "people picker" that is relevant to the organization using the app.

4. How to keep track of who uses what, __for access audit__.  

###Self-Service on-boarding:

In this first video, you will see Bob (admin @ Fabrikom), connecting _MDOCS_ to their instance of Office 365:

<iframe width="420" height="315" src="http://www.youtube.com/embed/1_xsBw0qTA8?rel=0" frameborder="0" allowfullscreen></iframe>



