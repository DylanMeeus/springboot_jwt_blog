---
layout: post
title: "Announcing the Auth0 Open Source Single-Sign-On Dashboard"
description: "Remembering usernames and passwords and login urls for all of these apps is a pain. With this app we take another step in simplifying the authentication experience."
date: 2015-04-28 10:00
author:
  name: Nathan Totten
  url: http://twitter.com/ntotten
  mail: ntotten@auth0.com
  avatar: https://www.gravatar.com/avatar/d48b998c2dce49ca309710eba498c562.png?s=60
design:
  bg_color: "#4a5259"
  image: https://cloudup.com/cfENOYpKxfL+
  image_size: "200%"
  image_opacity: "0.8"
tags:
- product
related:
- 2015-09-23-what-is-and-how-does-single-sign-on-work
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
---

**tl;dr**: Control which apps your users can access with an SSO dashboard. Download the [code](https://github.com/auth0/auth0-sso-dashboard) or [deploy to Heroku](https://dashboard.heroku.com/new?template=https%3A%2F%2Fgithub.com%2Fauth0%2Fauth0-sso-dashboard) in 5 minutes.

Today, we are excited to announce the release of the Auth0 [Open Source Single-Sign-On Dashboard](https://github.com/auth0/auth0-sso-dashboard). This SSO dashboard is designed to solve a problem familiar to many people. Organizations of all sizes maintain a variety of different applications to handle various business functions like accounting, HR, development, support, etc. Remembering usernames and passwords and login urls for all of these apps is a pain. With this app we take another step in simplifying the authentication experience.

{% include tweet_quote.html quote_text="Today, we are excited to announce the release of the Auth0 Open Source Single-Sign-On Dashboard." %}

<!-- more -->

![SSO Dashboard](https://cloudup.com/cfENOYpKxfL+)

You can find the entire source of this project on [Github](https://github.com/auth0/auth0-sso-dashboard) along with instructions on how to deploy and configure a dashboard for your own organization. Additionally, you can try out a demo version (with non-functional apps) at [https://ssodashboard.herokuapp.com](https://ssodashboard.herokuapp.com). Username: `publicdemo` Password: `TestUser123`. This demo only shows the user functionality; if you would like to see the full admin capabilities, please deploy your own instance.

A few key features of the SSO Dashboard:

* Landing page showing all apps that a user is allowed to access.
* Self-service user profile updates.
* Administrator interface for configuring roles, apps, and users.
* Completely customizable UI.

## Completely Open Source
Our approach to this project, like many projects at Auth0, was to build this as an open source app. This approach gives our users the most flexibility while still being very easy to maintain and receive updates.

* Node.js Backend (Express)
* React, Flux, and React-Router
* Bootstrap ([Paper Theme](https://bootswatch.com/paper/)) and [Material UI](http://callemall.github.io/material-ui/#/)
* [Babel](https://babeljs.io/) to enable ES6
* [Webpack](https://webpack.github.io/) for asset bundling

Feel free to fork and clone this project. We will accept pull requests and [issues](https://github.com/auth0/auth0-sso-dashboard/issues) if you want to contribute back.

If this is something you have been looking for at your company or organization do give it a try. Let us know what you think, we will be adding features based on feedback.
