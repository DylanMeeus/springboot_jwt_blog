---
layout: post
title: "Bootstrapping a React project"
description: Setting up a React application requires a lot. Learn how to bootstrap a React project without complexities!
date: 2016-07-11 3:17
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "rgb(25, 25, 25)"
  bg_merge: true
  image: https://cdn.auth0.com/blog/react-js/react.png
  image_size: "80%"
  image_bg_color: "rgb(25, 25, 25)"
tags:
- react
- components
- flux
- redux
- enzyme
related:
- 2015-04-09-adding-authentication-to-your-react-flux-app
- 2015-08-25-logging-and-debugging-in-react-with-flux-replaying-your-users-actions/
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
---

---

**TL;DR:** The JavaScript ecosystem has a plethora of libraries and frameworks for front-end development. ReactJS is one of the young and shiny new library on the block. Even though it's only a few years old, it has gained lots of traction from JavaScript developers around the world. One of ReactJS's selling points is the ability to easily build reusable components. Another salient point is that not only does it perform on the client side, it can also be rendered on the server side.

---

## Why React?
**ReactJS** was built by Facebook to solve one problem: building large applications with data that changes over time. It utilizes the concept of the Virtual DOM that selectively renders subtrees of nodes based upon state changes. The component based architecture that **ReactJs** emulates makes it incredible to work with. Components in **ReactJS** are self-contained views that get their data from triggered events or as inherited property from other components.

**ReactJS** supports the use of ECMAScript 6 features. With **Babel**, you can write **ReactJS** the ES6 way, making use of classes, arrow functions and a host of other ES6 features.

```js

// CommonJS way
var React = require('react');
var ReactDOM = require('react-dom');

// ES6 Way
Import React from 'react';
Import ReactDom from 'react-dom';

// ES5 way
var Main = React.createClass({
  render: function() {
    return (
      <div>
        The easiest way to add authentication to your app is via Auth0!
      </div>
    );
  }
});

// ES6 way
export default class Main extends React.Component {
  render() {
    return (
      <div>
        The easiest way to add authentication to your app is via Auth0!
      </div>
    );
  }
}

```

## Let's Get Started

Bootstrapping a **ReactJS** project involves setting up lots of tools, and it can really be a daunting task. Thankfully there are several tools provided for developers by the community to aid in setting up your project without breaking a sweat. In this post, we'll cover tools that you should be aware of in bootstrapping your next **ReactJS** project.

## Build Tools

The first step is to set up a development environment for your **ReactJS** project. [Webpack](http://webpack.github.io/), a bundler utility and [Babel](http://babeljs.io/) are key tools here. Babel lets us write code that uses new ES6 features, and then transpiles that code into standard ES5 code that can actually run in the browser. When setting up a new project:

  * I assume [Node.js](https://nodejs.org) and NPM is installed, run this command:  `npm init` to create a `package.json` file
  * Run this command in your terminal:  `npm install react react-dom babel-core babel-loader babel-preset-es2015 babel-preset-react webpack webpack-dev-server --save`
  * Create a `webpack.config.js` file. This file handles bundling all our assets, converting JSX to JS files and launching the development server. Bundling refers to combining, compiling and minimizing multiple files into just one file to be served to the client.

**Note:** JSX is a JavaScript syntax extension that looks similar to XML. You can write concise HTML/XML-like structures in the same file as you write JavaScript code. With Babel, JSX files can be transpiled into actual javascript code.

A sample _webpack.config.js_ is shown below:

```js
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/App.js",
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + "/src/",
    filename: "bundle.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
```

The application's entry point is set at the `entry`, Webpack will bundle all the `JS` and `JSX` files into the file that's specified in the output object. Webpack dev server is set to inline which allows a kind of reload on the fly and the application will be served at port `3333`. In the module object, we specify the babel loader to use `react` and `es2015` presets for converting `ES6` and `React` code into code that the browser understands. The webpack plugins add the ability to use class properties and decorators.

**Note:** Babel presets are basically plugins that have been configured to do a particular task.

### Hot reloading
The idea behind hot reloading is to keep the app running and to inject new versions of the files that you edited at runtime. This way, you don't lose any of your state which is especially useful if you are tweaking the UI.

![Hot Reloading](https://cdn-images-1.medium.com/max/1600/1*9epU6txsWWSY6lI1OHaqgg.gif)

*(Source: [Medium](https://medium.com/@dan_abramov/hot-reloading-in-react-1140438583bf#.ew92voah9))*

You can install hot module replacement like so:

```bash
npm install --save-dev babel-preset-react-hmre
```
Now, you can add it to the list of presets in the webpack.config.js file like so:

```js
....
query: {
  presets: ['react', 'es2015', 'react-hmre'],
  plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
}
```
Another option is to install `react-hot-loader` and add `react-hot` to the loader in the `webpack.config.js` file like so:

```js
...
loader: ['babel-loader', 'react-hot']
...
```

To make things really easy, add a start option to the scripts object in `package.json` file like so:

```js
{
  "scripts": {
    "start": "node_modules/.bin/webpack-dev-server --progress --inline --hot",
  }
}
```

The code above shows we have added `--hot` option. This simply enables the the hot reloading once you start your app by running `npm run start`.

## Routing

Routing is a very essential part of any application. The most popular choice for doing this in a **ReactJS** application is [React Router](https://github.com/rackt/react-router). In fact, a lot of developers tip it as the official routing system for **ReactJS**. When you want to deal with routing, you have to install the React Router module in your project as shown below:

```bash
npm install --save react-router
```
A sample implementation will look like this:

```js
import React from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import App from '../components/App'
import Home from '../components/Home'
import About from '../components/About'
import Features from '../components/Features'

render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='about' component={About} />
      <Route path='features' component={Features} />
    </Route>
  </Router>,
  document.getElementById('app')
)
```

![Routing](https://cdn.auth0.com/blog/react:routing.png)

You actually might not need React Router. More info [here](https://medium.com/@tarkus/you-might-not-need-react-router-38673620f3d#.u64h0gcl4)

## Internationalization (I18N)

There are over 6 billion people in the world. These people speak different languages. One way of making your app available to billions of people around the world is providing support for native languages in your app. In a **ReactJS** project, you can easily achieve that with a very good and well tested library [react-intl](https://github.com/yahoo/react-intl). By default, [react-intl](https://github.com/yahoo/react-intl) ships with the locale data for English built-in to the library's runtime. This library provides React components and an API to format dates, numbers, and strings, including pluralization and handling translations. Oh, it supports over 150 languages!

![Internationalization Translation](https://cdn.auth0.com/blog/my-folder:intl-translation.png)

## UI Styling

In **ReactJS** projects, you can create custom stylesheets and UI Components. A developer that's looking to rapidly build an application might not have time to create UI components from scratch. The community has blessed us with two popular libraries that possess ready-made UI components for use in your application. [React-Bootstrap](https://react-bootstrap.github.io/) has all of the bootstrap features written purely as reusable React Components. [Material-UI](https://github.com/callemall/material-ui) is a set of React Components that implement Google's Material Design.

_Material UI_
![Material UI](https://cdn.auth0.com/blog/material-ui:raisedbutton.png)

_React Bootstrap_
![React Bootstrap](https://cdn.auth0.com/blog/react-bootstrap:buttons.png)

_Material UI Code Example_

```js
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const MyAwesomeReactComponent = () => (
  <RaisedButton label="Default" />
);

export default MyAwesomeReactComponent;
```
```js
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './MyAwesomeReactComponent';

const App = () => (
  <MuiThemeProvider>
    <MyAwesomeReactComponent />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

One effective way of bootstrapping your **ReactJS** project is to start by designing your UI components and then glue them together, that way you can split up the initial setup effort into several small parts along the project lifecycle. [Pure UI](http://rauchg.com/2015/pure-ui/) explains this in detail. I also recommend these tools: [Carte-blanche](https://github.com/carteb/carte-blanche), [React Storybook](https://github.com/kadirahq/react-storybook), [uiharness.com](http://www.uiharness.com/start). They will help a lot!

## Network Requests

In a situation where you have to fetch data from an external API e.g calling the Github API in your **ReactJS** application, there are several tools you can use. I highly recommend [axios](https://github.com/mzabriskie/axios) and [superagent](https://github.com/visionmedia/superagent).

_HTTP Request Example With Axios_

```js
import axios from 'axios';

function getRepos(username){
  return axios.get('https://api.github.com/users/${username}/repos');
}

function getUserInfo(username){
  return axios.get('https://api.github.com/users/${username}');
}

const helpers = {
  getGithubInfo(username) {
    return axios.all([getRepos(username), getUserInfo(username)])
      .then(arr => ({
      repos: arr[0].data,
      bio: arr[1].data
    }))
  }
};

export default helpers;
```
This is a helper utility that you can now call and render out in different **ReactJS** components within your app.

## Flux Pattern - State Management

Flux is an application architecture for React that utilizes a unidirectional flow for building client-side web applications. With Flux, when a user interacts with a React view, the view propagates an action through a central dispatcher, to the various stores that hold the application's data and business logic, which updates all of the views that are affected. When choosing a dispatcher for your app, Facebook's [dispatcher](https://github.com/facebook/flux/blob/master/src/Dispatcher.js) library should come in handy. It's easy to instantiate and use. Alongside this library, you will need any good Javascript event library. NodeJS [EventEmmiter](https://nodejs.org/api/events.html#events_class_events_eventemitter) module is a good option. You can install flux from [npm](https://www.npmjs.com), the dispatcher will be immediately available via `var Dispatcher = require('flux').Dispatcher;`. More details about the Flux pattern can be found [here](http://facebook.github.io/flux/docs/overview.html).

![Data Flow](https://facebook.github.io/flux/img/flux-simple-f8-diagram-1300w.png)
*(Source: [Facebook](https://facebook.github.io/flux/docs/overview.html))*


### Redux
Redux evolves the idea of Flux. It's a state management library with a minimal API but completely predictable behavior, so it is possible to implement logging, hot reloading, time travel, universal apps, record and replay, without any buy-in from the developer. You can also install it via NPM like so: `npm install redux redux-devtools --save`. Redux attempts to make state mutations predictable by imposing certain restrictions on how and when updates can happen. Redux has three fundamental principles:

* Single source of truth
* State is read-only
* Changes are made with pure functions


Read more about Redux [here](http://redux.js.org/). [Here](https://github.com/xgrommx/awesome-redux) is also an awesome list of Redux examples and middlewares. Another alternative for state management within your **ReactJS** application is [Alt](http://alt.js.org/). More information about Alt [here](http://alt.js.org/guide/).

## Authentication

Authentication is an important part of any application. The best way to do user authentication for single page apps is via JSON Web Tokens (JWT). A typical authentication flow is this:

* A user signs up/logs in, generate JWT token and return it to the client
* Store the JWT token on the client and send it via headers/query parameters for future requests

_Authentication flow_

<img alt="How JSON Web Tokens work?" style="background-color: #4e92df;" src="https://auth0.com/learn/wp-content/uploads/2016/01/jwt-how-it-works.png">

A comprehensive example of adding authentication to a **ReactJS** app is [here](https://auth0.com/blog/2015/04/09/adding-authentication-to-your-react-flux-app/). Using Redux? [Here](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/) is a good example of setting up authentication in your **ReactJS** application.

### Implementing Authentication with Auth0

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. Multifactor Authentication, Single sign-on and passwordless-login is also a breeze with **Auth0**.

With Auth0, you can add authentication to any app in under 10 minutes and implement features like social login, multifactor auth, and single sign-on at the flip of a switch. It is the easiest way to add authentication to your app!

A full implementation of Authentication with Auth0 in a **ReactJS** application is [here](https://auth0.com/docs/quickstart/spa/react).

## Data Persistence

Without a backend, you can persist data in your Single Page App by using Firebase. In a **Reactjs** app, all you simply need is [ReactFire](https://github.com/firebase/reactfire). It is a **ReactJS** mixin for easy Firebase integration. With ReactFire, it only takes a few lines of JavaScript to integrate Firebase data into React apps via the ReactFireMixin.

```bash
npm install reactfire react firebase --save
```

_TodoList Example_

```js
import React from 'react';

class TodoList extends React.Component {
  render() {
    var _this = this;
    var createItem = (item, index) => {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };

    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
}

class TodoApp extends React.Component {
  getInitialState() {
    return {
      items: [],
      text: ''
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('todoApp/items');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(childSnapshot => {
        const item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        items.push(item);
      });

      this.setState({
        items: items
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  removeItem(key) {
    var firebaseRef = firebase.database().ref('todoApp/items');;
    firebaseRef.child(key).remove();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  }

  render() {
    return (
      <div>
        <TodoList items={ this.state.items } removeItem={ this.removeItem } />
        <form onSubmit={ this.handleSubmit }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
        </form>
      </div>
    );
  }
}


ReactDOM.render(<TodoApp />, document.getElementById('todoApp'));
```

More information about persisting your data using ReactFire [here](https://github.com/firebase/reactfire/blob/master/docs/quickstart.md).

## Testing

Most projects become a mountain of spaghetti code at some point during development due to lack of solid tests or no tests at all. **ReactJS** apps are no different, but this can be avoided if you know some core principles. When writing tests for **ReactJS** code, it is helpful to pull out any functionality that doesn't have to do with any UI components into separate modules, so that they can be tested separately. Tools for unit testing those functionalities are [mocha](https://github.com/mochajs/mocha), [expect](https://github.com/mjackson/expect), [chai](https://github.com/chaijs/chai), [jasmine](https://github.com/jasmine/jasmine).

Testing becomes tricky in a **ReactJS** application when you have to deal with components. How do you test stateless components? How do you test components with state? Now, **ReactJS** provides a nice set of test utilities that allow us to inspect and examine the components we build. A particular concept worthy of mention is **Shallow Rendering**. Instead of rendering into a DOM the idea of shallow rendering is to instantiate a component and get the result of its render method. You can also check its props and children and verify they work as expected. More information [here](http://engineering-blog.alphasights.com/testing-react-components-with-shallow-rendering/).

Facebook uses [Jest](https://github.com/facebook/jest) to test React applications. AirBnB uses [Enzyme](https://github.com/airbnb/enzyme/). When bootstrapping your **ReactJS** application, you can set up any of these awesome tools to implement testing.

## Generators and Boilerplates

A lot of tools have been mentioned in this post in relation to setting up different parts of a **ReactJS** app. If you don't intend writing your app from scratch, there are lots of generators and boilerplates that tie all these tools together to give you a great starting point for your app. One fantastic one is [React Starter Kit](https://github.com/kriasoft/react-starter-kit). It has a [Yeoman generator](https://www.npmjs.com/package/generator-react-fullstack). It's an isomorphic web app boilerplate that contains almost everything you need to build a **ReactJS** app. Another boilerplate is [React Static boilerplate](https://github.com/kriasoft/react-static-boilerplate), it helps you build a web app that can be hosted directly from CDNs like Firebase and Github Pages. Other alternatives are [React redux starter kit](https://github.com/davezuko/react-redux-starter-kit) and [React webpack generator](https://github.com/newtriks/generator-react-webpack).


## Conclusion

There are several tools that will help bootstrap your React app, we looked at a couple that we consider are quite good, that will have your application up and running in no time. But feel free to search for your own tools, and if you think that we are missing something, let us know in the comments. Setting up a React project should be painless!

{% include tweet_quote.html quote_text="Setting up a React project should be painless!" %}
