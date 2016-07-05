---
title: "7 Ways to 2x Your Revenue Growth by Putting Your User Data to Work"
layout: "post"
description: "Using Rules with Auth0 you can put your data to work and drive your marketing engine!"
date: 2015-09-11 09:00
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60design
design:
  bg_color: "#375F89"
  image: https://cdn.auth0.com/blog/post-images/datalogo_big.svg
  image_bg_color: "#B2D7FF"
  image_size: "60%"
tags:
- marketing
- rules
- Full-Contact
- Segment
- revenue
- slack
- auth0
related:
- 2016-04-18-progressive-profiling
- 2016-03-04-4-ways-to-turn-customer-support-into-a-growth-factor
- 2015-12-16-how-to-use-social-login-to-drive-your-apps-growth
---
Companies that consolidate customer data for marketing purposes show nearly [2x yearly annual revenue growth](http://www.totango.com/blog/2012/06/suffering-from-siloed-customer-data-time-to-get-that-business-in-order/) versus companies that have that information fragmented across different apps.

Yet your user table in your app contains incredibly valuable information that right now isn’t being shared with your marketing tools, and that’s a huge, missed opportunity.

Bring that information into the marketing tools that you use, and it’ll give you what will feel like marketing superpowers—you’ll be able to send targeted messages and offer truly personal service based on contextual user data. You’ll see response rates go up, and your revenue numbers will grow.

Here’s how to get your user account table to talk with your marketing suite of tools, without adding any additional infrastructure to your app.

## Where the Magic Happens

[Rules in Auth0](https://auth0.com/docs/rules) make it surprisingly easy to integrate your user table with other sources of data and to send that data to all of the tools that you use.

### How Rules work

Rules in Auth0 are code snippets written in Javascript that are executed as part of the authentication process. These rules live and are executed in Auth0, not in your code or in infrastructure that you have to set up.

That essentially allows you to extend the Auth0 API with your own customizations without having to write any additional code on your end.

[![Rules in Auth0](https://cdn.auth0.com/blog/rules-auth0/rules.png)](https://auth0.com/docs/rules)

When a user signs up, logs in, or authenticates in general, an authentication request is made to Auth0 (Step 1). After the user authenticates in step (3), the rules are run on step (4) and the result is passed back to the App.

This all happens at the time of authentication when we’re gathering valuable data around who the customer is, when they started using the product and when they most recently used it.

Instead of keeping that data locked up in the user table, you'll write rules that will pull data and send it to the different marketing services that you use. That’ll make your marketing much more on point and drive 2x revenue growth for your company.

### Why Rules: accurate and convenient

Developers have a number of ways to track data and integrate that with their various marketing tools. What makes rules in Auth0 so powerful is that it gives you accuracy and reliability in a no-hassle, worry-free way.

{% include tweet_quote.html quote_text="What makes rules in Auth0 so powerful is that it gives you accuracy and reliability in a no-hassle, worry-free way." %}

When you need accuracy, server-side analytics is where you turn. The problem is that installing server-side analytics is a super hairy and annoying problem that even having a unified, [clean API](https://segment.com/blog/the-way-server-side-analytics-should-be/) doesn’t solve.

On the other hand, client-side analytics are incredibly convenient—because you can just drop in a Javascript snippet to get Google Analytics and the like up and running—but they can be terribly inaccurate. That’s why running 2-3 client-side analytics services side-by-side to compare numbers is an all too common practice.

For example, when a user blocks Javascript, the code won’t execute and the data won’t get recorded. The same thing will happen if the user navigates away from the page before the code block gets executed. Client-side Javascript can conflict and result in buggy code. All of this makes for unreliable data that you need to be able to trust.

Auth0 rules run on the server, so you get the reliability of server-side analytics but with the convenience of client-side analytics. For your rules, all you need to do is to drop in a Javascript snippet, just like with client-side analytics.

* You don’t have to go through the complex process of wiring your internal code with API calls to analytics providers.
* You write your rules in the browser on Auth0, so you don’t need to write more code in your app or add any additional infrastructure.
* Rules are [sandboxed](https://webtask.io) and they run on Auth0, so they won’t break your app (and nobody elses) when they fail.

> Aside: Auth0 developed a specialized multi-tenant sandbox technology called [webtask](https://webtask.io) to run the untrusted code submitted by customers. Webtask will ensure that the code runs in isolation, with certain CPU, RAM and I/O limits and without interfering with other tenants.

{% include tweet_quote.html quote_text="Auth0 rules run on the server, so you get the reliability of server-side analytics but with the convenience of client-side analytics." %}

When analytics are a pain to set up and maintain, they add to your technical debt, you move slower on product, and you stop short of collecting enough data. When your data is inaccurate, at best, you’ll send marketing messages that people ignore or that piss people off. At worst, you won’t trust your data enough to look at it or use it at all.

## 7 Ways to Use Rules to Drive Your Marketing

### 1. Enrich Your User’s Profile

```
function (user, context, callback) {
  var FULLCONTACT_KEY = 'YOUR FULLCONTACT API KEY';
  var SLACK_HOOK = 'YOUR SLACK HOOK URL';

  var slack = require('slack-notify')(SLACK_HOOK);

  // skip if no email
  if(!user.email) return callback(null, user, context);
  // skip if fullcontact metadata is already there
  if(user.user_metadata && user.user_metadata.fullcontact) return callback(null, user, context);
  request({
    url: 'https://api.fullcontact.com/v2/person.json',
    qs: {
      email:  user.email,
      apiKey: FULLCONTACT_KEY
    }
  }, function (error, response, body) {
    if (error || (response && response.statusCode !== 200)) {

      slack.alert({
        channel: '#external_blog',
        text: 'Fullcontact API Error',
        fields: {
          error: error ? error.toString() : (response ? response.statusCode + ' ' + body : '')
        }
      });

      // swallow fullcontact api errors and just continue login
      return callback(null, user, context);
    }


    // if we reach here, it means fullcontact returned info and we'll add it to the metadata
    user.user_metadata = user.user_metadata || {};
    user.user_metadata.fullcontact = JSON.parse(body);

    auth0.users.updateUserMetadata(user.user_id, user.user_metadata);

    // don’t wait for the FullContact API call to finish, return right away (the request will continue on the sandbox)`
    return callback(null, user, context);
  });
}
```

(Get the [FullContact rule for Auth0](https://github.com/auth0/rules/blob/master/rules/get-FullContact-profile.md))

You can pull an amazing amount of data on new customers when they sign up and use that to enrich your user profiles and drive your external marketing campaigns.

[FullContact](https://www.fullcontact.com/developer/person-api/) offers an API keyed on the user’s email address to pull their real address, social media profiles, phone number, and company information. The rule above takes all of that and adds it to their user profile in Auth0.

![Full contact profile](https://cdn.auth0.com/blog/rules-auth0/full-contact-line-art-blue.png)

This is rough and dirty but incredibly effective way to add context to your customer interactions. Whenever you’re emailing or on a call with a customer, pull up their profile in Auth0 and look at their FullContact background information.

Use their location to figure out their timezone for easy scheduling. Look at their Twitter to see whether they’re an influencer. Peruse their tweets to see what they’re interested in for small-talk fodder. Check them out on Facebook to see if you have any mutual friends. Find out on LinkedIn whether you share an alma mater, any professional contacts or similar previous job experience.

### 2. Keep your team in the loop on new signups using Slack

```
function(user, context, callback) {
  // short-circuit if the user signed up already
  if (context.stats.loginsCount > 1) return callback(null, user, context);

  // get your slack's hook url from: https://slack.com/services/10525858050
  var SLACK_HOOK = 'YOUR SLACK HOOK URL';

  var slack = require('slack-notify')(SLACK_HOOK);
  var message = 'New User: ' + (user.name || user.email) + ' (' +  user.email + ')';
  var channel = '#some_channel';

  slack.success({
    text:  message,
    channel: channel
  });

  callback(null, user, context);
}
```

(Get the [Slack rule for Auth0](https://github.com/auth0/rules/blob/master/rules/slack.md))

When you keep the whole team in the loop on who’s signing up, you’re able to leverage the collective knowledge and network of your whole organization to close more deals.

This rule sends a message to your chosen [Slack](http://slack.com/) channel every time a new user signs up.

When you do this, you’ll be surprised how often someone on your team:

* Knows a new signup and is able to give them personal attention by reaching out;
* Recognizes the domain in the new signup’s email address, has friends at that company, and is able to work a warm intro to the prospect; or
* Will casually google the new signup and find out that they’re connected in some way, leading also to a warm intro.

These serendipitous events—made possible by sharing marketing data with the whole team—add up to more closed deals and more revenue.

### 3. Send Highly targeted Email Marketing

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

(Get the [Segment rule for Auth0](https://github.com/auth0/rules/blob/master/rules/send-events-segmentio.md))

When you email your entire list—for example, with a new feature announcement—it’s absolutely critical that you segment your list by recent activity.

For instance,

* If a user has logged in recently, you can expect that they’re up to date with the product. You can write to them with specificity and familiarity.
* If a user hasn’t logged in in over 90 days, it’s likely that they don’t even remember what your product does. You’ll need to remind them why you exist before you even go into the details about your new feature.

That’s why it’s so important that you get your user account data into your marketing tools. Using Auth0 rules to send user data into [Segment](http://segment.com/) is a super simple way to do this. Segment is a single hub that collects, manages and routes your customer analytics data to other apps that make use of it.

The rule above sends a “Logged in” or “Signed up” event to Segment whenever a user logs in or signs up. That event gets logged in Segment with a timestamp.

Turn on the [Customer.io](http://customer.io/) integration with Segment, and any data you send to Segment will go to Customer.io. You’ll be able to easily segment your email list based on the “Logged in” event so that you can send highly targeted, effective email marketing.

### 4. Analyze Sign up Data

```
function(user, context, callback) {
  if (context.stats.loginsCount > 1) {
    return callback(null, user, context);
  }

  var MY_SLACK_WEBHOOK_URL = 'YOUR SLACK WEBHOOK URL';
  var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

  var writeKey = 'YOUR KEEN IO WRITE KEY';
  var projectId = 'YOUR KEEN IO PROJECT ID';
  var eventCollection = 'signups';

  var keenEvent = {
    userId: user.user_id,
    name: user.name,
    ip: context.request.ip //Potentially any other properties in the user profile/context
  };

  request.post({
    method: 'POST',
    url: 'https://api.keen.io/3.0/projects/' + projectId + '/events/' + eventCollection + '?api_key=' + writeKey,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(keenEvent),
  },
  function (error, response, body) {

    if( error || (response && response.statusCode !== 200) ) {
      slack.alert({
        channel: '#some_channel',
        text: 'KEEN API ERROR',
        fields: {
          error: error ? error.toString() : (response ? response.statusCode + ' ' + body : '')
        }
      });
    }
  });

  // don’t wait for the keen API call to finish, return right away (the request will continue on the sandbox)`
  callback(null, user, context);
}
```

(Get the [Keen.io rule for Auth0](https://github.com/auth0/rules/blob/master/rules/send-events-keenio.md))

If you’re not visualizing your sign up data over time, you don't have a clue about whether your new user acquisition is working. You’re flying totally blind.

This rule sends an event to [Keen.io](http://keen.io/) every time a new customer signs up with the user’s ID and name that’s timestamped for when the event is sent.

Inside of Keen.io, it’s very easy to take that event data and create a graph which shows you whether new customer acquisition is increasing or decreasing over time.

![Keen io](https://cdn.auth0.com/blog/rules-auth0/keenio.png)

If you notice that a sharp increase at any point, you can identify the cause and then double down on that acquisition channel. Trace any sharp declines in new signups back to the changes you made on those days, take away any learnings, and reverse those changes if need be.

### 5. Send Handwritten letters to new signups

```
function (user, context, callback) {
  // short-circuit if the user signed up already
  if (context.stats.loginsCount > 1) {
    return callback(null, user, context);
  }

  var _ = require('lodash');

  var ZAP_HOOK_URL = 'REPLACE_ME';

  var small_context = {
    appName: context.clientName,
    userAgent: context.userAgent,
    ip: context.ip,
    connection: context.connection,
    strategy: context.connectionStrategy
  };

  var payload_to_zap = _.extend({}, user, small_context);

  request.post({
    url: ZAP_HOOK_URL,
    json: payload_to_zap
  });

  // don’t wait for the ZAP HOOK call to finish, return right away (the request will continue on the sandbox)`
  callback(null, user, context);
}
```

(Get the [Zapier rule for Auth0](https://github.com/auth0/rules/blob/master/rules/zapier-new-user.md))

One of the most powerful ways to make a personal connection with your customers is to send them handwritten letters and swag in the physical mail.

![Handwritten note](https://cdn.auth0.com/blog/rules-auth0/zapier.jpg)

It’s actually possible to make this happen without having to sit in a room all day writing letters and licking stamps. You can do it using only a simple Auth0 rule, [Zapier](http://zapier.com/) and [MailLift](http://maillift.com/). Here are the basic steps:

1. Set up the rule above in Auth0 to call a Zapier static webhook every time a new user signs up.
2. Get access to the MailLift app in Zapier by [accepting the developer invite](https://zapier.com/developer/invite/5630/15b5e2741c9014f3e9147c8902c85743/).
3. Set up the Zap in Zapier to send a handwritten letter every time the Auth0 rule calls the Zapier webhook. Zapier will give you the webhook URL which you’ll add to your Auth0 rule.

![Zapbook recipte](https://cdn.auth0.com/blog/rules-auth0/zapbook.png)

This showcases the power of Auth0 rules, as you’re able to register webhooks into your app to augment its functionality without having to build webhook support.

What you get is an amazing way to connect with customers in an automated, scalable way.

### 6. Track your leads in Salesforce

```
function (user, context, done) {
  user.app_metadata = user.app_metadata || {};
  if (user.app_metadata.recordedAsLead) {
    return done(null,user,context);
  }

  var MY_SLACK_WEBHOOK_URL = 'YOUR SLACK WEBHOOK URL';
  var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

  //Populate the variables below with appropriate values
  var SFCOM_CLIENT_ID = configuration.SALESFORCE_CLIENT_ID;
  var SFCOM_CLIENT_SECRET = configuration.SALESFORCE_CLIENT_SECRET;
  var USERNAME = configuration.SALESFORCE_USERNAME;
  var PASSWORD = configuration.SALESFORCE_PASSWORD;

  getAccessToken(SFCOM_CLIENT_ID, SFCOM_CLIENT_SECRET, USERNAME, PASSWORD,
    function(r) {
      if (!r.instance_url || !r.access_token) {
        slack.alert({
          channel: '#some_channel',
          text: 'Error Getting SALESFORCE Access Token',
          fields: {
            error: r
          }
        });

        return;
      }

      createLead(r.instance_url, r.access_token, function (e, result) {
        if (!result.id) {
          slack.alert({
            channel: '#some_channel',
            text: 'Error Creating SALESFORCE Lead',
            fields: {
              error: result
            }
          });

          return;
        }

        user.app_metadata.recordedAsLead = true;
        auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
      });
    });

  //See http://www.salesforce.com/us/developer/docs/api/Content/sforce_api_objects_lead.htm
  function createLead(url, access_token, callback){
    //Can use many more fields
    var data = {
      LastName: user.name,
      Company: 'Web channel signups'
    };

    request.post({
      url: url + "/services/data/v20.0/sobjects/Lead",
      headers: {
        "Authorization": "OAuth " + access_token
      },
      json: data
      }, function(e,r,b) {
        return callback(b);
      });
  }

  //Obtains a SFCOM access_token with user credentials
  function getAccessToken(client_id, client_secret, username, password, callback) {
    request.post({
      url: 'https://login.salesforce.com/services/oauth2/token',
      form: {
        grant_type: 'password',
        client_id: client_id,
        client_secret: client_secret,
        username: username,
        password: password
      }}, function(e,r,b) {
        return callback(JSON.parse(b));
      });
  }

  // don’t wait for the SF API call to finish, return right away (the request will continue on the sandbox)`
  done(null, user, context);
}
```

(Get the [Salesforce rule for Auth0](https://github.com/auth0/rules/blob/master/rules/creates-lead-salesforce.md))

You’ve captured a lead and gotten them to sign up for a trial. It’s time to put the inside sales team on the case of following up with leads and then closing the deal.

You need a CRM to manage what can quickly become a complex logistical problem.

This Auth0 rule creates a new lead in Salesforce when a new trial account signs up. The username you use to authenticate the API will appear as the creator of the lead in Salesforce.

Using [Salesforce](http://salesforce.com/) as your CRM to manage this kind of sales rather than eyeballing your Auth0 user list will make the whole process easier for you in a number of ways:

* You’ll know exactly when to follow up, you won’t just be arbitrarily picking prospects out of your Auth0 user list and shooting them an email.
* You’ll be able to send email and make phone calls from within Salesforce and that’ll give you open tracking, thread conversations and more, all for free, rather than having to switch over to a separate app like Gmail to send emails where your user data starts getting fragmented across multiple apps.
* Your sales team will more easily collaborate on the leads with them in one shared repository that they’re trained to use.

### 7. All OF The Above

If you run each of these individually you will have plenty of extra information and tools to make your marketing campaigns successful. But what if you ran them altogether?

Rules in Auth0 are run sequentially and you can run an arbitrary number of them. You could chain all of the above together to create a powerful marketing automation engine for every new signup and login.

You now have all the information you need on your user, you're tracking them through your funnel, and you’re reaching out to start the conversion process—all through rules, with zero infrastructure on your end. And, of course, you also have all of this information passed back to your app as well. With the simple application of Rules in the authentication pipeline, you’re suddenly able to take formerly silo’ed user data and put it to use to drive marketing processes and generate revenue.
