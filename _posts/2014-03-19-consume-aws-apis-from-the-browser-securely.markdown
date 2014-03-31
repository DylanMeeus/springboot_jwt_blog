---
published: "true"
layout: post
title: Using AWS APIs without a server
date: "2014-03-19 12:30"
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---

**TL;DR**: you can access the AWS APIs securely (e.g. S3, DynamoDB, EC2) from browsers (i.e. using JavaScript) or native apps, without the need of a backend server. Live demo @ <http://auth0.github.io/auth0-s3-sample/>

---

In the past, we've talked about how it's becoming so much easier to write client side apps that are still fully secure thanks to JSON Web Tokens: ([Cookies vs Tokens](blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token), [Token-based auth with socket.io](http://blog.auth0.com/2014/01/15/auth-with-socket-io/) and [10 things you should know about tokens](http://blog.auth0.com/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/)).

In this article, we will show how to use AWS APIs from the client side, without the need to go through a server. The process is illustrated in the following diagram:

<div style="text-align: center"><img src="https://docs.google.com/drawings/d/1rSJuRdQFkLcKtz6pqcxwRxfzguj_YQs8TEfoCLSiRlk/pub?w=501&amp;h=568"></div>

1. The user logs in and gets a JSON Web Token (JWT)
2. Gets AWS Token (Temp Credentials) using the JWT
3. Call the AWS API using the the AWS Token

We are assuming you have an AWS account and Auth0 account.

## 1. The user logs in and gets a JWT

First, we initialize the JavaScript login widget and call `.signin`.

      var widget = new Auth0Widget({ domain: 'yours.auth0.com', clientID: 'your-client-id', callbackURL: 'your-callback-url' });

      widget.signin();

The login result comes in the `location.hash`. The `getProfile` method will return the profile and JWT and we store those in local storage.

    widget.getProfile(location.hash, function (err, profile, id_token) {
      store.set('profile', JSON.stringify(profile));
      store.set('id_token', id_token);

      location.href = 'files.html'
    });

## 2. Get AWS Temp Credentials using the JWT

After the user is logged in, Auth0 will send you a JSON Web Token (JWT). We then use the `/delegation` endpoint in Auth0 to exchange the JWT (`id_token`) obtained in step 1 for an AWS token. Behind the scenes, the Auth0 server will call AWS IAM APIs to perform this.

Here's the code:

      var aws_arns = { 
          role: 'arn:aws:iam::account_number:role/role_name', 
          principal: 'arn:aws:iam::account_number:saml-provider/provider_name' 
      };

      var aws_creds;
      auth0.getDelegationToken('.. client_id ..', store.get('id_token'), aws_arns, function(err, result) {
         aws_creds = result.Credentials; // AWS temp credentials
      });


> The `role` and `principal` are values you get from AWS IAM console. You have to do a one-time configuration to add Auth0 as an identity provider, and create a role and a policy. More details here <https://docs.auth0.com/aws-api-setup>. 

As an example, this policy gives permission to do everything on an S3 folder under a bucket. The name of the folder gets resolved at runtime depending on the contents of the JSON Web Token. The `user_id` in the JWT will be replaced as the name of the folder (`${saml:sub}` is a placeholder for the `user_id`).

![](https://docs.auth0.com/img/aws-api-setup-9.png)

### 3. Upload file using AWS Session Token

Here we set the `bucket.config.credentials` with the AWS Token we've got on Step 2 (`aws_creds`) and call `putObject` using the `user_id` as part of the S3 path.

    bucket.config.credentials = new AWS.Credentials(aws_creds.AccessKeyId,
                                                    aws_creds.SecretAccessKey,
                                                    aws_creds.SessionToken);

    bucket.putObject({ Key: folder_prefix + user_id + '/' + file.name, 
                       ContentType: file.type, 
                       Body: file, 
                       ACL: 'private'}, callback);

We are using the [AWS JavaScript SDK](https://github.com/aws/aws-sdk-js).

Here is a short video showing the whole process:

<div style="text-align: center">
<a href="http://cloudup.com/iC6DMMtQmRE" target="_new">
<video id="awsvideo" loop="">
  <source src="http://i.cloudup.com/transcoded/nPO3q3LWIn.mp4">
  <img src="http://cloudup.com/iC6DMMtQmRE+">
</video>
</a>
</div>

<div class="try-banner try-code" style="margin: 0">
    <a href="https://github.com/auth0/auth0-s3-sample" target="_new" class="btn btn-default btn-lg"><i class=" icon-1392070209-icon-social-github icon"></i>Code</a>
    <a href="http://auth0.github.io/auth0-s3-sample/" target="_new" class="btn btn-default btn-lg"><i class=" icon-budicon-698 icon"></i>Demo</a>
</div>

## AWS APIs supported

This technique could be also used for any AWS API, besides S3:

* [Fine Grained Access Control with DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/FGAC_DDB.html)

* [Controlling Access to Amazon EC2 Resources](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/UsingIAM.html)

For a complete list of AWS services theta support IAM policies see: <http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_SpecificProducts.html>

Finally, AWS recently announced their support for [Creating Temporary Security Credentials for Mobile Apps using Google, Facebook or Amazon Login](http://docs.aws.amazon.com/STS/latest/UsingSTS/CreatingWIF.html). That works similarly to what we are showing here, however it only supports these 3 identity providers: Amazon, Facebook and Google. With Auth0 you can expand this to work with  any identity provider: your own username/passwords, enterprise credentials or a long list of social providers.

Tokens FTW!
