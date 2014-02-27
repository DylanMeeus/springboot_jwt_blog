---
published: "true"
layout: post
title: OpenID Connect specs are final!
date: "2014-02-26 12:30"
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---

{% excerpt %}

<img src="http://openid.bitbucket.org/openid_connect.png" style="width: 225px; margin-left: 30px; display: block;float:right">

[OpenID Connect](http://openid.net/connect/) final specs 1.0 were [published today](techcrunch.com/2014/02/26/openid-foundation-launches-openid-connect-identity-protocol-with-support-from-google-microsoft-others/)! This is a milestone for the identity community and we are happy to have been part of its development.

When we started writing the core functionality of [Auth0](https://auth0.com), we had to decide which authentication protocols we were going to support. Back then, there were **WS-Federation**, **SAML**, and **OAuth2**. This last one was being widely adopted by companies like Facebook, Google, Microsoft, etc. 

{% endexcerpt %}

The key advantages of OAuth2 are its simplicity (compared to SAML for example), and the wide availability of libraries already written in different languages and platforms. However, [OAuth2 is not an authentication protocol](http://www.thread-safe.com/2012/01/problem-with-oauth-for-authentication.html). We started looking at options for our defualt authentication protocol and we've found [OpenID Connect](http://openid.net/connect) which was promising to do exactly what we envisioned was needed. 

I was fortunate to be personally involved from the beginning. My main concern always being, keeping things as simple as possible. Many thanks to [Mike Jones](self-issued.info) for inviting me to join the working group!

### So what it's OpenID Connect?

**The OpenId Connect core spec is OAuth2 + JSON Web Tokens**. Of course it has more than that (session management, dynamic client registration and others), but the core is simple. By having a signed token we can validate that the user is being authenticated to the right application coming from the right identity provider (avoiding the [confused deputy problem](http://en.wikipedia.org/wiki/Confused_deputy_problem)). That token can also be used to flow the identity of the user to an API, very useful in native mobile and single page applications, as we touched on our [Cookies vs. Tokens article](/2014/01/07/angularjs-authentication-with-cookies-vs-token/). 

JWT popularity is growing every day. Here are some Open Source libraries yuo can use to get started:

* **Node.js**
  * [github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* **Ruby**
  * [github.com/progrium/ruby-jwt](https://github.com/progrium/ruby-jwt)
* **C#**
  * [nuget.org/packages/System.IdentityModel.Tokens.Jwt](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt/)
  * [github.com/johnsheehan/jwt](https://github.com/johnsheehan/jwt)
* **ASP.NET Web Api**
  * [github.com/auth0/webapi-jsonwebtoken](https://github.com/auth0/webapi-jsonwebtoken)
* **ASP.NET (Owin)** 
  * [nuget.org/packages/Microsoft.Owin.Security.Jwt](https://www.nuget.org/packages/Microsoft.Owin.Security.Jwt)
  * [github.com/michaelnoonan/Auth0-Owin-JwtBearerAuthentication](https://github.com/michaelnoonan/Auth0-Owin-JwtBearerAuthentication)
* **Java** 
  * [bitbucket.org/lluisfaja/javajwt](https://bitbucket.org/lluisfaja/javajwt)
* **PHP**
  * [github.com/firebase/php-jwt](https://github.com/firebase/php-jwt)

If you have any question about OpenID Connect, feel free to reach out. We are usually on [chat.auth0.com](http://chat.auth0.com).