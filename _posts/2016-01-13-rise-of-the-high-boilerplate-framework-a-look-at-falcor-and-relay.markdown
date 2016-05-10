---
layout: post
title: "Rise of the High Boilerplate Framework: A Look at Falcor and Relay"
description: "JavaScript modules and build steps are getting more numerous and complicated, but what about boilerplate in new frameworks?"
date: 2016-01-13 16:00
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design:
  bg_color: "#004076"
  image: https://cdn.auth0.com/blog/boilerplate/falcor-relay.png
  image_size: "100%"
  image_bg_color: "#fff"
tags: 
- falcor
- relay
- javascript
- boilerplate
- authentication
- jwt
related:
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2016-04-19-react-router-alternatives
- 2016-03-15-javascript-module-systems-showdown
---

---
**TL;DR:** Frameworks like [Falcor](https://netflix.github.io/falcor/) and [Relay](https://facebook.github.io/relay/) solve some hard problems but come at the cost of requiring a lot of boilerplate. Perhaps the boilerplate is a necessity, but this likely has implications for developer uptake.

To get a sense of each, check out our getting started tutorials for both [Falcor](https://auth0.com/blog/2015/08/28/getting-started-with-falcor/) and [Relay](https://auth0.com/blog/2015/10/06/getting-started-with-relay/).

---

There’s been a lot of talk about JavaScript fatigue lately, and perhaps rightly so. It can be tough to keep up with all the new frameworks, modules, and libraries that pop up every day, and now that we’re in the era of next gen JavaScript and the build step, things can be even more difficult when we throw in transpilation and build tools. 

We’ve even got people that are [really angry](https://medium.com/@wob/the-sad-state-of-web-development-1603a861d29f#.x1zwe3db2) about the current state of JavaScript and web development. Personally, I find this a kind of anger to be pretty odd. Everyone is entitled to their opinion of course, but getting mad about technology that is both **optional** and **free** just seems weird.

There’s no shortage of JavaScript fatigue articles of course.

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">I&#39;m fatigued by JavaScript fatigue articles</p>&mdash; James Kyle (@thejameskyle) <a href="https://twitter.com/thejameskyle/status/680949037516718085">December 27, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

A lot of these articles center around modules and build tools, but I’d like to explore something we haven’t heard as much about: **boilerplate**.

## Where are we Seeing Boilerplate?

One of the cool things about writing content at Auth0 is that I get to explore a lot of awesome new technologies every week. While doing this, it has become apparent that many of these technologies require a fair bit of boilerplate just to get going. Which ones exactly? I’m thinking specifically about frameworks like [Falcor](https://netflix.github.io/falcor/) and [Relay](https://facebook.github.io/relay/). I’ve also seen it with libraries like Flux and Redux, but I think in that case, it’s more of an ecosystem thing. Unidirectional data flow setups in general tend to have more boilerplate.

So let’s talk about Falcor and Relay. To start, what are they? In broad terms, both of them are used to help us with data interactions between the client and server sides of our apps. Falcor was created by Netflix and Relay by Facebook. With both, we set up a single endpoint on the server (virtual JSON model in Falcor and GraphQL endpoint in Relay), instead of sending data to and receiving it from multiple endpoints.

> **Note:** This article doesn't make a direct comparison between Falcor and Relay, but rather looks at the amount of code required to use them. It is recognized that while they have similarities, they don’t serve exactly the same purpose. Also, I know Falcor identifies as a library and Relay as a framework, but let’s keep things simple and just call them frameworks

Falcor gives us powerful features like data de-duping and Relay is great at providing only the data a given React component needs at the time it is needed. Both of the frameworks let us do things that would be really difficult to do manually. So what’s the catch?

> We’ve written full tutorials on these frameworks. Read more about [Falcor](https://auth0.com/blog/2015/08/28/getting-started-with-falcor/) and [Relay](https://auth0.com/blog/2015/10/06/getting-started-with-relay/).

## The High Boilerplate Framework

Looking at the getting started examples for [Falcor](https://netflix.github.io/falcor/) and [Relay](https://facebook.github.io/relay/), it’s easy to see that even a `Hello World` app requires quite a bit of code. That’s fine, a lot of it is just configuration to get the system wired up. Where I see the boilerplate really start to grow is when we get some actual routes set up.

Let’s look at what’s needed to set things up for a single data resource. From our previous tutorials, here’s a bit of what we need for a single route in **Falcor**:

```js
// 1. We needs some data, which is truncated for this example
var model = new falcor.Model({
  cache: {
    events: [
      {
        name: "ng-conf",
        description: "The worlds best Angular Conference",
        location: $ref('locationsById[1]')
      },
      ...
    ]
  }  
});

// 2. We need a data source route
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
```

To call it from the front end:

```js
// front-end.js

...

.get(["events", {from: 0, to: 2}, ["name", "description"]]);

...
```

And here’s what we need for **Relay**:

```js
// 1. We need a schema
var userType = new GraphQL.GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  isTypeOf: function(obj) { return obj instanceof db.User },

  fields: function() {
    return {
      id: GraphQLRelay.globalIdField('User'),
      name: {
        type: GraphQL.GraphQLString,
        description: 'The name of the user',
      },

      // We can set up a relationship between users and conferences here
      conferences: {
        description: 'A listing of the user\'s conferences',

        // Relay gives us helper functions to define the Connection and its args
        type: GraphQLRelay.connectionDefinitions({name: 'Conference', nodeType: conferenceType}).connectionType,

        // argument to tell GraphQL which user to pass back
        // in the resolve block
        args: {
          userToShow: { type: GraphQL.GraphQLInt }
        },

        // The resolve block will complete a query and pass back
        // data for the user id supplied by the arguments we pass in
        resolve: function(user, args) {
          return GraphQLRelay.connectionFromArray(db.getConferencesByUser(args.userToShow), args)
        },
      },
    }
  },
  interfaces: [nodeDefinitions.nodeInterface],
});

// 2. We need to export the schema
// Types and queries are exported with GraphQLSchema
module.exports = new GraphQL.GraphQLSchema({
  query: new GraphQL.GraphQLObjectType({
    name: 'Query',
    fields: {
      // Relay needs this to query Nodes using global IDs
      node: nodeDefinitions.nodeField,
      // Root queries
      user: {
        type: userType,
        resolve: function() { 
          return db.getUser(1) 
        },
      },
    },
  }),
});

// 3. We also need to export a container
exports.Container = Relay.createContainer(ConferenceApp, {
  // We initially want to get the first user's conferences
  initialVariables: {
    userToShow: 1
  },
  fragments: {
    // Results from this query will be placed on this.props for access in
    // our component
    user: () => Relay.QL`
      fragment on User {
        name,
        conferences(userToShow: $userToShow) {
          edges {
            node {
              id,
              name,
              description
            },
          },
        },
      }
    `
  },
});

```

Again, configuration is a big part of this, but there’s also a fair amount of logic just to gather and prepare our data to be sent back. Now I’m sure there are places where we could trim things up a bit, but even the official guides have a lot of code involved.

In this way, I’ve come to think of Falcor and Relay as High Boilerplate Frameworks. At the same time, they are inherently somewhat complex as well. While they are both great at doing what they do, I think this creates an unfortunate implication: **lots of boilerplate can be confused with complexity and people prefer simple to complex**.

## Approachability

When it comes down to it, most of us like things to be simple. It’s easy to get excited about a technology that makes quick work out of something that used to take a lot of time, effort, and code. I find that even if a framework or library has a learning curve and requires a lot of code for real-world use, I can get on board pretty easily if I can get *something* up and running quickly.

With all the configuration and boilerplate required to get going with Falcor and Relay, one of their downsides is that they are inherently less approachable. Some people haved [pushed for API changes](https://github.com/facebook/relay/issues/124), but I imagine more have abandoned their exploration altogether, which is unfortunate.

## Next Gen JavaScript Compounds the Issue

I recall watching a talk from ng-conf where the speaker said that a lot of the issues and questions the Angular team received were actually JavaScript related and didn’t have a lot to do with Angular. Language misunderstandings will likely always cause some trouble, sure, but I think we’re at a spot now where next gen JavaScript and the need for transpilation tools can easily be conflated with the complexities of a framework. Take this snippet of Relay from the docs for example:

```js
fragments: {
    game: () => Relay.QL`
      fragment on Game {
        scores(
          numToShow: $numToShow,
          sortDirection: $sortDirection
        ) {
          ${Score.getFragment('score')},
        },
      }
    `,
  }
```

If the developer isn’t yet familiar with arrow functions and template strings, even this simple example makes it look like the framework has a bunch of weird stuff when really this is just new JavaScript. If the developer is thrown off just by the language at this point, things don’t get much better when they eventually try to set up a [mutation](https://facebook.github.io/relay/docs/guides-mutations.html#content).

## What Does this Look Like in the Wild?

When setting up simple examples for Auth0’s tutorials I remember thinking that I can’t imagine building a full-fledged app in either of them. I’m curious about the experience of those who have and what their thoughts are about the boilerplate situation.

It would also be interesting to see how the companies that created Falcor and Relay (Netflix and Facebook respectively) make use of them. I wouldn’t be surprised if they have internal tools that provide some further abstraction which simplifies their use.

## Aside: Falcor and Relay Authentication is Easy with Auth0

Auth0 simplifies common authentication needs like social login, multi-factor authentication, and single sign-on. You can [sign up for an account](https://auth0.com/signup) and get 7,000 regular active users for free.

To add Authentication to Falcor, simply install and setup **express-jwt** with your Auth0 credentials and add the middleware to your route.

```js
// server.js

...

var authenticate = jwt({
  secret: new Buffer('YOUR_CLIENT_SECRET', 'base64'),
  audience: 'YOUR_CLIENT_ID'
});

app.use('/api/model.json', authenticate, falcorExpress.dataSourceRoute(function(req, res) 
  {
    return new Router([
      {...}
    ]);
  }
));

...
```

Then send an `Authorization` header with the requests to your model.

```js
// front-end.js

var token = localStorage.getItem('id_token');

var model = new falcor.Model({
  source: new falcor.HttpDataSource('/api/model.json', {
    // Send the token as an Authorization header
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
});
```

The steps for Relay are similar, but the endpoint is specific to GraphQL.

```js
// server.js

...

app.use('/graphql', authenticate, graphqlHttp({schema: schema}));

...
```

To add the `Authorization` header, use Relay’s network layer.

```js
// front-end.js

var token = localStorage.getItem('id_token');

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3000/graphql', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
);
```

## A Final Word

Maybe the audience that frameworks like Falcor and Relay are intended for is one that itself is more advanced in terms of tech know-how. Perhaps this audience can see through the complexity and boilerplate requirements and look straight at the benefits that can be gained. Even if this is the case, I think there is a huge camp that understands and appreciates the problems that these frameworks are trying to solve, but are turned off by everything that is required to solve them.

I’m sure the newcomers aren’t alone. I doubt that seasoned developers like writing a lot of boilerplate and I have a feeling they have a special appreciation for simple and approachable APIs.

All this considered, I think High Boilerplate Frameworks like Falcor and Relay would do well to simplify their APIs and make themselves more approachable to noobs and veterans alike.

What do you think about the boilerplate required in frameworks like Falcor and Relay? Has this hindered you from getting started with them? If you’re working with them, is it hindering productivity, or do the benefits they bring outweigh the amount of boilerplate that is needed?
