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

Many frameworks use the term "components" (ie., Angular 2, React, Ember). In general, _components_ are commonly understood to be modular pieces of code that provide UI and scripting in a reusable package. However, to understand Polymer, we'll do a brief crash-course on a specific kind of component: _web_ components. 

**Web components** are [reusable](http://webcomponents.org) [widgets](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that can be assembled like building blocks in web documents and apps. They are a set of browser features and are being added to the [W3C HTML and DOM specification](https://www.w3.org/standards/techs/components). A web component is composed of four standards: 

* [Custom Elements](https://www.w3.org/TR/custom-elements/)
* [HTML Templates](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
* [Shadow DOM](https://www.w3.org/TR/shadow-dom/)
* [HTML Imports](https://www.w3.org/TR/html-imports/)

In a nutshell, web components allow us to architect and [import](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) [custom elements](https://developers.google.com/web/fundamentals/primers/customelements/) that automatically associate JS behavior with [templates](http://www.html5rocks.com/en/tutorials/webcomponents/template/) and can utilize [shadow DOM](https://developers.google.com/web/fundamentals/primers/shadowdom) to provide CSS scoping and DOM encapsulation. 

Web components can be used natively _without_ any additional libraries or toolsets. However, because not all features are supported by all browsers, we need to leverage **Polymer** or [polyfills like webcomponents.js](http://webcomponents.org/polyfills/) to bridge the gap between the current state of browser support and the future.

## Enter Polymer

**[Polymer](https://www.polymer-project.org/1.0/)** is a library created by Google that provides tools to help build cross-browser compatible apps and elements with web components. It provides syntactic sugar to native web components as well as [polyfills for browsers](https://www.polymer-project.org/1.0/docs/browsers) that don't support web components yet.

The **[Polymer Element Catalog](https://elements.polymer-project.org/)** provides many [pre-built custom elements that can be easily implemented](https://elements.polymer-project.org/guides/using-elements) in any Polymer project. They provide useful utilities like [Ajax](https://elements.polymer-project.org/elements/iron-ajax), [media queries](https://elements.polymer-project.org/elements/iron-media-query), and [single page application routing](https://elements.polymer-project.org/elements/app-route) as well as the [visual "Paper" elements](https://elements.polymer-project.org/browse?package=paper-elements) of [Google's Material Design](https://material.google.com/).

Polymer has comprehensive documentation at the [Polymer Project Devguide](https://www.polymer-project.org/1.0/docs/devguide/feature-overview) and can be used with or without the custom elements in the Element Catalog. We'll build our simple single page application (SPA) with Polymer and Polymer elements.