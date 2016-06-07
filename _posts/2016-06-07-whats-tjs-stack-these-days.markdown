---
layout: post
title: "What's TJ's Stack These Days?"
description: "TJ Holowaychuck has been hard at work on a new project called Apex. We caught up with him to get all the details!"
date: 2016-06-07 8:30
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  bg_color: "#2d5487"
  image: https://cdn.auth0.com/blog/apex-ping/apex-ping-icon.png
tags: 
- go
- serverless
- react
- authentication
- authorization
- tj
related:
- 2016-04-13-authentication-in-golang
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2015-10-07-extensibility-through-code-using-webtasks
---

---

<span <span style="font-weight:700">TL;DR:</span> TJ Holowaychuck's tech stack for his new startup includes AWS Lambda, Go, React, and Auth0. We interviewed him to get the full details on his first product, Apex Ping, and what his motivations were for choosing the stack he did.

---

You might be familiar with [TJ Holowaychuck](https://twitter.com/tjholowaychuk) from one of his [550 modules](https://www.npmjs.com/~tjholowaychuk) on npm, including [express](http://expressjs.com/). TJ is well known for his NodeJS work, but he's recently made the switch to Go and has been working on his own self-funded startup called [Apex](https://apex.sh). We wanted to catch up with him about his new project and learn more about the tech stack he's chosen for his first product called [Ping](https://apex.sh/ping/).

![apex ping dashboard](https://cdn.auth0.com/blog/apex-ping/apex-ping.png)

### Background

<span style="font-weight:700">Auth0:</span> Can you tell us a bit about yourself?

<span <span style="font-weight:700">TJ:</span> I'm a backend and frontend engineer from Canada. I was previously part of the backend team helping scale segment.com to billions of events per day. I recently started my own software company, Apex, as a solo self-funded venture, with Apex Ping being my first 'micro' product.

<span <span style="font-weight:700">Auth0:</span> Can you tell us more about Apex Ping? What is it and what does it do?

<span <span style="font-weight:700">TJ:</span> [Apex Ping]((https://apex.sh/ping/) is an uptime and performance monitoring tool with rich reporting and alerting capabilities. Anyone maintaining a website, app, or API can create “checks”, HTTP requests performed against an HTTP end-point every minute from a number of selectable locations all over the globe. 

Alerts and weekly reporting keep the team informed so your customers are always provided with the best experience possible. 

### The Tech Stack

<span <span style="font-weight:700">Auth0:</span> What stack are you using for Apex Ping?

<span <span style="font-weight:700">TJ:</span> With the exception of the app server and marketing site, the entire product is “serverless”, running on AWS Lambda. All backend infrastructure & API code is written in Go.

Checks and alerting are batched and parallelized, with SNS sitting between each segment of the pipeline for fan-out capabilities, which is useful for things like S3 archiving. I’m also using AWS Firehose quite a bit. The tool used to manage and deploy functions is [apex](https://github.com/apex/apex).

My primary database of choice is Postgres (RDS) and “check” results are stored in Elasticsearch (hosted by AWS). I also use Elasticsearch & Kibana for internal logging, with some custom code for alerting which also runs in Lambda.

On the front-end the notable packages I’m using are React, D3, browserify, postcss and babel.

<span <span style="font-weight:700">Auth0:</span> What are some of the reasons you decided on this stack?

<span <span style="font-weight:700">TJ:</span> The biggest motivators for me are scalability, performance, and low maintenance. The AWS Lambda pricing is currently a bit steep for I/O intensive use-cases like this, but the scalability, workflow, and maintenance aspects have been fantastic. I’ve stress tested the platform with the equivalent of 5,000 users with no issues and no additional work on my part.

I use Lambda internally for many small programs as well, which “garbage collect” Elasticsearch indexes, alert against my logging cluster, perform stats rollup to Postgres among other things.

I went with Elasticsearch for its flexibility and query performance. I believe there’s some improvements that could be made for the time-series use-case especially regarding compression, but it has been doing well so far. The JSON query language can be a bit daunting, but it’s very flexible, and Elasticsearch has some great options grading scaling, via routing keys and so on.

On the front-end I chose React, I was attracted to the functional aspect and modularity it provided. The learning curve was very low barring some old habits, otherwise it has been a great tool to work with!

### Authentication and Authorization

<span <span style="font-weight:700">Auth0:</span> What were some of the considerations you needed to make regarding authentication and authorization?

<span <span style="font-weight:700">TJ:</span> My primary concern is user experience. I wanted to utilize OAuth front and center to eliminate the signup process for the user. It was also important to me to have a custom look, to fit with the minimalistic design of Apex Ping.

I also really wanted to utilize [JSON Web Tokens (JWT)](https://jwt.io/introduction) for stateless authentication & authorization, cutting down on the amount of infrastructure required.

<span <span style="font-weight:700">Auth0:</span> How did Auth0 help with this?

<span <span style="font-weight:700">TJ:</span> Auth0’s [documentation](https://auth0.com/docs) is fantastic, it was easy to find an example for [React & Go](https://auth0.com/docs/quickstart/spa/react/golang) in order to get started right away. The provided open-source [Go JWT middleware](https://github.com/auth0/go-jwt-middleware) worked as-advertised. 

Going with <a href="javascript:signup()">Auth0</a> meant I didn’t have to spend days fiddling with half-baked solutions, which is especially frustrating with new specifications such as OpenID Connect. With Auth0 I was able to just focus on building my application, instead of re-inventing auth.

<span <span style="font-weight:700">Auth0:</span> You recently published a package called [auth0-lite](https://www.npmjs.com/package/auth0-lite) to npm. Can you tell us about that?

<span <span style="font-weight:700">TJ:</span> The JavaScript client libraries provided by Auth0 through their CDN offer some powerful capabilities, however with my use-case being quite simple, and having a custom look, I decided to slim things down. My auth0-lite npm package is a fraction of the size with just the bare-minimum requirements for my use-case. I brought up the idea of light-weight bundle(s) with the Auth0 team and they were great and receptive to the idea!

### Wrapping Up

<span <span style="font-weight:700">Auth0:</span> Thanks for taking the time to chat with us about your new project, we wish you all the best with it! Is there anything else readers can check out?

<span <span style="font-weight:700">TJ:</span> Have a look at [Ping's features](https://apex.sh/ping/#features) and check out the [free plan](https://apex.sh/ping/#pricing) if you're interested. Keep an eye out for more [Apex](https://apex.sh/) projects to come!