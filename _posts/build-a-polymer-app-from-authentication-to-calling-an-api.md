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

You can see that our app has several views. We want to customize the starter kit to fit our app's purpose. When we've finished customizing the structure and naming, our app should look like this:

![Polymer starter kit src file structure](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_routing.jpg)

Let's start looking at the code to understand how Polymer applications and elements are composed and how we can modify the code to suit our needs.

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

Click between the routes to make sure everything works. We're now ready to start building out the features of our app.

## Building an Element

We'll start with the home view, which should call the [Chuck Norris API](https://github.com/auth0-blog/nodejs-jwt-authentication-sample) and retrieve random quotes for display. The user should be able to click a button to get a new quote. When we're finished with this step, our app should look like this:  

![Polymer app element home quotes](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_home-quotes.jpg)

Open the `/src/home-quotes.html` file. This is our `home-quotes` custom element. Right now it just contains some lorem ipsum and lacks JS functionality beyond instantiation. We'll add an Ajax call and bindings to display the response on the page. We'll also add a button to get a new random quote when clicked.

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

Below the closing `</style>` tag (we'll come back to styling shortly), add the following `iron-ajax` element:

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

We gave `iron-ajax` a descriptive ID so we can access its instance in JS using `this.$.getQuoteAjax`. Setting the `auto` attribute re-sends the request anytime the URL or parameters change. For our purposes, this fetches a quote when the element first loads. Since we won't change the URL or parameters again after initialization, we'll generate subsequent requests with a button click handler. We're using the `GET` method. The API returns the response as a string, so we'll set `handle-as="text"` (other options include `xml`, `json`, `blob`, etc.). 

Finally, `last-response` is the response to the most recent request. We're [automatic / two-way data binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding#two-way-bindings) it to a property called `quote` with [double curly braces](https://www.polymer-project.org/1.0/docs/devguide/data-binding#binding-annotation) (`{{quote}}`) as delimiters. `iron-ajax` uses another dependency element called [`iron-request`](https://github.com/PolymerElements/iron-ajax/blob/master/iron-request.html) which performs the Ajax request. The response needs to be two-way bound to communicate up and down between the request and our instance of the iron-ajax element. You can read more about [data flow in Polymer here](https://www.polymer-project.org/1.0/docs/devguide/data-system#data-flow).

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
	...
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
a,
paper-button {
	font-weight: bold;
}
a {
	color: var(--primary-color);
}
paper-button {
	color: #fff;
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
a {
	color: var(--primary-color);
}
...
paper-button.primary {
	background: var(--primary-color);
}
```

Many of [Polymer's Material Design Paper elements](https://elements.polymer-project.org/browse?package=paper-elements) can be styled with variables. We can also create our own. We'll set the primary color on the `:root` selector so that it [applies to all custom elements](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-style). We'll then use the variable to style our `paper-button` element with a `.primary` class.

> Note: By setting the `--primary-color` variable now, the focus color for inputs will also be preset when we use [paper-input-container](https://elements.polymer-project.org/elements/paper-input?active=paper-input-container#styling) later.

We now need to add the `.primary` class to our button. Go to `/src/home-quotes.html` and apply this class to the `paper-button` element we created.

```html
<paper-button raised on-tap="getQuote" class="primary">Get a New Quote</paper-button>
```

Our app now gets and displays quotes and has some custom styling.

## Authenticating Users

We want to be able to register users so they can log in and access secret quotes. To do this, we'll create a form for visitors to enter credentials and `POST` data to the API to sign up or log in and receive an [access token](http://jwt.io). We also need to handle sign up and login errors as well as save to local storage to persist logins. Finally, we'll show a greeting and a log out link when the user is authenticated. 

When this step is complete, our app will look like this:

![Polymer register login app view](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_login.jpg)

### Creating the User Credentials Form

Open `/src/register-login.html`. This is our `register-login` element. We're going to use some more Polymer elements from the catalog, so let's start by installing [iron-input](https://elements.polymer-project.org/elements/iron-input) and [paper-input](https://elements.polymer-project.org/elements/paper-input):

```
bower install PolymerElements/iron-input PolymerElements/paper-input --save
```

Now we'll import these dependencies. We'll also import `iron-ajax`, `paper-button`, and `iron-localstorage`. We don't need to install `iron-localstorage` with Bower because it came packaged with the starter kit. 

> Note: You can check your `/bower_components` directory to see what other Polymer components are automatically installed.

The HTML imports for `register-login` should now look like this:

```html
<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="../bower_components/iron-ajax/iron-ajax.html">
<link rel="import" href="../bower_components/iron-localstorage/iron-localstorage.html">
<link rel="import" href="../bower_components/iron-input/iron-input.html">
<link rel="import" href="../bower_components/paper-input/paper-input.html">
<link rel="import" href="../bower_components/paper-button/paper-button.html">
<link rel="import" href="shared-styles.html">
```

First we'll set up the basic markup for the form with a username and password. Logging in and signing up require the same fields so we'll use the same form for both. 

> Aside: A potential future enhancement might be to split register and login into separate views and add a Confirm Password field when signing up.

Delete the lorem ipsum inside the `<div class="card">` element. We'll replace this with our code. We want to create two potential UIs for this area: one for if the user is authenticated and one for if they aren't. We'll start with the unauthenticated view, which is the register / login form.

We'll create a container for our unauthenticated UI and add input elements using [`iron-input`](https://elements.polymer-project.org/elements/iron-input) and [`paper-input-container`](https://elements.polymer-project.org/elements/paper-input?active=paper-input-container), which comes bundled with `paper-input`. The reason we aren't using `paper-input` by itself is because `iron-input` allows us to two-way bind input values. It also provides validation options. We won't do validation right now, but using this element provides more room for extensibility. Using `paper-input-container` applies Material Design styles to labels and inputs. This way we can utilize both the iron element utilities _and_ the paper element styles.

Our initial markup should look like this:

```html
<!-- register-login.html -->

<div class="card">
	<div id="unauthenticated">
		<h1>Log In</h1>

		<p><strong>Log in</strong> or <strong>sign up</strong> to access secret Chuck Norris quotes!</p>
		
		<paper-input-container>
			<label>Username</label>
			<input is="iron-input" id="username" type="text" bind-value="{{formData.username}}">
		</paper-input-container>

		<paper-input-container>
			<label>Password</label>
			<input is="iron-input" id="password" type="password" bind-value="{{formData.password}}">
		</paper-input-container>

		<div class="wrapper-btns">
			<paper-button raised class="primary" on-tap="postLogin">Log In</paper-button>
			<paper-button class="link" on-tap="postRegister">Sign Up</paper-button>
		</div>
	</div>	
</div>
```

We'll also add some local CSS in the `<style>` tags to support this markup:

```css
.wrapper-btns {
	margin-top: 15px;
}
paper-button.link {
	color: #757575;
}
```

Now we have a form, but it doesn't do anything. We'll wire it up with JS to take advantage of `iron-input` and bind the values to data that we can submit to the API. Let's create a property that holds an object for our form data:

```js
Polymer({
	is: 'register-login',
	
	properties: {
		formData: {
			type: Object,
			value: {}
		}
	}
```

[Polymer properties](https://www.polymer-project.org/1.0/docs/devguide/properties) are members of the element's public API and should be declared on the prototype. We'll set the default value of `formData` to an empty object so we can add properties to it simply by typing in the input fields once we set their bindings.

> Note: Why weren't we required to declare `quote` as a property in the `home-quotes` element? Because the fetched `quote` is not a member of the element's public API, did not need a default value or options. The `quote` property could be added as type `String` to `home-quotes` to no ill effect, but it was left off to demonstrate that Polymer will bind without it and there is no need to expose it to the element's API: we won't set the quote as an attribute when calling the `<home-quotes>` element.

We bound the `formData` object to the inputs in the HTML using `bind-value` attributes:

```html
<input is="iron-input" id="username" type="text" bind-value="{{formData.username}}">
...
<input is="iron-input" id="password" type="password" bind-value="{{formData.password}}">

```

This allows the data to flow between the markup and the JS.

### Submitting the Form with Ajax

We'll use `iron-ajax` again to post our form data to the API to register or log in users:

```html
<iron-ajax
	id="registerLoginAjax"
	method="post"
	content-type="application/json"
	handle-as="text"
	on-response="handleUserResponse"
	on-error="handleUserError"></iron-ajax>
```

We'll use the `POST` method and set the content type to JSON. We're going to handle the response as text because although a successful login returns JSON, a failure returns a string. This way we can easily parse a JSON string on success or handle plain text in case of an error.

There is no `url` attribute on our `iron-ajax` element this time. This is because we'll set the URL based on whether the user clicks "Log In" or "Sign Up". Let's add `on-tap` attributes to the two buttons to implement this:

```html
<paper-button raised class="primary" on-tap="postLogin">Log In</paper-button>
<paper-button class="link" on-tap="postRegister">Sign Up</paper-button>
```

Now we'll add the corresponding `postLogin` and `postRegister` event handlers to the JS. We also need to set the request body containing the form data when the user clicks a button to submit. Then we'll generate the Ajax request.

```js
...
properties: {
	formData: {
		type: Object,
		value: {}
	}
},

_setReqBody: function() {
	this.$.registerLoginAjax.body = this.formData;
},

postLogin: function() {
	this.$.registerLoginAjax.url = 'http://localhost:3001/sessions/create';
	this._setReqBody();
	this.$.registerLoginAjax.generateRequest();
},

postRegister: function() {
	this.$.registerLoginAjax.url = 'http://localhost:3001/users';
	this._setReqBody();
	this.$.registerLoginAjax.generateRequest();
}
```

### Handling API Responses

We're successfully `POST`ing to the API. Next we need to handle the API response. At this time, we have listener methods defined in the markup but not in the JS:

```html
<iron-ajax
	...
	on-response="handleUserResponse"
	on-error="handleUserError"></iron-ajax>
```

Let's add `handleUserResponse()` and `handleUserError()`:

```js
properties: {
	...
	storedUser: Object,
	error: String
},
...
handleUserResponse: function(event) {
	var response = JSON.parse(event.detail.response);

	if (response.id_token) {
		this.error = '';
		this.storedUser = {
			name: this.formData.username,
			token: response.id_token,
			loggedin: true
		};
	}

	// reset form data
	this.formData = {};
},

handleUserError: function(event) {
	this.error = event.detail.request.xhr.response;
}
```

We're adding two more properties: `storedUser` (object) to store name, token, and state of an authenticated user, and `error` (string) to display when the API returns a failure. Later, we'll put `storedUser` into local storage and access it in other areas of the app. We can use shorthand `property: Type` because we don't need any additional options set.

Next we'll handle a successful API response: `handleUserResponse()`. Recall that we're handling all responses as text, so on success, we need to parse the JSON. If a token is present, we'll clear any errors from previous failures, define the `storedUser` object and its properties, and reset `formData` to an empty object.

We've also defined a handler for errors: `handleUserError()`. When the sample API fails, it returns an error message as a string. We'll set the `error` property to this XHR response. You can console log the `event` parameter in these two handlers to become more familiar with its structure.

Now we have the error message but we're not displaying it to the user. We'd like to show something like this:

![Polymer register login app view](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_login-error.jpg)

Let's add some markup before the first form input to support this:

```html
<template is="dom-if" if="[[error]]">
	<p class="alert-error"><strong>Error:</strong> [[error]]</p>
</template>
```

Templates with `is="dom-if"` are [conditionally stamped](https://www.polymer-project.org/1.0/docs/devguide/templates#dom-if) when their `if` property is truthy. 

You can see an error message if you try to submit empty or invalid credentials to the API. Let's add some styling to make error messages more prominent. Add the following ruleset to the `register-login` element's local `<style>` tag:

```css
.alert-error {
	background: #ffcdd2;
	border: 1px solid #f44336;
	border-radius: 3px;
	color: #333;
	font-size: 14px;
	padding: 10px;
}
```

### Saving Data to Local Storage

To save our logged in users to local storage, add the [`iron-localstorage`](https://elements.polymer-project.org/elements/iron-localstorage) element near the top of our element markup:

```html
<iron-localstorage name="user-storage" value="{{storedUser}}"></iron-localstorage>
```

Now our app will persist users so they don't have to log in again after every refresh or return visit.

### Showing UI Based on Authentication State

We are now successfully authenticating, but there's no indication to the user that they're logged in. We'll hide the form and show a message upon successful authentication.

Add a `hidden` attribute to the `#authenticated` div:

```html
<div id="unauthenticated" hidden$="[[storedUser.loggedin]]">
```

We want `hidden` to have a binding and be conditionally applied. If we don't do this, its presence implies truthiness regardless of its value. In order to [bind to an attribute](https://www.polymer-project.org/1.0/docs/devguide/data-binding#attribute-binding), we need to add a `$` after the attribute name.

Next we want to show the user a logged-in UI if they're authenticated. Add another div below the `#unauthenticated` element:

```html
<div id="authenticated" hidden$="[[!storedUser.loggedin]]">
	<h2>Hello, [[storedUser.name]]!</h2>
	<p>You are currently logged in. You can access <a href="/secret-quotes">Secret Quotes</a>!</p>
</div>
```

Now when the user logs in, they won't see the form anymore and will see this greeting instead. However, we can take this one step further and redirect them to the Secret Quotes view on successful authentication.

### Redirecting After Authentication

To redirect the user to another view with Polymer app routing in place, we need to include the [`app-location`](https://elements.polymer-project.org/elements/app-route?active=app-location) element. This synchronizes browser location and application state and gives us access to a `route` object. 

Add `app-location` to the imports at the top of the file. It's already installed because it came bundled with the starter kit (we've seen it in `/src/my-app.html`):

```html
<link rel="import" href="../bower_components/app-route/app-location.html">
```

Now add the element:

```html
<app-location route="{{route}}"></app-location>
```

In our `handleUserResponse()` function, we can now set the `route.path` to the path we want to redirect to:

```js
handleUserResponse: function(event) {
	...
	if (response.id_token) {
		...
		// redirect to Secret Quotes
		this.set('route.path', '/secret-quotes');
	}
	...
},
```

> Note: Using `this.set('property.subproperty', ...)` instead of `this.property.subproperty =` ensures that [we're making observable changes](https://www.polymer-project.org/1.0/docs/devguide/data-system#make-observable-changes) to object subproperties.

### Making User Data Available Globally

What if we want to access and manipulate the authentication state of our user from other areas of the app? For instance, the header still says "Log In" even when the user is already authenticated. We should change this to a greeting and a "Log Out" button. We can also see "Secret Quotes" in the menu while logged out. This should be hidden from unauthenticated users. But most importantly, we need to use the authenticated user's token to access the protected API to get secret quotes.

Recall that `iron-localstorage` is bound to `storedUser` which is a property of the `register-login` element. Even though local storage is accessible globally, we don't have a simple way to be sure that changes are observed properly on all parents and children throughout the app.

Polymer 1.0 does not have an elegant, out-of-the-box solution to this problem at this time. This is one thing that any full-featured JS framework would make short work of, but it's important to remember that Polymer is _not_ an MV* framework: it's a library that helps us leverage web components.

To solve this, we're going to add an element called `app-data`. This element notifies instances when its data is changed.

Create a file in `/src` called `app-data.html`. Add the following code:

```js
<!-- app-data.html -->

<link rel="import" href="../bower_components/polymer/polymer.html">

<dom-module id="app-data">
	<script>
		(function() {
			var instances = [];
			var vars = Object.create(Polymer.Base);

			Polymer({
				is: 'app-data',
				
				properties: {
					data: {
						type: Object,
						value: '',
						notify: true,
						readonly: false,
						observer: '_data_changed'
					},
					key: String
				},

				created: function() {
					key = this.getAttribute('key');
					if (!key) {
						console.log(this);
						throw('app-data element requires key');
					}
					instances.push({key:key, instance:this});
				},

				detached: function() {
					key = this.getAttribute('key');
					var i = instances.indexOf({key:key, instance:this});
					if (i >= 0) {
						instances.splice(i, 1);
					}
				},

				_data_changed: function(newvalue, oldvalue) {
					key = this.getAttribute('key');
					if (!key) {
						throw('_data_changed: app-data element requires key');
					}
					vars.set(key, newvalue);

					// notify the instances with the correct key
					for (var i = 0; i < instances.length; i++) {
						if (instances[i].key == key) {
							instances[i].instance.notifyPath('data', newvalue);
						}
					}
				}
			});
		}());
	</script>
</dom-module>
```

> Note: To learn more about `app-data` and its origins, check out this [Stack Overflow question about global variables in Polymer 1.0](http://stackoverflow.com/questions/30849816/polymer-1-0-global-variables) and specifically, [this answer](http://stackoverflow.com/a/31771240).

In `/src/register-login.html`, import the new `app-data` dependency:

```html
<link rel="import" href="app-data.html">
```

Add the `app-data` element to the markup near the `iron-localstorage` element. We need to supply an identifying `key` and the `data` we want is, of course, the `storedUser` object.

```html
<app-data key="userData" data="{{storedUser}}"></app-data>
```

We can now add the `app-data` element to any other components that need access to this global data. All instances will be notified when the data is changed.

## Creating a Log Out Element

Now that we can register and authenticate users, we need a way for them to log out. We'd like this to be a component that can live in a couple of locations, so we're going to build a new element.

Create a new file: `/src/log-out.html`. Import Polymer, `paper-button`, and `app-data`:

```html
<!-- log-out.html -->

<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="../bower_components/paper-button/paper-button.html">
<link rel="import" href="app-data.html">
```

Now we'll scaffold our new element by adding `<dom-module id="log-out">`. We'll set up the `<template>`, `<style>`, and `<script>` tags as well. The `:host` styles should have no margin or padding.

```html
<!-- log-out.html -->
...
<dom-module id="log-out">
	<template>
		<style>
			:host {
				margin: 0;
				padding: 0;
			}
		</style>
		
		<!-- MARKUP GOES HERE -->
	</template>

	<script>
		(function() {
			Polymer({
				is: 'log-out'
			});
		}());
	</script>
</dom-module>

```

Here are our plans for the `log-out` element:

* Display a log out link in the app's global header when the user is authenticated.
* Display a log out button in the authenticated `register-login` view.
* When the link or button is clicked, clear the user's token and information from global app data.
* We want to call the element like this: `<log-out stored-user="{{storedUser}}"></log-out>` and be able to add an optional `link` attribute to display as a link rather than a button.

Keeping these requirements in mind, let's build out our element, starting with the markup:

```html
<!-- log-out.html -->
...
<app-data key="userData" data="{{storedUser}}"></app-data>

<template is="dom-if" if="{{!link}}">
	<paper-button raised on-tap="logout">Log Out</paper-button>
</template>

<template is="dom-if" if="{{link}}">
	<a on-tap="logout" href>Log Out</a>
</template>
```

This should look familiar as there are no new concepts here. We're accessing the `app-data` so that when we log out, changes to the data are set throughout the app. We'll check for a `link` property and if it's false, show a button. If it's true, show a link. Both the link and button will call the same `on-tap` handler, `logout()`.

> Note: You may have noticed that we didn't include `iron-localstorage`. Changes to `storedUser` in `log-out` use `app-data` to notify other instances which update `iron-localstorage`. In turn, local storage is retrieved by the parent upon app initialization and the property is then sent to the child `log-out` via its `stored-user` attribute.

Now we'll set up the JS to facilitate this:

```
// log-out.html

Polymer({
	is: 'log-out',
	properties: {
		storedUser: Object,
		link: {
			type: Boolean,
			value: false
		}
	},
	logout: function() {
		// remove user data
		this.storedUser = null;
	}
});
```

The `storedUser` object will be passed into the element from the parent but we'll need to manipulate it to perform logout. The `link` property will be true if it's present as an attribute on the `<log-out>` element. The default value of a boolean property must be set to false in order for it to function as an [attribute](https://www.polymer-project.org/1.0/docs/devguide/properties#configuring-boolean-properties) that can be configured by markup.

To log out, all we need to do is set the `storedUser` object to `null`.

Now let's finish up by adding some styles so our link and button look good. 

```css
/* paper-button.html */

paper-button {
	background: #f44336;
	color: #fff;
	font-weight: bold;
}
a {
	color: #fff;
	display: inline-block;
	font-size: 13px;
}
```

The link will display in the blue header area so the text should be white. If we need to add additional links in other contexts, we can always adjust the styling to add variables or other options.

Now that we have our `log-out` element, let's add it to the `register-login` view:

```html
<!-- register-login.html -->
<div id="authenticated" hidden$="[[!storedUser.loggedin]]">
	...
	<log-out stored-user="{{storedUser}}"></log-out>
</div>
```

Our authenticated `register-login` view now looks like this in the browser:

![Polymer register login app view with log out](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_logout.jpg)

Recall that after a successful login, users are redirected to the `secret-quotes` view. We'll also replace the "Log In" link in the header shortly--but the `/register-login` route is still accessible regardless. The user can access it via the URL or the browser Back button. If they hit this route while authenticated, they'll see this message and be able to log out.

## Fetching Secret Quotes

It's time to access the protected API to get secret quotes. When we're finished with this step, our app will look like this:

![Polymer register login app view with log out](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_secret-quotes.jpg)

Open `/src/secret-quotes.html` and add the following dependencies: `iron-ajax`, `iron-localstorage`, `paper-button`, and `app-data`. Clean up the contents of the `<div class="card">` element:

```html
<!-- secret-quotes.html -->

<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="../bower_components/iron-ajax/iron-ajax.html">
<link rel="import" href="../bower_components/iron-localstorage/iron-localstorage.html">
<link rel="import" href="../bower_components/paper-button/paper-button.html">
<link rel="import" href="app-data.html">
<link rel="import" href="shared-styles.html">
...
<div class="card">
	<h1>Secret Quotes</h1>
</div>
...
```

Add the `iron-localstorage` and `app-data` elements:

```html
<iron-localstorage 
	name="user-storage" 
	value="{{storedUser}}" 
	on-iron-localstorage-load="initStoredUser"></iron-localstorage>

<app-data key="userData" data="{{storedUser}}"></app-data>
```

We'll use the `on-iron-localstorage-load` event to get a quote automatically if an authenticated user enters the app on this page.

Next add `iron-ajax`:

```html
<iron-ajax 
	id="getSecretQuoteAjax"
	method="get"
	url="http://localhost:3001/api/protected/random-quote"
	handle-as="text"
	last-response="{{secretQuote}}"></iron-ajax>
```

This looks similar to the `iron-ajax` element we used to get public quotes in the `home-quotes` element except that we're not using the `auto` attribute. We'll add authorization to this request in the JS when we generate the request.

We'll display the quotes in the UI. We want to show authenticated users a greeting and private quotes. If an unauthenticated user accesses this route, we should show a message instructing them to log in:

![Polymer register login app view with log out](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_secret-quotes_unauth.jpg)

Add the following markup:

```html
<div class="card">
	<h1>Secret Quotes</h1>

	<div hidden$="[[!storedUser.loggedin]]">
		<p>Hello, [[storedUser.name]]! You have access to secret quotes:</p>
		<blockquote>[[secretQuote]]</blockquote>
		<paper-button class="primary" raised on-tap="getSecretQuote">Get a New Secret Quote</paper-button>
	</div>

	<p hidden$="[[storedUser.loggedin]]">You must <a href="/register-login">log in</a> to access secret quotes!</p>
</div>
```

We can use `hidden` because although the authenticated content is stamped in the template on initiation, unauthenticated users cannot access the protected quotes API.

> Note: Using `hidden` is much faster than creating and destroying elements with `dom-if`. Using `dom-if` can cause noticeable runtime latency. You can read more about this in the [dom-if Polymer docs](https://www.polymer-project.org/1.0/docs/devguide/templates#dom-if) (below the code example).

In the JS, add the `storedUser` property and functions to `initStoredUser()` and `getSecretQuote()`:

```js
Polymer({
	is: 'secret-quotes',
	properties: {
		storedUser: Object
	},
	initStoredUser: function() {
		// if entering site on the secret quotes page, verify if logged in and if so, preload a secret quote
		if (this.storedUser.loggedin) {
			this.getSecretQuote();
		}
	},
	getSecretQuote: function() {
		// add token authorization and generate Ajax request
	}
});
```

`getSecretQuote()` is executed when the user clicks the button to fetch a new quote from the API. Like `home-quotes`, we'll use the `generateRequest()` method, but first we need to provide authorization with the user's token. An `Authorization` header can be added to the request:

```js
...
getSecretQuote: function() {
	// add token authorization and generate Ajax request
	this.$.getSecretQuoteAjax.headers['Authorization'] = 'Bearer ' + this.storedUser.token;
	this.$.getSecretQuoteAjax.generateRequest();
}
```

Authenticated users can now get secret quotes!

## Header and Menu States

The last thing we'll do is improve the user experience a little bit.

When the user is authenticated, let's hide the Secret Quotes link in the menu sidebar and add a greeting and log out link in the header. 

Open `/src/my-app.html`.

Import `iron-localstorage`, `app-data`, and `log-out` dependencies and add the `<iron-localstorage>` and `<app-data>` elements to the DOM:

```html
<!-- my-app.html -->
...
<link rel="import" href="../bower_components/iron-localstorage/iron-localstorage.html">
<link rel="import" href="app-data.html">
<link rel="import" href="log-out.html">
...
<iron-localstorage name="user-storage" value="{{storedUser}}"></iron-localstorage>
<app-data key="userData" data="{{storedUser}}"></app-data>
```

### Hiding "Secret Quotes" Link in Menu

Locate the `<iron-selector>` element inside the `<app-drawer>`. Each `<a>` tag  needs to be wrapped in its own container element in order to be hidden and shown conditionally. You can read more about [iron-selector here](https://elements.polymer-project.org/elements/iron-selector).

Change the code to:

```html
<div name="home-quotes">
	<a href="/home-quotes">Home</a>
</div>
<div name="secret-quotes" hidden$="[[!storedUser.loggedin]]">
	<a href="/secret-quotes">Secret Quotes</a>
</div>
```

As you can see, we've moved the `name` attributes to the containing divs and added a `hidden` attribute to the Secret Quotes link.

### Authentication State in Header

We want our logged in user to see something like this in the app header:

![Polymer register login app view with log out](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/screenshot_quotes-header-auth.jpg)

Let's update the `<app-header>` to show the "Log In" link when the user is logged out and a greeting and the `log-out` element (with `link` attribute) when authenticated.

```html
<app-header condenses reveals effects="waterfall">
	<app-toolbar>
		...
		<a name="register-login" href="/register-login" hidden$="[[storedUser.loggedin]]">Log In</a>
		<div hidden$="[[!storedUser.loggedin]]">
			<span class="greeting">Hi [[storedUser.name]]!</span>
			<log-out stored-user="{{storedUser}}" link></log-out>
		</div>
	</app-toolbar>
</app-header>
```

Add the `storedUser` object to the Polymer properties in the JS:

```js
Polymer({
	is: 'my-app',
	properties: {
		...,
		storedUser: Object
	},
	...
```

Finally, we'll add some styles:

```css
...
app-header .greeting,
app-header a {
	color: #fff;
	font-size: 13px;
}
app-header .greeting {
	border-right: 1px solid rgba(255,255,255,.5);
	display: inline-block;
	padding-right: 6px;
}
...
```

We now have a functioning user state in the global header. When we log in or out, no matter what view we're on, the header and menu will update according to authentication status.

## Aside: Authenticating a Polymer App With Auth0

Let's explore authenticating a Polymer app with a more robust solution. We'll do a quick implementation of [Auth0's lock widget](https://auth0.com/docs/libraries/lock) to manage user identity. We'll leverage local storage and `app-data` again to ensure users aren't logged out unexpectedly. You can clone the full code from [this GitHub repo](https://github.com/auth0-blog/polymer-with-auth0).

![Polymer register login app view with log out](file:///Users/kimmaida-auth0/Documents/Auth0/Blog/Polymer/Blog%20Code%20Steps/step%201/auth0-lock.jpg)

### Configuring Your Auth0 Client

The first thing you'll need is an Auth0 account. Follow these simple steps to get started:

1. Sign up for a [free Auth0 account](https://auth0.com/signup).
2. In your **Auth0 Dashboard**, [create a new client](https://manage.auth0.com/#/clients/create). 
3. Name your new app and select "Single Page Web Applications". 
4. In the **Settings** section for your newly created app, add `http://localhost:8080` to the Allowed Callback URLs and Allowed Logout URLs.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above uses username/password database, Facebook, and Google.

### Setup and Dependencies

Create a new directory and `init` a fresh Polymer starter kit app, then `serve` it:

```
polymer init starter-kit
polymer serve --open
```

Create a new file in the `/src` folder for `app-data.html`. Follow the instructions from earlier in this tutorial to populate this element file, or [grab the code from the repo here](https://github.com/auth0-blog/polymer-with-auth0/blob/master/src/app-data.html).

### Creating an Auth0 Lock Element

Create a new file: `/src/auth0-login.html`. This will be our `auth0-login` custom element.

> **Important note:** We should _not_ name this element `auth0-lock` because doing so will cause style conflicts in browsers that don't fully support shadow DOM. Instead of encapsulating with shadow DOM, a CSS class matching the element name is applied to all child nodes. The Auth0 Lock widget itself has a class called `.auth0-lock`, so this causes styling conflicts. We'll name the custom element `auth0-login` to ensure uniqueness.

Our `auth0-login` element will include the following: 

* An element containing [lock.js v10](https://cdn.auth0.com/js/lock/10.2/lock.min.js).
* A link with event handler to open the Lock widget.
* Properties to pass Auth0 configuration into the element.
* A greeting with profile image and log out button when user is authenticated.

Let's create the dependency element: `/src/lockjs.html`. Create a new file and add the following:

```html
<!-- lockjs.html -->
<script src="https://cdn.auth0.com/js/lock/10.2/lock.min.js"></script>
```

This is best practice in Polymer for loading external dependencies. This way, we can use HTML import to load this file and be certain that it will only be imported once. If it's called again, it will be deduped.

Now we can build our `auth0-login` element:

```html
<link rel="import" href="../bower_components/polymer/polymer.html">
<link rel="import" href="../bower_components/iron-localstorage/iron-localstorage.html">
<link rel="import" href="app-data.html">
<link rel="import" href="lockjs.html">

<dom-module id="auth0-login">
	<template>
		<style>
			:host {
				color: #fff;
				font-size: 13px;
			}
			.greeting {
				border-right: 1px solid rgba(255,255,255,.5);
				display: inline-block;
				padding-right: 6px;
			}
			.greeting img {
				border-radius: 100px;
				display: inline-block;
				height: 24px;
				margin-right: 4px;
				vertical-align: middle;
				width: 24px;
			}
			a {
				color: #fff;
			}
		</style>

		<iron-localstorage 
			name="userData" 
			value="{{storedUser}}" 
			on-iron-localstorage-load="_setProfileImg"></iron-localstorage>
		<app-data key="userData" data="{{storedUser}}"></app-data>

		<a hidden$="[[storedUser.loggedin]]" on-tap="showLock" href>Log In</a>

		<div hidden$="[[!storedUser.loggedin]]">
			<span class="greeting"><img src="[[profileImgSrc]]">[[storedUser.profile.nickname]]</span>
			<a on-tap="logOut" href>Log Out</a>
		</div>
	</template>

	<script>
		(function() {
			Polymer({
				is: 'auth0-login',
				properties: {
					clientId: String,
					domain: String,
					redirectUrl: String,
					storedUser: Object,
					auth0Lock: Object,
					profileImgSrc: {
						type: String,
						value: ''
					}
				},
				ready: function() {
					var _self = this;
					var _lockOptions = {
						auth: {
							redirectUrl: _self.redirectUrl,
							responseType: 'token'
						}
					};

					// create Lock instance
					_self.auth0Lock = new Auth0Lock(_self.clientId, _self.domain, _lockOptions);

					_self.auth0Lock.on('authenticated', function(authResult) {
						// save token
						_self.set('storedUser', { token: authResult.idToken });

						// get user's profile using token
						_self.auth0Lock.getProfile(authResult.idToken, function(error, profile) {
							if (error) {
								console.error('Error getting profile:', error);
								return;
							}

							_self.set('storedUser.loggedin', true);
							_self.set('storedUser.profile', profile);
							_self.set('profileImgSrc', profile.picture);
						});
					});
				},
				_setProfileImg: function() {
					this.set('profileImgSrc', this.storedUser.profile.picture);
				},
				showLock: function() {
					this.auth0Lock.show();
				},
				logOut: function() {
					this.set('storedUser', null);
					this.set('profileImgSrc', '');
				}
			});
		}());
	</script>
</dom-module>
```

### Adding Lock to the App

Open `/src/my-app.html` and import `iron-localstorage`, `app-data`, and `auth0-login` dependencies:

```html
<!-- my-app.html -->
...
<link rel="import" href="../bower_components/iron-localstorage/iron-localstorage.html">
<link rel="import" href="app-data.html">
<link rel="import" href="auth0-login.html">
```

