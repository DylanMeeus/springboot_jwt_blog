---
layout: post
title: "ng-conf 2016 Summary - Day Two"
description: "Day two of ng-conf 2016 was Fair Day. We got to deep dive and learn more about what's in the pipeline for Angular 2."
date: 2016-05-06 08:30
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

Day two of ng-conf was titled **Fair Day**. Fair day consisted of a brief keynote in the morning and then a series of breakout sessions and workshops allowing developers to deep dive into all the new technologies announced on day one. Check out our [recap of day one](https://auth0.com/blog/2016/05/05/ng-conf-summary-day-1/) to learn about these technologies which include Angular Universal, Material, CLI, Augury and Mobile Toolkit.

## The Future of Angular 2

It may be a bit early to discuss the future of Angular 2 when it's not even out yet officially, but a key theme of today's keynote was the future of Angular 2. Angular offline compiling, advanced Material Design components and effortless upgrades for the future were discussed.

{% include tweet_quote.html quote_text="It's early to discuss the future of Angular 2, but the theme of the day 2 keynote was looking ahead." %}

### Offline Compiler

Offline compiling is what allows the Angular 2 library to become smaller than Angular 1. This is done through a custom compiler that the Angular team built, which is invoked through the `ngc` command once installed, which examines your apps code and does tree shaking to remove any unnecessary modules. The ng-compiler is one of the key features of Angular 2 that is required before Angular 2.0 can be delivered but as of today it is not ready.

### Advanced Material Components
The Material Design team gave a brief talk about the future of Material Design with Angular 2. The team has already committed to parity with the existing Material 1 for Angular 1.x, but talked about future potential with components that could include components such as `<md-map>` which would embed a Google Map or `<md-chart>` which would be used for charting UI. The coolest potential component discussed was `<md-text-editor>` which would create a WYSIWYG text-editor which have traditionally been difficult to implement, especially with Angular 1 applications.

### Seamless Upgrades

Finally, the team discussed effortless future upgrades and even joked about Angular 3. The goal here is to give developers a seamless path to upgrading once future 2.x versions of Angular are released. The Angular team is already doing extensive testing to ensure that any change to the core Angular libraries does not break compatibility with existing modules. 
 
## Angular 2 Workshops
  
There were plenty of Angular 2 workshops that took a deep dive into some of the technologies announced on day one of the keynote. Ionic had a great presentation on building hybrid mobile apps with Ionic 2 and Angular 2. The Telerik team took to the stage again and gave a detailed walkthrough of how to build native mobile applications with Angular 2 and NativeScript. Sean Larkin did a great workshop on integrating Angular 2 with Webpack.
 
 Auth0 hosted a workshop on integrating JSON Web Token (JWT) authentication with both Angular 1.x and Angular 2. The workshop highlighted the benefits of JWT authentication as well as differences in implementation between the two frameworks. If you would like to learn how to implement JWT authentication in your app check our guide for both [Angular 1](https://auth0.com/docs/client-platforms/angularjs) and [Angular 2](https://auth0.com/docs/client-platforms/angular2).
 
## Conclusion - Day 3 Preview
 
 Tomorrow is the final day of ng-conf 2016. TypeScript, Animations, React Native and AngularFire are just some of the talks in store. We can't wait to learn more about Angular 2 and will be sure to give a detailed summary of day three. You can follow the live stream tomorrow on the ng-conf official [website](https://www.ng-conf.org/). 