---
layout: post
title: "12 Steps to a Faster Web App"
description: "Are you following these tips? If not, learn how to speed-up your web apps!"
date: 2016-02-19 13:30
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/social_login_android/logo.png
  image_size: "100%"
  image_bg_color: "#f5f7f9"
  blog_series: false
tags:
- frontend
- backend
- speed
- web app
- single-page app
- multi-page app
- backend tips
- frontend tips
- faster app
- faster web
- performance
- improve performance
---

Web apps are now more interactive than ever. Getting that last drop of performance can do a great deal to improve your end-users' experience. Read the following tips and learn if there is anything more you can do to improve latency, render times and general performance!

-----

## Introduction
Optimizing web apps can be an arduous job. Not only web apps are split in client-side and server-side components, but they are also usually built using diverse technology stacks: there's the database, the backend components (which are usually built on a stack of different technologies as well), the frontend (HTML + JavaScript + CSS + transpilers). Runtimes are diverse too: iOS, Android, Chrome, Firefox, Edge. If you come from a different, monolithic platform, where optimization is usually done against a single target (and even a single version of that target), you will probably reason this is much more complex task. This can be correct. There are, however, common optimization guidelines that go a long way into improving an app. We will explore these guidelines in the following sections.

### Premature Optimization?
The hard thing about optimization is finding the right point in the development life-cycle to do it. Donald Knuth famously said *"premature optimization is the root of all evil"*. The reasoning behind these words is quite simple: it is quite easy to loose time gaining that last 1% of performance in places where it won't make a significant impact. At the same time, some optimizations hinder readability or maintainability, or even introduce newer bugs. In other words, optimization should not be considered a "means to get the best performance out of an application", but "the search for the *right way* to optimize an app and get the *biggest benefits*". In other words, blind optimization can result in lost productivity and small gains. Keep this in mind when applying the following tips. Your biggest friend is the profiler: find the performance hotspots you can optimize to get the biggest improvements without impairing the development or maintainability of your app.

> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.
- Donald Knuth

## 1. JavaScript Minification and Module Bundling
JavaScript apps are distributed in source-code form. Source-code parsing is less efficient than bytecode parsing. For short scripts, the difference is negligible. For bigger apps, however, script size can have a negative impact in application startup time. In fact, one of the biggest improvements expected from the use of [WebAssembly]() are better startup times. Minification is the process of processing source-code to remove all unnecessary characters without changing functionality. This results in (unreadable) shorter code that can be parsed faster.

On the other hand, module bundling deals with taking different scripts and bundling them together in a single file. Less HTTP requests and a single file to parse reduces load times. Usually, a single tool can handle bundling and minification. [Webpack]() is one of those tools.

```JavaScript
function insert(i) {
    document.write("Sample " + i);
}

for(var i = 0; i < 30; ++i) {
    insert(i);
}
```

Results in:

```JavaScript
!function(r){function t(o){if(e[o])return e[o].exports;var n=e[o]={exports:{},id:o,loaded:!1};return r[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var e={};return t.m=r,t.c=e,t.p="",t(0)}([function(r,t){function e(r){document.write("Sample "+r)}for(var o=0;30>o;++o)e(o)}]);
//# sourceMappingURL=bundle.min.js.map
```

### Further bundling
You can also bundle CSS files and combine images with Webpack. These features can also help improve startup times. Explore the [docs](http://webpack.github.io/docs/) and run some tests!

## 2. On-demand Loading of Assets
On-demand or *lazy loading* of assets (images in particular) can help greatly in achieving better general performance of your web app. There are thee benefits to lazy loading for image-heavy pages:

- Reduced number of concurrent requests to the server (which results in faster loading times for the rest of your page).
- Reduced memory usage in the browser (less images, less memory).
- Reduced load on the server.

The general idea is to load images or assets (such as videos) at the moment they are being displayed for the first or the moment they are about to get displayed. Since this is deeply connected to how you build your site, lazy loading solutions usually come in the form of plugins or extensions to other libraries. For instance, [react-lazy-load](https://github.com/loktar00/react-lazy-load) is a plugin to handle lazy loading of images for React:

```JSX
const MyComponent = () => (
  <div>
    Scroll to load images.
    <div className="filler" />
    <LazyLoad height={762} offsetVertical={300}>
      <img src='http://apod.nasa.gov/apod/image/1502/HDR_MVMQ20Feb2015ouellet1024.jpg' />
    </LazyLoad>
    (...)
```

A great sample of how this looks in practice is the Google Images [search tool](https://www.google.com/search?site=&tbm=isch&source=hp&biw=1366&bih=707&q=parrots&oq=parrots&gs_l=img.12...0.0.0.4086.0.0.0.0.0.0.0.0..0.0....0...1ac..64.img..0.0.0.UJrFBFKkWMA). Click on the previous link and scroll the page to see the effect.

## 3. Use array-ids when using DOM manipulation libraries
If you are using [React](https://facebook.github.io/react/), [Ember](http://emberjs.com/), [Angular](https://angularjs.org/) or other DOM manipulation libraries, using array-ids (or the `track-by` feature in Angular 1.x) can help a great deal in achieving good performance, in particular for dynamic sites. We saw the effects of this feature in our latest benchmarks article: [More Benchmarks: Virtual DOM vs Angular 1 & 2 vs Mithril.js vs cito.js vs The Rest (Updated and Improved!)](https://auth0.com/blog/2016/01/11/updated-and-improved-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest/).

![Benchmarks showing the difference between array-ids and no array-ids](https://cdn.auth0.com/blog/newdombenchs2/usedheap.svg)

The main concept behind this feature is to reuse as much existing nodes as possible. Array ids allow DOM-manipulation engines to "know" when a certain node can be mapped to a certain element in an array. Without array-ids or track-by most libraries resort to destroying the existing nodes and creating new ones. This impairs performance.

## 4. Cache
[Caches](https://en.wikipedia.org/wiki/Cache_%28computing%29) are components that store static data that is frequently accessed so that requests to this data can be served faster or in a more efficient way. As web apps are composed of many moving parts, caches can be found in many parts of their architecture. For instance, a cache may be put in place between a dynamic content server and clients to prevent common request from increasing the load of the server and at the same time improving the response time. Other caches may be found in-code, optimizing certain common access patterns specific to the scripts in use. Other caches may be put in front of databases or long-running processes.

In short, caches are a great way to improve response times and reduce CPU use in web applications. The hard part is getting to know which is the right place for a cache inside an architecture. Once again the answer is profiling: where are the common bottlenecks? Are the data or results cacheable? Are they invalidated too easily? These are all hard questions that need to be answered on a case by case basis.

Uses of caches can get creative in web environments. For example, there is [basket.js](https://addyosmani.com/basket.js/), a library that uses *Local Storage* to cache scripts for your app. So the second time your web app runs scripts are loaded almost instantaneously.

A popular caching service nowadays is [Amazon CloudFront](https://aws.amazon.com/cloudfront/dynamic-content/). CloudFront works as a general purpose content distribution network (CDN) that can be setup as a cache for dynamic content.

## 5. Enable HTTP/2
More and more browsers are starting to support HTTP/2. This may sound superfluous but HTTP/2 introduces many benefits for concurrent connections to the same server. In other words, if there are many small assets to load (and there shouldn't if you are bundling things!), HTTP/2 kills HTTP/1 in latency and performance. Check [Akamai's HTTP/2 demo](https://http2.akamai.com/demo) on a recent browser to see the difference.

![Akamai HTTP/2 test]()

## 6. Profile Your App
Profiling is an essential step in optimizing any application. As mentioned in the introduction, blindingly trying to optimize an app often results in lost productivity, negligible gains and harder maintainability. Profiling runs are an essential step in identifying your application hotspots.

When it comes to web applications, latency is one of the biggest complaints.
