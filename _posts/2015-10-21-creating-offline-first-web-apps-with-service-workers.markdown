---
layout: post
title: "Creating Offline-First Web Apps with Service Workers"
description: "Learn about the importance of creating an offline-first experience for app users and how to accomplish it easily with the Service Worker API"
date: 2015-10-21 16:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  bg_color: "#444C52"
  image: https://cdn.auth0.com/blog/offline-first/offline-first-logo.png
  image_size: "120%"
tags:
- offline
- offline-first
- upup
- service-workers
- mobile
- hybrid-apps
- javascript
---

---

**TL;DR:** It can be tricky to serve users a good offline experience when they become disconnected from the internet while using a web app. However, providing offline functionality is important for UX, and there are some recent technologies that make it easier for developers to accomplish it. In this article, we focus on the **service worker API** and find out how to use it with a library called **UpUp** to make our apps offline-first.

---

With application users no longer constrained to devices that are always connected to the internet, it's more important than ever that applications have a good way to handle poor or no network connection. Ideally, apps should still work when the network connection is lost, and should have some mechanism for local data storage that is synced with a remote database once reestablished. We've grown accustomed to this kind of functionality in many ways, as native applications provide mechanisms to accomplish it easily. We can achieve the same effects in mobile hybrid apps, as well as web apps in general, with some relatively new technologies.

In this article, we'll explore what the current state of offline-first applications is, and see what kind of approach we can take in our own apps to ensure a smooth user experience, even when disconnected. We'll talk about [**service workers**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and how they can be used either directly, or with a helper library called [**UpUp**](https://github.com/TalAter/UpUp).

## Service Workers for Offline Apps

We're all familiar with what happens when we become disconnected while using the web--we try to move forward on the page or in the app, and we're greeted with a message that tells us we can't.

![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-1.png)

What we need, then, is a way for our app to detect when we don't have an internet connection, and then respond in a different and particular way when there isn't one. This is where the **service worker API** comes in. In fact, this technology is focused mainly on making it easier for developers to provide good offline experiences for users.

A service worker is a bit like a proxy server between the application and the browser, and has quite a bit of power. With a service worker, we can completely take over the response from an HTTP request, which allows us to alter it however we like. This feature is key for serving an offline experience. Since we can detect when the user is disconnected, and we can also respond to HTTP requests differently, we have a way of serving the user files and resources that have been saved locally when they are offline.

![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-diagram.png)

## Service Workers > AppCache
 
The service worker API is largely an attempt to replace the HTML5 **Application Cache**. Nothing is perfect, but AppCache has a host of issues that often leave developers frustrated when trying to create offline experiences. Perhaps one of the biggest issues is that apps won't work at all unless AppCache is set up just right, which means debugging is very tricky. With AppCache, only same-origin resources can be cached, and when it comes to updating resources, it's all or nothing--we can't update cached items individually.

Service workers really shine when stacked up against AppCache. Since they give us a lot of fine-grained control, we're able to customize the process of serving on offline experience. Some of this ability is because service workers use promises, which allow us respond to both `success` and `error` conditions.   

## Registering a Service Worker

So how do we make use of service workers? We can access them through the `navigator` API and hook up new service workers with the `register` method.

```js
if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js', { scope: './'})
    .then(function(registration) {
      console.log('Service worker registered!');
    })
    .catch(function(error) {
      console.log('There was an error!');
    });
}
```

Service workers are tied to a particular scope, and the location of the service worker script in the project directory is important. If we want the above service worker to apply to any route in our application, we would need to have the `sw.js` script accessible at `http://example.com/sw.js`.

With the service worker registered, we need to define what happens when certain events--such as `fetch`--occur. Instead of rolling out a full example on our own, let's make use of a small library called [UpUp](https://github.com/TalAter/UpUp). This library provides a service worker abstraction that makes it easier for us to simply define which resources we want to have available when the user is offline.

## Offline Apps with UpUp

The first step is to simply create our app like we normally would.

```html
  <!-- index.html -->

  ...

  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <a class="navbar-brand">UpUp App</a>
    </div>
  </nav>

  <div class="container">
    <form>
      <div class="form-group">
        <label>New Todo</label>
        <input type="text" class="form-control" placeholder="Enter a new todo">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>        
  </div>

  ...
```

![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-2.png)

UpUp let's us define what we want to serve the user when they are disconnected. We do this with the `start` method and we can pass in the `content-url` and an array of `assets` that should be used.

```html
  <!-- index.html -->

  ...

  <script src="upup.min.js"></script>
  <script>
    UpUp.start({
      'content-url': 'templates/offline.html',
      'assets': [
        'css/bootstrap.min.css'
        // Other assets like images, JS libraries etc
      ]
    });
  </script>

  ...
```

We can tell UpUp which specific template it should use when the user is offline. The content we serve when they are offline can be exactly the same as it would be when they are online, or we can customize it to let them know they are disconnected.

```html
  <!-- templates/offline.html -->

  ...

  <div class="alert alert-danger">
    You are currently offline, but you can keep working.
  </div>

  ...
```

![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-3.png)

> TIP: You don't need to unplug your modem to simulate being offline. Simply use the "Toggle Device Mode" with Chrome dev tools and select **Network: Offline**. ![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-4.png)

If we need to use a framework for our app, we can bring in the necessary JavaScript within the `assets` array so that it is retrieved when offline.

So that works, but what exactly is UpUp doing to acheive this? If we take a look at the UpUp service worker, we can get an idea.

```js
// src/upup.sw.js

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // try to return untouched request from network first
    fetch(event.request.url, { mode: 'no-cors' }).catch(function() {
      // if it fails, try to return request from the cache
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        // if not found in cache, return default offline content
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('sw-offline-content');
        }
      })
    })
  );
});
```

UpUp is listening for `fetch` events and first tries to return a request from the network. If that fails, it looks to the cache to resolve the request, and if that fails, the ultimate fallback is to serve the offline content the we registered.

## What About Data?

There are a few different ways we can handle data while offline. Handling synchronization on our own can be tricky, and probably isn't what we want to spend time focusing on. To get around that, there are options like [PouchDB](http://pouchdb.com/), an open source local data storage library that can be set up to automatically sync with [CouchDB](http://couchdb.apache.org/). Details for setting up synchronization can be found in the [PouchDB guide](http://pouchdb.com/guides/).

## Aside: Authentication is Easy with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [Single Sign On](https://auth0.com/docs/sso/single-sign-on), User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

## Wrapping Up

With so many app users relying on mobile, and with spotty networks in many places, it's becoming more and more essential that we give our users a decent offline experience. The [**service worker API**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) is a great help for this, and really outdoes **AppCache** because we have much more control over what happens. While the service worker API is relatively straightforward to use, setting up an offline app is even easier with abstractions such as the one provided by [UpUp](https://github.com/TalAter/UpUp).

It might not always be feasible to focus on the offline experience, perhaps due to other features taking priority. However, providing the user some level of usability while offline is valuable and can likely even be a key differentiator between your app and others.
