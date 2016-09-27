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

The full source code for the completed app can be [cloned at this GitHub repo](https://github.com/auth0-blog/polymer-with-jwt-api).

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

![Polymer starter kit](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_starterkit.jpg)

## Customizing the Starter Kit

You can see that our app has several views. Let's start looking at the code to understand how Polymer applications and elements are composed and how we can modify the code to suit our needs.

### Naming Elements

Let's open the `/src` folder and take a look at its contents. These are the elements / views that make up the application. You may notice that the file names are all hyphenated (ie., `my-app`, `my-view1`, etc.). This follows the [W3C valid custom element naming spec](https://www.w3.org/TR/custom-elements/#valid-custom-element-name). Custom element names must contain _at least one hyphen_.

The `my-app.html` file contains the main module that renders the other views based on the route (with [app-route](https://www.polymer-project.org/1.0/toolbox/routing) and [iron-pages](https://elements.polymer-project.org/elements/iron-pages)). `my-app` suits our purposes so we'll leave it as-is. The same goes for `my-icons` and `shared-styles`. However, `my-view1` is not a very descriptive name. We'll rename these files and in doing so, learn about the other Polymer elements used to display these views.

### Rename HTML Files

Our app will be composed of the following views:

1. A home view that lets visitors click a button to display random Chuck Norris quotes.
2. A view with a form that lets visitors register or log into the app.
3. A view where authenticated users can click a button to get random protected Chuck Norris quotes.

We want to rename the generic starter kit views to  match our planned view structure. The `/src` folder currently looks like this:

![Polymer starter kit src file structure](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/rename-files1.jpg)

We're going to rename these files:

```
/src
  |-- my-view1.html
  |-- my-view2.html
  |-- my-view3.html
  |-- my-view404.html
```

to the following:

```
/src
  |-- home-quotes.html
  |-- register-login.html
  |-- secret-quotes.html
  |-- not-found.html
```

Our final file `/src` folder file structure should look like this:

![Polymer starter kit Chuck Norris app src file structure](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/rename-files2.jpg)

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
Polymer({
	is: 'home-quotes',
```

### Update `my-app.html`

Our elements are renamed but now we need to update references to them. The view elements are called in the `/src/my-app.html` file, so we'll open this up and make the necessary changes while exploring the contents of the file.

Routing is handled by `<app-location>`, `<app-route>`, and `<iron-pages>`. Consult the documentation to learn more about [Polymer routing](https://www.polymer-project.org/1.0/toolbox/routing). 

To get our renamed views working with routing, locate the [`<app-drawer>`](https://elements.polymer-project.org/elements/app-layout) element. This is the menu sidebar and currently contains links to the old routes, like so:

```html
<a name="view1" href="/view1">View One</a>
```

You may notice that the hyphenation (`my-`) is missing. This is being added programmatically, so we'll need to remove that as well. First, change the anchor links inside the `<iron-selector>` element to match our renamed views:

```html
<iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
	<a name="home-quotes" href="/home-quotes">Home</a>
	<a name="register-login" href="/register-login">Log In</a>
	<a name="secret-quotes" href="/Secret Quotes">Secret Quotes</a>
</iron-selector>
```

We've successfully updated the links in the menu. 

However, the Log In link might be better if it was located in the header instead of the sidebar, so let's move it. Cut the `<a name="register-login" href="/register-login">Log In</a>` line so we can shift it to the header.

Locate the [header layout](https://www.polymer-project.org/1.0/toolbox/app-layout#header-layout) elements `<app-header>` and `<app-toolbar>`. Paste the login anchor tag after the `<div main-title>My App</div>` element. While we're here, let's change the main title to "Chuck Norris" as well. When we're done, the `<app-toolbar>` element should look like this:

```html
<app-toolbar>
	<paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
	<div main-title>Chuck Norris</div>
	<a name="register-login" href="/register-login">Log In</a>
</app-toolbar>
```

We still need to update the markup that places our view elements in the DOM. Locate the [`<iron-pages>`](https://elements.polymer-project.org/elements/iron-pages) tag. This element shows one of its children at a time and is used in conjunction with `<app-route>` to display views based on the URL. Update the  elements inside this tag to reflect the renaming of our view elements:

```html
<iron-pages
	selected="[[page]]"
	attr-for-selected="name"
	fallback-selection="not-found"
	role="main">
	<home-quotes name="home-quotes"></home-quotes>
	<register-login name="register-login"></register-login>
	<secret-quotes name="secret-quotes"></secret-quotes>
	<not-found name="not-found"></not-found>
</iron-pages>
```

We now need to make some changes in the Polymer function. This method takes an object prototype for a new element. You can read more about [Defining elements](https://www.polymer-project.org/1.0/docs/devguide/registering-elements) in the docs.

In the `<script>` tag, locate the `_routePageChanged` function and change the default `this.page` to `home-quotes`:

```js
_routePageChanged: function(page) {
    this.page = page || 'home-quotes';
},
```

Next, locate the `_pageChanged` function. This is where the page URL is being prefixed with `my-`. We need to remove this. Update the `resolvedPageUrl` variable:

```js
_pageChanged: function(page) {
    // Load page import on demand. Show 404 page if fails
    var resolvedPageUrl = this.resolveUrl(page + '.html');
```

Finally, update the `_showPage404` function's `this.page` declaration to `not-found` to match our renamed element:

```js
_showPage404: function() {
    this.page = 'not-found';
}
```

### Update `polymer.json`

Open the `/polymer.json` file. This file contains the [build settings](https://www.polymer-project.org/1.0/docs/tools/polymer-cli#build) for our app when using the Polymer CLI. We'll update the `fragments` array with our renamed views. These are HTML files that are loaded on-demand or asynchronously.

```js
"fragments": [
	"src/home-quotes.html",
	"src/register-login.html",
	"src/secret-quotes.html",
	"src/not-found.html"
  ],
```

Our app now looks like this in the browser:

![Polymer starter kit src file structure](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_routing.jpg)

Click between the routes to make sure everything works. We're now ready to start building out the features of our app.

## Building an Element

We'll start with the home view, which should call the [Chuck Norris API](https://github.com/auth0-blog/nodejs-jwt-authentication-sample) and retrieve random quotes for display. Open the `/src/home-quotes.html` file. This is our `<home-quotes>` custom element. Right now it just contains some lorem ipsum and lacks JS functionality beyond instantiation. We'll add an Ajax call and bindings to display the response on the page. We'll also add a button to get a new random quote when clicked.

### HTML Imports

The first thing we'll do is install some Polymer elements. We can leverage [iron-ajax](https://elements.polymer-project.org/elements/iron-ajax) to call the API and [paper-button](https://elements.polymer-project.org/elements/paper-button) for the UI.

We'll install these components using Bower:

```
bower install PolymerElements/iron-ajax PolymerElements/paper-button --save
```

Now we need to import the elements into `home-quotes` using [HTML imports](http://webcomponents.org/articles/introduction-to-html-imports/). Since we're building web components, we want to import all the dependencies for a specific element in that element's HTML file. We don't want to rely on a parent element loading them first--that could create a missing dependency somwhere down the line. 

Doing this would be dangerous if we were loading scripts in the traditional way: we might get the same dependency called multiple times throughout the app. We would need to centralize file requests or use a dependency manager. However, with web components, we don't need to worry about loading the same imports multiple times because HTML imports dedupe: if an HTML import has already been loaded, it skips loading it again.

The Polymer library and `shared-styles` element are already being imported in our `home-quotes` element. We'll add the two elements we just installed with Bower:

```html
<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="shared-styles.html">
<link rel="import" href="../bower_components/iron-ajax/iron-ajax.html">
<link rel="import" href="../bower_components/paper-button/paper-button.html">
```

Now we can take advantage of these elements.

### Calling an API with iron-ajax

> Make sure you have the [Chuck Norris Node API](https://github.com/auth0-blog/nodejs-jwt-authentication-sample) cloned and running so that the API is accessible on [http://localhost:3001](http://localhost:3001).

We're going to call the API using HTML. The only JavaScript we need to write in this element will be a simple handler to re-send the Ajax request and get a new quote when a button is clicked. Pretty cool, huh?

Below the closing `</style>` tag (we'll come back to styling shortly), add the following `<iron-ajax>` element:

```html
<iron-ajax
	id="getQuoteAjax"
	auto 
	url="http://localhost:3001/api/random-quote"
	method="get"
	handle-as="text"
	last-response="{{quote}}"></iron-ajax>
```

> Note: It's always worthwhile to take a look at the [source code](https://github.com/PolymerElements/iron-ajax) for any custom elements you're getting from elsewhere, including [Polymer elements](https://github.com/PolymerElements).

We gave the `<iron-ajax>` element a descriptive ID so we can access its instance in JS using `this.$.getQuoteAjax`. Setting the `auto` attribute re-sends the request anytime the URL or parameters change. For our purposes, this fetches a quote when the element first loads. Since we won't change the URL or parameters again after initialization, we'll generate subsequent requests with a button click handler. We're using the `GET` method. The API returns the response as a string, so we'll set `handle-as="text"` (other options include `xml`, `json`, `blob`, etc.). 

Finally, `last-response` is the response to the most recent request. We're [automatic / two-way data binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding#two-way-bindings) it to a property called `quote` with [double curly braces](https://www.polymer-project.org/1.0/docs/devguide/data-binding#binding-annotation) (`{{quote}}`) as delimiters. `<iron-ajax>` uses another dependency element called [`<iron-request>`](https://github.com/PolymerElements/iron-ajax/blob/master/iron-request.html) which performs the Ajax request. The response needs to be two-way bound to communicate up and down between the request and our instance of the iron-ajax element. You can read more about [data flow in Polymer here](https://www.polymer-project.org/1.0/docs/devguide/data-system#data-flow).

### Binding and Fetching Quotes

We now have the response from calling the API. We need to display the quote in the view. Locate the card div `<div class="card">` and delete its contents. We don't want the lipsum anymore.

Add a heading and a `<blockquote>`. Inside the blockquote element, one-way bind the `quote` API response using [double square bracket delimiters](https://www.polymer-project.org/1.0/docs/devguide/data-binding#binding-annotation) (`[[quote]]`). We're using one-way binding here because data is flowing downward from host to target but not upwards:

```html
<div class="card">
	<h1>Quotes</h1>
	<blockquote>[[quote]]</blockquote>
</div>
```

The quote fetched from the API now displays in the view. In order to get new quotes, let's add a button below the blockquote:

```html
<paper-button raised>Get a New Quote</paper-button>
```

Check out the [paper-button documentation](https://elements.polymer-project.org/elements/paper-button) to read about styling and API. Right now, we have a very basic button but it doesn't do anything. We need to add an [event listener](https://www.polymer-project.org/1.0/docs/devguide/events) so when we click or tap the button, we can request another quote from the API.

We'll add an [`on-tap` attribute](https://www.polymer-project.org/1.0/docs/devguide/events#annotated-listeners) to the button and give it a handler function to run when the button is clicked or tapped:

```html
<paper-button raised on-tap="getQuote">Get a New Quote</paper-button>
```

In our Polymer function, we need to add the `getQuote()` function:

```js
Polymer({
	is: 'home-quotes',
	getQuote: function() {
		// get a quote from the API
	}
});
```

Now we need to generate another Ajax request in the `getQuote()` handler. We'll use the iron-ajax method [generateRequest()](https://elements.polymer-project.org/elements/iron-ajax#method-generateRequest) to do this. Remember, we can reference our iron-ajax instance by its ID:

```js
getQuote: function() {
	this.$.getQuoteAjax.generateRequest();
}
```

You should now be able to click the "Get a New Quote" button in your app to get and display random Chuck Norris quotes.

### Styling

Web component elements use [shadow DOM styling rules](https://developers.google.com/web/fundamentals/primers/shadowdom/#styling). Styles defined in the shadow root are local, which means we can target IDs and classes within our custom element without contaminating the rest of the page or application. 

Our blockquote and button don't look great right now, so let's give them a little bit of CSS. Head back up to the top of the `/src/home-quotes.html` file and find the `<style>` tag. Notice that this tag `include`s the `shared-styles` element. Since we'll be using the blockquote and button styles elsewhere in the app for the `secret-quotes` element too, we'll want to put our styles somewhere they can be accessed by both `secret-quotes` and `home-quotes`.

Open the `/src/shared-styles.html` file. We can add our common styles here as well as clean up some styles that we won't be using anymore.

Delete the `.circle` ruleset and add the following:

```css
:root {
	--primary-color: #4285f4;
}
paper-button {
	color: #fff;
	font-weight: bold;
}
paper-button.primary {
	background: var(--primary-color);
}
blockquote {
	border-left: 4px solid #eee;
	margin-left: 4px;
	padding-left: 20px;
}
```

As you can see, we can use [custom CSS properties](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties) with Polymer:

```css
:root {
	--primary-color: #4285f4;
}
...
paper-button.primary {
	background: var(--primary-color);
}
```

Many of [Polymer's Material Design Paper elements](https://elements.polymer-project.org/browse?package=paper-elements) can be styled with variables. We can also create our own. We'll set the primary color on the `:root` selector so that it [applies to all custom elements](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-style). We'll then use the variable to style our paper button element with `.primary` class.

> Aside: We'll be using and styling [paper-input-container](https://elements.polymer-project.org/elements/paper-input?active=paper-input-container#styling) later, and by setting the `--primary-color` now, the focus color for inputs is preset as well.



