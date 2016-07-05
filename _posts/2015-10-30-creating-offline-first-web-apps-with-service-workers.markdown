---
layout: post
title: "Creating Offline-First Web Apps with Service Workers"
description: "Learn about the importance of creating an offline-first experience for app users and how to accomplish it easily with the Service Worker API"
date: 2015-10-30 16:00
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
- pouchdb
related:
- 2015-04-09-adding-authentication-to-your-react-flux-app
- 2015-08-28-getting-started-with-falcor
- 2016-03-28-xamarin-authentication-and-cross-platform-app-development
---

---

**TL;DR:** Serving web-app users a good offline experience can be tricky if they become disconnected from the internet. Providing offline functionality is important for UX, and some recent technologies make it easier for developers to accomplish it. In this article, we focus on the [**service worker API**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and find out how to use it with a library called [**UpUp**](https://github.com/TalAter/UpUp) to make our apps offline-first.

---

Application users are no longer restricted to devices that are always connected to the internet, so it's more important than ever that applications can handle poor or no network connection. Ideally, apps should still work when the network connection is lost, with a mechanism for local data storage synced with a remote database. This kind of functionality is familiar in many ways; native applications provide mechanisms to accomplish it easily. We can achieve the same effects in mobile hybrid apps, as well as web apps in general, with some relatively new technologies.

In this article, we'll explore the current state of offline-first applications and see what kind of approach to take to ensure a smooth user experience in our own apps, even when disconnected. We'll talk about [**service workers**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and how to use them either directly, or with a helper library called [**UpUp**](https://github.com/TalAter/UpUp).

## Service Workers for Offline-First Apps

We're all familiar with what happens when we become disconnected while using the web--we try to move forward on the page or in the app, and we're greeted with a message that tells us we can't. Most native mobile apps will still offer some functionality while offline, but a lot of web apps don't.

![offline-first](https://cdn.auth0.com/blog/offline-first/offline-first-1.jpg)

What we need, then, is a way for our app to detect when we don't have an internet connection, and then respond in a different and particular way. This is where the **service worker API** comes in. In fact, this technology’s main focus is making it easier for developers to provide users with good offline experiences.

A service worker is a bit like a proxy server between the application and the browser, and it has quite a bit of power. With a service worker, we can completely take over the response from an HTTP request and alter it however we like. This is a key feature for serving an offline experience. Since we can detect when the user is disconnected, and we can respond to HTTP requests differently, we have a way of serving the user files and resources that have been saved locally when they are offline.

{% include tweet_quote.html quote_text="With a service worker, we can completely take over the response from an HTTP request and alter it however we like." %}

![service-worker](https://cdn.auth0.com/blog/offline-first/offline-first-diagram.png)

## Service Workers > AppCache

The service worker API is an attempt to replace the **HTML5 Application Cache**. Nothing is perfect, but AppCache has a host of issues that frustrate developers trying to create offline experiences. One of the biggest issues is that apps won't work at all unless AppCache is set up just right, which means debugging is very tricky. With AppCache, only same-origin resources can be cached, and when it comes to updating resources, it's all or nothing—we can't update cached items individually.

Service workers really shine when stacked up against AppCache. They give us a lot of fine-grained control, so we're able to customize the process of serving an offline experience. Some of this ability is because service workers use promises, which allow us to respond to both `success` and `error` conditions.  

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

Service workers are tied to a particular scope, and the location of the service worker script in the project directory is important. If we want the above service worker to apply to any route in our application, we would need the `sw.js` script to be accessible at `http://example.com/sw.js`.

With the service worker registered, we need to define what happens when certain events, such as `fetch`, occur. Instead of rolling out a full example on our own, let's make use of a small library called [UpUp](https://github.com/TalAter/UpUp). This library provides a service worker abstraction that makes it easier to simply define which resources we want available when the user is offline.

## Offline-First Apps with UpUp

The first step is to create our app just as we would normally.

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

![offline-first upup](https://cdn.auth0.com/blog/offline-first/offline-first-2.png)

UpUp lets us define what we want to serve the user when they are disconnected. We do this with the `start` method and we can pass in the `content-url` and an array of `assets` that should be used.

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

We can tell UpUp which specific template to use when the user is offline. The content we serve when when offline can be the same as when online, or we can customize it to let the user know they are disconnected.

```html
  <!-- templates/offline.html -->

  ...

  <div class="alert alert-danger">
    You are currently offline, but you can keep working.
  </div>

  ...
```

![offline-first upup](https://cdn.auth0.com/blog/offline-first/offline-first-3.png)

> TIP: You don't need to unplug your modem to simulate being offline. Simply use the "Toggle Device Mode" with Chrome dev tools and select **Network: Offline**. ![offline-first service worker upup](https://cdn.auth0.com/blog/offline-first/offline-first-4.png)

If we need a framework for our app, we can bring in the necessary JavaScript within the `assets` array so that it is retrieved when offline.

So that works, but what exactly is UpUp doing to achieve this? Looking at the UpUp service worker will give us an idea.

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

UpUp is listening for `fetch` events and first tries to return a request from the network. If that fails, it looks to the cache to resolve the request; if that fails too, it serves the offline content we registered.

The service worker itself is wired up with the `start` method we saw earlier.

```js
// upup.js

start: function(settings) {
  this.addSettings(settings);

  // register the service worker
  _serviceWorker.register(_settings.script, {scope: './'}).then(function(registration) {
    // Registration was successful
    if (_debugState) {
      console.log('ServiceWorker registration successful with scope: %c'+registration.scope, _debugStyle);
    }

...
```

## What About Data?

Native apps naturally provide ways for collecting data while the user is offline. This data can be synced with a remote database once a connection is re-established. When it comes to the web, however, data synchronization isn't as easy.

We might be inclined to roll our  own solutions, but dealing with timestamps, revisions, conflict resolution, and consistency can be a lot of work. Fortunately, there are some great solutions for collecting data locally for syncing later.

### PouchDB

[PouchDB](http://pouchdb.com/) is an open source local data storage library that can be set up with [CouchDB](http://couchdb.apache.org/) to automatically sync data. PouchDB emulates CouchDB very closely, so the API between the two looks and feels quite similar.

PouchDB makes it trivial to set up a local and remote database and to have them automatically sync with one another. Local databases use the browser's IndexedDB to store data.

```js

// Local databases are created by just providing a name
var local = new PouchDB('todos');

// Remote databases are created by providing a path to CouchDB
var remote = new PouchDB('http://localhost:5984/todos');
```

PouchDB uses a simple promise-based API for storing and retrieving documents.

```js

// Store a document
var todo = {
  "_id": "todo1",
  "name": "Go to the store"
}

local.put(todo);

// Retrieve a document
local.get('todo1').then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.log('There was an error');
});
```

When it comes to syncing, we can have one-way or two-way sync, and we can choose to have the databases replicate continuously or just at a time we specify. In many cases, we'll set up live replication that accounts for a user dropping in and out of network coverage. To do this, we just need to tell PouchDB that we want it to retry syncing.

```js
local.sync(remote, {
  live: true,
  retry: true
});
```

## Aside: Authentication is Easy with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social (Facebook, Github, Twitter, etc.), enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

You can use [Lock](https://auth0.com/docs/libraries/lock) for your offline-first web app. With Lock, showing a login screen is as simple as including the **auth0-lock** library and then calling it in your app.

```js
// Initialize Auth0Lock with your `clientID` and `domain`
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// and deploy it
var login = document.querySelector('a#login')

login.onclick = function (e) {
  e.preventDefault();
  lock.show(function onLogin(err, profile, id_token) {
    if (err) {
      // There was an error logging the user in
      return alert(err.message);
    }

    // User is logged in
  });
};
```

![lock auth0](https://i.cloudup.com/6opoEX_Z9z.png)

In the case of an offline-first app, authenticating the user against a remote database won't be possible when network connectivity is lost. However, with service workers and a library like UpUp, you have full control over which pages and scripts are loaded when the user is offline. This means you can configure your `offline.html` file to display a useful message stating the user needs to regain connectivity to login again instead of displaying the Lock login screen.

## Wrapping Up

With so many app users relying on mobile, and with spotty networks in many places, it's becoming more and more essential to give our users a decent offline experience. The [**service worker API**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) helps greatly, and really outdoes **AppCache**, because we have much more control over what happens. While the service worker API is relatively straightforward to use, setting up an offline app is even easier with abstractions such as the one provided by [UpUp](https://github.com/TalAter/UpUp).

Focusing on the offline experience is not always feasible, perhaps because other features take priority. However, providing usability while offline is valuable and can even be a key differentiator between your app and others.
