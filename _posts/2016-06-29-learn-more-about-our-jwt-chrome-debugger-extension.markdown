---
layout: post
title: "Learn more about the new JWT Debugger Chrome Extension"
description: We've created a video showing of some of the cool features of our JWT Debugger for you to see
date: 2016-06-29 11:23
alias: /2016/06/29/learn-more-about-our-jwt-chrome-debugger-extension/
author: 
  name: Kassandra Perch
  url: http://twitter.com/nodebotanist
  mail: kassandra.perch@auth0.com
  avatar: https://s.gravatar.com/avatar/bc94ff6211e645a2bdb4fdc60e23ad85.jpg?s=200
design: 
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
tags: 
- JSON-Web-Tokens
- JWT-Debugger
- JWT
- Video
related:
- 2016-06-17-announcing-our-chrome-jwt-extension
- 2016-06-15-adding-authentication-to-react-native-using-jwt
- 2016-06-02-ruby-authentication-secure-rack-apps-with-jwt
---

<div class="wistia_responsive_padding" style="padding:62.5% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/m7ctnnu4et?seo=false&videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Transcript

Hi, this is Kassandra with Auth0, and today we're gonna talk about the new JWT plugin that we've launched. So I've already installed it, and you can see the logo over here, and so I'm gonna click on it. And you can see the debugger. Now, there are quite a few features that are brand-new to this debugger that I want to show you. One of the first ones is this "Open JWT From." So what I'm gonna do is, it says, "Web Storage" and "Cookies," so I'm actually going to use the local storage API to save a JWT into local storage and show you how you can debug it.

Okay, now to do that, what I'm going to do is say, "localStorage.setItem()" with our token. Okay. So now I'm going to reopen the JWT debugger and go to Open JWT From. And as you can see, my token now shows up here. Now it does still say invalid signature, so I'm gonna have to change the secret to the secret I made this key with, and you can now see signature verified, just like with the JWT debugger on the webpage. You can also share JWTs with this button. You copy the URL, and it will send people to the debugger on the website.

One of the other really cool things you can do with the JWT plugin is decode and check RSA signed JWTs. And so I've pasted one in here, and as you can see, it wants my public and private key. I'm gonna put in my public key here, and I'm gonna take my private key off there. And I'm gonna put that here. And as you can see, the signature is now verified. This can come in handy in many, many situations. So basically if you're working on a site using JWTs, you can now pull those JWTs from local storage or cookies, and no matter what you used to encode them, be it a public, private key pair or an HS256 secret, you can debug them in your browser without even having to leave.

Hopefully this will inspire you to [download the debugger yourself](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd?hl=en). I'm Kassandra Perch with Auth0. Thanks for watching.
