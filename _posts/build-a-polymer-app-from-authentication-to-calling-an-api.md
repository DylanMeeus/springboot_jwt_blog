---
layout: post
title: "Build a Polymer App: From Authentication to Calling an API"
description: "Build an app using web components and Polymer with an API and JSON Web Token authentication."
date: 2016-09-22
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://www.davevoyles.com/wp-content/uploads/2015/03/Polymer-logo.png
tags:
- polymer
- web components
- javascript
related:
- 2016-08-04-creating-your-first-elm-app-part-1
- 2016-07-14-create-an-app-in-vuejs-2
- 2016-04-13-authentication-in-golang

---

---

**TL;DR** [Polymer](https://www.polymer-project.org/1.0/) provides tools and polyfills for building elements and applications with web components. We'll build a web app using Polymer and its CLI, call an external API, and add authentication with [JSON Web Tokens](http://jwt.io). The full code is available at [this GitHub repo](https://github.com/auth0-blog/polymer-with-jwt-api).

## What Are Web Components?

Many frameworks use the term "components" (ie., Angular 2, React, Ember). In general, _components_ are commonly understood to be modular pieces of code that provide UI and scripting in a reusable package. However, to understand Polymer, we need to understand _web_ components specifically. 

**Web components** are [reusable](http://webcomponents.org) [widgets](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that can be assembled like building blocks in web documents and apps. They are a set of browser features and are being added to the [W3C HTML and DOM specification](https://www.w3.org/standards/techs/components). A web component is composed of four web technologies: 

* [Custom Elements](https://developers.google.com/web/fundamentals/primers/customelements/)
* [HTML Templates](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
* [Shadow DOM](https://developers.google.com/web/fundamentals/primers/shadowdom/)
* [HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/)

Web components can be used _without_ any additional libraries or toolsets. They are composed of native features. However, because they are new and not all features are widely supported by all browsers, Polymer 

## Enter Polymer

[Polymer](https://www.polymer-project.org/1.0/) is a library created by Google that provides tools to help build cross-browser compatible apps and elements with web components. It provides syntactic sugar to native web components as well as polyfills for browsers that don't support web components.

* browser support: https://www.polymer-project.org/1.0/docs/browsers