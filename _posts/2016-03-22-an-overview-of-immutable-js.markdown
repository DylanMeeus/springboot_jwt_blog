---
layout: post
title: "An Overview of Immutable.js"
description: "Learn about functional data structures and their uses in this overview of Facebook's popular library for JavaScript: Immutable.js"
date: 2016-03-22 13:30
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#2E2E2C"
  image: https://cdn.auth0.com/blog/jsleaks/logo.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- javascript
- immutable
- immutable data structures
- immutable.js
- functional data structures
- data structures
- pure data structures
- purely functional data structures
- lazy data structures
---

Functional programming has been on the rise the last few years. Languages such as Clojure, Scala and Haskell have brought to the eyes of imperative programmers interesting techniques that can provide significant benefits in certain use cases. Immutable.js aims to bring some of these benefits to JavaScript in an easy and intuitive API. Follow us through this overview to learn some of these benefits and how to reap them in your own projects!

-----

## Introduction: the case for immutability
Although functional programming is much more than just immutability, many functional languages put a strong emphasis on immutability. Some, like Clean and Haskell, place hard compile-time restrictions on how and when data can be mutated. For many programmers this is a major put-off. For those who endure the initial shock, new patterns and ways of solving problems begin to arise. In particular, data structures are a major point of conflict for newcomers to the functional paradigm.

In the end, the matter of immutable vs mutable data structures comes down to cold, hard math. Algorithmic analysis tells us which data structures are best suited for different kinds of problems. Language support, however, can go a long way into helping with the use and implementation of those data structures. JavaScript, by virtue of being a multi-paradigm language, provides a fertile ground for both mutable and immutable data structures. Other languages, such as C, can implement immutable data structures. However, the limitations of the language can make their use cumbersome.

So what are the tenets of functional data structures, and, in particular what makes immutability so important? Furthermore, what are the right use cases for them? These are some of the questions we will explore below.

> You may not know this, but you may already be using certain functional programming constructs in your JavaScript code. For instance, `Array.map` applies a function to each item in an array and returns a new array, without modifying the original in the process. Functional programming as a paradigm favors first-class functions that can be passed to algorithms returning new versions of existing data. This is in fact what `Array.map` does. This way of processing data favors composition, another core concept in functional programming.

## Key Concepts
These are some of the key concepts behind functional programming. Hopefully, throughout this post you will find how these concepts fit in the design and use of Immutable.js and other functional libraries.

### Immutability
Immutability refers to the way data (and the data structures managing it) behave after being instanced: no mutations are allowed. In practice, mutations can be split in two groups: visible mutations and invisible mutations. **Visible mutations** are those that either modify the data or the data structure that contains it in a way that can be noted by outside observers through the API. **Invisible mutations** on the other hand, are changes that cannot be noted through the API (caching data structures are a good example of this). In a sense, invisible mutations can be considered side-effects (we explore this concept and what it means below). Immutability in the context of functional programming usually forbids any of these two modifications: not only data is immutable by default, but the data structures themselves suffer no changes once instanced.

Interesting benefits arise when developers (and compilers/runtimes) can be sure data cannot change:
- Locking for multithreading is no longer a problem: as data cannot change, no locks are needed to synchronize multiple threads.
- Persistence (another key concept explored below) becomes easier.
- Copying becomes a constant-time operation: copying is simply a matter of creating a new reference to the existing instance of a data structure.
- Value comparisons can be optimized in certain cases: when the runtime or compiler can make sure during loading or compiling that a certain instance is only equal when pointing to the same reference, deep value comparisons can become reference comparisons. This is known as *interning* and is normally only available for data available at compile or load time.

#### You are already using an immutable data structure: literal strings


#### Immutability and Object.freeze()

## Side-effects
