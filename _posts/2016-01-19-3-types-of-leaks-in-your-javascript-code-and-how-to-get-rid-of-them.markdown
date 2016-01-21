---
layout: post
title: "Four Types of Leaks in Your JavaScript Code and How to Get Rid Of Them"
description: "Learn how memory can be leaked in JavaScript and what can be done to solve it!"
date: 2016-01-22 13:30
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/dombench/logo_fist.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- javascript
- memory leaks
- dom leaks
- finding memory leaks
---

In this article we will explore common types of memory leaks in client-side JavaScript code. We will also learn how to use the Chrome Development Tools to find them. Read on!

-----

## Introduction
Memory leaks are a problem every developer has to face eventually. Even when working with memory-managed languages there are cases where memory can be leaked. Leaks are the cause of whole class of problems: slowdowns, crashes, high latency, and even problems with other applications.

### What are memory leaks?
In essence, memory leaks can be defined as memory that is not required by an application anymore that for some reason is not returned to the operating system or the pool of free memory. Programming languages favor different ways of managing memory. These ways may reduce the chance of leaking memory. However, whether a certain piece of memory is unused or not is actually an [undecidable problem](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management#Release_when_the_memory_is_not_needed_anymore). In other words, only developers can make it clear whether a piece of memory can be returned to the operating system or not. Certain programming languages provide features that help developers do this. Others expect developers to be completely explicit about when a piece of memory is unused.

### Memory management in JavaScript
JavaScript is one of the so called *garbage collected* languages. Garbage collected languages help developers manage memory by periodically checking which previously allocated pieces of memory can still be "reached" from other parts of the application. In other words, garbage collected languages reduce the problem of managing memory from "what memory is still required?" to "what memory can still be reached from other parts of the application?". The difference is subtle, but important: while only the developer knows whether a piece of allocated memory will be required in the future, unreachable memory can be algorithmically determined and marked for return to the OS.

> Non-garbage-collected languages usually employ other techniques to manage memory: explicit management, where the developer explicitly tells the compiler when a piece of memory is not required; and reference counting, in which a use count is associated with every block of memory (when the count reaches zero it is returned to the OS). These techniques come with their own trade-offs (and potential causes for leaks).

## Leaks in JavaScript
The main cause for leaks in garbage collected languages are *unwanted references*. To understand what unwanted references are, first we need to understand how a garbage collector determines whether a piece of memory can be reached or not.

### Mark-and-sweep
Most garbage collectors use an algorithm known as *mark-and-sweep*. The algorithm consists of the following steps:

1. The garbage collector builds a list of "roots". Roots usually are global variables to which a reference is kept in code. In JavaScript, the "window" object is an example of a global variable that can act as a root. The window object is always present, so the garbage collector can consider it and all of its children to be always present (i.e. not garbage).
2. All roots are inspected and marked as active (i.e. not garbage). All children are inspected recursively as well. Everything that can be reached from a root is not considered garbage.
3. All pieces of memory not marked as garbage can now be considered garbage. The collector can now free that memory and return it to the OS.

Modern garbage collectors improve on this algorithm in different ways, but the essence is the same: reachable pieces of memory are marked as such and the rest is considered garbage.

Unwanted references are references to pieces of memory that the developer knows he or she won't be needing anymore but that for some reason are kept inside the tree of an active root. In the context of JavaScript, unwanted references are variables kept somewhere in the code that will not be used anymore and point to a piece of memory that could otherwise be freed. Some would argue these are developer mistakes.

So to understand which are the most common leaks in JavaScript, we need to know in which ways references are commonly forgotten.

## The Three Types of Common JavaScript Leaks
### 1: Accidental global variables
One of the objectives behind JavaScript was to develop a language that looked like Java but was permissive enough to be used by beginners. One of the ways in which JavaScript is permissive is in the way it handles undeclared variables: a reference to an undeclared variable creates a new variable inside the *global* object. In the case of browsers, the global object is `window`. In other words:

```javascript
function foo(arg) {
    bar = "this is a hidden global variable";
}
```

Is in fact:

```javascript
function foo(arg) {
    window.bar = "this is an explicit global variable";
}
```

If `bar` was supposed to hold a reference to a variable only inside the scope of the `foo` function and you forget to use `var` to declare it, an unexpected global variable is created. In this example, leaking a simple string won't do much harm, but it could certainly be worse.

Another way in which an accidental global variable can be created is through `this`:

```javascript
function foo() {
    this.variable = "potential accidental global";
}

// Foo called on its own, this points to the global object (window)
// rather than being undefined.
foo();
```

> To prevent these mistakes from happening, add `'use strict';` at the beginning of your JavaScript files. This enables a stricter mode of parsing JavaScript that prevents accidental globals.

#### A note on global variables
Even though we talk about unsuspected globals, it is still the case that much code is littered with explicit global variables. These are by definition noncollectable (unless nulled or reassigned). In particular, global variables used to temporarily store and process big amounts of information are of concern. If you must use a global variable to store lots of data, make sure to null it or reassign it after you are done with it. One common cause for increased memory consumption in connection with globals are *caches*. Caches store data that is repeatedly used. For this to be efficient, caches must have an upper bound for its size. Caches that grow unbounded can result in high memory consumption because their contents cannot be collected.

### 2: Forgotten timers or callbacks
The use of `setInterval` is quite common in JavaScript. Other libraries provide observers and other facilities that take callbacks. Most of these libraries take care of making any references to the callback unreachable after their own instances become unreachable as well. In the case of setInterval, however, code like this is quite common:

```javascript
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        // Do stuff with node and someResource.
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```

This example illustrates what can happen with dangling timers: timers that make reference to nodes or data that is no longer required. The object represented by `node` may be removed in the future, making the whole block inside the interval handler unnecessary. However, the handler, as the interval is still active, cannot be collected (the interval needs to be stopped for that to happen). If the interval handler cannot be collected, its dependencies cannot be collected either. That means that `someResource`, which presumably stores sizable data, cannot be collected either.

For the case of observers, it is important to make explicit calls to remove them once they are not needed anymore (or the associated object is about to be made unreachable). In the past, this used to be particularly important as certain browsers (Internet Explorer 6) were not able to manage cyclic references well (see below for more info on that). Nowadays, most browsers can and will collect observer handlers once the observed object becomes unreachable, even if the listener is not explicitly removed. It remains good practice, however, to explicitly remove these observers before the object is disposed. For instance:

```javascript
var element = document.getElementById('button');

function onClick(event) {
    element.innerHtml = 'text';
}

element.addEventListener('click', onClick);
// Do stuff
element.removeEventListener('click', onClick);
element.parentNode.removeChild(element);
// Now when element goes out of scope,
// both element en onClick will be collected even in old browsers that don't
// handle cycles well.
```

#### A note about object observers and cyclic references
Observers and cyclic references used to be the bane of JavaScript developers. This was the case due to a bug (or design decision) in Internet Explorer's garbage collector. Old versions of Internet Explorer could not detect cyclic references between DOM nodes and JavaScript code. This is typical of an observer, which usually keeps a reference to the observable (as in the example above). In other words, every time an observer was added to a node in Internet Explorer, it resulted in a leak. This is the reason developers started explicitly removing handlers before nodes or nulling references inside observers. Nowadays, modern browsers (including Internet Explorer and Microsoft Edge) use modern garbage collection algorithms that can detect these cycles and deal with them correctly. In other words, it is not strictly necessary to call `removeEventListener` before making a node unreachable.

Frameworks and libraries such as *jQuery* do remove listeners before disposing of a node (when using their specific APIs for that). This is handled internally by the libraries and makes sure that no leaks are produced, even when run under problematic browsers such as the old Internet Explorer.

### 3: Out of DOM references
Sometimes it may be useful to store DOM nodes inside data structures. Suppose you want to rapidly update the contents of several rows in a table. It may make sense to store a reference to each DOM row in a dictionary or array. When this happens, two references to the same DOM element are kept: one in the DOM tree and the other in the dictionary. If at some point in the future you decide to remove these rows, you need to make both references unreachable.

```javascript
var elements = {
    button: document.getElementById('button'),
    image: document.getElementById('image'),
    text: document.getElementById('text')
};

function doStuff() {
    image.src = 'http://some.url/image';
    button.click();
    console.log(text.innerHTML);
    // Much more logic
}

function removeButton() {
    // The button is a direct child of body.
    document.body.removeChild(document.getElementById('button'));

    // At this point, we still have a reference to #button in the global
    // elements dictionary. In other words, the button element is still in
    // memory and cannot be collected by the GC.
}
```

An additional consideration for this has to do with references to inner or leaf nodes inside a DOM tree. Suppose you keep a reference to a specific cell of a table (a `<td>` tag) in your JavaScript code. At some point in the future you decide to remove the table from the DOM but keep the reference to that cell. Intuitively one may suppose the GC will collect everything but that cell. In practice this won't happen: the cell is a child node of that table and children keep references to their parents. In other words, the reference to the table cell from JavaScript code causes the whole table to stay in memory. Consider this carefully when keeping references to DOM elements.

### 4: Closures
A key aspect of JavaScript development are closures: anonymous functions that capture variables from parent scopes. Meteor developers [found a particular case](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak) in which due to implementation details of the JavaScript runtime, it is possible to leak memory in a subtle way:

```javascript
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing)
      console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log(someMessage);
    }
  };
};
setInterval(replaceThing, 1000);
```

This snippet does one thing: every time `replaceThing` is called, `theThing` gets a new object which contains a big array and a new closure (`someMethod`). At the same time, the variable `unused` holds a closure that has a reference to `originalThing` (`theThing` from the previous call to `replaceThing`). Already somewhat confusing, huh? The important thing is that once a scope is created for closures that are in the same parent scope, that scope is shared. In this case, the scope created for the closure `someMethod` is shared by `unused`. `unused` has a reference to `originalThing`. Even though `unused` is never used, `someMethod` can be used through `theThing`. And as `someMethod` shares the closure scope with `unused`, even though `unused` is never used, its reference to `originalThing` forces it to stay active (prevents its collection). When this snippet is run repeatedly a steady increase in memory usage can be observed. This does not get smaller when the GC runs. In essence, a linked list of closures is created (with its root in the form of the `theThing` variable), and each of these closures' scopes carries an indirect reference to the big array, resulting in a sizable leak.

> This is an implementation artifact. A different implementation of closures that can handle this matter is conceivable, as explained in the [Meteor blog post](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak).

## Unintuitive behavior of Garbage Collectors
Although Garbage Collectors are convenient they come with their own set of trade-offs. One of those trade-offs is *nondeterminism*. In other words, GCs are unpredictable. It is not usually possible to be certain when a collection will be performed. This means that in some cases more memory than is actually required by the program is being used. In other cases, short-pauses may be noticeable in particularly sensitive applications. Although nondeterminism means one cannot be certain when a collection will be performed, most GC implementations share the common pattern of doing collection passes during allocation. If no allocations are performed, most GCs stay at rest. Consider the following scenario:

1. A sizable set of allocations is performed.
2. Most of these elements (or all of them) are marked as unreachable (suppose we null a reference pointing to a cache we no longer need).
3. No further allocations are performed.

In this scenario, most GCs will not run any further collection passes. In other words, even though there are unreachable references available for collection, these are not claimed by the collector. These are not strictly leaks, but still result in higher-than-usual memory usage.

Google provides an excellent example of this behavior in their [JavaScript Memory Profiling docs, example #2](https://developer.chrome.com/devtools/docs/demos/memory/example2).

## Chrome Memory Profiling Tools Overview
Chrome provides a nice set of tools to profile memory usage of JavaScript code. There two essential views related to memory: the *timeline* view and the *profiles* view.

### Timeline view
![Google Dev Tools Timeline in Action](https://cdn.auth0.com/blog/jsleaks/timeline.png)
The timeline view is essential in discovering unusual memory patterns in our code. In case we are looking for big leaks, periodic jumps that do not shrink as much as they grew after a collection are a red flag. In this screenshot we can see what a steady growth of leaked objects can look like. Even after the big collection at the end, the total amount of memory used is higher than at the beginning. Node counts are also higher. These are all signs of leaked DOM nodes somewhere in the code.

### Profiles view
![Google Dev Tools Profiles in Action](https://cdn.auth0.com/blog/jsleaks/profiles.png)
This is the view you will spend most of the time looking at. The profiles view allows you to get a snapshot and compare snapshots of the memory use of your JavaScript code. Different types of lists are available, but the most relevant ones for our task are the summary list and the comparison list.

The summary view gives us an overview of the different types of object allocated and their aggregated size: shallow size (the sum of all objects of a specific type) and retained size (the shallow size plus the size of other objects retained due to this object). It also gives us a notion of how deep an object is in relation to its GC root (the distance)

TODO

## Examples: Finding Leaks Using Chrome

TODO

## Further reading
- [Memory Management - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [JScript Memory Leaks - Douglas Crockford (old, in relation to Internet Explorer 6 leaks)](http://javascript.crockford.com/memory/leak.html)
- [JavaScript Memory Profiling - Chrome Developer Docs](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)
- [Memory Diagnosis - Google Developers](https://developers.google.com/web/tools/chrome-devtools/profile/memory-problems/memory-diagnosis)
- [An Interesting Kind of JavaScript Memory Leak - Meteor blog](http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak)
- [Grokking V8 closures](http://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html)

## Conclusion
Memory leaks can and do happen in garbage collected languages such as JavaScript. These can go unnoticed for some time, and eventually they can wreak havoc. Memory profiling tools are essential in finding memory leaks. Profiling runs are essential for mid or big-sized applications and should be part of the development cycle, don't be afraid to start doing this if you want the best possible user experience. Hack on!
