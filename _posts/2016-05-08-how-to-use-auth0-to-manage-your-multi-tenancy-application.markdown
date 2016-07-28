---
layout: post
title: "How To Use Auth0 To Manage Your Multi-Tenant Application"
description: Using multi-tenancy you can cut costs and still allow your customers strict control over their data
date: 2016-05-08 8:30
alias: /2016/05/08/how-to-use-auth0-to-manage-your-multi-tenancy-application/
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: "https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60"
design:
  bg_color: "#003573"
  image: https://cdn.auth0.com/blog/multi-tenancy/logo.png
tags:
- multi-tenancy
- multi-tenant-applications
- multi-tenancy-benefits

---

## What Is Multi-Tenancy?

A multi-tenanted software architecture allows you to serve multiple customers from a single application instance running on a single server, or pool of servers. This is in contrast to a single-tenant application where each customer would have a dedicated software instance running on dedicated servers. Thus,

* Multi-tenant: One instance, multiple customers.
* Single-tenant: One instance, one customer.

A tenant is defined as a group of users who share access to that application instance. For instance, this could be a company with multiple employees, all who have access to your SaaS service. In a multi-tenant architecture, a single instance of your application would be shared across multiple companies (tenants), and across multiple employees within those companies.

Every tenant would however have a dedicated share of that instance, and multi-tenant application can then be customized for each specific tenant's need, in particular:

* Branding: Each instance would likely need to be “skinned” to fit with the branding of the organization. This is akin to how [Lock](https://auth0.com/lock) can be customized for each user's login page.
* Functionality: Each tenant may require certain workflow changes that fit better with their business.
* Access Control: Each tenant will want to set the permissions, rights, and roles of their users independently.

## The Benefits of Multi-Tenancy

Building multi-tenant applications conveys a number of benefits for a SaaS company:

**Scalability**: There is overhead associated with spooling up each application instance. Extra processing power and memory is required over and above just that for the single instance. Additionally, resources can be shared across tenants in a multi-tenant architecture.

For example, if a SaaS company had 10 tenants, and each tenant needed just over 1 server to fulfill their requirements (say, 1.1 servers), in a single-tenant architecture this would require 20 servers as each tenant would need dedicated servers. In multi-tenant architectures, only 11 servers are needed, as resources can be shared easier.

**Data Handling:** It is easier for the SaaS company to handle and utilize data when it is aggregated in a single location. In a single-tenant application, data will be spread across multiple databases and will need to be pooled for any further analysis by the SaaS. In multi-tenant, this data is easily available, so running queries across multiple tenants and analyzing trends is simpler.

**Release Management:** In a multi-tenant application, there is just one codebase running on a single server or pool of servers. When a fix has to be implemented to the codebase, it just has to be rolled out to this single instance and there is no need to update multiple servers or locations. For a single-tenant application, each instance will need to be patched independently, and tests run on each.

## Why Multi-Tenancy Is Difficult

Building multi-tenant applications is a challenge as it requires significant planning and forethought to go into the initial coding. As there is no physical separation between different tenants like there would be with single-tenant architectures, all the separation has to be resolved in code. Developers have to:

* determine the tenant a request was intended for
* protect against data leakage
* isolate configurations
* run individual logging and background tasks per tenant

Additionally, as each tenant’s data is stored together, significant security testing is required to make sure each tenant has access to only their data.

## Using Auth0 To Build A Multi-Tenant App

Authentication and authorization are fundamental to multi-tenant architectures. Correctly authenticating individual users within a tenant organization and determining what they are authorized to access are paramount to this software model.

{% include tweet_quote.html quote_text="Authentication and authorization are fundamental to multi-tenant architectures." %}

To build multi-tenant applications within Auth0, you only need to create separate applications for each of your tenants from Dashboard → Applications → Create App:

![Creating Auth0 Applications](https://cdn.auth0.com/blog/multi-tenancy/applications.png)

You can then use the [Auth0 API](https://auth0.com/docs/auth-api) to authenticate and authorize users for each application easily:

* **Authenticate** users established by their email address. This could either be through custom email/password combinations with a rule set up to determine the tenant via company email (home realm discovery), or via identity federation such as LDAP, Active Directory, or custom SAML providers.
* **Authorize** users by assigning different roles within the company. This would be managed through metadata.

Metadata in an Auth0 user profile allows you to associate specific information to any authenticated user. In the user profile, Permissions, Groups, and Roles are all special cases of these attributes.

For instance, a user might be authenticated for multiple tenants and have different roles in those tenants:

```json
{
  "email": "matias@auth0.com",
  "app_metadata" : {
    "permissions" : {
      "auth0" : {
        "role" : "admin",
      },
      "sharelock" : {
        "role": "user",
      }
    }
  }
}
```

The logic of the applications can then use this metadata to restrict or allow users access to data and instances as the roles allow.

To find out how you can implement a multi-tenant application using Auth0, follow our demo [here](https://auth0.com/docs/scenarios/multi-tenant-saas-azure-ad).
