---
layout: post
title: "Integrating Auth0 with Rights Management Services"
date: 2012-03-15 08:20
author: 
  name: Eugenio Pace
  mail: eugeniop@auth0.com
---

Here's another scenario supported by Auth0 out of the box, with no special configuration. 

Contoso is a company that does business with many external people, and they need to share Word and Excel documents with them in a secure way.

They need to specify and enforce specific rights on these documents: 

- Can you print?
- Can you edit?
- Can you forward it to someone else?

[AD Rights Mangament Services](http://technet.microsoft.com/en-us/windowsserver/dd448611.aspx) (RMS) is a great technology to do exactly that, but not surprisingly, it is optimized to be used with Active Directory.

With Auth0, you can now extend RMS to users outside your domain, and continue to benefit from these access policies:

![RMS federation google](/img/auth0-rms.png)

There's only __one__ (yes, just one) thing you need to do to enable this. You need to install "Federation" support in RMS and when it asks for the URL, you simply enter:

> https://{your tenant}.auth0.com/rms/{your client id} 

![RMS federation](/img/auth0-rms-install.png)

Validate the URL, and you are done! __There are no Auth0 components to deploy__. It just works.

Now, let's walk through an end to end use case:

###1. Tom from Contoso writes a Word document, protects it with read-only permissions and sends it to one of his partners:

![RMS Word Google Federation](/img/auth0-rms-protect-doc.png)

###2. The partner receives the doc, since it is protected he has to log in and authenticate. He starts by selecting the right Identity Provider (notice __Auth0 Login Widget__ inside Windows Rights Management window): 

![RMS Word Federation](/img/auth0-rms-open-doc.png)

###3. The partner logs in (with Google in this example):

![RMS Word Federation Google](/img/auth0-rms-open-doc-login.png)

###4. After successful authentication, he can access the doc with the original protections:

![RMS Word Federation Google](/img/auth0-rms-open-doc-restrictions.png)

Simple, secure collaboration!

> This is one of many Auth0 extensions that augment Auth0 functionality with specific features like RMS.