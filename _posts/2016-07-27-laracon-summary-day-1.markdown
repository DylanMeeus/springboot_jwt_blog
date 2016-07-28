---
layout: post
title: "Laracon 2016 Summary - Day One"
description: "Laravel 5.3 is around the corner. Learn more and get caught up on all the news coming out of Laracon US 2016."
date: 2016-07-28 08:30
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

The annual [Laravel US](http://laracon.us/) conference is upon us once again. Everyone is excited about the upcoming release of Laravel 5.3. Taylor Otwell and several Laravel Community members have been tweeting about changes and salient new features even weeks before now.

In today's short post, we'll recap all the big announcements coming out of Laracon US 2016. 4 incredible speakers mounted the stage today and there were lots of wonderful moments all through their talks. 3 of the speakers broke the *no live coding in a presentation* rule today and it was awesome!

[Adam Wathan](https://twitter.com/adamwathan) opened the Laravel Conference with his workshop on **Test Driven Laravel**. He literally created a simple twitter clone using test driven development. Adam also talked about his new side project - [Building Robust Laravel applications with TDD](https://adamwathan.me/test-driven-laravel/). Like I said earlier, no slides just live coding!

[Evan You](https://twitter.com/youyuxi) did a live demo on the new [Vuejs 2.0](https://vuejs.org/). Check out his slides for his Vue.js workshop [here](https://docs.google.com/presentation/d/16MpK3I2LZz47QdLg3uMNkCC3PqmM0znXF3-FdCEpics/edit#slide=id.g15faa8fa0f_0_60). Want to learn how to build a Vuejs 2.0 app? Check [here](https://auth0.com/blog/2016/07/14/create-an-app-in-vuejs-2/). If you want to learn how to add authentication to a Vuejs app, check out our [quickstarts](https://auth0.com/docs/quickstart/spa/vuejs).

[Chris Fidao](https://twitter.com/fideloper) covered a lot about **Servers For Hackers**. He talked about Security, Firewall, ipv6, iptables and Supervision. All the things he talked about can be found on [serversforhackers.com](https://serversforhackers.com/). You can also get his [book](https://book.serversforhackers.com/). With [webtask](https://webtask.io/), you can write serverless apps. You don't need to worry about server provisioning and scaling, **Auth0** takes care of that for you!

**Note:** Chris actually smashed a spider on stage, call that **Live de-bugging**!

## Taylor Otwell Laravel 5.3 Overview

[Taylor Otwell](https://twitter.com/taylorotwell) actually closed Day 1's talk with some pretty impressive announcements about new features coming to Laravel 5.3 and four major open source projects that will scale up the development time of any Laravel developer. I'll cover these new features in a bit.

### Laravel Scout

Laravel Scout is an optional drop-in package that offers full-text search for Eloquent Models. It ships with Algolia and offers a driver-based system so that anyone can actually integrate other full-text search systems. With Scout, after adding the `ScoutServiceProvider`, you'll be able to add a `Searchable` trait to your model and do something like so:

```php

Post::search('Prosper')->get(); // normal search
Post::search('Prosper')->paginate(20); // pagination option is also available
Post::search('Prosper')->where('category_id', 2)->get(); // inclusion of simple where clauses too

```

```php

Post::all()->searchable();
User::posts()->searchable();

```
### Laravel Passport

Laravel Passport literally blew my mind. Creating an OAuth2 Server can really be daunting, there are few PHP packages out there that you can use, but it still involves a lot of work to be done by the developer. Laravel Passport is an optional drop-in package that allows you to create an OAuth2 Server in about 5 minutes.  With Laravel Passport, you can get personal access tokens for users right from an Artisan command. It ships with Vue components for token generation, revocation and a robust API authentication out of the box. You can easily set scopes by just enabling the scope middleware.

Want a single API for both mobile and internal web app calls? Laravel Passport will take care of it via [JWT](https://jwt.io) tokens.

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">I&#39;ve been more excited this year about things coming out of <a href="https://twitter.com/LaraconUS">@LaraconUS</a> than of Apple&#39;s WWDC... Excellent work <a href="https://twitter.com/taylorotwell">@taylorotwell</a></p>&mdash; Martín Peverelli (@MartinPeverelli) <a href="https://twitter.com/MartinPeverelli/status/758459310267633664">July 28, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### Laravel Notifications

Laravel Notifications allow you to send quick updates to your users via services like SMS, Email and Slack. In your Notification class, you have a `via` and `message` method like so:

```php
.....
public function via($notifiable)
{
    return ['mail', 'slack', 'sms']; // notification drivers
}

public function message()
{
    // If it's a notification success message, here you go
    $this->line('You can now use webtask.io for your serverless apps')
    ->action('Button Text', 'http://auth0.com')
    ->line('Please check it out!')
    ->success()

    // If it's a notification error message, here you go
    $this->line('We had a problem with your intro mail ')
    ->action('Button Text', 'http://support.com')
    ->error()
}

Notifications also come with a responsive email template, detects email type (info, success, error) out of the box!

### Laravel Mailable

In Laravel 5.3, there's a less busy way to send emails. You can now send emails like so:

```php

// To one address
Mail::to($user)->send(new EmailClass($someParameter));

// To multiple addresses & queueing at the same time!
Mail::to('prosper@example.com')->cc('johndoe@example.com')->queue(new OrderComplete);
```

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">Big fan of that new mail api. The closure way always felt a bit clunky <a href="https://twitter.com/hashtag/laracon?src=hash">#laracon</a></p>&mdash; Freek Van der Herten (@freekmurze) <a href="https://twitter.com/freekmurze/status/758405374143819776">July 27, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Other features Taylor mentioned are as folows:

* Single Route file getting split into web.php and api.php in Laravel 5.3,,
* Elixir 6.0 ships with Laravel 5.3. Supports rollup and webpack by default.
* Timeouts in queue worker will not make it frozen. Instead, it will *let it go* and keep processing the next.
* Auth scaffolding moved from inline script/css with CDNs to a compiled js/css file
* Queueing greatly improved in Laravel 5.3
* Laravel 5.3 sets you up with boilerplate to work with Vue.js straight out of the box.

{% include tweet_quote.html quote_text="This hopefully will make your life a lot easier - Taylor Otwell" %}

## Conclusion

Day 1 of Laracon US has been incredible. Laravel 5.3 will no doubt attract more PHP developers to use Laravel to build their next set of applications because of all these insane features and packages that Laravel and its community provides. Laravel 5.3 will be released in few weeks from now because Taylor wants the documentation to include all the improvements and new features.

 To conclude, I'll leave you with a list of additional resources and links to help you both learn Laravel and stay up to date with the latest news and announcements.

 * [Laravel news](https://laravel-news.com/) - Latest Laravel news, also maintains a live blog for Laracon
 * [Laracasts](https://laracasts.com) - Learn everything about PHP and Laravel
 * [Matt Stauffer's blog](https://mattstauffer.co/blog) - Learn about the latest Laravel features
