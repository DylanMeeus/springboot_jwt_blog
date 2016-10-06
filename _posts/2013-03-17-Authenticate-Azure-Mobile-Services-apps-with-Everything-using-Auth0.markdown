---
layout: post
title: "Authenticate Azure Mobile Services Apps with Everything using Auth0"
date: 2013-03-17 11:00
outdated: true
doc_reference: https://docs.auth0.com/wams
alias: /2013/03/17/Authenticate-Azure-Mobile-Services-apps-with-Everything-using-Auth0/
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
description: "Windows Azure Mobile Services (WAMS) is a really neat technology by Microsoft to get you started very quickly with simple mobile apps."
related:
- 2013-03-15-Integrating-Auth0-with-Rights-Management-Services
- 2013-03-07-On-Premises-SharePoint-Federated-with-Partner-AD
- 2013-03-27-Automating-SharePoint-Federation-Setup-With-Auth0
tags:
- microsoft
---

[Windows Azure Mobile Services](http://www.windowsazure.com/en-us/develop/mobile/) (WAMS) is a really neat technology by Microsoft to get you started very quickly with simple mobile apps. It's a _"Mobile Backend as a Service"_. It also provides a nice extensibility model for more advanced scenarios with server-side JavaScript.

WAMS already ships with support for single-sign-on with social identity providers (e.g Facebook, LiveID), but no support for enterprise providers: Google Apps, Office 365 and Active Directory; or even custom SQL user databases. Even for social providers, it currently doesn't allow finer grain control on what information the user has to consent to disclose.

<!-- more -->

For Microsoft Accounts (Live ID), for example, WAMS will ask the user for the following rights: name, gender, display picture, contacts and friends. You might not need all these, and you might turn away customers by asking too much.

Auth0 addresses these two issues:

- You can connect to __any__ supported identity provider: social and enterprise
- You have __full control__ on what information to request from your users

![](https://s3.amazonaws.com/blog.auth0.com/img/auth0-wams-ad-others.png)

Enabling WAMS integration is as simple as entering the WAMS masterkey in Auth0 (so we can sign the token). That's it!

![Azure Mobile Services Authentication](https://s3.amazonaws.com/blog.auth0.com/img/auth0-wams.png)

After enabling the add-on, Auth0 will generate JSON Web Token that you can then use to call WAMS endpoints.

This is how it works on a sample test app we wrote:

- John has an account with Fabrikam's Active Directory and is using an iPhone
- John opens an app to query for invoices (and endpoint on WAMS)
- John taps on __Login with Widget__
- Using the Auth0 helper library for iOS, the __Auth0 Login Widget__ is displayed

![iphone SSO](https://s3.amazonaws.com/blog.auth0.com/img/auth0-wams-ios1.png)

- John selects Active Directory for the list
- Auth0 sends John to AD for authentication
- Upon successful authentication, Auth0 returns a JWT (seen on the debug screen on top)
- The app calls the WAMS endpoint with the JWT

![iphone SSO](https://s3.amazonaws.com/blog.auth0.com/img/auth0-wams-ios2.png)

The code behind the login process is very straight forward using the helper libraries we ship with __Auth0 SDK__:

	- (IBAction)loginWithWidget:(id)sender
	{
	    Auth0Client *client = [Auth0Client auth0ClientWithWidget:tenant clientId:clientId returnUrl:returnUrl];

    	[client showInViewController:self allowsClose:NO withCompletionHandler:^(BOOL authenticated) {
        	if (!authenticated) {
            	NSLog(@"Error authenticating");
        	}
        	else{
            	self.accessTokenView.text = [client.accessToken copy];
            	jwtToken = [client.jwtToken copy];
            	self.jwtTokenView.text = jwtToken;
        	}
    	}];
	}

All token negotiation is handled by the __Auth0Client__ class. Calling WAMS is equally simple: notice how we are just setting the authentication token to what Auth0 returned in the previous step. The rest of the code is just plain WAMS.

	- (IBAction)getInvoices:(id)sender
	{
    	MSUser *user = [[MSUser alloc] initWithUserId:@"eugeniop"];
    	user.mobileServiceAuthenticationToken = jwtToken;

	    MSClient *client = [MSClient clientWithApplicationURLString:@"https://auth0-tests.azure-mobile.net"];
    	client.currentUser = user;

    	MSTable * invoices = [client getTable:@"invoices"];

    	[invoices readWithCompletion:^(NSArray *items, NSInteger totalCount, NSError *error)
    	{
	        if(error)
	        {
	            NSLog(@"Error");
	        }
	        else
	        {
	            self.invoices.text = [NSString stringWithFormat:@"Got %d invoices", [items count]];
	        }
    	}];
	}

>[Matias'](https://twitter.com/woloski) demo'ed this integration on his webcast on [CloudCover](http://blog.auth0.com/2013/03/03/Real-World-Windows-Azure-with-Auth0-Matias-on-CloudCover/). (see from minute 13 to 19).

[Try Auth0 yourself!](https://auth0.com)
