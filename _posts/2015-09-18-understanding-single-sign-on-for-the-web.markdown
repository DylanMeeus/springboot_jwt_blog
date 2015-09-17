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

## Federated identity
The concept of a centralized or linked electronic identity is known as *federated identity*. Federated identity systems handle several concerns:

- Authentication
- Authorization
- User attributes exchange
- User management

The **authentication** aspect deals with validating user credentials and establishing the identity of the user. **Authorization** is related to access restrictions (is the user allowed to access X resource?). The **attributes exchange** part deals with data sharing across different user management systems. For instance, fields such as *"real name"* may be present in both systems. A federated identity system prevents data duplication by linking related attributes. Lastly, **user management** is related to the administration (creation, deletion, update) of user accounts. A federated identity system usually provides means for administrators (or users) to handle accounts across domains or subsystems.

Single-sign-on is strictly related to the **authentication** part of a federated identity system. Its only concern is establishing the identity of the user and then sharing that information with each subsystem that requires the data. We will now focus on this aspect of a federated identity system.

## Single-sign-on (SSO)
When studying the different ways of implementing a SSO subsystem, we find that implementations can usually be divided in three groups:

- Internal or intranet SSO
- External or internet SSO
- Mobile SSO

The main difference between the first two lies in how easy it is to **modify a preexisting system** to share authentication details across other systems. Internal or intranet systems can usually be modified to communicate using one of the many different SSO implementations. For example, suppose two big intranet sites were developed by different teams: one uses a simple custom user + password authentication system while the other uses an internal [OAuth2](http://oauth.net/2/) server to perform authentication. For any reason, it is decided that authentication must be consolidated across all internal websites. As modifying one or both systems is a possibility, it is decided that the first system will now implement OAuth2.

For external or internet systems things are a bit more difficult: there is usually not much flexibility. If no modifications are possible, SSO is usually implemented by **converting data** between authentication solutions. For instance, OAuth2 data may be converted to SAML by a service.

Lastly, there is mobile SSO. This depends on the platform, but there are essentially two choices:

- Store credentials on the device and share the data between applications.
- Use one of the SSO solutions provided by the OS (or a third party). For instance, since iOS 7, Apple provides a feature called *Enterprise Single-Sign-On*.

### Client-side vs server-side SSO for the web
A typical web application stores sessions using **cookies** (or other forms of **client-side storage**). Web browsers provide mechanisms to ensure session information cannot be stolen by other domains. Therefore, SSO needs to deal with this in some way to do its main functionality. How it deals with that usually depends on the type of web application being developed. There are usually two types of web apps: single-page apps and many-page (or regular) web apps. 

Regular (many-page) web apps do SSO by storing session data in a cookie from a **single domain**. In other words, whenever a user needs to login from a domain that is part of the SSO system, he or she is sent to the domain that performs the authentication. Information about the **requested resource** from the original domain is usually attached to this request. After the user validates his identity in the central domain, he or she is **redirected** to the requested resource in the original domain. The app from the original domain knows the user is now authenticated by linking the user session token stored in its own domain with the token that performed the authentication in the central domain. This sharing or linkning of session data is performed **server-side**. This is why this form of SSO is known as *server-side SSO*.

TODO: SERVER SIDE SSO DIAGRAM

In contrast, single page apps usually handle authentication through **AJAX** calls. Since AJAX is limited to the *same domain policy* by web browsers, **cross-origin resource sharing (CORS)** is necessary. With CORS, direct requests to an authentication server can be performed without reloads or redirects. Authentication information may then be requested for each application and saved as a cookie (or using local storage). This is known as *client-side SSO*.

TODO: CLIENT SIDE SSO DIAGRAM

### Different frameworks
If you have been reading about SSO online, you will probably find there are many different implementations: OpenID Connect, Facebook Connect, SAML, Microsoft Account (formerly known as Passport), etc. Our advice is: choose whatever is simpler for your development efforts. For instance, SAML is deeply entrenched in enterprise developments, so in some cases it will make sense to pick that. If you think you will need to integrate your development with more than one alternative, don't despair: there are frameworks that allow interoperability between different SSO solutions. In fact, that is one of the things we do at Auth0. Check the *aside* section below.

## Example: SSO with OpenID Connect
For the purposes of our example, we have developed a simple three-domain site using SSO with the help of OpenID Connect. Why OpenID Connect? It is open, it is simple and there are high quality implementations.

TODO

## Aside: SSO with Auth0
If you are already using Auth0 in your developments, you know how easy it is to do SSO. If not, see the [docs](https://auth0.com/docs/sso/single-sign-on) and check the [examples](https://github.com/auth0/auth0-sso-sample). Our SSO solution works as a *bridge* between different SSO frameworks. So, whatever your existing apps are using, it has never been easier to integrate SSO in them.

![SSO with Auth0](https://cdn.auth0.com/blog/sso/sso-checkbox.png)

## Conclusion
SSO is here to stay. Decentralized systems are becoming more and more common and authentication is an essential part in all of them. SSO solves one big problem: how to manage the increasing number of users across a whole ecosystem of applications and services. Frameworks such as OpenID Connect and services such as the one we provide at Auth0 make integrating SSO to your new or existing applications much easier. If you are implementing authentication for a new application or service, consider integrating SSO from the get-go.

