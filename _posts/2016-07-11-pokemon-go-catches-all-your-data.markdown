---
layout: post
title: "Gotta Catch'em All: Pokémon GO Catches All Your Data!"
description: "A potential programming mistake raises unexpected privacy concerns among users"
date: 2016-07-11 18:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/pokemon/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- pokémon
- pokemon
- pokémon go
- pokemon go
- user data
- security
- single sign on
- sso
- authorization
- roles
- privacy
---

[Pokémon](https://en.wikipedia.org/wiki/Pok%C3%A9mon) has been a subject of passion for grown-ups and youngsters alike for a long time. The newly released Pokémon GO app is no exception: it has been installed by thousands since its release a few days ago. What they don't know is that they have given [Niantic](https://www.nianticlabs.com/), the developer, full access to their Google accounts!  

{% include tweet_quote.html quote_text="Pokémon GO has been installed by thousands and the developer has full access to their Google accounts!" %}

**Update:** Ari Rubinstein from Slack has [dived deeper](https://gist.github.com/arirubinstein/fd5453537436a8757266f908c3e41538) and performed an analysis of what can be done with tokens obtained using this authentication flow. It appears additional steps must be performed to obtain a full access token. These steps *are* possible for Pokemon GO, as it is granted access to the necessary APIs, though the app does not appear to be using them. This issue may be attributed to programming mistakes and a permissive API on the part of Google. Both Google and Niantic are looking into the issue and attempting to provide a fix as soon as possible.      

**Update 2:** Niantic has released an [official statement](https://support.pokemongo.nianticlabs.com/hc/en-us/articles/222648408-Permissions-update) regarding the Pokemon Go iOS permissions problem. And also, the app has been updated in the [App Store](https://itunes.apple.com/us/app/pokemon-go/id1094591345?mt=8) with the correct permission scopes. 

-----

## A Pokémon fan's dream game
Pokémon GO, available in [Apple's App Store](https://itunes.apple.com/us/app/pokemon-go/id1094591345?mt=8) and [Google's Play Store](https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo&hl=en), is an augmented-reality game that lets users be part of a world full of Pokémon ready to be caught. Using the phone's camera and GPS, Pokémon are distributed in the user's vicinity. Hints are displayed to give the user a notion of where to find Pokémon.
To give you an idea of what this means for your average Pokémon fan: it's crazy. We've already heard stories of people going into bars just to catch Pokémon (no drinking involved (!)), others [finding corpses](http://arstechnica.com/gaming/2016/07/gamer-stumbles-onto-dead-body-while-testing-pokemon-gos-gps-fueled-features/). This is pretty much every Pokémon fan's dream game: a game that fuzzes the boundaries between fantasy and reality and lets users be part of an ever changing semi-real world full of Pokémon.

No wonder the explosion in social media. And among the many eyes looking at Pokémon GO [some](http://adamreeve.tumblr.com/post/147120922009/pokemon-go-is-a-huge-security-risk) were keen enough to notice users were giving full access to their Google accounts!

![All access in Google account](https://cdn.auth0.com/blog/pokemon/allaccess.png)

## How this happened: Single-Sign-On 
We've written a lot about [single-sign-on](https://auth0.com/blog/2015/09/23/what-is-and-how-does-single-sign-on-work/) in the past. It's great, and it helps [businesses grow](http://www.appcues.com/blog/single-sign-on-the-one-click-growth-hack-youre-not-using/). Security is hard, though, and this is no exception. Most single sign on solutions sport a flow similar to the following:

1. An application, on behalf of a user, requests to login through a login provider.
2. The application redirects the user to the login provider's login screen.
3. The login provider authenticates the user and then proceeds to create an authentication/authorization token for the application to use.
4. The token is passed to the application, which can use the token on behalf of the user to perform certain operations with his/her account.

If the application has never operated on behalf of the user with that login provider, an additional step is inserted between step 3 and 4. This step is crucial and defines **what access the application will have to the user data in the login provider's system**. It is this step that is not working right in Pokémon GO.

![Have you ever seen this screen?](https://cdn.auth0.com/blog/pokemon/permissions.png)

For some reason this screen is not showing and the app is still getting full-access to Google accounts.

This means **emails (reading and sending), Google Drive documents, your browsing history, your photos, your maps and locations** are *all* available to Niantic. As far as we know, the Android version does not exhibit the same issue (unless you log in with an account previously used on an iOS device for Pokémon GO), so it was probably not the developer's intention to do this. In other words, this is probably a bug or a simple coding mistake.

Until this issue is resolved, our advice is to simply revoke the application's permissions to your Google account by going to the [connected apps page](https://security.google.com/settings/security/permissions).

**Update:** now we know why this screen is not being displayed. Read the excellent [analysis](https://gist.github.com/arirubinstein/fd5453537436a8757266f908c3e41538) by Ari Rubinstein and then take a look at [what is necessary](https://duo.com/blog/beyond-the-vulnerabilities-of-the-application-specific-password-exploiting-google-chrome-s-oauth2-tokens) to get a full access token from the one obtained by Pokémon GO. Although possible, there is no reason to believe Pokémon GO is exploting this.

## Let the experts do the hard work
Authentication and authorization are hard. Even when using the [excellent documentation provided by Google](https://developers.google.com/identity/sign-in/ios/sign-in) for their single-sign-on solution, bugs and mistakes happen. And when you are growing as fast as Pokémon GO, mistakes can be costly.

Our single-sign-on solution gives applications only minimal access to account details by default. Google, Facebook, Twitter and many other login providers are all supported and available under one click. Using a simple, safe-by-default solution can make all the difference between a costly mistake and smooth sailing. <a href="javascript:signup()">Try Auth0 now</a> and focus on your app, not logins.

These are our default permissions for Google sign-in: 

![Auth0 default Google permissions](https://cdn.auth0.com/blog/pokemon/auth0-perms-2.png)

