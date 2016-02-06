---
layout: post
title: "Migrating Your Parse Users to Auth0"
description: "Parse is shutting down on January 28, 2017. Learn how to easily migrate your users to Auth0 and diversify risks."
date: 2016-02-05 20:35
author: 
  name: Ado Kukic
  url: https://twitter.com/kukicadnan
  mail: kukicadnan@gmail.com
  avatar: https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200
design: 
  bg_color: "#333333"
  image: "http://i.imgur.com/bGCV82v.png"
  image_size: "100%"
tags: 
- Parse
- Migration
- MBaSS
- Tutorial
---

Facebook shocked the developer community when it announced it would be [shutting down](http://blog.parse.com/announcements/moving-on/) Parse, a [MBaaS](https://en.wikipedia.org/wiki/Mobile_backend_as_a_service), which powers over 500,000 apps. Applications relying on Parse have until January 28, 2017 to find a new home. The Parse team has released two tools to help developers migrate away, [Parse Server](https://github.com/ParsePlatform/parse-server/wiki) and the [Database Migration Tool](https://parse.com/docs/server/guide#migrating).
  
Today's tutorial will focus on migrating users from an existing Parse application to Auth0.