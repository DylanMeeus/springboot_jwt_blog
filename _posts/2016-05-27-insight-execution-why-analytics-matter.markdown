---
layout: post
title: "Insight and Execution: Why Analytics Matter"
description: 3 ways you can use Analytics to build your product
date: 2016-05-27 9:30
alias: /2016/05/27/insight-execution-why-analytics-matter/
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#0D3F41"
  image: https://cdn.auth0.com/blog/analytics-matter/logo.png
tags:
- analytics
- user-experience
- product-building
related:
- 2016-05-20-21-tips-for-remote-working
- 2016-04-21-want-skyrocketing-growth-you-need-to-offer-a-free-trial
- 2016-04-14-safely-use-best-customer-retention-tactics
---

# Insight and Execution: Why Analytics Matter

Your goal in building a product is to create something that gives value to your customers. That feeling of delight you experience when a product makes your life easier, that's what customers are paying you for.

You can improve your product forever. There is always a way to deliver more value to your customers. The question is, how do you decide what to improve?

You can use either analytics or intuition to drive your development. If you use analytics, you can be certain you're developing what customers want. If you [use your intuition](https://amplitude.com/blog/2016/05/19/square-built-data-driven-culture/), well, good luck with that.

With this in mind, we've broken down three of the most powerful ways you can use analytics to develop your product.

## 1. Personalize The User Experience

Personalization is one of the most powerful tools you have for driving engagement with your app, but you have to collect data to do it. Rigorous collection and integration with data was the basis of the fastest-growing social network of all time: Facebook.

Many have heard the story of Facebook's [seven friends in ten days](http://andrewchen.co/my-quora-answer-to-how-do-you-find-insights-like-facebooks-7-friends-in-10-days-to-grow-your-product-faster/) metric. Early on, they discovered that if a user added seven friends in their first ten days, they were much more likely to stick around and keep using Facebook. The company united around getting every user to hit that goal, and the rest is history.

All Facebook had to do for this viral growth [was make it easy](https://www.quora.com/What-are-some-decisions-taken-by-the-Growth-team-at-Facebook-that-helped-Facebook-reach-500-million-users) to pull your other contacts into the network. It might seem like some high-tech magic, but it's something you can do very simply in your own app.

Using Auth0's [Single Sign On](https://auth0.com/docs/sso/single-sign-on), or SSO, you can collect such customer data from other social platforms automatically.

Through Auth0's Social Connections dashboard, all you have to do is toggle a switch to enable SSO for any of the 30+ platforms Auth0 supports. This way, if a user authenticates through Facebook, Twitter, LinkedIn, Google, or any other provider, you can immediately pull their contact list and connect them with users in their social network.

![Social Connections](https://cdn.auth0.com/blog/analytics-matter/social-connections.png)

If you want to make all of your users feel valuable, the first step is to find out who you're dealing with. This means contact lists, but also locations, birthdays, work history, education background, and so much more. With [Auth0's Social Connections](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/), you can easily collect all of these things.

## 2. Build The Right Product/Feature

With analytics, you can build the product your customers want before they know they want it.

{% include tweet_quote.html quote_text="With analytics, you can build the product your customers want before they know they want it." %}

One of the best real-world examples of this is Netflix. The streaming service collects an [insane amount of data](https://pilotfiber.com/blog/how-netflix-know-what-you-want-to-watch/), including:

* Your viewing habits relative to the time of day
* The devices you watch from
* What customers similar to you watch

This data helped Netflix create a show they knew viewers would love before they'd ever shot a single scene, *House of Cards*. While Netflix couldn’t have known the show would go on to be nominated for [32 Emmy](https://en.wikipedia.org/wiki/House_of_Cards_(U.S._TV_series)#Accolades) awards, they knew the show would be successful before they gave it the green light. How? Customer analytics.

![House of Cards - Analytics](https://cdn.auth0.com/blog/analytics-matter/house-of-cards.png)

[*source:* [BrainFoodTV](http://brainfoodtv.com/site/wp-content/uploads/2014/03/Screen-Shot-2014-03-12-at-22.14.05.png)]

After studying their user analytics, Netflix noticed there was overlap in three groups of viewers: Kevin Spacey fans, David Fincher fans, and fans of the original British version of *House of Cards*. Putting this knowledge to work, Netflix bought the rights to the US remake of the show, hired David Fincher to direct it, and cast Kevin Spacey as the lead.

Netflix invested millions in *House of Cards*, but the risk was lessened because they were certain an audience existed for the content.

Knowing you have an audience before you build something is always helpful, but it's only one piece of the puzzle. You also have to find a way to retain that audience once they're engaged, and analytics can help with that too.

## 3. Create A Truly Sticky App

Your app might be extremely engaging to a customer when they first open it, and completely lose a customer's interest one day later. In fact, the average Google app loses [90% of its daily active users](http://andrewchen.co/new-data-shows-why-losing-80-of-your-mobile-users-is-normal-and-that-the-best-apps-do-much-better/) within the first 30 days.

The key to creating a sticky app, one which keeps customers engaged, is to use analytics to discover how to engage not just new customers, but old ones as well. One example of this is *behavioral cohorting*.

[Amplitude](https://amplitude.com/), a mobile and web analytics service, [describes behavioral cohorting](https://amplitude.com/blog/2015/12/15/how-to-increase-growth-through-retention-analysis/) as “Looking at all your users *who performed a specific action* (or set of actions) and how that's correlated with their retention, instead of looking at all your new users.”

Heyday, an app that automatically journals your life, used behavioral cohorting to [compare retention rates](https://amplitude.com/resources/Amplitude-Heyday-Behavioral-Cohorts-casestudy.pdf) among customers who used different features. In the following graph, customers who used Heyday to create and edit photo collages are represented in blue. Customers who only viewed photos in Heyday are shown in red.

![House of Cards - Analytics](https://cdn.auth0.com/blog/analytics-matter/heyday-analytics.png)

[*source:* [Amplitude](https://amplitude.com/resources/Amplitude-Heyday-Behavioral-Cohorts-casestudy.pdf)]

The first day after downloading is labeled “Day 1” on the graph, and it marks the beginning of a sharp decline. For the next 14 days, both groups of customers lessened and lessened. But after the 14th day, the group of customers who used the collaging and editing features stopped hemorrhaging. The other group continued to lose customers.

Realizing that customers who used the photo editing features were more likely to remain engaged, Heyday focused their resources into building out this set of features, instead of wasting energy on features less likely to retain customers.

The customer is always right. The features they use the most are your best features, and are the ones the make your app sticky. Once you know which features to prioritize, you can focus your resources where they matter most.

## Executing On Information

Auth0 isn't an analytics platform, but it makes it easy to execute on the insights your analytics platform provides. For example, with [Auth0 Rules](https://auth0.com/docs/rules) you can take analytic insights and turn them into actionable strategies quickly and easily.

 Auth0 Rules are functions that execute every time a user authenticates to your application. Let's say you built an app where users authenticate through Twitter. If your analytics platform says that email engagement with customers boosts retention, you can use Auth0 Rules to collect customer email addresses and automatically contact them when they authenticate.

The first step here would be to get their email address when they authenticate with Twitter. The rule for this is only two lines of code:

```
user.app_metadata = user.app_metadata || {};
var email = user.email || user.app_metadata.social_email;
```

After storing their email address, you'd use Auth0’s [Segment Rule](https://auth0.com/docs/scenarios/segmentio) to send customer data to Segment, and use Segment’s [Customer.io integration](https://segment.com/docs/integrations/customer.io/) to automate your emailing. Easy.

The code would look like this:

```
function(user, context, callback) {

  if(user.signedUp){
    sendEvent('login');
  } else {
    sendEvent('signup');  
  }

  function sendEvent(e)
  {
    var sioTrack =  
    {
      secret: "YOUR SEGMENTIO SECRET",
      userId: user.user_id,
      event: e,
      properties: {
        application: context.clientName,
        ip: context.ip,
        agent: context.userAgent
      },
      context: {
        "providers" : { "all": false }
      }
    };

    request({
      method: 'POST',
      url: '  https://api.segment.io/v1/track',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(sioTrack),
    },
    function (err, response, body) {
      if(err) return callback(err, user, context);
      if(e === 'signup'){ user.persistent.signedUp = true; }
      callback(null, user, context);
    });
  }
}
```

In less than an hour, you could go from [analysis to execution](https://auth0.com/learn/powering-user-analytics-identity/) and increase your retention rate with Auth0.

## Analytics Keep You In Growth Mode

The key to sustaining rapid growth is to keep experimenting. You should always be trying new things, building onto your product to make it better for your customers.

However, if you want that experimentation to be effective and not just a resource drain, it needs to be informed by the best analytics you can provide. Experimentation is your vehicle for growth, but analytics is the engine.
