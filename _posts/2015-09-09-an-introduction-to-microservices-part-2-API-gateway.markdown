---
layout: post
title: "An Introduction to Microservices, Part 2: The API Gateway"
description: "Learn about API gateways and how they work in a microservice-based architecture"
date: 2015-09-04 18:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#596D5F"
  image: https://cdn.auth0.com/blog/post-images/microservices2.svg
  image_size: "60%"
  image_bg_color: "#596D5F"
  blog_series: true
tags: 
- microservices
- design patterns
- api design
- api
- patterns
- REST
- SOA
- software architecture
- post-series
- API gateway
---

In this post of the microservices series we will talk about API gateways and how they can help us solve some important concerns in a microservice-based architecture. We described these and other issues in our [first post](http://add-me) in the series. 

-----

## What is an API gateway and why use it?

In all service-based architectures there are several concerns that are shared among all (or most) services. A microservice-based architecture is not an exception. As we said in the first post, microservices are developed almost in isolation. Cross-cutting concerns are dealt with by upper layers in the software stack. The API gateway is one of those layers. Here is a list of common concerns handled by API gateways:

- Authentication
- Transport security
- Load-balancing
- Request dispatching (including fault tolerance and service discovery)
- Dependency resolution
- Transport transformations

### Authentication
Most gateways perform some sort of authentication for each request (or series of requests). According to rules that are specific to each service, the gateway either routes the request to the requested microservice(s) or returns an error code (or less information). Most gateways add authentication information to the request when passing it to the microservice behind them. This allows microservices to implement user specific logic whenever required.

### Security
Many gateways function as a single entry point for a public API. In such cases, gateways handle transport security and then dispatch the requests either by using a different secure channel, or by removing security constraints that are not necessary inside the internal network. For instance, for a RESTful HTTP API, a gateway may perform "SSL termination": a secure SSL connection is established between clients and the gateway; proxied requests are then sent over non-SSL connections to internal services.

### Load-balancing
Under high-load scenarios, gateways can distribute requests among microservice-instances according to custom logic. Each service may have specific scaling limitations. Gateways are desgined to balance load taking these limitations into account. For instance, some services may scale by having multiple instances running under different internal endpoints. Gateways can dispatch requests to these endpoints (or even request the dynamic instantiation of more endpoints) to handle load.

### Request-dispatching
Even under normal-load scenarios, gateways can provide custom logic for dispatching requests. In big architectures, internal endpoints are added and removed as teams work or new microservice instances are spawned (due to topology changes, for instance). Gateways may work in tandem with service registration/discovery processes or databases that describe how to dispatch each request. This provides exceptional flexibility to development teams. Additionaly, faulty services can be routed to backup or generic services that allow the request to complete rather than fail completely.

### Dependency resolution
As microservices deal with very specific concerns, some microservice-based architectures tend to become "chatty": to perform useful work, many requests need to be sent to many different services. For convenience and performance reasons, gateways may provide facades ("virtual" endpoints) that internally are routed to many different microservices.

### Transport transformations
As we learnt in the first post of this series, microservices are usually developed in isolation and development teams have great flexibility with regards to the development platform. This may result in microservices that return data and use transports that are not convenient for clients at the other side of the gateway. The gateway must perform the necessary transformations so that clients can still communicate with microservices behind it.

## An API gateway example

TODO

## Conclusion
API gateways are an essential part of any microservice-based architecture. Cross-cutting concerns such as authentication, load balancing, dependency resolution, data transformations and dynamic request dispatching can be handled in a convenient and generic way. Microservices can then focus on their specific tasks without code-duplication. This results in easier and faster development for each microservice.


