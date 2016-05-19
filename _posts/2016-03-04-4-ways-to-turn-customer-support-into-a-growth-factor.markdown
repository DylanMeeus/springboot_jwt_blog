---
layout: post
title: "4 Ways To Turn Customer Support Into A Growth Factor"
description: Customer Support is crucial - Delight your users more than you think you need to and it will pay off big
date: 2016-03-04 1:30
author:
  name: Diego Poza
  mail: diego.poza@auth0.com
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design: 
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/customer-support/logo.png
tags: 
- customer-service
- growth-hacking
- customer-support
related:
- 2016-04-18-progressive-profiling
- 2016-04-19-supercharge-your-registration-process
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

Paul Graham, co-founder of prestigious startup fund Y Combinator, [believes](http://paulgraham.com/ds.html) that early founders don't try hard enough to delight their customers. 

This is a bit counter-intuitive, especially since Y Combinator also expects its companies to grow at the tremendous rate of [5-7% a week](http://www.paulgraham.com/growth.html). When we think about that kind of growth, we often think in terms of massive land-grabs and clever hacks, trying to find huge, underutilized acquisition channels and milking them for all they're worth. 

Customer service, on the other hand, seems like something you work on down the line when you want to bump your retention numbers and build a referral program—not something you do for growth right now. But this is a misconception. Growth, whether now or in the future, [is all about retention](http://avc.com/2015/07/growth-vs-retention/). You can't grow unless you retain the users you acquire.

For Graham, taking “extraordinary measures” to make your customers happy is one of the most powerful tools a startup has both for acquiring new users and retaining the ones it has. Do things to make every customer “feel that signing up with you was one of the best choices they ever made,” he says, and you'll have them for life. Plus, you’ll get their friends, and their friends, and their friends, and so on.

Customer support is actually an incredible kind of growth hack—put a little more effort into it than everyone else, and you'll bend your retention curve up while bringing in new people and establishing a foundation for awesome growth. 

Here are four ways to get started. 

## 1. Create A Personalized, Educational Email Campaign

When you get a customer's email address, you are getting access to something very powerful: their “direct line.” Email is still the most personal way you can reach out to your customers, short of a handwritten note or a phone call, and that potential for intimacy offers you an incredible opportunity to do some customer service as marketing. And unlike with a note or a phone call, you can send great emails at scale.

They can't, however, be one-size-fits-all. If the value your emails offer isn't tied into a customer's specific needs at that time, they'll end up archived or marked as spam.

That's why, to make customer support work as a growth factor at scale,  it's essential that your email campaigns are both behavioral—responsive to what people are actually doing—and automated. Add a specific goal that you can track and iterate on, and you're ready to go.

### Triggered campaigns

Good behavioral email campaigns rely on triggers, or specific user actions that *trigger *emails to be sent. Let's say you want to email those users who haven't logged in for a couple days with a list of reasons why coming back and subscribing would help them:  

![Customer.io automated emails](https://cdn.auth0.com/blog/customer-support/Customer-io-sample.png)

With an email marketing manager like [Customer.io](http://customer.io/), you can set up even more specific triggers to automate your campaigns. For instance, you could have an email sent to everyone who used your product a half-dozen times or less, spent 3-5 minutes in your Help documentation, and then logged off. 

You can use Auth0 to get those metrics into your marketing tool easily, first use [rules](https://auth0.com/docs/rules) to [send your data](https://github.com/auth0/rules/blob/master/rules/send-events-segmentio.md) into Segment, then enable [Segment](http://segment.io/)'s integration with Customer.io. Once you do that, every action your users take will send an “event” to Segment with a timestamp, and you'll be free to use it in targeting your messaging with Customer.io. Here's the rule for sending a “Loggin in” or “Signed up” event:

```
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

You'll want to be fairly precise with the triggers you choose to collect and use, but you don't need to nitpick too much: if you're providing value with your emails, it'll pay off at some point.

Shopify knows the value of pre-emptive customer support: after you sign up, after you finish some set up, but before you officially launch your store, someone from customer service reaches out to you directly.

![Shoppify Customer Support Onboarding Email](https://cdn.auth0.com/blog/customer-support/shoppify-onboarding-email.png)

Even if you know exactly what you're doing with Shopify, this email works. It demonstrates that this company really cares about what you're trying to accomplish. It also implies that you will, in the future, have extremely easy access to help when you need it. That's the kind of messaging that's going to keep you from going to a competitor in the long run.
 
And that's not just intuition talking. Relevant, automated emails have been demonstrated to drive [18x more revenue](http://myemma.com/blog/article/21-must-know-email-automation-stats) than one-size-fits-all broadcast emails. They get more clicks, they lift conversions, and even those who don't buy are more likely to make larger purchases in the future.

From building the beginnings of trust to upselling, email is one of the most powerful ways to turn the delight of your customers into revenue and growth.

## 2. Create A Customized Onboarding Flow

Onboarding is another process that needs to be structured around how individual users interact with your product. 

If you can't get your customers to their “aha! moments” fast enough, then you stand a good chance of losing them. After all, there's no momentum carrying them forward. They took a chance on your product, they're trying to see if it can do the job for them, and you need to show them that it can. 

Signposts that point out essential parts of your product's UI can be invaluable for getting a new user to see its core value quickly. If you want to know where people are having trouble finding it, you can either go quantitative and look at your analytics or go qualitative and try a [user test](https://www.usertesting.com/). That will let you watch people navigate your product in real time so you can track their experiences, warts and all. 

Once they're ramped up, you can use in-app announcements and indicators to show that new features or other enhancements are available. The easiest way to keep your service at the front of a customer's mind is to be compulsively informative about changes you're making.   

[Appcues](http://appcues.com/) makes a tool strictly for designing onboarding flows that lets you do all this. There's no coding involved so your marketing or customer support teams can do all the work of designing onboarding themselves. They can add hotspots, for example, little triggered buttons that give users information depending on what they're trying to do, or flows, which add overlays that guide users through entire sequences of pages:

![Appcues Onboarding helpers](https://cdn.auth0.com/blog/customer-support/appcues-onboarding.png)

Each step that you design into your onboarding flow can be modified and segmented based on the same kinds of user metrics used for marketing. This is essential because while the core value of your product may be basically the same for whoever uses it, different buyer personas are going to require different approaches.

Sending the right message, at the right time, to the right person—that's what an amazing onboarding experience is all about. When you're brought into a service gracefully, and with what feels like a full support team behind you, then you're much more likely to stick around not just in the short-term, but for a long time.

If a good onboarding process brings you to an “aha! moment” quickly, then it's likely to have an outsized influence on the [entire customer lifecycle](http://blog.profitwell.com/why-churn-is-the-silent-killer-of-your-saas-company). It cascades. So when you're looking for places to help your customers understand your product and what it's really about, look to the first few minutes and seconds of your onboarding process. Hard work there will pay off down the road.

## 3. Use Video Support To Build A Human Connection

Dropbox, way back in 2009, was a crazy idea. It's a good thing, for instance, that Drew Houston didn't listen to most of the comments he got after submitting it for consideration to [Hacker News](https://news.ycombinator.com/item?id=8863). But there was one that [must have](https://news.ycombinator.com/item?id=8869) caught his eye: “If you are looking for a wider audience... make a video where you lay out the case for use using simple examples from user point of view.”

That's just what they did. Realizing that most people couldn't even wrap their heads around the idea of a cloud-based storage system yet, Dropbox hired a studio to make them an “explainer video,” which they then embedded on their homepage:

![Dropbox introduction video](https://cdn.auth0.com/blog/customer-support/dropbox-video.png)

The move paid off with an immediate [10% jump in conversions](http://wistia.com/blog/explainify-five-benefits). But this kind of power is just scratching the surface of what video can do. 

As Wistia founder Chris Savage [points out](http://wistia.com/blog/evolution-of-video-goals), making videos that increase conversion rates is the first step—after that, you can use your videos to teach people about the problems your product solves and bring in *new *kinds of customers.

Using your subject matter expertise and experience to make videos about the *problems* expands your company's reach and builds legitimacy, like in this Wistia guide to [shooting video](http://wistia.com/library/shooting-video-with-an-iphone) with your iPhone:

![Wistia shooting video](https://cdn.auth0.com/blog/customer-support/wistia-tutorial.png)

It's not about getting customers. It's not about conversions. It's about teaching people some valuable skill, and that's an incredibly powerful tool. 

“In the long term, teaching videos can save you time, automate conversions, and better educate your audience,” [Savage says](http://wistia.com/blog/evolution-of-video-goals), “It can mean the difference between working with your customers to help them achieve their goals, and being stuck helping them understand what the heck your product does in the first place.”

Making videos like this will save your support staff time and energy responding to the kinds of questions that are better answered with videos, but it's also a great way to market your company. 

People see a video like that and they think, “Wow, this company spent money making a video just to help me solve a problem”—now that's customer support as marketing.

## 4. Let Customers Know When Features They Want Have Been Built

You always think you know what's best for your product, but you're probably wrong. The truth is, you don't even really know what your product is *for *until people start using it and telling you. And they will—as soon as you launch, you'll start hearing customers request new features.  

But these requests can be difficult to deal with. At some point, they can come to sound like a Greek chorus of various interpretations of your product: “x” user wants “y” while “z” user wants “b” and “a” doesn't want anything to change, etc. 

What's important is to maintain perspective. Don't drop everything because one customer said so, but don't let that prevent you from paying attention when you have a critical mass of requests for something.

[StatusPage.io](http://statuspage.io/), a website status as-a-service provider, has figured out a way to efficiently track feature requests, implement the most important ones first, and delight their customers in the process. To do it, they created an Excel chart where they write down, for each feature:

1. The customer who made the request
2. How much they expect to gain from fulfilling it

![Statuspage.io sample](https://cdn.auth0.com/blog/customer-support/statuspage.png)

This way, they can actually track whether or not the features customers want are beneficial to StatusPage's mission of [increasing ARPU](http://blog.statuspage.io/3-steps-to-increasing-our-average-revenue-per-user-by-2-4x). Then, when they build one, they can pull a list of customers who requested it and send out personalized emails to let them know what's going on:

![Email for New feature added](https://cdn.auth0.com/blog/customer-support/new-feature-added-statuspage.png)

Not only is this a great way to show your customers that you take their input seriously, it can be a great opportunity to upsell. After all, no one's going to your pricing page over and over to see what new features you're offering.  If a customer is flexible on price, but won't upgrade unless a certain feature becomes available on the next tier, an email like this is the only way to *ensure *yourself a chance at that revenue boost. 

When a technique lets you systematically add revenue and make your customers really happy at the same time, it's a no-brainer. 

## Make Customer Support Your Competitive Advantage

If you stop thinking about customer support as fundamentally reactive—user has problem, we solve problem—then you can start using it to open up whole new avenues for growth.   

It can sometimes take a bit of work to overcome that mental hurdle. We're not used to great customer service. We're used to waiting on hold and terrible menus and reps who speak in programmatic sentences. But as Paul Graham says, it's doable.

“Once you realize that existing conventions are not the upper bound on user experience,” [he says](http://paulgraham.com/ds.html), “it's interesting in a very pleasant way to think about how far you could go to delight your users.”

It's interesting, yes. It can also be a driving factor in your company's revenues and growth, so pick one of these strategies, get started today, and let us know how it goes. 
