---
layout: post
title: "Our Response to Heartbleed"
date: 2014-04-08 15:00
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Many of you have contacted us with concerns on the CVE-2014-0160 vulnerability in OpenSSL, which is better known as the “Heartbleed bug”. This was disclosed"
related:
- 2014-05-03-covert-redirect-oauth-vulnerability
- 2014-12-11-auth0-achieves-soc-2-certification
- 2016-03-17-data-breach-response-planning-for-startups
---

Many of you have contacted us with concerns on the [CVE-2014-0160 vulnerability in OpenSSL](https://www.openssl.org/news/secadv_20140407.txt), which is better known as the “Heartbleed bug”. This was disclosed on April, Monday 7th. This is a very serious vulnerability that affects a very large number of websites on the internet.

<!-- more -->

As soon as we were notified of this issue we took measures to fix any potential problems. By Tuesday 8th morning PT, any of the systems we run that required patching were fixed. We also took additional measures (e.g. requested re-issuing certificates, updated keys, etc.) to ensure all systems are protected.

![](http://puu.sh/81qsu.png)

You can access the test here: http://filippo.io/Heartbleed/#www.auth0.com

We'd encourage you to do the same if you are running OpenSSL in any of your apps. As a precautionary measure, we'd also recommend updating your client credentials and keys now (e.g. client secrets). As a good measure for safe security practices, any type of credentials should be rolled over frequently.

Please don't hesitate to contact us if you have any questions!

The Auth0 Team
