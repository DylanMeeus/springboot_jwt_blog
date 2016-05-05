---
layout: post
title: "ng-conf 2016 Summary - Day One"
description: "Angular 2 has reached the release candidate milestone. Learn more and get caught up on all the news coming out of ng-conf 2016."
date: 2016-05-05 08:30
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#000000"
  image: "https://cdn.auth0.com/blog/ngconf2016/ng-conf-logo.png"
tags: 
- Angular
- Angular 2
- angular
- ng-conf
- Angular Universal
- Angular Mobile Toolkit
- Angular CLI
---

The annual [ng-conf](https://www.ng-conf.org/) conference is upon us once again. This year, Angular 2 is all the rage. Angular 2 has entered [release candidate](https://github.com/angular/angular/blob/master/CHANGELOG.md#200-rc0-2016-05-02) and is inching ever-closer to a final 1.0...err...2.0 release.

In today's short post, we'll recap all the big announcements coming out of ng-conf 2016.

## Keynote

[Brad Green](https://twitter.com/bradlygreen) opened up ng-conf this year with some pretty impressive announcements. Over 360,000 developers are already using Angular 2 in some capacity. Angular 2 is five times faster than Angular 1 and is already smaller than Angular 1 by almost 20kb which will help reduce load times of Angular 2 developed apps. Brad also announced a variety of Angular products that will truly make Angular 2 a leading platform for developing web and mobile applications. We'll examine these in depth below.

{% include tweet_quote.html quote_text="Angular 1 is a framework. Angular 2 is a platform. - Brad Green" %}

### Angular Universal

![Angular Universal](https://cdn.auth0.com/blog/ngconf2016/universal.png)

[Angular Universal](https://universal.angular.io) will allow developers to run their Angular 2 applications directly on the server. With Angular 1, the applications always ran on the client side, which made things like search engine optimization (SEO) and social sharing links difficult to implement as web crawlers generally do not execute JavaScript before scraping a webpage. When a user would share an Angular 1 app to Twitter for example, rather than seeing the title and description of the post they would instead see angular bindings `{title}` and `{description}` unless the developer spent extra time implementing a prerenderer.

Angular Universal currently works with [NodeJS](https://nodejs.org/en/) and [ASP.NET](http://www.asp.net/), with more frameworks and languages supported in the future. Applications are built just as they would be on the front end with some slight changes to accompany features that servers do not have available such as setting up a redis store instead of localstorage. Angular Universal apps are rendered on the server and then sent to the client. This greatly increases load times on mobile devices and makes the apps feel snappier.

### Angular CLI

![Angular CLI](https://cdn.auth0.com/blog/ngconf2016/cli.png)

[Angular CLI](https://cli.angular.io) aims to simply the way developers build Angular 2 apps. Where in the past you'd have to do a lot of the manual configuration to get up and running, with Angular CLI, you can type simple commands in your terminal such as `ng generate component` and the CLI will scaffold a new component for you.

The Angular CLI will do more than just scaffold new components and services for you though. It will help with both the build and deploy stages as well as linting, testing and formatting your applications.

### Angular Mobile Toolkit

![Angular Mobile](https://cdn.auth0.com/blog/ngconf2016/mobile.png)

[Angular Mobile Toolkit](https://mobile.angular.io) will allow developers to build progressive mobile apps with Angular 2. Progressive mobile apps are an evolution of mobile apps built with HTML, CSS and JavaScript with a few key features: **instant loading**, **offline support**, **installable** and **handle notifications**.
 
 The debate between building native vs progressive mobile is heavily debated and both have their pros and cons. Native apps have **better performance**, **re-engagement** and **access to hardware APIs**. Web apps on the other hand have **searchability**, **shareability** and **less friction/wider marketshare** going for them.
 
 The good news with Angular 2, you can build both native mobile apps, which we'll get to in a bit, as well as progressive mobile apps.
 
 {% include tweet_quote.html quote_text="Angular 2 allows developers to build both native and progressive mobile apps." %}
 
### Material 2

![Angular Material](https://cdn.auth0.com/blog/ngconf2016/material.png)
 
The de-facto design language for Android is [Material Design](https://www.google.com/design/spec/material-design/introduction.html), which is slowly making it's way to the web. Angular 1 already has a great library which implements a variety of Material Design patterns and Angular 2 is getting the same treatment. [Material 2](https://material.angular.io/) is in an early alpha state at present but already has a variety of components implemented including checkboxes, form input elements, buttons and more.
 
Material 2 will allow developers to quickly build beautiful user interfaces without having to write a lot of custom CSS. The Material 2 team has also announced that they are working on a "Component Toolkit" which will implement best practices for building user interfaces with Angular 2 that will be decoupled from Material Design itself.
 
### Augury for Angular 2

![Angular Augury](https://cdn.auth0.com/blog/ngconf2016/augury.png)
 
 [Augury](https://augury.angular.io/) (formerly Batarangle) is a Chrome extension that will help developers debug and understand how their Angular 2 application is running in real time. The app is built by [Rangle.io](http://rangle.io/) and offers a whole suite of features to help developers understand their apps component relationships, get detailed component info as well as understand the component hierarchy. Augury will also help developers understand how routing is affecting their app as well as allow developers to edit component attributes on the fly and see those changes reflected in real time.
 
## Angular 2 Becomes A Platform
 
 If there's one key takeaway from today, it's that Angular 2 is a platform for app development. The core library has been broken up and modularized into logical components, tooling has greatly improved and extending Angular 2 to support other frameworks is becoming a reality. Let's look at some of the other announcements made today.
 
### Native Mobile Applications with NativeScript 2.0
 
 [NativeScript 2.0](https://www.nativescript.org/) was announced today with support for Angular 2. NativeScript 2.0 allows developers to build native mobile applications with Angular 2. Nativescript converts Angular 2 code into the native iOS and Android API calls which are then executed as if you were writing a native mobile application in Objective-C or Java. A huge feature that Nativescript also supports is the ability to use existing native iOS Cocoa Pods and Android Gradle plugins directly in your TypeScript code.
 
### Component Router
 
 The Router in Angular 2 is very powerful. Misko Hevery, the father of Angular, gave a presentation on the new router and how it will improve performance of Angular 2 applications. The Angular 2 Router will only load components when it absolutely needs them. The componetized router also handles the declaration of routes in a unique way. Rather than have a single route definition file that lists all the possible routes your app will have, you declare routes in each of your components. This way, you separate the routing concerns to individual components.
 
## Aside: Auth0's Angular 2 JWT Library
 
 Now is the perfect time to deep your feet into Angular 2 development. If you are building a consumer facing app, you are likely to need a user authentication system. Here at Auth0, we've built a [helper library](https://github.com/auth0/angular2-jwt) for handling JSON Web Token (JWT) authentication. The Angular 2 JWT library can help you integrate JWT authentication with both the Auth0 platform or your own authentication system.
 
 If you would like a crash course into Angular 2, check our Ryan Chenkie's Angular 2 series starting with [Angular 2 Pipes](https://auth0.com/blog/2015/09/03/angular2-series-working-with-pipes/).
 
## Conclusion and Additional Resources
 
 Day 1 of ng-conf has been exciting. Angular 2 is shaping up to become a great platform for building both web and mobile applications that can run on both the server and client. This is a highly ambitious goal by the team, but one that seems attainable after today.
 
 To conclude, I'll leave you with a list of additional resources and links to help you both learn Angular 2 and stay up to date with the latest news and announcements.
 
 * [ng-conf Live Stream Day 2](https://www.ng-conf.org/#/) *(starting at 9am PST)* - tune in Day 2 of ng-conf for more talks
 * [Angular 2 Style Guide](https://angular.io/styleguide) - learn Angular 2 best practices
 * [Angular 2 TypeScript Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) - written by [John Papa](https://twitter.com/John_Papa), a collection of snippets to help you write Angular 2 code faster
 