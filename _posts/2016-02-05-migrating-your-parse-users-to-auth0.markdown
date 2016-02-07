---
layout: post
title: "Migrating Your Parse Users to Auth0"
description: "Parse is shutting down on January 28, 2017. Learn how to easily migrate your users to Auth0 and diversify risks."
date: 2016-02-05 20:35
author: 
  name: Ado Kukic
  url: https://twitter.com/kukicadnan
  mail: kukicadnan@gmail.com
  avatar: https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200
design: 
  bg_color: "#333333"
  image: "http://i.imgur.com/bGCV82v.png"
  image_size: "100%"
tags: 
- Parse
- Migration
- MBaSS
- Tutorial
---

Facebook shocked the developer community when it announced it would be [shutting down](http://blog.parse.com/announcements/moving-on/) Parse, a [MBaaS](https://en.wikipedia.org/wiki/Mobile_backend_as_a_service), which powers over 500,000 apps. Applications relying on Parse have until January 28, 2017 to find a new home. The Parse team has released two tools to help developers migrate away, [Parse Server](https://github.com/ParsePlatform/parse-server/wiki) and the [Database Migration Tool](https://parse.com/docs/server/guide#migrating).
  
Today's tutorial will focus on migrating users from an existing Parse application to Auth0. We will implement Auth0's automatic migration feature to work with our existing Parse backend so that whenever our existing users login their account will be migrated to Auth0. We have developed a sample app that utilizes Parse - and this tutorial will take us step by step through the process of migrating users to Auth0.

## Introduction
David S. founded [CloudCakes](https://github.com/kukicadnan/cloudcakes) to deliver pastry happiness to customers with the click of a button. After the announcement that Parse is shutting down, David has decided to use Auth0 to mange user creation and authentication. CloudCakes has millions of happy users across the world and David wants to make the transition as smooth as possible.
 
## Setting Up Automatic Migration
With an Auth0 account created and verified, David is ready to setup automatic migration for his users. In the Auth0 Dashboard, he navigates to the Connections then Database menu and creates a new database connection. To enable the migration from Parse, the first step will be to enable the use of a custom database.  To do that, David navigates to the Custom Database tab and flips the switch on the "Use my own database" option. Next, he goes back to the Settings tab and enables the Import Users to Auth0 functionality.

### Username vs Email
Parse uses the "username" key when creating user accounts. The username key can either be an actual email address or any valid string - it's up to the developer to choose. If your Parse users login with a username rather than an email address, you will also need to enable the "Requires Username" option in the Settings otherwise you can leave this setting unchecked.

## Implementing the Database Action Scripts
To get the automatic migration working we will need to implement two scripts - Login and Get User.

### Login 
The login script is executed when a user tries to sign in but their account is not found in the Auth0 database. Here we will implement the functionality to pass the user credentials provided to our Parse database and see if that user is valid. Auth0 provides templates for many common databases such as MongoDB, MySQL and Sql Server, but for Parse we will have to write our own. We will utilize Parse's REST API to authenticate the user.

```javascript
// The login function takes 3 parameters: 
// 1. username/email 
// 2. password
// 3. callback function
function login (username, password, callback){

  // Utilizing the request library we make the REST call to Parse
  // Visit https://parse.com/docs/rest/guide#users-logging-in for requirements
  request({
    url: 'https://api.parse.com/1/login',
    qs: {username: username, password: password},
    method: 'GET',
    headers: {
        // Auth0 provides us a configuration object we can use to securly store values
        'X-Parse-Application-Id': configuration.ParseApplicationId,
        'X-Parse-REST-API-Key': configuration.ParseAPIKey,
        'X-Parse-Revocable-Session' : '1'
    }
  }, function(error, response, body){
    if(error) {
      callback(error);
    } else {
      body = JSON.parse(body);
      if(response.statusCode !== 200){
        callback();
      } else {
        // If a user was found and succesfully authenticated through the API
        // We create a new Auth0 user with details returned and log the user in
        callback(null, {
          user_id : body.objectId,
          username: body.username,
          email: body.email,
          email_verified: true,
          nickname: body.nickname
          // Add any additional fields you would like to carry over from Parse
        });
      }
    }
  });
}
```

### Get User
The get user script is executed when...

### Settings / Configuration

As mentioned in the code sample above, Auth0 provides a convenient configuration object that we can use in the database scripts. For Parse, we have utilized this feature to create two keys, ParseApplicationId and ParseAPIKey which hold the values of our Parse ApplicationId and API Key respectively. Creating additional keys is as easy as picking a unique name for the key and pasting the value you want it to hold.

### Script Debugging
Auth0 additionally provides functionality to try your custom login function as well as debug it. As this code runs in a sandbox on Auth0's servers, you will need to install ```wt``` and hook it into your Auth0 app. The instructions are very straightforward and can be found by clicking the **Debug Script** button in the Database Action Scripts section.

## Implement Auth0 Authentication in CloudCake
We are now ready to implement Auth0 authentication in our app. CloudCake was built as an AngularJS app that talks to a REST backend. If you would like to follow along get the code [here](https://github.com/kukicadnan/cloudcakes). Since our app was built with AngularJS we will add all the required and supplemental libraries to make the implementation as easy as possible.

## Automigrating Users
...

## Additional Resources
...

## Conclusion
...
