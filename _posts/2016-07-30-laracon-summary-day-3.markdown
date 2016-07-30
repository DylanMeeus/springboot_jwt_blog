---
layout: post
title: "Laracon 2016 Summary - Day Three"
description: "The final day of Laracon focused on design, performance, software estimation and much more. Check out our summary of Laracon US day three."
date: 2016-07-30 08:30
alias: /2016/07/30/laracon-summary-day-3/
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#4a4a4a"
  image: "https://cdn.auth0.com/blog/laravel-auth/logo.png"
tags:
- Laravel
- Laravel-5.3
- Laracon
- LaraconUS
---

Day three of [Laravel US Conference](http://laracon.us/) consisted of talks about design, performance tuning, software estimation, API tools and Laravel. Seven speakers took to the stage and it was a scintillating experience. Currently, a specific date has still not been set on the release of Laravel 5.3. Taylor made it known to everyone that it will be released in a couple of weeks. Check out our recap of [day one](https://auth0.com/blog/laracon-summary-day-1/) and [day two](https://auth0.com/blog/laracon-summary-day-2/) in case you missed them.

**[Adam Wathan](https://twitter.com/adamwathan)** was back again with a presentation on *Curing the Common Loop*. He talked about how for-loops and conditionals can be totally eliminated from a piece of code in place of higher-order functions that allows for elegant code expression. Adam did a live coding session where he eliminated for-loops, conditionals and temporary variables in an app and replaced them with Laravel Collection methods. Check out the slides for his workshop [here](https://speakerdeck.com/adamwathan/curing-the-common-loop).

**[Fabien Potencier](https://twitter.com/fabpot)**, creator of Symfony and founder of Sensiolabs gave a talk on *PHP Performance Tuning with Blackfire*. He talked about performance issues with PHP and PHP frameworks. And he gave insightful advice about how to track down these issues with [Blackfire](https://blackfire.io/). Check out the turorial he made on using Blackfire in your applications [here](https://blackfire.io/docs/24-days/index). Blackfire is available now on [Laravel Forge](https://forge.laravel.com).

{% include tweet_quote.html quote_text="40% of users abandon a website that takes more than 3 seconds to load - Fabian Potencier" %}

**[Chuck Reeves](https://twitter.com/manchuck)** gave a talk on *Practical Software Estimation*. Chuck dropped nuggets of wisdom on how to provide estimates for a software project. He made an emphasis on why developers should estimate because they are the ones writing the code. Chuck compared developers to cardiologists and gave an example of how the latter can not be coerced into performing a surgical operation for 5 hours instead of 8. As a developer, if it takes you 5 hours to complete a task, do not negotiate for less! Check out the slides [here](http://www.slideshare.net/manchuck/stop-multiplying-by-4-laracon).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">No estimation talk ever will be complete without Bayes Theorem. When you get new info, the level of uncertainty will decrease <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Michael Dyrynda (@michaeldyrynda) <a href="https://twitter.com/michaeldyrynda/status/759057447898054656">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Jason McCreary](https://twitter.com/gonedark)**, creator of [laravelshift.com](https://laravelshift.com/) gave a talk on *YAGNI With Laravel*. **YAGNI**, an acroynm for *You Aren't Gonna Need It*. It is a principle of extreme programming that states a programmer should not add functionality until deemed necessary. He advocated *KISS* - Keep it simple, stupid!. He talked about how programmers are always tempted to over-engineer solutions, how developers pride themselves on complex architectures. With **YAGNI**, you will:

* Know when to defer decisions until tomorrow
* Trust your ability to pivot quickly
* Write less code

You need to upgrade your Laravel app without moving a muscle? check out [laravelshift.com](https://laravelshift.com/).

**Note**: Don't call **YAGNI** on security features

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">Don’t customize your app namespaces. Just leave it app, it’s short and sweet. KISS — <a href="https://twitter.com/gonedark">@gonedark</a></p>&mdash; Laravel News (@laravelnews) <a href="https://twitter.com/laravelnews/status/759090695604797441">July 29, 2016</a></blockquote>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">“…perfection is attained not when there is nothing more to add, but when there is nothing more to remove” <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Michael Dyrynda (@michaeldyrynda) <a href="https://twitter.com/michaeldyrynda/status/759089775856889856">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Colin DeCarlo](https://twitter.com/colindecarlo)**, gave a talk on *Keeping Eloquent Eloquent*. Eloquent is Laravel's ORM. He talked about the mistakes he's made using Eloquent. He advocated the following when using Eloquent:

* On every model, create a defaults property and populate with key value pairs of attribute and value. Merge with set values
* Don't circumvent the abstraction layer provided by Eloquent
* Use the source

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">Cannot believe I am in the same room as big cat demarco!<a href="https://twitter.com/hashtag/Laracon?src=hash">#Laracon</a></p>&mdash; Rob Drimmie (@RobDrimmie) <a href="https://twitter.com/RobDrimmie/status/759099135152840704">July 29, 2016</a></blockquote>

**[Jeremy Lindblom](https://twitter.com/jeremeamia)**, Active contributor to [Guzzle](https://github.com/guzzle/guzzle), [AWS SDK](https://github.com/aws/aws-sdk-php), & creator of [Superclosure](https://github.com/jeremeamia/super_closure) talked about *Lumen, Guzzle & Swagger*. He talked about API endpoints, HTTP methods, and how developers can leverage Swagger, Lumen and Guzzle to develop great RESTFUL APIs and microservices.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">&quot;Swagger is a representation of your representational API that is a representation of your data&quot; <a href="https://twitter.com/jeremeamia">@jeremeamia</a> <a href="https://twitter.com/hashtag/Laracon?src=hash">#Laracon</a></p>&mdash; Sara Bine (@sara_bine) <a href="https://twitter.com/sara_bine/status/759126262937812992">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Documentation still doesn’t help us cross the bridge between client and server but the bridge is there <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Michael Dyrynda (@michaeldyrynda) <a href="https://twitter.com/michaeldyrynda/status/759128479853981696">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Which of the hundred different ways would you like to implement JSON? HATEOAS, HAL, JSON-LD, JSON-API, something else? <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Michael Dyrynda (@michaeldyrynda) <a href="https://twitter.com/michaeldyrynda/status/759121971137228800">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Ryan Singer](https://twitter.com/rjs)**, Product Strategist at Basecamp, gave a talk on *Design: Case Study*. He talked about the processes involved in creating a product from rough sketch to a functional UI that's finally handed over to the developers.

![Tower of Interface Design](https://pbs.twimg.com/media/CokFDq6UkAA7Gtl.jpg)
_Tower of Interface Design_

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Flows -&gt; Affordances -&gt; 2D layout<br><br>The layout isn’t important; you won’t have to rewrite any code. Views are separate <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Michael Dyrynda (@michaeldyrynda) <a href="https://twitter.com/michaeldyrynda/status/759138285738274816">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">A real concrete UI is good for giving developers requirements <a href="https://twitter.com/hashtag/Laracon?src=hash">#Laracon</a>  - <a href="https://twitter.com/rjs">@rjs</a></p>&mdash; Prosper Otemuyiwa (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/759145459172708356">July 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr"><a href="https://twitter.com/rjs">@rjs</a>&#39;s &quot;Tower of Interface Design&quot;<br><br>Domain experience<br>Situations (withdrawal)<br>Flows (fast cash)<br>Accordances (inputs)<br>2D Layout<a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a> 💎</p>&mdash; Troy Harvey (@troyharvey) <a href="https://twitter.com/troyharvey/status/759150508867215360">July 29, 2016</a></blockquote>

## Conclusion

Laracon US 2016 is actually the first Laravel Conference to have about 95% of technical talks. All the speakers were great and the talks were educative and insightful.

If you are just getting started in developing Laravel 5 apps, check out our [laravel app tutorial](https://auth0.com/blog/2016/06/23/creating-your-first-laravel-app-and-adding-authentication/). You need an alternative means of adding authentication and authorization to your Laravel apps? Sign up for a free Auth0 account and get your user authentication set up in few minutes using our [laravel quickstarts](https://auth0.com/docs/quickstart/webapp/laravel). Building an api using Laravel and wondering how to add authentication using JWT? Auth0 got you covered. Check out our [laravel api quickstarts](https://auth0.com/docs/quickstart/backend/php-laravel) to implement that in less than 10 minutes.

Many developers are already getting their hands dirty with Laravel 5.3 using the *dev* version. You can also try it out and tell us what you think in the comment section! Hopefully, in about 2 weeks from now, Laravel Scout, Laravel Passport, Laravel Notifications, Laravel Mailable and Laravel 5.3 will be officially released to the public.