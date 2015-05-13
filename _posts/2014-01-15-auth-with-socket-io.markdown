---
layout: post
title: "Token-based Authentication with Socket.IO"
description: "Learn to implement token-based authentication using Socket.IO in this quick tutorial."
date: 2014-01-15 14:18
author:
  name: José F. Romaniello
  url: "http://joseoncode.com"
  mail: "jfromaniello@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png"
design:
  image: http://assets.auth0.com/blog/design-process/socket-io.png
  bg_color: "#030303"
  bg_merge: true

pr: 2
tags:
- featured
---

## Introduction


Authentication in realtime frameworks can be challenging. Perhaps this is because the way these systems work is quite different from a regular web app. The risk of not correctly authenticating your sockets traffic is that you could end up sniffing information on other users streams. **The socket server will not automagically know about the logged-in user, thus anyone could join any stream**.

<!-- more -->

This first diagram shows this common misconception:

<a href="https://docs.google.com/a/auth10.com/drawings/d/1_t1TV5CqUutrj3I7iTg3_u0z2ep4sEvV8gP7gC7ejqU" target="_blank"><img title="Session cookie authentication does not mean sockets are authenticated" src="https://docs.google.com/drawings/d/1_t1TV5CqUutrj3I7iTg3_u0z2ep4sEvV8gP7gC7ejqU/pub?w=509&h=536" />
</a>

> It is a common misconception that a user who is authenticated in the hosting web appliction, is also authenticated in the socket stream. These are two completely different channels.


## Cookie-based and Token-based Auth

There are two ways of solving this problem: the traditional cookie-based approach or a token-based approach. The following diagram explains how each of these methods work:

<a href="https://docs.google.com/drawings/d/1RNkaJ7wHXBLlg3YAdtBOrOb5uxj_6oiNQ-96-YA8X74" target="_blank"><img title="socket.io auth token vs cookiesokies" src="https://docs.google.com/drawings/d/1RNkaJ7wHXBLlg3YAdtBOrOb5uxj_6oiNQ-96-YA8X74/pub?w=990&amp;h=529" />
</a>

In our previous article, we wrote about the benefits of a token-based architecture: [Cookies vs Tokens.  Getting auth right with Angular.JS](http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/). Here are some specific considerations with cookies and realtime frameworks:

- **Coupling**: the first issue when using cookies is that you have to couple the web application authentication mechanism with the socket server authentication. This might be ok in some cases, but it means you are tied to the semantics of the authentication framework which was written with a specific web use case in mind. e.g.: the session cookie is handled by the web framework and you don't have access to that easily unless you know the internals.
- **Hard to configure**: The configuration is error prone. A year ago I wrote [passport-socketio](http://github.com/jfromaniello/passport.socketio) that basically bridges the passport information stored in the express session with socket.io auth. Looking at the [issues](http://github.com/jfromaniello/passport.socketio/issues), most of the problems are related to the configuration or people being unfamiliar with `passport.js`.
- **Not ready for devices**: If you are connecting to a socket from a device, cookies are not there (well, they are but you have to get into cookie containers and what not), so you end up implementing something different for a device.
- **Requires session configuration**: you have to rely on a session store (e.g. Mongodb, Redis, or store the session on a cookie).
- **PHP + Socket.IO**: Reading the PHP cookie and session from node is not easy, [here is a blogpost explaining it](http://simplapi.wordpress.com/2012/04/13/php-and-node-js-session-share-redi/). Same thing applies to other technologies (django, java, etc.).

## Authenticating Sockets using Tokens

By now you should not be surprised if we proposed a different alternative to cookies: using tokens. Let's look at a simple sample that uses [express](http://expressjs.com/), [socket.io](http://socket.io) and handles authentication using Json Web Tokens (JWT).

### Server Side

Code speaks by itself. Focus on the `/login` and the usage of `socketioJwt.authorize`.

    var jwt = require('jsonwebtoken');
    // other requires

    app.post('/login', function (req, res) {

      // TODO: validate the actual user user
      var profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
      };

      // we are sending the profile in the token
      var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });

      res.json({token: token});
    });

    var server = http.createServer(app);

Then the socket.io server

    var socketioJwt = require('socketio-jwt');

    var sio = socketIo.listen(server);

    sio.set('authorization', socketioJwt.authorize({
      secret: jwtSecret,
      handshake: true
    }));

    sio.sockets
      .on('connection', function (socket) {
         console.log(socket.handshake.decoded_token.email, 'connected');
         //socket.on('event');
      });

    server.listen(9000, function () {
      console.log('listening on http://localhost:9000');
    });

The JWT is signed with the `jwtSecret` which is stored only on the server.

Here we are using the [global authorization callback](https://github.com/LearnBoost/socket.io/wiki/Authorizing) on socket.io. We are also using a simple module wrote ([socketio-jwt](https://github.com/auth0/socketio-jwt)) to help us with the details of handling the JWT. This module expects the JWT in the querystring during the handshake.

If the client sends a valid JWT, the handshake completes successfully and the `connection` event is triggered.


### Client Side

A simple js client side code that uses this server is shown bellow:

    function connect_socket (token) {
      var socket = io.connect('', {
        query: 'token=' + token
      });

      socket.on('connect', function () {
        console.log('authenticated');
      }).on('disconnect', function () {
        console.log('disconnected');
      });
    }

    $('#login').submit(function (e) {
      e.preventDefault();
      $.post('/login', {
        username: $('username').val(),
        password: $('password').val()
      }).done(function (result) {
        connect_socket(result.token);
      });
    });

As stated before, this is much simpler than using cookies and sessions, and it is much easier to implement across different technologies.

The complete sample is available for [download here](https://github.com/auth0/socketio-jwt/tree/master/example).

You could use a very similar approach with WebSockets, [this is an example with __einaros/ws__](https://gist.github.com/jfromaniello/8418116).
