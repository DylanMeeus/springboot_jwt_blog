---
published: "true"
layout: post
title: Integrating AuthorizationServer with Auth0
date: "2014-04-08 10:33"
outdated: true
alias: /2014/04/08/Integrating-AuthorizationServer-with-Auth0/
author:
  name: Dominick Baier
  url: https://twitter.com/leastprivilege
  avatar: https://avatars1.githubusercontent.com/u/1454075?s=400
description: "A guest post from identity expert Dominick Baier. Cross posted on leastprivilege.com  AuthorizationServer is a lightweight OAuth2 implementation that is"
---

A guest post from identity expert Dominick Baier. Cross posted on [leastprivilege.com](http://leastprivilege.com/2014/04/08/integrating-authorizationserver-with-auth0/)

---


[AuthorizationServer](https://github.com/thinktecture/Thinktecture.AuthorizationServer) is a lightweight OAuth2 implementation that is designed to integrate with arbitrary identity management systems. I wrote about integration with Thinktecture [IdentityServer](http://leastprivilege.com/2013/06/18/authentication-in-authorizationserver/), [ADFS](http://leastprivilege.com/2013/09/19/adding-oauth2-to-adfs-and-thus-bridging-the-gap-between-modern-applications-and-enterprise-back-ends/) and even plain Windows integrated [authentication](http://leastprivilege.com/2014/01/11/combining-thinktecture-authorizationserver-with-windows-integrated-authentication/) before.

Another really compelling and feature rich identity management is [Auth0](https://auth0.com/). Auth0 supports local account databases, federation with almost anything you can imagine, claims transformation, UI customization and a great documentation and SDKs. The fact that it is also available as an on-premises appliance (in addition to their cloud offering) is especially interesting for my European customers and me.

Here’s what I had to do to integrate AuthorizationServer with Auth0.

<!-- more -->

---

##1 Create a new application in Auth0
Auth0 has support for many pre-packaged application types like Salesforce, Office 365 or SharePoint. Since AS is a WIF-based application, I chose WS-Fed (WIF) App.

![](https://dominickbaier.files.wordpress.com/2014/04/1-create-app.png)

Next, you can choose which identity providers or account types you want to allow for your new application (Auth0 calls that connections). I decided to start with local accounts only, and to add other connections later once I have the basic setup up and running.

![](https://dominickbaier.files.wordpress.com/2014/04/2-select-connections.png)

One thing I especially like about Auth0 is their personalized documentation and walkthroughs. All of the samples and config snippets they show already have your URLs, keys etc. in it, so you can simply copy and paste the “sample” configuration to your local project. You start by entering some basic information about your application:

![](https://dominickbaier.files.wordpress.com/2014/04/3-initial-config_thumb.png?w=644&h=386)

..and are being presented with a fully working WIF configuration:

![](https://dominickbaier.files.wordpress.com/2014/04/4-config-snippet_thumb.png?w=644&h=386)

Another option would be to point your Identity & Access Tool or the ASP.NET project template to your personalized WS-Federation metadata endpoint. Very nice!

Next, I created a user account in Auth0 that should act as an AuthorizationServer administrator:

![](https://dominickbaier.files.wordpress.com/2014/04/5-admin-user_thumb.png?w=644&h=386)

---

##2 Setup AuthorizationServer
I then grabbed a fresh copy of AuthorizationServer from Github and did the standard installation steps (see [here](http://vimeo.com/69300053)).

Since Auth0 already gave me a ready to use federation configuration, I only had to copy that over to the identityModel.config and identityModel.services.config files (in the config folder) respectively. Then I ran the initial configuration “wizard” and entered the user ID of the admin account I created earlier.

![](https://dominickbaier.files.wordpress.com/2014/04/6-as-initial-config.png)

Now when I try to enter the admin UI, I am presented with the Auth0 login screen and I can start creating AS applications, clients, etc. (see also this [walkthrough](http://vimeo.com/69313963)).

![](https://dominickbaier.files.wordpress.com/2014/04/7-auth0-login_thumb.png?w=388&h=484)

---

##3 Using AuthorizationServer with Auth0 Accounts
To do some testing, I quickly created a few more local accounts (alice and bob of course) and used the standard AS sample to inspect the resulting access tokens. Here’s the output for the code flow sample client:

    {
      “iss”: “AS”,
      “aud”: “users”,
      “nbf”: 1394728033,
      “exp”: 1394731633,
      “client_id”: “codeclient”,
      “scope”: [
          "read",
          "search"
      ],
      “sub”: “auth0|52e50b42f66ae38e8f00057e”
    }

Auth0 uses a _NameIdentifier_ claims and the _idp|userid_ format to uniquely identify a user account. AS understands that by default and strips away all other claims. If you want to pass through all claims from Auth0, you can set the _filterIncomingClaims_ appSetting in web.config to _false_, which results in all profile claims, e.g.:

    {
      “iss”: “AS”,
      “aud”: “users”,
      “nbf”: 1394728205,
      “exp”: 1394731805,
      “client_id”: “codeclient”,
      “scope”: [
        "read",
        "search"
      ],
      “sub”: “auth0|52e50b42f66ae38e8f00057e”,
      “http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier “: “auth0|52e50b42f66ae38e8f00057e”,
      “http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress “: “bob@leastprivilege.com”,
      “http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name “: “bob@leastprivilege.com”,
      “http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn “: “bob@leastprivilege.com”,
      “http://schemas.auth0.com/identities/default/provider “: “auth0″,
      “http://schemas.auth0.com/identities/default/connection “: “Username-Password-Authentication”,
      “http://schemas.auth0.com/identities/default/isSocial “: “false”,
      “http://schemas.auth0.com/clientID “: “wU1MA7nUlpoMryMUqrd39CeXTMio1O6x”,
      “http://schemas.auth0.com/created_at “: “Sun Jan 26 2014 13:18:58 GMT+0000 (UTC)”,
      “http://schemas.auth0.com/email_verified “: “false”,
      “http://schemas.auth0.com/nickname “: “bob”,
      “http://schemas.auth0.com/picture “: https://secure.gravatar.com/…silhouette80.png,
      “http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod “: “http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password “,
      “http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant “: “2014-03-14T00:29:57.101Z”
    }

So you can get a whole lot of information about the Auth0 user from their authentication token. You can either modify the claims via the Auth0 profile editor in the web interface or modify the claims transformation logic either in Auth0 or AS to just pick the claims that are relevant to your APIs.

![](https://dominickbaier.files.wordpress.com/2014/04/8-profile-editor_thumb.png?w=644&h=272)

---

##4 Adding external Accounts
Auth0 also allows adding external identity providers, e.g. social logins like Facebook or Google as well as enterprise systems like ADFS, WAAD, Ping Identity or LDAP and SAML2p based systems. You can simply “activate” those connections per application.

![](https://dominickbaier.files.wordpress.com/2014/04/9-external-connections_thumb.png?w=644&h=386)

Once activated, you will see the new identity providers on the login dialog.

---

##5 Resource Owner Password Flow and programmatic authentication with Auth0
For supporting the OAuth2 resource owner password flow, AS needs programmatic access to the Auth0 authentication endpoint. That’s easily possible too, and via the excellent documentation system, you can inspect the relevant endpoint as well as a sample payload.

![](https://dominickbaier.files.wordpress.com/2014/04/10-api-docs.png)

The above endpoint will return an OpenID Connect style JWT identity token. With that information, you can use the standard AS extensibility point for resource owner flow to programmatically authenticate users against the Auth0 user store:

    public class Auth0ResourceOwnerCredentialValidation : IResourceOwnerCredentialValidation
    {
        string endpoint = “https://leastprivilege.auth0.com/oauth/ro&#8221;;
        string issuer = “https://leastprivilege.auth0.com/&#8221;;
        string client_id = “wU…6x”;
        string client_secret = “j6a…Z9″;

        public ClaimsPrincipal Validate(string userName, string password)
        {
            var client = new Thinktecture.IdentityModel.Client.OAuth2Client(
                new Uri(endpoint),
                client_id,
                client_secret,
                OAuth2Client.ClientAuthenticationStyle.PostValues);

            var response = client.RequestResourceOwnerPasswordAsync(
                userName,
                password,
                “openid profile”,
                new Dictionary<string, string>
                {
                    { “connection”, “Username-Password-Authentication” }
                }).Result;


            if (!response.IsError)
            {
                return FederatedAuthentication.FederationConfiguration
                                                .IdentityConfiguration
                                                .ClaimsAuthenticationManager
                                                .Authenticate(“”, ValidateIdentityToken(response.IdentityToken));
            }

            throw new InvalidOperationException(response.Error);
        }

        private ClaimsPrincipal ValidateIdentityToken(string identityToken)
        {
            var handler = new JwtSecurityTokenHandler();

            var parameters = new TokenValidationParameters
            {
                AllowedAudience = client_id,
                ValidIssuer = issuer,
                SigningToken = new BinarySecretSecurityToken(
                  Base64Url.Decode(client_secret))
            };

            return handler.ValidateToken(identityToken, parameters);
        }
    }

---

##4 Where to go from here

There are some advanced features I haven’t tried but wanted to mention. First of all you have full control over the login page look and feel by updating the HTML/script/CSS of your tenant. You can also write dynamic claims transformation rules using JavaScript, which looks pretty powerful. And last but not least, when you run Auth0 on-premises, you can also connect it to Active Directory as well as custom databases like SQL Server.
So all in all this is a pretty complete package when you are looking for an out of the box identity and federation solution – and together with AuthorizationServer you get OAuth2 application authorization model backed by all the various authentication options that Auth0 provides. Nice!
