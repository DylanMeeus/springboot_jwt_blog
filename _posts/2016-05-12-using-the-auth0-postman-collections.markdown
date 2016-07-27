---
layout: post
title: "Using the Auth0 Postman Collections"
description: "Learn how you can use the Auth0 Postman collections to work with our authentication API and management API inside Postman"
date: 2016-05-12 14:30
alias: /2016/05/12/using-the-auth0-postman-collections/
author: 
  name: Jerrie Pelser
  url: https://twitter.com/jerriepelser
  mail: jerrie@auth0.com
  avatar: https://pbs.twimg.com/profile_images/627442748740603905/CUKvI09u.jpg
design: 
  bg_color: "#555"
  image: https://cdn.auth0.com/blog/postman-collections/postman-logo.png
  image_size: "60%"
tags: 
- api
- postman
- rest
- authentication
- javascript
related:
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

> Testing out APIs is always easier with tools like Postman. In this screencast, we'll demonstrate how to work with Auth0's authentication and management APIs using our Postman collections. [Sign up](https://auth0.com/signup) for your free Auth0 account to follow along.

<h2 id="enabling-social-login">Using the Auth0 Postman Collections</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/VDUzBn6SzIY" frameborder="0" allowfullscreen></iframe>

## **Transcript**

If you have used the Auth0 authentication API or management API before, you are probably familiar with our API explorers which we have for both of those APIs. So the API explorers which we have are basically web pages that provide you with documentation on each of those APIs, and it will document the end points available in each of those APIs as well as give you the ability to execute requests against the API. We have also recently introduced the Postman collections for both our authentication API and our management API, and in this video I'm going to take you through installing those Postman collections and I'm going to show you how you can use them inside Postman.

#### Auth0 Dashboard

The first thing we want to do is ensure that we are signed into Auth0. So head over to the Auth0 dashboard and sign in. The reason why I want you to sign in is because when you install the Postman collections we are also creating certain environment variables inside Postman for your tenant which you're obviously using. So if you're not signed into Auth0 then we cannot create that information and you will have to create it manually, but if you are signed into your tenant, once you download and install the Postman prediction inside of Postman, we will also create certain environment variables for you, and I will show you how that works just a little bit later in this video.

So once you're signed in you're going to head over to the documentation website, scroll down to the API section, and click on the API overview. This page provides a little bit of background information on both our authentication API and our management API, and you can access the API explorer for both of those from here, but you can also install a Postman collection from here. So I'm going to work with authentication API first and I'm going to click on the Running Postman button. You will be prompted how you want to open this collection, either with the Postman Chrome app or if you're running on a Mac and you have the Postman Mac app installed, you can also use that. I'm going to go with the Postman Chrome app. 

#### Using the Collection

In Postman you will see that we now have an Auth0 authentication API collection which has been imported, and we group the various API endpoints based on certain functional areas. These are depicted as folders, so when you click on a folder it will open and you can see the endpoints available inside that folder. What also happened when you click on the Running Postman button is that we created an environment for you. So the tenant which I was signed into on the Auth0 website is named Jerry. So what we did is we create an environment inside of Postman for you. If I go to Manage Environment and click on that environment you will see that we set up a variable called Zero_Domain with the value of the Auth0 domain for that tenant. 

Let's close up here and have a look at executing one of these endpoints. So I'm going to take the one to log in with a username and password, and you will see the description. If I open that up you will also see a brief documentation of the particular endpoint. We have also populated the HTTP method as well as the URL for that endpoint. In this case you will see that inside of these two curly braces we have this value Auth0 domain. So that ties up with the variable which was set up in the environment. So when I'm going to execute that it's going to take the value from that environment variable and it's going to replace this variable with that value. So this will become https://jerry.auth0.com/0auth/r0. We have also set up the body for you. For this particular it's a URL-encoded form which is required, and we are going to require the client ID, a username, a password, and the connection. 

So back inside the Auth0 dashboard I'm going to go to my connections, going to go to database connections. So the connection I'm looking for is called Database-Connection. So I'm going to fold that in here. Database connection. Under Applications I'm going to go to Default App and I'm going to need the client ID from here. So I'm going to copy this to the clipboard, and inside Postman I'm going to paste this value in the Client ID field. The username, I created a user called Test1@jerrypalser.com, and a password of Password. So let's execute this request and let you see that the API endpoint returns the ID token, access token, and token type to us. We can also make subsequent API calls based on this access token. So I'm going to highlight this access token and press CTRL-C to copy to the clipboard. I'm going to come down to the user profile and select this endpoint which returns a user profile based on an Auth0 access token. I'm going to come to the header section, and you will see in here that I will need to put in that access token. So I'm going to place that access token which was returned from the previous endpoint. I'm going to click on Send, and you will see that it returns the profile for the user which was signed in. So that's using the authentication API inside Postman. 

#### The Management API

Let's have a look at how we can use the management API. Once again I'm going to go to the management API section. I will click on the Running Postman button, open it with Postman Chrome app, and you will see that now it imported the collection Auth0 management API. So the management API works a little bit different. If I look for example at the user's endpoints and I look at the endpoint to list or search users. I go over to the headers. You will see that I need to specify a bearer token which allows me to talk to the management API. So to generate that bearer token I will have to use the old API explorer. So I'm going to go to the API explorer, I'm going to go down to the methods that I want to work with. So I'm going to go to Users. I want to use this list or search users. So I'm going to generate a token based on the scope. While I'm here let's also create the user. So I'm also going to add this scope.

So if I looked on the left hand side under the token generator you will see that I now generated a token with those two scopes. So let's highlight this and copy it to the clipboard. Back inside Postman I can paste that token in as the value for this bearer token. You will see that what we have done is we have also specified this Auth0 token variable. So the best would be just to specify the variable with that name and then paste in the value of the token as the value of that variable. So to specify a variable we can go to Manage Environments, and I can specify the variable on the environment or I can just specify it as a global. So I'm going to go to Global. Let's specify this one as Auth0 Token. I'm going to place the value in there, click on Update, close here, and now where I click on Send you will see that I get a list of all the users. 

#### Creating a User

Let's also quickly create a user. So if I go to the Create a User endpoint you will see that there are two headers specified, the authorization as well as the content type. So I already set the value for this variable. So we're okay there. Let's go to the body, and what we did is we generated an empty adjacent document which you can just fill in with the values required by this endpoint. So let's just open up the documentation. You will see that for Auth0 DB connections we only require an email and a password. So the name of that connection was called Database-Connection. Let's specify the email address as Test2@jerrypalser.com, and I'm going to specify the password as Password. We don't need to specify a username. So I'm going to delete that and also I'm going to delete the phone number and user metadata. I'm going to keep the email verified true. So we don't have to verify the email address, and delete the app metadata, and click on Send. 

You will see that the Auth0 API returned an adjacent document with a new user which I just created. So that's a quick overview of how you can use the Postman collections for both the authentication API as well as the management API. If you have any feedback, please let us know.