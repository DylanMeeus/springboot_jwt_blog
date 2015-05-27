---
layout: post
title: "SimpleKeychain: A keychain library with iOS 8 &amp; TouchID support"
date: 2014-10-27 13:09
outdated: true
author:
  name: Hernan Zalazar
  url: "https://twitter.com/hzalaz"
  mail: "hernan@auth0.com"
  avatar: "https://www.gravatar.com/avatar/b93af62499ed0f76f280acb37913f15d.png?size=200"
tags:
- ios
- touchid
- ios8
- keychain
- jwt
- sso
- shared
- accesibility options
---
A few weeks back we released **the first version of our native [iOS SDK](https://github.com/auth0/auth0.ios)** to help you add authentication to your app.

We needed a **Keychain library** that supported the following features:

* **TouchID Support**: An option to make a private keychain value only available if the user entered his fingerprint
* **Accessibility options**: An option to state wether the keychain value could be got if the iPhone is Locked, Unlocked or in which state
* **Shared Group**: We needed Shared Group support so that 2 different apps could share keychain values

As there was no library that fulfilled our needs, **we decided to build [SimpleKeychain](https://github.com/auth0/SimpleKeychain)**.

Let’s see some of the different use cases that we’ve created and used.

<!-- more -->

## How do I store a value (e.g. JWT Token) in the Keychain?

```objc
NSString *jwt = //user's JWT token obtained after login
[[A0SimpleKeychain keychain] setString:jwt forKey:@"auth0-user-jwt"];
```

```swift
let jwt = //user's JWT token obtained after login
A0SimpleKeychain.keychain().setString(jwt, forKey:"auth0-user-jwt")
```

## How do I share a value (e.g. JWT token) between different apps?

When you have a family of apps that need to share the same user session, you can use iOS Keychain Sharing to store the token. That token must be stored under the same Access Group.

First in one of your apps save the JWT token:

```swift
let keychain = A0SimpleKeychain.keychainWithService("Auth0", accessGroup: "ABCDEFG.com.mydomain.mysharegroup")
let jwt = //user's JWT token obtained after login
keychain.setString(jwt, forKey:"auth0-user-jwt")
```

Then, you obtain the token in the other app:

```swift
let keychain = A0SimpleKeychain.keychainWithService("Auth0", accessGroup: "ABCDEFG.com.mydomain.mysharegroup")
let jwt = keychain.stringForKey("auth0-user-jwt")
```

## How I can handle the accessibility of the items saved in the keychain?

If you want to restrict when the item can be retrieved (For example only when the iPhone is unlocked, or if you want the entry to be included in any backup) you need to specify the item accessibility before saving:

```objc
A0SimpleKeychain *keychain = [A0SimpleKeychain  keychain];
keychain.defaultAccessibility = A0SimpleKeychainItemAccessibleWhenUnlockedThisDeviceOnly;
NSString *jwt = //user's JWT token obtained after login
[keychain setString:jwt forKey:@"auth0-user-jwt"];
```

## How can I trigger TouchID prompt before accessing the Keychain?

With the release of iOS 8, a new feature was added in order to tie a Keychain item to the user's passcode or their fingerprints .In order to use this feature, you need to store the value with accesibility `A0SimpleKeychainItemAccessibleWhenPasscodeSetThisDeviceOnly` and using iOS 8 Keychain Access Control:

```swift
let keychain = A0SimpleKeychain.keychain()
keychain.defaultAccesiblity = .WhenPasscodeSetThisDeviceOnly
keychain.useAccessControl = true
let jwt = //user's JWT token obtained after login
keychain.setString(jwt, forKey:"auth0-user-jwt")
```

Then whenever you query for that item a prompt will appear and the user will have to enter their fingerprint or passcode:

```swift
let message = NSLocalizedString("Please enter your passcode/fingerprint to login with awesome App!.", comment: "Prompt TouchID message")
let keychain = A0SimpleKeychain.keychain()
let jwt = keychain.stringForKey("auth0-user-jwt", promptMessage:message)
```

This is just a glimpse of all that you can accomplish with [SimpleKeychain](https://github.com/auth0/SimpleKeychain).

Add it to your **Swift or Objective C** project now with CocoaPods and start using it!:


```ruby
pod 'SimpleKeychain', '~> 0.1'
```
