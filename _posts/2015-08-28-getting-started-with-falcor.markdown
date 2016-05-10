---
layout: post
title: "Getting Started With Falcor"
description: "Learn the essentials of Falcor--the newly open-sourced library from Netflix that lets you represent your data as a single virtual JSON object."
date: 2015-08-28 08:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  bg_color: "#761984"
  image: https://cdn.auth0.com/blog/falcor/falcor-logo.png
  image_size: "70%"
tags: 
- falcor
- falcorjs
- jsongraph
- falcor-express
- javascript
related:
- 2015-10-04-getting-started-with-relay
- 2016-01-13-rise-of-the-high-boilerplate-framework-a-look-at-falcor-and-relay
- 2016-04-13-authentication-in-golang
---

___
**TL;DR:** Netflix has just open-sourced its Falcor project. Falcor changes the way we approach data for web applications by introducing conventions such as virtual JSON models and the JSON Graph. These conventions make it possible for us to cache data intelligently on the client's device, which can help us to achieve an improved user experience. You can view the [repo for the tutorial](https://github.com/auth0/falcor-create-demo) to see some ways in which Falcor can be put to use.

You can also integrate Auth0 with your Falcor app. Have a look at the [docs and seed project](https://auth0.com/docs/quickstart/backend/falcor/) to get started.
___

Falcor is an open source library from Netflix that aims to change the way web applications request and handle data.

## Outline

In this tutorial, we will look at some of Falcor's basic operations and show how they can be used to construct a virtual JSON model from a data source. The example data we'll use will model a handful of JavaScript conferences. We'll start on the client side and eventually move everything over to be served from a NodeJS back end. Specifically, we will cover:

1. What Falcor is and what problems it solves
2. How to set up a Falcor model on the client and prime it with data
3. How to use Falcor's JSON Graph to avoid having duplicate data
4. How to set up up a Falcor Router with Falcor Express
5. How to do a basic search using a Falcor route

## What is Falcor?

One of the key problems that Falcor solves is the fact that HTTP wasn't designed and really isn't optimized for how web applications should ideally request data. With HTTP, only a single resource can be retrieved per request. Since web applications tend to need to request many small resources, many HTTP requests are often required to get all the data the application needs.

Another problem that Falcor solves is that JSON objects represent data hierarchically, as *trees*, whereas data is much more often a *graph*. In other words, an application's data doesn't always have a strict parent-child relationship, but rather will tend to have many predecessors, or be related to many other pieces of data. For example, suppose that we have several categories for our JavaScript conferences. A conference like ng-conf could fit under the category of "JavaScript", but could also fit under "AngularJS". If we were to model this with JSON, we might get something like this:

```js
categories: {
  javascript: [
    0: {
      name: ng-conf
    }
  ],
  angularjs: [
    0: {
      name: ng-conf
    }
  ]
}
```

As it is expressed here, ng-conf has a parent-child relationship with both categories, when really it is related to both. Falcor makes it possible to deal with data as a graph, but still output it as a normal JSON object.

Falcor also helps to make data retrieval more efficient. Instead of pulling many JSON objects from an API and then only using some parts of them in the view layer, Falcor wires together a single *virtual* JSON model that provides only the data that is required at the time that it is needed. For example, if we wanted to get the name of a conference and the first names of its attendees, we typically would first have our API serve the user data and then we would use the first name value in our view. However, with Falcor, we can easily say that we want only the first name value for each attendee and then have that be the only piece of user data that is returned. In this way, Falcor essentially customizes data to the application's view. Falcor does this through its JSON Graph convention, which is used to model graph information as a JSON object. 

Furthermore, Falcor caches the virtual JSON model so that it can be accessed in-memory. When it becomes necessary to request more or different data, Falcor first consults the cache and if the data is not available there, it makes another request for *only* the fragment that is missing.

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-1.png)

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-2.png)

## Getting Started

We'll first need to install our dependencies and create some files to work with.

```html
npm install express falcor falcor-express falcor-router lodash
touch app.js index.js index.html
```

## Creating a Model

Falcor models take JSON Graph information and form it into JSON to be consumed by the application. They are also responsible for maintaining an in-memory cache of that JSON data, which reduces network requests and makes operations more efficient. We'll start by providing some data for a local model that sits on the client, but later we'll move it to the server. Let's create some JavaScript conference data:

```js
// app.js

// We can prime the model cache with a new falcor.Model
var model = new falcor.Model({
  cache: {
    events: [
      {
        name: "ng-conf",
        description: "The worlds best Angular Conference",
        location: { city: "Salt Lake City", state: "Utah" }
      },
      {
        name: "React Rally",
        description: "Conference focusing on Facebook's React",
        location: { city: "Salt Lake City", state: "Utah" }
      },
      {
        name: "ng-Vegas",
        description: "Two days jam-packed with Angular goodness with a focus on Angular 2",
        location: { city: "Las Vegas", state: "Nevada" }
      },
      {
        name: "Midwest JS",
        description: "Midwest JS is a premier technology conference focused on the JavaScript ecosystem.",
        location: { city: "Minneapolis", state: "Minnesota" }
      },
      {
        name: "NodeConf",
        description: "NodeConf is the longest running community driven conference for the Node community.",
        location: { city: "Walker Creek Ranch", state: "California" }
      }

    ]
  }  
});
```

Here we new-up a `falcor.Model` and place our example data within the `cache` object, which effectively "primes" the local model cache.

Falcor provides several intuitive methods for operating on models, including `get`, `set`, and `call`. If we wanted to retrieve the JSON that is emitted by a JSON Graph, we would use the `get` method; however, if we only wanted to retrieve a single value from the model, we would use `getValue` instead.

Let's use the `get` method to call some of our data.

```js
// app.js

...

model
  // We want the name and description values for the first three items
  // from the data model
  .get(["events", {from: 0, to: 2}, ["name", "description"]])
  .then(function(response) {
    document.getElementById("event-data").innerHTML = JSON.stringify(response, null, 2);
  });
```

To use the `get` method, we need the JavaScript paths that point to the specific resource or set of resources that we want. JavaScript paths are simply a sequence of keys that refer to a specific location within a JSON object and can be of type `string`, `boolean`, `number`, or `null`. The paths can be passed in as a string to the `get` method, but we can also build up the paths in an array. In this case we are saying that we want to get data from the `events` array within our model and that we only want to retrieve the first three items. In the array that makes up the last part of the path, we are specifying that we're interested in the `name` and `description` keys from the model. Since the API for the model is asynchronous, we can retrieve the values from a `promise` by accessing the `response` in the success handler.

When we run this, we can see that we get the JSON printed to the screen:

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-3.png)

That gives us the `name` and `description` for the events, but let's say we want the `location` as well. We might try to add this on as a JavaScript path:

```js
// app.js

...

// We attempt to get the "location" key from out data but find that it
// doesn't display as expected
.get(["events", {from: 0, to: 2}, ["name", "description", "location"]])

...
```

However, when we try to run this, we see that the data looks exactly the same and that there's no `location` key. That's because Falcor only allows us to pull primitive JavaScript values from our models, not arrays or objects. Data within arrays or objects often tend to become arbitrarily large over time, so Falcor makes it illegal for us to access them directly, to force us to craft our paths more thoughtfully and only retrieve the data that we actually need. If we want access to the values of the keys on the `location` object within our data, we can pass another `pathSet` that takes us directly to the `city` and `state` values from `location`.

```js
// app.js

...

// To get the values on the "location" object, we need to pass multiple pathSets and 
// query the specifc keys on the location object
.get(["events", {from: 0, to: 2}, ["name", "description"]],['events', {from: 0, to: 2}, 'location', ['city', 'state']])

...
```

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-4.png)

## Avoiding Duplicate Data

If we ever want to make a change to one of the properties of this location, we can do so using the `set` method. Let's say that we want to change the value of `state` from "Utah" to "UT."

```js
// app.js 

...

model
  // We set the value of the first occurrence of Utah to UT
  .set(falcor.pathValue(["events", 0, "location", "state"], 'UT'))
  .then(function(response) {
    model
      // What we find afterwards is that the value gets changed in one location, but not both.
      .get(["events", {from: 0, to: 2}, ["name", "description"]],['events', {from: 0, to: 2}, 'location', ['city', 'state']])
      .then(function(response) {
        document.getElementById('event-data').innerHTML = JSON.stringify(response, null, 2);
      });    
  });

...
```

You'll notice that we now have the value for `state` showing up in two different ways, even though they should really be the same.

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-5.png)

Falcor provides a solution to this common problem of duplicate data with a new primitive value type called `reference`. A JSON Graph reference makes it possible to refer to a single location for a piece of data rather than having multiple copies of that data in many places.

To apply this to our case, we first need to change the way we represent our `location` data, so that it is listed by an ID-based key.

```js
// app.js

// We can use the shorthand for references with a variable
var $ref = falcor.Model.ref;

var model = new falcor.Model({
  cache: {
    locationsById: {
      1: {
        city: "Salt Lake City",
        state: "Utah"
      },
      2: {
        city: "Las Vegas",
        state: "Nevada"
      },
      3: {
        city: "Minneapolis",
        state: "Minnesota"
      },
      4: {
        city: "Walker Creek Ranch",
        state: "California"
      }
    },
    events: [
      {
        name: "ng-conf",
        description: "The worlds best Angular Conference",
        location: $ref('locationsById[1]')
      },
      {
        name: "React Rally",
        description: "Conference focusing on Facebook's React",
        location: $ref('locationsById[1]')
      },
      {
        name: "ng-Vegas",
        description: "Two days jam-packed with Angular goodness with a focus on Angular 2",
        location: $ref('locationsById[2]')
      },
      {
        name: "Midwest JS",
        description: "Midwest JS is a premier technology conference focused on the JavaScript ecosystem.",
        location: $ref('locationsById[3]')
      },
      {
        name: "NodeConf",
        description: "NodeConf is the longest running community driven conference for the Node community.",
        location: $ref('locationsById[4]')
      }
    ]
  }  
});
```
We now use JSON Graph's `$ref` to associate each event's location with a single place in our data. Even though we've represented the data differently here, JSON graph will convert it so that we will still get the same output for our JSON model. Further, if we now run the same `set` method to change the `state` value on the first `location` object, we see that it also gets changed elsewhere.

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-6.png)

## Moving to the Server

Priming the client cache with data is great, but we will of course need to have our data served from a back end. To accomplish this, Falcor provides a DataSource implementation that lets us tie JSON Graph information from the back end to our model. The DataSource implements a Router interface that lets us build routes on the server that we can wire up to respond with data.

We'll be using `falcor-express` along with the `falcor-router` to expose our JSON Graph data. Although we won't actually be pulling data from a persistent data store at this time, you would generally want to set up services to query and return data that can then be handled by Falcor. 

In `app.js`, we'll still need to specify that we want to use a `falcor.Model`, but this time we need to set its data source to be remote. We can do this by setting `source` to a `falcor.HttpDataSource` at `model.json`. This will set up the necessary connection between our model on the front end and the JSON Graph information coming from the server.

```js
// app.js

// We can set the model to have a data source that is retrieved from the backend
// over HTTP by setting the soure to be a falcor.HttpDataSource.
var model = new falcor.Model({source: new falcor.HttpDataSource('/model.json')});
```

To set up `index.js` on the server side, we'll `require` the packages we need and set up our `eventsData` object, which we'll use to mimic data from a persistent store.

```js
// index.js - server side

var falcor = require('falcor');
var falcorExpress = require('falcor-express');
var Router = require('falcor-router');

var express = require('express');
var _ = require('lodash');
var app = express();

app.use(express.static('.'));

// Have Express request index.html
var $ref = falcor.Model.ref;

// Same data that was used in the view for our
// events, but this time on a simple object
// and not a Falcor model.
var eventsData = {
  locationsById: {
    1: {
      city: "Salt Lake City",
      state: "Utah"
    },
    
    ...
```
We'll set up Express to `use` an endpoint at `model.json` which has Falcor's `dataSourceRoute` return a `new Router`.

```js
// index.js

...

// We setup a model.json endpoint and pass it a dataSourceRoute which
// allows us to serve a router. Various route requests can be sent to the
// router to grab whatever data is required
app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([
    {
      // Our route needs to match a pattern of integers that
      // are used as eventIds
      route: "events[{integers:eventIds}]['name', 'description']",
      get: function(pathSet) {
        
        var results = [];

        // Above we specified an eventIds identifier that is an
        // array of ids which we can loop over
        pathSet.eventIds.forEach(function(eventId) {

          // Next, an array of key names that map is held at pathSet[2]
          pathSet[2].map(function(key) {

            // We find the event the cooresponds to the current eventId
            var eventRecord = eventsData.events[eventId];

            // Finally we push a path/value object onto
            // the results array
            results.push({
              path: ['events', eventId, key], 
              value: eventRecord[key]
            });
          });          
        });

        return results; 
      }      
    }
  ]);
}));

app.listen(3000);
console.log("Listening on http://localhost:3000");
```
Routes are matched against a KeySet that is provided to the first array in the `route` string. For our first route, we specify that we want to match against integers and that we want to identify by `eventId`. The `pathSet` parameter in the `get` method gives us access to the KeySet that has been provided by the client and allows us to loop or map over the keys to match against data from the `eventsData` object.

The first route is used to get access to the `name` and `description` from a range that the client provides. We can use a simple `get` in our `app.js` file to pull these results. Notice here that the front-end code for getting these results remains the same:

```js
// app.js
model
  .get(["events", {from: 0, to: 2}, ["name", "description"]])
  .then(function(response) {
    document.getElementById('event-data').innerHTML = JSON.stringify(response, null, 2);
  });
```

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-7.png)

If we also wanted to get the location data associated with each event, we would need to setup another route to handle them specifically. Each path that we request needs to be represented by its own route.

```js
// index.js

...

{
// Our route needs to match a pattern of integers that
// are used as locationId
route: "locationsById[{integers:locationId}]['city', 'state']",
get: function(pathSet) {
  
  var results = [];

  // Above we specified an locationId identifier that is an
  // array of ids which we can loop over
  pathSet.locationId.forEach(function(locationId) {

    // Next, an array of key names that map is held at pathSet[2]
    pathSet[2].map(function(key) {

      // We find the event the cooresponds to the current locationId
      var location = eventsData.locationsById[locationId];

      // Finally we push a path/value object onto
      // the results array
      results.push({
        path: ['locationsById', locationId, key], 
        value: location[key]
      });
    });          
  });

  return results; 
}

...
``` 

## Search for an Event by Name

The client can send integers as a KeySet to pull a range of results, but it can also provide strings. We can use this to setup an "event by name" search route.

```js
// index.js

...

{
    // The search route will match keys that match the names
    // of our conferences
    route: "events.byName[{keys}]['description']",
    get: function(pathSet) {
            
      var results = [];

      // We want to loop over each of the conference names provided
      pathSet[2].forEach(function(name) {

        // We also want to loop over all the events on the data object
        // and check if conference name is there
        eventsData.events.forEach(function(event) {
          if(_.contains(event, name)) {
            results.push({
              path: ['events','byName', name, 'description'],
              value: event.description                
            });
          }
        });          
      });

      return results;
    }
  }

...
```
In this route, we accept a key or set of keys that will be strings corresponding to event names. We loop over this set of keys, accessible from the `pathSet`, and then loop over our event data to check whether the name provided by the client exists there. If it does, we push onto the results array a path that will serve the description of the event, if it exists.

We can test this route in `app.js` by providing the name of an event.

```js
// app.js

// Search example - we pass "Midwest JS" which will be looked up
// in the events data on the server and sent back if it exists
.get(["events", "byName", ["Midwest JS"], ['description']])

```
Which yields:

![falcor](https://cdn.auth0.com/blog/falcor/falcor-1-8.png)

## Aside: Using Falcor with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [Single Sign On](https://auth0.com/docs/sso/single-sign-on), User Management, support for Social (Facebook, Github, Twitter, etc.), Enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

Auth0 provides an easy way to add authentication to your Falcor app. The set up is simple and relies on the middelware provided by `express-jwt`. Have a look at the [documentation and seed project](https://auth0.com/docs/quickstart/backend/falcor/) to get started and, as always, feel free to [get in touch](mailto:support@auth0.com) if you have any questions.


## Wrapping Up

Through its JSON Graph implementation, Falcor provides an innovative way to pull data into a virtual JSON model and cache it on the client side. It also gives us an easy way to serve routes from a back end through its integration with Express. 

The new approach to retrieving data that Falcor provides is intriguing and generally nice to work with. It did, however, seem like a lot of boilerplate code was required to serve data from the Falcor router on the server side. We've reached out to the Falcor team to let them know about our experience with the coding for the router.

The Falcor project has excellent documentation on its [website](http://netflix.github.io/falcor). There you'll find guides, videos, and API documentation that all go into much more detail on the concepts covered in this tutorial. 


