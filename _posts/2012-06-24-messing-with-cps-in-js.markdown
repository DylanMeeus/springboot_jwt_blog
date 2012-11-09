---
layout: post
title: "Messing with CPS in JavaScript"
date: 2012-06-24 21:00
author:
  name: José
  url: http://joseoncode.com
  mail: jfromaniello@gmail.com
tags: 
- javascript
- node
---

> This might sound like bullshit but bear with me please.

I wont explain what is [Continuation Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style).

The example
-----------

Imagine that we need to create a function to retrieve the **arrival date** for a given **flight number** and **departure date**. The **departure date** is optional and if not specified, then we have to fetch the last flight with the flight number first. 

Something like this:

    /*
     * Fetch the arrival date for a given flight and departure date.
     * If departure date is not specified, then return last flight arrival date.
     */
    function getArrivalDate(flightNumber, departureDate){
      if(!departureDate){
        departureDate = request.getJson("http//airline.com/api/flights/" + flightNumber + "/last/").departureDate;
      }
      return request.getJson("http//airline.com/api/flights/" + flightNumber + "/schedules/" + departureDate).arrival;
    }

The problem is that this code is synchronous and is not the way you usually work in javascript. So, you might change to something like this:

    function getArrivalDate(flightNumber, departureDate, callback){
      if(!departureDate){
        request.getJson("http//airline.com/api/flights/" + flightNumber + "/last/", function(err, flight){
          request.getJson("http//airline.com/api/flights/" + flightNumber + "/schedules/" + flight.departureDate, function(err, flightSchedule){
            callback(flightSchedule.arrival);
          });
        });
      }else{
        request.getJson("http//airline.com/api/flights/" + flightNumber + "/schedules/" + departureDate, function(err, flightSchedule){
          callback(flightSchedule.arrival);
        });
      }
    }

There is duplication in the above code, let's try to apply DRY:

    function getArrivalDate(flightNumber, departureDate, callback){

      //But departureDate here is not optional, did you hear me?
      function calc(flightNumber, depDate, callback){
        request.getJson("http//airline.com/api/flights/" + flightNumber + "/schedules/" + depDate, function(err, flightSchedule){
          callback(flightSchedule.arrival);
        });
      }

      if(!departureDate){
       request.getJson("http//airline.com/api/flights/" + flightNumber + "/last/", function(err, flight){
          calc(flightNumber, flight.departureDate, callback);
        });
      }else{
        calc(flightNumber, departureDate, callback);
      }
    }

Now is better. By sure you can do something better than this using one of the gazillions of control-flow libraries for javascript and for node or using something like promises.

But for the sake of this experiment let's try to do something different now.

A CPS IF statement
------------------

With a function like this:

    var flow = {
      if: function(condition, ifTrue, next){
        if(condition){
          ifTrue(next);
        }else{
          next();
        }
      }
    };

then we can define our getArrivalDate as this:

    function getArrivalDate(flightNumber, departureDate, callback){
      flow.if(!departureDate, function(next){
        request.getJson("http//airline.com/api/flights/" + flightNumber + "/last/", next);
      }, function(err, flight){
        var depDate = departureDate || flight.departureDate;
        request.getJson("http//airline.com/api/flights/" + flightNumber + "/schedules/" + depDate, function(err, sched){
          callback(sched.arrival);
        });
      });
    };

The first callback: **fetch the last flight** is executed only if the condition **departure date is nully** is true. The second callback is executed right away if the condition is false or when the first callback fire it if the condition is true.

This simple example reads better than the standard IF and in my experience it makes much more sense with more complicated things.

What we did?
------------

What I did was to create an alternative IF construct with Continuation Passing Style and then what I accomplish is to use everything in this function as **Continuation Passing Style**. You can do the same for **loops** for instance (serial / parallel).

In other words I just bring [LISP](http://www.n-a-n-o.com/lisp/cmucl-tutorials/LISP-tutorial-17.html) to js.

The other way!
--------------

Another way is to avoid CPS at all. If you look at:

* [C# async-await](http://bit.ly/MIVgZ6)
* [F# asynchronous workflows](http://msdn.microsoft.com/en-us/library/dd233250.aspx)
* [Iced CoffeeScript](http://maxtaco.github.com/coffee-script/)
* [ecmascript vNext discussion?](http://wiki.ecmascript.org/doku.php?id=strawman:deferred_functions)
* and other functional languages...

All those languages has an alternative syntax to execute asynchronous methods *without continuation passing style* and GRANTED you will find that those play nice with the non-cps constructs.

Conclusion
----------

I think work flows with CPS invocation are better and easy to follow with **continuation passing style statements** than with the standard constructs.

In my humble opinion this is one common reason some people have a hard time to switch from synchronous to javascript- asynchronous. Which should be read as Direct Style vs Continuation Passing Style instead. Often people thinks that the problem is **callback nesting** but that one is easy to solve. 

Another interesting idea will be to create a language with an alternative syntax to execute async methods (defined as CPS) close to the "direct style" that compiles down to JavaScript LISPished. I think this is exactly what Iced CoffeeScript and [StratifiedJs](http://onilabs.com/stratifiedjs) already do.