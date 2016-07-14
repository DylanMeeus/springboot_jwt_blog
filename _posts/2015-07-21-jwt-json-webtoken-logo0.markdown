---
layout: post
title: "JWT: 2 years later"
description: Json Web Tokens (JWT) gets a logo, new website and more
date: 2015-07-21 13:00
author:
  name: Matias Woloski
  url: "https://twitter.com/woloski"
  mail: "matias@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=200"
design:
  image: //cdn.auth0.com/blog/jwt/logo-400.png
  image_bg_color: "#000"
  bg_color: "#000"
  image_size: "170%"
  image_fb: http://jwt.io/img/facebook-card.png
  image_tw: http://jwt.io/img/twitter-card.png
tags:
- jwt
- openid-connect
- logo
related:
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
- 2014-02-26-openid-connect-final-spec-10
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
---

In 2013 when we started building Auth0 we had to decide which standard we wanted our platform to be built on. Back then there was [WS-Fed](https://en.wikipedia.org/wiki/WS-Federation) and [SAML2](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf). I was very familiar with both, having worked on many projects with Microsoft technologies. My main issue with these standards was that they were too complex: too many knobs and levers, interop issues and above all, a lack of libraries.

<!--more-->

On the other extreme we had OAuth2 which was rapidly being adopted because of its simplicity. It was also being used by Facebook, Google and many others. There were already libraries written in many languages, making it even more appealing.

However, [OAuth2](https://tools.ietf.org/html/rfc6749) was/is an __authorization__ protocol, not one specific for __authentication__ [[1](http://www.thread-safe.com/2012/01/problem-with-oauth-for-authentication.html)] [[2](http://homakov.blogspot.com.ar/2012/08/oauth2-one-accesstoken-to-rule-them-all.html)].

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) was being drafted as a very thin layer on top of OAuth2 to overcome exactly that issue. With the introduction of [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) there was now a simple way of verifying user identity and audience (the consumer of these tokens).

Back then it was on [draft-06](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-06), and I decided to join the Working Group.

## Why is JWT so popular?

![](https://cdn.auth0.com/blog/jwtc/jwt-google-trend.png)

I think there are many reasons why JWT is being widely adopted:

* It embraces JSON which is already heavily adopted across many stacks.
* It is simple to use and simple to implement (hence more libraries and fewer interop issues).
* It supports symmetric and asymmetric crypto which solves the majority of use cases.

## Numbers speak for themselves

About 2 years since the first draft this simple, yet useful standard expanded:

![](https://cdn.auth0.com/blog/jwtc/banner-jwt.png)

* [972 GitHub repos](https://github.com/search?q=jwt) related to JWT.
* [2600+ StackOverflow](http://stackoverflow.com/search?q=jwt) threads.
* 400K page views on [jwt.io](http://jwt.io).
* [50K Google](https://www.google.com.ar/search?q="json+web+token") results.

If you use Android, AWS, Microsoft Azure, Salesforce, or Google then chances are that you are already using JWT.

{% include tweet_quote.html quote_text="If you use AWS, Microsoft Azure, Salesforce, or Google then chances are that you are already using JWT." %}

We very much believe in this standard so we wanted to keep making contributions to foster its adoption. We are happy to share the **new logo**, the **new website**, **badges**, and other things. :)


## New Logo

The central component of the branding is a logo symbol representing an individual JSON Web Token. The circular icon was designed to suggest a coin while avoiding being mistaken for a digital currency symbol.

Here are some initial sketches and colors:

![](https://cdn.auth0.com/blog/jwtc/jwt_02.jpg)
![](https://cdn.auth0.com/blog/jwtc/jwt_04.jpg)

We decided to use the starburst shape representing the crypto protection of a JSON Web Token. Multicolored spokes radiate from the centralized hub representing the various claims within a payload.
Here is the final symbol:

![](https://cdn.auth0.com/blog/jwtc/jwt_01.jpg)

JSON Web Token has been abbreviated to the initials JWT and custom lettering was developed.

![](https://cdn.auth0.com/blog/jwtc/jwt_03.jpg)
![](https://cdn.auth0.com/blog/jwtc/jwt_05.jpg)

## New Site

We redesigned [jwt.io](http://jwt.io), incorporating the new branding. The debugger is still the central piece. We added support for RS256 in addition to HS256.

<img src="https://cdn.auth0.com/blog/jwt/jwt-1.png" class="expand">

In the libraries section, we improved the readability by color coding each library and using the proper logos for each. In addition to that, we added the number of stars from the GitHub repository.

<img src="https://cdn.auth0.com/blog/jwt/jwt-2.png" class="expand">

## Badges and Others

If your API supports JSON Web Tokens, feel free to add this badge

![](https://cdn.auth0.com/badges/jwt-compatible.svg)

If there is some functionality on your site that uses and exposes JSON Web Tokens, you can use the following button to open the JWT on jwt.io.

[![](https://cdn.auth0.com/badges/jwt-view.svg)](http://jwt.io/#id_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ)

The token is sent through the hash like this: `http://jwt.io/#id_token=eyJhbGciOi....`

Finally, we designed some cool JWT t-shirts that you can order from [swag.auth0.com](http://swag.auth0.com).


## Acknowledgements

Special thanks to [Ty Wilkins](http://tywilkins.com/) for crafting the logo and lettering, [Ricky Rauch](http://twitter.com/rickyrauch) and [team](http://dribbble.com/auth0) for the awesome looking website, [Alberto Pose](http://twitter.com/thepose) who created the initial jwt.io version and curates the community contributions, [Guillermo Rauch](http://twitter.com/rauchg) for his constant advice, [Mike Jones](http://self-issued.info) for introducing me into the working group and all of you who [contributed to jwt.io](https://github.com/jsonwebtoken/jsonwebtoken.github.io/graphs/contributors) through GitHub.

**JWT all the things!**
