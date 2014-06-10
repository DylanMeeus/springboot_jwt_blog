---
layout: post
title: "Token-based Authentication to Git Servers"
date: 2014-06-10 08:00
author:
author:
  name: José F. Romaniello
  url: "http://joseoncode.com"
  mail: "jfromaniello@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/d1a7e0fbfb2c1d9a8b10fd03648da78f.png"
---

<div style="text-align:center"><img style="width: 560px" src="https://docs.google.com/drawings/d/11titp9CXWcy_6oIReMuVdR6qHxNFuoZefC3hvJ-Wvmc/pub?w=733&amp;h=519"></div>

Few months ago GitHub implemented [Smart HTTP support](https://github.com/blog/642-smart-http-support) for GIT. This is fascinating, because the previous version of the __http__ based transport was very slow compared to __SSH__. 

What I like the most about using HTTP, is that you can _extend_ it. In particular, you can use __your own authentication scheme__. For example, you could use any OAuth based login (like Google, Facebook or Amazon for example) to clone repos!

So we prototyped with Smart HTTP using [Grack](https://github.com/blog/642-smart-http-support) and integrated that with Auth0. 

And this shows how it works:

![](https://dl.dropboxusercontent.com/u/21665105/gitzero.gif)

You can test it yourself at: <http://auth0.com:9292>

This article explains how to run a Git server supporting any authentication provider: social, custom or perhaps more interesting enterprise systems like __Active Directory__, __Google Apps__, __Office365__, __Salesforce__, etc. 

> The nice thing about using this is that you can grant access to Git repositories using Google Apps groups or Office365 Groups. When someone leaves the company you delete the user from the directory and that's it. No need to manage SSH keys.

## Grack + Auth0 = GitZero

We are maintaning a fork of [Grack](https://github.com/blog/642-smart-http-support) called [GitZero](https://github.com/auth0/gitzero).

### 1-  Signup to Auth0

<a onclick="javascript:signup();" href="#">Create an Account (free)</a>.


### 2- Register an application

![](https://cloudup.com/cor4Sy91oJT+)

### 3- Download and prepare GitZero

```
$ git clone https://github.com/auth0/gitzero.git
$ cd gitzero
$ bundle install
```

### 4- Configure GitZero

Create an `.env` file inside the `gitzero` directory with the following format:

```
AUTH0_NAMESPACE=YOUR-ACCOUNT.auth0.com
AUTH0_CLIENT_ID=YOUR-CLIENT-ID
AUTH0_CLIENT_SECRET=YOUR-CLIENT-SECRET
```

### 6- Run GitZero

```
bundle exec unicorn --port 9292
```

> You can use any rack server, but I've noticed that __unicorn__ works better in this case than __thin__.

### 5- Register the Callback URL in Auth0

Go to the Settings of the application you created and enter the URL where GitZero is running.

### 6- Test it

If you try to clone this repository you will be prompted for your credentials and you will get an __access denied__ error:

```
$ git clone http://localhost:9292 my-repo
Cloning into 'my-repo'...
Username for 'http://localhost:9292':
Password for 'http://localhost:9292':
fatal: unable to access 'http://localhost:9292/': The requested URL returned error: 403
```

You can open a browser and point it to http://localhost:9292. After login you will get instructions on how to clone the repo

![](https://cloudup.com/cDUP1wMr2lq+)

GitZero will check the JSON Web Token and validates it using the secret that was set in step 4.

> **Note**: this approach works regardless of how the JSON Web Token was issued. Here we are showing Auth0 as the issuer of the token. 

&nbsp;

> **Note 2**: If you only need support for: __Active Directory / LDAP__ connections, or plain __User/Password Databases__. take a look at [GitZero2RO](https://github.com/auth0/gitzero2ro.git) which will work with a regular user/password (not through the browser)

Happy Token Auth!