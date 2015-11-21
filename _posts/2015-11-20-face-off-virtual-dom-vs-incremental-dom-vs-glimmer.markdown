---
layout: post
title: "React Virtual DOM vs Incremental DOM vs Ember’s Glimmer: Fight"
description: "Take a look at competing DOM manipulation libraries and find out which one is faster with a performance benchmark!"
date: 2015-11-20 10:00
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
- ember
- ember.js
- react.js
- react
- dom
- virtual dom
- incremental dom
- javascript
- glimmer
- benchmark
---

In this post we will explore three technologies to build dynamic DOMs. We will also run benchmarks and find out which one is faster. At the end we will share with you why we choose one of them for our projects. Read on!

-----

## Introduction
There are many [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) manipulation frameworks and libraries. Among these, three have been the center of the attention due to their focus on performance: [React.js](https://facebook.github.io/react/), [Ember.js](http://emberjs.com/) and, more recently, [Incremental DOM](https://github.com/google/incremental-dom). While React and Ember handle much more than just DOM building/update, Incremental DOM focuses only on building DOM trees and allowing dynamic updates. We will now explore these libraries and find out which one is faster.

![DOM tree](https://cdn.auth0.com/blog/dombench/domtree.png)

Before getting into the details, if you are not a web developer, you might be asking yourself what exactly *DOM manipulation* is. Web sites are built as trees of different elements. These elements are defined in the HTML spec. By composing these elements a developer can create arbitrarily complex web sites. The DOM is the abstract representation of a website as a tree of HTML elements. It is defined by a [W3C spec](http://www.w3.org/TR/DOM-Level-2-Core/introduction.html) and implemented by all major browsers.

Besides aiding in binding the data model to the view, these libraries help in doing updates to DOM **efficiently**. A series of updates that would normally be performed by manually issuing a series of DOM API calls can be automatically batched into a single call (or a reduced set of calls). For instance, suppose the logic behind an update to the site requires that you:

1. Remove an element
2. Add a new element
3. Change a property of the added element

Directly issuing DOM API calls for doing changes such as these will result in intermediate repaints and reflows of the content. These are expensive operations. By working on a virtual model these steps can be flattened into one.

### Templates
Templates are a popular way of building DOM trees. With templates a developer can use a specific template syntax that tells a template compiler how to turn that into a DOM tree (or HTML document). Templates can look like an extension of HTML, or be completely different. 

Not every library in this post favors the use of templates. For instance, React favors the use of JSX: an extension of Javascript (in the form of a precompiler) that allows easy insertion of HTML-like snippets in Javascript code. Ember, on the other hand, favors the use of [Handlebars](http://guides.emberjs.com/v1.10.0/templates/handlebars-basics/), a template language.

Incremental DOM does not favor any particular template engine. However, being a Google sponsored project, a [Closure templates](https://github.com/google/closure-templates/) backend is being developed. Incremental DOM can also be used with [superviews.js](https://github.com/davidjamesstone/superviews.js), [starplate](https://github.com/littlstar/starplate) and even [JSX](https://github.com/babel-plugins/babel-plugin-incremental-dom).

## React.js' Virtual DOM
*Virtual DOM* is the name React developers gave to their DOM manipulation engine. *Virtual DOM* provides a series of Javascript calls that tell the library how to build an **in-memory DOM tree** and how to update it when data bound to it changes. The central piece of Virtual DOM is its **smart diffing algorithm**: once the differences in the model have been mapped to the in-memory copy of the DOM, the algorithm finds the **minimum number of operations required to update the real DOM**. This results in two copies of the in-memory DOM being present during the diffing process.

![React.js' Virtual DOM](https://cdn.auth0.com/blog/dombench/reactdom.png)

> Disclaimer: some of the graphics in this post are based on the ones found in this [excellent post explaining DOM manipulation libraries](http://teropa.info/blog/2015/03/02/change-and-its-detection-in-javascript-frameworks.html)

#### Pros
- Fast and efficient "diffing" algorithm
- Multiple frontends (JSX, hyperscript)
- Lightweight enough to run on mobile devices
- Lots of traction and mindshare
- Can be used without React (i.e. as an independent engine)

#### Cons
- Full in-memory copy of the DOM (higher memory use)
- No differentiation between static and dynamic elements \*

\* React has [recently implemented](https://github.com/facebook/react/issues/3226) functionality that detects constants and reduces the number of elements that need to be checked for updates.

## Ember.js' Glimmer
*Glimmer* is the name for Ember.js' latest rendering engine. Glimmer is the result of Ember's developers trying to integrate the benefits of React's Virtual DOM engine into Ember while maintaining API compatibility. Do note that Glimmer is a full rewrite of Ember's rendering engine and in no way shares code with Virtual DOM.

Glimmer differentiates between **static** and **dynamic** components, thus reducing the number of elements that need to be checked when looking for changes. This differentiation can be achieved thanks to the expressiveness of Handlerbar's templates.

Another key difference between Glimmer and other solutions lies in the way nodes are stored and compared. Glimmer stores nodes as simple stream-like objects (that is, simple queues of values) rather than full-fledged DOM-like nodes. To find out whether a real DOM node needs updating, the final value of a Glimmer node is compared to the last known real DOM value. If the value has not changed, no further actions are taken.

![Ember.js' Glimmer](https://cdn.auth0.com/blog/dombench/emberdom4.png)

#### Pros
- Fast and efficient diffing algorithm
- Differentiation between static and dynamic elements
- 100% compatible with Ember's API (you get the benefits without major updates to your existing code)
- Lightweight in-memory representation of the DOM

#### Cons
- Meant to be used only in Ember
- Only one frontend available

## Incremental DOM
Incremental DOM tries to bring a simpler approach to the table than the alternatives: rather than keeping a full in-memory representation of the DOM, or keeping a tree of lightweight elements, Incremental DOM uses the **real DOM** to find differences when data changes. You might be asking yourself why, if this is simpler, it hasn't been the solution picked by other libraries all along. Simple: it results in a **tradeoff between speed and memory**. Incremental DOM, by removing the additional copy of the DOM, results in **reduced memory usage**. In practice this also results in **reduced speed** while looking for differences. The reduced memory usage is key for mobile or other memory constrained devices. Read [our article on Incremental DOM](https://auth0.com/blog/2015/10/23/incremental-dom/) for more information on this.

![Incremental DOM](https://cdn.auth0.com/blog/dombench/idom.png)

#### Pros
- Reduced memory usage
- Simple API
- Easily integrates with many frontends and frameworks (meant as a template engine backend from the beginning)

#### Cons
- Not as fast as other libraries (this is arguable, see the benchmarks below)
- Less mindshare and community use

## Benchmarks!
For our benchmarks we have picked the [dbmonster test app](https://github.com/wycats/dbmonster) as [shown in this post](http://blog.nparashuram.com/2015/03/performance-comparison-on-javascript.html). `dbmonster` is a simple application that simulates the load caused by an application updating tons of rows in a table that shows the activity of different simulated database clusters. This application was originally developed to test Ember's performance. We have run this test using the latest versions of React, Ember 1.x and 2.x (both use Glimmer) and Incremental DOM. All tests were run using Chromium 46 on Linux (Core i5-5200U CPU). Five passes were performed for each test and then averaged.

![Major GC time losses](https://cdn.auth0.com/blog/dombench/MajorGC.png)
![Minor GC time losses](https://cdn.auth0.com/blog/dombench/MinorGC.png)

In these charts the time spent during major and minor GC collections can be seen. As expected, Incremental DOM is much more efficient in this area. React remains a close second for major collections but falls way behind Incremental DOM in minor collections. It is interesting to note how much Ember has progressed from version 1 to version 2 in this area.

![Layout and Paint time losses](https://cdn.auth0.com/blog/dombench/LayoutAndPaint.png)

Ember shines in this case: time spent doing layout operations and then performing the actual paint to the screen. Incremental DOM trades memory usage for speed so it is expected in this case to see it behind the alternatives. React stays close to Ember and appears balanced so far.

![Dropped frame counts](https://cdn.auth0.com/blog/dombench/droppedFrameCount.png)

This charts shows the number of frames that Chrome decided to drop (i.e. to stop drawing) due to long pauses. Dropped frames result in lower framerates and visible pauses. In this case, Incremental DOM shines again. Less time spent in GC pauses means more time is available to draw frames. React, Ember 1 and Ember 2 all remain close behind Incremental DOM.

One important thing that is not shown in the charts: the subjective feeling of the browser when using it. Incremental DOM seemed much more responsive. By taking a look at the collected data, Incremental DOM appears to be making less JavaScript calls than the alternatives. It should be noted that while Incremental DOM is just a library to dynamically update the DOM, both React and Ember handle much more: events, data passing, etc. A proper test of Virtual DOM without React should be interesting.

Take a look at the [full](https://github.com/auth0/blog-dombench/blob/master/article_results/data.json) and [summarized](https://github.com/auth0/blog-dombench/blob/master/article_results/results.csv) results.

[Get the full code](https://github.com/auth0/blog-dombench) for the tests. To run the tests, you will need ChromeDriver and all node.js dependencies for the test driver (json2csv, browser-perf). Once all dependencies are installed, run `node run-benchmarks.js`. Once the tests are done, results can be found in `data.json` (full) and `results.csv` (summarized).

## Aside: React.js use at Auth0
At Auth0 we are constantly evaluating the best technologies for our platform. For the development of our [Passwordless Lock library](https://github.com/auth0/lock-passwordless/) we picked React.js. React is an excellent choice because of its unopinionated integration model and its declarative way of developing components. On other fronts, React remains a well balanced approach between speed, memory usage, ease of integration and good documentation/support.

<a href="javascript:signup()">Sign-up</a> and start using our Passwordless Lock library in a minute! Or take a look at the [code](https://github.com/auth0/lock-passwordless/).

## Conclusion
Virtual DOM, Glimmer and Incremental DOM are all excellent options for handling dynamic DOM updates. React's mindshare and ease of integration make it a no brainer for many projects. Increased memory use can be a problem in memory constrained devices for big websites. This problem, however, is getting smaller everyday as mobile devices carry more and more memory. Incremental DOM surprises by remaining fast even when doing less. We look forward to seeing Incremental DOM integrated into Closure and other libraries. React and Ember remain as well balanced approaches each favoring different development methodologies.

When picking one of these libraries focus on mindshare and ease of integration unless you are pushing the number of updates per frame to the limit. In that case, study carefully the results from this post and don't forget to run your own specialized benchmarks.


