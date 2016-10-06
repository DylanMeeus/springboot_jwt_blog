---
layout: post
title: "Analyzing Enterprise Connections Data: What can we learn?"
description: How our Customer's Users Are Connecting To Enterprise Providers
date: 2016-08-02 12:20
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design: 
  bg_color: "#1F3C5E"
  image: https://cdn.auth0.com/blog/social-login-stats/logo.png
tags: 
- enterprise-connections
- active-directory
- auth0
related:
- 2016-07-21-analysis-of-social-connection-data
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-14-safely-use-best-customer-retention-tactics
---

Auth0 supports authentication through a ton of different providers. Through social login, our user's users can connect via Google, Twitter, Facebook and a host of others. Auth0 also provides authentication for Enterprise clients through LDAP, Microsoft, and Google among others.

Throughout 2015 we collected data on how companies and individuals were using these providers with Auth0. We wanted to know how our users were using Auth0 and how their users were using Auth0. Which providers were the most used and how was their share changing over time.

In this second article we are looking at which Enterprise providers are most used via Auth0, how often Enterprise connections are used, and how developers can use better connections to boost security, usability and value for users. 

Here’s what we found.

## What Connections Are Enterprise Using?

Auth0 has a number of Enterprise connections available to users easily from the Dashboard:

![Enterprise Connections Dashboard](https://cdn.auth0.com/blog/enterprise-connection-stats/enterprise-connections-dashboard.png)

Using these allows companies to let their users connect via enterprise credentials, access internal identity providers to validate these credentials, and implement single sign on (SSO) easily for their users.

We wanted to see which of these possible connections was most common among Enterprise users:

![Enterprise Connections Usage](https://cdn.auth0.com/blog/enterprise-connection-stats/enterprise-connections.png)

**Findings:**

* Most (53%) Enterprise connections are through Active Directory Federation Services (ADFS).
* Another 35% are using Active Directory connections.
* SAMLP (7%), Microsoft Azure Active Directory (3%), and Google Apps (2%) round out the top 5.

These results show that logins via Windows Server architecture are still by far the most common connections made by Enterprise. These results tally with what we have said before—[hundreds of thousands of companies rely on Active Directory](https://auth0.com/blog/2013/04/10/Auth0-Windows-Azure-Active-Directory/). In fact, over 90% of all Enterprise connections through Auth0 are built on Windows architecture, either through AD directly, Microsoft Azure, or via Office 365 or Sharepoint.


{% include tweet_quote.html quote_text="Over 90 percent of all Enterprise connections through Auth0 are built on Windows architecture." %}


ADFS is the part of Active Directory Services that allows for resource access across traditional boundaries: 

* It provides simplified and secure identity federation.
* It enables the creation of trust relationships between two organizations.
* Provides access to applications between organizations.
* Provides single sign on between two different directories for web-based applications.

In this way, it acts as an easy and transparent way for a user in one organization to connect and access applications from another organization. 

However, because Active Directory was designed to work on the internal corporate network, it isn’t best-suited for web-based services.

### Why People Use Microsoft Azure Active Directory through Auth0?
One of the perks of using Auth0 with Microsoft Azure Active Directory is that you gain access to more features not available in AAD standalone. By combining AAD with Auth0 you can take advantage of all our available SDKs and a better development experience.

Whether you are just getting started or already deep into a project - our SDKs will help you quickly integrate a solid authentication framework into your application. We provide SDKs for most major languages and frameworks including [Angular](https://auth0.com/docs/quickstart/spa/angularjs), [Node.js](https://github.com/auth0/node-auth0), [ASP.NET](https://github.com/auth0/auth0.net), [Java](https://auth0.com/docs/java-overview), and more. Our selection of quickstarts, seed projects, and tutorials showcase best practices and how-to’s to ensure you are up and running as quickly as possible.

You also get access to rules, which are JavaScript code snippets that allow easy control and customization of the login process. Rules are an easy way to address that inevitable exception in an identity environment – integration with marketing or analytics tools, whitelisting and other forms of access control, triggering a webhook, and so on. You can check the [Rules documentation](https://auth0.com/docs/rules) for more information.

## How Much Are Enterprise Connections Used?

Enterprise connections are only a small part of the possible login options available through Auth0. We wanted to see what proportion of the total logins were Enterprise compared to these other options:

![Total Users per Connection Type](https://cdn.auth0.com/blog/social-login-stats/total-users.png)

**Findings:**

* An astonishing 70% of all logins still use username and password combinations.
* Enterprise connections account for almost a quarter (24.7%) of all logins.
* Passwordless logins currently account for less than 1% of all logins.

So 1 in 4 connections made through Auth0 are using an Enterprise connection. From this we can surmise that a significant number of Auth0 users are B2B companies, looking to make it easier for the employees of other companies to use their apps. 

This is excellent news. One of the best ways for developers to [grow their revenue](https://auth0.com/blog/2015/08/18/how-to-go-upmarket-and-grow-your-revenue-by-20x) is to add Enterprise options to their existing app, such as the ability for companies to login with their current Enterprise connections.

What is less excellent news is that Enterprise connections, as well as social and passwordless, are still dwarfed by the traditional username and password combination. This means lower security, reduced compliance, and reduced B2B collaboration for those companies and users.

## Conclusion

There are two major findings from our study so far:

1. The vast majority of Enterprise connections are using Windows Active Directory in some capacity.
2. The vast majority of users are still using an individual username and password combination.

Both of these are areas of improvement. Auth0 users currently connecting through AD or ADFS could start to look seriously at using Azure for their connections instead. And Auth0 users not pushing their own users away from unique usernames and passwords should definitely consider allowing SSO, either through Enterprise or Social.
