---
layout: post
title: "Refresh Tokens: When to Use Them and How They Interact with JWTs"
description: "Learn about refresh tokens and how they fit in the modern web"
date: 2015-10-07 09:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#596D5F"
  image: https://cdn.auth0.com/blog/post-images/microservices2.svg
  image_size: "60%"
  image_bg_color: "#596D5F"
  blog_series: false
tags: 
- refresh token
- authentication
- authorization
- oauth
- openid
- access token
- token
- jwt
- sliding sessions
---

In this post we will explore the concept of refresh tokens as defined by [OAuth2](https://tools.ietf.org/html/rfc6749). We will learn why they came to be and how they compare to other types of tokens. We will also learn how to use them with a simple example. Read on!

-----

## Introduction
Modern authentication and/or authorization solutions have introduced the concept of *tokens* into their protocols. Tokens are specially crafted pieces of data that carry just enough information to either **authorize the user to perform an action**, or that allow a client to **get additional information about the authorization** process (to then complete it). In other words, tokens are pieces of information that allow the authorization process to be performed. Whether this information is readable or parseable by the client (or any party other than the authorization server) is defined by the implementation. The important thing is: the client gets this information, and then uses it to **get access to a resource**. The JSON Web Token (JWT) [spec](https://tools.ietf.org/html/rfc7519) defines a way in which common token information may be represented by an implementation.

## A short JWT recap
JWT defines a way in which certain common information pertaining the process of authentication/authorization may be **represented**. As the name implies, the data format is **JSON**. JWTs carry certain **common fields** such as subject, issuer, expiration time, etc. JWTs become really useful when combined with other specs such as [JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515) and [JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516). Together these specs provide not only all the necessary information that is usually needed for an authorization token, but also a means to **validate the content** of the token so that it cannot be tampered with (JWS) and a way to **encrypt information** so that it remains **opaque** to the client (JWE). The simplicity of the data format (and its other virtues) have helped JWTs become one of the most common types of tokens. If you are interested in learning how to implement JWTs in your web apps, check this excellent [post](https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/) by Ryan Chenkie.

## Token types
For the purposes of this post, we will focus on the two most common types of tokens: *access tokens* and *refresh tokens*.

- **Access tokens** carry the necessary information to access a resource directly. In other words, when a client passes an access token to a server managing a resource, that server can use the information contained in the token to decide whether the client is authorized or not. Access tokens usually have an expiration date and are short lived.

![Access Token](https://cdn.auth0.com/blog/refreshtokens/access-token-draft.png)

- **Refresh tokens** carry the necessary information to get a new access token. In other words, whenever an access token is required to access a specific resource, a client may use a refresh token to get a new access token issued by the authentication server. Common use cases include getting new access tokens after old ones have expired, or getting access to a new resource for the first time. Refresh tokens can also expire but are rather long lived. Refresh tokens are usually subject to strict storage requirements to ensure they are not leaked, and can be blacklisted by the authorization server.

![Refresh Token](https://cdn.auth0.com/blog/refreshtokens/refresh-token-draft.png)

Whether tokens are opaque or not is usually defined by the implementation. Common implementations allow for **direct authorization checks against an access token**. That is: when an access token is passed to a server managing a resource, the server can read the information contained in the token and decide itself whether the user is authorized or not (no checks against an authorization server are needed). This is one of the reasons tokens must be signed (using JWS, for instance). On the other hand, refresh tokens usually require a check against the authorization server. This split way of handling authorization checks allows for three things:

1. Improved access patterns against the authorization server (lower load, faster checks).
2. Shorter windows of access for leaked access tokens (these expire quickly, reducing the chance a leaked token may allow access to a protected resource).
3. Sliding-sessions (see below).

### Sliding-sessions
Sliding-sessions are sessions that expire after a **period of inactivity**. As you can imagine, this is easily implemented using access tokens and refresh tokens: when a user performs an action, a new access token is issued. If the user uses an expired access token, the session is considered inactive and a new access token is required. It is defined by the requirements of the development team whether this token can be obtained with a refresh token or a new authentication round is required.

### Security considerations
Refresh tokens are **long-lived**. This means when a client gets a refresh token from a server, this token must be **stored securely** to keep it from being used by potential attackers. If a refresh token is leaked, it may be used to obtain new access tokens (and access protected resources) until it is either blacklisted or it expires (which may take a long time). Refresh tokens must be issued to a single authenticated client to prevent use of leaked tokens by other parties. Access tokens must be kept secret, but as you may imagine, security considerations are less strict due to their shorter life.

## Example: a refresh-token issuing server
For the purposes of this example we will use a simple server (oauth2orize) that will issue access and refresh tokens. Access tokens will be required to access a protected resource. The client will be a simple CURL command.

**TODO: example**

## Aside: use refresh tokens in your Auth0 apps
At Auth0 we do the hard part of authentication for you. Refresh tokens are not an exception. Once you have [setup your app](https://auth0.com/docs) with us, follow the docs [here](https://auth0.com/docs/refresh-token) to learn how to get a refresh token.

## Conclusion
Refresh tokens improve security and allow for reduced latency and better access patterns to authorization servers. Implementations can be simple using tools suchs as JWT + JWS. If you are interested in learning more about tokens (and cookies), check our article [here](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/).


