---
layout: post
title: "Understanding Reactive Programming and RxJS"
description: "Using Reactive programming and RxJS, you can simplify your programming logic and make your programs easier to understand. Let's build a weather app to show this off!"
date: 2016-09-27 8:36
author:
  name: Alex Sears
  url: http://twitter.com/searsaw
  mail: alexwsears@gmail.com
  avatar: "https://s.gravatar.com/avatar/6c0654e56c8c73ffee8f76fe03d18ccf?s=80"
design:
  bg_color: "#572D89"
  image: https://cdn.auth0.com/blog/reactive-programming/logo.png
tags:
- reactive-programming
- javascript
- rxjs
---

---

**TL;DR** RxJS is a library that allows us to easily create and manipulate streams of events and data. This makes developing complex but readable asynchronous code much easier.

---

Creating large asynchronous applications is not the easiest thing to do. We have all witnessed the issues [callback hell](http://callbackhell.com/) can cause. Due to this growing concern, people have taken it upon themselves to improve the landscape of the asynchronous JavaScript landscape. We have all heard of [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator), and [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await). There is another solution, and it is called [RxJS](https://github.com/Reactive-Extensions/RxJS).

From their Github README, RxJS is defined as "a set of libraries for composing asynchronous and event-based programs using observable sequences and fluent query operators". In English, these means we can create streams from events and other sources of data. We can then merge, mash, split, and more with this data. Once we have the data how we want it, we can iterate over the data and do something with it.

This concept of an "observable", or "stream" as I like to call them, can be difficult to grasp at first. Instead of thinking about it as a singular event or piece of data that we use at a single point in time, I think about it as a collection of events or pieces of data over a period of time.

To demonstrate how this all works, we are going to build a simple weather app. There will be a text input that we type a zip code into. Then we click the button to submit it. A request will be sent to get the current temperature at the zip code. Once we get the temperature back, we will display the zip code and the temperature together on page. We will be able to put as many temperatures to watch on the page. Then we will create a timer that will refresh the temperature after a set time period. Let's get to it!

## Setting Things Up

First thing we need to do is create a basic HTML page that loads the RxJS library into the document so we can use it. We will also include some CSS that will organize things a bit.

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Weather Monitoring in RxJS</title>
    <style>
      #form {
        margin-bottom: 20px;
      }
      .location {
        float: left;
        padding: 10px;
        margin-right: 20px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .location p {
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
      }
      .zip { font-size: 2em; }
      .temp { font-size: 4em; }
    </style>
  </head>
  <body>
    <div id="app-container">
      <div id="form">
        <label>Zip Code:</label>
        <input type="text" id="zipcode-input">
        <button id="add-location">Add Location</button>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.1.0/rx.all.min.js"></script>
    <script>
      // our code will go here
      console.log('RxJS included?', !!Rx);
  </script>
  </body>
  </html>
```

Load this file in your favorite browser, and open up your developer console. You should see `RxJS included? true`. If you do, then you're ready to start writing some reactive JavaScript! Notice we have a simple "form" consisting of our zip code input and a button. Our first piece of JavaScript will grab those elements and create streams from their events. We will also grab a reference to the `app-container` that we will add our elements to later.

```javascript
// Grab HTML elements
const appContainer = document.getElementById('app-container');
const zipcodeInput = document.getElementById('zipcode-input');
const addLocationBtn = document.getElementById('add-location');
```

This is plain ol' JavaScript. Nothing too crazy going on here.

```javascript
// Get stream of button clicks
const btnClickStream =
  Rx.Observable
    .fromEvent(addLocationBtn, 'click')
    .map(() => true)
    .forEach(val => console.log('btnClickStream val', val));
```

Here is our first look at RxJS! We are using the `fromEvent` method on the `Rx.Observable` object to create a stream from the click event that will be emitted by our `addLocationBtn`. This means, any time it is clicked, that event object will be sent down this `btnClickStream`. We will use the `map` method on the returned stream to map each value to the value `true`. I like to do this to simplify the logic in my mind. Since I only care that an event happened, I `map` the value to a simple boolean value. This is just the way I like to do things. If it's not your cup of tea, it's an optional step and can be removed in your app.  Lastly, to make sure it's working, we use `forEach`, which adds a subscriber to the stream. Here we are simply logging the value.

![Button Click Stream](https://cdn.auth0.com/blog/reactive-programming/btn_click_stream.png)

Reload the page, click the button a few times, and look at the output in the console. It's working! Go ahead and remove that `forEach` on the button stream. We won't be needing it. Now let's get our zip codes. We want to listen to any change in the value of the input but only allow values through that are five characters long.

```javascript
// Get stream of zip codes
const zipInputStream =
  Rx.Observable
    .fromEvent(zipcodeInput, 'input')
    .map(e => e.target.value)
    .filter(zip => zip.length === 5)
    .forEach(val => console.log('zipInputStream val', val));
```

Here, we are creating a stream from the input event that is emitted from our input element. We are using `map`to extract the value of the input from the event. Then we are using `filter` to remove all values that are not equal to five characters in length. `filter` takes a condition that, if it returns true, tells the method to put the current value into the stream that is returned. Lastly, we again iterate over each value and log it to the console.

![Zip Input Stream](https://cdn.auth0.com/blog/reactive-programming/zip_input_stream.png)

Reload the page, type in some values, and see how only five character values are allowed through. We are on our way. Remove that `forEach`. Now we need to make sure we pass the current value in the input only when the user clicks the button. Let's create a new stream for that!

```javascript
// Get zipcode after button clicked
const zipcodeStream =
  btnClickStream
    .withLatestFrom(zipInputStream, (click, zip) => zip)
    .distinct()
    .forEach(val => console.log('zipcodeStream val', val));
```

Here, we are calling `withLatestFrom` on the `btnClickStream` and giving it the `zipInputStream`. This means that whenever it sees a value on the `btnClickStream`, it will grab the most recent value from the `zipInputStream` and pass those two values to the "result selector," which is a function that works like `map`. Whatever we return from this function is what is sent down the stream that is returned from `withLatestFrom`. Next, we use the `distinct` method to make sure that we only get new values. If any are repeated, they will not be sent down the stream that is returned from `distinct`. And, of course, we use `forEach` to log out the results to make sure it is all working.

![Zip Code Stream](https://cdn.auth0.com/blog/reactive-programming/zip_stream.png)

Reload the page, enter a zip code, and click the button. Make sure to watch the dev console so you can see that the zip code is only submitted on that stream once the button is clicked. Now, like usual, remove the `forEach` call. We need to create a reusable way of making calls to the weather API since we will be using it when a zip code is added and when the timer ticks.

```javascript
// Create reusable temperature fetching stream
const getTemperature = zip =>
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${zip},us&units=imperial&appid=APPID`)
    .then(res => res.json());

const zipTemperatureStreamFactory = zip =>
  Rx.Observable
    .fromPromise(getTemperature(zip))
    .map(({ main: { temp } }) => ({ temp, zip }));
```
We have created two functions. The first one, `getTemperature`, takes a zip code and makes a request to the weather API to get the temperature. Since [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) returns a promise, we then call `then` on that promise. This promise receives the response, and we return the JSON form of that response so we can more easily work with it. This means this function returns a promise. *This is important.* Also, make sure to change `APPID` to the application ID you can get for free [from the API keys page in the OpenWeatherMap admin page](https://home.openweathermap.org/api_keys).

The second function also takes a zip code. We return a stream by using the `fromPromise` method on the `Rx.Observable` object to create one from the promise that is returned from calling our `getTemperature` function and passing it the current zip code. Since this returns a stream, we can operate on it with any of the available methods that `Rx.Observable` instances have on them. Since we only care about the current zip code and its temperature, let's return an object that only has these pieces of data on them. We `map` over the promise stream, destructuring the input to get the temperature out, and return an object containing the data we want. For more information on the new destructuring syntax in the ES2015 version of JavaScript, [visit the MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Now that we have our functions that will get the data from the weather API, let's finally add our elements to the page.

```javascript
// Get new zip at each button click, get its
// temperature, and paint it to the screen
zipcodeStream
  .flatMap(zipTemperatureStreamFactory)
  .forEach(({ zip, temp }) => {
    const locationEle = document.createElement('div');
    locationEle.id = `zip-${zip}`;
    locationEle.classList.add('location');

    const zipEle = document.createElement('p');
    zipEle.classList.add('zip');
    zipEle.innerText = zip;

    const tempEle = document.createElement('p');
    tempEle.classList.add('temp');
    tempEle.innerHTML = `${temp}&deg;F`;

    locationEle.appendChild(zipEle);
    locationEle.appendChild(tempEle);
    appContainer.appendChild(locationEle);

    zipcodeInput.value = '';
  });
```

We take the stream of zip codes and call `flatMap` on it. `flatMap` works just like regular `map` except it takes a stream of streams, pulls the value out of each stream, and makes it available in the stream returned from the method. This means it will flatten out the streams created by our request to the weather API and give us the values from those streams to act on, namely, the objects of zip codes and temperatures.

The last part uses our trusty `forEach` to get each piece of data and add it to the page. Everything in the callback is vanilla JavaScript. We construct the elements and add them to the page. Then we empty out the value of the `zipcodeInput`.

![Initial Add to Page](https://cdn.auth0.com/blog/reactive-programming/initial_add_to_page.png)

Reload the page in the browser, and submit a couple zip codes. You will see new elements added to the page that have the zip code and temperature in it. Sick!

Now that we have the temperatures showing on the page, we need to make sure they are updated. We can create a stream that will output a value at an interval that we specify. However, we need to make sure we can get all the zip codes that have been entered so far. To do this, we can use a `ReplaySubject`. A `ReplaySubject` can subscribe to a stream and will remember all the values that come down that stream. Then it can replay them whenever we want.

```javascript
// Create stream that can replay all zips at will
const replayZipsStream = new Rx.ReplaySubject();
zipcodeStream.subscribe(replayZipsStream);
```

Here we are creating a new `ReplaySubject` and then subscribing it to our `zipcodeStream`. This means our `ReplaySubject` will remember all the zip codes that we enter. Let's use it!

```javascript
// Create a timer to refresh the data
// and update the page
Rx.Observable
  .interval(20000)
  .flatMapLatest(() => replayZipsStream)
  .flatMap(zipTemperatureStreamFactory)
  .forEach(({ zip, temp }) => {
    console.log('Updating!', zip, temp);

    const locationEle = document.getElementById(`zip-${zip}`);
    const tempEle = locationEle.querySelector('.temp');

    tempEle.innerHTML = `${temp}&deg;F`;
  });
```

The first thing we do is create a stream that will output a value at a specified interval. The value is nothing we care about. We just want to act when we see that value. We then use a new method, `flatMapLatest`, to flatten the stream we get from the callback function, which is just our `ReplaySubject`. The reason we use `flatMapLatest` instead of `flatMap` is because we want to make sure that our `replayZipsStream` only has one subscriber on it. If we used `flatMap`, we would be adding multiple subscribers to the same `ReplaySubject`, which would cause us to send out a bunch of extra requests to the weather API. After all this, we will have a stream of zip codes like we did when adding a zip code to the page. So we can operate on it the same way. We use `flatMap` and pass it our factory function that will make a request to the weather API. Lastly, we iterate over each one we get back and update the data on that page.

![Timer in Action](https://cdn.auth0.com/blog/reactive-programming/timer_stream.png)

Reload the page one last time, and add a few zip codes. You will see them added to the page, like normal. If you wait 20 seconds, you will see our message in the console that tells us things have been updated. Depending on how much the temperature has changed in those 20 seconds, you may not see anything change on page. If you want the iterval to run more or less often, you can change the number that we gave `Rx.Observable.interval` to suit your needs.

## Using With Auth0 Lock

Now, say you're using streams like a boss. You decide you want to use [Auth0 Lock](https://auth0.com/lock) for your application's authentication solution. How would we implement it? Well, it's super simple. Most of the work is handled by the library. We just need to make sure the Lock modal shows on a button click. Let's do it!

First, we need to include the library, initialize Lock, and add a login button that will show the modal.

```html
  <button id="login">Login</button>
  <script src="http://cdn.auth0.com/js/lock/10.x.y/lock.min.js"></script>
  <script>
    // Initiating our Auth0Lock
    var lock = new Auth0Lock(
      'YOUR_CLIENT_ID',
      'YOUR_NAMESPACE'
    );

    // Listening for the authenticated event
    lock.on("authenticated", function(authResult) {
      // Use the token in authResult to getProfile() and save it to localStorage
      lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
          // Handle error
          return;
        }

        localStorage.setItem('idToken', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
      });
    });
  </script>
```

The only thing left is to turn the click events from the button into a stream, and open the modal whenever we see a piece of data on that stream.

```javascript
Rx.Observable
  .fromEvent(document.getElementById('login'), 'click')
  .forEach(() => lock.open());
```

That's it! You're set.

## Gotta Stream Them All

Thinking in terms of observables or streams may be a little strange at first. The way I think about it is as a collection of events over time instead of as a singular event. Once this clicks, thinking of all events from the DOM as streams will be a piece of cake. RxJS allows you to easily create and interact with these streams of events. It can be a powerful way to keep the logic of your application and the code itself much cleaner than when using other frameworks or libraries. As always, reach out in the comments, and let us know how you're liking RxJS!
