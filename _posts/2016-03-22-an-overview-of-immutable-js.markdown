---
layout: post
title: "An Overview of Functional Programming and Immutable.js"
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

Functional programming has been on the rise the last few years. Languages such as Clojure, Scala and Haskell have brought to the eyes of imperative programmers interesting techniques that can provide significant benefits in certain use cases. Immutable.js aims to bring some of these benefits to JavaScript in an easy and intuitive API. Follow us through this overview to learn some of these benefits and how to make them count in your projects!

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

#### You are already using an immutable data structure: strings
Strings in JavaScript are immutable. All methods in the String prototype perform either read operations or return new strings.

Some JavaScript runtimes take advantage of this to perform interning: at load time or during JIT compilation the runtime can simplify string comparisons (usually between string literals) to simple reference comparisons. You can check how your browser handles this with a simple [JSPerf test case](https://jsperf.com/strinterning/4). Check other revisions of the same test for more thorough test cases.

![Firefox 45 string interning results on Linux](https://cdn.auth0.com/blog/immutablejs/interning.png)

#### Immutability and Object.freeze()
JavaScript is a dynamic, weakly typed language (or untyped if you're familiar with programming language theory). As such it is sometimes hard to enforce certain constraints on objects and data. `Object.freeze()` helps in this regard. A call to `Object.freeze` marks all properties as immutable. Assignments will either silently fail or throw an exception (in strict mode). If you are writing an immutable object, calling `Object.freeze` after construction can help.

Bear in mind `Object.freeze()` is shallow: attributes of children object can be modified. To fix this, [Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) shows how a `deepFreeze` version of this function can be written:

```JavaScript
function deepFreeze(obj) {

  // Retrieve the property names defined on obj
  var propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function(name) {
    var prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}
```

## Side-effects
In programming language theory side-effects to any operation (usually a function or method call) are observable effects that can be seen outside the call to the function. In other words, it is possible to find a change in state after the call is performed. Each call *mutates* some state. In contrast to the concept of immutability, which is usually related to data and data structures, side-effects are usually associated to the state of a program as a whole. A function that preserves immutability of an instance of a data structure *can* have side-effects. A good example of this are caching functions, or memoization. Although to outside observers it may look like no change has occurred, updating a global or local cache has the side-effect of updating the internal data structures that work as the cache (the resulting speedups are also a side-effect). It is the job of developers to be aware of those side-effects and handle them appropriately.

For instance, following the example of the cache, an immutable data structure that has a cache as a frontend can no longer be freely passed to different threads. Either the cache has to support multithreading or unexpected results can happen.

Functional programming as a paradigm favors the use of side-effect free functions. For this to apply, functions must only perform operations on the data that is passed to them, and the effects of those operations should only be seen to the callee. Immutable data structures go hand-in-hand with side-effect free functions.

### Purity
Purity is an additional condition that may be imposed on side-effect free functions: pure functions rely only on what is explicitly passed to them as arguments to produce a result. In other words, pure functions must not rely on global state or even state accessible through constructs such as `this`.

### Referential transparency
The result of combining side-effect free functions with purity is referential transparency. A referentially transparent function can be replaced at any point by its result knowing for certain this changes in no way the computation as a whole.

As you may have noticed, each of these conditions places higher restrictions on how data and code can behave. Although this results in reduced flexibility, deep gains are realized when it comes to analysis and proofs. It is trivially provable that immutable data structures with no side-effects can be passed to different threads without worrying about locking, for instance.

## Persistence
As we have seen in the previous section, immutability makes certain things easier. Another thing that becomes easier with immutable data structures is *persistence*. Persistence, in the context of data structures, refers to the possibility of keeping older versions of a data structure after a new version is constructed.

As we have mentioned before, when write operations are to be performed on immutable data structures, rather than mutating the structure itself or its data, a new version of the structure is returned. Most of the time, however, modifications are small with regards to the size of the data or the data structure. Performing a full copy of the whole data structure is therefore suboptimal. Most immutable data structure algorithms, taking advantage of the immutability of the first version of the data, perform copies of only the data (and the parts of the data structure) that need to change.

Partially persistent data structures are those which support modifications on its newest version and read-only operations on all previous versions of the data. Fully persistent data structures allow reading and writing on all versions of the data. Note that in all cases, writing or modifying data implies creating a new version of the data structure.

This may not be entirely obvious but persistent data structures favor garbage collection rather than reference counting or manual memory management. As each change results in a new version of the data, and previous versions must be available, each time a change is performed new references to existing data are created. On manual memory management schemes, keeping track of which pieces of data have references quickly gets troublesome. On the other hand, reference counting makes things easier from the developer point of view, but inefficient from an algorithmic point of view: each time a change is performed, reference counts of changed data must be updated. Furthermore, this *invisible change* is in truth a side-effect. As such, it limits the applicability of certain benefits. Garbage collection, on the other hand, comes with none of these problems. Adding a reference to existing data comes for free.

## Lazy evaluation
Another not-so-obvious benefit of immutability comes in the form of easier lazy operations. Lazy operations are those that do not perform any work until the results of those operations are required (usually by a strict evaluating operation; strict being the opposite of lazy in this context). Immutability helps greatly in the context of lazy operations because lazy evaluation usually entails performing an operation in the future. If the data associated to such operation is changed in any way between the time the operation is constructed and its results are required, then the operation cannot be safely performed. Immutable data helps because lazy operations can be constructed being certain data will not change. In other words, immutability enables lazy evaluation as an evaluation strategy.

There are several benefits to lazy evaluation. The most important one is that unnecessary values need not be computed. For example, consider a list formed by the elements 1 to 10. Now let's apply two independent operations to each element in the list. The first operation will be called `plusOne` and the second `plusTen`. Both operations do what's obvious: the first adds one to its argument, the second adds ten.

```JavaScript
function plusOne(n) {
    return n + 1;
}
function plusTen(n) {
    return n + 10;
}

var list = [1,2,3,4,5,6,7,8,9,10];
var result = list.map(plusOne).map(plusTen);
```

As you may have noticed, this is inefficient: the loop inside `map` runs twice even though no elements from `result` have been used yet. Suppose you only need the first element: with strict evaluation both loops run completely. With lazy evaluation each loop runs until the requested result is returned. In other words, if `result[0]` is requested, only one call to each `plus...` function is performed.

Lazy evaluation may also allow for infinite data structures. For instance a sequence from 1 to infinity can be safely expressed if lazy evaluation is supported. Lazy evaluation can also allow for invalid values: if invalid values inside a computation are never requested, then no invalid operations are performed (which may result in exceptions or other error conditions).

Certain functional programming languages can also perform advanced optimizations when lazy evaluation is available, such as deforestation or loop fusion. In essence these optimizations can turn operations defined in terms of multiple loops into single loops, or, in other words, remove intermediate data structures. In other words, the two `map` calls from the example above into a single `map` call that calls `plusOne` and `plusTen` in the same loop. Nifty, huh?

However, not everything is good about lazy evaluation: the exact point at which any expression gets evaluated and a computation performed stops being obvious. Analysis of certain complex lazy operations can be quite hard. Another disadvantage are space-leaks: leaks that result from storing the necessary data to perform a given computation in the future. Certain lazy constructs can make this data grow unbounded, which may result in problems.

## Composition
