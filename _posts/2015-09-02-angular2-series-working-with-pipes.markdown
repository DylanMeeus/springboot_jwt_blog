---
layout: post
title: "Angular 2 Series - Part 1: Working with Pipes"
description: "Learn how to implement pipes (formerly known as filters) in your Angular 2 apps"
date: 2015-09-03 11:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image_bg_color: "linear-gradient(#0143A3,#0273D4)"
  bg_color: "#7C161E"
  image: https://cdn.auth0.com/blog/angular2-series/angular2-logo.png
  image_size: "70%"
  blog_series: true
tags: 
- angular2
- angularjs
- pipes
- javascript
- post-series
---

---

**TL;DR:** In this first installment of the Angular 2 series, we take a look at **pipes** which replace filters from Angular 1.x. Many of the filters from Angular 1.x carry over to pipes, but we also get some new ones. Check out [the repo](https://github.com/auth0/angular2-pipes) for this tutorial to see the pipes in action and to learn how to create your own custom pipes. To see an example of a full Angular 2 app, read Auth0's tutorial on [creating your first Angular 2 app](https://auth0.com/blog/2015/05/14/creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between/).

---

> Auth0's Angular 2 series brings you tutorials on how to implement the latest features from the framework using the most recent Alpha release at the time of writing.

## From Filters to Pipes

AngularJS 1.x filters are helpful for formatting output in our templates. With Angular 2, we get this same great feature, but they are now called **pipes**. At the time of this writing, Angular 1.x and Angular 2 have an equal number of filters to pipes, but there isn't direct crossover. The following table shows a comparison:

<table class="table">
<thead>
<tr>
<th> Filter/Pipe Name </th>
<th style="text-align:center;"> Angular 1.x </th>
<th style="text-align:center;"> Angular 2 </th>
</tr>
</thead>
<tbody>
<tr>
<td> currency         </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> date             </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> uppercase        </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> json             </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> limitTo          </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> lowercase        </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> number           </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;">           </td>
</tr>
<tr>
<td> orderBy          </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;">           </td>
</tr>
<tr>
<td> filter           </td>
<td style="text-align:center;"> ✓    </td>
<td style="text-align:center;">           </td>
</tr>
<tr>
<td> async            </td>
<td style="text-align:center;">             </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> decimal          </td>
<td style="text-align:center;">             </td>
<td style="text-align:center;"> ✓  </td>
</tr>
<tr>
<td> percent          </td>
<td style="text-align:center;">             </td>
<td style="text-align:center;"> ✓  </td>
</tr>
</tbody>
</table>

In this article, we will explore the features provided by some of Angular 2's pipes that aren't comparable to Angular 1.x filters. We'll also learn how to create a custom pipe and use it in our templates. 

You'll need to have an Angular 2 sandbox set up for this tutorial. A good one to get started with is [ng2-play](https://github.com/pkozlowski-opensource/ng2-play) by [Pawel Kozlowski](https://twitter.com/pkozlowski_os).

## Basic Pipes

Many of the pipes provided by Angular 2 will be familiar if you've worked with fitlers in Angular 1.x. Pipes are accessed in our templates in the same way that filters were--with the "pipe" character `|`. For example, we can use the `date` pipe to transform a date object in any way we like by providing it with an argument for formatting:

```js
// app.ts

/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'pipes'
})
@View({
  templateUrl: 'pipesTemplate.html'
})
// Component controller
class PipesAppComponent {
  date: Date;
  
  constructor() {
    this.date = new Date();
  } 
}

bootstrap(PipesAppComponent);
```

We pointed our `@View` decorator to a `templateUrl` in which we make use of the `date` pipe: 

```html
  <!-- pipesTemplate.html -->
  <h1>Dates</h1>
  <!-- Sep 1, 2015 -->
  <p>{{ "{{date | date:'mediumDate'" }}}}</p>
  <!-- September 1, 2015 -->
  <p>{{ "{{date | date:'yMMMMd'" }}}}</p>
  <!-- 3:50 pm -->
  <p>{{ "{{date | date:'shortTime'" }}}}</p>
```

![angular2](https://cdn.auth0.com/blog/angular2-pipes/angular2-pipes-1-1.png)

## New Pipes

The `decimal` and `percent` pipes are new in Angular 2. These take an argument that describes the "digit info" that should be used--that is, how many integer and fraction digits the number should be formatted with. The argument we pass for formatting follows this pattern: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`.

**Note:** The `decimal` pipe is accessed using `number` in our templates.

```js
// app.ts

...

@View({
  templateUrl: 'pipesTemplate.html'
})

class PipesAppComponent {
  grade: number;
  rating: number;

  constructor() {
    this.grade = 0.99;
    this.rating = 9.1243;
  }
}

...
```

```html
  <h1>Decimals/Percentages</h1>
  <!-- 99.00% -->
  <p>{{ "{{grade | percent:'.2'" }}}}</p>
  <!-- 09.12 -->
  <p>{{ "{{rating | number:'2.1-2'" }}}}</p>
```
![angular2](https://cdn.auth0.com/blog/angular2-pipes/angular2-pipes-1-2.png)

## The Async Pipe

Angular 2 provides a special pipe known as `async`, which allows us to bind our templates directly to values that arrive asynchronously. This ability is great for working with promises and observables. To see how this works, we'll create a simple promise and have it resolve with a string.

```js
// app.ts

...

@Component({
  selector: 'pipes',
  changeDetection: 'ON_PUSH'
})
@View({
  templateUrl: 'pipesTemplate.html',
})

class PipesAppComponent {
  promise: Promise;

  constructor() {
    this.promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("Hey, I'm from a promise.");
      }, 2000)
    });
  }
}

...
```

```html
  <!-- pipesTemplate.html -->
  <h1>Async</h1>
  <p>{{ "{{ promise | async" }}}}</p>

```

After a 2 second delay, the value from the resolved promise will be displayed on the screen.

![angular2](https://cdn.auth0.com/blog/angular2-pipes/angular2-pipes-1-3.png)


## Custom Pipes

Before Alpha 35, we had to configure our custom pipes with a `pipes` object. However, we can now define a pipe with the decorator `@Pipe` and use it by adding a `pipes` property to the `@View` decorator with the name of the pipe class. This makes it easier and more convenient to register our custom pipes.

```js
// app.ts

import {Component, View, bootstrap, Pipe} from 'angular2/angular2';

...

// We use the @Pipe decorator to register the name of the pipe
@Pipe({
  name: 'tempConvert'
})
// The work of the pipe is handled in the tranform method with our pipe's class
class TempConvertPipe {
  transform(value: number, args: any[]) {
    if(value && !isNaN(value) && args[0] === 'celsius') {
      var temp = (value - 32) * 5/9;
      var places = args[1];
      return temp.toFixed(places) + ' C';       
    }

    return;
  }
}

...

@View({
  templateUrl: 'pipesTemplate.html',

  // We can pass the pipe class name into the pipes key to make it usable in our views
  pipes: [TempConvertPipe]
})

class PipesAppComponent {
  temperature: number;

  constructor() {
    this.temperature = 85;
  }
}
```

```html
  <h1>Custom Pipes - Convert Temperature</h1>
  <!-- 85 F -->
  <h3>Fahrenheit: {{ "{{temperature + ' F'" }}}}</h3>
  <!-- 29.4 C -->
  <h3>Celsius: {{ "{{temperature | tempConvert:'celsius':1" }}}}</h3>
```
We use the `transform` method to do any logic necessary to convert the `value` that is being passed in. We can get ahold of the arguments array as the second parameter and pass in as many as we like from the template. As you can see here, we check the type of conversion that we want (e.g., Fahrenheit to Celsius), convert the `value` passed in, and then return the converted value to the number of decimal places specified in the second argument of the pipe.

As mentioned above, we need to provide an array to the `pipes` property in the `@View` decorator to use the new pipe.

![angular2](https://cdn.auth0.com/blog/angular2-pipes/angular2-pipes-1-4.png)

## Aside: Using Angular with Auth0

Auth0 issues **JSON Web Tokens** on every login for your users. That means that you can have a solid identity infrastructure, including Single Sign On, User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. We implemented a tight integration with Angular 1. Angular 2 integration is coming as soon as it's on Beta! You can read the [documentation here](https://auth0.com/docs/client-platforms/angularjs) or you can checkout the [SDK on Github](https://github.com/auth0/auth0-angular)

<img src="https://docs.google.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/pub?w=1219&amp;h=559" style="border: 1px solid #ccc;padding: 10px;">

## Wrapping Up

Angular 2 provides some great pipes that carry over well from the filters we are used to in Angular 1.x. We also get some new pipes that give us special functionality, such as the `async` pipe, which binds our templates to asynchronous resources. It's also easy to create our own pipes via the `@Pipe` decorator and the `pipes` key in our `@View` decorators.

You can find the code for this tutorial on [GitHub](https://github.com/auth0/angular2-pipes).






