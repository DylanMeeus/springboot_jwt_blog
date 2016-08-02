---
layout: post
title: "What is HTTP/2 All About?"
description: "HTTP/2 is the latest web standard that aims to improve the way we interact with the web. Learn all about HTTP/2 and how it affects you."
date: 2016-08-05 08:30
alias: /2016/08/05/what-is-http2-all-about/
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#00386F"
  image: "https://cdn.auth0.com/blog/partners/logo.png"
tags:
- HTTP
- HTTP2
- HyperTextTransferProtocol
- Web
related:
- 2016-07-01-why-staying-agile-is-key-to-startup-success
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-14-safely-use-best-customer-retention-tactics
---

---

**TL;DR** HTTP/2 is a much needed upgrade to the HTTP protocol, used to manage the communication between web servers and browsers. The new standard paves the way for faster page loads through better data compression, multiplexing of requests, and other improvements. Many servers and browsers have support for HTTP/2 and developer can take advantage of these new capabilities today.

---

The world wide web at large operates over the [Hypertext Transfer Protocol (HTTP)](https://www.w3.org/Protocols/). HTTP was first conceived way back in 1989 and the last major revision was ratified in 1999. The Internet was quite different in those days. The majority of websites were text-based with very few images, scripts, and styles - and video was even rarer. Today, websites are much more interactive with images, animations, styles, custom fonts and much more, but this comes at a price, a single page can easily request [over 100](https://www.sitepoint.com/average-page-weight-increased-another-16-2015/) different resources.

![Amazon 1999 vs 2016](https://cdn.auth0.com/blog/about-http2/amazon-1999-2016.png)

The ever-increasing number of resources requested and the growing size of pages has led to slower page load times which further led to bad user experiences. Users do not like waiting, even a delay of a [few seconds](https://blog.kissmetrics.com/loading-time/) can cause users to leave your website and go to a competitor. The explosion of mobile has not made the job any easier on developers, as devices connected to mobile networks tend to be slower and even more bandwidth constrained.

 Developers have fought back by combining and concatenating multiple files into one, creating sprite sheets for common web elements, delaying requests until absolutely necessary, and many other techniques to reduce the number of requests as well as the bandwidth required to load web pages. Striking a balance between giving the user a great experience and delivering it fast has become an artform. At the end of the day, these optimizations can only go so far and a change to the underlying technology is required.

 {% include tweet_quote.html quote_text="Delivering a great user experience and doing so quickly has become an artform." %}

## Enter HTTP/2

**HTTP/2** aims to address many of the current failings of HTTP/1.1 by evolving the standard to meet the needs of modern applications. HTTP/2 standardization is fairly unique in that its concepts have already been proven to work years before the standard was finalized. [SPDY](https://www.chromium.org/spdy/spdy-whitepaper), a network protocol primarily developed by Google, implemented many of the features and benefits that HTTP/2 would eventually provide. In fact, the first draft of HTTP/2 was heavily influenced by SPDY.

SPDY was implemented in many browser and server technologies, but as HTTP/2 standardization was approaching, Google decided to deprecate the SPDY protocol in favor of HTTP/2. As of Chrome 51, SPDY has been completely removed from the Chrome web browser.

## Benefits of HTTP/2

HTTP/2 was designed for the modern web, but it remains backwards compatible with HTTP/1.1. Backwards compatibility ensures that browsers that support the protocol can leverage the benefits, but those that do not can still operate without affecting the user workflow. Here are some of the benefits HTTP/2 provides:

* **Header Compression** - HTTP Header size will be greatly reduced
* **Multiplexing** - Multiple requests can be served concurrently over a single connection
* **HTTP/2 Server Push** - Resources can be pushed to the client before they are requested
* **Prioritization** - Resources can have dependency levels allowing the server to prioritize which requests to fulfill first
* **Binary** - HTTP/2 is a binary protocol making it a lot more efficient when transferring data

## HTTP/2 In Action

Two companies that are synonymous with web performance are [CloudFlare](https://cloudflare.com) and [Akamai](https://akamai.com). Both of these companies provide CDN and other solutions to improve the performance and reliability of websites and both support HTTP/2. To promote the adoption of HTTP/2, let's look at the demos they provide to showcase some of the benefits.

 The [CloudFlare demo](https://www.cloudflare.com/http2/) shows the difference between downloading a large number of resources from an HTTP/1.1 and an HTTP/2 server. In our tests the HTTP/2 side won every single time by more than 2.5X.

![CloudFlare HTTP/2 Demo](https://cdn.auth0.com/blog/about-http2/cloudflare-demo.png)

 The [Akamai demo](https://http2.akamai.com/demo) is fairly similar as are the results.

 ![Akamai HTTP/2 Demo](https://cdn.auth0.com/blog/about-http2/akamai-demo.png)

 One final demo I'd like to show is provided by the [Golang](https://golang.org/) team at Google. This demo, again downloads a bunch of resources but additionally allows you to set a latency to the request to really show the benefits of HTTP/2. Without any latency, the difference between HTTP/2 and HTTP/1.1 was 569ms vs 3227ms. If we add 200ms of latency, the results look quite different with HTTP/2 loading the page in 839ms compared to 9095ms that it took HTTP/1.1. Check out the demo for yourself [here](https://http2.golang.org/gophertiles).

 ![Gopher HTTP/2 Demo](https://cdn.auth0.com/blog/about-http2/gopher-demo.png)

## Using HTTP/2 In Your Stack

Implementations of the HTTP/2 protocol for many languages, servers and browsers have already been deployed. Browsers like Chrome and Firefox have support for HTTP/2. Microsoft's Edge and Apple's Safari browsers support HTTP/2 but only over secure connections. Chances are your users are capable of utilizing the protocol, and even if not, HTTP/2 is fully backwards compatible so you don't have to worry.

When it comes to your technology stack, whether you are on [IIS](http://blogs.iis.net/davidso/http2), [Apache](https://httpd.apache.org/docs/2.4/mod/mod_http2.html), [nginx](https://www.nginx.com/blog/nginx-1-9-5/), or any of [these technologies](https://github.com/http2/http2-spec/wiki/Implementations), you can effortlessly enable HTTP/2. Since the HTTP/2 protocol is backwards compatible, you will not need to make any changes to your actual code.

{% include tweet_quote.html quote_text="HTTP/2 implementations are available for most tech stacks for use today! What are you waiting for?" %}

## Future of HTTP/2

HTTP/2 was standardized in 2015 and since then many websites have begun using the protocol. The [uptake](http://trends.builtwith.com/docinfo/HTTP2) has not reached the masses at large though. It is too early to speculate when or what the future of HTTP will be, but on the official [HTTP/2 homepage FAQs](https://http2.github.io/faq/#will-there-be-a-http3), when asked about HTTP/3, the answer was that is is possible. For now, let's focus on adopting HTTP/2 across the board!

## HTTP/2 At Auth0

Here at Auth0, we strive to deliver a great user experience. We have already rolled out HTTP/2 support for our CDN and [main website](https://auth0.com). We will be adding HTTP/2 support to more of our systems in the future.

## Conclusion

HTTP/2 is a long and overdue update to the HTTP protocol. The benefits of the new protocol are multiplexing, header compression, binary format, server push, resource prioritization, and backwards compatibility. HTTP/2 is ready for production use today and available across the majority of tech stacks. Since it is backwards compatible, enabling it on your server is fairly easy and if you haven't already, you should enable it today!
