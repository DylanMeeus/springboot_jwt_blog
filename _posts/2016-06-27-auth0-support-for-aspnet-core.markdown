---
layout: post
title: "Auth0 support for ASP.NET Core"
description: Learn about our support for ASP.NET Core.
date: 2016-06-27 8:30
author:
  name: Jerrie Pelser
  mail: jerrie@auth0.com
  url: https://twitter.com/jerriepelser
  avatar: https://secure.gravatar.com/avatar/6222081fd7dcea7dfb193788d138c457?s=60
design:
  bg_color: "#0D3483"
  image: https://cdn.auth0.com/blog/authenticate-linkedin-aspnetcore/logo.png
tags:
- asp.net-core
- asp.net
- c#
- oauth
- openid-connect
related:
- 2016-06-13-authenticating-a-user-with-linkedin-in-aspnet-core
- 2016-06-03-add-auth-to-native-desktop-csharp-apps-with-jwt

---

---

TL;DR: Auth0's usage of open standards such as [OAuth](http://oauth.net/2/), [OpenID Connect](http://openid.net/connect/) and [JSON Web Tokens](https://jwt.io/) means that we support ASP.NET Core out of the box. No extra libraries are required, just some documentation and samples :)  

---

## Overview

![.Net Core 1.0.0](https://cdn.auth0.com/blog/dotnetcore/dotnet-core.png)

With the final release of ASP.NET Core 1.0 happening today, we are happy to announce that you can now also use Auth0 in your ASP.NET Core applications. Because Auth0 is built on open standards, such as [OAuth](http://oauth.net/2/), [OpenID Connect](http://openid.net/connect/) and [JSON Web Tokens](https://jwt.io/), and all of those are supported by ASP.NET Core middleware out of the box, there was in fact very little we had to do in order to help you use Auth0 in your applications.

Our support at this stage is therefore limited to new Quickstarts for MVC and Web API applications, as well as a number samples which demonstrates various usage scenarios. Over time our Quickstarts will be expanded to cover more of the typical onboarding steps, and our samples will also expand to cover more usage scenarios based on your feedback.

## Embedded Lock

![Embedd Lock](https://cdn.auth0.com/blog/dotnetcore/dotnet-embedded-lock.png)

One usage scenario in particular which is a bit tricky is the one where you want to embed Lock into your ASP.NET Core MVC application, and still use the standard OAuth or OpenID Connect middleware.

When using the normal OAuth or OIDC middleware as-is, when a user wants to log in and the middleware is called, the user will be redirected to the Auth0 website to log in using the hosted version of Lock. This may not be the user experience you are looking for. You may for example want to embed Lock inside your application so it has more of the look-and-feel of your own application. In this instance you can use both Lock and the OAuth/OIDC middleware together, but it requires a bit of extra work on your side.

Normally when the OAuth or OIDC middleware initiates the 1st leg of the authentication, it will send along information contained in a `state` parameter (and in the case of OIDC also a `nonce` parameter). It will also set a couple of cookies containing the values of the `state` and `nonce`.

After the user has authenticated and Auth0 redirects back to the redirect URL inside your application, it will pass back this state and nonce parameters. The OAuth/OIDC middleware is going to pick up that callback to the redirect URL because it will need to exchange the code for an access_token. It will however validate the state and nonce parameters to protect against CSRF.

The problem is that when you embed Lock in your application, the OAuth/OIDC middleware is not initiating the 1st leg of the OAuth/OIDC flow. Lock is.

So in this instance you will need to construct correct state and nonce parameters (as if the OAuth/OIDC middleware did it so that it can validate it correctly), and then be sure to specify the state and nonce parameters on Lock so that Auth0 can send back the correct values for these parameters after the user has authenticated.

![Authenticated User](https://cdn.auth0.com/blog/dotnetcore/dotnet-login.png)

We have very well documented samples for this scenario however, but as mentioned before it requires some extra legwork from your side, and also to add a few extra files to your application. We would love to create a NuGet package which automatically adds the correct helper files to your project, but due to technical limitations with NuGet and `project.json` we cannot create a NuGet that adds content files to your project at this stage. Microsoft has stated that they are going to be [reverting back to csproj files](https://blogs.msdn.microsoft.com/dotnet/2016/05/23/changes-to-project-json/) at some stage, so once this is technically feasible again we will create a NuGet package which will make your life a bit easier in this particular scenario.

## Our ASP.NET Core Quickstarts and Samples

If you want to get started with Auth0 and ASP.NET Core, please check out these Quickstarts:

* [ASP.NET Core MVC Application](https://auth0.com/docs/quickstart/webapp/aspnet-core)
* [ASP.NET Core Web API](https://auth0.com/docs/quickstart/backend/aspnet-core-webapi)

Here is a list of the samples we currently have available:

**MVC Applications**

* [MVC Application using OIDC and the hosted Lock](https://github.com/auth0-samples/auth0-aspnetcore-oidc-hosted-lock)
* [MVC Application using OAuth2 and the hosted Lock](https://github.com/auth0-samples/auth0-aspnetcore-oauth2-hosted-lock)
* [MVC Application using OIDC and embedded Lock](https://github.com/auth0-samples/auth0-aspnetcore-oidc-embedded-lock)
* [MVC Application using OAuth2 and embedded Lock](https://github.com/auth0-samples/auth0-aspnetcore-oauth2-embedded-lock)  

**Web API**

* [Web API secured with RS256 signed JSON Web Tokens](https://github.com/auth0-samples/auth0-aspnetcore-webapi-rs256)
* [Web API secured with HS256 signed JSON Web Tokens](https://github.com/auth0-samples/auth0-aspnetcore-webapi-hs256)
* [Extracting a user's information from a JWT using ASP.NET Core Web API](https://github.com/auth0-samples/auth0-aspnetcore-webapi-userinfo)

## Conclusion

Auth0 works great with the standard ASP.NET Core middleware out of the box due to our use of open standards. We have supplied samples demonstrating various usage scenarios, but please let us know if you would like us to expand on those.

{% include tweet_quote.html quote_text="Auth0 works great with the standard ASP.NET Core middleware out of the box due to our use of open standards." %}
