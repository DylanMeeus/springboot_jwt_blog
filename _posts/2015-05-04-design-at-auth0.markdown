---
layout: post
title: "Engineering the Design Process at Auth0"
description: "Our lessons in defining a cohesive design language <br /> across all our products."
date: 2015-05-04 13:24
draft: true
author:
  name: Ricky Rauch
  url: https://twitter.com/rickyrauch
  mail: ricky@auth0.com
  avatar: https://www.gravatar.com/avatar/27396b3fa24389198ef5d3e7e410e9c4?size=60
design:
  bg_color: "#222228"
  image: https://cldup.com/P7V08dAY6M.png
  image_bg_color: "#222229"
  image_size: "101%"
tags:
- foo
---
<!-- image: https://cldup.com/P7V08dAY6M.png -->
<style>
.entry-thumbnail{background: none;}
</style>
<img src="http://assets.auth0.com/blog/design-process/sites.png" class="expand" />

For the past year Auth0 has been growing at a fast pace and naturally so has the number of fronts the Design Team has had to tackle.

In this post we’ll explain what we've learned as we’ve implemented practices that help integrate design into our products, guarantee consistency, and optimize design choices.

<img src="http://assets.auth0.com/blog/design-process/process.png" class="" />

### Blueprints

The first practice we introduced was design from blueprints. A blueprint is just a monochrome draft of the final product, with as little focus on styling as possible.

<img src="http://assets.auth0.com/blog/design-process/blueprint.png" class="expand" />

We go through a lot of feedback from different company stakeholders, including engineers, marketers, analytics, or our own clients. By taking subjective factors like color or embellishment out of the process, blueprints help us get better feedback and achieve simpler solutions in a shorter length of time.

### Asset production

We constantly review previous work when producing new assets to check for consistency and understand how they have evolved over time, so we don’t repeat mistakes.

Our website is mapped out on a 1:1 scale with design files and is available to the whole team on Dropbox.

<img src="http://assets.auth0.com/blog/design-process/dropbox.png" class="expand" />

Using Sketch has dramatically improved the way we create and export assets. We think it’s the best tool for the job because it was designed with the web in mind.

<!-- With its numerous built-in templates, it allows us to jump right into design. We reuse most of our visual components, and working with the all-vector graphics saves us huge amounts of time when we're making changes to them. Exporting 1x, 2x, and SVG assets at a one-click distance is also ridiculously easy. -->

### Mobile first front-end work

Most of the HTML and CSS at Auth0 its handled or refactored by a designer at some point. We’ve set  [clear guidelines](https://github.com/auth0/code-conventions/blob/master/frontend/README.md) for front-end code, and we’ve chosen [stylus](https://learnboost.github.io/stylus/) and [jade](http://jade-lang.com/) to optimize our productivity. As a result, we write concise, clear code much faster.

Over the past year, we started to migrate all of our pages as part of a mobile-first strategy.

The rationale behind this strategy starts with the design perspective: we set out to only present information that we can make available in a way that works on any device. This simplifies our approach to information architecture by getting rid of unnecessary elements and solving problems in the simplest way, which also reduces the potential for errors during development.

<img src="http://assets.auth0.com/blog/design-process/mobile-first.png" class="expand" />

In order to maintain stability, we are making these changes progressively. Each page that gets a redesign gets a mobile-first refactor to go with it.

A key factor in preventing Responsive Design from getting messy was abstracting all of our media queries to a [stylus mixin](https://github.com/auth0/styleguide/blob/master/lib/mixins/index.styl#L11) and keeping them as close as possible to their relevant selectors, thus making them harder to overlook and easier to maintain.

```css
.hero-cta
  color: blue;
  border-radius: 3px;
  padding: 10px 20px;
  max-width: 100%;

  +breakpoint("tablet")
    max-width: 620px;
    font-size: 18px;

  +breakpoint("desktop")
    max-width: 740px;
    font-size: 20px;
```

### Styleguide for consistency

Styleguide is one of our most important projects. Its aim is to help maintain the same look and feel across all of our products and to make our front-end code reusable, no matter the specifics of any project's codebase.

<a href="https://styleguide.auth0.com"><img src="http://assets.auth0.com/blog/design-process/styleguide.png" class="expand" /></a>

Styleguide holds values, patterns, and specific components that repeat themselves across pages, enabling designers and engineers to  quickly reuse them on any product without worrying about markup or css.

<img src="http://assets.auth0.com/blog/design-process/consistency.png" class="expand" />

- Elements like our [Header](https://github.com/auth0/web-header), Footer, and other components are easily maintained on different projects by sourcing them directly from [Styleguide](https://styleguide.auth0.com).

- By reducing complex html structures and patterns to jade mixins available through [Styleguide](https://styleguide.auth0.com) and passing only content as parameters, we optimize development time.
  <!-- <img src="http://assets.auth0.com/blog/design-process/icons.png" class="" /> -->

- Company [colors](https://styleguide.auth0.com/#colors), [typography](https://styleguide.auth0.com/#typography), and [icons](https://styleguide.auth0.com/#icons) are kept consistent by using the same set of variables and files for every project.

- We use [semantic versioning](http://semver.org/) to enforce certain versions of Styleguide across projects. This helps maintain stability in our sites when we're doing heavy updates.

Today, we can include Styleguide using Bower, Component() or linking [directly from the CDN](https://cdn.auth0.com/styleguide/latest/index.css).

If you are interested, [check the live version](https://styleguide.auth0.com) or [view the code on Github](https://github.com/auth0/styleguide).

### Design Meetings

Though we’re still a small group, there are already different kinds of designers on the team, some more adept in usability or visual design, and some more focused on prototyping and code.

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="4" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://instagram.com/p/2HXZopiTi7/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_top">Design Meeting @auth0</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Ricardo Rauch (@rickyrauch) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2015-04-30T22:01:28+00:00">Apr 30, 2015 at 3:01pm PDT</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>

We have established weekly design meetings as a simple “show and tell” exercise to feed off each other's work and be in the loop of what’s been going on during the week with other projects. This adds a big picture perspective to all the work that's been done and complements daily feedback by showing the whole team the impact of design on our products.

That’s it.

We’re are always looking for ways to improve and optimize our process. We hope some of our practices can prove useful for anyone interested on collaborating in product design, and if you have suggestions or thoughts we’d be glad to hear them.
