---
layout: post
title: "Implementing Social Logins on Android: Google, Facebook, Twitter and Instagram"
description: "Learn how to implement social logins with different popular providers on Android"
date: 2016-02-05 13:30
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#2E2E2C"
  image: https://cdn.auth0.com/blog/jsleaks/logo.png
  image_size: "100%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- android
- social login
- facebook
- facebook login
- google
- google login
- twitter
- twitter login
- instagram
- instagram login
- single sign on
- sso
- native login
- oauth
- oauth2
---

In this article we will go through four popular social login providers and learn how to implement them on Android. Read on!

-----

## Introduction
Have you ever wanted to get rid of that cumbersome step of telling your users to create a user profile? Have you ever as a user closed a window or an app due to the tediousness of the sign-up step? Then *social login* is for you. *Social login* allows third-party applications to authenticate using the credentials from popular social networks. In other words, rather than forcing users to create a new profile, remember a new password and fill-in all the required details, you can just point them to the login screen of your selected provider and, after a successful authentication step, get all the needed details from that provider. Easier for users AND easier for developers, a combination rarely seen in software development.

Almost every major social network provides an API to allow application developers to authenticate users using their systems. In this article we will focus on the four major social login providers: Google, Facebook, Twitter and Instagram.

### Single-sign-on, OAuth2 and social logins
Related to social login is the concept of [single-sign-on](https://auth0.com/blog/2015/09/23/what-is-and-how-does-single-sign-on-work/). Single-sign-on allows users visiting different domains to remain logged-in using the same credentials. One can easily picture how social logins can help in doing this: by authenticating using a third-party service, different domains can share user information.

Many social login providers opt to provide a standardized way to authorize access to their login services through the [OAuth2 standard](https://en.wikipedia.org/wiki/OAuth). OAuth2 specifies a series of operations that clients can perform against an authorization server. It is the authorization server's job to issue tokens (pieces of information) that can later be used by these clients to access protected resources. In the case of social logins, protected resources are user profiles and other data associated with them. Although the use of OAuth2 for certain tasks has been criticized by various parties, it remains the most common standard for social logins.

In the case of our four providers, all of them provide OAuth-based APIs. Twitter in particular relies on OAuth 1.0a, while other providers use OAuth 2.0. For the purposes of this post however, we will prefer the official native Android libraries of each provider (except for Instagram, for which there is no official Android lib).

## Requirements and Setup
For our examples we will use the latest version of [Android Studio](http://developer.android.com/sdk/index.html?gclid=CPuHoojk3soCFQkFkQodRo8KVw), the official Android IDE. Go to the site, and follow the install instructions for your platform.

> TL;DR: [Grab the full code]() for our examples.

All our examples should work on recent versions of Android. We picked Android 5.0 as base, but older versions should work as well.

### Create our sample application
In Android Studio, go to `File` -> `New Project` and follow the wizard. When asked about the main screen, select an *Empty Activity*. Call this activity `LoginActivity`.

![Android Studio New Project Wizard]()

### Setup the emulator
After the wizard is done, it should be possible to run the example using the emulator. If you haven't done so, setup an emulator supporting Google Services (this is required). Go to `Tools` -> `Android` -> `AVD Manager` -> `Create Virtual Device`. Create a device supporting *Google Play*. Pick a device that can be accelerated by your platform (x86) and enable GPU acceleration (`Use Host GPU`). This will ensure the best possible experience for our tests.

![AVD Manager new device wizard]

It is now time to run the sample app using the emulator. If everything goes well you should see something like this:

![Sample app on emulator]

## Step-by-step implementations
Now we are all set to start integrating our social logins into our app. Let's dive in:

### Facebook
Facebook provides a native Android SDK to use its services, let's see how to get it integrated:

#### 1. Setup the Repository and Dependencies
On Android Studio's sidebar look for the `build.gradle` file associated to the project and add the following line:

```groovy
buildscript {
    repositories {
        // (...)
        mavenCentral() // <-- add this line
        // (...)
    }
    // (...)
}
```

Then go to the `build.grade` file for your *app module* and add the following dependency:

```groovy
dependencies {
    // (...)
    compile 'com.facebook.android:facebook-android-sdk:4.6.0'
    // (...)
}
```

#### 2. Tell Facebook About Your App
Facebook's backend needs to know about your application. Go to [https://developers.facebook.com/apps](https://developers.facebook.com/apps) and click `Add a New App`, then follow the wizard:

![Facebook login: setting app and activity names]()

If you are familiar with Android development, you know applications are [digitally signed](http://developer.android.com/tools/publishing/app-signing.html). If not, what you need to know is that there two types of signatures: release and development signatures. Release signatures are used when you publish to the Google Play Store. Development signatures are used otherwise. In this case we are using our development signature. To get it, run the following code in your terminal (the default keystore password is `android`):

```sh
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

Input the generated hash code in the form and click next.

![Facebook login: setting the signature hash code]()

You can safely ignore what follows in the Facebook app wizard. Now go to [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/) and copy your app id to the clipboard.

#### 3. Setup the SDK in your Android Project
Add your Facebook App ID to your string resources file (`string.xml`) as `facebook_app_id`. Then edit your `AndroidManifest.xml` file to add:
- The necessary permissions (`uses-permission`).
- The Facebook app id as metadata (`meta-data` tag).
- The Facebook activity.

```XML
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="auth0.com.socialloginsample">
    (...)

    <uses-permission android:name="android.permission.INTERNET"/>

    (...)

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>

        (...)

        <activity android:name="com.facebook.FacebookActivity"
                android:configChanges=
                    "keyboard|keyboardHidden|screenLayout|screenSize|orientation"
                android:theme="@android:style/Theme.Translucent.NoTitleBar"
                android:label="@string/app_name" />

        (...)

    </application>

    (...)    
</manifest>
```

#### 4. Add the Facebook Login Button
The Facebook SDK for Android comes with a convenient button that can be added easily to our activities. Open `activity_login.xml` with the text editor. Add a `LinearLayout` element and put the Facebook button in it:

```XML
<LinearLayout
    android:id="@+id/email_login_form"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">            

    <com.facebook.login.widget.LoginButton
        android:id="@+id/facebook_sign_in_button"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="15dp"
        android:layout_marginBottom="10dp"
        android:layout_gravity="center_horizontal" />

    (...)

</LinearLayout>
```

#### 5. Bind Everything With Code
First, do the necessary SDK initialization in your app's main activity `onCreate` method:

```Java
public class LoginActivity extends AppCompatActivity {    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FacebookSdk.sdkInitialize(getApplicationContext());
        mFacebookCallbackManager = CallbackManager.Factory.create();

        // This MUST be placed after the above two lines.
        setContentView(R.layout.activity_login);

        // (...)
    }

    // (...)
}
```

Setup the callback for button (inside `onCreate` might be a good choice as well):

```Java
public class LoginActivity extends AppCompatActivity {    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // (...)

        mFacebookSignInButton = (LoginButton)findViewById(R.id.facebook_sign_in_button);
        mFacebookSignInButton.registerCallback(mFacebookCallbackManager,
            new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(final LoginResult loginResult) {
                    //TODO: Use the Profile class to get information about the current user.
                    handleSignInResult(new Callable<Void>() {
                        @Override
                        public Void call() throws Exception {
                            LoginManager.getInstance().logOut();
                            return null;
                        }
                    });
                }

                @Override
                public void onCancel() {
                    handleSignInResult(null);
                }

                @Override
                public void onError(FacebookException error) {
                    Log.d(LoginActivity.class.getCanonicalName(), error.getMessage());
                    handleSignInResult(null);
                }
            }
        );
    }

    // (...)
}
```

Lastly, the proper callback must be bound in the `onActivityResult` callback:

```Java
@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    // (...)

    mFacebookCallbackManager.onActivityResult(requestCode, resultCode, data);
}
```

That's it! In the `handleSignInResult` method of your activity you can do as you please (usually show another activity or do some operation with the information from the current user).

### Google
As expected, Google provides a native Android SDK to handle logins. Let's see how we can add it to our existing app.
