---
layout: post
title: "JWT Authentication with Observables using RxJS and Fetch"
description: "Learn how to make a reactive application and add authentication to it with RxJS and the Fetch API"
date: 2015-09-09 11:00
author: 
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image_bg_color: "#dbdbdb"
  bg_color: "#7f8c8d"
  image: https://cdn.auth0.com/blog/auth-observables/rxjs-logo.png
  image_size: "80%"
tags: 
- reactive
- observables
- jwt
- authentication
- javascript
- rxjs
---

---

**TL;DR:** Reactive programming is powerful and is becoming increasingly popular with libraries such as RxJS. We can make a stream out of just about anything, including API communication and authentication. Check out the [repo for this tutorial](https://github.com/auth0/auth-observables) to see the code.

---

Reactive programming has been gaining a lot of popularity in recent years. In the Reactive paradigm, data is handled as **streams** which can be composed of anything from events to simple variables and everything in between. Much like a stream of flowing water is a continuous phenomenon, a data stream in Reactive programming is also continuous and can be observed. When we observe streams over time, we are most interested in the events emitted from them, which happen asynchronously.

In this tutorial, we'll see how we can implement Reactive programming by creating a simple app that fetches and displays data. We'll also see how we can handle authentication in our app and have what we'll call "authenticable observables". Our goal throughout this tutorial is to see how we can shift our thinking about app architecture. We'll move away from the simple Promise-based asynchronous models we're used to and see how we can benefit from working with Observables.

## What We'll Build

We'll make use of Auth0's trusty NodeJS backend that serves us both public and private Chuck Norris quotes. The API uses JWT authentication which is perfect for our case, as we'll want to see how we can use observables to handle JWTs. We'll also be using [The Reactive Extensions for JavaScript](https://github.com/Reactive-Extensions/RxJS), otherwise known as RxJS, which is a set of libraries that provide us a wealth of tooling for working with observables. To actually retrieve data, we'll use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). 

In the interest of brevity, we won't deal with error conditions. However, the Fetch API and RxJS both have methods for handling errors as would be expected.

## Setting Up the HTML

Since we want to focus on how to handle observables for our sample application, we won't worry too much about any kind of routing or other way we could polish the app. Instead, we'll provide some simple controls for the user to login and retrieve public and private quotes.

Let's first set up the HTML. We'll include RxJS from the CDN and use Bootstrap for styling as well:

```html
  <!-- index.html -->

  ...

  <nav class="navbar navbar-default">
    <div class="container">
      <div class="row">
        <div class="col-sm-4">
          <input id="username" class="form-control" type="text" placeholder="Enter your username">          
        </div>

        <div class="col-sm-4">
          <input id="password" class="form-control" type="password" placeholder="Enter your password">          
        </div>

        <div class="col-sm-4">
          <button id="login-button" class="btn btn-primary">Login</button>          
        </div>
      </div>
    </div>
  </nav>

  <div class="container">    

    <button id="quote-button" class="btn btn-primary">
      Get a Quote!
    </button>
    <button id="secret-quote-button" class="btn btn-primary">
      Get a Secret Quote!
    </button>

    <h1></h1>
    
  </div>

  </body>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/2.3.22/rx.all.js"></script>
  <script src="app.js"></script>
  
  ...
```

![observables](https://cdn.auth0.com/blog/auth-observables/auth-observables-1-1.png)

## Creating the Click Streams

RxJS gives us a `fromEvent` method that allows us to create streams from any kind of event. In our case, we'll need to observe click events on our three buttons. We first need to select the buttons using `querySelector` and then pass that selection into the `fromEvent` method as the first argument, along with `'click'` as the second argument.

```js
// app.js

...

// Selectors for our buttons
var loginButton = document.querySelector('#login-button');  
var quoteButton = document.querySelector('#quote-button');
var secretQuoteButton = document.querySelector("#secret-quote-button");

// We can create streams from click events on our buttons using
// Rx's 'fromEvent' method
var quoteClickStream = Rx.Observable.fromEvent(quoteButton, 'click');
var secretQuoteClickStream = Rx.Observable.fromEvent(secretQuoteButton, 'click');
var loginClickStream = Rx.Observable.fromEvent(loginButton, 'click');

...
```
With these streams setup, we could at this point `subscribe` to the events and respond in some simple way when they are observed. However, for our purposes, we'll need to create additional streams out of them first.

## Creating New Streams

When working with streams, we will often need to combine or create new streams out of existing ones. RxJS gives us many useful ways of doing this, and one of them is `map`. This method projects a value we pass into it into a new stream that is dependent on an existing stream. 

Let's make a new stream called `quoteStream` which takes care of getting the publicly accessible quotes. We'll need to create a new stream that maps a value (in this case an object with a `url` key) to the `quoteClickStream`. 

```js
// app.js

...

// Here we want to map the endpoint for where we'll get our public quotes
var quoteStream = quoteClickStream
  .map({url: 'http://localhost:3001/api/random-quote'});

...
```
## Getting Public Quotes

We'll need to create another stream after this that is responsible for calling a function which fetches data from the API. We'll call this one `quoteResponseStream` because it is responsible for getting responses.

```js
// app.js

...

// We need a response stream that handles the fetch operation
var quoteResponseStream = quoteStream
  // flatMap flattens the new stream such that we can get access
  // to JSON data returned from the fetch operation
  .flatMap(function(request) {
    // We can easily turn a Promise into an observable with fromPromise
    return Rx.Observable.fromPromise(fetchQuote(request));
  });

...
```

The `quoteResponseStream` relies on the `quoteStream` which, as we saw above, maps an object with a `url` key that can be passed to the `fetchQuote` method to make the request. Since the values emitted by the `map` method are themselves streams, we need a way to get access the actual data. In this new stream we are using `flatMap` which effectively flattens the emitted values and gives us access to the JSON returned by the `fetch` operation.

Luckily for us, RxJS provides an easy way to deal with Promises, which are what the Fetch API returns. We can create a stream from a Promise with `fromPromise` and in this case, we are passing in the `fetchQuote` function with the request URL. We haven't yet set up this function, so let's do that now.
  
 ```js   
// app.js

...

function fetchQuote(request) {
  return fetch(request.url).then(function(data) {
    return data.text().then(function(text) {
      return text;
    });
  });
}

...
```

The `fetchQuote` function makes a `GET` request to the url we pass in and returns the data as text.

With this set up, we're now ready to subscribe to the `quoteResponseStream` and observe events. We can do whatever we want with the returned responses, and in this case we'll simply print them on the page.

```js
// app.js

...

// We subscribe to the quoteResponseStream, listen
// for quotes that get returned, and put them on the page
quoteResponseStream.subscribe(function(text) {
  document.querySelector('.container h1').innerHTML = text;
});

...
```

If we now click the "Get a Quote!" button, we get a public quote back.

![observables](https://cdn.auth0.com/blog/auth-observables/auth-observables-1-2.png)

## Setting Up the Auth Streams

Now that we know how to create new streams out of existing ones and also how to map values to them, we can use the same approach to set up the authentication streams.

First, we'll need to create a new stream called `loginStream` out of the existing `loginClickStream`.

```js
// app.js

...

// .map will create a new stream that is dependent on the first
// and will project a value that we pass it. The login stream needs to
// map a string that contains values from the username and password input boxes
var loginStream = loginClickStream
  .map(function() {
    var username = document.querySelector('#username').value;
    var password = document.querySelector('#password').value;
    return "username=" + username + "&password=" + password;
  });

...
```

In this case, we're mapping a string that contains the user input that will be used for logging the user in and retrieving a JWT.

We'll also need another stream called `getJwtStream` which uses `flatMap` to make the call to `getJwt` which actually returns the JWT.

```js
// app.js

...

// We need a stream for getting the JWT from the server which will
// require us to pass in credentials 
var getJwtStream = loginStream
  // flatMap flattens the new stream such that we can get access
  // to JSON data returned from the fetch operation
  .flatMap(function(credentials) {
    return Rx.Observable.fromPromise(getJwt(credentials))
  });

...
```

The `getJwt` function will be responsible for retrieving a JWT using the string of credentials we pass in.

```js
// app.js

...

// We need a function to handle the fetch request for the JWT
function getJwt(credentials) {

  // We need some config to specify that this is to be a POST request
  // We set the content type and put the passed-in credentials as the body
  var config = {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: credentials
  }

  return fetch('http://localhost:3001/sessions/create', config).then(function(data) {
    return data.json().then(function(jwt) {
      return jwt;
    });
  });
}

...
```

In this case, we're getting the Fetch API to send a `POST` request with the credentials string as the body, which is done by setting up a `config` object and passing it as the second argument.

Lastly, we need to subscribe to this stream and set the returned JWT in local storage.

```js
// app.js

...

getJwtStream.subscribe(function(jwt) {
  localStorage.setItem('id_token', jwt.id_token);
});

...
```

We can now login with our credentials. For this simple example, we don't have a way to register users (although the NodeJS example back end allows it), so we'll just use the default username of "gonto" and a password of "gonto".

![observables](https://cdn.auth0.com/blog/auth-observables/auth-observables-1-3.png)

## Retrieving Secret Quotes

Now that we've got our authentication in place and we have a JWT saved in local storage, let's set up the streams that handle secret quotes. The `secretQuoteStream` will be pretty similar to the `quoteStream` but will include an additional `jwt` key.

```js
// app.js

...

// We also need a separate stream for the secret quotes and in this
// case we need to include the JWT from local storage
var secretQuoteStream = secretQuoteClickStream
  .map(function() {
    var jwt = localStorage.getItem('id_token');
    return {
      url: 'http://localhost:3001/api/protected/random-quote',
      jwt: jwt
    }
  });

...
```

We could set up our response stream to mimic the `quoteResponseStream`, but instead of repeating ourselves, let's use Rx's `merge` method to combine the `quoteStream` and the `secretQuoteStream` into one single `quoteResponseStream`. This gives us the benefit of only needing to subscribe to a single stream that will observe events for public and private quotes. 

```js
// app.js

...

// We need a response stream that handles the fetch operation
var quoteResponseStream = quoteStream
  .flatMap(function(request) {
    return Rx.Observable.fromPromise(fetchQuote(request));
  })
  // Instead of setting up a separate stream for the secret quotes, we
  // can simply merge the secretQuoteStream in and apply the same flatMap
  .merge(secretQuoteStream
    .flatMap(function(request) {
      return Rx.Observable.fromPromise(fetchQuote(request));
    })
  );

...
```

We just need to modify the `fetchQuote` function so that it properly handles the JWT that *might* be present. If the JWT is there, it will be included as an `Authorization` header and sent to the API.

```js
// app.js

...

// One fetch function will handle getting both the public and private quotes 
function fetchQuote(request) {
  // We just need to check whether a JWT was sent in as part of the
  // config object. If it was, we'll include it as an Authorization header
  if(request.jwt) {
    var config = {
      headers: {
        "Authorization": "Bearer " + request.jwt
      }
    }
  }

  return fetch(request.url, config).then(function(data) {
    return data.text().then(function(text) {
      return text;
    });
  });
}

...
```
Since we merged the `secretQuoteStream` into the `quoteResponseStream`, we don't need to modify the subscription at all. Testing this out, we see that we now get secret quotes.

![observables](https://cdn.auth0.com/blog/auth-observables/auth-observables-1-4.png)

## Wrapping Up

You might be wondering why we'd bother architecting our applications using observables. It seems like we just used a lot more code than was really necessary and that we could have been more succinct using more familiar methods. While that might be true, observables offer so much more power and flexibility than Promises that making the switch can be worthwhile. For example, if we wanted to provide better support for network latency or other constraints where a request and response might not go through as expected, we could tap into RxJS's `retry` method which would allow us to set the number of times we wanted to retry a request before having it error out.

With this tutorial we've really just skimmed the surface. The possibilities that we have with Reactive programming and supporting libraries such as RxJS are huge. If you like the idea of turning nearly all the parts of your application into data streams, it would certainly be beneficial to explore Reactive programming further.

Big thanks to [André Staltz](https://twitter.com/andrestaltz) for his [article on Reactive programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754), from which many of these examples were informed. 