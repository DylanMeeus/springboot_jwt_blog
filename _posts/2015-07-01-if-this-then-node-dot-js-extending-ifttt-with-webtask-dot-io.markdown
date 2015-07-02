---
layout: post
title: "If This Then [Node.js]"
description: Extending IFTTT With Webtask.io
date: 2015-07-01 15:39
author: 
  name: Milo Mordaunt
  url: https://twitter.com/bananaoomarang
  mail: milo@auth0.com
  avatar: https://en.gravatar.com/userimage/24343392/119d3a13b6da0d9eabbcde831f163c4b.jpeg
design: 
  bg_color: "#297BC3"
  image: https://cldup.com/8iklT4GjWO.png
tags: 
- webtasks
- ifttt
- pocket
- tutorial
---

![Simples](https://docs.google.com/drawings/d/1Ab0L0_5914Xs7wTKzu2uSJuk4_lFoSDUYaHravjlq-8/pub?w=566&h=218)

If you've ever used [IFTTT](https://ifttt.com) as a developer and thought something like: "Gee, I wish I could write my own scripts as channels", you may just be in luck. When combined with their new ['Maker' Channel](https://ifttt.com/channels/maker), enabling users to call external APIs, webtasks can be used to run arbitrary code, on request.

In this article we'll build a simple IFTTT channel to log words used in the headers and bylines of articles we save with [Pocket](https://getpocket.com/), a 'read it later service' which bookmarks interesting articles for later, so they are sortable by frequency.

## What's a webtask?

```js
return function (done) {
  done(null, 'Hello, webtasks!');
}
```

A webtask is a snippet of code that can be called on a simple HTTP request, either directly in a browser or indeed anywhere else. The above is a very simple example but, as we will see in a moment, they can be extended as much as you wish. Their major benefits include:

+ Ease of use. No complicated setup, just code.
+ Vastly simplifies/eliminates the need for backend code, boiling it down into reusable, functional pieces.
+ Tamper proof (uses JSON webtokens behind the scenes), and encrypted where they need to be.

You can play with the service and read more about it [here](https://webtask.io/), but what it amounts to is a safe and frictionless way to run custom micro-services. Perfect for extending IFTTT.

## Setup

Firstly we need to install the command line application, to make task management easier. To set it up all we need is:

```
$ npm i -g wt-cli
$ wt init
```

To test if it's working after the setup, make the file `hello-webtasks.js` and write either the following, or something to that effect:

```js
return function (done) {
  done(null, 'Hello, webtasks!');
}
```

The only requirement is that you return an entry function to be run on webtask.io's servers, here we just send back a simple message. Just run:

`$ wt create hello-webtasks.js` 

And you should be given a URL. Visit it in you're browser of choice and you can see the message is returned. It's pretty neat, right?

![Cool beans.](https://cdn.auth0.com/blog/ifttt-tutorial/hello-webtasks-directors-cut.gif "Hello There!")

Even neater is the ability to add some context to the request through a query string or request body, and access it like so:

```js
return function (ctx, done) {
  done(null, 'Hello, ' + ctx.data.name);
}
```

Generate a new URL with `wt create`, but this time when you visit it add `&name=<your-name>` to the end of the address, and you're webtask will greet you!

```
$ curl https://webtask.it.auth0.com/api/run/...&name=milo
Hello milo!
```

>Note that you can also add ES6 support to your webtasks easily, just put `"use latest";` at the top, and you're all set!

## Storing your data
 
We're going to take the titles and article excerpts that Pocket gives us and log their frequency. Since webtasks provide no guarantees around data survival times, we'll need somewhere more persistant for the values to live. Here we'll use Mongo, because it's easy and free to get access to a database ([Mongolab](https://mongolab.com/plans/pricing/)), and pretty terse to code with under Node.

Our webtask might look something like:

```js
var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;

return function (ctx, done) {
  var words = ctx.data.title
    .split(' ')
    .concat(
      ctx.data.excerpt.split(' ')
    );

  MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
    if(err) return done(err);

    var job_list = words.map(function (word) {

      return function (cb) {
        save_word(word, db, function (err) {
          if(err) return cb(err);

          cb(null);
        });
      };

    });

    parallel(job_list, function (err) {
      if(err) return done(err);

      done(null, 'Success.');
    });

  });
};
```

We connect to the remote database, put all the words Pocket gives us in an array and loop over it, saving each one, then we confirm to IFTTT that we're done by responding.

>Note that we can use `require` just as in regular Node. There is a list of available modules [here](https://tehsis.github.io/webtaskio-canirequire/), with many of them installed in multiple versions for your pleasure.

## Top secrets

Now we need to supply our webtask with access to a database, but we can't just pass our credentials in on the querystring, hardly the safest place for passwords! Instead we'll embed it, encrypted, in our URL. Sounds like it might require some setup, but webtasks supports the passing of encrypted variables out of the box, by embedding them in the URL itself. To pass your secrets safely to your task, just run:

```
$ wt create --secret SECRET=<my-darkest-secrets> <my-webtask.js>
```

And `SECRET` will by passed on `ctx.data`, just like the variables attached on the querystring. If you haven't already set one up, sign up for a sandbox account at [Mongolab](mongolab.com/) and pass in your database's address as a secret `MONGO_URL=mongodb://<your-database>`.

![Secrecy](https://cdn.auth0.com/blog/ifttt-tutorial/secrecy.png "Secrecy")

## If This Then Webtask

![If This Then [Node]](https://cdn.auth0.com/blog/ifttt-tutorial/recipe.jpg "We use IFTTT's Maker channel to make the request")

Connecting your webtask to IFTTT is relatively painless, just setup a recipe to be triggered every time you save something to Pocket and configure the 'That' component to be a 'Maker Channel', where we can hand over control to our script. Copy and paste the URL given by `wt create` into the box, but add `&title={{Title}}&excerpt={{Excerpt}}` to the very end. This dumps the data given by the Pocket channel, making it consumable in the webtask's context.

![Edited Url](https://cdn.auth0.com/blog/ifttt-tutorial/IFTTT-config-3.jpg "Edited URL")

You can test to see if everything's working by saving something in Pocket and watching your webtask's logs with: 

`$ wt logs`

Sometimes it takes a little while for IFTTT to send the request (within a couple of minutes), but you should see a bunch of 'Successfully saved' messages in your console.

![Success.](https://cdn.auth0.com/blog/ifttt-tutorial/logging.jpg "Nice logging skills.")

We can soup it up by ignoring common words and punctuation, saving extra data etc, but the use of webtasks would remain the same.

## To the backend and beyond

![Ta da!](https://cdn.auth0.com/blog/ifttt-tutorial/mongo-read.jpg "Ta da!")

The finished recipe can be found [here](https://ifttt.com/recipes/304471-record-most-read-words-to-mongodb), and the source is on [github](https://github.com/bananaoomarang/webtask-ifttt-tutorial), for your viewing pleasure.

If you'd like to find out more about how webtasks work, as well as their more advanced features, you should check out the docs at [webtask.io](https://webtask.io), but hopefully you can see that their simplicity and versatility is already pretty exciting!
