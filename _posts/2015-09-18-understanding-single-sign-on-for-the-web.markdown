---
layout: post
title: "Understanding Single-Sign-On for the Web"
description: "Learn about SSO and how to use it for your web apps"
date: 2015-09-18 18:00
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
- single sign on
- sso
- federated identity
- saml
- login
- credentials
---

Nowadays, almost every website requires some form of authentication to access its features and content. With the number of websites and services only rising, a centralized login system has become a necessity. Single-sign-on is now required more than ever. In this post we will study how single-sign-on is implemented for the web. We will also compare it to mobile and intranet implementations so you get the full picture. Read on.

-----

## Federated identity glossary
The concept of a centralized or linked electronic identity is known as *federated identity*. Federated identity systems handle several concerns:

- Authentication
- Authorization
- User attributes exchange
- User management

The **authentication** aspect deals with validating user credentials and establishing the identity of the user. **Authorization** is related to access restrictions (is the user allowed to access X resource?). The **attributes exchange** part deals with data sharing across different user management systems. For instance, fields such as *"real name"* may be present in both systems. A federated identity system prevents data duplication by linking related attributes. Lastly, **user management** is related to the administration (creation, deletion, update) of user accounts. A federated identity system usually provides means for administrators (or users) to handle accounts across domains or subsystems.

Single-sign-on is strictly related to the **authentication** part of a federated identity system. Its only concern is establishing the identity of the user and then sharing that information with each subsystem that requires the data. We will now focus on this aspect of a federated identity system.

## Single-sign-on (SSO)
Sooner or later web development teams face one problem: you have developed an application at domain X and now you want your new deployment at domain Y to use the same login information as the other domain. In fact, you want more: you want users who are **already logged-in** at domain X to be already logged-in at domain Y. This is what SSO is all about.

IMAGE 1

The obvious solution to this problem is **sharing session information** across different domains. However, for security reasons, browsers enforce a policy known as the *same origin policy*. This policy dictates that cookies (and other locally stored data) can **only be accessed by its creator** (i.e. the domain that originally requested the data to be stored). In other words, domain X cannot access cookies from domain Y or viceversa. This is what SSO solutions solve in one way or the other: sharing session information across different domains.

IMAGE 2

Different SSO protocols share session information in different ways, but the essential concept is the same: there is a **central domain**, authentication is performed through that central domain, and the **session is then shared** with other domains in some way. For instance, the central domain may generate a JSON Web Token (which is encrypted using a shared secret). This token may then by passed to the client and used by both the authentication domain and any other domains. The token can be passed to the original domain by a redirect. The token contains all necessary information for the domain that requires authentication to identify the user. As the token is encrypted, it cannot be modified in any way by the client.

IMAGE 3

Whenever the user goes to a domain that requires authentication, he or she is **redirected** to the authentication domain. As the user is **already logged-in** in that domain, he or she can be immeditely redirected to the original domain with the necessary authentication token.

IMAGE 4

### Different frameworks
If you have been reading about SSO online, you will probably find there are many different implementations: OpenID Connect, Facebook Connect, SAML, Microsoft Account (formerly known as Passport), etc. Our advice is: choose whatever is simpler for your development efforts. For instance, SAML is deeply entrenched in enterprise developments, so in some cases it will make sense to pick that. If you think you will need to integrate your development with more than one alternative, don't despair: there are frameworks that allow interoperability between different SSO solutions. In fact, that is one of the things we do at Auth0. Check the *aside* section below.

## Example: SSO with OpenID Connect
For the purposes of our example, we have developed a simple three-domain site using SSO with the help of OpenID Connect. Why OpenID Connect? It is open, it is simple and there are high quality implementations.

TODO

## Aside: SSO with Auth0
If you are already using Auth0 in your developments, you know how easy it is to do SSO. If not, see the [docs](https://auth0.com/docs/sso/single-sign-on) and check the [examples](https://github.com/auth0/auth0-sso-sample). Our SSO solution works as a *bridge* between different SSO frameworks. So, whatever your existing apps are using, it has never been easier to integrate SSO in them. We do the hard work for you.

![SSO with Auth0](https://cdn.auth0.com/blog/sso/sso-checkbox.png)

## Conclusion
SSO is here to stay. Decentralized systems are becoming more and more common and authentication is an essential part in all of them. SSO solves one big problem: how to manage the increasing number of users across a whole ecosystem of applications and services. Frameworks such as OpenID Connect and services such as the one we provide at Auth0 make integrating SSO to your new or existing applications much easier. If you are implementing authentication for a new application or service, consider integrating SSO from the get-go.

