---
layout: post
title: "How Real Estate Companies Can Implement Open ID Connect With Auth0"
description: All National Association of REALTORS affiliated listing services are now required to adopt the Open ID Connect standard
date: 2016-08-16 12:30
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: "https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60"
design: 
  bg_color: "#2D2D2D"
  image: https://cdn.auth0.com/blog/reso-oidc/logo.png
tags: 
- oidc
- grow-hacking
- identity
related:
- 2016-07-08-why-your-project-estimations-are-always-wrong
- 2016-07-05-growth-hacking-is-dead-long-live-growth-hacking
- 2016-07-01-why-staying-agile-is-key-to-startup-success
---

At the Real Estate Standards Organization's annual conference in Austin last October, the issue of identity authentication had top billing. The big announcement? Widespread and wholesale encouragement to adopt the Open ID identity management standard across the industry.

Today, it's more than a recommendation. All National Association of REALTORS affiliated listing services **[are now required](http://www.reso.org/new-reso-web-api-standard-3-reasons-implement/)** to adopt the Open ID Connect standard. This is huge, because the seamless management of identity has historically been a big problem for the increasingly digital real estate industry. 

While agents have been able to use their personal Google or Facebook accounts to access and share information across different apps, vendor lock-in and proprietary software have made it impossible to do the same at work. Single SSO integrations have taken weeks to complete.

And there's been no shortage of reasons to open up the information flow. Between contact management systems, listings management systems, marketing programs, market analysis systems, and document storage, real estate agents consume a ton of data. All that data used to be siloed off in databases that were totally disconnected from one another—until now.

## What Is Open ID Connect?

Before the RESO adopted Open ID Connect, they were on the Real Estate Transaction System, or RETS. A sixteen-year old system based in XML, this antiquated standard was difficult to learn and use, it was slow, and it was once used by every single real estate website out there.

Open ID Connect is a authentication layer that sits on top of the widely used OAuth 2.0 authorization standard.

OAuth gives websites the power to delegate access to secure areas. It's like a key—if you have yours, you can log in to your account. 

Unfortunately, it doesn't offer any way to tie that key to your identity. That means if someone else gets your key, they can also log into your account. 

Individual service providers like Facebook have built their own extra authentication layers in years past, ensuring that when *your* key is used it's actually you on the other end. Open ID Connect extends the same logic across the web, providing the same kind of security that Facebook and Google have been using for years as an open standard that any organization can adopt.

## Implementing Open ID Connect With Auth0

The coup de grâce of Open ID Connect is [how easy](https://auth0.com/docs/oauth-web-protocol) it can be to implement into your application. Cal Heldenbrand shared his experience with the OpenID Foundation

> The certification process was pretty easy as well. I was expecting it to be more intensive! Our environment is Ruby on Rails, and I used [Nov’s openid_connec](https://github.com/nov/openid_connect)t Ruby gem for constructing ID Tokens. Other than that, my Provider is written from scratch. It took me about 2 weeks to have a very simple provider running for demo purposes. Then another 2 weeks to have it fully compliant with the certification tools. This is also along side my usual day job tasks of web operations. I’d have to say this was a breeze compared to the old OpenID 2.0.

Of course, it can always be a bit faster and easier. Auth0 supports Open ID Connect and a long list of [identity providers](https://auth0.com/docs/identityproviders) and [development stacks](https://auth0.com/docs). 

![Auth0 Identity Providers](https://cdn.auth0.com/blog/reso-oidc/identity-providers.png)

You're covered no matter your IdP. There's no need to spend a month writing your own provider and getting it compliant, either—Auth0 is as close to plug-and-play as it gets.

You can set up Open ID Connect in four basic steps: 

1. Set up a callback URL from your Auth0 dashboard
2. Integrate Auth0 Lock on your site or trigger login manually
3. Send the `code` your app receives to the Auth0 with a `POST`
4. Use a `GET` to retrieve the user profile from the server's response

Then, when users visit your website, this is what they'll see (you can customize the look of the box, of course!):

![Auth0 Lock Widget](https://cdn.auth0.com/blog/reso-oidc/auth0-lock.png)

For the full breakdown, check out the documentation on implementing Auth0 into your web app [here](https://auth0.com/docs/oauth-web-protocol).

### Building Your Own Identity Provider Hurts

Building your own identity provider could be a good summertime project—no one knows that better than us!—but that month spent wrangling with Open ID Connect starts to look very different when it's the only thing keeping you from launching.

It can easily become a frustrating way to spend your valuable time early on while you should be worrying about finishing your product and finding customers. It can also become a serious roadblock on your feature map, and that sucks.

Plus, even once you finish building it, you have to deal with the tweaks and changes that will become necessary every time a change is made to one of the platforms your users use to log-in. Building an identity provider is not a one-time investment.

With an identity “clearinghouse” like Auth0, all the work of maintaining and keeping your different connections current is taken care of. 

## Why Open ID Connect 

We've been working with OAuth since we first started building out the core functionality of Auth0. OAuth was always simple, widely used, and highly cross-compatible. But it was never enough to provide secure federated identity management, which is how we found Open ID Connect. 

But Open ID Connect isn't just secure. That's the baseline. The true magic of it is something you've already experienced if you've ever used your Facebook account to find your friends' playlists on Spotify—the seamless interchange of information between apps.

Imagine having your listing info, market analysis, customer data and documents all accessible to one another. No more signing in and out of different overlapping systems for different markets and dealing with incompatible systems. One login and one password—that's what Open ID Connect promises. 

Auth0 can handle all the different connections and layers of authentication, but it can also help use this data to supercharge your company's marketing and promotional efforts.

### Put Your User Data To Work And Drive Growth

Auth0 “rules” are Javascript snippets run by Auth0 and executed when users are authenticated in your app. These are what allow Auth0 to provide simple, actionable analytics for you to use to grow your business.

![Auth0 Rules Engine](https://cdn.auth0.com/blog/reso-oidc/rules-engine.png)

Conventional analytics run client-side often fail, or even return misleading results—rules are far more reliable because they're run from the back-end. That means clean data you can immediately start using to execute on personalized marketing and retention tactics: 

1. **Enrich lead profiles:** Pull publicly available information on your new sign-ups and use it to build detailed customer personas.
2. **Notify your team of new leads:** Loop your authentication into an application like Slack to let everyone know when you have a new prospect.
3. **Craft highly personal marketing emails:** Send the right emails to the right users—you don't want to send a listing announcement to a user who's been inactive for a year.
4. **Analyze user registration info:** Graph your new sign-ups and separate them by source so you can understand what promo campaigns are working and which aren't.

Open ID Connect is changing the world of real estate technology by making it easier than ever to develop and use business applications, but it's not just good for convenience's sake. 

Because it provides a way to securely share authentication and verification across platforms, Open ID Connect is opening up to real estate companies the same opportunities that tech companies have had for years—opportunities to treat customers better, learn faster, and [grow at unprecedented rates](https://auth0.com/blog/7-ways-to-2x-your-revenue-growth-by-putting-your-user-data-to-work/).
