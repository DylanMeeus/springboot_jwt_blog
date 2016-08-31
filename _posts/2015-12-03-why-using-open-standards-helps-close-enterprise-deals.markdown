---
layout: post
title: "Why Using Open Standards Helps Close More Enterprise Deals"
description: Contrary to popular belief, reducing vendor lock-in helps gaining enterprise customers
date: 2015-12-03 12:04
alias: /2015/12/03/why-using-open-standards-helps-close-enterprise-deals/
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#004E8A"
  image: https://cdn.auth0.com/blog/using-open-standards/logo.png
tags:
- enterprise-deals
- vendor-lock-in
- startups

related:
- 2016-02-02-switching-from-social-logins-to-saml-in-minutes-with-auth0
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
- 2014-02-26-openid-connect-final-spec-10
---

It’s hard to close an enterprise software deal with a large company, but once you do, you have a customer for life . . . or so the logic goes. If a big company goes through all the trouble to run through the buying process, integrate its systems, train its people and more, it’ll be a cold day in hell before it even considers ripping your software out.

This is what’s called vendor lock-in, and it’s what makes the massive headache of selling to the enterprise worth it.

But there’s a catch—because vendor lock-in is so advantageous to the vendor, it’s one of the biggest worries on an enterprise buyer’s mind. And if you’re a startup, enterprise buyers are going to be doubly worried. Getting locked in to software from a startup that might not exist in a year is their worst nightmare.

It’s counterintuitive, but one of the ways we’ve been able to win at enterprise sales here at Auth0 is through *reducing* vendor lock-in. We build upon open standards rather than creating our own proprietary standards that force involuntary vendor lock-in. In the end, we acquire and keep our customers by making it possible for them to leave at any time.

{% include tweet_quote.html quote_text="We build upon open standards rather than creating proprietary standards that force involuntary vendor lock-in." %}

## Open Standards in an App Built for the Enterprise

Your employees’ identities are split up across all the different apps that your company uses to get stuff done. This gets hugely annoying for employees of big companies who have to login to a bunch of separate systems and remember a username and password for all of them. Plus, employee user profiles are split across these systems which creates discontinuities in the user experience and inefficiency from siloed information stores.

Auth0 is a service that helps big companies bring all of those federated identities into a single place.To make that happen, Auth0 connects with the most common identity protocols used in enterprise deployments (e.g. [SAML](https://auth0.com/docs/saml-configuration), WS-Federation, LDAP) and those used in consumer apps (e.g. OAuth, OpenId Connect), all of which are open standards.

![OAuth flow](https://cdn.auth0.com/blog/using-open-standards/oauth-flow.png)

By connecting these protocols together, we can run identity through a central clearinghouse that manages authorization and authentication and centralizes user profiles in a single location. Here’s how happens in 3 steps, using [OAuth as an example](https://auth0.com/docs/protocols) per the diagram above:

1. **Authorize**: Someone using a browser requests a page that requires users to be authenticated. Your website redirects the user to the Authorization Server on Auth0.
2. **Authenticate**: Auth0 will start the authentication against the requested identity provider. The protocol between Auth0 and the identity provider could be different. It could be OAuth2 again or something else. (e.g. Office 365 uses WS-Federation, Google Apps uses OAuth2).
3. **Getting the Access Token**: Upon successful authentication, the user will eventually return to your web site with a code (steps 3 and 4 in the diagram). Your web site will then call Auth0 again using the code with a request to obtain an "Access Token.” That Access Token can be used to further interact with Auth0’s API—for instance, to retrieve a user profile for the user.

At every step, we’re connecting protocols together that are open standards and building on top of others like JSON Web Tokens. Conventional wisdom says that this would hurt us in enterprise sales, reducing our value in the eyes of big companies and making it easier for them to leave.

Here are the 3 counterintuitive ways we approach selling to the enterprise having been built on open standards. In each case, conventional wisdom would say that our approach to open standards would lower our value in the eyes of enterprise buyers and make it all too likely that we would lose customers to competitors. We’ve been able to win by turning around each weakness into our source of strength.

## Make your code easy to remove

Using open standards in Auth0 makes it easier for customers to adopt our product and hit the ground running, but it also makes it easier for a customer to rip our code out. If they’re unhappy with our product, they can drop us and go with a competitor in a heartbeat, without writing much more code to get a new solution up and running.

### Necessary to integrate into complex environments

Big customers work in incredibly diverse environments with a ton of internal and 3rd party applications that all need to talk to each other and work together. A representative customer might be a bank that has 100,000 employees, all of whom rely on a multitude of different apps to do their jobs. In addition to all the 3rd party tools that employees use, it’s not uncommon to see companies managing 10+ internal tools, each built on a different tech stack that talks to others with a different protocol.

Doing a deal in this kind of environment can be incredibly tricky. You’re only able to deliver value if you can integrate your service with every application—internal and 3rd party—that the customer is running. To make those assurances, companies often resort to building in a custom software development schedule into the enterprise deal.

The problem is that custom software development consulting adds to deal complexity, making it more expensive, increasingly difficult to understand, and harder to execute. And we all know—time kills deals.

Because at Auth0, we support open standards and integrate with everything, we need to do very little in terms of customization for enterprise deals. Customers are more confident purchasing our product because uncertainty, and extra costs like custom development are removed.

{% include tweet_quote.html quote_text="Customers are more confident purchasing our product because uncertainty, and extra costs like custom development are removed." %}


### lock in via value-added functionality

Moreover, it’s by supporting all open standards that we end up delivering core value. Customers don’t want to rip us out because by supporting open standards, we actually expand the functionality of their tools. Given the modernization of the enterprise stack and the transition to the cloud, this means that building on modern open standards means that we’re helping big companies move into the future.

Before a company installs Auth0, you can imagine that different apps create identity continuity by plugging directly into each other using different protocols. But if a company uses, say, LDAP, which was created around 1993 without the cloud in mind, they won’t have mobile functionality because LDAP doesn’t play nice with iOS and the cloud apps you use every day.

![Old world - New World](https://cdn.auth0.com/blog/using-open-standards/old-world-new-world.png)

In the old world, every enterprise app lived behind the firewall, was built on heavyweight web frameworks, and authenticated using Windows Auth or LDAP. Today, not only are enterprises relying on apps in the cloud like Salesforce, the building blocks they’re using for their own internal apps rely on [3rd party services like Amazon AWS and Firebase](https://www.firebase.com/blog/2014-06-05-auth0-guest-blog.html) that run in the cloud. And it’s via modern open standards like JSON Web Tokens that makes this happen and helps enterprises transition from the old world to the new one.

Because Auth0 works with all relevant open standards, it’s not just installed—it’s made the very central hub of all identity verification for the company. Every app plugs into it using whatever protocol is best for the app. The upshot is that two apps that might not have been able to talk to each other previously, now are able to—through Auth0. In our example, Auth0 would talk LDAP and then do protocol translation to a standard supported on mobile.

## Make yourself easily replaceable

Open standards come with the communities that maintain and grow them. Within those communities are engineers and experts who are working to potentially render your expertise and your product obsolete. Your customer isn’t dependent on your personnel and can go to someone else for advice on your own product. In some sense, you’ve outsourced key parts of your value to a community that you have no control over, and that’s lowered your value in the eyes of your buyer.

### Operate within your customer’s sphere of expertise

However, giving up tight-fisted control over your product that provides you with an incredible amount of leverage, and this is particularly true in the realm of security. It can’t be overstated: security is hard. It’s much better to work with a community of cybersecurity experts who have a vested interest in finding and killing security holes than to go at it alone. Fundamentally, it’s the community behind open standards that gives enterprise buyers the confidence that your tech is built on solid ground, and will be easily supported.

Your enterprise buyer will have internal experts on open standards as well, and that will give the buyer confidence to do the deal. They’ll know that they can maintain your app internally without having to hire an outside expert or train their existing team in a new technology. That helps reduce the most dangerous kind of uncertainty—”the unknown unknowns”—the things that you don’t know that you don’t know.

### Choosing a better developer experience

Instead of locking customers into technology that only you know how to use, do the opposite—build on open standards that whole communities of developers work on. You’ll earn customer loyalty by delivering more value on top of that, instead of locking them in.

At Auth0, we offer customers [libraries and SDKs](https://auth0.com/docs) that make it easier to work with open standards in building your app. Developers then choose to work with Auth0 because we’re delivering value on top of what open standards offer. They want to use our tech—they’re not forced to use it.

{% include tweet_quote.html quote_text="At Auth0, we offer customers libraries and SDKs that make it easier to work with open standards in building your app." %}


![How Auth0 works](https://cdn.auth0.com/blog/using-open-standards/rules.png)

Our [Rules engine](https://auth0.com/docs/rules) makes it easy to implement user-facing functionality like multi-factor authentication and encryption. Rules are code snippets written in JavaScript that are executed in Auth0 as part of the authentication pipeline every time a user authenticates to your application. Rules allow you to easily customize and extend Auth0's capabilities.

Developers choose to work with Rules because (a) we save you the hassle of wiring up your internal code—with Rules, you can write code in the browser that’s separated from the rest of your code; (b) you don’t have to add any additional infrastructure; and (c) Rules are sandboxed so they won’t break your app if they fail. When developers write Rules, they’re putting their code into the Auth0 platform, and that creates lock-in. The difference is that they’re doing it voluntarily, and receiving value in return.

## Plan for your startup death

9 out of 10 startups fail, and that’s a fact that enterprise companies know well. To [former HubSpot exec David Cancel](http://davidcancel.com/3-startup-lessons-i-learned-the-hard-way), if you haven’t won yet, you’ve either died or you’re failing—and that has terrible implications for your enterprise customer.  If a buyer has been burned in the past by doing a deal with a startup that died or got bought and then shut down the product, you can expect that they’ll be doubly concerned about your company’s longevity.

![Startup Lifecycle](https://cdn.auth0.com/blog/using-open-standards/startup-lifecycle.png)

But acknowledge your startup’s precarious existence, and you could potentially draw even more attention to it. Stability, above all in many cases, is what enterprise customers are buying. Admitting that you’re a startup in itself could kill your company’s chances of getting the deal.

### The longevity of open standards

If, god forbid, your startup doesn’t work out, you’ll have done your customer a solid by building on open standards. That means that they won’t have to rewrite all of their code. They can replace your defunct product and go with a competitor with minimal hassle.

Open standards have seen thousands of companies come and go. They were around before your company existed, and they’ll be around after. SAML—a protocol that allows you to login once and have that login you into a number of separate websites—was first created in 2001. So when you build on open standards, you get a succession plan for your startup for free.

## Go from Lock-In to Customer Loyalty

By eschewing the traditional notion of lock-in where your customers are forced to rely on you—an effect that engenders bitterness and resentment—you reduce the technological barriers to switching or leaving. While potentially having a disastrous effect on the economics of the business of enterprise software, we’ve seen it to have the opposite effect.

Those constraints force you to get creative and build real value on top of what’s been commoditized and made open and free. When you do that, customers will actively choose you, and you’ll win more deals and build real customer loyalty based in free choice.
