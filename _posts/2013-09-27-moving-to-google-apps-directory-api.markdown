---
layout: post
title: "Moving to Google Apps Directory API"
date: 2013-09-27 15:05
outdated: true
alias: /2013/09/27/moving-to-google-apps-directory-api/
author:
  name: José F. Romaniello
  url: "http://joseoncode.com"
  mail: "jfromaniello@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png"
tags:
- Google Apps
- announcements
description: "We are moving from the deprectad Google Apps Provisioning API to the new Google Apps Directory API. This will affect you only if you are using Google Apps"
---


We are moving from the deprectad [Google Apps Provisioning API](https://developers.google.com/google-apps/provisioning/) to the new [Google Apps Directory API](https://developers.google.com/admin-sdk/directory/).

__This will affect you only if you are using Google Apps and the `/users` endpoints of Auth0.

<!-- more -->

Google Apps Provisioning API has been deprectated few months ago, on the other hand the new API has some advantages like providing a public link for the profile photo and having more granular scopes.

__Previously permisive scope:__

![Previously permisive scope](http://blog.auth0.com.s3.amazonaws.com/ss-2013-09-27T15-17-16_safe_save_152024.png)

__New granular scope:__

![New granular scope](http://blog.auth0.com.s3.amazonaws.com/ss-2013-09-27T15-25-52_safe_save_152637.png)

In order to have access to this API enable the "Admin SDK" service in the [Google API Console](https://code.google.com/apis/console) as follows:

![ss-2013-09-27T15-33-02.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-09-27T15-33-02.png)

New __Google Apps Connections__ will automatically use this new API and pre-existing connections will need to be re-provisioned by following the provisioning link. If you are the domain administrator follow this link, if not copy and send the link to the domain admin:

![](https://dl.dropbox.com/s/6hojv2cdhl1sw6i/ss-2013-09-27T15-28-44.png)

Until you have done this step, the `/users` endpoint will return only the users that have signed in to your app at least once.
