---
layout: post
title: "7 Crucial Lessons That Will Save Your User Onboarding"
description: No two apps are identical, and so no two user onboarding processes should look the same. However, there are universal lessons to help you onboard new users.
date: 2016-05-13 8:30
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: "https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60"
design: 
  bg_color: "#171717"
  image: https://cdn.auth0.com/blog/user-onboarding-lessons/logo.png 
tags: 
- user-onboarding
- onboarding
- customer-success
related:
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-18-progressive-profiling
- 2016-04-14-safely-use-best-customer-retention-tactics
---

Everyone knows that retained customers are more valuable than acquired ones. With mobile apps especially, where only 2.3% of customers remain after 30 days, your loyal customers are the most important thing to your business. 

There are many theories about why customers churn so quickly in their early days, some believe downloading is so easy it’s basically noncommittal, while others believe that competition between apps drives users to switch frequently. 

The less-discussed and more obvious reason is this: Most apps suck at onboarding new users.

It doesn’t matter how much long term value your app provides, and it doesn’t matter how many customers your marketing strategy brings on, if you can’t get users from day 1  to day 30 without losing their business, your business has no chance. 

With this in mind, we compiled the seven most important lessons for onboarding new users.


## 1. Real World Use-Cases Are All Your Users Care About

The goal of onboarding is to show your users how to get value out of your product. While it can be tempting to explain the technicals of your product, the various features you spent hours developing, this doesn’t help users find value. You need to show them the direct benefits your product gives them, and how to use your product to achieve them.

A great example of focusing onboarding around real life use-cases is Spring, the mobile shopping app that recently raised [$25 million](http://fortune.com/2015/04/16/spring-raises-25-million/) off of a $90 million valuation. As a shopping app, Spring doesn’t have the most complicated UI: You scroll through and click what you want. But through clever onboarding, they show users the particular, real-life value Spring gives:


![Spring Onboarding](https://cdn.auth0.com/blog/user-onboarding-lessons/spring-onboarding.png)

Spring’s onboarding could detail the behavioral analytics behind their recommendation engine, or the infrastructure behind their daily updates, but instead they focus on how users actually get value from their app. 

### key takeaway:

Always focus your onboarding process on showing users how your app makes their lives better. If they can’t see a direct connection between the problems they face and the solutions your app provides, everything else is irrelevant. Your app's technical specs, development innovations, and success metrics should all take a backseat to the actual benefits it provides your users.

## 2. Your Product Itself Is Your Best Onboarding Tool

Your onboarding process should educate users by making them use your app. Think about the video games you played as a child (or last night). The early levels always introduced the basic building blocks of gameplay, before asking you to put it all together in harder levels later on.

Your onboarding process should operate along these same lines. You want to get users engaged in your app, and slowly introduce more complexity. You want them to learn your app by actually using it.

A great example of this sort of onboarding is Quartz, a news app that gives users the news through a texting format. Their onboarding looks like this:

![Quartz User Onboarding](https://cdn.auth0.com/blog/user-onboarding-lessons/quartz-onboarding.png)

Just by using the app, users are seamlessly onboarded.

### Key takeaway:

The best way to learn an app is to use it. Reading articles on how an app works gives you some cursory knowledge, but doesn’t come close to the familiarity you develop by actually exploring it.

## 3. Personalization Is The Fastest Route To Your “Aha!” Moment

Your “Aha!” moment is the point in onboarding when users finally “get” your product’s value. One of the fastest ways to do this is to tailor their onboarding experience to their personal information, by using social authentication.

Think about social apps like Instagram, that onboard users by connecting them with friends from other social networks. When users log into Instagram for the first time, and immediately see the photos of their best friends, they quickly internalize the value of the platform.

With Auth0’s social authentication, you can pull any information stored on their social accounts (friends, location, birthday, etc.). In your “Connections > Social” dashboard, you can pick which social platforms to support just by toggling a switch:

![Socual Connections](https://cdn.auth0.com/blog/user-onboarding-lessons/social-connections.png)

### key takeaway:

The whole point of onboarding is to teach users how to get value from your app. Make it easier for them to relate the process to their own life by building it around their personal information, which easily attained via Auth0’s social connections. With Auth0, you can easily integrate information from over [30 social platforms](https://auth0.com/docs/identityproviders) by clicking a button.

## 4. Successful Onboarding Takes A Human Touch

Every startup knows the importance of automation. It’s how you service 10,000 customers with a team of 20. It is for this reason that so many companies onboard users just by using their documentation. It scales well, but it takes away any personal connection. This doesn’t have to be a trade-off.

Kristen Craft, director of business development for [Wistia](http://wistia.com/), a video platform for businesses, [explains that with video](http://wistia.com/blog/video-familiarity) “You can express the full range of human emotions, explain things in great clarity, and generally appeal to the viewer's humanity.”

The benefit to this, in her words, is that “One video can speak to thousands of customers.”

Wistia’s own onboarding process reflects this. Instead of just giving you a series of articles to read, they give you this 5-minute video at the beginning of the [onboarding process](https://wistia.com/community/posts/jaio/are-you-using-video-in-your-new-user-onboarding):

![Wistia Onboarding](https://cdn.auth0.com/blog/user-onboarding-lessons/wistia-onboarding.png)

Users have someone personally walk them through the product, and it scales to any size.

### key takeaway:

The idea that you must sacrifice personal interaction for automation and scalability is a false dilemma. By including video instruction in your onboarding, you can scale human connection infinitely. Using video also allows you to demonstrate how your product works, condensing a ton of information into a relatively short period of time without overwhelming your users.

## 5. Users Need You To Meet Them Halfway With Targeted Email

Just because a user is in the onboarding process, it doesn’t mean you’ve locked down their business. According to a study by Oracle, within the first 90 days of the customer lifecycle is when they are [most likely to churn](http://conversionxl.com/onboarding-emails/). The best way to get out in front of this problem is with targeted email.

Auth0’s [Segment rule](https://github.com/auth0/rules/blob/master/rules/send-events-segmentio.md) allows you to segment your email list according to whether a user is logging in, or has just signed up. It's as easy as copy + pasting a block of code:

```js
function(user, context, callback) {
  if(context.stats.loginsCount > 1){
    sendEvent('Logged in');
  } else {
    sendEvent('Signed up');
  }

  function sendEvent (e) {
    var sioTrack = {
      userId: user.user_id,
      event: e,
      properties: {
        application: context.clientName
      },
      context: {
        "ip" : context.request.ip,
        "userAgent" : context.request.userAgent
      }
    };

    // Segment API returns 200 OK for all its request. For possible errors
    // you must use Segment's Debugger (https://segment.com/docs/libraries/http/#errors)
    request({
      method: 'POST',
      url: 'https://SEGMENTIO_WRITE_KEY@api.segment.io/v1/track',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(sioTrack),
    });
  }

  // don’t wait for the Segment API call to finish, return right away (the request will continue on the sandbox)`
  callback(null, user, context);
}
```

From within the Segment dashboard, you can toggle on the [Customer.io](http://customer.io/) integration to leverage Customer.io’s email automation. Engaging customers at the beginning of user onboarding will boost retention without you spending any extra time.

### key takeaway:

Personal engagement early in the useronboarding process lets users know you are invested in them, and increases the chances they’ll stick around. With targeted email automation, you can do this affordably and at scale. You can even take things a step farther and create a [custom rule](https://auth0.com/docs/rules) to target users based on more specific attributes, like recent activity or personal information.

## 6. Decision Fatigue Is The User Onboarding Killer

Asking users to make too many decisions early in the onboarding process will mentally exhaust them, until they’re not interested in your service anymore. This tiring process, called “decision fatigue” is the reason judges grant [65% ](http://healthland.time.com/2011/04/14/when-lunch-is-served-so-is-justice/)more convicts parole in the morning, when they’re fresh, than in the evening, when they’re exhausted.

With your app, you have to strike a balance between collecting necessary information and wearing your users out. The key to this is to figure out what the most essential information you need to collect is, and to ask for it incrementally. The app that is perhaps the best at this is Duolingo:

![Duoling User Onboarding](https://cdn.auth0.com/blog/user-onboarding-lessons/duolingo-onboarding.png)

After you click to sign up, these are the first three screens you see. You make three decisions, and you are all set up to start learning a new language with a complete plan. 

This gradual collection of information is called [progressive profiling](https://auth0.com/blog/2016/04/18/progressive-profiling/). With Auth0, you can easily implement it with our [Users API](https://auth0.com/docs/api/v2#!/Users/patch_users_by_id). The API collects user metadata in a “bucket” conveniently called “user_metadata” which you can update at any time throughout the customer’s lifecycle.

![Progressive Profiling](https://cdn.auth0.com/blog/user-onboarding-lessons/progressive-profiling.png)

### key takeaway:

If you force users to make too many decisions up front, you will mentally exhaust them. That tiredness will translate into inactivity. Avoid this by collecting information progressively, on an as-needed basis. Not only will this boost retention, but it will improve the quality of the data you collect, as users are less likely to hurry through and submit fake data if they’re only filling out a couple forms.

## 7. The Door Must Be Left Open For Users To Come Back

In an ideal world, building an user onboarding process would be a streamlined affair:

1. Identify what customer behaviors lead to retention
2. Build a process that encourages those behaviors and educates users
3. Sit back and enjoy your diminished churn rate

The reality is that no matter how well designed your process is, you can’t completely stop users from leaving during your user onboarding process. People get busy, life gets disrupted, and they bail on your onboarding process midway through.

The trick is this: They haven’t churned. In many of these cases, they’ll be coming back eventually, and you want to make sure when they do they aren’t completely lost. Your user onboarding process doesn’t just have to make it easy for new users to learn your product, it has to let returning users relearn your product quickly.

The way to do that is by centralizing your information somewhere users can easily reference. [Close.io](http://blog.close.io/), a sales CRM, does this with their “Getting Started” email:


![Close.io Getting Started](https://cdn.auth0.com/blog/user-onboarding-lessons/closeio-getting-started-emails.jpg)

Instead of making returning users restart the whole onboarding process, they give them a map to the various resources they might need to brush up on.

### key takeaway

Users are going to go away and come back. If you don’t make it easy for them to transition back into using your app, you’re making it easy for them to walk away entirely. Store your onboarding information in a format that allows returning users to go straight to the parts they don’t remember, and doesn’t force them to re-study the parts they already know.
