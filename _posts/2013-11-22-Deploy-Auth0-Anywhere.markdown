---
layout: post
title: "Deploy Auth0 Anywhere"
date: 2013-11-22 5:18
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Auth0 is a truly symmetric service: it is offered as a service, it can be deployed on your own cloud environment, or it can run on-premises."
---


Auth0 is a truly symmetric service: it is offered [as a service](https://app.auth0.com), it can be deployed on your own cloud environment, or it can run on-premises.

Across all these environments you will enjoy the same experience and functionality. You can start in one, and then move to another one. You can use our service for development and QA, but then run in production with your own dedicated instance. From an application perspective, the impact is reduced to a new URL, and minor configuration settings.

![](https://s3.amazonaws.com/blog.auth0.com/img/ascii-art.png)

<!-- more -->

We envisioned Auth0 as an __appliance__. A black box that you plug to power and network and _"it just works"_ with minimal setup, configuration and hassle.

Why would you run Auth0 yourself? There are many reasons. The most common one are regulatory constraints and policies, such as those found in certain industries: healthcare, financial services are good examples.

But being able to __run anywhere__, has many advantages. Our own cloud service is multi-cloud: it currently runs on __Azure__ and __Amazon Web Services__ simultaneously, and in different geo-locations. This gives us additional resiliency and fault tolerance, because we are relying on highly independent components.

Having the ability to move your workloads freely between environments, means we can be closer to where our customers need us.

And last, but certainly not least, it means we are free to host in the most economically advantageous environment in any point in time.

Designing software for an on-premises deployment is very different from one for the cloud. There are considerations in the cloud that are seldom found in traditional deployments. Multi-tenancy is one of those considerations. But it is entirely possible to design a cloud service and shrink-wrap it to a server, like we did.



[Try Auth0 yourself!](https://auth0.com)
