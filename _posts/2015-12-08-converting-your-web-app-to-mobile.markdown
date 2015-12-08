---
layout: post
title: "Converting your web app into a multiplatform mobile app using Apache Cordova"
description: How you can effortlessly create your multiplatform application from a web application
date: 2015-12-08 16:15
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design: 
  bg_color: "#2C3946"
  image: https://cdn.auth0.com/blog/converting-your-app-to-mobile/logo.png
tags: 
- web apps
- mobile apps
- apache cordova
- cordova
---

---
**TL;DR:** Apache Cordova is a good option for those who already have a web application and want to port it to the different mobile platforms. This post show you how yo can do this, even if your app is already hosted and live. It also provides several tips on how to create a successful Cordova app.

---

Mobile applications is one of the fastest-growing categories in the mobility market today. If you already have a web application up and running and want to get on board with this trend, you can do it very quickly using Apache Cordova.

The promise of Cordova development is quite charming: you can use your existing HTML + JavaScript + CSS application to build cross-platform mobile applications for iOS, Android, Windows Phone, and other platforms.

## What is Apache Cordova?

[Apache Cordova](https://cordova.apache.org/) is a free and open-source platform for building native mobile applications using HTML, CSS, and JavaScript. This allows you to target multiple platforms with just one codebase.

Basically, Cordova is a wrapper, an application that has an embedded web browser where your web app is loaded.

 > **Note:** There is some confusion between Cordova and PhoneGap. Let's clarify this: Cordova is owned and maintained by Apache and will always be maintained as an open-source project. On the other hand, PhoneGap is a distribution of Cordova owned by Adobe which includes additional build services that may not be free. Currently, both have a very similar API. Unless you need one of the additional build services that PhoneGap provides, you should go with Cordova.

## Installing and setting up Apache Cordova

Before installing and running anything related to Cordova, you will need to install the SDK for each platform that you intend to build your application for. In this post we will focus on iOS and Android; nevertheless, the process for other platforms is quite similar.

You will need a Mac computer with [Xcode](https://developer.apple.com/xcode/download/) to specify iOS as the target platform, and the [Android SDK](http://developer.android.com/sdk/index.html) to target the Android platform.

> For instructions on downloading and configuring the Android SDK, go to the [Official Android SDK installation documentation](http://developer.android.com/sdk/installing/index.html).

First, install the Cordova command-line utility by running the following command:

```
npm install -g cordova
```

> If you are on a Mac computer, you must add `sudo` at the start of the aforementioned command.

Create a new Cordova project by running the following command, where `[your-app-name]` is the folder where the app will be created:

```
cordova create your-app-name com.example.myapp MyAppName
```

> The `create` command has three parameters: the first specifies the folder where the solution will be created, the second is a reverse domain-style identifier which must be unique, and the last one is the application display name. The last two paramenters can be omitted and configured later in the `config.xml` file.

Browse to the project folder to add the platforms that you want to support. To do this, once you are in the project foler, run the following command for each platform you want to add:

```
cordova platform add [platform]
```

Where `[platform]` can be:

- ios
- android
- windows
- wp8
- blackberry10
- firefoxos
- amazon-fireos

> If you want to check which platforms are available in your system, run `cordova platform ls`.

Each time you run the `platform add` command, it will add native files to build apps for the specified platform. After running the above command, you should find a folder named ios containing .xcodeproj files and a bunch of other files.

## Porting your web app to Cordova

In your project folder, you should find the `/www` directory. This is where your web app is located.

> For this example we used the TodoMVC Vanilla JavaScript example that you can download from [here](https://github.com/tastejs/todomvc/tree/master/examples/vanillajs). Remember to run `npm install` to get the app dependencies.

Your app's `index.html` body content goes into the body of `/www/index.html`. Perform these three simple steps to update it:

1. Update the **head** of the file carefully so as not to remove or modify Cordova's required meta tags, but add the elements necessary to your app. In this case, we added our app's title, CSS references, and the charset meta tag.
2. Update the **body** content with your app content. 
3. Add the references to your app's required .js files (typically, at the end of the _body_).

The `/js/index.js` includes functions that are required for Cordova. You just need to call your app init logic inside the **onDeviceReady** method, as shown in the example below:

```
var app = {
    initialize: function() { ... }    
    bindEvents: function() { ... }    

    onDeviceReady: function() {
        // Your app init code
        ...
    }
};

app.initialize();

```

> As the TodoMVC is very simple, just ensuring that the cordova.js and index.js files are executed before the app logic is sufficient. 

Finally, all the CSS files, images, and JavaScript files should be moved to the corresponding folder inside the `/www/` folder.

![Cordova app structure](https://cdn.auth0.com/blog/converting-your-app-to-mobile/cordova-app-structure.png)

### Add hosted webpage as an app

If your application is already hosted on a server, converting your web app is very easy independent of the framework and languages used to create it.

Add the **dialogs** and **network information** plugins to your application by running the following commands:

```
cordova plugin add cordova-plugin-dialogs

cordova plugin add cordova-plugin-network-information
```

To do it, after the **onDeviceReady** event occurs, just navigate to the URL of your hosted app, and that's it.

This is shown in the following code:

> Continuing with the ToDoMVC app sample, we added this code at the bottom of the `app.js` file.

```
 <script>
  function onDeviceReady() {
    if (navigator.connection.type == Connection.NONE) {
      navigator.notification.alert('An internet connection is required to continue');
    } else {
      window.location="http://www.myapp.com";
    }
  }
  document.addEventListener("deviceready", onDeviceReady, false);
</script>

```

Additionally, as the hosted app will require an internet connection, we added a simple check to verify that this condition is fullfilled.

> **Note:** By default, the Cordova app has the access origin policy set to all: `*`. If you change this policy, remember to add a rule to allow access to the domain on your hosted app in the `config.xml` file, as shown in the following code:

```
<?xml version="1.0" encoding="utf-8"?>
<cordova>
    <access origin="http://www.myapp.com*"/>
</cordova>
```

### Define the application icon and splash screen

These two assets are very simple to add and very important to your application, as they will give the look and feel of a mobile app.

You can set a generic icon in the `config.xml` file for all platforms by using the **icon** element. If you do not specify an icon then the _Apache Cordova_ logo is used.

However, an icon that looks good on one platform may not look good on another. For this reason, you have the option to include specific icons for each platform. If you specify a platform icon, this will override the generic icon setting.

In the other hand, you can use the `splash` element to define the splash screens for each platform. In this case you will have one element per resolution. You should also consider the device's orientations; that is, splash screens for portrait and landscape orientations.

> See the [Cordova documentation](http://cordova.apache.org/docs/en/latest/config_ref/images.html) for the available resolutions for each platform.

The following code snippet shows the definition of a generic icon and platform-specfic icons; it also shows the splash screen definition for iOS.

```
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.myapp" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>MyApp</name>
    <icon src="generic-icon.png" />
    ...
    <platform name="ios">
    <icon src="ios-icon.png" />
    <splash src="res/screen/ios/Default~iphone.png" width="320" height="480"/>
    <splash src="res/screen/ios/Default@2x~iphone.png" width="640" height="960"/>
        ...
    </platform>
        <platform name="android">
        <icon src="android-icon.png" />
        ...
    </platform>
</widget>
```

> Notice that the value of the `src` attribute is relative to the project directory and not to the www directory. 

## Adding native features

Most native features can be easily added to your Cordova app by using its plugin system. You can browse [Cordova Plugin APIs page](https://cordova.apache.org/docs/en/latest/cordova/plugins/pluginapis.html) to see the most used plugins.

In this blog post we will show you how to add geolocation support to make your applications location-aware.

First, install the **cordova-plugin-geolocation** plugin by running the following command:

```
cordova plugin add cordova-plugin-geolocation
```

Once the plugin is installed, just add a call to the **navigator.geolocation.getCurrentPosition** method in your app's code, and that's it. 

```
navigator.geolocation.getCurrentPosition(geolocationSuccessCallback,
                                         [geolocationError],
                                         [geolocationOptions]);
```

> **Note:** You can only call the **getCurrentPosition** method once the **onDeviceReady** event has been fired.

The following is a very simple example of code that gets the current location.

```
var onSuccess = function(position) {
    console.log('Latitude: ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude+ '\n');
};

var onError = function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);

```

The following screenshot shows how we implemented this code in our simple app:

![Using GeoLocation](https://cdn.auth0.com/blog/converting-your-app-to-mobile/using-geolocation.png)

## Testing your Cordova app

To run your application you will need a device or emulator of the corresponding platform.
Build your application by running the following command:

```
cordova build [platform]
```

If you specify a platform, only that platform will be built, otherwise all added platforms will be built one by one.

The following subsections show instructions to install and set up the iOS and Android emulators.

### Installing an iOS simulator

If you are using a Mac computer, you can install the iOS simulator by running the following command:

```
sudo npm install -g ios-sim

```

### Creating the Android virtual device

Once you have installed the Android SDK and configured the enviroment variables, run the following command to list the available targets:

``` 
android list targets
```

Note the id number of the desired target and use it in the following command to create the Android virtual device.

```
android create avd --name myCordova --target 1
```

> **Note:** If multiple ABIs are installed for the selected target, you will have to run the command specifying one ABI using the `--abi` parameter. The available ABIs are listed when the `create avd` command fails or using the `android list targets` command.

Try the emulator by running:

```
cordova emulate android
```

![Running the app in Android](https://cdn.auth0.com/blog/converting-your-app-to-mobile/android-app.png)

### Running the app

If the build went well and the emulators are installed, run the following command specifying the desired platform to start the application:

```
cordova run [platform]
```

![Running the app in iOS](https://cdn.auth0.com/blog/converting-your-app-to-mobile/iphone-app.png)

## 6 tips for migrating your application

<div class="" style="text-align: center;"><img style="margin: 0; max-width: 250px;" src="https://cdn.auth0.com/blog/this-the-season-for-cyber-criminals/recommendations.png" alt="Tips for creating your Cordova app" />
</div>

Based on our experience with this type of app, we created the following list of tips for creating your own Cordova apps. 

1. Remember that the recommended architecture for Cordova applications is Single-Page Applications (SPAs). This way, all of the resources are only loaded once when the app starts, and can stay in the web view for as long as the application is running. In addition, with SPAs, the user will not have page reloads, which are simply not typical for native applications. 

2. Ensure your app is responsive, in that it adapts gracefully to different devices and resolutions. Using CSS media queries is a good approach for this.

3. If your app is not SPA, add transitions when navigating to other pages so the navigation goes unnoticed.

4. Decide what form factors you will support. Will you support only mobile phone or tablet form factors, or provide a responsive, universal experience? Just as each platform and platform version will introduce an extra level of effort, each form-factor/breakpoint setting will introduce a new level of effort for designers, developers, and, eventually, testers.

5. Decide if it is important to add offline support. While some apps don’t require any internet access for normal behavior, some do (hosted apps, for example). Even some particular features of the app may require internet. Consider the user experience of your app when no internet connection is present. For example, some features, such as sharing, can be disabled when offline. You can use the [Cordova Network Information plugin](https://www.npmjs.com/package/cordova-plugin-network-information) to detect the connection type and to handle online and offline detection.

6. **Test on devices**. It is almost mandatory to have at least one physical device for each platform/version that you are supporting. There are emulators and simulators that can help you to test the application and identify some major issues, but nothing is as good as  having a real device for testing.

## Aside: Adding Auth0 to your Cordova App

Auth0 can be easily added to your Cordova application. In a few minutes you can add authentication to your platforms by following these simple steps:

1. Set up the callback URL in Auth0.
2. You must install the **InAppBrowser** plugin from Cordova to be able to show the _Login popup_, and then update the config.xml file.
3. Follow the guide specific to the front-end technology you're using.
4. That's it!

For detailed instructions, browse to the [Auth0 Cordova Tutorial](https://auth0.com/docs/native-platforms/cordova).

## Wrapping up

You can create mobile apps quickly and easily with Cordova, but making a successful Cordova app means that the end user doesn't notice that the app is a wrapped web app. This is very simple if you have a responsive single-page app; if this is not the case, consider tweaking your app to make it look like native apps---that is, add page transitions, handle offline scenarios gracefully, disable navigation to external sites, adding platform-specific icons and splash screens, and so on.