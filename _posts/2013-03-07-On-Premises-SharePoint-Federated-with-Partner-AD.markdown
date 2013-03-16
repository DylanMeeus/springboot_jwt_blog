---
layout: post
title: "On-Premises SharePoint Federated with Partner AD"
date: 2013-03-07 15:09
author: 
  name: Eugenio Pace
  mail: eugeniop@auth0.com
---

We are going to extend the scenario described in the [previous post](http://blog.auth0.com/2012/03/04/On-Premises-SharePoint-Federated-with-Office-365-and-Google/), so Fabrikom can accept users from another partner company. This time, their users will authenticate with an on-premises Active Directory.

![Federation Active Directory](/img/auth0-sp-O365-ad.png)

Again, with Auth0 this is very simple. Because Fabrikom's SharePoint is already configured to use Auth0, all it needs to do is add a new connection with its partner's AD.

This short demo shows:

-1. John, an employee from Fabrikam's partner company, logs-in into SharePoint with his credentials.
-2. Notice how "home realm discovery" works. John enters his e-mail address in __Auth0 Login Widget__. As with the previous example, Auth0 will extract the domain and map it to the right Fabrikom connection (Active Directory in this case). 

<iframe width="700" height="525" src="http://www.youtube.com/embed/xmGjp1pLbVE?rel=0" frameborder="0" allowfullscreen></iframe>

A frequent question we get is whether the login experience is extensible and customizable. 

The __Auth0 Login Widget__ is designed to get you going quickly and is fully customizable. And is optional. You have full control of the login process. 

For example, Fabrikom is likely to have a URL for its own employees (who generally wouldn't need a selector) and a different URL for partners (who will likely need the selector). Another popular option is to use vanity URLs, or something like:

>https://thesharepoint.fabrikom.com/ThePartner

All this is very simple to achieve with Auth0.

Another frequent question we get is: can the connection between Fabrikom and its partners be automated? 

The automated/self-service provisioning is demonstrated in this [post](http://blog.auth0.com/2012/02/28/SaaS-App-Federated-with-Office-365/), using __Auth0 Provisioning Widget__. 

The __Auth0 Provisioning Widget__ is using Auth0 API under the hood to create a new connection. 

> __A final note of this example:__ the connection to Active Directory is done here through ADFS (Active Directory Federation Services). We assume that the partner has deployed it already. But what if the don't have it?
Auth0 provides you with __Auth0 AD Connector__. A simple component your partner would deploy and you are done with minimal intrusiveness. 
