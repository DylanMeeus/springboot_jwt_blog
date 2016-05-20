---
layout: post
title: "Visualize and Search Your Auth0 Logs Using Sumo Logic"
description: <A SHORT DESCRIPTION OF THE POST>
date: 2016-05-19 17:57
author:
  name: Eugene Kogan
  url: https://twitter.com/eugk
  mail: eugene.kogan@auth0.com
  avatar: https://s.gravatar.com/avatar/667b1c82b6cc2241ff176d50c65da603?s=200
design:
  bg_color: #16214D
  image: https://cdn.auth0.com/blog/sumo-logic/sumo-logic-logo.jpg
tags:
- visualization
- extensions
- security
- sumo-logic
- logging
- logs
---

If you're a user of both Auth0 and Sumo Logic, you can use this awesome [Auth0 extension](https://github.com/auth0/auth0-logs-to-sumologic) to send your tenant logs to Sumo Logic. Having all your logs centrally located makes them more valuable and easier to correlate when dealing with something like a security incident or a performance issue.

It's super easy to install the "Auth0 Logs to Sumo Logic" extension right from your account [Dashboard](https://manage.auth0.com/#/extensions). Simply login, click on Extensions, then find and click on the Sumo Logic icon to configure and enable the extension.

![Sumo Logic extension icon](https://cdn.auth0.com/blog/sumo-logic/sl-ext-icon.png)

Once enabled, the extension configuration screen will be displayed. You'll need to decide on a few simple settings, but the defaults are all reasonable. One piece of information you will need to supply is the URL of your Sumo Logic HTTP collector endpoint. If you don't already have one, follow the [Sumo Logic instructions](https://help.sumologic.com/Send_Data/Sources/HTTP_Source) for creating an HTTP source and paste the URL it generates into the Auth0 extension configuration settings. We recommend naming the source category `auth0_logs`.

![Sumo Logic extension configuration screen](https://cdn.auth0.com/blog/sumo-logic/sl-ext-config.png)

We at Auth0 have been using this extension ourselves since it was first released, and it's proven to be very useful for staying on top of what's happening with our internal Auth0 account and our users (e.g., employees, contractors). Sumo Logic makes it easy to see the latest failed logins, find and alert on error messages, create charts to visualize trends, or even do complex statistical analysis on your data.

To help us (and our customers) visualize these logs, we spent some time creating a dashboard. The Sumo Logic for Auth0 dashboard shows you the output of several saved searches all on one easy to read screen, and makes it easy to zoom in or drill down when something looks interesting.

<a target="_blank" href="https://cdn.auth0.com/blog/sumo-logic/sl-db-screenshot.jpg">![Sumo Logic dashboard for Auth0 logs_](https://cdn.auth0.com/blog/sumo-logic/sl-db-screenshot.jpg)</a>

If you're a Sumo Logic customer and are interested in trying out this dashboard, just let us know via [Support Center](https://support.auth0.com) (be sure to include your Sumo Logic account name) and we will gladly share it with you. Once it's available through your account, you're free to customize it, add to it, create alerts based on the searches, or really anything else that you find useful! We'd love to hear what you think, especially if you've got a great idea that we should incorporate back into our original version. Our goal is to eventually publish this dashboard via a real Sumo Logic app, so that it's automatically available to all users.

Have fun analyzing and visualizing those logs!
