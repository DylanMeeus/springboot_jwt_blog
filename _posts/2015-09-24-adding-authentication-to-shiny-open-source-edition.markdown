---
layout: post
title: "Adding Authentication to Shiny Open Source Edition"
description: Learn how to leverage Auth0 to have Shiny Authentication for the open source version or another legacy website.
date: 2015-09-24 09:00
author:
  name: Pablo Seibelt
  url: http://www.twitter.com/sicarul
  mail: pablo.seibelt@auth0.com
  avatar: https://secure.gravatar.com/avatar/bb9128fac91692ad4f46a785d772dd39?s=200
design:
  bg_color: "#428bca"
  image_bg_color: "#408dd2"
  image: https://cdn.auth0.com/blog/shiny/shinylogo.png
  image_size: "70%"
tags:
- shiny
- r
- apache
- openid connect
- mod_auth_openidc
- mod_auth
- reverse proxy
---


[Shiny Server](https://www.rstudio.com/products/shiny/shiny-server/)  is a great solution for BI/analytics reporting. It leverages all the power of the [R language](https://www.r-project.org/), which is the most popular open-source language for statistics, and it has a lot of useful functions for *Data Mining*, *Machine Learning*, *Reporting*, etc.

The open-source version of Shiny Server features no Authentication, and if it's open on Internet, it leaves your data exposed. In that case, you likely won't want everyone on the Internet to be able to see your internal analytics, so you'll need to install and configure the authentication yourself.

One of the easiest ways to add authentication to Shiny and, by extension, any unsecured web application, is to use Apache with Auth0 through the **auth_openidc** module.

This is also useful if you have a legacy web app with a username and password everyone shares or if you are hosting a server with static files you want to share.

![Diagram of the Shiny Authentication scheme](https://docs.google.com/drawings/d/1PXZv42IYIjoc2_wAVDc5EzY7-uzD6vs_ShP_GiAo4_g/pub?w=959&h=638)

So, let's get started with the steps.

## Installing and Configuring Shiny

First, follow the instructions to [install and configure Shiny Server](https://www.rstudio.com/products/shiny/download-server/).

When you have installed and configured Shiny and you're sure it works, modify your config file so it only serves to 127.0.0.1 (the local machine). This ensures that we don't accidentally expose the open server to the entire Internet.

```
[...]
server {
  listen 3838 127.0.0.1;
[...]
```

## Installing Apache and the OpenID Connect Module

We will use Apache as a gateway to our app using [Auth0's tutorial](https://auth0.com/docs/server-platforms/apache). This will enable Apache to serve as a gatekeeper—a reverse proxy that only serves after authentication.

If you don't already have apache2 installed, install it according to your platform and ensure that you have two modules: mod_proxy and mod_auth_openidc.

mod_proxy is pretty standard. It comes with most apache2 installs, but it is often disabled. To enable it, execute the following with root:

```
a2enmod proxy_http
```

mod_auth_openidc is provided in Debian as libapache2-mod-auth-openidc. Binary packages are available at [the releases page](https://github.com/pingidentity/mod_auth_openidc/releases), or you can always [build it from source](https://github.com/pingidentity/mod_auth_openidc/blob/master/INSTALL). When it is installed, enable it with this command:

```
a2enmod auth_openidc
```

## Configure an Auth0 Account

If you don't already have an Auth0 Account, [create one here](http://auth0.com/signup) and set up the type of connections you want to allow. The default settings allow anyone to sign up, but you can set up a better scheme. For example, if you use Google Apps, you can just connect that and [allow only those from your domain to access the server](https://manage.auth0.com/#/connections/enterprise). Alternatively, you can use [rules](https://manage.auth0.com/#/rules) to decide which users are allowed access.

You can [browse the docs](https://auth0.com/docs) or [ask for help](https://auth0.com/support) setting up the best scheme for your scenario.

## Configure Apache to Serve Shiny with Auth0

Make sure Shiny is running in the background while Apache tries to serve it. You can ensure that it's always on by [running it as a Daemon](https://rstudio.github.io/shiny-server/latest/#stopping-and-starting).

You will need to follow the steps in [the Apache tutorial](https://auth0.com/docs/server-platforms/apache). Note: when you are logged in to Auth0, the tutorial includes your own variables in the configuration to make it easier for you.

Create a configuration file for your website using the configuration from the tutorial as a starting point. Replace everything from OIDCProviderIssuer to Location with the code in the tutorial.

You will need to personalize your OIDCRedirectURI. I recommend using https://<your_apache_server>/auth. Of course, replace <your_apache_server> with the public address that will be used for your server.

You also need to generate or write some random string on <passwordToEncryptTheSessionInformationOnTheCookie>

You should at least have a [self-signed SSL certificate](https://devcenter.heroku.com/articles/ssl-certificate-self) to test and a real one to deploy.

It should look something like this:

```
<VirtualHost *:443>
  ProxyPass / http://localhost:3838/
  ProxyPassReverse / http://localhost:3838/
  ProxyPreserveHost On

  OIDCProviderIssuer https://<your-tenant>.auth0.com
  OIDCProviderAuthorizationEndpoint https://<your-tenant>.auth0.com/authorize
  OIDCProviderTokenEndpoint https://<your-tenant>.auth0.com/oauth/token
  OIDCProviderTokenEndpointAuth client_secret_post
  OIDCProviderUserInfoEndpoint https://<your-tenant>.auth0.com/userinfo

  OIDCClientID <YourClientID>
  OIDCClientSecret <YourClientSecret>

  OIDCScope "openid profile"
  OIDCRedirectURI https://<your-website>/auth
  OIDCCryptoPassphrase <passwordToEncryptTheSessionInformationOnTheCookie>
  OIDCCookiePath /

  SSLEngine on
  SSLCertificateFile /path/to/server.crt
  SSLCertificateKeyFile /path/to/server.key

  <Location />
     AuthType openid-connect
     Require valid-user
     LogLevel debug
  </Location>

</VirtualHost>
```

You can save it somewhere like ``/etc/apache/sites-available/001-shiny` and then link it to make it active:

```
ln -s /etc/apache/sites-available/001-shiny /etc/apache/sites-enabled/001-shiny
```

As the tutorial states, Auth0's `clientSecret` is by default Base64 encoded, which isn't compatible with this Apache plugin out of the box. We're going to change that in the near future, but in the meantime, you need to call an API to make sure the clientSecret isn't Base64 encoded for your account.

Get an access token by clicking "Try Me!" on the [docs page](https://auth0.com/docs/api/v1#!#post--oauth-token) and execute the code shown in step 3 of the tutorial to change `ACCESS_TOKEN` to the access token you just received.

## Boom.

Now you have a Shiny Server that is secured with Auth0, which you can use to serve reports only to employees of your organization using username and password authentication or [one of the many identity providers supported](https://auth0.com/docs/identityproviders).

This same configuration works well for other cases. For example, suppose you have an old legacy web application for which everyone uses the same password. That scenario is not very safe, is it? You can give it an additional security layer with the above approach without modifying your site.

## Gotchas

Shiny uses websockets for a lot of things. While we haven't explored tunneling, it is theoretically possible with **proxy_wstunnel**. For most users, this will work fine because if the library fails with websockets, it will automatically fall back to XHR.
