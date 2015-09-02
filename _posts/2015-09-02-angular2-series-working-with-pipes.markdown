---
layout: post
title: "Angular 2 Series - Part 1: Working with Pipes"
description: "Learn how to implement pipes (formerly known as filters) in your Angular2 apps"
date: 2015-09-02 08:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image_bg_color: "linear-gradient(#0143A3,#0273D4)"
  bg_color: "linear-gradient(#0143A3,#0273D4)"
  image: https://cdn.auth0.com/blog/angular2-series/angular2-logo.png
  image_size: "70%"
tags: 
- falcor
- falcorjs
- jsongraph
- falcor-express
- javascript
---

---

**TL;DR:** Angular 2 replaces filters from Angular 1.x with **pipes**. Many of the filters from Angular 1.x carry over to pipes, but we also get some new ones. Check out [the repo](https://github.com/auth0/angular2-pipes) for this tutorial to see the pipes in action and to find out how to create your own custom pipes.

---

> Auth0's Angular 2 series brings you tutorials on how to implement the latest features from the framework using the most recent Alpha release at the time of writing.

## From Filters to Pipes

AngularJS 1.x filters are a great help for formatting output in our templates. With Angular 2, we get this same great feature, but now they are called **pipes**. At the time of this writing, there are an equal number of filters from Angular 1.x to pipes in Angular 2, but there isn't direct crossover. Here is a table for comparison:

| Filter/Pipe Name | Angular 1.x | Angular 2 |
| ---------------- | :---------: | :-------: |
| currency         | &#10003;    | &#10003;  |
| date             | &#10003;    | &#10003;  |
| uppercase        | &#10003;    | &#10003;  |
| json             | &#10003;    | &#10003;  |
| limitTo          | &#10003;    | &#10003;  |
| lowercase        | &#10003;    | &#10003;  |
| number           | &#10003;    |           |
| orderBy          | &#10003;    |           |
| filter           | &#10003;    |           |
| async            |             | &#10003;  |
| decimal          |             | &#10003;  |
| percent          |             | &#10003;  |

In this article we will explore the features provided by some of the pipes that weren't seen before in Angular 1.x filters. We'll also see how we can create a custom pipe of our own and use it in our templates. 

You'll need to have an Angular 2 sandbox setup for this tutorial. A good one to get started with is [ng2-play](https://github.com/pkozlowski-opensource/ng2-play) by [Pawel Kozlowski](https://twitter.com/pkozlowski_os).

## Basic Pipes

Many of the pipes provided by Angular 2 will be familiar if you have worked with fitlers in Angular 1.x. Pipes are accessed in our templates the same way that filters were--with the "pipe" character `|`. For example, we can use the `date` pipe to transform a date object anyway we like by providing it an argument for formatting:

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

We pointed our `@View` decorator to a `templateUrl` where we make use of the `date` pipe: 

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

New in Angular 2 are the `decimal` and `percent` pipes. These take an argument that describes the "digit info" that should be used--that is, how many integer and fraction digits the number should be formatted with. The argument that we pass for formatting follows this pattern: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

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

Angular 2 provides a special pipe called `async` which allows us to bind our templates directly to values that arrive asynchronously which is great for working with promises and observables. To see how this works, we'll create a simple promise and have it resolve with a string.

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

Previous to Alpha 35, we had to configure our custom pipes with a `pipes` object. Now, however, we can define a pipe with the decorator `@Pipe` and use it by adding a `pipes` property to the `@View` decorator with the name of the pipe class. This makes it easier and more convenient to register our custom pipes.

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
The `transform` method is where we do any logic to convert the `value` that is being passed in. We can get ahold of the arguments array as the second parameter and pass in as many as we like from the template. As you can see here, we check the type of conversion that we want (Fahrenheit to Celsius), convert the `value` passed in, and then return the converted value to the number of decimal places specified in the second argument of the pipe.

As mentioned above, we need to provide an array to the `pipes` property in the `@View` decorator to make use of the new pipe.

![angular2](https://cdn.auth0.com/blog/angular2-pipes/angular2-pipes-1-4.png)

## Aside: Using Angular with Auth0

Auth0 issues **JSON Web Tokens** on every login for your users. That means that you can have a solid identity infrastructure, including Single Sign On, User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. We implemented a tight integration with Angular 1. Angular 2 integration is coming as soon as it's on Beta! You can read the [documentation here](https://auth0.com/docs/client-platforms/angularjs) or you can checkout the [SDK on Github](https://github.com/auth0/auth0-angular)

<img src="https://docs.google.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/pub?w=1219&amp;h=559" style="border: 1px solid #ccc;padding: 10px;">

## Wrapping Up

Angular 2 gives us some great pipes that carry over well from the filters we are used to from Angular 1.x. We also get some new pipes that give us special functionality, like the `async` pipe that binds our templates to asynchronous resources. It's also easy to create our own pipes via the `@Pipe` decorator and the `pipes` key in our `@View` decorators.

You can find the code for this tutorial on [GitHub](https://github.com/auth0/angular2-pipes).






