---
layout: post
title: "SSO for Legacy Apps with Auth0, OpenID Connect & Apache"
date: 2014-08-22 21:57
author:
  name: "Eugenio Pace"
  url:  http://www.twitter.com/eugenio_pace
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
tags:
- authentication
- apache
- mod_auth_openidc
- mod_auth
- reverse proxy
- openid
- proxy
- auth0
- login
- signup
---

Auth0 [SDKs](https://docs.auth0.com) make it really easy to add SSO to any app, on any platform. But sometimes, apps cannot be modified. What to do then?

A very simple solution is to front any web content with a reverse proxy that itself is capable of negotiating authentication for users. One such proxy with the extensibility required for plugging-in any auth is Apache server.

In this post, we'll learn how to install and configure `mod_auth_openidc` to work with Apache and Auth0.

<!-- more -->

##How it works
Apache has [plugable authentication modules](http://httpd.apache.org/docs/current/mod/mod_auth_basic.html#authbasicprovider) that you can use to protect specific routes. One such module is [mod_auth_openidc](https://github.com/pingidentity/mod_auth_openidc) written by [Hans Zandbelt](http://hanszandbelt.wordpress.com/).

> __mod_auth_openidc__ is an authentication/authorization module for the Apache 2.x HTTP server that allows users to authenticate using an OpenID Connect enabled Identity Provider.

When a user first attempts to access protected content behind the Apache proxy, the module will first redirect the user to the configured OpenID Connect identity provider. After the user is authenticated, access is granted to the actual resource:

![image](https://docs.google.com/drawings/d/1ePWbU0cqsKuskGrzKZrpwylp3Q10evHKxv_2MvJ5DQw/pub?w=811&amp;h=340)

Since Auth0 supports the OpenID Connect protocol (among [many others](https://docs.auth0.com/protocols)), it is straight forward to configure the module with it:

```
OIDCProviderIssuer https://contoso.auth0.com
OIDCProviderAuthorizationEndpoint https://contoso.auth0.com/authorize
OIDCProviderTokenEndpoint https://contoso.auth0.com/oauth/token
OIDCProviderTokenEndpointAuth client_secret_post
OIDCProviderUserInfoEndpoint https://contoso.auth0.com/userinfo

OIDCClientID 3g6d6c..........mXNxkAE
OIDCClientSecret _8sCbkTNhYk4..........8u3mdvRFWBx

OIDCScope "openid email profile"
OIDCRedirectURI https://your_apache_server/example/redirect_uri/
OIDCCryptoPassphrase <password>
OIDCCookiePath /example/

SSLEngine on
SSLCertificateFile /home/your_cert.crt
SSLCertificateKeyFile /home/your_key.key

<Location /example/>
   AuthType openid-connect
   Require valid-user
   LogLevel debug
</Location>
```

##How to configure it

First, you need to [register a new app](https://app.myauth0.com/#/applications/create) in Auth0. You will get a `clientId` and a `clientSecret`. These two go to the `OIDCClientID` and `OIDCClientSecret` params respectively. Then you need to setup SSL certs and define the protected locations (e.g. `/example` in the config file above).

Of course you will have to replace the Auth0 auth URLs with your actual account (__contoso__ is used in the example above).

Any of [Auth0 supported identity providers](https://docs.auth0.com/identityproviders) would work: __Active Directory__, __LDAP__, __ADFS__, __SAML-P__, __custom databases__ or any of the __30+ social providers__. Auth0 will bridge any protocol implemented by these identity systems with OpenID Connect.

It is also very easy to configure a _specific_ connection in Auth0 if you add the `connection` parameter to the `OIDCProviderAuthorizationEndpoint` parameter:

```
OIDCProviderAuthorizationEndpoint https://contoso.auth0.com/authorize?connection=linkedin
```

Users will be sent directly to LinkedIn for authentication in this case.

That's it!
