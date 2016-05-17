---
layout: post
title: "Why Federated Identity Management Matters"
description: With an identity clearinghouse, you can stay focused on your business, not figuring out who your users are.
date: 2016-05-17 8:30
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: "https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60"
design: 
  bg_color: "#1F3C5E"
  image: https://cdn.auth0.com/blog/federated-identity/logo.png
tags: 
- federated identity
- single sign on
- identity management
related:
- 2016-05-14-how-passwordless-sms-authentication-can-improve-your-app
- 2016-05-08-how-to-use-auth0-to-manage-your-multi-tenancy-application
- 2016-05-10-how-fingerprint-auth-gives-you-security
---

## What Is Federated Identity Management?

In the early days of the web, your digital identities were dispersed across all the different sites and applications that you used: 

* Each time you went to a new site, you made up a username and password. 
* They were then stored on that site. 
* Every time you returned, you had to re-enter your credentials, and so on and so forth for each site you visited.

This was an unwieldy system. Users would never stay logged in across sites, even when those sites were managed by the same organization. It was like an amusement park where you had to identify yourself as a paying visitor at each ride.

![Non Single Sign On scenario](https://cdn.auth0.com/blog/federated-identity/non-sso-scenario.png)

The problem was that if an organization wanted to have user credentials carry over from one domain to another, then there would have to be a new system for authentication. As the internet grew more complex and more interconnected, developers started to realize that siloing authentication on individual domains was not a scalable system.

## How Federated Identity Management Works

The web's early infrastructure was not built to permit federated identity management—it worked against it. In fact, it was one of the earliest and most crucial principles, the same origin policy, that made the idea very difficult to implement:

* The same origin policy states that no cookies or other information stored on an end-user's computer can be accessed except by the original *creator *of that information. 
* This is fundamental—it means that domain Y can't rifle through your data and find your username and password to domain X. Without this policy, the whole idea of internet security would be moot. 
* What this meant was that companies with multiple domains, if they wanted users to have a seamless, fluid experience navigating between them, had to find another way to securely transfer information.

![Same Origin Policy Forbid this](https://cdn.auth0.com/blog/federated-identity/same-origin-policy-forbids-this.png)

All federated identity management systems are, in some way, methods of transferring data without violating the same origin policy. Here's how it generally works:

* You (the user) try to log into the client (an app)
* A request for authentication is sent from the client to an authorization server
* Authentication is returned from the authorization server to the client
* You (the user) are permitted to access the client (or not)

This way, if domain X and Y are related, and their owners want users to move freely between the two, they can simply triangulate around an external authorization server. This benefits overall security (by exposing the client to less overall log-in attempts, and therefore less risk) but the clearest result is a unified, smooth user experience. 

## The Single Sign On Era

Today, we see federated identity everywhere, most noticeably in what we call “single sign on.” With single sign on, you can log into your GMail and then open up YouTube in a different tab, for instance, and you'll stay logged in. It all hinges on a central domain verifying the status of each user as they move across sub-domains:

* You log in once
* Authentication is done through a central domain
* A token or cookie is generated to authenticate you across other domains

![Typical Single Sign On](https://cdn.auth0.com/blog/federated-identity/typical-sso.png)

Dozens upon dozens](https://auth0.com/docs/identityproviders#enterprise) of different SSO identity providers have cropped up to provide this kind of service to webmasters, each with its unique requirements, uses, strengths and weaknesses:

* SAML
* OpenID Connect
* Facebook Connect
* Microsoft Active Directory
* Twitter

Some are more enterprise-focused, while some authenticate through social media and are better for personal use. Some use a decentralized system—with SAML, for instance, any node in the SAML network is capable of accepting the authentication done by another node. Some don't—when you log in through Facebook Connect, all authentication is done by Facebook. 

Emerging in popularity now are passwordless systems, where your access does not hinge upon a set of credentials but your possession of some other factor, like your cell phone or unique fingerprint:

![Passwordless Connections](https://cdn.auth0.com/blog/federated-identity/passwordless-connections.png)

When you're choosing an identity provider and means of authentication, you need to take into account each provider's limitations and benefits and choose the one that's best for your users and your needs.

## The Problem With Decentralization

Of course, the profusion of different SSO services presents a dilemma. If you're running a site, you usually choose one. That means other authentication services won't work. And the problem just gets worse the bigger your organization gets. Today, you might have: 

* A dozen internal tools and third-party tools rotating in and out of use just at your own company.
* Each tool is built on a different stack and speaks to the others with a different protocol.
* Customers with tens of thousands of employees, each with their own arsenal of third-party tools.

In the old days, all corporate software was stored on massive internal server racks. There was no need to worry about integration because everything you needed was stored in one place—everything was already integrated. Now there are endless different social and enterprise options just for logging into an app:

![Social Providers](https://cdn.auth0.com/blog/federated-identity/social-providers.png)

![Enterprise Providers](https://cdn.auth0.com/blog/federated-identity/enterprise-options.png)

Now, providing that kind of integrated experience means negotiating between all the different identity providers that your users authenticate with, but it also means dealing with different:

* **Authorization practices:** delineating specific access restrictions, i.e. “Can user X access Y section of the site?” and keeping those consistent.
* **Attributes exchange practices**: avoiding the duplication of user data created by the interactions between different identity providers.
* **User management practices**: being able to access, create, update, and delete user accounts.

All SSO can do is authorize different kinds of people when they come to use a service—it's just one aspect of a federated identity management system.

## Auth0 and Federated Identity Management  

Auth0 is both a classic identity provider and a federated identity management system. This means that you can set it up so that:

* Users see an Auth0 log-in box when they visit your site
* When they sign up, their credentials are stored with Auth0
* When they log in, their credentials are authenticated with Auth0

![Auth0's solution](https://cdn.auth0.com/blog/federated-identity/auth0.png)

With this arrangement, Auth0 behaves as a normal single sign on app. You can then go to any other app or site that uses Auth0 and you will remain logged in if an administrator has enabled that option. 

But with just a few lines of code, you can also 

* Integrate with virtually any protocol you want to make available to your users: SAML, OpenID Connect, Facebook Connect, Microsoft Active Directory, Twitter, and more. 
* Manage user accounts and check out your identity-based analytics right in the Auth0 dashboard.
* Leverage your users' social data to provide a personalized onboarding experience 

Auth0 is a true federated identity manager in the sense that it doesn't *just *allow for you to stay signed in across domains. Auth0 also gives you access to the user accounts of everyone on your system, allows you to set specific access restrictions across identity providers, and keep all of this data consistent. 

Auth0 can be a clearinghouse for the identities of all your users whether you're running a consumer-facing mobile app or an enterprise system with a SAML-based identity provider. One click is all it takes to turn integrations on and off, and to secure them with Auth0's [full lineup of security features](https://auth0.com/security).
