---
layout: post
title: "Create a Desktop App with Angular 2 and Electron"
description: "Build a simple image calculator app with Angular 2 and Electron"
date: 2015-12-15 16:00
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image: https://cdn.auth0.com/blog/angular2-electron/angular2-electron-logo.png
  bg_color: "#076274"
  image_size: "90%"
  image_bg_color: "#076274"
tags: 
- angular2
- angular
- electron
- navtive
- app
---

---
**TL;DR:** Electron is an open-source project from GitHub that lets us create cross-platform desktop applications with web technologies. It doesn't matter which specific framework we use; if it works for the web, it works for Electron. We can use Angular 2 for Electron apps, and in this tutorial, we explore how to get a desktop image size calculator app wired up. Check out the [code on GitHub](https://github.com/auth0/angular2-electron).

You can also check out our other Angular 2 material, including tutorials on working with **[pipes](https://auth0.com/blog/2015/09/03/angular2-series-working-with-pipes/)**, **[models](https://auth0.com/blog/2015/09/17/angular-2-series-part-2-domain-models-and-dependency-injection/)**, and **[Http](https://auth0.com/blog/2015/10/15/angular-2-series-part-3-using-http/)**. 

---

Developing desktop applications is arguably harder than developing for the web. Throw in the fact that you would need three versions of the same desktop app to make it available for all the popular operating systems, plus all the work that needs to go into preparing for distribution, and it can be a daunting task for web developers to port their skills to native. This is where Electron comes in.

[Electron](http://electron.atom.io/) is an open-source project from GitHub that makes it easy to build cross-platform desktop apps using web technologies. With it, we get a nice set of APIs for interacting with Windows, OS X, and Linux operating systems, and all we need is JavaScript. There are, of course, other ways to create desktop applications with web technologies, but Electron is unique in its ability to easily target three operating systems at once. The other nice part of building apps with Electron is that we're not barred from using any particular framework. As long as it works on the web, it works for Electron.

In this article, we'll explore how to wire up a simple image size calculator app using Electron and Angular 2. While the steps here are specific to Angular 2, remember that any front end framework will work with Electron, so these instructions could be adapted to make use of others.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-5.png)

## Setting Up Angular 2 and Electron

We'll use [Webpack](https://webpack.github.io/) for our Angular 2 setup, and we'll base the config loosely on the awesome [Angular 2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter) by [AngularClass](https://angularclass.com/). At the time of publishing, Angular 2 is at alpha 53, so we'll use that.

Let's start with our `package.json` file to list our dependencies, along with some `scripts` that will let us easily run our `webpack` commands and also run the `electron` command to start the app.

```js
// package.json
...

  "scripts": {
    "build": "webpack --progress --profile --colors --display-error-details --display-cached",
    "watch": "webpack --watch --progress --profile --colors --display-error-details --display-cached",
    "electron": "electron app"
  },
  "devDependencies": {
    "electron-prebuilt": "^0.35.4",
    "ts-loader": "^0.7.2",
    "typescript": "^1.7.3",
    "webpack": "^1.12.9",
    "webpack-dev-server": "^1.14.0"
  },
  "dependencies": {
    "angular2": "2.0.0-alpha.53",
    "bootstrap": "^3.3.6",
    "gulp": "^3.9.0"
  }
}

...
```

Next, we need some configuration for Webpack.

```js
// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: 'source-map',
  debug: true,

  entry: {
    'angular2': [
      'rxjs',
      'zone.js',
      'reflect-metadata',
      'angular2/angular2',
      'angular2/core',
      'angular2/router',
      'angular2/http'
    ],
    'app': './app/app'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /node_modules/ ]
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ]
};
```

We're telling Webpack to bundle up the Angular 2 scripts and serve them from a single `angular2.js` bundle that will be in the `build` directory. The scripts for our app will be served from a separate bundle called `app.js`.

We also need some TypeScript configuration in a `tsconfig.json` file at the project root.

```js
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true
  },
  "files": [
    "app/app.ts"
  ]
}
```

All the files specific to our application will live inside the `app` subdirectory. There, we need to provide a `package.json` file that will simply tell Electron which script to use for bootstrapping. This will be the `main.js` file, and in it, we will tell Electron how to open and close our app.

```js
// app/package.json

...

{
  "name": "image-size-calculator-app",
  "version": "0.0.1",
  "main": "main.js"
}

...
```

Now let's configure the application window.

```js
// app/main.js

var app = require('app'); 

// browser-window creates a native window
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({ width: 1200, height: 900 });
  
  // Tell Electron where to load the entry point from
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  
  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });

});
```

The `main.js` script is really just some boilerplate that Electron needs to fire up. We are keeping a reference to `mainWindow` so that garbage collection doesn't interfere and close the window on us. We create a browser window with specific dimensions and then load an `index.html` file from the `app` directory. Let's create this file next.

Just like with a regular web app, we need an `index.html` entry point.

```html
  <!-- app/index.html -->

  <html>
    <head>
      <meta charset="UTF-8">
      <title>Image Size Calculator</title>
      <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
    </head>
    <body>

      <div class="container">
        <h1>Hello Electron</h1>
      </div>

      <script src="../build/common.js"></script>
      <script src="../build/angular2.js"></script>
      <script src="../build/app.js"></script>
    </body> 
  </html>
```

The scripts that we're referencing aren't actually there yet, and that's because we haven't run our `webpack` command to generate them. The last thing we need to do before bundling our scripts is to create an empty `app.ts` file, as this is what our `webpack.config.js` file expects.

With an empty `app.ts` in place, let's bundle the scripts.

```bash
npm run watch
```

This command was set up in our `package.json` file in the project root, and it runs `webpack` with some options. One of these options is to watch for changes, so we can now edit our `app.ts` file and everything will automatically get bundled again.

If we look in our project root, we should now see our `build` directory. With all these files in place, we should be able to run the app. Remember that we've set up a command in our `package.json` file to do this.

```bash
npm run electron
```

If everything is wired up properly, we should now see our "Hello Electron" message.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-1.png)

Yikes, that was a lot of boilerplate needed just to set things up! It's worth noting that a lot of this was just to set up Angular 2 and wasn't because of Electron specifically. If we were using a simpler framework (e.g., no TypeScript) or just plain JavaScript, then we wouldn't have needed as much boilerplate. The good news is that all we need to worry about now is the actual Angular 2 code. It's time to start building the app just as we would if it were on the web!

## Creating the Image Uploader

Our simple app will let users drop images in so that they can find out their sizes. Why wouldn't they just check the image's properties? Good point. However, this app will give us a chance to see how Electron adapts web APIs for the desktop.

Let's create the dropzone first. We'll do all of our Angular 2 work in one top-level component.

```js
// app/app.ts

import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'app',
  template: `
    <div 
      (dragover)="false" 
      (dragend)="false" 
      (drop)="handleDrop($event)"
      style="height: 300px; border: 5px dotted #ccc;">
      <p style="margin: 10px; text-align: center">
        <strong>Drop Your Images Here</strong>
      </p>
    </div>
  ` 
})

export class App {

  constructor() {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      console.log(files[key]);
    });

    return false;
  }

}

bootstrap(App);
```

```html
  <!-- app/index.html -->

  ...

  <div class="container">
    <app></app>
  </div>

  ...
```

To define some custom behavior for dropping an image into our app, we need to first pass `false` to the `dragover` and `dragend` events. The `drop` event is what we want to hook into, and for now we are simply logging out the details of the images we drop. That's right--we can see the same dev tools that we would in Chrome. If you're on a Mac, just do `Option + Command + I` to open them up.

Note that to get hold of the event information for the drop, we pass `$event`, just like we would in Angular 1.x.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-2.png)

So how are we getting this information, exactly? Electron provides an abstraction around native files so that we can use the HTML5 file API. With this, we get the path to the file on the filesystem. This is useful in our case, because we can link to our images and show them in our app. Let's set that up now.

## Displaying the Images

Let's now put in some templating to display the images. For this, we'll want to use `ngFor` to iterate over the images we drop in. 

> **Note:** As of alpha 52, templates are now case-sensitive. This means that what used to be `ng-for` is now `ngFor`.

```js
// app/app.ts

...

  template: `
    <div class="media" *ngFor="#image of images">
      <div class="media-left">
        <a href="#">
          <img class="media-object" src="{{ "{{ image.path " }}}}" style="max-width:200px">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{ "{{ image.name " }}}}</h4>
        <p>{{ "{{ image.size " }}}} bytes</p>
      </div>
    </div>
`

...

export class App {

  images:Array<Object> = [];

  constructor() {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.images.push(files[key]);
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });

    return false;
  }

}

...
```

Now we push the dropped files onto an array called `images` and iterate over it in our template to get the details. To avoid other file types being dropped in, we are only accepting `png` and `jpeg`.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-3.png)

## Getting the Image Stats

We want to have a way to display the total number of images dropped into the app, as well as the total size of those images. For this, we can create an `imageStats` function that returns these details.

```js
// app/app.ts

...

  template: `
    <h1>Total Images: {{ "{{ imageStats().count " }}}}</h1>
    <h1>Total Size: {{ "{{ imageStats().size " }}}} bytes</h1>
  `
...

  imageStats() {

    let sizes:Array<Number> = [];
    let totalSize:number = 0;
    
    this
      .images
      .forEach((image:File) => sizes.push(image.size));

    sizes
      .forEach((size:number) => totalSize += size);

    return {
      size: totalSize,
      count: this.images.length
    }

  }

...
```

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-4.png)

## Adding a Byte Conversion Pipe

We're getting the number of bytes for each image, but ideally we would be able to get them in different units. It would be great if we had something to automatically convert the bytes to KB, MB, and GB, and display the appropriate units. We can do this easily with a custom pipe.

```js
// app/app.ts

import {bootstrap} from 'angular2/platform/browser';
import {Component, Pipe, PipeTransform} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Pipe({ name: 'byteFormat'})
class ByteFormatPipe implements PipeTransform {
  // Credit: http://stackoverflow.com/a/18650828
  transform(bytes, args) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  }
}

@Component({
  selector: 'app',
  pipes: [ByteFormatPipe],
  template: `

    <h1>Total Images: {{ "{{ imageStats().count " }}}}</h1>
    <h1>Total Size: {{ "{{ imageStats().size | byteFormat " }}}}</h1>

...
```

This pipe checks for the file size in bytes and returns the appropriate conversion. We then just apply the pipe to our template and we're able to get the desired output.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-5.png)

## Preparing for Distribution

When distributing Electron apps, it's essential to generate an archive of the application files so that the source code is concealed. This can be done with the `asar` utility.

```bash
npm install -g asar
asar pack image-size-calculator app.asar
```

The archive file can then be used for the app, and it will be read-only.

We'll obviously want to change the name of the application and also provide a unique icon. Instructions for this, along with the other steps involved with distribution, can be found in the [Electron docs](http://electron.atom.io/docs/v0.35.0/tutorial/application-packaging/).

## Aside: Authentication with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

Auth0 [integrates well with AngularJS](https://auth0.com/learn/angular-authentication) at both 1.x and 2. If your electron app relies on a remote database and data API, you can easily protect it with JWT authentication. You can also use **[angular2-jwt](https://github.com/auth0/angular2-jwt)** to send authenticated HTTP requests from your Angular 2 app.

<img src="https://docs.google.com/drawings/d/1ErB68gFj55Yg-ck1_CZByEwN5ql0Pj2Mzd-6S5umv2o/pub?w=1219&amp;h=559" style="border: 1px solid #ccc;padding: 10px;">

## Wrapping Up

Electron offers developers a way to create desktop applications with the web technologies they already know instead of needing to learn new languages that are specific to various operating systems. This is great, because skills can easily be ported, and code can be reused.

Electron doesn't care about which framework we use for our apps. Even though it's still in alpha, Angular 2 is a great framework to use inside an Electron app and, once everything is set up, works just the same as if we were developing for the web.