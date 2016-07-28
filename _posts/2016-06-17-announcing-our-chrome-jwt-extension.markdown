---
layout: post
title: "Introducing our new JWT Debugger Chrome Extension"
description: "Do you like JWT.io? Then you'll love this extension!"
date: 2016-06-17 12:30
alias: /2016/06/17/announcing-our-chrome-jwt-extension/
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- jwt
- jwt.io
- chrome
- extension
- chrome extension
- rsa
- hmac
related:
- 2016-06-29-learn-more-about-our-jwt-chrome-debugger-extension
- 2016-06-15-adding-authentication-to-react-native-using-jwt
- 2016-06-02-ruby-authentication-secure-rack-apps-with-jwt
---

Do you find yourself visiting [JWT.io](https://jwt.io) a lot to debug your tokens? Then you'll love what we have in store for you: [JWT.io as a Chrome extension](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd) with extra features!

{% include tweet_quote.html quote_text="Debug JWTs from your browser with our new extension: https://goo.gl/axNsXn" %}

-----

## A New Chrome Extension
We noticed many users rely on [JWT.io](https://jwt.io) to debug their JWTs. And with good reason! The colored visual editor is intuitive and has support for both HMAC and RSA signed JWTs. So we thought: what if we made this available offline for all users with a few extra features? So our [new Chrome extension](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd) was born.

## Features
- Visual JWT editor with coloring:
![JWT Debugger](https://cdn.auth0.com/blog/chrome-extension/editor.png)

- Support for HS256 (HMAC + SHA256) signed JWTs:
![JWT Debugger HS256 support](https://cdn.auth0.com/blog/chrome-extension/hs256-2.png)

- Support for RS256 (RSA) signed JWTs:
![JWT Debugger RS256 support](https://cdn.auth0.com/blog/chrome-extension/rs256-2.png)

- Load and save JWTs in cookies and web storage from the current tab:
![JWT Debugger load from cookies/web storage](https://cdn.auth0.com/blog/chrome-extension/load-from.png)

- Get a shareable URL for your JWTs:
![JWT Debugger shareable URL](https://cdn.auth0.com/blog/chrome-extension/share-2.png)

[Try it out now](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd) and give us your feedback! Can you think of any other features you'd love to have? Tell us below in the comments or through Chrome's Web Store.
