---
layout: post
title: "Using Auth0 &amp; Appery.io to build mobile apps with Identity Management"
date: 2014-07-11 12:33
outdated: true
author:
  name: "Dmitry Zaytsev"
  url: "http://appery.io/"
  mail: "dzaytsev@exadel.com"
  avatar: "https://cloudup.com/csgyy2LVyeE+"
tags:
- authentication
- mobile
- ios
- android
- auth0
- apperyio
- login
- signup
---

_This is a guest post by Dmitry Zaytsev. He is the Developer Evangelist at [Appery.io](http://appery.io)_


Building mobile apps with identity management wasn't simple, until now. [Auth0](http://auth0.com/), a cloud service that eliminates the friction of identity for your app, and [Appery.io](http://appery.io/), the only cloud platform with visual development tools and integrated backend services are collaborating to make this happen.  With the jointly created Appery.io Auth0 plugin, you can simplify identity management integration for your app and this post will show you how.

Register for the Auth0 and Appery.io joint webinar on August 6, 2014 at 11:00 AM PT

**_Building Secure Mobile Apps in the Cloud with Appery.io and Auth0 Identity Management_**

[Register now](http://www.exadel.com/08062014Webinar)

<!-- more -->

## Appery.io Platform

[Appery.io](http://appery.io/) is the only cloud-based platform with visual development tools and integrated backend services. Appery.io provides a powerful visual environment to build HTML5 and hybrid mobile apps connected to any APIs.

The Appery.io platform provides the following core features:

* Build HTML5 mobile apps and hybrid apps for iOS, Android, and Windows Phone

* Drag and drop visual app builder for quickly building the app UI, with Source view for customizing the UI with any code

* Connect to any cloud API service, and bind the service to the page via a visual binding editor

* Integrated backend services that include: cloud database, push notifications, and server code

* HTML5 app hosting

* Fast testing in browser, and on device via Appery.io Mobile Tester app

* Collection of plugins that provide fast integration with popular API providers

## Visual App Builder

Building app UI in Appery.io is very fast using the advanced visual builder. The mobile UI components are on the left-hand side. To build the UI, you simply drag and drop the components into the device. Every UI component has properties which can be set via the Properties panel (on the right):

![Visual App Builder](https://lh5.googleusercontent.com/B2DAF0cEAbgb3FsiqaInSdZ8RkkHLExj5-9izi1aR2mnTxQliOZkF3ZMUJ6IP4RhqVq5hWiFkVULkd3iy99u8sidtNSISkwnWacj_JSkkbBKLbVDQFuPOrGAwq3waXLncg)

Adding actions to a button click is quickly done via the Events tab. For instance, you can write any JavaScript to be invoked on a button click (or other event):

![Visual App Builder 2](https://lh3.googleusercontent.com/7GyJZC8SXIFWrwOiyWBTgEMfv081O7ieCVrQowtQWDXyDV12f49KNkdzw7oCbRgV67SnMw0PuRnnATbWN0U_c4fkCPZTJajT2OC_o-Ks6aCSG9-6bAEvGIvtdPOVU_QvWg)

## REST API Services

Building app UI is important but also is connecting with any 3rd party APIs such as Salesforce, Facebook, SendGrid, and Auth0. Appery.io solves this problem by making it very fast and easy to add any API to the app, and the bind it to the page using visual data binding. This is an example defining a service that returns Auth0 token information:

![Rest Api Services](https://lh3.googleusercontent.com/38L2zBGsejbOwDDDVGiTlsSsYepC8XLAQiDzR_fNpz1i02hmbA9BVE4dyM1r7APEZogKuxb2tWMH7mDzc0WymXh-FLM_Oym8rYuQI7oAZkDNXwUnXK7PzvWEJ1qS6OD2eQ)

Mapping the data returned from Auth0 service to a page:

![Rest Api services 2](https://lh6.googleusercontent.com/f0v1GEYi6GUCP1Z064X4Fr47F-vbzARBElLwEF5bwDvh7a7OAGoQV1agDDozkV6IxGdYRVlRo90sJqnboq5nFJA9yjQnW2tCRhik2JvvIELZn-gtZu-ANgQU0MPCwt5TFw)

## Integrated Backend Services

The Appery.io Backend Services includes three main features:

1. Cloud database for quickly storing any app data

![Integrated backend services](https://lh3.googleusercontent.com/J6hLmFvRmo_1AeIDfcfRt_xTRlp98RrP8Z3UOjFsRojVBMtZvyFH8kUV2K8lKYblaGVLFUYqOT5Sa_qEnt1DTUyV6JSD3ZlKjt-XV7xj6W_t6CYyhbZIFJTJm6BP6H55eQ)

2. Push notifications for sending messages to users who installed the app:

![Rest Api services 2](https://lh5.googleusercontent.com/I_BtkIOTQYzvaUJ1zQYVdXpg__MpJDy2VXbsCXXmnLfmw0X5WrHsFckKIZ2E9br6Vk6AwpZv2TZ0t9AOOQu7tSsGw1ArySLTpYZg4dcER3ojZB9vmsKQy1uf980NqBuegw)

3. Server Code enables writing custom and scalable business logic using JavaScript in the Appery.io cloud without the need to build and maintain server infrastructure:

## Auth0 Plugin

Appery.io provides a collection of ready-to-use plugins for various API providers. We are happy to announce the new Auth0 Identity Management plugin. The Auth0 plugin now makes it even faster to build apps with Auth0 zero-friction identity management solution.

![Auth0 Plugin for Appery](https://lh6.googleusercontent.com/ppOeUfH8YjtxPFsNAUql8TftkmrTnBzHpbsXnScEE3JYmnrdnH3FUnC2bX-fTGvgQo3_4395uKX398DmQbOfFRg_hJTpPOSs_Fulh4dUk1lF09HiNdzOdex_XER4pDXCWg)

Steps to add Auth0 plugin to Appery.io app:

1. Create an Appery.io app.

2. Import the Auth0 plug-in (use search to find it).

3. Opent the *Auth0_Setting* and fill it with Auth0 app data. There are three parameters, two of them (**Domain** and **Client Id)** you can simply copy from the Auth0 website:

4. ![Auth0 App Settings](https://lh5.googleusercontent.com/kILU4jMp7WNqyUDzgwrB-FA-3TAJ-Sp32p8ITryDkPYVYCn8_a8GVwwmAweF-OtAQvsFt0iDe6UcCiUjeD8s9ZTeCPI4g64odHhDicvmCob5eHMw0IJhap3MSDkJEOhFCw)

5. The third parameter is the **redirect_uri**. The same value of this parameter should be entered in **App Callbacks URLs** in **Auth0 app settings**. Here is how it should look:

6. http://appery.io/app/view/APPERY-IO-APP-ID/Auth0_User.html

Generally, that's all you need to configure. With the Auth0 plugin imported, you can add new login option to your app via Auth0 services. Your app can now easily support login with any of the large number of Auth0 social and enterprise login providers.

![Auth0 Widget](https://cloudup.com/cI2LilQrCOd+)

Easy, isn't it? Now your Appery.io app can use all features of Auth0 services. We created  a step-by-step [tutorial](http://devcenter.appery.io/documentation/plugins/using-the-auth0-plug-in-for-simple-identity-managment/) on how to add and use the Auth0 plugin in your app.

To learn more about building mobile apps in Appery.io with Auth0 services, please attend our joint webinar:

Register for Appery.io and Auth0 joint webinar on August 6, 2014 at 11:00 AM PT

**_Building Secure Mobile Apps in the Cloud with Appery.io and Auth0 Identity Management_**

[Register now](http://www.exadel.com/08062014Webinar)
