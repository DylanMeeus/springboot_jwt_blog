---
published: "true"
layout: post
title: Introducing Db Connections
date: "2013-05-31 19:50"
author: 
  name: José F. Romaniello
  url: "http://joseoncode.com"
  mail: "jfromaniello@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png"

---
{% excerpt %} 

Since we released the beta, one of the things our customers have been telling us, is they want us to support a "username/password" authentication. They want to have a single uniform authentication across all the options: social providers, enterprise (like Google Apps or Active Directory) and now the good old username and password.

{% endexcerpt %}

### Enter Database Connections

Database Connections works exactly like "Custom Connections" but with some advantages:

-   you don't have to deploy another application
-   seamless widget integration 
-   a whole set of templates for your needs
-   develop, try and debug in the cloud without needing to install any tool

### Example: ASP.NET Membership Provider

Suppose we have already started to build a product using the standard [ASP.NET Membership Provider](http://msdn.microsoft.com/en-us/library/yh26yfzy(v=vs.100).aspx). ASP.NET Membership autogenerates a set of tables and relationships in Sql Server as shown here:

![](http://blog.auth0.com.s3.amazonaws.com/A4N95VJO07-1200x1200.jpeg)

We would start by creating a new Database Connection in Auth0. Then we can pick the ASP.NET Membership Provider from the list:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.13.08%20PM.png)

We can tweak the script to fit our needs:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.18.50%20PM.png)

Connection strings and passwords should be stored as configuration settings in the bottom pane:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.20.08%20PM.png)

We can open at anytime the Try window to run our script:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.22.15%20PM.png)

In order to debug the script you can take advantage of `console.log`:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.27.28%20PM.png)

After we have finished the script, the login widget in our site will look like this:

![](http://blog.auth0.com.s3.amazonaws.com/Screen%20Shot%202013-06-03%20at%205.31.49%20PM.png)

### Get started today

Read the [tutorial](https://docs.auth0.com/mysql-connection-tutorial) in our documentation page to get started.