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

_Components_ are commonly understood to be modular pieces of code that provide UI and/or scripting in a reusable package. Many JS frameworks use the term "components" (ie., [Angular 2](http://learnangular2.com/components/), [React](https://facebook.github.io/react/docs/reusable-components.html), [Ember](http://emberjs.com/api/classes/Ember.Component.html)). However, to understand Polymer, we'll do a brief crash-course on a specific kind of component: _web_ components. 

**Web components** are [reusable](http://webcomponents.org) [widgets](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that can be assembled like building blocks in web documents and apps. They are a set of browser features and are being added to the [W3C HTML and DOM specification](https://www.w3.org/standards/techs/components). A web component is composed of four standards: 

* [Custom Elements](https://www.w3.org/TR/custom-elements/)
* [HTML Templates](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
* [Shadow DOM](https://www.w3.org/TR/shadow-dom/)
* [HTML Imports](https://www.w3.org/TR/html-imports/)

In a nutshell, web components allow us to architect and [import](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) [custom elements](https://developers.google.com/web/fundamentals/primers/customelements/) that automatically associate JS behavior with [templates](http://www.html5rocks.com/en/tutorials/webcomponents/template/) and can utilize [shadow DOM](https://developers.google.com/web/fundamentals/primers/shadowdom) to provide CSS scoping and DOM encapsulation. 

Web components can be used natively _without_ any additional libraries or toolsets. However, because not all features are supported by all browsers, we need to leverage **Polymer** or [polyfills like webcomponents.js](http://webcomponents.org/polyfills/) to bridge the gap between the current state of browser support and the future.

## Enter Polymer

**[Polymer](https://www.polymer-project.org/1.0/)** is a library created by Google that enables us to build cross-browser compatible apps and elements with web components. It provides syntactic sugar to native web components as well as [polyfills for browsers](https://www.polymer-project.org/1.0/docs/browsers) that don't support web components yet. Shadow DOM is difficult and costly to polyfill, so Polymer uses [shady DOM](https://www.polymer-project.org/1.0/blog/shadydom) to [implement the features of shadow DOM](https://www.polymer-project.org/1.0/blog/shadydom#shadow-dom-is-awesome-why-is-there-a-shady-dom) in browsers that lack support.

The **[Polymer Element Catalog](https://elements.polymer-project.org/)** provides many [pre-built custom elements that can be easily implemented](https://elements.polymer-project.org/guides/using-elements) in any Polymer project. They provide useful utility elements like [Ajax](https://elements.polymer-project.org/elements/iron-ajax), [media queries](https://elements.polymer-project.org/elements/iron-media-query), and [single page application routing](https://elements.polymer-project.org/elements/app-route) as well as the [visual "Paper" elements](https://elements.polymer-project.org/browse?package=paper-elements) of [Google's Material Design](https://material.google.com/).

Polymer has comprehensive documentation at the [Polymer Project Devguide](https://www.polymer-project.org/1.0/docs/devguide/feature-overview) and can be used with or without the custom elements in the Element Catalog. We'll build our simple single page application (SPA) with Polymer and Polymer elements.

## What We'll Build

We're going to build a simple Polymer app that does the following:

* Calls an external Node API to get Chuck Norris quotes
* Posts to the API to register and log in users
* Use JSON Web Tokens to fetch protected Chuck Norris quotes for authenticated users
* Store tokens and user data with local storage
* Log out

## Setup and Installation

We're going to use the new [Polymer CLI](https://www.polymer-project.org/1.0/docs/tools/polymer-cli) to scaffold our Polymer web app with the [Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/). By beginning with the starter kit, we'll gain the advantages of routing, app layout, Material Design, and many core utilities right away. 

Let's get started!

### Dependencies

First, make sure that you have [node.js](https://nodejs.org/en/download/) installed. 

Next, install [Bower](https://bower.io/) globally with the following command if you don't already have it: 

```
npm install -g bower
```

Now install the Polymer CLI: 

```
npm install -g polymer-CLI
```

Finally, we need to have our external Node API running in order to send requests. Clone the [NodeJS JWT Authentication sample repo](https://github.com/auth0-blog/nodejs-jwt-authentication-sample) and follow the instructions in the README to get it up and running on [http://localhost:8001](http://localhost:8001).

### Initializing the App

Create a new directory and navigate to it in your terminal or command prompt. Use the following command to initialize the Polymer starter kit in your new folder:

```
polymer init starter-kit
```

This command installs the starter kit app, tests, and necessary Bower components. Once the command completes, we can view the app in the browser by running:

```
polymer serve
```

The site runs at [http://localhost:8080](http://localhost:8080). Adding the optional `--open` flag will automatically launch that address in your default browser.

If you want to see the shadow DOM nodes in action in the inspector during development, [Chrome](https://www.google.com/chrome/) is recommended. The app works in all modern browsers thanks to Polymer's inclusion of shady DOM and polyfills, but Chrome currently has the best native support for web components. 

When viewing your app in the browser, it looks like this:

> INSERT IMAGE: [screenshot_starterkit.jpg]

Your starter kit project's file structure should look like this:

> INSERT IMAGE: [starter-kit-files.png]

## Customizing the Starter Kit

You can see that our app has several views. Let's start looking at the code to understand how Polymer applications and elements are composed and how we can modify the code to suit our needs.

### Naming Elements

Let's open the `/src` folder and take a look at its contents. These are the elements / views that make up the application. You may notice that the file names are all hyphenated (ie., `my-app`, `my-view1`, etc.). This follows the [W3C valid custom element naming spec](https://www.w3.org/TR/custom-elements/#valid-custom-element-name). 

> Custom element names must contain _at least one hyphen_.

The `my-app.html` file contains the main module that renders the other views based on the route (with [iron-pages](https://elements.polymer-project.org/elements/iron-pages)). This name suits our purposes so we'll leave it as-is. The same goes for `my-icons.html` and `shared-styles.html`. However, `my-view1.html` is not a very descriptive name. We'll rename these files and in doing so, learn a little bit about the other Polymer elements used to display these views.

### Rename Files

Our app is composed of the following pages:

1. A home view that lets visitors click a button to get random Chuck Norris quotes.
2. A view with a form that lets visitors register or log into the app.
3. A view where authenticated users can click a button to get random protected Chuck Norris quotes.

We want to rename the starter kit views 

The `/src` folder currently looks like this:

> INSERT IMAGE: [rename-files1.jpg]

We're going to rename these files:

```
/src
  |-- my-view1.html
  |-- my-view2.html
  |-- my-view3.html
  |-- my-view404.html
```

To:

```
/src
  |-- home-quotes.html
  |-- register-login.html
  |-- secret-quotes.html
  |-- not-found.html
```

Our final file `/src` folder file structure should look like this:

> INSERT IMAGE: [rename-files2.jpg]

### Edit the Views

We've renamed the HTML files and now we need to rename the actual elements. For _each_ of the updated views, open the file and do the following:

#### Update `<dom-module>` ID

Locate the `<dom-module>` tag (near the top of the file). This specifies the start of an [element's local DOM](https://www.polymer-project.org/1.0/docs/devguide/local-dom#template-stamping). The `<dom-module>` is the [declarative](https://medium.freecodecamp.com/imperative-vs-declarative-programming-283e96bf8aea) portion of the element definition. Change its ID to match the new file name. 

For example: 

```html
<dom-module id="my-view1">
``` 

becomes: 

```html
<dom-module id="home-quotes">
```

#### Update `Polymer()` Call

Locate the `<script>` tag (near the bottom of the file). The `Polymer()` function is the [imperative](https://medium.freecodecamp.com/imperative-vs-declarative-programming-283e96bf8aea) portion of the element defnition. Change the `is` property to the new element name. 

For example: 

```js
Polymer({ 
	is: 'my-view1',
``` 

becomes: 

```js
	is: 'home-quotes',
```

### Update `my-app.html`

Our elements are renamed, but now we need to update references to them. The view elements are called in the `/src/my-app.html` file, so we'll open this up and make the necessary changes while exploring the contents of the file.

First, locate the [`<app-drawer>`](https://elements.polymer-project.org/elements/app-layout) element. This is the menu sidebar and contains the links to the old routes, like so:

```html
<a name="view1" href="/view1">View One</a>
```

You may notice that the hyphenation (`my-`) is missing. This is being added programmatically, so we'll need to remove that as well. First, change the links in the `<iron-selector>` element to match our renaming scheme:

```html
<iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
	<a name="home-quotes" href="/home-quotes">Home</a>
	<a name="register-login" href="/register-login">Register / Login</a>
	<a name="secret-quotes" href="/Secret Quotes">Secret Quotes</a>
</iron-selector>
```

