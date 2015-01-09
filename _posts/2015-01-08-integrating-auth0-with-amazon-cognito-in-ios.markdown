---
layout: post
title: "Integrating Auth0 with Amazon Cognito in iOS"
date: 2015-01-08 12:27
author:
  name: "Martin Gontovnikas"
  url: https://twitter.com/mgonto
  mail: martin@gon.to
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764?size=200
tags:
- cognito
- ios
- authentication
- backendless
- lock
- IAM
- amazon
---
---

> TL;DR: You can get a working sample that uses Auth0, Cognito, and iOS in [this Github repository](https://github.com/auth0/Lock.iOS-OSX/tree/master/Examples/Cognito.Swift)

---
We’ve come to an era where a critical component of a solution is providing a fantastic experience for the user. The focus is now on the client: web or native. But all powerful apps need a backend, which usually mean servers you run that expose an API.  However, it is now possible to securely interact with services like Amazon Cognito, Firebase, and others directly from the client code, with no server of your own.


In this post, I’ll explain how you can integrate your mobile app with two solutions: Auth0 to get authentication with either [Social Providers](https://auth0.com/docs/identityproviders#2) (Facebook, Twitter, etc.), [Enterprise providers](https://auth0.com/docs/identityproviders#1) or regular Username and Password, and [Amazon Cognito](http://aws.amazon.com/cognito/), to get a backend for your app without writing a line of code

<!-- more -->

## Configuring Amazon Web Services
### Create a new OpenID Connect Provider
The first step is to create an OpenID Connect Provider pointing to your Auth0 account. Please take a note of your auth0 domain (_accountName_.auth0.com) and your _clientId_ and use them to create the Identity Pool in the [IAM Console](https://console.aws.amazon.com/iam/home)

![IDP Creation](https://cdn.auth0.com/blog/IDPCreation.gif)


### Create a Cognito Identity Pool
Now, you need to create an Identity Pool in [Cognito Console](https://console.aws.amazon.com/cognito/home). This will be used to login to Amazon Cognito using the Auth0’s Identity Provider that you created in the previous step.

![Cognito Pool Creation](https://cdn.auth0.com/blog/IDPCognito.gif)

> Please take a note of the ARN selected in the end of the gif. We’ll use it later on!

### Grab the Role ARN
Finally, grab the ARN of the role that was automatically created in the previous step from the [IAM console](https://console.aws.amazon.com/iam/home).

![Grab Role ARN](https://cdn.auth0.com/blog/Roles.gif)

## Code time!
Now it’s time to start coding our app. In this case, we’ll be using Swift, but the same sample applies to Objective C as well.

### Adding the Needed Dependencies

Add the following dependencies to your `Podfile`

````ruby
target "SwiftSample" do
  pod "Lock", "~> 1.7", :inhibit_warnings => true
  pod "JWTDecode", "~> 0.2"
  pod "SimpleKeychain", "~> 0.2"
  pod 'AWSCognitoSync', "~> 1.0"
end
````
### Logging the User In
We’ll use [Auth0 Lock for iOS](https://github.com/auth0/lock) to log the user in. You can read detailed instructions on how to implement it in [this documentation page](https://auth0.com/docs/native-platforms/ios-swift).
Once the user is successfully logged in with Auth0, we’ll send his or her credentials to Amazon Cognito:

````swift
let authController = A0LockViewController()
authController.onAuthenticationBlock = {(profile:A0UserProfile!, token:A0Token!) -> () in
  // Save Tokens and Credentials into the keychain as you'd regularly do
  // ...

  let provider = AWSCognitoCredentialsProvider.credentialsWithRegionType(
    AWSRegionType.USEast1,
    // Your AWS Account ID
    accountId: Constants.AWSAccountID.value,
    // This is the ARN from Cognito Identity Pool
    identityPoolId: Constants.CognitoPoolID.value,
    unauthRoleArn: '',
    // This is the ARN from the Role
    authRoleArn: Constants.CognitoRoleAuth.value);


  let configuration = AWSServiceConfiguration(region: AWSRegionType.USEast1, credentialsProvider: self.provider);
  AWSServiceManager.defaultServiceManager().setDefaultServiceConfiguration(configuration)

  // Set here the Auth0 URL you've set when creating the OpenID Connect Provider
  provider.logins = ['samples.auth0.com': token.idToken]
  self.provider.getIdentityId().continueWithBlock { (task: BFTask!) -> AnyObject! in
      self.provider.refresh()
      if (task.error != nil) {
          // Fail
      } else {
          // Logged in with Cognito successfully
      }
      return nil
  }
}
````

### Using Cognito

Now, the user is logged in to Cognito through Auth0. You can now store information in Cognito that only this user will be able to use.

````swift
let cognitoSync = AWSCognito.defaultCognito()
let dataset = cognitoSync.openOrCreateDataset("MainDataset")
// Get an existing value
dataset!.synchronize().continueWithBlock { (task) -> AnyObject! in
    dispatch_async(dispatch_get_main_queue(), { () -> Void in
        self.textValue.text = dataset.stringForKey("value")
    })
    return nil
}

// Set a new value
dataset.setString(self.textValue.text, forKey: "value")
dataset.synchronize()
````
## Let’s see how it works!

![Cognito working](https://cdn.auth0.com/blog/CognitoSample.gif)

## Final Thoughts

That’s it! Now, your users can login with Github or any other identity provider using a native UI and save their information with Cognito easily.

You can check out a working sample that uses Cognito and Auth0 in [this Github repository](https://github.com/auth0/Lock.iOS-OSX/tree/master/Examples/Cognito.Swift)

Happy coding :).
