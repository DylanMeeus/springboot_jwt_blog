---
layout: post
title: "JWT: 2 years later..."
description: Json Web Tokens (JWT) gets a logo, new website and more
date: 2015-07-20 13:00
author:
  name: Matias Woloski
  url: "https://twitter.com/woloski"
  mail: "matias@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=200"
design: 
  image: https://cdn.auth0.com/jwt/icon.svg
  image_bg_color: "transparent"
  bg_color: "#111118"
tags: 
- jwt
- openid connect
- logo
---


In 2013, when we started building Auth0, we had to decide which standard we wanted our platform to be built on. Back then there was [WS-Fed](https://en.wikipedia.org/wiki/WS-Federation), and [SAML2](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf). I was very familiar with both, having worked on many projects with Microsoft technologies. My main issue with these standards, was that they were too complex: too many knobs and levers, interop issues, and above all lack of libraries. 

<!--more-->

On the other extreme we had OAuth2, which was rapidly being adopted because of its simplicity. It was also being used by Facebook, Google and many others. There were already libraries written in many languages, making it even more appealing. 

However, [OAuth2](https://tools.ietf.org/html/rfc6749) was/is an __authorization__ protocol, not one specific for __authentication__ [[1](http://www.thread-safe.com/2012/01/problem-with-oauth-for-authentication.html)] [[2](http://homakov.blogspot.com.ar/2012/08/oauth2-one-accesstoken-to-rule-them-all.html)]. 

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) was being drafted as a very thin layer on top of OAuth2 to overcome exactly that issue. With the introduction of [JSON Web Tokens](https://tools.ietf.org/html/rfc7519), there was now a simple way of verifying user identity, and audience (the consumer of these tokens).

Back then it was on [draft-06](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-06), and I decided to join the Working Group.

## Why is JWT so popular? 

![](https://www.dropbox.com/s/dgq7lx9lj20ikdj/Screenshot%202015-07-18%2017.10.39.png?dl=1)

I think there are many reasons why JWT are being widely adopted:

* It embraces JSON which is already heavily adopted across many stacks.
* It is simple to use and simple to implement (hence more libraries, and fewer interop issues).
* It supports symmetric, and asymmetric crypto which solves the majority of use cases.

## Numbers speak for themselves

About 2 years since the first draft, this simple, yet useful standard grew up to:

![](https://files.slack.com/files-pri/T025590N6-F07T772MR/jwt.png)

* [972 GitHub repos](https://github.com/search?q=jwt) related to JWT.
* [2600+ StackOverflow](http://stackoverflow.com/search?q=jwt) threads.
* 400K page views on [jwt.io](http://jwt.io).
* [50K Google](https://www.google.com.ar/search?q="json+web+token") results.

If you use Android, AWS, Microsoft Azure, Salesforce, Google the chances are that you are already using JWT.

We very much believe in this standard so we wanted to keep making contributions to foster its adoption. We are happy to share with you, the JWT logo, the new website and, why not, its own t-shirt :)


## New Logo

The central component of the branding is a logo symbol representing an individual JSON Web Token. The circular icon was designed to suggest a coin while avoiding being mistaken for a digital currency symbol.

Here are some initial sketches and colors:

![](https://cdn.auth0.com/blog/jwt/jwt_02.jpg)
![](https://cdn.auth0.com/blog/jwt/jwt_04.jpg)

We decided to use the starburst shape representing the crypto protection of a JSON Web Token. Multicolored spokes radiate from the centralized hub representing the various claims within a payload. 
Here is the final symbol:

![](https://cdn.auth0.com/blog/jwt/jwt_01.jpg)

JSON Web Token has been abbreviated to the initials JWT and custom lettering was developed.

![](https://cdn.auth0.com/blog/jwt/jwt_03.jpg)
![](https://cdn.auth0.com/blog/jwt/jwt_05.jpg)

## New Site

We redesigned the [jwt.io](http://jwt.io) according to the new branding. The debugger is still the central piece. We added support for RS256 in addition to HS256.

![](https://www.dropbox.com/s/w07y28myru5e1x2/Screenshot%202015-07-18%2015.25.37.png?dl=1)

On the libraries section, we improved the readability by color coding each library and use proper logos for each. In addition to that, we added the number of stars of the GitHub repository.

![](https://www.dropbox.com/s/01wst3l1xlgio0v/Screenshot%202015-07-18%2015.27.54.png?dl=1)

## Badges and Others

If your API supports JSON Web Tokens, feel free to add this badge

![](https://cdn.auth0.com/jwt/badge-support.svg)

If there is some functionallity on your site that uses and exposes JSON Web Tokens, you can use the following button to open the JWT on jwt.io.

![](https://cdn.auth0.com/jwt/badge.svg)

Finally, we also designed some cool JWT t-shirts that you can order from <http://swag.auth0.com>.


## Acknowledgements

Special thanks to [Ty Wilkins](http://tywilkins.com/) for crafting the symbol and lettering, [Ricky Rauch](http://twitter.com/rickyrauch) and [team](http://dribbble.com/auth0) for the awesome looking website, Guillermo Rauch for his constant advice, [Mike Jones](http://self-issued.info) for introducing me into the working group and all of you who [contributed to jwt.io](https://github.com/jsonwebtoken/jsonwebtoken.github.io/graphs/contributors) through GitHub.

**JWT all the things!**
