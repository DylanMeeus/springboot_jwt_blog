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

> A Bing study found that a 10ms increase in page load time costs the site $250K in revenue annually.
- Rob Trace and David Walp, Senior Program Managers at Microsoft

### Premature Optimization?
The hard thing about optimization is finding the right point in the development life-cycle to do it. Donald Knuth famously said *"premature optimization is the root of all evil"*. The reasoning behind these words is quite simple: it is quite easy to loose time gaining that last 1% of performance in places where it won't make a significant impact. At the same time, some optimizations hinder readability or maintainability, or even introduce newer bugs. In other words, optimization should not be considered a "means to get the best performance out of an application", but "the search for the *right way* to optimize an app and get the *biggest benefits*". In other words, blind optimization can result in lost productivity and small gains. Keep this in mind when applying the following tips. Your biggest friend is the profiler: find the performance hotspots you can optimize to get the biggest improvements without impairing the development or maintainability of your app.

> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.
- Donald Knuth

## 1. JavaScript minification and module bundling
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

## 2. On-demand loading of assets
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

When it comes to web applications, latency is one of the biggest complaints, so you want to make sure data is loading and getting displayed as fast as possible. Chrome provides great profiling tools. In particular, both the timeline view and the network view from Chrome's Dev Tools help greatly in finding latency hotspots:

![Timeline view]()

The timeline view can help in finding long running operations.

![Network view]()

The network view can help identifying additional latency generated by slow requests or serial access to an endpoint.

Memory is another area that can result in gains if properly analyzed. If you are running a page with many visual elements (big, dynamic tables) or many interactive elements (games), memory optimization can result in less stuttering and higher framerates. You can find good insights on how to use Chrome's Dev Tools to do this in our recent [4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them](https://auth0.com/blog/2016/01/26/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/) article.

CPU profiling is also available in Chrome Dev Tools. See [Profiling JavaScript Performance](https://developer.chrome.com/devtools/docs/cpu-profiling) from Google's docs.

![CPU profiling]()

Finding performance cost centers lets you target optimizations effectively.

Profiling the backend can be harder. Usually a notion of which requests are taking more time gives you a good idea of which services you should profile first. Profiling tools for the backend depend on which technology stack it was built with.

### A note about algorithms
In a majority of cases picking a more optimal algorithm stands to provide bigger gains than implementing specific optimizations around small cost centers. In a way, CPU and memory profiling should help you find big performance bottlenecks. When those bottlenecks are not related to coding issues, it is time to think about different algorithms.

## 7. Use a Load Balancing Solution
We mentioned content distribution networks (CDNs) briefly when talking about caches. Distributing load among different servers (and even different geographical) areas can go a long way into providing better latency for your users. This is especially true when handling many concurrent connections.

Load balancing can be as simple as a round-robin solution based on a [reverse nginx proxy](http://nginx.org/en/docs/http/load_balancing.html) or be based on a full-blown distributed network such as [Cloudflare](https://www.cloudflare.com/) or [Amazon CloudFront](https://aws.amazon.com/cloudfront/).

![Round robin load balancing]()

For load-balancing to be really useful, dynamic and static content should be split for easy concurrent access. In other words, serial access to elements impairs the ability of the load balancer to find the best way to split the work. At the same time, concurrent access to resources can improve startup times.

Load balancing can be complex, though. Data models that are not friendly to eventual consistency algorithms or caching make things harder. Fortunately, most apps usually require a high level of consistency for a reduced set of data. If your application was not designed with this in mind, a refactor may be necessary.

## 8. Consider Isomorphic JavaScript for Faster Startup Times
One way of improving the feel of web applications is reducing the startup time or the time to render the first view of the page. This is particularly important in newer single-page applications that do a lot of work on the client-side. Doing more work on the client-side usually means more information needs to be downloaded before the first render can be performed. Isomorphic JavaScript can solve this issue: since JavaScript can run in both the client and the server it is possible for the server to perform the first render of the page, send the rendered page and then have client-side scripts take over. This limits options for the backend (JavaScript frameworks that support this must be used), but can result in a much better user experience. Certain libraries such as [Meteor.js]() have great support for this out-of-the-box. Others, such as React can be [adapted](https://github.com/DavidWells/isomorphic-react-example):

```JavaScript
var React = require('react/addons');
var ReactApp = React.createFactory(require('../components/ReactApp').ReactApp);

module.exports = function(app) {

    app.get('/', function(req, res){
        // React.renderToString takes your component
        // and generates the markup
        var reactHtml = React.renderToString(ReactApp({}));
        // Output html rendered by react
        // console.log(myAppHtml);
        res.render('index.ejs', {reactOutput: reactHtml});
    });

};
```

Or check this Meteor sample code:

```JavaScript
if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to myapp.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```

If you have a complex or mid-sized app that supports isomorphic deployments, give this a try. You might be surprised.

## 9. Database speedups: indexing
If your database queries are taking too much time to be resolved (profile your app to see if this is the case!), it is time to look for ways to speedup your database. Every database and data-model carries its own trade-offs. Database optimization is a subject in its own: data-models, database types, specific implementation options, etc. Speedups may not be easy. Here is a tip, however, that may help with some databases: [indexing](https://en.wikipedia.org/wiki/Database_index). Indexing is a process whereby a database creates fast-access data structures that internally map to keys (columns in a relational database) that can improve retrieval speed of associated data. Most modern databases support indexing. Indexing is not specific to either document-based databases (such as [MongoDB](https://docs.mongodb.org/manual/indexes/)) nor relational databases (such as [PostgreSQL](http://www.postgresql.org/docs/9.1/static/indexes.html)).

To have indexes optimize your queries you will need to study the access patterns of your application: what are the most common queries, on which keys or columns do they perform the search, etc.

## 10. Use faster transpiling solutions
The JavaScript software stack is as complex as ever. This has increased the need for improvements to the language. Unfortunately, JavaScript as a target platform is limited by the runtime of its users. Although improvements have been implemented in form of ECMAScript 6 (with 7 in progress) it is usually not possible to depend on this version for client side code. This trend has spurred a series of *transpilers*: tools that process ECMAScript 6 code and implement missing features using only ECMAScript 5 constructs. At the same time, module bundling and minification have been integrated into the process to produce what could be called *built-for-release* versions of the code. These tools transform the code, and can, in a limited fashion, affect the performance of the resulting code. Google developer Paul Irish [spent some time](https://github.com/paulirish/The-cost-of-transpiling-es2015-in-2016) looking at how different transpiling solutions affect the performance and size of the resulting code. Although in most cases gains can be small, it is worth having a look at the data before committing to any toolstack. For big applications, the difference might be significant.

## 11. Avoid or minimize the use of render blocking JavaScript and CSS
Both JavaScript and CSS resources can block the rendering of the page. By applying certain rules you can make sure both your scripts and your CSS get processed as quickly as possible so that the browser can display your site's content.

For the case of CSS it is of the essence that all CSS rules that are not relevant to the specific media on which you are displaying the page are given a lower priority for processing. This can be achieved through the use of [CSS media queries](). Media queries tell the browser which CSS stylesheets apply to a specific display media. For instance, certain rules that are specific to printing can be given a lower priority than the rules used for displaying on the screen.

Media queries can be set as `<link>` tag attributes:

```HTML
```

When it comes to JavaScript, the key lies in following certain rules for inline JavaScript (i.e. code that is inlined in the HTML file). Inline JavaScript should be as short as possible and put in places where it won't stop the parsing of the rest of the page. In other words, inline HTML that is put in the middle of an HTML tree stops the parser at that point and forces it to wait until the script is done executing. This can be a killer for performance if there are big blocks of code or many small blocks littered through the HTML file. Inlining can be helpful to prevent additional network fetches for specific scripts. For repeatedly used scripts or big blocks of code this advantage is eliminated.

A way to prevent JavaScript from blocking the parser and renderer is to mark the `<script>` tag as *asynchronous*. This limits our access to the DOM (no `document.write`) but lets the browser continue parsing and rendering the site regardless of the execution status of the script. In other words, to get the best startup times, make sure that non-essential scripts for rendering are correctly marked as asynchronous via the `async` attribute.

## 12. One for the future: use service workers + streams

## Further reading
- [Best Practices for Speeding up Your Website - Yahoo Developer Network](https://github.com/paulirish/The-cost-of-transpiling-es2015-in-2016)
- [YSlow - a tool that checks for Yahoo's recommended optimizations](http://yslow.org/)
- [PageSpeed Insights - Google Developers](https://developers.google.com/speed/docs/insights/rules)
- [PageSpeed Tools - Google Developers](https://developers.google.com/speed/pagespeed/)
- [HTTP/2: The Long-Awaited Sequel](http://blogs.msdn.com/b/ie/archive/2014/10/08/http-2-the-long-awaited-sequel.aspx)

## Aside: common optimizations at Auth0
We are a web company. As such, we have deployed specific optimizations for certain parts of our infrastructure. For instance, for the landing pages which you can find at the `/learn` path of our domain, we have resorted to a particular optimization:

TODO

For the [docs area]() we are using *isomorphic JavaScript* which gives us great startup times and easy integration between our backend and frontend teams.

Want to see our code in action? <a href="javascript:signup()">Sign-up</a>.

Are you a web developer with a taste for speed? Are you interested in working in an awesome development team? Show us how we can optimize our site along with a short intro about yourself to <a href="mailto:"></a>.

## Conclusion
Performance optimizations are getting more and more important for web development as applications get bigger and more complex. Targeted improvements are essential to make any optimization attempt worth the time and potential future costs. Web applications have long ago crossed the boundary of mostly static content and learning common optimization patterns can make all the difference between a barely usable application and an enjoyable one. No rules are absolute, however: profiling and studying the intricacies of your specific software stack are the only way of finding out how to optimize it. Have you found any other tips that made a big difference for your app? Let us know in the comments. Hack on!
