---
layout: post
title: "Get Your Twitter Share Count Back with a Webtask"
description: "Learn how to fix your Twitter share counts with a simple HTTP proxy running as a Webtask"
date: 2015-11-20 10:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/dombench/logo_fist.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- ember
- ember.js
- react.js
- react
- dom
- virtual dom
- incremental dom
- javascript
- glimmer
- benchmark
---

Recently Twitter decided to [shutdown](https://blog.twitter.com/2015/hard-decisions-for-a-sustainable-platform) one of its unofficial API endpoints. In this post we will show you how to get that functionality back with a simple [Webtask](https://webtask.io) acting as a proxy to a different counts provider.

-----

## The problem
Twitter used to provide a *non-public* API endpoint for URL share counts:

```
$ curl http://cdn.api.twitter.com/1/urls/count.json?url=http://my.url.com
{"count":27438,"url":"http:\/\/my.url.com\/"}
```

Although this endpoint was not public (and therefore Twitter never committed to supporting it), it stayed available for a long time and people started using it. Unfortunately this [changed recently](https://blog.twitter.com/2015/hard-decisions-for-a-sustainable-platform). However the need for a Twitter URL share count remained. At Auth0 we use URL share counts in our [blog](https://blog.auth0.com), so we had to find a way to fix this.

> It should be noted that as the endpoint was not really public Twitter really can't be blamed for removing it.

## The alternative
So we set out to find an alternative service providing link counts on Twitter. We found [OpenShareCount](http://opensharecount.com/). The service basically works by performing periodic searches using the official Twitter search API, then counting the results and storing them for quick retrieval. If you are familiar with the Twitter API, then this should trigger an alarm: Twitter searches only go back a few days, so count results are not absolute. OpenShareCount resolves this by running the search periodically and adding up newer results. Good enough.

After signing up and setting up your domain for counts, a simple call to OpenShareCount's API will do the thing:

```
$ curl http://opensharecount.com/count.json?url=http://my.url.com
{"count":27438,"url":"http:\/\/my.url.com\/"}
```

> It should be noted that OpenShareCount does not support JSONP (using the callback parameter) as the old Twitter API did, so further changes to your site might be needed.

Looking good. However
