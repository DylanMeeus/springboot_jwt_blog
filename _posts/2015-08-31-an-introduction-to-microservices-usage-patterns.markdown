---
layout: post
title: "An Introduction to Microservices Usage Patterns"
description: "Learn what are microservices and how they are used in the industry"
date: 2015-08-31 18:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#3071BE"
  image: https://cdn.auth0.com/blog/mfa/logo_ga.svg
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
---

-----

Everybody is talking about microservices. People long in the industry may remember monolithic or SOA-based solutions being *the way* of doing things. Things have changed. New tools have allowed developers to focus on specific problems without adding excesive complexity to deployment and other administrative tasks that are usually associated with isolated services. It has increasingly become easier to work using the right tool for the right problem. Enter the world of microservices.

-----

## What is a microservice?
A microservice is an **isolated**, **loosely-coupled** unit of development that works on a **single concern**. This is similar to the old "Unix" way of doing things: do one thing, and do it well. Matters such as how to "combine" whatever is provided by the service are left to higher layers or policy. This usually means that microservices tend to avoid interdependencies: if one microservice has a hard-requirement on other microservices, then you can ask yourself if it makes sense to make them part of the same unit.

![Typical microservices diagram](https://cdn.auth0.com/blog/microservices/Microservices.png)

## What about Service-Oriented-Architecture (SOA)? Is it the same?
In a way. SOA defines many of the concepts that now are part of the architectural approach known as microservices. However, microservices make special emphasis on **automated and independent deployment/instantiation**. In contrast, classic SOA applications provide services that are independent (in what they do) but that are not necessarily part of a separate application. SOA services may not even be deployable on their own. The important thing to keep in mind is not to worry about semantics, but rather concentrate on what fits your business needs. Microservices are particularly attractive to companies with **many different problems and many different teams**. In the past, dealing with many different concerns when working on providing an integrated solution required lots of overhead coordinating teams over a shared codebase. The microservices approach seeks to do away with that by using new tools that make integration and deployment easier and highly automated, even in the face of totally different software stacks.

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
<td>Harder data-sharing</td><td>Easier data sharing</td><td>Easier data sharing</td>
</tr>
<tr>
<td>Harder dependency management</td><td>Framework based dependency management</td><td>Framework based dependency management</td>
</tr>
<tr>
<td>Easily scaled</td><td>Ease of scaling dependent on design</td><td>Ease of scaling depending on design</td>
</tr>
</table>
<br>

## Things to keep in mind
- **Cross-cutting concerns** must be implemented in a way that microservices need not deal with details regarding problems outside their specific scope. For instance, authentication can be implemented as part of any API gateway or proxy.
- **Data sharing** is hard. Microservices tend to favor per-service, or per-group databases that can be updated directly. When doing data-modelling for your application, see if this way of doing things fits your application. For sharing data between databases, it may be necessary to implement an internal process that handles internal updates and transactions between databases. It is possible to share a single database between many microservices, just keep in mind that this may limit or options when needing to scale in the future.
- **Availability**: microservices, by virtue of being isolated and independent, need to be monitored to detect failures as early as possible. In a big software stack, one service that goes down may go unnoticed for some time. Account for this when picking your software stack for managing services.
- **Evolution**: microservices tend to evolve fast. By having dedicated teams deal with specific concerns new and better solutions are found quickly. Therefore it is necessary to account for versioning of services. Old versions are usually available as long as there are clients that need to consume data from them. Newer versions are exposed in an application specific way. For instance, with an HTTP/REST API, the version of the microservice may be part of a custom header, or be embedded in the returned data. Account for this.
- **Automated deployment**: the whole thing that makes microservices convenient nowadays is how easy it is to deploy a new service from a completely clean environment. See Heroku, Amazon Web Services, or other PaaS providers. If you are going for your own in-house approach, keep in mind that the complexity of deploying new services or versions of preexisting services is critical to the success of your solution. If deployment is not handled in a convenient, automated way, you risk eventually reaching a level of complexity that outweighs the benefits originally brought by the approach.
- **Interdependencies**: keep them to a minimum. There are different ways of dealing with dependencies between services. We will explore them further in this blog post series. For now just keep in mind that dependencies are one of the biggest problems with this approach, so seek ways to keep them to a minimum.
- **Transport and data format**: microservices are fit for any transport and data format, however they are usually exposed publicly through a RESTful API over HTTP. Any data format fit for your information works. HTTP + JSON is very popular these days, but there is nothing that keeping you from using protocol-buffers over AMQP, for instance.

## Our first step: A simple API gateway with authentication
For our simple example, we will assume all microservices are located behind a reverse proxy (or series of reverse proxies) that handle authentication. We will do this using the common pattern of REST-based HTTP based services. When you need to scale, you can create as many proxy instances as required, as long authentication details can be accessed from them. For our puporses we will use node.js with the excellent jsonwebtoken library and node-http-proxy.

```javascript
function validateAuth(data) {
    data = data.split(" ");
    if(data[0] !== "Bearer" || !data[1]) {
        return false;
    }
    
    var token = data[1];    
    try {
        var payload = jwt.verify(token, secretKey);
        // Custom validation logic, in this case we just check that the 
        // user exists
        if(users[payload.sub]) {
            return true;
        }
    } catch(err) {
        console.log(err);
    }
    
    return false;
}

var server = http.createServer(function(req, res) {
    if(req.url === "/login" && req.method === 'POST') {
        doLogin(req, res);
        return;
    }

    var authHeader = req.headers["authorization"];
    if(!authHeader || !validateAuth(authHeader)) {
        send401(res);
        return;
    }
    
    proxy.web(req, res, { target: "http://127.0.0.1:3001" });
});
```

Our simple API proxy performs two functions:

1. Handles login and returns a valid JWT (this may be handled by a separate endpoint that it not proxied, for simplicity we have included it here).
2. Checks that all other requests have a valid JWT.

As simple as that. If you need additional logic for the validation of your users, you can add it inside *validateAuth*. If you need to scale this example, you can run as many instances as you like behind a load balancer. Splitting indexed database data may be a good alternative if you have many concurrent users.

Get the [code](https://github.com/sebadoom/auth0/tree/master/microservices/auth-proxy).

## Conclusion
Microservices are the new way of doing distributed computing. Advances in deployment and monitoring tools have eased the pain from managing many independent services. The benefits are clear: using the right tool for the right problem, letting teams use their specific know-how to tackle each problem. Special considerations must be taken into account when dealing with shared data. Data modelling is a essential step in any design, and more so in the case of a microservices-based architecture. We will explore in detail other common patterns and practices in the following articles.

## Aside: Webtasks!
The newcomer to the world of microservices is [webtask.io](https://webtask.io). While other solutions provide convenient ways to deploy an application and keep it running, webtask.io takes that a step further: a simple, automated way of distributing and running whole-code services to a remote virtualized hardware provider. In other words, deployment and instantiation are easier than ever. This makes working with microservices a piece of cake. Check it:

```sh
npm install wt-cli -g
wt init your.name@email.com # This will send an activation link to your email

echo "module.exports = function (cb) {cb(null, 'Hello');}" > hello.js
wt create hello.js
curl https://webtask.it.auth0.com/api/run/wt-sebastian_peyrott-auth0_com-0/hello?webtask_no_cache=1
```



