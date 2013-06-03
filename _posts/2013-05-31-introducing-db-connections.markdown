---
layout: post
title: "Introducing Db Connections"
date: 2013-05-31 19:50
author: 
  name: José F. Romaniello
  url:  http://joseoncode.com
  mail: jfromaniello@gmail.com
  avatar: https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png
---

Last month we released a type of connection called "Custom Connections" (read more [here](http://blog.auth0.com/2013/04/16/Custom-Authentication-With-Auth0/)). Suppose you have a customer that _wants to use your product with his own users directory_, but he doesn't have any of the supported authentication providers. So, he download a component and Auth0 guides him to connect his directory or database in few simple steps on behalf of your application. This works very well and we are seeing more adoption. 

Few weeks ago, we were really amazed to discover some people using Custom Connections for a use case it wasn't meant to. Imagine you already have a database of users for your product and you want to move to Auth0 single-sign on.

### Database Connections

Database connections works exactly like "Custom Connections" but with some advantages:

-   you don't have to deploy another application
-   seamless widget integration 
-   a whole set of templates for your needs

### Tell Auth0 how to connect to your users database

You write an script inside auth0 to connect to your users database:

![](/img/db-connections-01.png)

### Start from a template

We have packed some script templates:

![](/img/db-connections-02.png)

### Debug your scritps

Use `console.log` to print debug information in your try box:

![](/img/db-connections-03.png)

### Sandboxed API

You can use any of these APIs inside your scripts:

-  [mysql](https://github.com/felixge/node-mysql)
-  [sqlserver](https://github.com/pekim/tedious)
-  [request](https://github.com/mikeal/request)
-  [crypto](http://nodejs.org/api/crypto.html)
-  [Buffer](http://nodejs.org/api/buffer.html)
-  [bcrypt](https://github.com/ncb000gt/node.bcrypt.js/)
-  [pbkdf2](https://github.com/davidmurdoch/easy-pbkdf2)

### Securely store your secrets

Configuration settings are encrypted with AES 256 CBC using your own private key certificate. 

![](/img/db-connections-04.png)

### Seamless widget integration

Ask username and password in the same place:

![](/img/db-connections-05.png)

### Get started today

Read the [tutorial](http://docs.auth0.com/) in our documentation page to get started.

