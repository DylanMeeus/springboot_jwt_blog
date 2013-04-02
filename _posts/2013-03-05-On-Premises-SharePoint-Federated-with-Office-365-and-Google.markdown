---
layout: post
title: "On-Premises SharePoint Federated with Office 365 and Google"
date: 2013-03-04 17:39
author: 
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---

{% excerpt %} 

Auth0 is about making identity simple. And even simpler for the most common and recurrent scenarios.

One such scenario is a company that is using __SharePoint on-premises__ and has moved e-mail to __Office365__. They might not yet be ready for using SharePoint in the cloud (e.g. don't have the time for a migration to the cloud, or need more advanced customization than what Office365 offers).

![SharePoint Federation](/img/auth0-sp-O365-goog.png)

With Auth0 this is straight forward, as we support SharePoint out of the box. You simply need 2 lines of JavaScript to initiate login (using __Auth0 Login Widget__).

{% endexcerpt %} 

![](/img/auth0-sp-login-widget.png)

This has an additonal benefit: now you can also open your SharePoint to other organizations that need to collaborate with you. You don't need to create or manage their credentials yourself anymore. 

This short demo shows exactly this scenario:

-1. Tom, an employee in Fabrikom logs-in into SharePoint with his Office365 credentials.
-2. A partner of Fabrikom, logs in with his Gmail account.

<iframe width="700" height="525" src="http://www.youtube.com/embed/QXpjouNt9XM?rel=0" frameborder="0" allowfullscreen></iframe>

In the next post we will cover a natural extension of this first scenario: federating with a partner company using Active Directory.

[Try Auth0 yourself!](http://www.auth0.com)




