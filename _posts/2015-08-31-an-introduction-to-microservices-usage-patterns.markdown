---
layout: post
title: "An Introduction to Microservices, Part 1"
description: "Learn what are microservices and how they are used in the industry"
date: 2015-09-01 18:00
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

Now, this should be easy. If microservices take so much baggage out of the development team's mind, writing one should be a piece of cake, right? Yes, in a way. While we could write a simple RESTful HTTP service and call that a microservice, we will do so by taking into account some of the things we have listed above (don't worry, in the following posts, we will expand this example to include solutions for ALL the concerns listed above).

Our example 

TODO

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



