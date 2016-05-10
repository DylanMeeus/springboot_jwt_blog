---
layout: post
title: "What is and how does Single Sign On work?"
description: "In this post you will learn about Single Sign On and how to use it for your web apps"
date: 2015-09-23 18:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#2E3A51"
  image: https://cdn.auth0.com/blog/post-images/idcard-white.png
  image_size: "60%"
  image_bg_color: "#455572"
  blog_series: true
tags: 
- single sign on
- sso
- federated identity
- saml
- login
- credentials
- post-series
related:
- 2015-04-28-announcing-auth0-sso-dashboard
- 2015-12-16-how-to-use-social-login-to-drive-your-apps-growth
- 2016-04-21-facebook-account-kit-passwordless-authentication
---

Nowadays, almost every website requires some form of authentication to access its features and content. With the number of websites and services rising, a centralized login system has become a necessity. Single-sign-on (SSO) is now required more than ever. In this two-piece post we will study how SSO is implemented for the web and provide a working example using OpenID Connect (in part 2). Read on!

-----

## Federated identity glossary
The concept of a centralized or linked electronic identity is known as *federated identity*. Federated identity systems handle several concerns:

- Authentication
- Authorization
- User attributes exchange
- User management

The **authentication** aspect deals with validating user credentials and establishing the identity of the user. **Authorization** is related to access restrictions (e.g., is the user allowed to access X resource?). The **attributes exchange** aspect deals with data sharing across different user management systems. For instance, fields such as *"real name"* may be present in multiple systems. A federated identity system prevents data duplication by linking the related attributes. Lastly, **user management** is related to the administration (creation, deletion, update) of user accounts. A federated identity system usually provides the means for administrators (or users) to handle accounts across domains or subsystems.

SSO is strictly related to the **authentication** part of a federated identity system. Its only concern is establishing the identity of the user and then sharing that information with each subsystem that requires the data. Below, we focus on this crucial aspect of a federated identity system.

## Single sign on (SSO)
Sooner or later web development teams face one problem: you have developed an application at domain X and now you want your new deployment at domain Y to use the same login information as the other domain. In fact, you want more: you want users who are **already logged-in** at domain X to be already logged-in at domain Y. This is what SSO is all about.

![Single sign on question](https://cdn.auth0.com/blog/sso/non-sso-scenario.png)

The obvious solution to this problem is to **share session information** across different domains. However, for security reasons, browsers enforce a policy known as the *same origin policy*. This policy dictates that cookies (and other locally stored data) can **only be accessed by its creator** (i.e. the domain that originally requested the data to be stored). In other words, domain X cannot access cookies from domain Y or vice versa. This is what SSO solutions solve in one way or the other: sharing session information across different domains.

![No cookie sharing](https://cdn.auth0.com/blog/sso/same-origin-policy-forbids-this.png)

Different SSO protocols share session information in different ways, but the essential concept is the same: there is a **central domain**, through which authentication is performed, and then the **session is shared** with other domains in some way. For instance, the central domain may generate a signed JSON Web Token (which may be encrypted using JWE). This token may then be passed to the client and used by the authentication domain as well as any other domains. The token can be passed to the original domain by a redirect and contains all the information needed to identify the user for the domain requiring authentication. As the token is signed, it cannot be modified in any way by the client.

![Central authentication domain](https://cdn.auth0.com/blog/sso/using-central-auth-domain.png)

Whenever the user goes to a domain that requires authentication, he or she is **redirected** to the authentication domain. As the user is **already logged-in** at that domain, he or she can be immeditely redirected to the original domain with the necessary authentication token.

![Single sign on](https://cdn.auth0.com/blog/sso/typical-sso.png)

### Different protocols
If you have been reading about SSO online, you have probably found that there are many different implementations: OpenID Connect, Facebook Connect, SAML, Microsoft Account (formerly known as Passport), etc. Our advice is to choose whatever is simplest for your development efforts. For instance, SAML is deeply entrenched in enterprise developments, so in some cases it will make sense to pick that. If you think you will need to integrate your development with more than one alternative, don't despair: there are frameworks that allow interoperability between different SSO solutions. In fact, that's one of the things we do at Auth0.

## Aside: SSO with Auth0
If you are already using Auth0 in your developments, you know how easy it is to do SSO. If not, please see the [docs on single sign on](https://auth0.com/docs/sso/single-sign-on) and check out the [examples](https://github.com/auth0/auth0-sso-sample). Our SSO solution works as a *bridge* between different SSO frameworks. So whatever your existing apps are using, it has never been easier to integrate SSO into them. We do the hard work for you.

![SSO with Auth0](https://cdn.auth0.com/blog/sso/auth0.png)

## Conclusion
SSO is here to stay. Decentralized systems are becoming more and more common and authentication is an essential aspect of all of them. SSO solves a big problem: how to manage the increasing number of users across a whole ecosystem of applications and services. Frameworks such as OpenID Connect and services such as the one we provide at Auth0 make [integrating Single Sign On](https://auth0.com/learn/how-to-implement-single-sign-on/) into your new or existing applications much easier. If you are implementing authentication for a new application or service, consider integrating SSO from the get-go.

