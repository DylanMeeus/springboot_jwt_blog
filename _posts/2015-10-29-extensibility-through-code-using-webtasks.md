---
layout: post
title: "Platform extensibility with custom code using webtasks"
description: "Enable extensibility of your SaaS platform through custom code using webtasks. Developers will love you, and so will your CFO."
date: 2015-10-29 09:00
alias: /2015/10/07/extensibility-through-code-using-webtasks/
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
- product
- webtask
- http
- extend
- customize
- extensibility
- nodejs
- custom-code
- platform
- saas
- paas
- webhook
related:
- 2016-04-20-everything-you-wanted-to-know-about-oauth-2-but-were-too-afraid-to-ask
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
- 2015-07-28-if-this-then-node-dot-js-extending-ifttt-with-webtask-dot-io
---

Create competitive advantage and increase stickiness of your SaaS platform by enabling extensibility with custom code using [webtasks](https://webtask.io). This post is about how we have done it at Auth0.

-----

## Developers love code and extensibility

Customization is what distinguishes platforms from applications. The most powerful form of customization is extensibility through custom code. No amount of toggles, switches, or radio buttons is going to support the level of customization that is possible when you allow your users to write code. Services like IFTTT or Zapier focus on declarative customization. In contrast to composing and configuring a finite set of triggers and actions, customization through code offers limitless posibilities.

![Extending Auth0 with custom code using webtasks](https://cdn.auth0.com/blog/webtasks/auth0-rule-editor.png)

When we set off to create the Auth0 identity management platform, we had a singular goal: create a product developers will love. We've learned that nothing makes developers happier than writing code. [Auth0 rules](https://auth0.com/docs/rules) enable developers to extend the processing within the Auth0 authorization pipeline by writing custom Node.js code. Developers write Auth0 rules to support a wide range of scenarios, from running custom business logic to enforce authorization, to integration with external systems, sending notifications, logging, and more. Extensibility through custom code affords developers far more flexibility than any set of declarative controls ever could.  

{% include tweet_quote.html quote_text="We've learned that nothing makes developers happier than writing code." %}

## CFOs love revenue and customer retention

Successful subscription business requires many ingredients to deliver great performance. Standout features of the product generate new signups. Uniqueness of the capabilities creates stickiness and increases customer retention.

> Over 80% of Auth0 revenue comes from customers who extended our platform with custom code using webtasks. These customers have 10x lower churn than the already low Auth0 average.

Supporting Auth0 extensibility with custom code using webtasks enabled us to create a powerful capability that draws developers to our platform. Such flexibility is also hard to find elsewhere. As a result Auth0 customers using custom code are not only happy, but also loyal.

## How we did it: webtasks

We use [webtasks](https://webtask.io) to execute custom code developers wrote to extend Auth0 pipeline. We have specifically designed webtasks to support such extensibility scenario. Webtasks allow safe and low latency execution of custom, untrusted Node.js code in a multi-tenant environment. As such webtasks are uniquely suited to enable customization of SaaS platforms using Node.js code.

![Platform extensibility through custom code with webtasks](https://cdn.auth0.com/blog/webtasks/webtask-extensibility-1.png)  

Webtasks offer a simple execution model: you can provision *and* execute custom Node.js code in an isolated environment with a single, low-latency HTTP call (request contains code, response contains result). The code runs in an environment with over 600 Node.js modules already installed, which enables the vast majority of scenarios developers care about. Webtasks support high fidelity with HTTP protocol. Developers have full control over the HTTP response, including the type of payload and reponse headers. Webtask code can return JSON data, HTML, or any other type of content, which makes it suitable to a broad range of scenarios. You can read more about how webtasks work in the [Extensibility through HTTP with webtasks](http://tomasz.janczuk.org/2015/07/extensibility-through-http-with-webtasks.html) post.

## Platform extensibility: you can do it too

After successfully using webtasks as a key part of Auth0 infrastructure for over a year, we have decided to offer it as a standalone service for anyone with extensibility needs similar to ours.

Auth0 is now offering dedicated, managed deployments of the webtask technology. If you would like to discuss using webtasks to enable your customers to extend your SaaS platform or an application with custom code, we would like to hear from you. Please contact us at [open a support ticket](https://support.auth0.com).
