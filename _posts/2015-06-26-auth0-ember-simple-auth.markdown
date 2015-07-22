---
layout: post
title: "Ember + Auth0"
description: "Introducing an official 'ember simple auth' add-on"
date: 2015-07-23 06:00
permalink: /2015/06/26/auth0-ember-simple-auth/
author:
  name: "Ben Schwarz"
  mail: ben@auth0.com
  url:  https://twitter.com/benschwarz
  avatar: https://www.gravatar.com/avatar/42e2ec6a72627f8c15115e279a5f7d8e.png?size=80
  twitter: benschwarz
design:
  image: http://assets.auth0.com/blog/ember-simple-auth/ember-logo-small.png
  image_bg_color: "transparent"
  bg_color: "#412b13"

tags:
- ember
- authentication
- plugin
- library
- open source

---
__TLDR;__ Install the add-on using ember-cli `ember install auth0-ember-simple-auth`, or checkout the generated [example application](https://github.com/auth0/auth0-ember-simple-auth/tree/master/examples/simple) to get started.

-------

At Auth0, we’re huge fans of [Ember](http://emberjs.com), the Javascript framework made famous for writing ambitious single page applications (also known as SPA).

Unfortunately, up until now our support and resources for Ember have not equalled our enthusiasm for it. Thankfully, starting today, we have some great news —

![Auth0 + Ember logos](http://cdn.auth0.com/blog/ember-simple-auth/auth0-ember.png)

# Introducing an official 'ember simple auth' add-on

For those familiar with Ember, it might go without saying that “[ember-simple-auth](http://ember-simple-auth.com)” is the most popular authentication helper library around. It implements a strategy based plugin system that allows users to write their own custom authentication strategies.

That is exactly what one of our customers, [Aram Zadikian](https://github.com/brancusi) did, and thanks to his generosity, we’re able to share his fantastic work with you today!

We'll be maintaining `auth0-ember-simple-auth` on an ongoing basis, so you can rely on it to build your ember applications.

## What does it do?

`auth0-ember-simple-auth` is an Ember-cli add-on that uses [Lock](https://auth0.com/lock), and, after some simple configuration will allow you to sign up/in and out — protecting whichever pages you've specified in your router.

```
// app/routes/application.js

import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    sessionRequiresAuthentication: function(){
      // Check out the docs for all the options:
      // https://auth0.com/docs/libraries/lock/customization

      // These options will request a refresh token and launch lock.js in popup mode
      var lockOptions = {authParams:{scope: 'openid'}};

      // This tells simple-lock to use our `auth0-ember-simple-auth` add-on
      this.get('session').authenticate('simple-auth-authenticator:lock', lockOptions);
    }
  }
});

```

Now that you have enabled your simple-auth strategy, its just a matter of importing the `AuthenticatedRouteMixin` from `ember-simple-auth` to lock down routes that need to be protected.

```
// app/routes/my-protected-route.js

import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin);
```

Now you've already got a secure single page application. Time to focus on writing your app!

![A sample application in use — Running through an authentication flow](http://cdn.auth0.com/blog/ember-simple-auth/ember-simple-auth.gif)

You can install & run the `auth0-ember-simple-lock` add-on, or, to fast forward to a fully working ember application (shown above), you can download the seed project from [your application dashboard](https://manage.auth0.com/#/applications).

We can't wait to see what you do with ember, make sure you [reach out on Twitter](https://twitter.com/auth0) with what you create.

✌️ Happy hacking!
