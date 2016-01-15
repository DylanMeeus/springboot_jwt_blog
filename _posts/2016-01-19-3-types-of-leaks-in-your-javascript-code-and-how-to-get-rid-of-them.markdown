---
layout: post
title: "3 Types of Leaks in Your JavaScript Code and How to Get Rid Of Them"
description: "Learn how to find memory leaks in your JavaScript code!"
date: 2016-01-19 13:30
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
In essence, memory leaks can be defined as memory that is not required by an application anymore that for some reason is not returned to the operating system or the pool of free memory. Programming languages favor different ways of managing memory. These ways may reduce the chance of leaking memory. However, whether a certain piece of memory is unused or not is actually an [undecidable problem](). In other words, only developers can make it clear whether a piece of memory can be returned to the operating system or not. Certain programming languages provide features that help developers do this. Others expect developers to be completely explicit about when a piece of memory is unused.

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
### One: Unsuspected global variables
### Two: Hidden DOM nodes
### Three: Detached parent nodes

## Chrome Memory Profiling Tools Overview

## Example: Finding Leaks Using Chrome

## Further reading

## Conclusion
Memory leaks can and do happen in garbage collected languanges such as JavaScript. These can go unnoticed for some time, but eventually they wreak havoc and can cause trouble in your and other's applications. Memory profiling tools are essential in finding memory leaks. When developing mid-size or large-size applica
