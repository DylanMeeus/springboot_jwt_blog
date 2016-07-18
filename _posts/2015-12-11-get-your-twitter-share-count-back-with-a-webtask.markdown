---
layout: post
title: "Get Your Twitter Share Count Back with a Webtask"
description: "Learn how to fix your Twitter share count with a simple HTTP proxy without a server using Webtasks"
date: 2015-12-11 13:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/twittercounts/logo.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- twitter
- share-count
- url-count
- url-share-count
- webtask
- proxy
- http-proxy
- https-proxy
- http-https-proxy
related:
- 2105-10-27-extensibility-through-code-using-webtasks
- 2015-07-28-if-this-then-node-dot-js-extending-ifttt-with-webtask-dot-io
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

Recently Twitter decided to [shutdown](https://blog.twitter.com/2015/hard-decisions-for-a-sustainable-platform) one of its unofficial API endpoints: the URL share count. In this post we will show you how to get that functionality back with a simple [Webtask](https://webtask.io) acting as a proxy to a different counts provider.

-----

## The problem
Twitter used to provide a *non-public* API endpoint for URL share counts:

```
$ curl http://cdn.api.twitter.com/1/urls/count.json?url=http://my.url.com
{"count":27438,"url":"http:\/\/my.url.com\/"}
```

![Twitter share count](https://cdn.auth0.com/blog/twittercounts/twittercount.png)

Although this endpoint was not public (and therefore Twitter never committed to supporting it), it stayed available for a long time and people started using it. Unfortunately this [changed recently](https://blog.twitter.com/2015/hard-decisions-for-a-sustainable-platform). However the need for a Twitter URL share count remained. At Auth0 we use URL share counts in our [blog](https://blog.auth0.com), so we had to find a way to fix this.

> It should be noted that as the endpoint was not public Twitter really can't be blamed for removing it.

## The alternative
So we set out to find an alternative service providing link counts on Twitter. We found [OpenShareCount](http://opensharecount.com/). The service basically works by performing periodic searches using the official Twitter search API, then counting the results and storing them for quick retrieval. If you are familiar with the Twitter API, then this should trigger an alarm: Twitter searches only go back a few days, so count results are not absolute. OpenShareCount resolves this by running the search periodically and adding up newer results. Good enough.

After signing up and setting up your domain for counts, a simple call to OpenShareCount's API will do the thing:

```
$ curl http://opensharecount.com/count.json?url=http://my.url.com
{"count":27438,"url":"http:\/\/my.url.com\/"}
```

> It should be noted that OpenShareCount does not support JSONP (using the callback parameter) as the old Twitter API did, so further changes to your site might be needed.

Looking good. However we still have one problem to solve: cross site requests.

## Another problem: the same origin policy
Our blog is hosted at [https://blog.auth0.com](https://blog.auth0.com) and OpenShareCount provides the API endpoint at `http://opensharecount.com/count.json?url=http://my.url.com`. There are two things we need to take into account:

1. The `Access-Control-Allow-Origin` header.
2. The use of the same communications protocol (HTTP or HTTPS).

By running a simple cURL test to the URL we see the `Access-Control-Allow-Origin` header is correctly set:

```
curl -v http://opensharecount.com/count.json\?url\=http://my.url.com
*   Trying 104.27.164.180...
* Connected to opensharecount.com (104.27.164.180) port 80 (#0)
> GET /count.json?url=http://my.url.com HTTP/1.1
> Host: opensharecount.com
> User-Agent: curl/7.45.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Thu, 10 Dec 2015 17:07:23 GMT
< Content-Type: text/html; charset=ISO-8859-1
< Transfer-Encoding: chunked
< Connection: keep-alive
< Set-Cookie: __cfduid=d953733a4896a8010a92b07f02928451f1449767243; expires=Fri, 09-Dec-16 17:07:23 GMT; path=/; domain=.opensharecount.com; HttpOnly
< Vary: Accept-Encoding
< Access-Control-Allow-Origin: *
< CF-Cache-Status: MISS
< Expires: Thu, 10 Dec 2015 17:37:23 GMT
< Cache-Control: public, max-age=1800
< Server: cloudflare-nginx
< CF-RAY: 252a8bb960980320-MIA
<
* Connection #0 to host opensharecount.com left intact
{"url":"http://my.url.com","error":"Domain my.url.com not authorised, register for free at http://opensharecount.com first","count":0}
```

So the `Access-Control-Allow-Origin` header is not a problem. However the difference between HTTPS and HTTP *is*. Browsers forbid AJAX requests to non-TLS resources from a TLS-secured page.

### A Webtasks Proxy
The obvious solution to the problem above is a *proxy*. This proxy will simply provide a HTTPS frontend for the HTTP OpenShareCount API. This is a simple matter, but forces us to think about hosting, load-balancing and other stuff related to setting up a new service. As we face these problems daily, at Auth0 we developed [webtasks](https://webtask.io), which fit this problem domain perfectly.

Here's our simple HTTP to HTTPS proxy:

```
var url = require('url');
var request = require('request');

module.exports = function (ctx, cb) {
  var whitelist = ['metrics.it.auth0.com', 'opensharecount.com'];

  var targetUrl = ctx.data.url;
  var target = url.parse(targetUrl).hostname;
  var ok = whitelist.some(function (host) {
    return target === host;
  });

  if (!ok) {
    return cb(new Error('no way'));
  }

  request.get({url: targetUrl}, function(err, resp, body) {
     if (err) return cb(err);
     cb(null, JSON.parse(body));
  });
};
```

And this is our endpoint with parameters: `https://webtask.it.auth0.com/api/run/auth0/proxy?webtask_no_cache=1&url=http://opensharecount.com/count.json?url=LINK_COUNT_URL`

The proxy has a simple embedded whitelist to prevent misuse by third-parties. After running the whitelist filter, it performs an HTTP request and sends back the result to the original caller.

> Please note that browser restrictions with regards to access to unprotected resources from a TLS secured page are in place for a reason. Study carefully if the unprotected resource can be handled this way before doing something like this.

## Get Your Twitter Share Counts Back: Create Your Own Webtask!
If you are interested in learning more about webtasks or creating your own, head over to [https://webtask.io](https://webtask.io) and get started. With the webtasks command line interface, creating your first script is a matter of running a few commands:

{% include tweet_quote.html quote_text="With the webtasks command line interface, creating your first script is a matter of running a few commands." %}

```
npm install wt-cli -g
wt init your@email.com
echo "module.exports = function (cb) {cb(null, 'Hello');}" > hello.js
wt create hello.js
```

You can then run the webtask:

```
curl https://webtask.it.auth0.com/api/run/wt-sebastian_peyrott-auth0_com-0/hello?webtask_no_cache=1
```

Replace your webtask URL by the one returned by `wt create`.

## Conclusion
The decision to remove the link counts API by Twitter was unfortunate but perfectly understandable. It was never meant for public use. Fortunately OpenShareCount and Webtasks make a perfect fit for solving this issue as soon as possible and in a convenient manner. If you decide to use or extend our simple proxy sample, let us know in the comments. Good luck!
