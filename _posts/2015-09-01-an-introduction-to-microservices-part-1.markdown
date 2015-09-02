---
layout: post
title: "An Introduction to Microservices, Part 1"
description: "Learn what are microservices and how they are used in the industry"
date: 2015-09-02 18:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#3071BE"
  image: https://cdn.auth0.com/blog/microservices/icon.png
  image_size: "70%"
  image_bg: "#3071BE"
tags: 
- microservices
- design patterns
- api design
- api
- patterns
- REST
- SOA
- webtask
- webtasks
- software architecture
- post-series
---

Everybody is talking about microservices. Industry veterans may remember monolithic or SOA-based solutions being *the way* of doing things. Times have changed. New tools have allowed developers to focus on specific problems without adding excessive complexity to deployment or other administrative tasks that are usually associated with isolated services. It has become increasingly easy to choose to work with the right tool for the right problem. 

In this **post series**, we will explore the world of microservices, how it can help solve real world problems, and why the industry is increasingly picking it as the standard way of doing things. In this series, we will attempt to tackle common problems related to this approach, and provide convenient and simple examples. By the end of the series, we should have a skeleton implementation of a full microservice-based architecture. Today, we will focus on what microservices are and how they compare to the alternatives. We will also list the problems we plan to discuss in the following posts.

-----

## What is a microservice?
A microservice is an **isolated**, **loosely-coupled** unit of development that works on a **single concern**. This is similar to the old "Unix" way of doing things: do one thing, and do it well. Matters such as how to "combine" whatever is provided by the service are left to higher layers or to policy. This usually means that microservices tend to avoid interdependencies: if one microservice has a hard requirement for other microservices, then you should ask yourself if it makes sense to make them all part of the same unit.

![Typical microservices diagram](https://cdn.auth0.com/blog/microservices/Microservices.png)

What makes microservices particularly attractive to development teams is their **independence**. Teams can work on a problem or group of problems on their own. This creates several attractive qualities favored by many developers:

- **Freedom to pick the right tool**: Is that new library or development platform something you always wanted to use? You can (if it's the right tool for the job).
- **Quick iteration**: Was the first version suboptimal? No problem, version 2 can be out the door in no time. Because microservices tend to be small, changes can be implemented relatively quickly.
- **Rewrites are a possibility**: In contrast with monolithic solutions, since microservices are small, rewrites are a possibility. Was the technology stack the wrong pick? No problem, switch to the right alternative.
- **Code quality and readability**: Isolated development units tend to be of higher quality and new developers can get up to speed with the existing code fairly easily.

Given what we have seen so far, you might be asking yourself how to do microservices The Right Way<sup>tm</sup>. Fortunately, many teams have already integrated microservices into their (huge) developments, so we can learn from them. Netflix is a great example of a company that built itself on top of a microservice-based architecture. Here is a short list of the problems and common design patterns we will discuss in this series:

- **API proxying**
- **Logging**
- **Service discovery and registration**
- **Service dependencies**
- **Data sharing and synchronization**
- **Graceful failure**
- **Automated deployment and instantiation**

## How do microservices compare to the alternatives?

<br>
<table class="table">
<tr>
<th>Microservices</th><th>Common service</th><th>Monolithic</th>
</tr>
<tr>
<td>Deals with a single concern</td><td>Deals with a single concern</td><td>Deals with many concerns</td>
</tr>
<tr>
<td>Independently deployable </td><td>Usually deployed as part of a packet of services</td><td>Deployed as a single entity</td>
</tr>
<tr>
<td>Independently instantiable</td><td>Instantiated as part of a bigger application</td><td>Instantiated as a single entity</td>
</tr>
<tr>
<td>May be an independent process</td><td>Usually not an independent process</td><td>Usually a single process with many workers</td>
</tr>
<tr>
<td>Automated deployment</td><td>Deployment is usually automated</td><td>Deployment may be automated</td>
</tr>
<tr>
<td>Flexible software stacks</td><td>Fixed software stacks</td><td>Fixed software stack</td>
</tr>
<tr>
<td>Possibly higher memory use</td><td>Dependent on software stack</td><td>Dependent on software stack</td>
</tr>
<tr>
<td>Harder data sharing</td><td>Easier data sharing</td><td>Easier data sharing</td>
</tr>
<tr>
<td>Harder dependency management</td><td>Framework-based dependency management</td><td>Framework-based dependency management</td>
</tr>
<tr>
<td>Easily scaled</td><td>Ease of scaling dependent on design</td><td>Ease of scaling dependent on design</td>
</tr>
</table>
<br>

## Things to keep in mind
Now that we understand how microservices compare to the alternatives, here is a list of things we need to keep in mind when designing our microservice-based architecture. Don't worry if this seems too abstract; we will deal with all these concerns in a systematic way throughout this series of posts.

- **Cross-cutting concerns** must be implemented in a way such that microservices need not deal with details regarding problems outside their specific scope. For instance, authentication can be implemented as part of any API gateway or proxy.
- **Data sharing** is hard. Microservices tend to favor per-service or per-group databases that can be updated directly. When doing data modeling for your application, notice whether this way of doing things fits your application. For sharing data between databases, it may be necessary to implement an internal process that handles internal updates and transactions between databases. It is possible to share a single database between many microservices; just keep in mind that this may limit your options when and if you need to scale in the future.
- **Availability**: Microservices, by virtue of being isolated and independent, need to be monitored to detect failures as early as possible. In a big software stack, one service that goes down may go unnoticed for some time. Account for this when picking your software stack for managing services.
- **Evolution**: Microservices tend to evolve fast. When dedicated teams deal with specific concerns, new and better solutions are found quickly. Therefore, it is necessary to account for versioning of services. Old versions are usually available as long as there are clients who need to consume data from them. Newer versions are exposed in an application-specific way. For instance, with an HTTP/REST API, the version of the microservice may be part of a custom header, or be embedded in the returned data. Account for this.
- **Automated deployment**: The whole reason that microservices are so convenient nowadays is that it is so easy to deploy a new service from a completely clean environment. See Heroku, Amazon Web Services, or other PaaS providers. If you are going for your own in-house approach, keep in mind that the complexity of deploying new services or versions of preexisting services is critical to the success of your solution. If deployment is not handled in a convenient, automated way, you risk eventually reaching a level of complexity that outweighs the benefits originally brought about by the approach.
- **Interdependencies**: Keep them to a minimum. There are different ways of dealing with dependencies between services. We will explore them further later in this blog post series. For now, just keep in mind that dependencies are one of the biggest problems with this approach, so seek ways to keep them to a minimum.
- **Transport and data format**: Microservices are fit for any transport and data format; however, they are usually exposed publicly through a RESTful API over HTTP. Any data format fit for your information works. HTTP + JSON is very popular these days, but there is nothing stopping you from using protocol-buffers over AMQP, for instance.

## Keeping it real: a sample microservice

Now, this should be easy. If microservices take so much baggage off the development team's mind, writing one should be a piece of cake, right? Yes, in a way. While we could write a simple RESTful HTTP service and call that a microservice, in this post we will do it by taking into account some of the things we have listed above (don't worry: in the following posts, we will expand this example to include solutions for ALL the concerns listed above).

For our example, we will pick the backend code from Sandrino Di Mattia's excellent [post](https://auth0.com/blog/2015/08/25/logging-and-debugging-in-react-with-flux-replaying-your-users-actions/) about using Flux for debugging. In Sandrino's post, a simple express.js app makes the backend for a React.js app. We will take that backend and adapt it. You can see the original backend code [here](https://github.com/auth0/react-flux-debug-actions-sample/blob/master/server.js).

The backend in Sandrino's example handles many different concerns: login, authentication, [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing), update operations over tickets, and queries. For our microservice we will focus on one task: querying tickets. Check it out:

```javascript
var express = require('express');
var morgan = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var logger = require('./logger');

mongoose.connect('mongodb://localhost/test');

// Our ticket sample schema
var Ticket = mongoose.model('Ticket', {
    id: Number,
    status: String,
    title: String,
    userInitials: String,
    assignedTo: String,
    shortDescription: String,
    description: String,
    replies: [{ user: String, message: String }]
});

var app = express();
app.use(
    //Log requests
    morgan(':method :url :status :response-time ms - :res[content-length]', { 
        stream: logger.stream 
    })
);

app.get('/tickets', function(req, res, next) {
    Ticket.find({}, function(err, result) {
        if(err) {
            logger.error(err);
            res.sendStatus(500);
            return;
        } 
        res.json(result);
    });
});

var port = process.env.PORT || 3001;
http.createServer(app).listen(port, function (err) {
  if (err) {
    logger.error(err);
  }
  else {
    logger.info('Listening on http://localhost:' + port);
  }
});
```

You will notice that we have removed a lot of code. Our microservice does **one thing and one thing only**: it queries the database for a full list of tickets. There's nothing else going on here. We have kept **logging**, as it is an essential part of any microservice. Authentication, CORS checks, etc. are gone. These are all handled by upper layers in our microservice-based architecture. 

One thing we could improve (and we will do that later posts in the series) is logging. Right now we are just logging to the console (using a predefined format that is easy to parse), but we could go one step further: we could send our logs to a centralized logging system that can perform automated monitoring and make decisions based on filters. This is why using the 'winston' library for logging is a great choice: in the future we can add new output streams that can do what we just described.

For now, though, this will do. Our microservice does one thing and does it right. It can **easily be scaled**, there are **no dependencies** on other services, logging can be easily centralized when we have a proper service to handle that, the code is **small and readable**, and it can be run totally **isolated** and on its own process.

Another thing we will add in future posts will be **service registration**. If you were to put this in production right now, you would probably hardcode the internal endpoint for this service in the API gateway. In practice you will want to do more than that: have the service register itself, or have a process polling for available services and setting up endpoints in the gateway dynamically. With this approach, **failures** can also be handled gracefully: if the service goes down, you can point the endpoint to another equivalent or backup service (using older data perhaps, or whatever works for your use case).

There is also the matter of **data sharing**: should this service keep a separate read-only database with tickets or should it share the database with other microservices that perform updates? We will explore this question in the following posts.

Get the [code](https://github.com/sebadoom/auth0/tree/master/microservices/microservice-1).

## Aside: Interested in microservices? You will love webtasks!
The latest newcomer to the world of microservices is [webtask.io](https://webtask.io). While other solutions provide convenient ways to deploy an application and keep it running, webtask.io takes it a step further by providing a simple, automated way to distribute and run whole-code services to a remote virtualized hardware provider. In other words, deployment, instantiation, and routing are now easier than ever. This makes working with microservices a piece of cake. Check it out:

```sh
npm install wt-cli -g
wt init your.name@email.com # This will send an activation link to your email.

echo "module.exports = function (cb) {cb(null, 'Hello');}" > hello.js
wt create hello.js
curl https://webtask.it.auth0.com/api/run/wt-sebastian_peyrott-auth0_com-0/hello?webtask_no_cache=1
```

## Conclusion
Microservices are the new way of doing distributed computing. Advances in deployment and monitoring tools have eased the pain involved in managing many independent services. The benefits are clear: using the right tool for the right problem, and letting teams use their specific know-how to tackle each problem. The hard part is dealing with shared data. Special considerations must be taken into account when dealing with shared data and inter-service dependencies. Data modeling is an essential step in any design, and is even more so in the case of a microservices-based architecture. We will explore other common patterns and practices in detail in the following articles.



