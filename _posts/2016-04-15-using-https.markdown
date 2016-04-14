---
layout: post
title: "Using HTTPS to Secure Your Websites"
description: "Learn how HTTPS is fundamental to online security and how to add it to your websites"
date: 2016-04-05 12:30
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#004785"
  image: https://cdn.auth0.com/blog/jhipster/logo.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- http
- https
- tls
- ssl
- digital certificate
- transport layer security
- secure sockets layer
---

More and more sites are switching to HTTPS. And with good reason! Security is essential in today's complex web ecosystem: logins, online payment systems, and personal user information are all waiting to be poached by criminals. In this short article we will go over what HTTPS is, how it is implemented, what it is useful for (and for what it is not) and how you can enable it in your own sites. Read on!

{% include tweet_quote.html quote_text="Security is essential in today's web ecosystem: logins, online payments and personal user info are all waiting to be poached" %}

-----

## Introduction: the Importance of Online Encryption
Have you ever watched an old spy film and felt shocked at how easy it was to learn a VIP's itinerary by wiretapping a landline? Now take that to a global level with Internet. Scared yet? Although the example may seem simplistic, in a very real sense it is not: it is totally possible to *wiretap* an Ethernet, WiFi or cellular communication. And, as was in the case of old landlines, this is even possible with consumer grade equipment. Spies do not need "spy stuff" to do their job.

As the web was conceived, security was not the most important concern. People cared about sharing. Other matters took second place as the web was developed.

> (...) physicists from around the world needed to share data, yet they lacked common machines and any shared presentation software. - [**History of the World Wide Web, Wikipedia**](https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web)

But things are not how they used to be. What started as a simple login screen to access protected content has now turned into financial operations, personal information and even a matter of national security.

So how does HTTPS enter the picture? It is important to understand what HTTP does and what it does not. HTTP was conceived as a means to transfer formatted information on the Internet. Protecting such information is not its job. The HTTP authentication spec ([RFC 7235](https://tools.ietf.org/html/rfc7235)) hints at [this](https://tools.ietf.org/html/rfc7235#section-6.1):

> The HTTP authentication framework does not define a single mechanism for maintaining the confidentiality of credentials (...) - **RFC 7235**

Authentication is one of those tasks that requires strict security considerations. Even though the HTTP authentication spec defines a series of mechanisms to identify users and parties (via credentials), it does not specify how to securely share that information.

### Personal Information and Online Tracking
If unencrypted HTTP connections expose data as wiretapped landlines do, it is of no surprise that such data can be used to build profiles of the users who use and create that data. This is known as *online tracking*. Have you ever looked at flight prices for a potential future trip only to find, a few minutes later, ads in other pages talk about flights to that destination? This might seem convenient. After all, this could actually point you in the direction of a discount. However this should also make you wonder: what other data am I unknowingly giving others?

Ad companies have built whole enterprises from harvesting and then selling this information. The unencrypted web has expanded a market that used to operate in the shadows: buying and selling personal information.

Encrypting communications does not specifically fix this in any way. After all, even if data is encrypted between a third party and yourself, what's there to stop that third party from using the information you are sharing with them? This is actually Facebook's and Google's biggest business. And they do use HTTPS. However, encrypting data helps in a critical way: it gives the power back to the user. It should be him or her who chooses with whom to share data. This is the basis of encrypted communications: establishing a notion of identity between two parties and then allowing those parties to securely share information between them. This is, in a way, what HTTPS adds to HTTP.

> HTTPS helps greatly in reducing the information leaked to third parties. However, it does not prevent tracking. Modern browser fingerprinting techniques work even behind HTTPS. Security researchers have developed a browser extension called [HTTPS Everywhere](https://www.eff.org/https-everywhere) that attempts to use HTTPS whenever possible and at the same time mitigate the use of fingerprinting techniques. The recently released [Brave browser](https://www.brave.com/), a fork of Chromium, is designed with privacy as one of its top concerns.

EFF's [Panopticlick](https://panopticlick.eff.org/) tool can give you a sense of how modern fingerprinting techniques can track you. This is in spite of the use of HTTPS.

### HTTPS and Logins
Encrypted communications are essential to logins. If a third-party can sniff your credentials, then they can pose as you. You might be thinking this is a rather unusual occurrence. After all, someone needs to *tap* into your Internet connection to do this. And, if you are still picturing a *spy* doing this by physically cutting a few wires, you are wrong. Unlike telephone lines, the Internet is not built in a star shaped topology. All data must go through a series of third-party servers to reach its destination. Any *man-in-the-middle* could then easily capture your credentials if data weren't encrypted. Unsurprisingly, this is known as a [man in the middle (MitM) attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack), and HTTPS actually makes it very hard to accomplish (though not impossible).

Want to take a look at how your data travels through the net? Run this from the terminal:

```sh
# On Linux or OS X
$ traceroute www.google.com

# On Windows
$ tracert www.google.com
```

Pick different destinations. You will note that more hops are usually needed to reach servers farther away. Any of these servers could sniff on unencrypted data sent through them. In fact, shadow hops may be present and not shown in the results. The only real way of being sure is by establishing a notion of identity between communicating parties and then encrypting the data sent between them.

#### Post-login data and API calls
If you are familiar with web systems architecture, you know once a user is authenticated (identity is established), any future transfers may need to be encrypted as well. If HTTPS is needed to make sure credentials are not leaked, it should be of no surprise that any other data transferred through the same medium may need to be encrypted as well. Ultimately it is up to you, the developer, to choose what data must never be exposed. One thing is sure: 99% percent of the time, the less data is available in the clear, the better. Using HTTPS for all transfers is a correct and viable solution. This includes API calls between a client and your service gateway.

> Proper security in the modern web is not limited to just encrypting communications. Once data has reached its destination, proper steps must be taken to safely handle it. A sadly common example is how many web sites store passwords: how many times have you read of a major player being hacked and plain-text passwords being exposed? Surely more than one would hope. (Note: passwords must never be stored as plain-text, for this very same reason). Security and encryption are hard. Proper and tried practices are available for each level in a secure architecture. Be sure to follow them, and, as a general rule, do not role your own, internally developed encryption; use an existing, tried and tested solution.

## The Magic Behind HTTPS: Public-Key Cryptography and TLS/SSL
[HTTP]() is simple: a header with a only a few mandatory fields and (usually, but not required) a body of content. Communications using HTTP as basis rely on an underlying protocol handling lower level details. In the case of the World Wide Web, this other protocol is [TCP/IP](https://en.wikipedia.org/wiki/Internet_protocol_suite). Although the WWW's architecture can be rather complex to sum up, what you need to keep in mind is that TCP/IP handles routing data between different hosts
