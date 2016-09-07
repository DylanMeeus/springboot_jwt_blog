---
layout: post
title: "Building Serverless Apps with AWS Lambda"
description: "Learn how to build a serverless app with Lambda, the function-as-a-service platform from Amazon. Find out how AWS Lambda stacks up against Webtask."
date: 2016-07-19 08:30
alias: /2016/07/19/building-serverless-apps-with-aws-lambda/
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#626262"
  image: "https://cdn.auth0.com/blog/lambda-serverless/logo.png"
tags:
- Lambda
- Serverless
- Webtask
- Function-as-a-Service
- faas
related:
- 2016-06-28-building-serverless-apps-with-webtask
- 2016-06-09-what-is-serverless
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
---

---

**TL;DR** A few weeks ago we showed how you can [build serverless apps](https://auth0.com/blog/2016/06/28/building-serverless-apps-with-webtask/) with [Webtask](https://webtask.io). Today, we are going to recreate our Serverless Stories app with AWS Lambda. The goal of this article is to showcase how you can build serverless apps with AWS Lambda and to compare and contrast the differences between Lambda and Webtask.

As always, get the sample code from our [GitHub repo](https://github.com/auth0-blog/serverless-stories-lambda/) to follow along.

---

[**Lambda**](https://aws.amazon.com/lambda/) is a Function-as-a-Service (FaaS) platform provided by [Amazon Web Services](http://aws.amazon.com/) (AWS). Lambda is tightly integrated into the AWS ecosystem and allows developers to build microservices that easily interact with other AWS services. For example, we can create a Lambda function that is executed every time a user signs up through the AWS Cognito service or we can trigger a Lambda function after a file is uploaded to S3. Combining Lambda with the [API Gateway](https://aws.amazon.com/api-gateway/), we can build microservices that can be accessed from outside the AWS ecosystem.

{% include tweet_quote.html quote_text="Serverless platforms allow developers to build apps without worrying about infrastructure." %}

Function-as-a-Service or serverless platforms are gaining traction because they allow developers to build applications without focusing on infrastructure. Check out our ["What is serverless"](https://auth0.com/blog/2016/06/09/what-is-serverless/) post to learn more what serverless is and how it can benefit you. In this post we will focus on writing a serverless application.

## Serverless Stories Revisited

![Serverless Stories](https://cdn.auth0.com/blog/webtask/app.png)

The serverless application [we built](https://auth0.com/blog/2016/06/28/building-serverless-apps-with-webtask/) with Webtask was a news blog called Serverless Stories. Today, we will rebuild this application and use AWS Lambda for our backend. In the interest of time, we will omit building the user interface. Check out the code from our [GitHub repo](https://github.com/auth0-blog/serverless-stories-lambda/) for the user interface.

The Serverless Stories app is a static blog that covers all things serverless. We added the ability for users to sign up for a newsletter. Additionally, admins could login and access a secret page where they could retrieve the list of newsletter subscribers. To break down our requirements then, we'll need:

1. A Lambda function and API endpoint to handle newsletter signups
2. A Lambda function and API endpoint to retrieve the list of subscribers
3. The ability for admins to login

### AWS Ecosystem

To accomplish our goal, we will need to use multiple AWS services. We'll of course use **Lambda** to write our microservices, API Gateway will allow us to expose the Lambda functions we write to the Web. For handling user authentication, we'll rely on [Cognito](https://aws.amazon.com/cognito/) and [IAM](https://aws.amazon.com/iam/). [DynamoDB](https://aws.amazon.com/dynamodb/) will be our database of choice for storing the newsletter subscribers.

### Setting up DynamoDB

![DynamoDB](https://cdn.auth0.com/blog/lambda-serverless/dynamodb.png)

The first thing we'll do is create our database. DynamoDB is a NoSQL database offered by AWS that works nicely with Lambda. For our requirements, we just need to capture and store the provided email address. Let's set up our database.

Head over to the DynamoDB [homepage](https://console.aws.amazon.com/dynamodb/home?region=us-east-1#) and click on the **Create table** button. You can name your table anything you want, we'll keep it fairly generic and go with "Emails." Next, we'll need to setup a primary key. Since our database is going to be very minimalistic, we'll set this field to "email" and make it a type of string. Select the **Use default settings** checkbox as the defaults should be more than enough for our simple use case. Finally, click the **Create table** button and you should be good to go.

![DynamoDB Setup](https://cdn.auth0.com/blog/lambda-serverless/dynamodb-setup.png)

Before closing out the database setup section, let's add some seed data. To do this, click on the **Tables** button in the DynamoDB dashboard, then select your newly created "Emails" table. Navigate to the **Items** tab and you will have the option to add new items. Add a few emails so we have some data to work with.

### Creating Our AWS Lambda Functions

![AWS Lambda](https://cdn.auth0.com/blog/lambda-serverless/lambda.png)

Now that we have our database setup, let's go ahead and implement our Lambda functions. We will be creating two Lambda functions. The first will store a user provided email address into our database and the second will retrieve the list of emails in the database.

Writing Lambda functions is similar to how you would write [Webtask](https://webtask.io) functions. You export a function that accepts multiple parameters that help set the context of the request. Within the function, you write your implementation. To complete the operation, you call the callback function and pass into it data you would like to respond with.

In addition to Node.js, Lambda supports Python and Java runtimes for writing our functions, but we'll stick to Node.js as that's what our Webtask implemantion used. We can write our functions inline within the Lambda dashboard or locally on our computer, zip it up and upload it. For our examples, we'll write the code inline.

#### Store New Subscriber AWS Lambda Function

Let's implement our first function. Navigate to the Lambda [homepage](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions?display=list) in the AWS dashboard and create a new Lambda function. You will be presented with many recipes that provide good starting points if you are new to the platform. Click the next button to create an empty Lambda function. We won't setup any triggers for now, so on this screen, just click the next button.

![Creating Lambda Functions](https://cdn.auth0.com/blog/lambda-serverless/creating-lambda-functions.png)

We'll have to configure a few more settings before we're ready to write code. Here, set the name the Lambda function, for the runtime select Node 4.3, and the rest of the settings can be left to their default state. Before moving on, set the role to "Choose Existing Role" and from here you should have the option to select "server-role/admin". This will give the Lambda function the ability to call and execute code from various AWS services such as DynamoDB. Not setting the role properly will cause your errors in your Lambda function. *The permission we granted here are very liberal. In a real application, you would want to set narrower permissions to ensure that the code has access to only the parts of your infrastructure that it needs.*

We will make use of the AWS SDK which will allow us to easily interact with other AWS services within our code. Take a look at our implementation below.

```
'use strict';

// Require the AWS SDK and get the instance of our DynamoDB
var aws = require('aws-sdk');
var db = new aws.DynamoDB();

// Set up the model for our the email
var model = {
  email: {"S" : ""},
};

// This will be the function called when our Lambda function is exectued
exports.handler = (event, context, callback) => {

  // We'll use the same response we used in our Webtask
  const RESPONSE = {
    OK : {
      statusCode : 200,
      message: "You have successfully subscribed to the newsletter!",
    },
    DUPLICATE : {
      status : 400,
      message : "You are already subscribed."
    },
    ERROR : {
      status : 400,
      message: "Something went wrong. Please try again."
    }
  };

  // Capture the email from our POST request
  // For now, we'll just set a fake email
  var email = event.body.email;;

  if(!email){
    // If we don't get an email, we'll end our execution and send an error
    return callback(null, RESPONSE.ERROR);
  }

  // If we do have an email, we'll set it to our model
  model.email.S = email;

  // Insert the email into the database, but only if the email does not already exist.
  db.putItem({
    TableName: 'Emails',
    Item: model,
    Expected: {
      email: { Exists: false }
    }
  }, function (err, data) {
    if (err) {
      // If we get an err, we'll assume it's a duplicate email and send an
      // appropriate message
      return callback(null, RESPONSE.DUPLICATE);
    }
    // If the data was stored succesfully, we'll respond accordingly
    callback(null, RESPONSE.OK);
  });
};
```

In this function, we will get the email from the event object passed in when the function is called. Let's go ahead and implement our second Lambda function which will retrieve the newsletter subscribers.

#### Retrieve Serverless Stories Newsletter Subscribers

Follow the same process as before to create a new lambda function. The only difference is we'll change the name of the function to Subscribers. Once our function is created, we'll implement the code logic as follows:

```
'use strict';

// We'll again use the AWS SDK to get an instance of our database
var aws = require('aws-sdk');
var db = new aws.DynamoDB();

exports.handler = (event, context, callback) => {
  // We'll modify our response code a little bit so that when the response
  // is ok, we'll return the list of emails in the message
  const RESPONSE = {
    OK : {
      statusCode : 200,
      message: [],
    },
    ERROR : {
      status : 400,
      message: "Something went wrong. Please try again."
    }
  };

  // We'll use the scan method to get all the data from our database
  db.scan({
    TableName: "Emails"
    }, function(err, data) {
      if (err) {
        callback(null, RESPONSE.ERROR);
      }
      else {
         // If we get data back, we'll do some modifications to make it easier to read
         for(var i = 0; i < data.Items.length; i++){
           RESPONSE.OK.message.push({'email': data.Items[i].email.S});
         }
           callback(null, RESPONSE.OK);
      }
  });
};
```

Before continuing on, let's test our function. You can easily test your Lambda functions by clicking the **Test** button at the top of the page. Your code will execute and display the results of the operation as well a log to help you debug any issues. If you got back a response with the seed data we stored earlier, you are good to continue on to the next section.

### Expose AWS Lambda Functions with API Gateway

We have our Lambda functions created, but at the moment they are of little use to our Serverless Stories app. We cannot access them outside the AWS ecosystem. Let's change that by exposing our functions via the AWS API Gateway service. API Gateway allows us to expose our Lambda functions and access them over HTTP like any other RESTful API.

For our purposes, we will create an API that exposes two routes. The first will be the `/subscribe` route which will be accessed via a POST request. The second, `/subscribers` will be accessed via a GET request, but will only be accessible by an authorized user. We'll start by building our `/subscribe` route.

#### Subscribe Endpoint

![API Gateway Setup](https://cdn.auth0.com/blog/lambda-serverless/api-gateway-setup.png)

To create a new API, navigate to the API Gateway [dashboard](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis) in the AWS dashboard. From here, click the **New API** button and fill in the form. This will create our API. Now, we'll add our POST method. Under the **Resources** tab, click the **Actions** button and select the **Create Resource** option. Name the resource "subscribe" and press the save button. Next, add a POST method to this resource by clicking the **Actions** button again and selecting **Create Method**. From the dropdown, select POST.

![API Gateway Mapping](https://cdn.auth0.com/blog/lambda-serverless/api-gateway-mapping.png)

You will be given an option on the type of integration you want. Here we'll select **Lambda Function** and choose our "NewsletterSubscribe" function. Clicking the **Save** button will create our endpoint. The final thing we'll need to do is create a body mapping template so that we can pass the data we receive in the body of the request to our Lambda function. To do this, click on the **Integration Request** of our POST method, then click the **Add Mapping Template**. We'll create an `application/json` template and in the provided textarea paste the following:

```
{
  "body" : $input.json('$')
}
```

Hit the **Save** button and we're done.

#### Subscribers Endpoint

The subscribers endpoint will follow much of the same process. Create the `/subscribers` endpoint and this time add a GET method. We won't need to add a mapping template, but we will require the user to be authenticated before they can access the Lambda function associated with the endpoint. Once you've created the endpoint and added the `GET` method, click on the **Method Request** box. Here, select "AWS_IAM" from the dropdown. This will ensure that only authenticated users can call this method and get the data, all others will see an error message.

![API Gateway Unauthenticated Request](https://cdn.auth0.com/blog/lambda-serverless/api-gateway-auth.png)

One final note before we leave the API Gateway. Since we'll be accessing these API's from a different domain than the API endpoint, we'll need to enable [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS). This can be accomplished by selecting a route in the API Gateway, clicking the **Actions** button, and selecting **Enable CORS**. Do this for both of the routes.

With our API Gateway implementation complete, let's export our API so that we can use it in our application. Click on the **Actions** button and select **Deploy API**. The default stage name will be "prod". Within a few seconds your API will be available. Any time you make a change to your API, you will need to redeploy it following this process. Now click on the **SDK Generation** tab and select "JavaScript" from the dropdown. Click the **Generate SDK** button and a zip file will download with your SDK. Save this file for now, we'll be using it later when implementing the API into our app.

![API Gateway SDK Generation](https://cdn.auth0.com/blog/lambda-serverless/api-gateway-sdk.png)

### IAM and Cognito

Alight, so we got our database, our Lambda functions, and our endpoints exposed. Next, we will setup and configure our user authentication system. For user authentication we will create a new AWS IAM role and a Cognito user pool.

![AWS Cognito](https://cdn.auth0.com/blog/lambda-serverless/aws-cognito.png)

Open up the AWS Cognito [service](https://console.aws.amazon.com/cognito/home?region=us-east-1). On the homepage, click the **Create User Pool** button. Name your user pool and select the **Review Defaults** option. We'll stick to the default settings for our application. Once the user pool is created, select the **Apps** tab from the main menu. Here, create a new app, name it, and be sure to uncheck the **Generate client secret** option. Our app will run on the front-end so we do not need a secret key.

Next, we'll need to create a federated identity pool that will work alongside our user pool. Click on the **Federated Identities** from the main header and once the page loads click the **Create new identity pool** button. Name the identity pool and navigate to the **Authentication Providers** section. Here you will paste in your **Cognito User Pool Id** and your **App Client Id** which you created earlier. Once you have the information pasted, click the **Create Pool** button.

On the next screen you will be given an option to create a new IAM role for the federated identity. Go ahead and create a new role for this demo.

![AWS Cognito in Action](https://cdn.auth0.com/blog/lambda-serverless/aws-cognito-in-action.png)

Before we implement Cognito in our application, let's edit the IAM role we just created to ensure that it will have the permissions needed to access our Lambda function. Navigate to the AWS IAM service. On the IAM service homepage, click the **Roles** tab and choose the role you created alongside the federated identity pool earlier. From here, scroll down to **Inline Policies** and you'll see a policy along the lines of "oneClick_...", open this policy or create a new one and ensure that you give the IAM role permission to execute APIs. To do this add the `"execute-api:*"` string to your array of actions. *Note: With this permission, any user belonging to this IAM role will be able to execute any API you create. In a real application you will want to narrow the scope of permissions.*

![IAM Permissions](https://cdn.auth0.com/blog/lambda-serverless/iam-permissions.png)

## Adding Serverless to Serverless Stories

We are finally ready to start implementing our Lambda functions in the Serverless Stories app. There are many JavaScript libraries that will be required for our app to work with the AWS services so I strongly recommend you pull down the code from our [GitHub repo](https://github.com/auth0-blog/serverless-stories-lambda/).

The first thing we'll do is add in the required JavaScript libraries to our `index.html` file. Unzip the file that we downloaded earlier containing our JavaScript SDK. The unzipped folder will contain many of the libraries we'll need. The others, you can either find on npm or get from our [GitHub repo](https://github.com/auth0-blog/serverless-stories-lambda/). If you are using our sample project from GitHub, be sure to still overwrite the `apigClient.js` file located under `./assets/gateway/` with your `apigClient.js` as this file contains code specific to your API Gateway API. Below is a list of libraries we'll be using:

```
<head>
    <title>Serverless Stories</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="./assets/jsbn.js"></script>
    <script src="./assets/jsbn2.js"></script>
    <script src="./assets/sjcl.js"></script>
    <script src="./assets/moment.min.js"></script>
    <script src="./assets/aws-cognito-sdk.min.js"></script>
    <script src="./assets/amazon-cognito-identity.min.js"></script>
    <script src="./assets/aws-sdk.min.js"></script>
    <script src="./assets/gateway/lib/apiGatewayCore/apiGatewayClient.js"></script>
    <script src="./assets/gateway/lib/apiGatewayCore/sigV4Client.js"></script>
    <script src="./assets/gateway/lib/apiGatewayCore/simpleHttpClient.js"></script>
    <script src="./assets/gateway/lib/apiGatewayCore/utils.js"></script>
    <script src="./assets/gateway/lib/axios/dist/axios.standalone.js"></script>
    <script src="./assets/gateway/lib/CryptoJS/rollups/hmac-sha256.js"></script>
    <script src="./assets/gateway/lib/CryptoJS/rollups/sha256.js"></script>
    <script src="./assets/gateway/lib/CryptoJS/components/enc-base64.js"></script>
    <script src="./assets/gateway/lib/CryptoJS/components/hmac.js"></script>
    <script src="./assets/gateway/lib/url-template/url-template.js"></script>
    <script src="./assets/gateway/apigClient.js"></script>
  </head>
  <body>
    ...
    <script src="./assets/app.js"></script>
  </body>
```

Next, open up the `app.js` file located in the `assets` folder. This is the file that will contain our application logic. We already implemented the functionality in the Webtask implementation and below is a skeleton of the functions we'll need to implement for our Lambda example. Let's take a look at the code to get a better understanding of our scope.

```
 $(document).ready(function(){
   // Any time a page is loaded we'll check to see what the authentication status is
   updateAuthenticationStatus();
   // Since we're not using a framework and our example is very basic, we have a helper
   // function that checks to see if we're on the super secret admin page
   loadAdmin();
 });

 function logout(){
  // Here we'll implement the logic to log a user out
 };

 function updateAuthenticationStatus(){
  // Our implementation of updating user authenticate state will go here
 }

 function loadAdmin(){
  // In the loadAdmin() function we'll check to see if we're on the admin page
  // Additionally, if we are on the admin page and are authenticated we'll call
  // the subscribers Lambda function to retrieve the list of users that have
  // signed up for our newsletter
 }

 $('#newsletter').submit(function(e){
  // This method will call our subscribe Lambda function and try to register
  // the email if it's unique
 })

 $('#signin').submit(function(e){
  // This method will log the user in using the AWS Cognito service
 })
```

This gives us a great starting point and now we can tackle the implementation details one by one.

### Global Config

Let's get started by adding our global AWS configuration. We'll do this at the very top of our `app.js` file to ensure that we have access to the config throughout our code.

```
// Your AWS region
AWS.config.region = 'us-east-1'; //
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // This will be the identity pool from your federated identity pool and not your user pool id.
    IdentityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    Logins: {
      // Here we'll set our Cognito user pool id. We'll check to see if a user logged in by getting the token from
      // localStorage which we will implement later
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX': JSON.parse(localStorage.getItem('token'))
    }
});
```

### User Authentication with Cognito

Next, we'll implement our user authentication. We'll be using the AWS Cognito service for this. Implementing Cognito will require its own set of config options, but this will allow us to have a better separation of concerns and won't tie us down to the global config. Let's look at the implementation below.

```
$('#signin').submit(function(e){
  e.preventDefault();

  // We'll set the global permissions first
  AWSCognito.config.region = 'us-east-1';
  AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
    // This will be the Pool Id from your Cognito user pool.
    IdentityPoolId: 'us-east-1_XXXXXXXXX'
  });
  // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
  AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

  // We'll additionally connect to our user pool through the app we created when we set up our
  // Cognito user pool.
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
    UserPoolId : 'us-east-1_XXXXXXXXX',
    ClientId : 'YOUR-APP-CLIENT-ID'
  });

  // We'll capture the user login data from our sign in form.
  var authenticationData = {
    Username : $('#username').val(),
    Password : $('#password').val(),
  };

  // Finally, we'll create an object that will contain the username and user pool data
  // which we'll use for the authentication
  var userData = {
    Username : $('#username').val(),
    Pool : userPool
  };

  // Here we are invoking the Cognito services required to perform the authentication
  var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  // We'll do our user authentication here. If the authentication is successful, we'll grab the JWT
  // and store it in localStorage. If not, we'll display an error.
  // In a real application you'd probably want some better failure handling
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      localStorage.setItem('token', JSON.stringify(result.idToken.jwtToken));
      window.location = '/';
    },
    onFailure: function(err) {
      console.log(err);
    }
  });
})
```

While we're on the subject of authentication, we might as well implement the other functions dealing with auth. Our `logout()`  implementation will be as follows:

 ```
 // We'll clean out the localStorage
 // The Cognito service sets various items here, so we'll make sure to empty out everything to log a user out.
 function logout(){
   localStorage.clear();
   window.location = '/';
 };
 ```

 Next, we'll implement the `updateAuthenticationStatus()` function which handles our user state. Since we're not using a framework, we use a basic function that checks for existence of a JWT and displays either the login or logout link in the main navigation. Our implementation is below:

```
 function updateAuthenticationStatus(){
   $('#user').empty();
   $('#login').empty();
   // We'll check to see if a JWT exists and assume that if one is present the user is authenticated
   var user = localStorage.getItem('token');
   if(user){
     $('#user').show().append('<a onclick="logout()">Log out</a>');
     $('#login').hide();
   } else {
     $('#login').show().append('<a href="/login">Log in</a>');
     $('#user').hide();
   }
 }
```

This wraps up our user authentication implementation. In the next section, we'll implement our Lambda functions. We saved the best for last!

### Implementing Our Lambda Functions

The first Lambda function we'll implement is the one that deals with the user subscribing to our newsletter. The reason we're doing this one first is because it does not require user authentication. This way we can introduce you to the `apigClientFactory` SDK that AWS provided for us without overloading you with information. Let's look at the implementation below.

```
$('#newsletter').submit(function(e){
  e.preventDefault();

  // We'll set up a new API client.
  // This method comes from the SDK that was generated by API Gateway
  var client = apigClientFactory.newClient();

  // The SDK contains helper methods for all of the API endpoints we created.
  // Here we are using the subscribePost method which talks to our /subscribe endpoint
  // The second parameter is the body of our request, so here we will capture the email
  // provided and make the call to the API
  client.subscribePost({}, {email:$('#email').val()}, {})
  .then(function(data){
    // If all went well, we'll display a success message, otherwise we'll display an error.
    // Our Lambda response is wrapped in API Gateway's own response object, that is why we are
    // accessing data.data object.
    if(data.data.statusCode == 200){
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-success">'+ data.data.message +'</div>')
    } else {
      $('#newsletter').hide();
      $('#response').append('<div class="alert alert-danger">'+ data.data.message +'</div>')
    }
  })
})
```

Our Lambda function that retrieves the list of newsletter subscribers will require some additional code. We will have to ensure that the user is authenticated first, then we'll also need to pass our authentication credentials to the API Gateway endpoint as it performes validation  and makes sure the credentials are valid before returning a successful result. Let's look at the implementation below.

```
function loadAdmin(){
  // We'll ensure this code runs only on the admin page
  if(window.location.pathname == '/admin/'){
    // Our first line of defense will be to check and make sure a JWT exists
    // If it doesn't we'll redirect back to the homepage
    if(localStorage.getItem('token')){
      // If the token is present, we'll call the appropriate AWS method to get
      // the currently logged in users credential keys
      AWS.config.credentials.get(function (err) {
        // We'll create an instance of our API Gateway client again
        // This time we'll pass in the required keys that will authenticate the request
        // The API Gateway SDK will take care of transforming these keys into the appropriate
        // header and will send out the request to our endpoint.
        var client = apigClientFactory.newClient({
          accessKey: AWS.config.credentials.accessKeyId,
          secretKey: AWS.config.credentials.secretAccessKey,
          sessionToken: AWS.config.credentials.sessionToken,
          region: 'us-east-1'
        });

        // Here we are calling the subscribersGet method that was generated for us
        // On a successful response we'll take the array of emails and display them
        // on our page.
        client.subscribersGet().then(function(data){
          for(var i = 0; i < data.data.message.length; i++){
            $('#subscribers').append('<h4>' + data.data.message[i].email + '</h4>');
          }
        });
      });
    } else {
      window.location = '/';
    }
  }
}
```

We are ready to test our application. Launch the application by running `http-server` and your application will start on `localhost:8080`. On the homepage, you should be able to enter your email and submit a newsletter.

![Serverless Stories Newsletter Signup](https://cdn.auth0.com/blog/webtask/subscribed.png)

Next, click on the **Login** button from the main menu. On the login page, login with an already created account. AWS Cognito currently does not allow you to create users from the dashboard. You can use the config code located in the `$('#signin')` method and call the `userPool.signUp()` method to create a new user account. Here is a sample of how this can be accomplished.

```
  // We'll omit the config

  // Additional user details
  var attributeList = [];

  // Adding an email to the user account
  var dataEmail = {
    Name : 'email',
    Value : 'email@mydomain.com'
  };

  var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  // The signUp method that creates the user.
  userPool.signUp('USERNAME', 'PASSWORD', attributeList, null, function(err, result){
    if (err) {
      alert(err);
      return;
    }
    cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
  });
```

Once you have an authenticated user, navigate to `localhost:8080/admin` and if all is good you will see the list of newsletter subscribers.

![Serverless Stories Admin](https://cdn.auth0.com/blog/lambda-serverless/admin.png)

## Aside: Authentication for Serverless Apps with Auth0

We saw how we could use Cognito to handle user authentication. Before closing out the article, let's take a look at a second approach to user authentication. Auth0 can easily integrate into the AWS ecosystem and handle all of the user authentication duties and is much easier to implement than Cognito.

We will use the Auth0 delegation API to exchange our Auth0 token for an AWS token. The [Amazon API Gateway Tutorial](https://auth0.com/docs/integrations/aws-api-gateway) will be our guide and has much more in-depth information on setting up token-based authentication with AWS. The delegation API we are using today is not limited to just AWS. It can be used with other serverless frameworks such as [Firebase](https://console.firebase.com) and more.

### AWS Configuration with Auth0

First things first, [sign up](https://auth0.com/signup) for a free Auth0 account. In the Auth0 [management dashboard](https://dashboard.auth0.com), create a new application, then navigate to the Add-Ons tab. Here, we will just enable the Amazon Web Services add-on but flipping the switch to the "on" state.

![Auth0 Add-Ons Dashboard](https://cdn.auth0.com/blog/lambda-serverless/auth0-config.png)

Next, we'll need to download our SAML metadata. To do this, navigate to the **Settings** tab and scroll down until you see a "Show Advanced Settings" link. Click this link and select the **Endpoints** tab. Scroll down until you see the SAML options and copy the **SAML Metadata URL**. Visit this link and an XML file will download containing your Auth0 metadata which will be required to integrate with AWS.

Now head over to your [AWS IAM dashboard](https://console.aws.amazon.com/iam/home?region=us-east-1#home). Select **Identity Providers** from the left-hand menu and then click the **Create Provider** button. The "Provider Type" will be SAML, you can name your provider anything, and the required "Metadata Document" will be the XML file we downloaded earlier. Click the next button and you will see a verification screen. If the "Provider Type" is SAML click the **Create** button to create the provider.

![AWS Identity Provider Setup](https://cdn.auth0.com/blog/lambda-serverless/identity-provider.png)

Next, we'll create a new IAM role for our Auth0 instance. Select the "Roles" menu and click the **Create New Role** button. Name the role, and on the following screen you will need to select a role type. Here you will select **Role for Identity Provider Access** and then **Grant API access to SAML providers**. The next step will have us set the SAML provider for our role, which will be the Identity Provider you created earlier. For the attribute field, select "SAML:iss" and finally for the value field, you'll set `urn:YOUR-ACCOUNT.auth0.com`. You can click through the rest of the settings to complete the setup.

![AWS New IAM Role for Identity Provider](https://cdn.auth0.com/blog/lambda-serverless/new-iam-role.png)

The final step we'll need to do before we can implement Auth0 in our app is update the permissions for the newly created IAM role. Click on the **Roles** menu and then your newly created role. We'll create a new inline policy and give it permissions to call our API Gateway service. Our policy will look like:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

We will also need to edit the **Trust Relationship** so that our user can properly access the API Gateway. Edit the Trust Relationship policy by selecting the **Trust Relationship** tab and clicking the **Edit Trust Relationship** button. Here you will add an additional object to the `Statement` array. The additional object will be:

```
{
  "Sid": "gateway",
  "Effect": "Allow",
  "Principal": {
    "Service": "apigateway.amazonaws.com"
  },
  "Action": "sts:AssumeRole"
}
```

### Implementing Auth0 Authentication with the Delegation API

Now we are ready to integrate Auth0 in our Serverless Stories application. For our integration we'll use the excellent [Auth0 Lock](https://auth0.com/lock) widget to handle the user authentication and the [Auth0 JavaScript library](https://auth0.com/docs/libraries/auth0js) to handle our Auth0 to AWS token exchange. Let's add the two libraries to our `index.html` file so that we can use them in our application.

```
<head>
  ...
  <script src="//cdn.auth0.com/w2/auth0-6.7.js"></script>
  <script src="https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>

  ...
</head>
```

Next, we'll open up the `app.js` file located in the assets directory. As you may recall, this is where we implemented all of our application logic. The first thing we'll do here is strip out all the AWS Cognito related code. Once that is done, we'll configure our Auth0 code. Remember you will need an Auth0 account for this, so if you don't already have one, you can create one [here](https://auth0.com/signup).

```
var auth0 = new Auth0({
    domain:       'YOUR-AUTH0-ACCOUNT.auth0.com',
    clientID:     'YOUR-APP-CLIENT-ID',
    callbackURL:  'localhost:8080',
    callbackOnLocationHash: true
  });
var lock = new Auth0Lock('YOUR-APP-CLIENT-ID', 'YOUR-AUTH0-ACCOUNT.auth0.com');
```

Since we'll be using the Lock widget, we will no longer need the login page we created earlier. Instead, we'll just call a function to display the Lock widget and listen to the `authentiated` event that will be triggered during user authentication. Take a look at our new authentication implementation below:

```
function login(){
  // Display the lock widget which will ask the user to login or register
  lock.show();
}

// Handle user authentication, listen to the authenticated event fired when the user logs in
lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {

    if (error) {
      // handle error
       return alert(error.message);
    }

    // If login is successful, we'll store the JWT in local storage
    localStorage.setItem('token', JSON.stringify({token: authResult.idToken}));

    // We'll exchange our Auth0 JWT with AWS so that we can get our AWS credentials
    // Once the token exchange is complete, we'll store the results in local storage
    // if no errors occured.
    auth0.getDelegationToken({id_token: authResult.idToken, api: 'aws'}, function(err,delegationResult){
      if (!err){
        // delegationResult.Credentials will contain our AWS Access Key, Secret Key and Session Token
        localStorage.setItem('credentials', JSON.stringify(delegationResult.Credentials))
      }
    });
    updateAuthenticationStatus();
  });
});

```

We will need to create a rule so that we can additionally pass two more parameters to complete the token exchange. Navigate to the Auth0 [dashboard](https://manage.auth0.com) and select **Rules** from the main menu. Next, click on the **Create Rule** button to create a new rule.

We will need to add this rule so that we can securely pass our role and identity provider information for the token exchange. Our rule will look like:

```
function (user, context, callback) {
  var options = {
    role: "ARN-FOR-THE-IAM-ROLE-YOU-CREATED",
    principal: "ARN-FOR-THE-IDENTITY-PROVIDER-YOU-CREATED"
  };

  context.addonConfiguration = context.addonConfiguration || {};
  context.addonConfiguration.aws = context.addonConfiguration.aws || {};
  context.addonConfiguration.aws.role = options.role;
  context.addonConfiguration.aws.principal = options.principal;

  // TODO: implement your rule
  callback(null, user, context);
}
```

Now that we have our `login()` function, let's update the `updateAuthenticationStatus()` function to call `login()` instead of navigating to the login page.

```
function updateAuthenticationStatus(){
  $('#user').empty();
  $('#login').empty();
  var user = localStorage.getItem('token');
  if(user){
    $('#user').show().append('<a onclick="logout()">Log out</a>');
    $('#login').hide();
  } else {
    $('#login').show().append('<a onclick="login()">Log in</a>');
    $('#user').hide();
  }
}
```

Only one of our AWS Lambda functions requires user authentication. The function to subscribe to the newsletter does not need to be changed at all. It will continue working as is. For our admin route we'll update the code to the following:

```
function loadAdmin(){
  if(window.location.pathname == '/admin/'){
    if(localStorage.getItem('token')){
      // We'll get the AWS Credentials we stored in localStorage
      var credentials = JSON.parse(localStorage.getItem('credentials'));

      // We'll pass in the correct credentials to our request
      var client = apigClientFactory.newClient({
        accessKey: credentials.AccessKeyId,
        secretKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
        region: 'us-east-1'
      });
      client.subscribersGet().then(function(data){
        for(var i = 0; i < data.data.message.length; i++){
          $('#subscribers').append('<h4>' + data.data.message[i].email + '</h4>');
        }
      })

    } else {
      window.location = '/';
    }
  }
}
```

We are ready to test our application. Start it up by running the `http-server` command from your terminal and navigate to `localhost:8080`. Click on the **Login** button and you will see the Lock widget popup and ask you for authentication details. Login or register and you will be authenticated.

![Lock Widget Login](https://cdn.auth0.com/blog/lambda-serverless/lock.png)

Navigate to the secret `http://localhost:8080/admin` route and you will see the list of newsletter subscribers as before.

![Serverless Stories Admin](https://cdn.auth0.com/blog/lambda-serverless/admin.png)

## AWS Lambda vs Webtask Experience

The goal of this article was to compare the development experience between AWS Lambda and Webtask when it came to building serverless applications. To close out the article I would like to share my experience writing the app in both Lambda and Webtask.

### Initial Setup

When it came to the initial setup for Webtask, all I had to do was install the Webtask CLI by running the npm command `npm install wt-cli -g`. From there, I created an account and was up and running. For the Lambda implementation, all that was needed to get started was an AWS account. I could create Lambda functions from the AWS dashboard.

### Configuration

The Lambda implementation required a lot of configuration. I had to setup DynamoDB, API Gateway, Cognito, and configure an IAM role for my Lambda function to be of use outside the AWS ecosystem. I found this configuration to be pretty cumbersome and the docs quite lacking. The benefits of all the configuration is that it gives you total control over each service, but can be a real pain to setup. With Webtask, there was virtually no configuration. Everything we needed to do, we expressed in the code we wrote.

### Writing Serverless Functions

Writing the actual functions to perform our tasks was very similar between Lambda and Webtask. Both of the services required us to export a function that understood the context of the request. Both platforms also allowed for easy debugging of the code. Deploying our functions was also a breeze for both Lambda and Webtask. With Lambda, we could write and deploy our functions from the AWS dashboard, while in the Webtask implementation we wrote our code locally and deployed it with a CLI command.

### Accessing Our Functions

When it came to accessing the functions we wrote, I feel that Webtask had a much better experience. Anytime we deployed a Webtask, we were immediately given a URL to access the function. With Lambda, we had to use the API Gateway which required a whole set of configuration options to expose an endpoint. Furthermore, API Gateway can be somewhat clunky to work with and get right the first time.

### Securing Serverless Functions

This is another area where I feel that Webtask had an advantage. With Lambda, we had to rely on Cognito and IAM to authenticate and provide permissions for accessing the Lambda function. We didn't write any code to check user authentication in the Lambda function itself. In the Webtask implementation, we wrote the code to require authentication within the Webtask itself and then using Auth0's authentication platform were able to secure said Webtask. This may come down to preference, but I generally prefer code over configuration.

### Overall Experience

Building the Serverless Stories app with two different function-as-a-service platforms was an enlightening experience. I found that Webtask allowed you to quickly create microservices without worrying about infrastructure. Lambda, on the other hand, was much more configuration based, and trying to properly configure all the right pieces felt counter-intuitive to the serverless mantra at times. I believe that Lambda's strength is not necessarily in building standalone serverless apps, but in augmenting the AWS ecosystem.

## Conclusion

Rebuilding the Serverless Stories with AWS Lambda gave us greater insight into Amazon's function-as-a-service platform. We walked through the process of combining multiple AWS services to create an API that we could call from our static website. We were able to recreate the app, but found that it required a lot of additional work when compared to our Webtask implementation. What do you think? Follow [this guide](https://auth0.com/blog/2016/06/28/building-serverless-apps-with-webtask/) to build Serverless Stories with Webtask and compare the experience yourself.

{% include tweet_quote.html quote_text="Lambda's strength is not necessarily in building serverless apps, but in augmenting the AWS ecosystem." %}
