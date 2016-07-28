---
layout: post
title: "Windows Azure ACS Alternative"
date: 2014-05-14 08:00
outdated: true
alias: /2014/05/14/windows-azure-acs-alternative-replacement/
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: https://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "When it was released about 4 years ago, ACS was great. It lowered the bar of entry to advanced identity scenarios considerably. Whole chapters of our Claims"
---

<div style="float: right"><img style="width: 160px" src="https://cloudup.com/cTUURfqMtie+"></div>

When it was released about 4 years ago, ACS was great. It lowered the bar of entry to advanced identity scenarios considerably. Whole chapters of our [Claims Identity Guide](http://www.amazon.com/Claims-Based-Identity-Control-Patterns-Practices/dp/0735640599) were [focused on ACS](http://msdn.microsoft.com/en-us/library/hh446535.aspx)! However since its release:

* There hasn't been much innovation much on it.
* It is hard to find updated documentation.
* The dashboard has stayed the same for years.
* Only a very limited number of IdPs are supported.
* Visual Studio __Add STS Reference__ and other integrated tools are not available anymore. Configuring ACS on existing solutions is not as easy as it was.
* Yesterday, Yahoo! connections broke. It took a while for it to be resolved.
* It's roadmap is unclear.

Many customers with apps configured to use ACS have asked us how difficult it is to replace it with Auth0. It turns out it is very, very easy.

Here's how:

<!-- more -->

##1. Signup to Auth0

No credit card, no commitment. <a href="#" onclick="javascript:signup();">Signup here for a free trial</a>.

##2. Register your app
Go to __Applications__ and click on __NEW__. Select __WS-Fed (WIF) Web App__.

![](https://puu.sh/8LzcB.png)

##3. Enter your App's URLs

These 2 parameters correspond to the __Realm__ and __Return URL__ params you configured in ACS:

![](https://puu.sh/8LsnE.png)

Press __SAVE__

##4. Update your App Web Config

Scroll down on the same page and you will find two __web.config__ sections you can simply paste into your web application. The first one is for .NET 4.5 projects. The second one is for older systems.

![](https://cloudup.com/casjd4DZsUN+)

You are done!

You can of course run the __Add STS Reference__ wizard if you are on VS 2010 or the other integrated tools. We supply a metadata endpoint you can import into your project.

> **Rule Groups**: Auth0 [rules](https://docs.auth0.com/rules) give you outstanding power to do claims transformation. You have the full JavaScript language and many popular Node.js modules at your disposal to do whatever you can think of. From [simple mappings](https://github.com/auth0/rules/blob/master/rules/saml-attribute-mapping.md) to more complex stuff like [tracking sign-ups, enriching User Profile and generating new Leads on Salesforce](https://docs.auth0.com/scenarios-mixpanel-fullcontact-salesforce) and [Multi-factor auth](https://docs.auth0.com/mfa).

---

## Auth0 vs. ACS

Here's a more detailed comparison of Auth0 and ACS:

<iframe style="width: 100%; border: 1px solid #ccc; height: 500px" src="https://docs.google.com/document/d/1uthnAPIOq3uhXI_9h-8fBX4emUWshP8cLh-yDzeiE9I/pub?embedded=true"></iframe>
