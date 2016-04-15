---
layout: post
title: "rrtr is Dead. React Router Alternatives."
description: "Reactor Router and rrtr have reconciled. Explore React Router alternatives and learn how to use them in your apps."
date: 2016-04-18 08:30
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#333333"
  image: "https://cdn.auth0.com/blog/react-router-alt/react.png"
tags: 
- React
- React Router
- rrtr
- React Component Router
- React Mini Router
- RRouter
- Universal Router
- router5
---

The JavaScript ecosystem, for better or worse, is in a constant state of change and disarray. From the NodeJS [fork](https://iojs.org/en/faq.html) to [io.js](https://iojs.org/en/) and later [reconciliation](https://nodejs.org/en/blog/announcements/foundation-v4-announce/) to the npm [package-gate](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) which broke many packages and ruined a lot of peoples day. The constant in all of this turbulence is that the JavaScript community was quick to react and resolve the issue for the better.

The latest discord comes from the popular and heavily-depended upon [**React Router**](https://github.com/reactjs/react-router) library, which provides a routing framework for React built applications. React Router is a community project with no direct affiliation to Facebook or React but is a major dependency for many developers building React apps.

React Router was forked into [**rrtr**](https://github.com/taion/rrtr) by Jimmy Jia, a longtime contributor to the project, last week after complaints that React Router has fallen into a slow release cycle, is missing critical features and more. A few days later, the rrtr library was itself deprecated and users told to switch back to React Router. Jimmy was made an owner of the React Router project so that he could further his contributions to the project.

## React Router Alternatives

React Router is the de-facto routing library for React. At Auth0, we use React and React Router in a number of our apps, including our [docs](https://auth0.com/docs). In our brief post today, we'll take a look at some React Router alternatives.

{% include tweet_quote.html quote_text="React Router is the de-facto routing library for React apps." %}

### React Router Component
[**React Router Component**]() is a declarative router component for React. Routes in this library are declared directly as part of your component hierarchy. Having routes defined as a part of your component hierarchy allows for dynamically reconfiguring routing based on application state. An example of the React Router Component in action:

```
var App = React.createClass({
  render: function() {
    return (
      <Locations>
        <Location path="/" handler={MainPage} />
        <Location path="/users/:username" handler={UserPage} />
        <Location path={/\/friends\/(\d+)\/(photos|wall)/} handler={FriendsPage}
      matchKeys={['id', 'pageName']} />
      </Locations>
    )
  }
})
```

### React Mini Router

The [**React Mini Router**](https://github.com/larrymyers/react-mini-router) is a minimal routing library for React apps. It has few external dependencies and comes in at a tiny 4kb when gzipped. This routing library works by declaring the routes at the root level of the React app. This may be a good alternative for simple React apps.

```
var React = require('react'),
  RouterMixin = require('react-mini-router').RouterMixin;

var App = React.createClass({

  mixins: [RouterMixin],

  routes: {
    '/': 'home',
  },

  render: function() {
    return this.renderCurrentRoute();
  },

  home: function() {
    return <div>Hello World</div>;
  },

  notFound: function(path) {
    return <div class="not-found">Page Not Found: {path}</div>;
  }

});

module.exports = App;
```

### RRouter

[**RRouter**](http://andreypopp.github.io/rrouter/) is another React Router alternative that provides declarative routing for React applications. RRouter provides nested routing, named routes, link generation as well as a few other great features. RRouter code example:

```
var React = require('react')
var RRouter = require('rrouter')
var Route = RRouter.Route

var routes = (
  <Route>
    <Route path="/" view={MainPage} />
    <Route path="/about" view={AboutPage} />
  </Route>
)

RRouter.start(routes, function(view) {
  React.renderComponent(view, document.body)
})
```

### Universal Router

[**Universal Router**](https://www.kriasoft.com/universal-router/) provides a simple routing solution for JavaScript built apps including React. The benefits of universal router are that it uses the same middleware approach as [Express](http://expressjs.com/) which makes it very easy to pick up, learn and extend. An example of universal router in action:

```
import React from 'react';
import ReactDOM from 'react-dom';
import { match } from 'universal-router';

const routes = [
  { path: '/one', action: ({ render }) => render(<h1>Page One</h1>) },
  { path: '/two', action: ({ render }) => render(<h1>Page Two</h1>) }
];

function render(component) {
  return Promise(resolve => {
    ReactDOM.render(component, document.body, resolve);
  });
}

match(routes, { path: '/one', render });
```


### router5

[**router5**](http://router5.github.io/) is a framework agnostic routing solution that is not limited to only React. It treats routing like any other data or state and handles both route and data updates. router5 was designed for component trees which makes it a great fit for React based applications. Here is an example of router5 with React in action:

```
import React from 'react';
import { Link } from 'react-router5';

function Menu(props) {
return (
  <nav>
    <Link routeName='home' routeOptions={{reload: true}}>Home</Link>

    <Link routeName='about' routeOptions={{reload: true}}>About</Link>
  </nav>
);
}

export default Menu;
```

For additional resources on router5 check out their [Github repo](https://github.com/router5/router5) and the [helper library](https://github.com/router5/react-router5) for React.

## Build Your Own React Router

If you are feeling adventurous and up for a challenge, [James K Nelson](https://twitter.com/james_k_nelson) has written a great [tutorial](http://jamesknelson.com/routing-with-raw-react/) on building your own routing solution with React. His tutorial covers a lot and is a great starting point for learning and understanding how state based routing works.

## Conclusion

The JavaScript community is constantly changing. Frameworks, libraries and conflicts come and go. React Router is and will likely remain the go-to routing library for React but that's not to say that there aren't great alternatives worth checking out. The co-maintainers of the React Router library have [pledged](https://medium.com/rackt-and-roll/rrtr-is-dead-long-live-react-router-ce982f6f1c10#.uc8anqeqb) to take better steps in terms of communication, release schedule and merging of pull requests for the React Router library and I'm excited to see those changes implemented.

<div class="riddle_target" data-url="//www.riddle.com/a/60905" style="margin:0 auto;max-width:640px;"><div style="display:none"><section><h2>What routing library do you use for your React apps?</h2></section><section><h3>React Router</h3></section><section><h3>React Router Component</h3></section><section><h3>React Mini Router</h3></section><section><h3>RRouter</h3></section><section><h3>Universal Router</h3></section><section><h3>router5</h3></section><section><h3>Other</h3></section></div><div class="rid-load" style="background:#000 url(//www.riddle.com/assets/img/loader.gif) no-repeat center/10%;padding-top:56%;border-radius:5px"></div></div><script src="//www.riddle.com/files/js/embed.js"></script>