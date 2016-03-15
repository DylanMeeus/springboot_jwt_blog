---
layout: post
title: "JavaScript Module Systems Showdown: CommonJS vs AMD vs ES2015"
description: "Learn about the different JavaScript module systems currently in use, and find out which will be the best option for your project."
date: 2016-03-15 13:30
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
- javascript
- module
- modules
- module systems
- module system
- javascript module system
- javascript module systems
- commonjs
- common.js
- asynchronous module definition
- amd
- system.js
- systemjs
- es2015 modules
- es6 modules
- es 2015 modules
- javascript 6 modules
- javascript 2015 modules
- node.js modules
- node modules
- nodejs modules
---

As JavaScript development gets more and more common, namespaces and depedencies get much more difficult to handle. Different solutions were developed to deal with this problem in the form of module systems. In this post we will explore the different solutions currently employed by developers and the problems they try to solve. Read on!

-----

## Introduction: Why Are JavaScript Modules Needed?
If you are familiar with other development platforms, you probably have some notion of the concepts of *encapsulation* and *dependency*. Different pieces of software are usually developed in isolation until some requirement needs to be satisfied by a previously existing piece of software. At the moment that other piece of software is brought into the project a dependency is created between it and the new piece of code. Since these pieces of software need to work together, it is of importance that no conflicts arise between them. This may sound trivial, but without some sort of *encapsulation* it is a matter of time before two *modules* conflict with each other. This is one of the reasons elements in C libraries usually carry a prefix:

```C
#ifndef MYLIB_INIT_H
#define MYLIB_INIT_H

enum mylib_init_code {
    mylib_init_code_success,
    mylib_init_code_error
};

enum mylib_init_code mylib_init(void);

// (...)

#endif //MYLIB_INIT_H
```

Encapsulation is essential to prevent conflicts and ease development.

When it comes to dependencies, in traditional client-side JavaScript development, they are implicit. In other words, it is the job of the developer to make sure dependencies are satisfied at the point any block of code is executed. Developers also need to make sure dependencies are satisfied in the right order (a requirement of certain libraries).

The following example is part of [Backbone.js's](https://github.com/jashkenas/backbone/blob/master/examples/todos/index.html) examples. Scripts are manually loaded in the correct order:

```HTML
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Backbone.js Todos</title>
        <link rel="stylesheet" href="todos.css"/>
    </head>

    <body>
        <script src="../../test/vendor/json2.js"></script>
        <script src="../../test/vendor/jquery.js"></script>
        <script src="../../test/vendor/underscore.js"></script>
        <script src="../../backbone.js"></script>
        <script src="../backbone.localStorage.js"></script>
        <script src="todos.js"></script>
    </body>

    <!-- (...) -->

</html>
```

As JavaScript development gets more and more complex, dependency management can get cumbersome. Refactoring is also impaired: where should newer dependencies be put to maintain proper order of the load chain?

JavaScript module systems attempt to deal with these problems and others. They were born out of necessity to accommodate the ever growing JavaScript landscape. Let's see what the different solutions bring to the table.

## An Ad-Hoc Solution: The Revealing Module Pattern
Most module systems are relatively recent. Before they were available, a particular programming pattern started getting used in more and more JavaScript code: the revealing module pattern.

```JavaScript
var myRevealingModule = (function () {
    var privateVar = "Ben Cherry",
        publicVar = "Hey there!";

    function privateFunction() {
        console.log( "Name:" + privateVar );
    }

    function publicSetName( strName ) {
        privateVar = strName;
    }

    function publicGetName() {
        privateFunction();
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        setName: publicSetName,
        greeting: publicVar,
        getName: publicGetName
    };
})();

myRevealingModule.setName( "Paul Kinlan" );
```

> This example was taken from [Addy Osmani's JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/) book.

JavaScript scopes (at least up to the appearance of `let` in ES2015) work at the function level. In other words, whatever binding is declared inside a function cannot escape its scope. It is for this reason the revealing module pattern relies on functions to encapsulate private contents (as many other JavaScript patterns).

In the example above, *public* symbols are exposed in the returned dictionary. All other declarations are protected by the function scope enclosing them. It is not necessary to use `var` and an immediate call to the function enclosing the private scope; a named function can be used for modules as well.

This pattern has been in use for quite some time in JavaScript projects and deals fairly nicely with the encapsulation matter. It does not do much about the dependencies issue. Proper module systems attempt to deal with this problem as well. Another limitation lies in the fact that including other modules cannot be done in the same source (unless using `eval`).

#### Pros
- Simple enough to be implemented anywhere (no libraries, no language support required).
- Multiple modules can be defined in a single file.

#### Cons
- No way to programmatically import modules (except by using `eval`).
- Dependencies need to be handled manually.
- Asynchronous loading of modules is not possible.
- Circular dependencies can be troublesome.
- Hard to analyze for static code analyzers.

## CommonJS
CommonJS is a project that aims to define a series of specifications to help in the development of server-side JavaScript applications. One of the areas the CommonJS team attempts to address are modules. Node.js developers originally intended to follow the CommonJS specification but later decided against it. When it comes to modules, Node.js's implementation is very influenced by it:

```JavaScript
// In circle.js
const PI = Math.PI;

exports.area = (r) => PI * r * r;

exports.circumference = (r) => 2 * PI * r;

// In some file
const circle = require('./circle.js');
console.log( `The area of a circle of radius 4 is ${circle.area(4)}`);
```

> One evening at Joyent, when I mentioned being a bit frustrated some ludicrous request for a feature that I knew to be a terrible idea, he said to me, "Forget CommonJS. It's dead. We are server side JavaScript." - [NPM creator Isaac Z. Schlueter quoting Node.js creator Ryan Dahl](https://github.com/nodejs/node-v0.x-archive/issues/5132#issuecomment-15432598)

There are abstractions on top of Node.js's module system in the form of libraries that bridge the gap between Node.js's modules and CommonJS. For the purposes of this post, we will only show the basic features which are mostly the same.

In both Node's and CommonJS's modules there are essentially two elements to interact with the module system: `require` and `exports`. `require` is a function that can be used to import symbols from another module to the current scope. The parameter passed to `require` is the *id* of the module. In Node's implementation, it is the name of the module inside the `node_modules` directory (or, if it is not inside that directory, the path to it). `exports` is a special object: anything put in it will get exported as a public element. Names for fields are preserved. A peculiar difference between Node and CommonJS arises in the form of the `module.exports` object. In Node, `module.exports` is the real special object that gets exported, while `exports` is just a variable that gets bound by default to `module.exports`. CommonJS, on the other hand, has no `module.exports` object. The practical implication is that in Node it is not possible to export a fully pre-constructed object without going through `module.exports`:

```JavaScript
// This won't work, replacing exports entirely breaks the binding to
// modules.exports.
exports =  (width) => {
  return {
    area: () => width * width
  };
}

// This works as expected.
module.exports = (width) => {
  return {
    area: () => width * width
  };
}
```

CommonJS modules were designed with server development in mind. Naturally, the API is synchronous. In other words, modules are loaded at the moment and in the order they are required inside a source file.

#### Pros
- Simple: a developer can grasp the concept without looking at the docs.
- Dependency management is integrated: modules require other modules and get loaded in the needed order.
- `require` can be called anywhere: modules can be loaded programmatically.
- Circular dependencies are supported.

#### Cons
- Synchronous API makes it not suitable for certain uses (client-side).
- One file per module.
- Browsers require a loader library or transpiling.
- No constructor function for modules (Node supports this though).
- Hard to analyze for static code analyzers.

### Implementations
We have already talked about one implementation (in partial form): Node.js.

![Node.js JavaScript Modules](https://cdn.auth0.com/blog/jsmodules/Node.js_logo.svg)

For the client there are currently two popular options: [webpack](https://webpack.github.io/docs/commonjs.html) and [browserify](http://browserify.org/index.html). Browserify was explicitly developed to parse Node-like module definitions (many Node packages work out-of-the-box with it!) and bundle your code plus the code from those modules in a single file that carries all dependencies. Webpack on the other hand was developed to handle creating complex pipelines of source transformations before publishing. This includes bundling together CommonJS modules.

## Asynchronous Module Definition (AMD)
AMD was born out of a group of developers that were displeased with the direction adopted by CommonJS. In fact, AMD was split from CommonJS early in its development. The main difference between AMD and CommonJS lies in its support for asynchronous module loading.

```JavaScript
//Calling define with a dependency array and a factory function
define(['dep1', 'dep2'], function (dep1, dep2) {

    //Define the module value by returning a value.
    return function () {};
});

// Or:
define(function (require) {
    var dep1 = require('dep1'),
        dep2 = require('dep2');

    return function () {};
});
```

Asynchronous loading is made possible by using JavaScript's traditional closure idiom: a function is called when the requested modules are finished loading. Module definitions and importing a module is carried by the same function: when a module is defined its dependencies are made explicit. An AMD loader can therefore have a complete picture of the dependency graph for a given project at runtime. Libraries that do not depend on each other for loading can thus be loaded at the same time. This is particularly important for browsers, where startup times are essential to a good user experience.

#### Pros
- Asynchronous loading (better startup times).
- Circular dependencies are supported.
- Compatibility for `require` and `exports`.
- Dependency management fully integrated.
- Modules can be split in multiple files if necessary.
- Constructor functions are supported.
- Plugin support (custom loading steps).

#### Cons
- Slightly more complex syntactically.
- Loader libraries are required unless transpiled.
- Hard to analyze for static code analyzers.

### Implementations
Currently the most popular implementations of AMD are [require.js](http://requirejs.org/) and [Dojo](https://dojotoolkit.org/).

![Require.js for JavaScript Modules](https://cdn.auth0.com/blog/jsmodules/requirejs-logo.svg)

 Using require.js is pretty straightforward: include the library in your HTML file and use the `data-main` attribute to tell require.js which module should be loaded first. Dojo has a [similar setup](http://dojotoolkit.org/documentation/tutorials/1.10/hello_dojo/index.html).

## ES2015 Modules
Fortunately, the ECMA team behind the standardization of JavaScript decided to tackle the issue of modules. The result can be seen in the latest release of the JavaScript standard: ECMAScript 2015 (previously known as ECMAScript 6). The result is syntactically pleasing and compatible with both synchronous and asynchronous modes of operation.

```JavaScript
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

> Example taken from [Axel Rauschmayer blog](http://www.2ality.com/2014/09/es6-modules-final.html)

The `import` directive can be used to bring modules into the namespace. This directive, in contrast with `require` and `define` is not dynamic (i.e. it cannot be called at any place). The `export` directive, on the other hand, can be used to explicitly make elements public.

The static nature of the `import` and `export` directive allows static analyzers to build a full tree of dependencies without running code. ES2015 does support dynamic loading of modules through the [Load API]():

```JavaScript
System.import('some_module')
      .then(some_module => {
          // Use some_module
      })
      .catch(error => {
          // ...
      });
```

> In truth, ES2015 [only specifies the syntax](https://github.com/lukehoban/es6features/issues/75) for the dynamic and static module loaders. In practice, ES2015 implementations are not required to do anything after parsing these directives. Module loaders such as System.js are still required until the next ECMAScript spec is released.

This solution, by virtue of being integrated in the language, lets runtimes pick the best loading strategy for modules. In other words, when asynchronous loading gives benefits, it can be used by the runtime.

#### Pros
- Synchronous and asynchronous loading supported.
- Syntactically simple.
- Support for static analysis tools.
- Integrated in the language (eventually supported everywhere, no need for libraries).
- Circular dependencies supported.

#### Cons
- Still not supported everywhere.

### Implementations
Unfortunately none of the major JavaScript runtimes support ES2015 modules in their current stable branches. This means no support in Firefox, Chrome or Node.js. Fortunately many transpilers do support modules and a [polyfill](https://github.com/ModuleLoader/es6-module-loader) is also available. Currently, the ES2015 preset for [Babel](https://babeljs.io/) can handle modules with no trouble.

![Babel for JavaScript Modules](https://cdn.auth0.com/blog/jsmodules/babel.png)

## The All-in-One Solution: System.js
You may find yourself trying to move away from legacy code using one module system. Or you may want to make sure whatever happens, the solution you picked will still work. Enter [System.js](https://github.com/systemjs/systemjs): a universal module loader that supports CommonJS, AMD and ES2015 modules. It can work in tandem with transpilers such as Babel or Traceur and can support Node and IE8+ environments. Using it is a matter of loading System.js in your code and then pointing it to your base URL:

```HTML
    <script src="system.js"></script>
    <script>
      // set our baseURL reference path
      System.config({
        baseURL: '/app',
        // or 'traceur' or 'typescript'
        transpiler: 'babel',
        // or traceurOptions or typescriptOptions
        babelOptions: {

        }
      });

      // loads /app/main.js
      System.import('main.js');
    </script>
```

As System.js does all the job on-the-fly, using ES2015 modules should generally be left to a transpiler during the build step in production mode. When not in production mode, System.js can call the transpiler for you, providing seamless transition between production and debugging environments.

## Aside: What We Use At Auth0
At Auth0 we use JavaScript heavily. For our server-side code we use CommonJS-style Node.js modules. For certain client-side code we prefer AMD. For our React-based [Passwordless Lock library](https://github.com/auth0/lock-passwordless) we have opted for ES2015 modules.

Like what you see? <a href="javascript:signup()">Signup</a> and start using Auth0 in your projects today.

Are you a developer and like our code? If so, [apply](https://auth0.com/jobs) for an engineering position now. We have an awesome team!

## Conclusion
Building modules and handling dependencies was cumbersome in the past. Newer solutions, in the form of libraries or ES2015 modules, have taken most of the pain away. If you are looking at starting a new module or project, ES2015 is the right way to go. It will always be supported and current support using transpilers and polyfills is excellent. On the other hand, if you prefer to stick to plain ES5 code, the usual split between AMD for the client and CommonJS/Node for the server remains the usual choice. Don't forget to leave us your thoughts in the comments section below. Hack on!

<div id="qp_all618417" style="width:100%;"><link href='//fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'><STYLE>#qp_main618417 .qp_btna:hover input {background:#00355F!important}</STYLE><div id="qp_main618417" fp='C8c74c68-26' results=0 cmt=0 style="border-radius:0px;margin:0 auto;padding:0.8em;background-color:#FFF;font-family: 'Open Sans', sans-serif, Arial;color:#000;border: 1px solid #DBD9D9;max-width:792px"><div style="font-size:1.2em;background-color:#00355F;color:#FFF;font-family:'Open Sans', sans-serif, Arial"><div style="padding:0.8em;line-height:1.3em">What modules system would you pick for a new server-side project?</div></div><form id="qp_form618417" action="//www.poll-maker.com/results618417xC8c74c68-26" method="post" target="_blank" style="display:inline;margin:0px;padding:0px"><div style="padding:0px"><input type=hidden name="qp_d618417" value="42444.4676388827-42444.4676271486"><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618417" type="radio" value="1" />Node.js/Common.js</span></div><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618417" type="radio" value="2" />ES2015</span></div><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618417" type="radio" value="3" />AMD</span></div></div><div style="padding-left:0px;min-height:40px;clear:both"><a style="float:left;width:50%;max-width:140px;box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;padding-right:5px;text-decoration:none" class="qp_btna" href="#"><input name="qp_b618417" style="width:100%;height:40px;background-color:#0B79D3;font-family: 'Open Sans', sans-serif, Arial;font-size:16px;color:#FFF;cursor:pointer;cursor:hand;border:0px;-webkit-appearance:none;border-radius:0px" type="submit" btype="v" value="Vote" /></a><a style="float:left;width:50%;max-width:140px;box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;padding-left:5px;text-decoration:none" class="qp_btna" href="#"><input name="qp_b618417" style="width:100%;height:40px;background-color:#0B79D3;font-family: 'Open Sans', sans-serif, Arial;font-size:16px;color:#FFF;cursor:pointer;cursor:hand;border:0px;-webkit-appearance:none;border-radius:0px" type="submit" btype="r" value="Results" /></a></div><a id="qp_a618417" style="float:right;font-family:Arial;font-size:10px;color:rgb(0,0,0);text-decoration:none" href="http://www.poll-maker.com/QuizMaker">make quizzes</a></form><div style="display:none"><div id="qp_rp618417" style="font-size:14px;width:5ex;text-align:right;overflow:hidden;position:absolute;right:5px;height:1.5em;line-height:1.5em"></div><div id="qp_rv618417" style="font-size:14px;line-height:1.5em;width:0%;text-align:right;color:#FFF;box-sizing:border-box;padding-right:3px"></div><div id="qp_rb618417" style="font-size:14px;line-height:1.5em;color:#FFFFFF;display:block;padding-right:10px 5px"></div><div id="qp_rva618417" style="background:#006FB9;border-color:#006FB9"></div><div id="qp_rvb618417" style="background:#163463;border-color:#163463"></div><div id="qp_rvc618417" style="background:#5BCFFC;border-color:#1481AB"></div></div></div></div>

<br>

<div id="qp_all618431" style="width:100%;"><link href='//fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'><STYLE>#qp_main618431 .qp_btna:hover input {background:#00355F!important}</STYLE><div id="qp_main618431" fp='6B3774A4-26' results=0 cmt=0 style="border-radius:0px;margin:0 auto;padding:0.8em;background-color:#FFF;font-family: 'Open Sans', sans-serif, Arial;color:#000;border: 1px solid #DBD9D9;max-width:792px"><div style="font-size:1.2em;background-color:#00355F;color:#FFF;font-family:'Open Sans', sans-serif, Arial"><div style="padding:0.8em;line-height:1.3em">What modules system would you pick for a new client-side project?</div></div><form id="qp_form618431" action="//www.poll-maker.com/results618431x6B3774A4-26" method="post" target="_blank" style="display:inline;margin:0px;padding:0px"><div style="padding:0px"><input type=hidden name="qp_d618431" value="42444.4692824084-42444.4692708743"><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618431" type="radio" value="1" />AMD</span></div><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618431" type="radio" value="2" />ES2015</span></div><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618431" type="radio" value="3" />CommonJS</span></div><div style="display:block;color:#6B6B6B;font-family: 'Open Sans', sans-serif, Arial;font-size:1.1em;line-height:1.5;padding:13px 8px 11px;margin:10px 0px;clear:both" class="qp_a" onClick="var c=this.getElementsByTagName('INPUT')[0]; if((!event.target?event.srcElement:event.target).tagName!='INPUT'){c.checked=(c.type=='radio'?true:!c.checked)};var i=this.parentNode.parentNode.parentNode.getElementsByTagName('INPUT');for(var k=0;k!=i.length;k++){i[k].parentNode.parentNode.setAttribute('sel',i[k].checked?1:0)}"><span style="display:block;padding-left:30px;cursor:inherit"><input style="float: left;width: 20px;margin-left: -25px;margin-top: 2px;padding: 0px;height: 20px" name="qp_v618431" type="radio" value="4" />Ad-hoc</span></div></div><div style="padding-left:0px;min-height:40px;clear:both"><a style="float:left;width:50%;max-width:140px;box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;padding-right:5px;text-decoration:none" class="qp_btna" href="#"><input name="qp_b618431" style="width:100%;height:40px;background-color:#0B79D3;font-family: 'Open Sans', sans-serif, Arial;font-size:16px;color:#FFF;cursor:pointer;cursor:hand;border:0px;-webkit-appearance:none;border-radius:0px" type="submit" btype="v" value="Vote" /></a><a style="float:left;width:50%;max-width:140px;box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;padding-left:5px;text-decoration:none" class="qp_btna" href="#"><input name="qp_b618431" style="width:100%;height:40px;background-color:#0B79D3;font-family: 'Open Sans', sans-serif, Arial;font-size:16px;color:#FFF;cursor:pointer;cursor:hand;border:0px;-webkit-appearance:none;border-radius:0px" type="submit" btype="r" value="Results" /></a></div><a id="qp_a618431" style="float:right;font-family:Arial;font-size:10px;color:rgb(0,0,0);text-decoration:none" href="http://www.poll-maker.com/QuizMaker">online quiz maker</a></form><div style="display:none"><div id="qp_rp618431" style="font-size:14px;width:5ex;text-align:right;overflow:hidden;position:absolute;right:5px;height:1.5em;line-height:1.5em"></div><div id="qp_rv618431" style="font-size:14px;line-height:1.5em;width:0%;text-align:right;color:#FFF;box-sizing:border-box;padding-right:3px"></div><div id="qp_rb618431" style="font-size:14px;line-height:1.5em;color:#FFFFFF;display:block;padding-right:10px 5px"></div><div id="qp_rva618431" style="background:#006FB9;border-color:#006FB9"></div><div id="qp_rvb618431" style="background:#163463;border-color:#163463"></div><div id="qp_rvc618431" style="background:#5BCFFC;border-color:#1481AB"></div></div></div></div><script src="//scripts.poll-maker.com/3012/scpolls.js" language="javascript"></script>
