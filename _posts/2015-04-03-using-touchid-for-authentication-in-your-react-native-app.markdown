---
layout: post
title: "Using TouchID for Authentication in your React Native app"
description: "Use our React Native module to authenticate with TouchID."
date: 2015-04-03 17:47
author:
  name: Hernan Zalazar
  url: "https://twitter.com/hzalaz"
  mail: "hernan@auth0.com"
  avatar: "https://www.gravatar.com/avatar/b93af62499ed0f76f280acb37913f15d.png?size=200"
design:
  bg_color: "#31214D"
  image: https://cldup.com/PB1nDCYd0B.png
tags:
- ios
- touchid
- ios8
- keychain
- jwt
- react
- react-native
- component
- lock
related:
- 2015-04-09-adding-authentication-to-your-react-flux-app
- 2015-05-14-creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between
- 2015-08-25-logging-and-debugging-in-react-with-flux-replaying-your-users-actions
---

**TL;DR**: You can see a sample of how to use **TouchID with React Native** in **[this Github repository](https://github.com/auth0/Lock.ReactNative/tree/master/Example)**

<!-- more -->

A few days ago, Facebook finally made **React Native** available in [Github](https://github.com/facebook/react-native), so, like everybody else, we decided to give it a try.
After the usual “Hello, World” examples and test applications, we were pretty amazed at how easy it was to code a native app with Javascript.
This is when we decided to try implementing something a little more complicated like **TouchID authentication**.

We’ve checked React Native components and couldn’t find one that allows us to use TouchID, so we went back to _good ol’ Objective-C_ since there is no support for _Swift_ yet. We decided to code a [React Native Module](http://facebook.github.io/react-native/docs/nativemodulesios.html#content) that would allow everyone to use TouchID.
Here in Auth0, we've already implemented a TouchID authentication flow for [Lock](https://github.com/auth0/Lock.iOS-OSX#touchid). So we decided to reuse that library and wrap it in a React Native compatible library. In other words, we created [Lock.ReactNative](https://github.com/auth0/Lock.ReactNative) with all the necessary mappings to use Lock like this in your React Native app:

```js
Lock.show({
  connections: ['touchid'],
}, (err, profile, token) => {
  /** Handle Login */
});
```

In this article, we'll learn how you can use `Lock.ReactNative` in any new app you build to add authentication to it!

<!-- more -->


> Before starting, make sure you have React Native, Xcode and CocoaPods installed in your Mac. For that, you can use React Native’s [Getting Started Guide](http://facebook.github.io/react-native/docs/getting-started.html#content), and Cocoa Pod's [Getting Started Guide](http://guides.cocoapods.org/using/getting-started.html) as well.

## Project Creation & Configuration
### Installing the needed dependencies
Once our React Native app is created, we need to install LockReact as a dependency. For that, we'll use CocoaPods:

```bash
# Run in the React Native app's folder
pod init
```
Edit the `Podfile` content to look as follows:

```ruby
platform :iOS, '8.0'

target 'MyApp' do
  pod 'LockReact'
end
```
Finally, just install the dependencies and open the XCode Project:

```bash
pod install
open LockReact.xcworkspace
```

### Configuring Lock

Now, let's create an application in your [Auth0](https://manage.auth0.com/) account and copy the `clientId` and `domain` to the `Info.plist` file

![Create Auth0 account](https://cdn.auth0.com//blog/react-native-touchid/CreateApp.gif)

### Make your JS code be able to call a native component

Finally, we need to create an Objective-C class (LockReactModule in this case) that will allow your JS code to call Lock's native component:

![Create ObjectiveC class](https://cdn.auth0.com//blog/react-native-touchid/CreateClass.gif)

Now, paste the following code into the created classes:

```objc
// LockReactModule.h file
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface LockReactModule : NSObject<RCTBridgeModule>

@end
```

```objc
// LockReactModule.m file
#import "LockReactModule.h"
#import <LockReact/A0LockReact.h>

@implementation LockReactModule

- (void)show:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback {
  RCT_EXPORT(show);
  dispatch_async(dispatch_get_main_queue(), ^{
    A0LockReact *lock = [[A0LockReact alloc] init];
    [lock showWithOptions:options callback:callback];
  });
}

@end
```

## Authenticating with TouchID from JS

Now we're ready to write some JS code!. We want to show a simple UI like this:

![Sample app](https://cdn.auth0.com//blog/react-native-touchid/appImage.png)

### Implementing the UI

First, let's implement the base UI with a React component.

```js
// Imports go here
// ...

var LockReactApp = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please tap on 'Login with TouchID' to continue.
        </Text>
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.actionButton} onPress={this._onLoginTouchID}>
            <Text style={styles.actionButtonText}>Login with TouchID</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  _onLoginTouchID: function() {
    // Implement TouchID here
    console.log("Implement TouchID here!");
  }
});

// Styles go here
// ...
```

### Adding TouchID authentication with `Lock`
Now, we can just use `Lock` for TouchID authentication.

First, we require it:

```js
var Lock = require('NativeModules').LockReactModule;
```

Then, we call it from the `_onLoginTouchID` method:

```js
Lock.show({
  closable: true,
  authParams: {
    connection: 'Username-Password-Authentication',
  },
  connections: ['touchid'],
}, (err, profile, token) => {
  if (err) {
    console.log(err);
    return;
  }
  // Authentication worked!
  console.log('Logged in with TouchID!');
});
```

Refresh the app and boom!. Authenticating with TouchID now works.

![Working app](https://cdn.auth0.com//blog/react-native-touchid/AppFlow.gif)

Congrats, you've just added TouchID to your app with less than 20 lines of code :). If you want to see the full code of this sample app, you can go to [this github repository](https://github.com/auth0/Lock.ReactNative/tree/master/Example).

Happy hacking :)!
