---
layout: post
title: "How to Implement a Slack-like Magic Link Login on iOS with Auth0"
description: "Take a look at one of the most convenient passwordless login strategies and implement it in your own iOS apps"
date: 2015-12-04 13:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#282722"
  image: https://cdn.auth0.com/blog/iosmagiclink/logo2.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- auth0
- passwordless
- passwordless-login
- login
- authentication
- email-login
- mail-login
- link-login
- magic-link
- ios
- iphone
- ipad
- slack
related:
- 2016-01-27-setting-up-passwordless-authentication-with-the-auth0-dashboard
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

In this post we will explore how to implement a Slack-like login strategy (email with a magic link) on iOS using our simple [Lock](https://github.com/auth0/Lock.iOS-OSX) library. At the end of this post you will also find a seed Xcode project written in Swift to get started as soon as possible. Read on!

-----

## Introduction
Passwordless login systems are convenient for end users: just remember your username, phone number or email and off you go. Passwordless systems usually require the user to manually input a code to validate their identity. This is no longer the case thanks to the advent of [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html). Once an **email with a link** is received by the user, he or she can simply **tap on the link and have the application take over**. And the cool things is: it is that easy.

![Slack-like magic link login](https://cdn.auth0.com/blog/iosmagiclink/slack_magiclink.jpg)

## Universal Links
Apple has long provided a way to *connect* applications through URLs: [URL schemes](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html#//apple_ref/doc/uid/TP40007072-CH6-SW1). URL schemes have their own set of issues such as [no fallback mechanism](http://stackoverflow.com/questions/6964515/launching-app-or-app-store-from-safari/6965646#6965646) and [URL scheme hijacking](http://stackoverflow.com/questions/33919058/prevent-ios-url-scheme-hijack). This has pushed Apple to develop a new and safer way to tell iOS when a link should be passed to an app installed on the device. This is known as [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).

Universal Links allow you to **register a series of domains** that are allowed to **interact with an installed application**. If the application is not installed, the universal link is opened with Safari, allowing you to inform the user of the existence of an application or whatever is necessary. To prevent other applications from taking control of this association, a special file, called the *association file*, must be uploaded to the domains that are registered as associated to an application. In this way, **the person or organization that controls the domain is the only one who can control the association between an application and a URL**.

Before diving straight into our example, if you are already familiar with our [Lock library](https://github.com/auth0/Lock.iOS-OSX) let me tell you won't need many changes to your code: it is just a matter of setting a few flags and settings. If you are not familiar with our library, [our docs provide an excellent introduction](https://auth0.com/docs/libraries/lock-ios). If it seems too daunting, don't worry, download the example from this post and use that as a starting point.

We will use our iOS passwordless email example as a base for the following steps. Get the [full code](https://github.com/auth0/Mobile-Samples.iOS), go to the `Passwordless-Email/Lock/Swift` folder and open the Xcode workspace.

## Step 1: Set your Auth0 client ID and domain
Open the `info.plist` file in Xcode and set your Auth0 client ID and domain in the list of properties. If don't have an Auth0 account, <a href="javascript:signup()">signup</a> and [create your first app](https://auth0.com/docs).

![Auth0 info.plist client ID and domain](https://cdn.auth0.com/blog/iosmagiclink/auth0-client-id-domain.png)

## Step 2: Enable passwordless logins using emails for your Auth0 app
Go to the [passwordless connections](https://manage.auth0.com/#/connections/passwordless) section in your Auth0 dashboard. Enable Email logins. The default settings are fine.

<video width="600" autoplay loop>
    <source src="https://cdn.auth0.com/blog/iosmagiclink/enable-email2.mp4" type="video/mp4">
    Your browser does not support the video embedded here, <a href="https://cdn.auth0.com/blog/iosmagiclink/enable-email2.mp4">download it instead</a>.
</video>

Once you have enabled e-mail logins, don't forget to enable the connection in your application's connections section (`Apps/APIs` -> `Your app name` -> `Connections` -> `Email`) if you haven't done so in the previous step.

## Step 3: Enable Universal Links support for your Auth0 app in Xcode
As universal links establish a **verified relationship between domains and applications**, both your Auth0 app settings and your iOS application need to be in sync. The only thing you need to setup in your Auth0 account is your iOS app's `team ID` and `bundle ID`. Unfortunately, we still don't have a proper dashboard UI to input this information, so for now it is necessary to add this information by making calls to our public API.

To find your Apple `team ID`, go to your [Apple developer account summary page](https://developer.apple.com/membercenter/index.action#accountSummary).

The application `bundle ID` is the one you set in your app's Xcode project settings:

![Xcode bundle ID](https://cdn.auth0.com/blog/iosmagiclink/bundle-id.png)

Once you have this information, get your Auth0 application `client ID` by going to the Auth0 dashboard and selecting your application.

![Auth0 client ID](https://cdn.auth0.com/blog/iosmagiclink/client-id.png)

You can now perform an API call to add the team and bundle ids to your Auth0 app. Go to [this page](https://auth0.com/docs/api/v2#!/Clients/patch_clients_by_id) and click on `Scopes -> update:clients`. Then input your Auth0 client ID in the `ID` form field. For the body use the following JSON snippet (replace the ellipses with your team ID and your bundle ID):

```JSON
{
    "mobile": {
        "ios": {
            "team_id": "...",
            "app_bundle_identifier": "..."
        }
    }
}
```

Now click on `try`. This will perform the actual call to our public API. If you get a HTTP 200 response everything went well.

<video src="https://cdn.auth0.com/blog/iosmagiclink/add-team-id-and-bundle-id2.mp4" width="600" autoplay loop>
    Your browser does not support the video embedded here, <a href="https://cdn.auth0.com/blog/iosmagiclink/add-team-id-and-bundle-id2.mp4">download it instead</a>.
</video>

To test this, check whether the universal links apple app site association file is available for your application. Go to your browser and open: `https://YOURACCOUNT.auth0.com/apple-app-site-association` (replace `YOURACCOUNT` with your Auth0 account name).

You should see something like this (formatted for readability):

```JSON
{
	"applinks": {
		"apps": [],
		"details": [{
			"appID": "86WQXF56BC.com.auth0.Passwordless-Email",
			"paths": ["/ios/com.auth0.Passwordless-Email/*"]
		}]
	}
}
```

## Step 4: Setup Universal Links domains for your iOS app
iOS needs to know what domains are handled by the application. To do this:

1. Go to your project's Xcode settings and enter the `capabilities` tab.
2. Find `Associated Domains` in the list and enable it
3. Click on the plus sign and add your Auth0's app domain. In my case that would be: `applinks:speyrott.auth0.com` (change `speyrott` for your username, the word `applinks` must be kept as-is).

![Universal Links Domains in Xcode](https://cdn.auth0.com/blog/iosmagiclink/associated-domains-2.png)

## Step 5: Pass all relevant callbacks to the Auth0 Lock library
If you followed our [Lock library guide for iOS](https://auth0.com/docs/libraries/lock-ios) this will probably be already in place. If not, go to your `AppDelegate` class and pass the following callbacks to Auth0's Lock:

```Swift
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        A0Lock.sharedLock().applicationLaunchedWithOptions(launchOptions)
        return true
    }

    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
        return A0Lock.sharedLock().handleURL(url, sourceApplication: sourceApplication)
    }

    func application(application: UIApplication, continueUserActivity userActivity: NSUserActivity, restorationHandler: ([AnyObject]?) -> Void) -> Bool {
        return A0Lock.sharedLock().continueUserActivity(userActivity, restorationHandler:restorationHandler)
    }
}
```

## Step 6: Tell the Lock library you want to use the 'magic link' login strategy
Our Lock library handles the login flow. To tell it to use a magic link instead of a code, do the following before presenting the relevant view controller from the Lock library:

```Swift
let lock = A0Lock.sharedLock()
let controller = lock.newEmailViewController()

controller.useMagicLink = true // <--- ENABLE MAGIC LINKS!

controller.onAuthenticationBlock = { (profile, token) in
    // Do something with profile and token if necessary
    self.dismissViewControllerAnimated(true, completion: { self.performSegueWithIdentifier("UserLoggedIn", sender: self) })
}
lock.presentEmailController(controller, fromController: self)
```

This code is meant to be placed in a view controller that presents the login screen. When the login screen is to be presented, the code above is run. The call to `newEmailViewController` creates an email login view controller. Setting the `useMagicLink` variable to true tell the email view controller to favor the use of a magic link rather than a code. As you can see, the whole process and UI is encapsulated in the Lock library.

That's it! Now run the application on an actual device and see if it works. You will need to supply a working email to test it.

<video src="https://cdn.auth0.com/blog/iosmagiclink/auth0-login3.mp4" width="600" autoplay loop>
    Your browser does not support the video embedded here, <a href="https://cdn.auth0.com/blog/iosmagiclink/auth0-login3.mp4">download it instead</a>.
</video>

> - Universal Links DO NOT work on iOS simulators. You need an actual iOS-enabled device to test this. Standard manual code input logins are supported.
> - Do not use the Gmail app to open the email with the link. At the moment, Gmail opens the links internally or with the help of Google Chrome, entirely bypassing the detection of the Universal Link by iOS.

Get the [full code](https://github.com/auth0/Mobile-Samples.iOS) to our seed project. Other mobile examples and an Objective-C version of this seed project can be found in the same repository.

## Conclusion
Universal Links get rid of the old URL schemes inefficiencies. Furthermore, passwordless logins through email are a convenient strategy. By removing the step of manually inputting the code the result is a pretty straightforward login process. And thanks to the Lock library, adding this to your application can be done in a matter of minutes. Hack away!

{% include tweet_quote.html quote_text="Universal Links get rid of the old URL schemes inefficiencies." %}
