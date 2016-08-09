---
layout: post
title: "JSON Web Tokens(JWTs) vs Sessions in Practice"
description: Learn how JSON Web tokens and Sessions actually work in practice and make informed decisions about their usage!
date: 2016-08-04 12:20
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#1F3C5E"
  image: https://cdn.auth0.com/blog/social-login-stats/logo.png
tags:
- sessions
- json-webtokens
- auth0
related:
- 2016-07-21-analysis-of-social-connection-data
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-14-safely-use-best-customer-retention-tactics
---

**TL;DR** Several applications these days build their backend as APIs and have their front-end systems consume it. There are also systems, include legacy ones that build their applications as monoliths and require sessions to track a user throughout the application lifecycle. Token based authentication is used in the former and session in the latter.

## What are JSON Web Tokens?

JSON Web Token(JWT) is an open standard([RFC 7519](https://tools.ietf.org/html/rfc7519)) that defines a compact and self-contained way for securely transmitting information between parties as a JSON Object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with HMAC algorithm) or a public/private key pair using RSA.

## JWT Anatomy

JWTs basically consist of three parts separated by a `.` . Look at the example below:

```javascript

xxxxxxxxx.yyyyyyyyyy.zzzzzzzzz

```

Let's analyze the three parts, from left to right. The first part of the token from the left is the **Header**.

### Header

The header typically consists of two parts:

* The type of token which is `JWT`
* The hashing algorithm being used, such as `HMAC SHA256` or `RSA`

Take a look at this example:

```javascript

{
    "alg": "HS256",
    "typ": "JWT"
}

```

where `alg` refers to hashing alogrithm and `typ` refers to the type of token. Once this is `base64Url` encoded, we have the first part of our JWT as `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`.

The second part of the token is the **Payload**.

### Payload

This is part of the JSON Web Token(JWT) that contains the claims. Claims are statements about and entity(typically, the user) and additional metadata about the token. Claims contain the information we want to transmit. There are three types of claims: `reserved`, `public`, and `private` claims.

* **Reserved Claims**: These are a set of predefined claims, which are not mandatory but recommended, thought to provide a set of useful, interoperable claims. These include: `iss (issuer),` `exp (expiration time)`, `sub (subject)`, `aud (audience)`, `iat(issued at)`, `nbf(Not before)` among others.
* **Public Claims**: These can be defined at will by those using JWTs. But to avoid collisions they should be defined in the IANA JSON Web Token Registry or be defined as a URI that contains a collision resistant namespace.
* **Private Claims**: These are the custom claims created to share information between parties that agree on using them.

Here's an example of a payload:

```javascript

{
  "sub": "1234567890",
  "name": "Prosper Otemuyiwa",
  "role": "manager"
}
```
Once this is `base64Url` encoded, we have the second part of our JWT as `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByb3NwZXIgT3RlbXV5aXdhIiwicm9sZSI6Im1hbmFnZXIifQ`.

The third part of the token is the **Signature**.

### Signature

Creating the signature part of the token requires the encoded header, the encoded payload, a secret, and the the algorithm specified in the header. The signature's secret key is held by the server so that it will be able to verify existing tokens and sign new ones. There are several algorithms that you can use to sign the tokens. Some of which are:

* HS256
* HS384
* HS512
* RS256
* RS384
* RS512
* ES256

You can the find the list of algorithms [here](https://tools.ietf.org/html/rfc7518#section-3.1). In practice, only `RS256` and `HMAC SHA256` are in use([jwt.io](https://jwt.io) supports these two). If you want to sign with the `HMAC SHA256` algorithm, the signature will be created like so:

```javascript

HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload) + "." + secret)

```
The signature is used to verify that the sender of the JWT is who it says it is and to ensure the message wasn't tampered with during tranmission. With this, the final part of our JWT will be `JX1DhkyJFGca7lNgrSlO2ALa7GsHBEuTQ318eP6bJg0`.

[JWT Debugger](https://cdn.auth0.com/blog/blog/jwt-debugger.png)

Now, the output of this generated token will be three Base64 strings separated by dots that can be easily passed in HTML and HTTP environments, while being more compact when compared to XML-based standards such as SAML.

The following shows our JWT that has the encoded header, encoded payload and signature.

```bash

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByb3NwZXIgT3RlbXV5aXdhIiwicm9sZSI6Im1hbmFnZXIifQ.JX1DhkyJFGca7lNgrSlO2ALa7GsHBEuTQ318eP6bJg0

```

**Note:** JWTs can also be encrypted. For example, if you are storing very sensitive information such as a user's social security number, then you should definitely encrypt the JSON Web token.

### How JSON Web Tokens Work

In authentication, when the user successfully logs in using his credentials, a JSON Web Token will be returned and must be saved locally (typically in local storage, but cookies can be also used), instead of the traditional approach of creating a session in the server and returning a cookie.

Whenever the user wants to access a protected route, it should send the JWT, typically in the Authorization header using the Bearer schema. Therefore the content of the header should look like the following.

```js

Authorization: Bearer <token>

```

This is a stateless authentication mechanism as the user state is never saved in the server memory. The server’s protected routes will check for a valid JWT in the Authorization header, and if there is, the user will be allowed. As JWTs are self-contained, all the necessary information is there, reducing the need of going back and forward to the database.

This allows to fully rely on data APIs that are stateless and even make requests to downstream services. It doesn’t matter which domains are serving your APIs, as Cross-Origin Resource Sharing (CORS) won’t be an issue as it doesn’t use cookies.

_Authentication flow_

<img src="https://auth0.com/learn/wp-content/uploads/2016/01/jwt-how-it-works.png" alt="JWT - How it works" style="background-color: #4e92df;" />

## Why should you use JWTs

There are several reasons why you should use JSON Web tokens, especially when compared to Simple Web Tokens(SWT) and Security Assertion Markup Language Tokens(SAML).

1. JSON is less verbose than XML. Its size is smaller when encoded; making JWT more compact than SAML.
2. JSON parsers are common in most programming languages, because they map directly to objects, conversely XML doesn’t have a natural document-to-object mapping. This makes it easier to work with JWT than SAML assertions.
3. The ease of client side processing of JWTs on multiple platforms, especially, mobile makes it widely used.

[Why you should use JWT](https://auth0.com/learn/wp-content/uploads/2016/01/why-should-you-use-jwt.png)

## JWTs vs Sessions

Before the emergence of JSON Web tokens, we had the predominant server-based authentication. As we all know, HTTP Protocol is stateless, this means that if we authenticate a user with a username and password, then on the next request, our application won’t know who we are. We would have to authenticate again. SO there was a need to ensure that after a user has logged in, the user's authentication status can still be verified on every subsequent HTTP request.

<img src="https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-1.png" alt="session-based authentication" />

A user's credentials is sent as a POST request to the server. The server authenticates the user, if the credentials are valid, the server responds with a coookie, which is set on the user's browser, and includes a `SESSION ID` to identify the user. The user sessions are also stored in memory, either via files or database on the server. Now, there are challenges with using sessions that I'll highlight in a bit. There are also advantages to using token-based authentication.

* **Scalability**: As your application grows and your user base increases, you'll have to start scaling either horizontally or vertically. Session data is stored in memory on the server, either via files or database. In a horizontal scaling scenario, where you have to start replicating servers, you have to come up with a separate central session storage system that all your application servers have access to, else you won't be able to scale your application because of the session-store drawback. Another way of solving this challenge is using the concept of [sticky sessions](http://stackoverflow.com/questions/10494431/sticky-and-non-sticky-sessions). These type of workarounds don't really play well with modern large applications. Setting up and maintaining this type of distributed system involves in-depth technical knowledge and subsequently incurs higher financial costs. Using JWTs in this case is seamless, there is no need to store user information in the session since token-based authentication is stateless. Our application can scale easily because we can easily use tokens to access resources from different servers without worrying if the user was actually logged-in on a particular server. You also save costs because you don't need a dedicated server to store your sessions. Why? because there are no sessions!

**Note**: If you are building small applications that absolutely don't need to scale up to running on multiple servers and have no need for RESTful APIs, sessions will definitely work fine for you. And if you can use a dedicated server to run a tool like Redis for your session storage, then sessions might also work perfectly for you!

* **Restful API Services**: A common pattern for modern applications, is to retrieve and consume JSON data from a [RESTful API](http://www.restapitutorial.com/). Most applications these days have RESTful APIs for other developers or applications to consume. Serving data from an API has several distinct advantages, one of them being the ability for data to be used in more than just one application. The traditional approach of using sessions and cookies for the user's identity doesn't work well in this case because they introduce **state** to the application.

* **Performance**:  With sessions, there is a server side lookup to find and deserialize the session on each request. With JWTs, it's faster to validate the token and parse its content on the server side. One advantage of using JWTs is that you can encode a piece of data that will prevent you from making incessant database calls on every HTTP request. This greatly affects performance positively.

[!Server-Client](https://qph.ec.quoracdn.net/main-qimg-b632336c9a3757264eb2faaaf3012c6c?convert_to_webp=true)
*(Source: [Quora](https://quora.com))*

One of the tenets of a RESTful API is that it should be stateless, meaning that, when a request is made, a response within certain parameters can always be anticipated without side effects. A user's authentication state introduces such a side effect, which breaks this principle. Keeping the API stateless and therefore without side effect means that maintainability and debugging are made much easier. Another challenge here is that it is quite common for an API to be served from one server and for the actual application to consume it from another. To make this happen, we need to enable [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). Since cookies can only be used for the domain from which they originated, they aren't much help for APIs on different domains than the application. Using JWTs for authentication in this case ensures that the RESTful API is stateless and you also don't have to worry about where the API or the application is being served from!

* **Downstream Services**: Another common pattern seen with modern web applications is that they often rely on downstream services. For example, a call to the main application server might make a request to a downstream server before the original request is resolved. The issue here is that cookies don't "flow" easily to the downstream servers and can't tell those servers about the user's authentication state. Since each server has its own scheme for cookies, there is a lot of resistance to flow, and connecting to them is difficult. JSON web tokens again makes these a breeze!

## Authentication with Auth0 using JWTs

In **Auth0**, we issue JWTs as a result of the authentication process. When the user logs in using Auth0, a JWT is created, signed, and sent to the user. Auth0 supports signing JWT with both HMAC and RSA algorithms. This token will be then used to authenticate and authorize with APIs which will grant access to their protected routes and resources.

We also use JWTs to perform authentication and authorization in [Auth0’s API v2](https://auth0.com/docs/api/management/v2), replacing the traditional usage of regular opaque API keys. Regarding authorization, JSON Web Tokens allow granular security, that is the ability to specify a particular set of permissions in the token, which improves debuggability.

## Conclusion

JSON Web Tokens(JWTs) are lightweight and can easily be used across platforms and languages. They are clever way of authenticating & authorizing without sessions. There are several [libraries](https://jwt.io/#libraries-io) available for signing and verifying the tokens.There are so many reasons to use tokens and Auth0 is here to ensure that implementing token authentication is easy and secure. Would you still prefer using sessions in practice over JSON Web tokens? Let me know your thoughts in the comment section :smile:
