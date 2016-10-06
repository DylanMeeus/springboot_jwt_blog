---
layout: post
title: "More Benchmarks: Virtual DOM vs Angular 1 & 2 vs Others"
description: "You asked? We listened! Benchmark series is back with even more frameworks and metrics!"
date: 2016-01-07 13:00
alias: /2016/01/07/more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest/
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
- virtual-dom
- incremental-dom
- javascript
- glimmer
- benchmark
- mithril
- mithril.js
- angular
- angular.js
- angular-2
- angular-1
- cito.js
- performance
- memory-use
related:
- 2015-09-25-incremental-dom
- 2016-01-11-updated-and-improved-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

We have extended our [previous benchmarks](https://auth0.com/blog/2015/11/20/face-off-virtual-dom-vs-incremental-dom-vs-glimmer/) to include other popular DOM manipulation libraries: Angular 1 and 2, Mithril.js, cito.js and the standalone independent implementation of React's Virtual DOM algorithm. We have also added more metrics (including memory use). Read on! **Update:** we have released an updated version of this article including the use of track-by and array key ids, [check it out](https://auth0.com/blog/2016/01/11/updated-and-improved-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest/).

-----

## Introduction
In case you haven't read our [previous benchmarks article](https://auth0.com/blog/2015/11/20/face-off-virtual-dom-vs-incremental-dom-vs-glimmer/), here is what we did: we took a sample implementation of [DBMonster](https://github.com/wycats/dbmonster) along with the excellent benchmark scripts and tools from this [post](http://blog.nparashuram.com/2015/03/performance-comparison-on-javascript.html), reimplemented it for use with different DOM libraries, ran the scripts and collected the results. For this post we have also extended [browser-perf](https://github.com/sebadoom/browser-perf) to generate memory usage statistics.

> We will submit our additions to browser-perf for review, which is why we haven't linked to the original browser-perf repo above.

What follows is an overview of the contenders. Or you can [jump straight to the results](#results-link).

### Angular.js 1.x
The venerable [Angular 1.x library](https://angularjs.org/) is part of an opinionated but powerful framework that saw its initial release in the year 2009. Since then it has gathered a tremendous following and inspired many other libraries. Often criticized for being hard to integrate into existing projects, and questioned for its performance in certain use cases, it is still used in many [high-ranking websites](http://libscore.com/?#angular). Angular extends standard HTML with custom tags and a template syntax (which form the view). Controllers are defined following a series of strict API requirements that include the use of dependency injection. Data binding and model changes are handled through a digest cycle. The digest cycle is the method Angular uses to detect changes in the model that trigger changes in the view. This method has particular performance characteristics as can be seen in the results below.

An Angular 1.x view template:

```HTML
<td ng-repeat="query in database.topFiveQueries"
    ng-class="getClassName(query)">
    {{formatElapsed(query.elapsed)}}
    <div class="popover left">
        <div class="popover-content">
            {{query.query}}
        </div>
        <div class="arrow"></div>
    </div>
</td>
```

And part of the associated JavaScript code, including dependency injection semantics:

```javascript
dbmonControllers.controller('MainController', ['$scope', '$timeout',
    function($scope, $timeout) {
        $scope.loadCount = 0;
        $scope.databases = {};

        $scope.getClassName = function(query) {
            var className = "elapsed short";
            if (query.elapsed >= 10.0) {
                className = "elapsed warn_long";
            } else if (query.elapsed >= 1.0) {
                className = "elapsed warn";
            }
            return "Query " + className;
        };
        //(...)
    }
);
```

### Angular.js 2
The still-in-flux [Angular 2 library](https://angular.io/) has recently been declared in *beta* state. Still under heavy scrutiny by many developers that do not consider a breaking change to be the right way to fix all of Angular 1.x problems, Angular 2 carries on with its opinionated approach. TypeScript is now favored (but not required) over JavaScript and a new template syntax is now required. The digest cycle was replaced by the use of a change detection algorithm that walks the DOM tree. [Other optimizations](http://victorsavkin.com/post/110170125256/change-detection-in-angular-2) allow Angular 2 to detect precisely when the model has changed (in contrast to the need to explicitly tell Angular 1 so in certain cases).

An Angular 2 view template:

```HTML
<td *ngFor="#query of database.topFiveQueries"
    [ngClass]="getClassName(query)">
    {{formatElapsed(query.elapsed)}}
    <div class="popover left">
        <div class="popover-content">
            {{query.query}}
        </div>
        <div class="arrow"></div>
    </div>
</td>
```

And its associated JavaScript code:

```javascript
app.AppComponent = ng.core
    .Component({
      selector: 'my-app',
      templateUrl: './app/component.html'
      //directives: [angular.NgFor]
    })
    .Class({
        //(...)
        getClassName: function(query) {
            var className = "elapsed short";
            if (query.elapsed >= 10.0) {
                className = "elapsed warn_long";
            } else if (query.elapsed >= 1.0) {
                className = "elapsed warn";
            }
            return "Query " + className;
        }
    ]);
```

> Our Angular 2 DBMonster code was developed using JavaScript rather than the recommended TypeScript to reuse as much code as possible from other versions of the benchmark. Angular 2 code is more idiomatic using TypeScript and was developed with its features in mind.

### Virtual DOM
[Virtual DOM](https://github.com/Matt-Esch/virtual-dom) is an independent implementation of React's tree-diffing algorithm. It provides an API that allows users to describe a DOM tree directly in JavaScript. JSX is not used.

```JavaScript
function renderQuery(query) {
    var className = "elapsed short";
    if (query.elapsed >= 10.0) {
        className = "elapsed warn_long";
    } else if (query.elapsed >= 1.0) {
        className = "elapsed warn";
    }

    return h('td', { className: 'Query ' + className }, [
        query.elapsed ? formatElapsed(query.elapsed) : '',
        h('div', { className: 'popover left' }, [
            h('div', { className: 'popover-content' }, query.query),
            h('div', { className: 'arrow' })
        ])
    ]);
}
```

### Mithril.js
A React-like [library](http://mithril.js.org/) aimed at being simple, small and fast. It provides a convenient API to describe DOM-trees in JavaScript, and a preprocessor to turn DOM-tree API-calls into simple JSON objects for additional speed. The API for DOM-trees is similar to that of Virtual DOM, and the required controller/view objects are simple enough to be integrated easily into existing bodies of code. Much like Angular 1, it requires changes to the DOM tree made outside library boundaries to be notified for redrawing. Data-binding is performed through a properties system.

```javascript
function renderQuery(query) {
    var className = "elapsed short";
    if (query.elapsed >= 10.0) {
        className = "elapsed warn_long";
    } else if (query.elapsed >= 1.0) {
        className = "elapsed warn";
    }

    return m('td', { className: 'Query ' + className }, [
        query.elapsed ? formatElapsed(query.elapsed) : '',
        m('div', { className: 'popover left' }, [
            m('div', { className: 'popover-content' }, query.query),
            m('div', { className: 'arrow' })
        ])
    ]);
}
```

### cito.js
A minimalist Virtual DOM-like [library](https://github.com/joelrich/citojs). A virtual DOM is constructed from plain JSON-like objects. A simple call tells the library to compare the existing tree to a new one and perform the necessary updates.

```JavaScript
function renderQuery(query) {
    var className = "elapsed short";
    if (query.elapsed >= 10.0) {
        className = "elapsed warn_long";
    } else if (query.elapsed >= 1.0) {
        className = "elapsed warn";
    }

    return {
        tag: 'td',
        attrs: { 'class': 'Query ' + className },
        children: [
            query.elapsed ? formatElapsed(query.elapsed) : '',
            {
                tag: 'div',
                attrs: { 'class': 'popover left' },
                children: [
                    {
                        tag: 'div',
                        attrs: { 'class': 'popover-content' },
                        children: query.query.toString()
                    }, {
                        tag: 'div',
                        attrs: { 'class': 'arrow' }
                    }
                ]
            }
        ]
    };
}
```

### Ember 1
Another powerful and opinionated framework. [Ember](http://emberjs.com/) makes use of their own template language which allows for easy differentiation between static and dynamic parts of the DOM. Their diffing algorithm is optimized to take this into account. Data binding is handled through a properties system.

An Ember view using its template syntax:

```hbs
{{#each topFiveQueries key="key" as |query|}}
  <td class="Query {{query.className}}">
    {{query.elapsed}}
    <div class="popover left">
      <div class="popover-content">{{query.query}}</div>
      <div class="arrow"></div>
    </div>
  </td>
{{/each}}
```

And its associated JavaScript code:

```JavaScript
export default Ember.Component.extend({
  tagName: 'tr',

  queries: function() {
    var samples = this.get('attrs.db.value.samples');
    return samples[samples.length - 1].queries;
  }.property('attrs.db'),

  topFiveQueries: function() {
    var queries = this.get('queries');
    var topFiveQueries = queries.slice(0, 5);

    while (topFiveQueries.length < 5) {
      topFiveQueries.push({ query: "" });
    }

    return topFiveQueries.map(function(query, index) {
      return {
        key: index+'',
        query: query.query,
        elapsed: query.elapsed ? formatElapsed(query.elapsed) : '',
        className: elapsedClass(query.elapsed)
      };
    });
  }.property('queries'),

  //(...)
});
```

### Ember 2
This newer version of [Ember](http://emberjs.com/) removes many deprecated parts of the library and serves as a cleanup of the API. Most of the other benefits of Ember 2 can also be found in Ember 1.13+ releases.

> The Ember 2 code in this article is 100% compatible with the Ember 1.x version, so no example is provided here.

### React.js
Facebook's [popular library](https://facebook.github.io/react/) is gaining ground day-by-day. Its simple integration model, flexibility and speed make it a no-brainer for many projects. The crux of React is its smart diffing algorithm: a virtual tree is constructed by making JavaScript calls. When a new DOM tree is constructed, React can find the optimal number of operations to transform the old tree into the new one. React is usually paired with the JSX preprocessor, which allows an extended form of HTML to be embedded in JavaScript to describe components in a convenient way.

```JSX
var Query = React.createClass({
  render: function() {
    var className = "elapsed short";
    if (this.props.elapsed >= 10.0) {
      className = "elapsed warn_long";
    }
    else if (this.props.elapsed >= 1.0) {
      className = "elapsed warn";
    }

    return (
      <td className={"Query " + className}>
        {this.props.elapsed ? formatElapsed(this.props.elapsed) : ''}
        <div className="popover left">
          <div className="popover-content">{this.props.query}</div>
          <div className="arrow"/>
        </div>
      </td>
    );
  }
})
```

### Incremental DOM
A Google project, [Incremental DOM](https://github.com/google/incremental-dom) aims to develop a memory-efficient library that can perform in-place updates of the DOM tree. It is intended to be used as a compilation target for different template languages. In practice, its API is similar to that of Virtual DOM, Mithril or cito.js. The main benefit of a memory efficient approach is reduced waits during garbage collection cycles. This can result in improved performance and fewer dropped frames during rendering.

```JavaScript
function renderQuery(query) {
    var className = "elapsed short";
    if (query.elapsed >= 10.0) {
        className = "elapsed warn_long";
    } else if (query.elapsed >= 1.0) {
        className = "elapsed warn";
    }

    elementOpen('td', null, null, 'class', "Query " + className);
        text(query.elapsed ? formatElapsed(query.elapsed) : '');
        elementOpen('div', null, ['class', 'popover left']);
            elementOpen('div', null, ['class', 'popover-content']);
                text(query.query);
            elementClose('div');
            elementVoid('div', null, ['class', 'arrow']);
        elementClose('div');
    elementClose('td');
}
```

<a id="results-link"></a>
## The Results
Here are the summarized results of our tests:

![Major GC collection times](https://cdn.auth0.com/blog/newdombenchs/MajorGC.svg)
Angular 1.x results make this graph hard to read. Angular 1.x performance problems are known and it shows in this graph. Major GC collections take several times longer compared to the alternatives. As expected, lightweight libraries such as mithril and cito.js shine here, but the absolute winner is Virtual DOM. Incremental DOM is also among the winners. The difference between Angular 1 and 2 is outstanding. It appears a big break was necessary to fix many of the shortcomings Angular 1 had.

![Minor GC collection times](https://cdn.auth0.com/blog/newdombenchs/MinorGC.svg)
Incremental DOM shines here. Being developed for lower memory use pays off. React is a surprise as well, sporting excellent results in spite of its two-copies virtual DOM algorithm. The one that draws the attention is Virtual DOM, with its independent React-like virtual dom implementation: it shows longer pauses that React. This is probably the result of the optimizations Facebook developers have done over time to React. Angular 1.x is still the slowest and the difference with Angular 2 is still surprising. Ember 1 and 2 are the next in the pack in front of Angular 1. The difference between Ember 1 and 2 is significant. It appears many optimizations have been carried out under the hood.

![Layout times](https://cdn.auth0.com/blog/newdombenchs/Layout.svg)
This graph shows the time spent by the browser doing re-layout operations (i.e. creating an internal representation of the DOM tree after changes). I find it surprising that cito.js is the slowest in this case. Subjective performance would tell otherwise, as both cito.js and Incremental DOM feel quite snappy when interacting directly with the browser. Ember 1 and 2 are the next in the pack, and in this case the subjective feeling matches with the result. React is black-magic in this case, being the fastest. Incremental DOM sits somewhere in the middle along with the rest.

![Paint times](https://cdn.auth0.com/blog/newdombenchs/Paint.svg)
This graph is almost a copy of the previous one. It shows the amount of time spent rasterizing the elements in the internal DOM tree of the browser. There is not much to add here other than restate that the subjective feeling for Incremental DOM and cito.js does not match what is shown in the graph (really, try it!).

![FPS](https://cdn.auth0.com/blog/newdombenchs/FPS.svg)
Deviation among most libraries is small in this graph, so one would expect hands-on usage to be pretty much the same for all of them except one (Angular 1). This is not the case. Even though Angular 1.x does feel sluggish compared to the pack, the difference between cito.js and Incremental DOM compared to the others is much bigger than it would appear. There must be something else going on behind the scenes (or this metric is either not measured correctly or useless).

![Dropped frame counts](https://cdn.auth0.com/blog/newdombenchs/droppedFrameCount.svg)
This chart shows the number of frames that take longer than 16.6ms to be drawn. They account for stuttering and other non-smooth behavior so it is an important metric for the subjective feeling of an application. Ember 1 and 2 are outshined by almost all of the other libraries. Incremental DOM, on the other hand, shines again, followed closely by Mithril and React. Again the results for cito.js are odd. We will review our testing environment to make sure background processes are not affecting these results.

![Total JavaScript execution times](https://cdn.auth0.com/blog/newdombenchs/Javascript.svg)
This graph shows the total amount of time spent by the browser executing JavaScript code. Ember 1 and 2 are the slowest here, followed closely by Angular 1.x. Again the difference between Angular 1 and 2 is abysmal. In my limited experience with Angular 2, I would say it is a step in the right direction. Incremental DOM and React shine here, followed closely by Mithril and Virtual DOM. If it serves as any indication, when it comes to CPU metrics, React appears to be the most balanced, scoring wins and near wins in several benchmarks.

![Max heap size](https://cdn.auth0.com/blog/newdombenchs/totalheap.svg)
![Average heap use](https://cdn.auth0.com/blog/newdombenchs/usedheap.svg)
These two graphs are deeply related so there is only one paragraph for both of them. Both show the amount of memory used by the browser when running the benchmark. The first one shows the maximum size of the heap, including unused free space; while the second shows an average of the amount of memory used only by active objects. They look mostly the same. In general, Incremental DOM used the least amount of memory, followed closely by React (a real surprise!). React optimizations have paid off and it still looks as all-around balanced library. Mithril, cito.js and Virtual DOM all do very well in these tests. Again, of note are the improvements when going from Angular 1 to Angular 2. Angular 2 has improved every single metric when compared to Angular 1, and in a significant way. Angular 1 almost doubles the memory use of its follower.

Check out the [full code](https://github.com/auth0/blog-dombench/tree/dombench2) for all tests.

## Aside: React at Auth0
At Auth0 we care about maintainability and performance. We routinely look at competing solutions to find out the right tool for the job. For our [Passwordless Lock library](https://github.com/auth0/lock-passwordless/), we found that React has great performance characteristics, allows for an easy integration path, and results in clean, readable code. At the same time, it sports an active community that allows our developers to quickly and easily find how to get the job done. If you are interested in seeing how we use React, check out the source!

## Conclusion
We are consistently surprised by the results of the Incremental DOM library. Not only in numbers, but also in the way it *feels* faster than the alternatives. Google has done a tremendous job optimizing its internals to produce a faster and leaner library. The only other library that has achieved this subjective feeling of speed is cito.js. In the case of cito.js we are concerned by its apparent lack of development activity at GitHub. When it comes to bigger frameworks, we cannot recommend React enough. It sports the right balance of performance, memory use, support and community mindshare. Mithril.js surprised us with its ease of use and great performance. We consider it to be a rightful contender to React, with an all-around great balance between speed, memory usage and ease of use. Between the bigger frameworks, both Angular and Ember are good choices. We consider them great for many use cases: in particular, for developers that adhere to their specific ideologies (if you like TypeScript, you will love Angular 2 as a library that is developed for it from the ground-up). Lastly, Angular 1.x performance issues are by now known by all developers. If you want to use it, take this into consideration. In particular, consider that Angular 2 is significantly better than Angular 1 in every metric (to be fair, Angular 1 and 2 are different enough to be considered totally different libraries, only inspired by similar concepts).

{% include tweet_quote.html quote_text="Mithril.js surprised us with its ease of use and great performance." %}

Some oddities in the results (for instance cito.js appearing slower in dropped frame counts and FPS counts when subjective tests tell otherwise) make us think something else is going on behind the scenes, so take these results as what they are: a small and probably biased sample. Our methodology and testing tools probably need an improvement.

Let us know in the comments what you think! Cheers!
