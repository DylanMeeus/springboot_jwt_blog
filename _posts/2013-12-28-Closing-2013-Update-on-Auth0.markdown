---
published: "true"
layout: post
title: Closing 2013 - Update on Auth0 
date: "2013-12-28 10:30"
author: 
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---

{% excerpt %} 

For the last few months, we've been working on many new features and improvements to the platform. 
We have reached **1700+ subscribers** to our service, and there are now many companies using the private cloud/on-premises appliance daily. Thanks for your support, feedback and business! 

As this first year closes for us, we wanted to share some of the highlights of Auth0, and the functionality we've added in these past months:

<ol style="font-size: 14px;">
  <li><a href="#1">1. Know who is using your apps</a></li>
  <li><a href="#2">2. Richer user profiles</a></li>
  <li><a href="#3">3. Avoid building yet another user/password store</a></li>
  <li><a href="#4">4. Increase your conversion rates</a></li>
  <li><a href="#5">5. Decrease development costs with our SDKs</a></li>
  <li><a href="#6">6. SAML-enable your applications</a></li>
  <li><a href="#7">7. Lighter, better UX and open sourced Login Widget</a></li>
  <li><a href="#8">8. Waste no time remembering passwords</a></li>
  <li><a href="#9">9. Deploy Auth0 Anywhere</a></li>
  <li><a href="#10">10. A Robust online infrastructure</a></li>
</ol>

{% endexcerpt %} 

---

<a name="1"></a>
### 1. Know who is using your apps
You have a more powerful visualization of _when_, _how_ and _how often_ your users access your apps:

[![user analytics](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/user-details.gif)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/user-details.gif)

---

<a name="2"></a>
### 2. Richer user profiles
Many of you wanted to associate additional information to your users' profile in addition to the attributes you get from the authentication source. You can do this through the dashboard or through an API.

[![user metadata](http://dl.dropboxusercontent.com/u/21665105/user-actions.gif)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/user-actions.gif)

---

<a name="3"></a>
### 3. Avoid building yet another user/password store
Auth0 lets you outsource the authentication by relying on the built-in user/password store. We take care of password hashing, validations, email verification, forgot password flow, single sign on, etc.  And if you want to use your own implementation, then it is as easy as turning a switch.

[![outsource users and password](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/database.gif)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/database.gif)

We provide templates to connect with SQL Server Membership, SQL Azure, Mongo, MySQL, Postgress, among many other options. 

---

<a name="4"></a>
### 4. Increase your conversion rates
You now have access to 2,000,000,000 potential users out of the box with the addition of new [social and enterprise identity providers](https://docs.auth0.com/identityproviders)

<a href="http://s3.amazonaws.com/blog.auth0.com/newsletter-1/idps2.gif"><img src="http://s3.amazonaws.com/blog.auth0.com/newsletter-1/idps2.gif"alt="login widget"></a>

> Is your favorite IdP not on our list? [Let us know](mailto://support@auth0.com)!

---

<a name="5"></a>
### 5. Decrease development costs with our SDKs
Every time you start developing on a new platform, you have to solve user and API authentication and access control. Not to mention, the complexity of connecting with legacy identity systems. We’ve been adding support for the most popular development platforms. What used to take days or weeks, will now take just minutes.

[![](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/te0SB53RLj.png)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/te0SB53RLj.png)

> Want to a see another platform supported? [Let us know](mailto:support@auth0.com)!

---

<a name="6"></a>
### 6. SAML-enable your applications
Are you connecting with organizations already using some SAML identity system for SSO? Auth0 removes the complexity of SAML configuration. We can connect easily with all of the most widely used systems.

[![](https://s3.amazonaws.com/blog.auth0.com/newsletter-1/logos-idps.png)]( https://s3.amazonaws.com/blog.auth0.com/newsletter-1/logos-idps.png)
---

<a name="7"></a>
### 7. Lighter, improved UX and open sourced Login Widget
We've spent quite some time analyzing and improving its user experience. It is now much smaller and lighter weight. It loads faster, it's much more flexible and customizable, and it provides a simpler to use API.

<a href="http://s3.amazonaws.com/blog.auth0.com/newsletter-1/testwidg41.gif"><img src="http://s3.amazonaws.com/blog.auth0.com/newsletter-1/testwidg41.gif"  alt="login widget"></a>

<https://github.com/auth0/auth0-widget.js>

Among its many new features: better support for i18n, and keeping track of your login choices. For example: you go to a website, login for the first time and choose Google. You go back to that site a month later and you completely forgot what you used last time to login. We keep track of that and expose it through an API or as a widget option.

In addition to that, you can now [associate multiple accounts](https://docs.auth0.com/link-accounts) into one.

---

<a name="8"></a>
### 8. Waste no time remembering passwords
Your team is using New Relic, Zendesk, CloudBees, Amnazon Web Services, Salesforce, Echosign, Office365, Google Apps and other great apps. However, each of them might require another user and password to remember. 

Auth0 easily integrates with __+1000 of apps__ that are SAML, WS-Fed or OAuth capable. You will enter your password once in your identity provider of choice (e.g. GitHub, Google Apps, Windows Azure AD or regular AD) and will be logged in to all these apps seamlessly.

[![new applications](https://s3.amazonaws.com/blog.auth0.com/newsletter-1/rGEoPzk40n.png)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/rGEoPzk40n.png)

> Need help configuring SAML for an app not listed here? [Let us know](mailto:support@auth0.com)!

<a name="9"></a>
### 9. Deploy Auth0 Anywhere
Need a private deployment of Auth0? Do you have special privacy requirements? Looking at replacing your current ADFS deployment as you expand your use cases? 

We ship the same awesome user experience we have with the Auth0 service with the __Auth0 Appliance__. We can run on-premises, or in any of the popular hosting environments: Amazon Web Services, Windows Azure, Rackspace, DigitalOcean, Joyent and others. 

[![appliance](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/6qEyXQC65J.png)](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/6qEyXQC65J.png)

ASCII art FTW!

---

<a name="10"></a>
### 10. A Robust online infrastructure
We know identity is a critical component of most app. If you can't login, nothing works. Since launching, we invested in higher availability and disaster recovery features. Auth0 is tolerant to failures by running on multiple cloud providers, on different geo-locations. We run on __Windows Azure (US West Coast)__ and __Amazon Web Services (East Coast)__ simultaneously. Within each environment we run multiple instances of the service, minimizing the chances of complete downtime.

[![](http://s3.amazonaws.com/blog.auth0.com/newsletter-1/auth0-infrastructure.png)](http://www.auth0.com/trust)

---

Thanks again for joining us in this first part of our journey. We would love to continue to hear from you. Both about things that you would like us providing, but also about the things you currently love about Auth0. And we wish you all a fantastic 2014!

**Auth0**, The Incredibly Easy, Programmable Identity Platform

PS.: and yes, we love animated GIFs :)