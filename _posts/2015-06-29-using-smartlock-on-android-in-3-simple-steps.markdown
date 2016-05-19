---
layout: post
title: "Using Smart Lock on Android in 3 simple steps"
description: In this tutorial, learn how to use Google Smart Lock, a service that makes handling user's credentials on Android a pain-free process.
date: 2015-06-29 22:16
author:
  name: Hernan Zalazar
  url: "https://twitter.com/hzalaz"
  mail: "hernan@auth0.com"
  avatar: "https://www.gravatar.com/avatar/b93af62499ed0f76f280acb37913f15d.png?size=200"
design: 
  bg_color: <A HEX BACKGROUND COLOR>
  image: https://cdn.auth0.com/blog/smart-lock/smart-lock.png
tags: 
- android
- smart-lock
- password-manager
- 1password
- lastpass
- auth0
- lock
- github
- sample
- tutorial
related:
- 2016-02-08-how-to-authenticate-on-android-using-social-logins
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2016-02-18-ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt
---

----

**TL;DR:** Get a sample Android app with Smart Lock configured and ready to use from [this Github repository](https://github.com/auth0/Lock-SmartLock/tree/master/app).

----


Members of our team participated in the last Google I/O to learn about the latest trends. There were a lot of cool new things announced, but these two particularly caught our eyes: **Android Fingerprint Support** & **Smart Lock for Passwords**. In this blog post, we’ll focus on the latter.

**Smart Lock for Passwords** is a service that makes handling your user’s credentials a pain-free process. It also allow friction-free log-in and sign-up for your web & Android apps. In other words, the idea is that you never have to remember your passwords again :). Have you heard about [1Password](https://agilebits.com/onepassword) or [LastPass](https://lastpass.com/)? Well, imagine that, but from Google.

If you’re writing a WebApp, password management can be handled by Chrome itself. However, for Android apps. you need to do some extra work to add it. After playing around with the samples, we decided that it would be great to integrate it with our **Lock for Android** to make it even easier to authenticate your users and keep their credentials safe. With that in mind, we created a new library [Lock-SmartLock](https://github.com/auth0/Lock-SmartLock). In this blog post, we’ll learn how to use it!

<!-- more -->

## Before we start

First, you need to make sure you have updated *Google Play services* in your Android SDK installation. (You can update it using Android SDK Manager)

Then, follow [this guide](https://developers.google.com/identity/smartlock-passwords/android/get-started#configure_your_console_name_project) to configure your [Google Developers Console](https://console.developers.google.com/) project and associate it with your Android application so it can use SmartLock API.

> In order to use **Lock-SmartLock**, you’ll need to create an Auth0 application. You can create one from [the Auth0 dashboard](https://manage.auth0.com/#/applications)

## Let’s add Lock & SmartLock

### Configuring Lock-Smartlock

First, add **Lock-SmartLock** to your `build.gradle` file.

```gradle
compile ‘com.auth0.android:appcompat-v7:22.2.0’
```

Then, in your `res/values` folder, create a resource file named `auth0.xml` that will include your Auth0 credentials:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="auth0_client_id">{YOUR_CLIENT_ID}</string>
    <string name="auth0_domain_name">{YOUR_DOMAIN}</string>
    <string name="auth0_scheme">a0{YOUR_CLIENT_ID_LOWERCASE}</string>
</resources>
```

In order to authenticate the user, **Lock** needs access to the Internet. Let’s request that permission in your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### Implementing Lock-Smartlock
Now it’s time to register **Lock for Android** and **Google Play services** for your application in your `AndroidManifest.xml`:

```xml
  <!--Auth0 Lock-->
  <activity
      android:name="com.auth0.lock.LockActivity"
      android:theme="@style/Lock.Theme"
      android:label="@string/app_name"
      android:screenOrientation="portrait"
      android:launchMode="singleTask">
      <intent-filter>
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <category android:name="android.intent.category.BROWSABLE"/>
          <data android:scheme="@string/auth0_scheme" android:host="@string/auth0_domain_name"/>
      </intent-filter>
  </activity>
  <meta-data android:name="com.auth0.lock.client-id" android:value="@string/auth0_client_id"/>
  <meta-data android:name="com.auth0.lock.domain-url" android:value="@string/auth0_domain_name"/>
  <!--Auth0 Lock End-->

  <meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />
```

Then, we need to create a custom class that extends from `android.app.Application` and implements `LockProvider`. In this class, we’ll create an instance of `SmartLock` and store it so that we can use it from any `Activity`.

```java
public class MyApplication extends Application implements LockProvider {

    private Lock lock;

    @Override
    public void onCreate() {
        super.onCreate();
        lock = new SmartLock.Builder(this)
                .loadFromApplication(this)
                .build();
    }

    @Override
    public Lock getLock() {
        return lock;
    }

}
```

> Remember to register this class as your application class in the `AndroidManfifest.xml`, too.
 
Then, in the Activity that will trigger authentication, override the following lifecycle callbacks that will allow **Lock** to interact with **Smart Lock**:

```java
@Override
protected void onStart() {
    super.onStart();
    SmartLock.getSmartLock(this).onStart();
}

@Override
protected void onStop() {
    super.onStop();
    SmartLock.getSmartLock(this).onStop();
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    SmartLock.getSmartLock(this).onActivityResult(this, requestCode, resultCode, data);
}
```

> The layout of the Activity is up to you; we only need a way to trigger the authentication (either a button or automatically from code).

Then, we need to create a `BroadcastReceiver` to handle the events broadcasted by **Lock** when the user authenticates:

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    //... Setup your Activity
    broadcastManager = LocalBroadcastManager.getInstance(this);
    broadcastManager.registerReceiver(authenticationReceiver, new IntentFilter(Lock.AUTHENTICATION_ACTION));
}

@Override
protected void onDestroy() {
    super.onDestroy();
    //... Clean up your Activity
    broadcastManager.unregisterReceiver(authenticationReceiver);
}

private BroadcastReceiver authenticationReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
        UserProfile profile = intent.getParcelableExtra(Lock.AUTHENTICATION_ACTION_PROFILE_PARAMETER);
        Token token = intent.getParcelableExtra(Lock.AUTHENTICATION_ACTION_TOKEN_PARAMETER);
    }
};
```

Finally, in order to authenticate the user, you just call the following method method inside your Activity

```java
SmartLock.getSmartLock(this).loginFromActivity(this);
```

Connect your device, and run the app. You’ll see something like this:

![smartlock-android](https://cdn.auth0.com//blog/smartlock-android.gif)

That’s it all, you have successfully integrated **Auth0** and **SmartLock**!

Congrats ;)


