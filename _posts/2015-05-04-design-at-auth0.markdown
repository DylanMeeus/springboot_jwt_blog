---
layout: post
title: "Design at Auth0"
description: "For the past year Auth0 has been growing at a fast pace, and as this happens, so has the number of fronts the Design Team has to tackle."
date: 2015-05-04 13:24
author:
  name: Ricky Rauch
  url: https://twitter.com/rickyrauch
  mail: ricky@auth0.com
  avatar: https://www.gravatar.com/avatar/27396b3fa24389198ef5d3e7e410e9c4?size=60
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- foo
---
For the past year Auth0 has been growing at a fast pace, and as this happens, so has the number of fronts the Design Team has to tackle.

In this post we’ll explain all the learnings we’ve had in implementing practices that help integrate design into our products, guarantee consistency, and optimize design choices.

![](http://assets.auth0.com/blog/design-process/process.png)

### Blueprints

The first practice we introduced was design from blueprints. A blueprint is just a monochrome draft of the final product, with as little focus on styling as possible.

[blueprint to mockup image]

We go through a lot of feedback from different stakeholders at the company, they might be engineers, marketers, analytics, or our own clients.
By taking away opinionated factors like color or embellishment from the process, blueprints help us get better feedback and achieve simpler solutions in a short amount of time.

### Asset production

We constantly review previous work when producing new assets to make consistency checks and understand how they have evolved over time, so we don’t repeat mistakes.
Our website is mapped out on a 1:1 scale with design files and is available on Dropbox to the whole team.

![](http://assets.auth0.com/blog/design-process/dropbox.png)

Using Sketch has dramatically improved the way we create and export assets. We really think it’s the better tool for the job because it was designed with the web in mind.

With tens of templates built in, it allows us to jump right into design. We reuse most of our visual components, and working with all-vector graphics saves us huge amounts of time while making changes to them. Exporting 1x, 2x and SVG assets at a one-click distance is also ridiculously easy.

### Mobile first front-end work

Most of the HTML and CSS at Auth0 its handled or refactored by a designer at some point. We’ve set clear guidelines for front-end code, and we’ve chosen [stylus] and [jade] to keep our codebases cleaner and smaller.

Over the last year, we started to migrate all of our pages into a mobile-first strategy.

The reasoning behind this starts from the design perspective: we set out to only present information that we can make available in a way that works on every device. This simplifies our approach to information architecture and also gives less room for errors during development.

[mobile > desktop pages image]

In order to maintain stability, we are making these changes progressively. Each page that gets a redesign, gets a mobile-first refactor to go with it.
A key factor in preventing Responsive Design from getting messy was abstracting all of our media queries to a [stylus mixin] and keeping them as close as possible to their relevant selectors, thus making them harder to overlook and easier to maintain.

<script src="https://gist.github.com/vctrfrnndz/3296c8087c0b07a7ab8a.js"></script>

### Styleguide for consistency

Styleguide is one of our most important projects. It’s aim is to help maintain the same look & feel across all of our products and making our front-end code reusable, no matter the specifics of any project’s codebase.

![](http://assets.auth0.com/blog/design-process/styleguide.png)

Styleguide holds values, patterns and specific components that repeat themselves across pages, enabling designers and engineers to quickly reuse them on any product without worrying at all about markup or css.

[footer & header image]

Elements like our Header, Footer and other components are easily maintained on different projects by using jade includes or mixins directly from Styleguide.

By reducing complex html structures and patterns to jade mixins and passing only content as parameters, we optimize development time.

[icons image]

Company colors, typography and icons are kept consistent by using the same set of variables and files for every project.

[consistency image]

We use [semantic versioning] to enforce certain versions of styleguide across projects. This helps maintain stability in our sites when doing heavy updates.

### Design Meetings

Tough we’re still a small group, there are already different kinds of designers in the team: some more adept in usability or visual design, and some more focused towards prototyping and code.

We established weekly design meetings as a simple “show and tell” exercise to feed off each others work and be on the loop of what’s been going on during the week for other projects.

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="4" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://instagram.com/p/2HXZopiTi7/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_top">Design Meeting @auth0</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Ricardo Rauch (@rickyrauch) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-04-30T22:01:28+00:00">Apr 30, 2015 at 3:01pm PDT</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>

That’s it.

We’re are always looking for ways to improve and optimize our process. We hope some of our practices can prove useful for anyone interested on collaborating in product design, and if you have suggestions or thoughts we’ll be glad to hear them.
