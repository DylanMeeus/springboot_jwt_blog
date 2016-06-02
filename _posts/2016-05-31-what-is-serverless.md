---
layout: post
title: "What is serverless"
description: "Serverless is a new cloud computing trend that changes the way you think about writing and maintaining applications"
date: 2016-06-10 09:00
permalink: /2016/06/10/what-is-serverless/
author:
  name: Tomasz Janczuk
  url: https://twitter.com/tjanczuk?lang=en
  mail: tomek@auth0.com
  avatar: https://s.gravatar.com/avatar/53f70144dc9d7c76455fa91f858d4cec?s=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/webtasks/webtask_logo.png
  image_size: "120%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- serverless
- backendless
- webtask
- lambda
- functions
- extensibility
- nodejs
- platform
- saas
- paas
- webhook
related:
- 2015-10-07-extensibility-through-code-using-webtasks
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
- 2015-07-28-if-this-then-node-dot-js-extending-ifttt-with-webtask-dot-io
---

Focus software development on application code and improve efficiency of operations or just another fad that will pass? Let's dissect the the new *serverless* trend in computing. 

-----

## Cows, hens, and serverless

Birth of any breakthrough technology has a tendency to spark fierce discourse. It is frequently fueled by misconception about the nature of the invention or fear of the unknown. When the first steam locomotives were introduced in Great Britain in 1824, those opposed claimed they would turn cows' milk sour and prevent hens from laying eggs, apart from other despicable calamities. 

Quite a similar discourse is happening now around the new trend of *serverless* computing. Twitter is abuzz with opinions ridiculing the idea as an assault on the established ways of software delivery. The debate is further escalated by misconceptions around what *serverless* means to the value chain of software delivery, especially operations. 

As is usually the case, cows will continue to give milk and hens will lay eggs. It will just be different milk and different eggs.

## So what is serverless?

Serverless trend changes the abstractions used in software development, with downstream implications on how this software is deployed and maintained. It does not remove the need for any work that is happening today within the lifetime of a software system, but it affects who does this work and improves its efficiency. 

## Focus on code, not servers

In traditional software development, the software engineer had to be acutely aware of the concept of a *server*. Servers are where their software runs. Servers communicate with each other. Servers have IP addresses which need to be discovered. Servers go down which must to be accounted for. Servers have local state that is not visible to other servers. Many facets of software development revolved around the first class concept of a server. 

> The essence of the *serverless* trend is the absence of the server concept *during software development*.

Developers write code that implements business logic. Durable state needs to be externalized, local storage mechanisms are for optimization only. Business logic is addressable, not individual servers. 

## Function as a unit of application logic

Serverless pattern encourages development focus on well defined units of business logic, without premature optimization decisions related to how this logic is deployed or scaled. As a result, development focus is on a single function or module rather than a service with a large surface area. *Serverless* frees the software developer from deployment concerns and allows them to focus on factoring the application following logical encapsulation lines. 

## "Free" maintenance and scalability

A common misconception surrounding *serverless* is that it removes the need for provisioning, maintaining, and scaling application infrastructure. Removing these concerns is in fact one of the value propositions that resonates with software developers writing code. However, at the level of the infrastructure their code runs on, these traditional operational concerns remain as valid as ever. 

In other words, thanks to the crisply defined boundary between application code and underlying infrastructure that *serverless* proposes, provisioning, maintenance, and scalability can be provided as a service to the application layer, creating an illusion it is *free*. 

## What happened to my servers?

Servers are alive and well in the *serverless* world, but their role has changed in an important way. Instead of supporting a specific application, clusters of servers provide a generic execution environment for any number of applications. The exact abstraction that defines the separation between server and application is still being defined and different vendors take a variety of approaches. Often container technologies provide a common starting point for the discussion. 

> One immense benefit of a *serverless* infrastructure is that it improves economy of scale of operations. 

Instead of solving provisioning, maintenance, scalability, monitoring, etc. problems for each of the applications individually, these operational concerns can now be addressed once (albeit at a much larger scale) to benefit multiple applications. *Serverless* is to operations what IaaS was to hardware. 

## A penny a piece

Very granular billing is what distinguishes *serverless* from IaaS. With IaaS we are used to paying for servers' uptime regardless of their utilization level. This typically leads to a lot of waste given that a degree of overprovisioning is often the only sensible answer to capacity planning. 

The lightweight nature of the programming abstraction in *serverless* combined with the economy of scale of the generic runtime enable a much quicker provisioning of the required computing resources (CPU, memory) within the infrastructure that runs the code. Functions are created, executed, and resources are reclaimed. The end user is paying only for the actual time and resources consumed. 

## For me, two server[les]s

How do you get started with *serverless*? There are several vendors that allow you to focus on application development while running the generic infrastructure for you. Amazon AWS Lambda, Google Cloud Functions, and Windows Azure Functions are some of the choices. 

> At Auth0, we have built and have been running [Auth0 Webtasks](https://webtask.io) *serverless* platform.

We have been using webtasks to support [platform extensibility through custom code](https://auth0.com/blog/2015/10/07/extensibility-through-code-using-webtasks/). Webtasks allow us to execute untrusted code with very low latency in a secure way, which is the foundation of a key customization feature we offer our customers. We like to think about webtasks as a much more developer friendly alternative compared to other vendors, and one that offers great flexibility thanks to high fidelity to HTTP. You can use webtasks in a variety of applications, from sandboxing untrusted code, to creating API gateways, lightweight HTML applications, or API backends for mobile apps. 

You can start experimenting with webtasks by creating a free Auth0 account below, or heading directly to [https://webtask.io](https://webtask.io). Enjoy!
