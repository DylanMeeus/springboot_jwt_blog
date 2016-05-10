---
layout: post
title: "How Fingerprint Authentication Gives You High Security And Low Friction"
description: Implement fingerprint authentication to allow users easy access to apps while still keeping them secure
date: 2016-05-10 8:30
author:
  name: Diego Poza
  mail: diego.poza@auth0.com
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design: 
  bg_color: "#353F4A"
  image: "https://cdn.auth0.com/blog/account-kit-passwordless/account-kit-hero.png"
tags: 
- fingerprint authentication
- passwordless
- step-up authentication
---

## Why Use Fingerprint Authentication

Modern security is a battle between high security and low friction. Developers want users to use unique, complicated passwords for their apps to increase security. Users, faced with the challenge of remembering a number of different passwords, want to use the simplest password or passcode possible. This makes it easier to remember, and makes access to the app or site quicker, but is fatal for online security.

One way to combine both performance and security is to take advantage of fingerprint sensors that are now prevalent on high-end smartphones and other mobile devices. Fingerprints have a number of benefits over passwords:

* **Performance:** Modern capacitive touch fingerprint sensors (such as the Touch ID sensor on the latest Apple iPhones and sensors on recent Android devices) recognize the fingerprint and unlock in less than a second, quicker than inputting an extensive password.
* **Security:** Fingerprints are unique (even among identical twins), impossible to guess, and difficult to fake without significant effort. Modern fingerprint authentication uses the fingerprint to create an encrypted key, which is sent for server authentication.
* **Permanence:** Complex passwords are hard to remember, leading to the majority of people reusing passwords on multiple sites. As a physical feature, fingerprints are unforgettable.

## The History of Fingerprint Authentication

Fingerprint sensors are not new. They have been used as security devices on laptops for more than a decade, and on electronic door locks before that. There are currently over 180 mobile devices available with fingerprint recognition capabilities, and have been present on mobile devices for more than a decade:

* **First mobile device with a fingerprint sensor:** The [HP iPAQ Pocket PC h5500](http://www.engadget.com/products/hp/ipaq/h5500/series/specs/), initially released in 2003, running Windows Mobile.
* **First cell phones with a fingerprint sensor:** The Toshiba [G500](http://www.gsmarena.com/toshiba_g500-1904.php) and [G900](http://www.gsmarena.com/toshiba_g900-1905.php), launched in early 2007. These also ran on Windows Mobile 5.0 and 6.0, respectively.
* **First touchscreen smartphone with a fingerprint sensor:** [Motorola Atrix 4G](http://www.gsmarena.com/motorola_atrix_4g-3708.php), released in 2011, running Android 2.3.

In 2013, Apple released the iPhone 5S, which included their Touch ID fingerprint recognition system. Touch ID differed from previous systems because it could be used to both unlock the phone and authenticate App Store and iTunes purchases. Now most flagship devices from manufacturers include fingerprint sensors, and Android 6.0 (“Marshmallow”) includes native support for fingerprint recognition.

## How Fingerprint Authentication Works

You can authenticate users with Touch ID with Auth0. The fingerprint itself is never sent. Instead when a user signs up and elects to use fingerprint authentication, the library will generate a key pair on the device, a public key and a private key. The user will be created in Auth0, the public key will be registered for the user, and the private key is stored in the keystore of the device.

![How Fingerprint Authentication works](https://cdn.auth0.com/blog/fingerprint-auth/passwordless-touchid-flow.png)

When a user tries to authenticate with a valid fingerprint:

* Touch ID retrieves the private key from the keystore
* A JSON Web Token is Created
* This JWT is then signed with the private key
* The app sends this signed JWT to Auth0
* Auth0 returns an `id_token`, the user profile and, optionally, a `refresh_token`

## When You Can Use Fingerprint Authentication

There are 3 easy ways use fingerprint authentication in your authentication workflow:

### Passwordless authentication

[Passwordless](https://auth0.com/passwordless) authentication allows users to log in without a password. Usually this is achieved by sending a *magic link *through SMS or email. The user can click on the link on their device and will be automatically logged in to the app.

![Passwordless Authentication](https://cdn.auth0.com/blog/fingerprint-auth/passwordless-authentication.png)

Instead of sending a magic link via SMS or email, fingerprint authentication through Touch ID can also be used to authenticate the user.

### Multifactor authentication (MFA)

[MFA](https://auth0.com/docs/multifactor-authentication) allows for increased security by requiring users to present more than one piece of identifying information. Usually this is a mobile device itself—the user inputs their password into an app as the first authentication, then uses an additional layer of security such as a code generated by Google Authenticator tied to their smartphone as the second piece of authentication.

However, you can also use fingerprint recognition as the second level of authentication. Users input their password, but then also have to present their fingerprint to verify their identity.

### Step-up authentication

Step-up authentication is also a multiple step authentication process, but one where an additional level of authentication is required to access different levels of resources. A user can sign into the regular app with their username and password, but if they try to access a restricted part of the app or site, they are required to present further authentication information, such as a fingerprint.

## Implementing Fingerprint Authentication in Auth0

Implementing fingerprint authentication for Passwordless is easy with Auth0. All that is needed is to flip a switch in Dashboard → Connections → Passwordless:

![Passwordless Connections](https://cdn.auth0.com/blog/fingerprint-auth/passwordless-connections.png)

or you can use Lock code for implementation:
```js
let lock = A0Lock(clientId: "YOUR_CLIENT_ID", domain: "YOUR_DOMAIN")
let controller = lock.newTouchIDViewController()
lock.onAuthenticationBlock = {(profile: A0UserProfile!, token: A0Token!) -> () in
    // Do something with token & profile. e.g.: save them.
    // Lock will not save the Token and the profile for you.
    // And dismiss the UIViewController.
    self.dismissViewControllerAnimated(true, completion: nil)
}
lock.presentTouchIDController(controller, fromController: self)
```

Fingerprint authentication is not currently part of the in-built capabilities of MFA and Step-up. However, Auth0’s flexible [rules execution pipeline](https://auth0.com/docs/rules) makes it easy to use these passwordless authentication methods as part of an MFA flow. 

Rules are snippets of JavaScript that execute on the Auth0 server as part of the authentication pipeline and give you the flexibility to call APIs or perform arbitrary computations in order to implement customized authentication logic. 

Simply call the passwordless connection using a redirect rule, and treat it as a [custom MFA provider](https://auth0.com/docs/mfa). 
