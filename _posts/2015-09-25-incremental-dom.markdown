---
layout: post
title: "Incremental DOM 101: What is it and why I should care?"
description: Learn how Incremental DOM works and how it compares to Glimmer and Virutal DOM
date: 2015-10-23 19:00
author:
  name: Pablo Terradillos
  url: https://twitter.com/tehsis
  mail: tehsis@auth0.com
  avatar: https://s.gravatar.com/avatar/647b1eea820b3fc8a5aee0383930b888
design:
  bg_color: "#232228"
  image_bg_color: "transparent"
  image: https://cdn.auth0.com/docs/img/incremental-post-picture.png
tags:
- virtual-DOM
- incremental-dom
- react
- glimmer
- ember
- view
related:
- 2015-10-09-whats-the-fuss-with-googles-accelerated-mobile-pages-amp
- 2015-10-14-7-things-you-should-know-about-web-assembly
- 2016-01-07-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest
---

## Introduction

Hitting the DOM is probably the most expensive operation that most modern web applications must perform, and much effort has gone into providing solutions to solve this problem.

Without a doubt, the one that has gained the most popularity in recent times is the so called _virtual DOM_. Introduced by Facebook's React library, it basically builds an in-memory representation of the DOM. On every update made that is made to the UI, it will create a new representation, diff against it, and only hit those nodes that need to be changed in the _real_ DOM.

Ember's implementation is called _Glimmer_, and it is a substantial improvement to React's. Instead of building a complete representation of the _DOM Tree_, it just takes the elements from a Handlebars template that are dynamic and builds a _tree of streams_, reducing the amount of memory needed to keep them.

Google is working on a different approach with [Incremental DOM](https://github.com/google/incremental-dom) (IDOM). We can say that it has the same base as _virtual DOM_, but with a different approach: **instead of building a representation of the _DOM tree_ in memory, it just uses the real DOM to diff against new trees.**

While React provides JSX as a template engine and Glimmer relies on HTMLBars, **IDOM** is just a simple API for building DOM elements and is not intended to be used directly but as a compilation target for template engines.

In this article, we're going to explore the simple Incremental DOM API by building a library to work with it, along with a functional to-do app.

## Working with Incremental DOM (IDOM)

The IDOM API just consists of four functions for building DOM elements:

* `elementOpen`  - Which corresponds to an opening tag (e.g. `<div>`)
* `elementClose` - Which corresponds to a closing tag (e.g. `</div>`)
* `elementVoid`  - Which corresponds to self-closing tags (e.g. `<input />`)
* `text`         - Which corresponds to text nodes.

So, imagine that we want to produce the following output:

```html
  <div class="foo">
      Hello world!
  </div>
```

The corresponding IDOM function will be:

```js
import ID from 'incremental-dom'

function renderHello() {
  ID.elementOpen('div', null, ['class', 'foo'], null);
  ID.text('Hello world!');
  ID.elementClose('div');
}
```

It should be clarified that `elementOpen` receives three extra parameters besides the tag's name. It also accepts the `key` that will identify the element (we will come back to this later), an array of _dynamic properties_, and another one of _static properties_ (i.e. the ones that are not intended to be changed). Both arrays consists of property-value pairs.

Finally, IDOM provides a `patch` function that will walk our current DOM, diff it against the DOM we want to insert, and finally modify just those elements that need to be modified.

So, if we want to render the previous "DOM declaration" into our app we need to do

```js
patch(document.body, renderHello);
```

And that's it! All you need to know is that `patch` receives an extra parameter that will be passed as an argument of the render function, and you can say to all your coulleages that you know Incremental DOM.

That was a simple example, but the real power comes when we have a DOM structure that constantily needs to be changed. Lets build a _real app_ to see how it works.

## Making IDOM friendlier

The API that IDOM provides makes it really simple to target a custom template engine or any other more expresive API. Lets build something to write our components in a more declarative way.

Taking a look at the HTML, we know that each element can contain text or other elements, so lets build a recursive function to allow that using JavaScript. The final result will be an API that allow us to write IDOM components like the following:

```js
ul([
  li('one'),
  li('two'),
  li('three')
], null, ['class', 'foo']).renderTo(document.body);
```

This will render into our body:

```html
  <ul class="foo">
    <li>one</li>
    <li>two</li>
    <li>three</li>
  </ul>
```

Simpler, right?

We want our elements to be capable of receiving one or more elements as children or even simple strings (text nodes) just as in regular HTML. So lets start building a class to represent this structure:

```js
import ID from 'incremental-dom';

class EL {
  constructor(tag, content, key, dynProps, staticProps) {
    // We want to hold local references to element's props
    this.tag = tag;
    this.content = content;

    // We are going to implement a _private_ TEXT class to provide the same interface
    // we have for our elements to Text Nodes.
    // So if we pass a string as an element, we just convert it to this class.
    if ('string' === typeof this.content) {
      this.content = new TEXT(this.content);
    }

    // We allow the users to pass a single element as a child.
    if (!Array.isArray(this.content)) {
      this.content = [this.content];
    }

    this.key = key;
    this.dynProps = dynProps;
    this.staticProps = staticProps;
  }
}
```

In this code, we convert strings to a `TEXT` class so we can have the same interface on Text Nodes as we do in regular elements. Lets implement it:

```js
// ...

class TEXT {
  constructor(content) {
    this.content = content;
  }

  render() {
    ID.text(this.content);
  }
}
```

finally, the render function for our EL class can be written as follows

```js
//...
class EL {
  // ...

  render() {
    // Passing a `null` content, we can assume that we're creating a
    // self closing tag (e.g. `<input />`).
    if (null === this.content) {
      ID.elementVoid(this.tag, this.key, this.props);
      return;
    }

    ID.elementOpen(this.tag, this.key, this.props);

    // Since we have `normalized` our elements to
    // always have the same interface, we can just walk
    // throught them and call it `render` method.
    this.content.forEach((c) => c.render());

    ID.elementClose(this.tag);
}
```

Finally, we need a way to `patch` our element to the DOM:

```js
//...
class EL {
  //...

  renderTo(container) {
    ID.patch(container, this.render.bind(this));
  }
}
```

To make things easier, lets create _builder functions_ so we can just call the elements by its name to construct them (i.e. `div('foobar');`)


```js

// We build helpers function for each DOM tag (reduced to those we're going to need in our up to make it simpler)
let elements = ['div', 'span', 'ul', 'li', 'h1', 'h4'].reduce((prev, tag) => {
  prev[tag] = (elms, key, props) => {
    return new EL(tag, elms, key, props);
  }

  return prev;
}, {});

// we export this elements so we can use them as a module in our project.
export default elements;
```

I have published this as a package called _charata_ that you can find on npm (`npm i charata`). You can take a look at its repository on [Charata's Github repo](https://github.com/auth0/charata).

## Working with DOM

Lets start building our todo app by writing our HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Incremental TO-DO</title>
</head>
<body>
 <form id="add-todo">
  <input type="text" name="new-item" />
 </form>

  <div id="todo">
  </div>

  <script type="text/javascript" src="incremental-todo.js"></script>
</body>
</html>
```

As you can see, I've put a form element with an input inside in "plain" html and left a `#todo` element where we're going to render our _to-do component_. This is just to emphasize the flexibility of working with static html and our recently created library, but you can create a custom component for the `form` as well.

Inside our `incremental-todo.js` file, we're going to create a `class` to represent our todo list. Objects from this `class` should be capable of:

  * Adding a new item to the list.
  * Removing an item from the list.

On every list mutation, we want to re-render our list (which is going to be represented with a component created with our previous helper).

```js
export default class TodoList {
  constructor() {
    this.list = {};
  }

  /**
   * Adds a new item to the list
   *
   * @param {string} text todo-item's text
   */
  addItem(text) {
    var idx = Date.now();
    this.list[idx] = text;
    this.render();
  }

  /**
   * Removes an item from the list.
   *
   * @param {string} idx id of the element to remove
   */
  removeItem(idx) {
    delete this.list[idx];
    this.render();
  }
 }
```

We haven't yet used anything from IDOM or our custom library and the `render` function is called on every mutation of the list. We're going to implement it later, but for now, just note that we have an `id` attribute for each item. This is what we're going to use to identify each individual to-do item and provide it to IDOM (the second parameter of `elementOpen`).

But before the real fun, lets attach an event handler to our form so we can add elements to the list:

```js
let form = document.getElementById('add-todo');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  let input = form.elements.namedItem('new-item');
  myList.addItem(input.value);
  input.value = '';
});
```

Great! we're adding elements to our list. To render them to the DOM, we need to implement the `render` function from our `TodoList` class.

```js
 //...
 render() {
   if (this.list.length) {
     ul(Object.keys(this.list).map((idx) => {
       li(this.list[idx], idx, ['data-idx', idx]);
     }), null).renderTo(this.container);
   } else {
     div('Hooray! you are free!', null, ['class', 'center']).renderTo(this.container);
   }
 }
```

Note the `idx` that we've passed to each `li` element. This is what IDOM is going to use to identify elements when we're rendering collections (similar to the `key` property in React).
We're rendering it as a `data-attribute` so we can add an event handler to each of them and identify which is the one we want to delete.

```js
let liElements = document.getElementsByTagName('li');

Array.prototype.forEach.call(liElements, (liEl) => {
  liEl.addEventListener('click', (ev) => {
  ev.preventDefault();
  let idx = LiEl.dataset.idx;
  this.removeItem(idx);
});
```

Feel free to have a look at the [final implementation](http://auth0.github.io/incremental-todo/) of the todo app.

Fire up your inspector and note that even though we're telling our component to re-render itself every time an item is added or deleted, IDOM takes care of re-rendering just the item that changes:

![Incremental DOM in action](https://cdn.auth0.com/docs/img/incremental-dom.gif)

## Conclusion

The Incremental DOM approach seems to not be as fast as _virtual DOM_ based implementations. However, IDOM uses less memory since it doesn't need to mantain a _live_  representation of the DOM. Rather, it uses the _real DOM_ to walk and compare against the new *state*. This is great for underpowered devices like low-end phones.

IDOM's simple API makes it really powerful for targeting template engines. Google is working on using it as a backend for [Closure Templates](https://developers.google.com/closure/templates/) and there's also an implementation of React's JSX syntax using a [Babel plugin](https://github.com/babel-plugins/babel-plugin-incremental-dom) so we can expect a lot of other template engines to start using it in the short term.

In Auth0 we take performance as a primary goal for each of our products. We are investing a lot of time analyzing view engines. We recently released [Lock Passwordless](https://github.com/auth0/lock-passwordless) which uses React and we're exploring integrate Incremental DOM on some of our current products.
We also have an SDK to use [Auth0 with React](https://github.com/auth0/auth0-react)

To learn more about it, you can take a look at the [Incremental DOM repo](https://github.com/google/incremental-dom).

## Aside: Authentication is Easy with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social (Facebook, Github, Twitter, etc.), enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.
