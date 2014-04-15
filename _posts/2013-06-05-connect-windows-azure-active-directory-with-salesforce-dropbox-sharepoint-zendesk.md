---
layout: post
title: "SSO to Cloud Apps (Salesforce, Zendesk, etc) through Windows Azure Active Directory and Auth0"
date: 2013-06-05 21:15
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---


In case you missed it, this week at TechEd, Microsoft announced many changes to the Azure Platform. See [Scott Gu](http://weblogs.asp.net/scottgu/archive/2013/06/03/windows-azure-announcing-major-improvements-for-dev-test-in-the-cloud.aspx) post for details.

One of these being **Windows Azure Active Directory now syncronizes password hashes**. You can read more about it from WAAD's lead, [Alex Simmons](http://blogs.msdn.com/b/active_directory_team_blog/archive/2013/06/03/making-it-simple-to-connect-ad-to-azure-ad-password-hash-sync.aspx).

This is another great piece of news. Why? Keep reading.

> With virtually no effort, you could have your Active Directory replicated in the cloud, ready for federation, for FREE!

But as I wrote in this [previous post](http://blog.auth0.com/2013/04/10/Auth0-Windows-Azure-Active-Directory/), WAAD is _not exactly_ an Active Directory that you can join machines to. It is more like a combination of AD and ADFS with a more modern API to query the directory. With this new addition you don't needed ADFS on presmises, so it's a very quick deployment.

<!-- more -->

## Configure Windows Azure Active Directory

Create an Active Directory on your Windows Azure account (or you might already have it as part of Office365) and configure the directory integration. You can optionally verify the domain. But if you don't, you will be using the *.onmicrosoft.com domain.

Once the directory is created you can download and install DirSync on a machine joined to the domain (but not the DC). This could take 10 minutes to install.

![](http://blog.auth0.com.s3.amazonaws.com/waad2.gif)

## Configure Auth0

When you create an Auth0 account, you can go to **Connections** -> **Enterprise** and select **Windows Azure AD** to create connection in Auth0.

![ss-2013-06-04T19-27-35.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-06-04T19-27-35.png)

**Voila! Once the connection is created, your Windows Azure Active Directory is one click away to Single Sign On with all these apps!**

![ss-2013-06-04T19-36-55.png](http://blog.auth0.com.s3.amazonaws.com/ss-2013-06-04T19-36-55.png)

<div style="text-align: center"><img src="http://blog.auth0.com.s3.amazonaws.com/ss-2013-06-04T20-58-53.png" /></div>

<em>This feature is available in both the enterprise appliance and cloud version. [Try Auth0 yourself!](https://auth0.com)</em>