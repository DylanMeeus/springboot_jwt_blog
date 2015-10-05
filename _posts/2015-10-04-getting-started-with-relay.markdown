---
layout: post
title: "Getting Started with Relay"
description: "Learn the basics of Facebook's GraphQL-based framework, Relay"
date: 2015-10-06 11:00
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image: https://cdn.auth0.com/blog/relay/relay-logo-transparent.png
  bg_color: "#3B3738"
  image_size: "95%"
  image_bg_color: "#3B3738"
tags: 
- relay
- react
- javascript
---

## Relay - The Backstory

Relay is a JavaScript framework for data interaction that has just been open sourced by Facebook. Using GraphQL, Relay makes it easier to get data to and from the server and also eases tight coupling that can exist between client-side components and the server. It allows developers to focus more on their actual applications and less on the details of moving data around.

Those familiar with Flux will know that it allows apps to have one-way data flow which means that the data needs for each component are easy to reason about. Before Relay, however, Flux didn't provide a good way to interact with the server. Relay can be thought of as the next evolution of Flux.

Crafting application data sources can often come down to a series of tradeoffs between  performance and duplication of code. If we wanted to make sure all of the data our application needs is ready to go at the same time, we could set up an endpoint to request everything. However, this will obviously have implications for performance. We could of course define a lot of custom endpoints that serve us only the data we need, but this means that we'll have to write a lot of code and potentially make many HTTP requests. In either case, if we were to ever make a change to our components that would have them require more data, we would probably need to adjust the structure of the data coming from our server. Ultimately, this arrangement between client and server can be somewhat brittle.

To address these issues, Relay allows us to specify exactly the shape of the data that we want from the server for a given component. Since we can place our queries within our components, we get the benefit of being better able to reason about that data associations for each component.

## Getting Started

In this tutorial we will take a cursory look at Relay and GraphQL by building a simple application that allows us to select a user and display which programming conferences they are registered to attend. This tutorial will focus on the core concepts of Relay and will only cover retrieving data. We will, however, see how we can write data in the next article of this series.

![relay react](https://cdn.auth0.com/blog/relay/relay-1.png)

### Schemas

Since Relay uses GraphQL, we need to expose a GraphQL server that serves data when requested. Aside from setting up the database interaction, the first step in setting up a GraphQL server is to define a schema for it to use. The schema can be thought of as the place where we register anything that we want to pull out of GraphQL. This includes declarations for our data types, queries, and mutations (changes to data). GraphQL enforces strong typing and provides its own methods for us to register types.

### Containers

Relay lets us do composition with our React components in much the same way that we're used to. A higher-order component known as a **container** is provided which is a wrapper around regular React components. Containers let us tell Relay about our React components' data needs. They are the place we specify fragments to queried on the server which can then be passed down to other components via `this.props`.

### Queries and Fragments

A query looks a little but like a JSON object but with only keys and not values. GraphQL uses a query string to look for matches and serves them back to the client. When we build our schemas, we need to tell GraphQL about the fields that are associated with each query type we want. On those types, we can create relationships with other types. Once those are set up, we use `query` to retrieve the root fields of the given type, or `fragment` to retrieve the fields from whatever relationship we defined.

## Installing a Starter Package

The best way to get started and follow along is to clone and install a prepared Relay package. We're going to be basing this tutorial off of [**simple-relay-starter**](https://github.com/mhart/simple-relay-starter) by [Michael Hart](https://twitter.com/hichaelmart). This repo is a modification of Facebook's [relay-starter-kit](https://github.com/relayjs/relay-starter-kit) that makes it easier to get going because it requires less boilerplate on the backend.

Clone the repo and then run:

```bash
npm install
npm run dev
```

Relay needs a `schema.json` file to be built from the main schema, and running with `dev` will allow these changes to be picked up.

## Setting Up the Mock Database

We won't set up a real database for this example, since we want to focus on Relay and its features. Instead, we'll set up a mock database that could (in theory) be substituted out easily for a real one.

First, lets set up the models for our data.

```js
// schema/database.js

function User(id, name) {
  this.id = id.toString();
  this.name = name;
}

function Framework(id, name) {
  this.id = id.toString();
  this.name = name;
}

function Conference(id, frameworkId, name, description, attendees) {
  this.id = id.toString();
  this.framework = frameworkId;
  this.name = name;
  this.description = description;
  this.attendees = attendees;
}
```

We'll also need to populate some arrays to hold some mocked out data.

```js
// schema/database.js

...

var users = [
  new User(1, 'Ryan'),
  new User(2, 'George')
];

var frameworks = [
  new Framework(1, 'AngularJS'),
  new Framework(2, 'React'),
  new Framework(3, 'JavaScript'),
  new Framework(4, 'NodeJS')
];

var conferences = [
  new Conference(1, 1, 'ng-conf', 'The world\'s best Angular conference', [1,2]),
  new Conference(2, 2, 'React Rally', 'Conference focusing on Facebook\'s React', [1]),
  new Conference(3, 1, 'ng-Vegas', 'Two days jam-packed with Angular goodness with a focus on Angular 2', [2]),
  new Conference(4, 3, 'Midwest JS', 'Midwest JS is a premier technology conference focused on the JavaScript ecosystem.', [2]),
  new Conference(5, 4, 'NodeConf', 'NodeConf is the longest running community driven conference for the Node community.', [1,2])
];

...
```

Here we're using the models to create some users, frameworks, and conferences. The final step in the database will be to export methods that use this data.

```js
// schema/database.js

...

module.exports = {
  User: User,
  Framework: Framework,
  Conference: Conference,
  
  getUser: function(id) { 
    return users.filter(function(user) { 
      return user.id == id 
    })[0] 
  },
  
  getConference: function(id) { 
    return conferences.filter(function(conference) { 
      return conference.id == id 
    })[0] 
  },
  
  getUsers: function() { 
    return users  
  },

  getConferencesByUser: function(userId) {
    var confs = [];
    conferences.forEach(function(conf) {
      conf.attendees.forEach(function(user) {
        if (user == userId) {
          confs.push(conf);
        }
      });
    });
    return confs;
  }
}
```

## Setting Up the Schema

As a first step in putting together the schema for GraphQL, we'll need to set up our node definitions, or in other words, what object and type should be associated with a given node based on a global ID. GraphQL tracks nodes based on a global ID, from which we can check the type.

```js
// schema/schema.js

var GraphQL = require('graphql')
var GraphQLRelay = require('graphql-relay')
var db = require('./database')

var nodeDefinitions = GraphQLRelay.nodeDefinitions(function(globalId) {
  var idInfo = GraphQLRelay.fromGlobalId(globalId)
  if (idInfo.type == 'User') {
    return db.getUser(idInfo.id)
  } else if(idInfo == 'Conference') {
    return db.getConference(idInfo.id)
  }
  return null;
});
```

Next, we'll need to provide a definition for what our user type. This is where we detail all of the fields that will be involved with the type, as well as the associations with other types.

```js
// schema/schema.js

...

var conferenceType = new GraphQL.GraphQLObjectType({
  name: 'Conference',
  description: 'A conference',

  isTypeOf: function(obj) { return obj instanceof db.Conference },

  fields: {
    id: GraphQLRelay.globalIdField('Conference'),
    name: {
      type: GraphQL.GraphQLString,
      description: 'The name of the conference',
    },
    description: {
      type: GraphQL.GraphQLString,
      description: 'The description of the conference'
    }
  },
  interfaces: [nodeDefinitions.nodeInterface],
});

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
      conferences: {
        description: 'A listing of the user\'s conferences',

        type: GraphQLRelay.connectionDefinitions({name: 'Conference', nodeType: conferenceType}).connectionType,
        args: {
          userToShow: { type: GraphQL.GraphQLInt }
        },
        resolve: function(user, args) {
          return GraphQLRelay.connectionFromArray(db.getConferencesByUser(args.userToShow), args)
        },
      },
    }
  },
  interfaces: [nodeDefinitions.nodeInterface],
});

...
```

We've now registered the `conferenceType` and `userType` with `GraphQLObjectType` and given both of them a name and description. The `isTypeOf` method checks whether objects that are used in the application are instances of those that we defined in our mock database. We register root fields and relationships in `fields`, and in the case of `userType`, we are defining a relationship with `conferences`. 

On the `type` key within the `conferences` relationship, we are using `connectionDefinitions` to make reference to the conference type that we defined above. We've got an argument defined on `args` called `userToShow` which we will later use to find users by id from the front end. It is this argument that is passed into the `getConferencesByUser` method to pull our a listing conferences for a given user.

Finally, we need to export the `GraphQLSchema` so that it can be used from the app.

```js
// schema/schema.js

...

module.exports = new GraphQL.GraphQLSchema({
  query: new GraphQL.GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeDefinitions.nodeField,
      user: {
        type: userType,
        resolve: function() { 
          return db.getUser(1) 
        },
      },
      users: {
        type: usersType,
        resolve: function() { 
          return db.getUsers() 
        }
      }
    },
  }),
});

...
```
We point each query to its specific type and tell it what database operation to perform on initialization in the `resolve` function.

## Setting Up the React Components

With the database and the schema done, we can now focus on building the actual components for the application. Since the app will show conferences that each user is attending, we'll make a component that displays each in a card. We'll use Bootstrap for styling. Before that, we'll need a top-level component that will call on the conference card child component.

```js
// ConferenceApp.js

/* eslint-env es6 */
var React = require('react')
var Relay = require('react-relay')

class ConferenceApp extends React.Component {
  changeUser(event) {
    this.props.relay.setVariables({
      userToShow: parseInt(event.target.value)
    });
  }
  render() {
    return(
      <div className="container">
        <select className="form-control" onChange={value => this.changeUser(value) }>
          <option value="1">Ryan</option>
          <option value="2">George</option>
        </select>
        <h2>{this.props.user.name} Conferences</h2>
        {this.props.user.conferences.edges.map(edge =>
          <Conference edge={edge} />
        )}        
      </div>
    )
  }  
}
```



In this component, we are mapping over the `edges` from the data that will be returned once we have everything set up. We're mapping the edges another component called `Conference` that we're passing the edge information into. Now lets make use of this data in the conference component.


```js
// ConferenceApp.js

...

class Conference extends React.Component {
  render() {
    var edge = this.props.edge;
    return (
      <div className="col-sm-4">
        <div className="panel panel-default" key={edge.node.id}>
          <div className="panel-heading">
            <h3>{edge.node.name}</h3>
          </div>
          <div className="panel-body">
            {edge.node.description}
          </div>           
        </div>
      </div>
    )
  }
}

...

```

In this component we are getting the name and description of of the nodes within each edge.

We now need to wrap the higher-order Relay container around the `ConferenceApp` component and export it.

```js
// ConferenceApp.js

exports.Container = Relay.createContainer(ConferenceApp, {
  initialVariables: {
    userToShow: 1
  },
  fragments: {
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
    `,
    users: () => Relay.QL`
      fragment on Users {
        name,
      }
    `
  },
});
```

The container allows us to define some `initialVariables` which are useful for querying specific data when the app loads. In this case, we're saying that we want the first user. You'll recall that in the schema we received an argument call `userToShow` when we defined `conferences` on the `userType`. This is that variable. The object on `fragments` is a string that is parsed by GraphQL to execute the query. In it we are asking for the user's name and then the conferences that are attending. For the conferences, we get back the `id`, `name` and `description` on nodes.

We also need to export the queries for the `RootContainer` to use. This is called the **route** for the component, but as [Facebook states](https://facebook.github.io/relay/docs/guides-routes.html#content), this name is a bit misleading and will likely change.

```js
// ConferenceApp.js

...

exports.queries = {
  name: 'ConferenceQueries',
  params: {},
  queries: {
    user: () => Relay.QL`query { user }`,
    users: () => Relay.QL`query { users }`    
  },
}
```
The query names here line up with the fragment names specified above.

## Rendering in the Browser

As the last step, we'll need to specify our `RootContainer` as the entry point for the browser to pick up. If you're following along in [**simple-relay-starter**](https://github.com/mhart/simple-relay-starter), this will be in `browser.js`.

```js
// browser.js

/* eslint-env es6 */
var React = require('react')
var ReactDOM = require('react-dom')
var Relay = require('react-relay')
var ConferenceApp = require('./ConferenceApp')

ReactDOM.render(
  <Relay.RootContainer 
    Component={ConferenceApp.Container}
    route={ConferenceApp.queries}
    onReadyStateChange={({error}) => { if (error) console.error(error) }} />,

  document.getElementById('content')  
)
```
The `Relay.RootContainer` has is passed the Relay container we specified as our component, as well as the set of queries for its route.

If everything is set up correctly, you should be able to see the app in the browser.

![relay react](https://cdn.auth0.com/blog/relay/relay-1.png)

## Wrapping Up

Relay takes care of a lot of details that developers would normally need to worry about on their own when it comes to data interaction. Although there is quite a bit of boilerplate needed, the benefit is that querying is done more efficiently and common edge cases that can cause problems are handled out of the box. The ability to request only the data we require is beneficial, and having queries live right beside the components they serve helps us to reason about our app.

This first look at Relay only showed how to retrieve data from a server. In a future post, we'll cover how to do **mutation** with Relay.


