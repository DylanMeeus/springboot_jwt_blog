---
layout: post
title: "Integrate Auth0 Into Your Existing SaaS Tools"
description: Using Auth0 Rules, all your SaaS tools can become part of your authentication procedure
date: 2016-04-07 13:00
alias: /2016/04/07/integrate-auth0-into-your-existing-saas-tools/
author:
  name: Diego Poza
  mail: diego.poza@auth0.com
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design:
  bg_color: "#203E62"
  image: https://cdn.auth0.com/blog/integrate-your-saas-tools/logo.png
tags:
- auth0-integration
- auth0-rules
- saas-tools
- mailgun
- mixpanel
- analytics
- minfraud
- salesforce
related:
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2015-08-20-from-theory-to-practice-adding-two-factor-to-node-dot-js
- 2015-09-30-auth0-passwordless-email-authentication-and-sms-login-without-passwords

---

At Auth0 we do what we do best—user authentication.  SaaS is all about these types of specialities. Any SaaS company should concentrate on what it does best, and outsource the rest. You should use SaaS providers for your analytics, your customer communication, your storage, and, of course, your user authentication.

This makes it all the more important that any SaaS provider you use integrates with others, sharing data, and providing both you and your customers with a seamless experience. That’s why we developed [Rules](https://auth0.com/docs/rules).

## What Are Rules?

Rules are Javascript code snippets that run as part of a customized login process on Auth0 servers.

![How rules work](https://cdn.auth0.com/blog/integrate-your-saas-tools/rules-diagram.png)

* Step 1: Your app initiates an authentication request to Auth0.
* Step 2: Auth0 routes the request to an Identity Provider through a configured connection.
* Step 3: The user authenticates successfully.
* Step 4: The `user` object representing the logged in user is passed through the Rules pipeline and returned to the app.

This entire process is executed as part of the Auth0 authentication process—no extra infrastructure or code is needed on your servers. Each Rule is passed 3 parameters:

1. A `User` object that comes from the identity provider
2. A `Context` object which contains information about the current login, such as the device used, or where the login was attempted.
3. A `Callback` indicating whether the Rule was successfully completed or not.

With just this information, you can use Rules to handle specific requirements of your app, and pass important user data to any of your SaaS providers. For authentication, you could:

* Limit logins to a specific region
* Add information to a user profile, such as their security role
* Check the user's last password reset

Using your other SaaS providers, you could:

* Enrich the customer profile using external sources
* Add login events and user information to your analytics platform
* Trigger external events such as email campaigns or Slack notifications

Each of these would run immediately up on login.

## Why Use Rules?
The following are some of the reasons of why you should use rule.

1. **Improved reporting accuracy:** Events that are triggered server-side complete with a much higher degree of confidence than those that are attempted client-side, which can be blocked by firewalls, errant browser extensions, or code errors
2. **Real-time updates:** Depending on the service you are implementing with Rules, you can get real-time updates of user sign-ins, along with any data you sent via the API.
3. **Easy to create & run:** Implementation is through just a few lines of Javascript in our webtask sandbox. No extra technical debt or product development required.
4. **Sequencing:** Any number of Rules can be run on log in. That means that you can run each of the 4 Rules, and more, below each time a user logs in.


## Some examples of how to integrate your SaaS tools with Auth0
Let's see some of the most popular SaaS tools that are used by our users.

### Send New User Emails Through Mailgun
<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/integrate-your-saas-tools/Mailgun.png" alt="Mailgun" />
</div>


[Mailgun](http://www.mailgun.com/) is a set of APIs that allow you to send, receive, and track email through code. It manages the delivery process to improve delivered rates, and produces analytics of why emails weren’t delivered.

If you’re using Mailgun for your email delivery, you can set up a Rule that will send new users an initial email when they first sign up

The persistent property `SignedUp` tracks whether this is the first login or subsequent ones.

```
function(user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  if (!user.app_metadata.signedUp) {
    return callback(null, user, context);
  }

  request.post( {
    url: 'https://api.mailgun.net/v3/{YOUR MAILGUN ACCOUNT}/messages',
      auth:
      {
        user: 'api',
        pass: '{YOUR MAILGUN KEY}'
      },
    form: {
      'to': user.email,
      'subject': 'YOU JOINED US!',
      'from': 'us@myapp.com',
      'text': 'Great! Head over to our site to get started!'
    }
  }, function(e,r,b) {
    if (e) return callback(e);
    if (r.statusCode !== 200) return callback(new Error('Invalid operation'));

    user.app_metadata.signedUp = true;
    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
    .then(function(){
      callback(null, user, context);
    })
    .catch(function(err){
      callback(err);
    });
  });
}
```

The same type of Rule can easily be changed to [send an email to an administrator](https://github.com/auth0/rules/blob/master/rules/mailgun.md) on that initial sign in.

Find this rule [here](https://github.com/auth0/rules/blob/master/rules/mailgun.md).

### Tracks Logins In MixPanel
<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/integrate-your-saas-tools/Mixpanel.png" alt="Mixpanel" />
</div>

Analytics are only as powerful as the underlying data. Adding an analytics Rule to your signing in process allows you to not only track individual logins with your preferred analytics SaaS provider, but also pass your analytics user-specific data to use.

{% include tweet_quote.html quote_text="Analytics are only as powerful as the underlying data." %}

This Rule sends [MixPanel](https://mixpanel.com/) a `Sign In` event and includes the application the user is signing in to as a property.

```
`function (user, context, callback) {

  var mpEvent = {
    "event": "Sign In",
    "properties": {
        "distinct_id": user.user_id,
        "token": "{REPLACE_WITH_YOUR_MIXPANEL_TOKEN}",
        "application": context.clientName
    }
  };

  var base64Event = new Buffer(JSON.stringify(mpEvent)).toString('base64');

  request.get({
    url: 'http://api.mixpanel.com/track/',
    qs: {
      data: base64Event
    }
  });
}

// don’t wait for the MixPanel API call to finish, return right away (the request will continue on the sandbox)`
callback(null,user,context);`
```

This event will immediately be available in your Mixpanel dashboard, and available to analyze.

Find this rule [here](https://github.com/auth0/rules/blob/master/rules/mixpanel-track-event.md).

### Creates A New Lead In Salesforce On First Login
<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/integrate-your-saas-tools/Salesforce.png" alt="Salesforce" />
</div>

Customer Relationship Management (CRM) tools are a mainstay of modern sales. However, they have a common weakness—the salespeople.  Salespeople often forget to update their CRM, impacting the sales analytics for the company as well as their own sales pipeline.

Automating as much of the data entry process as possible is therefore important for sales teams. This Rule automates the generation of a new Lead in the Salesforce CRM when a user logs in to your app for the first time.

It checks whether this is the first login, then calls the Salesforce API to record the contact as a new Lead. It is using Salesforce REST APIs and the `resource owner` flow to obtain an `access_token`.

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

This Rule also includes another benefit of using Rules: easy error handling. If the Rule can’t complete, it sends an error message to a designated Slack channel, so the sales team knows an error has occurred and can update Salesforce manually.

Find this rule [here](https://github.com/auth0/rules/blob/master/rules/creates-lead-salesforce.md).

### Checking Fraud With MinFraud
<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/integrate-your-saas-tools/Minfraud.png" alt="Minfraud" />
</div>

MinFraud identifies possible fraud in online transactions, as well as suspect account logins and signups. The service uses factors such as geolocation, IP address, email, device and proxies to determine the likelihood a transaction is fraudulent.

This rule will send the user’s IP address, email address, and username (both in MD5 format) to MaxMind’s MinFraud API. The API will return the risk score for the transaction and this information can be leveraged within the Rule to block a login with a high risk score.

```
function (user, context, callback) {
  var _ = require('underscore');
  var request = require('request');
  var crypto = require('crypto');

  var MINFRAUD_API = 'https://minfraud.maxmind.com/app/ccv2r';

  var data = {
    i: context.request.ip,
    user_agent: context.request.userAgent,
    license_key: 'YOUR_LICENSE_KEY',
    emailMD5: user.email &&
        crypto.createHash('md5').update(user.email).digest("hex") || null,
    usernameMD5: user.username &&
        crypto.createHash('md5').update(user.username).digest("hex") || null
  };

  request.post(MINFRAUD_API, { form: data, timeout: 3000 }, function (err, res, body) {
    if (!err && res.statusCode === 200 && body && body.indexOf(';') >= 0) {
      var result = _.reduce(_.map(body.split(';'), function(val) {
        return { key: val.split('=')[0], value: val.split('=')[1] };
      }), function(result, currentItem) {
        result[currentItem.key] = currentItem.value;
        return result;
      });

      console.log('Fraud response: ' + JSON.stringify(result, null, 2));

      if (result && result.riskScore && (result.riskScore * 100) > 20) {
        return callback(new UnauthorizedError('Fraud prevention!'));
      }
    }

    if (err) {
      console.log('Error while attempting fraud check: ' + err.message);
    }
    if (res.statusCode !== 200) {
      console.log('Unexpected error while attempting fraud check: ' + err.message);
    }

    // If the service is down, the request failed, or the result is OK just continue.
    return callback(null, user, context);
  });
}
```

Find this rule [here](https://github.com/auth0/rules/blob/master/rules/fraud-prevention-with-minfraud.md).

## Wrapping up: Customizing Rules

These are only a few examples. Any of these Rules can be customized to your other SaaS tools and your apps needs. Using the Auth0 Dashboard, you can use these or any other template to start using Rules in your app right now, or you can build your own unique Rule for your SaaS. The power is there for you to use it.

![Auth0 provides lots of rule templates for you](https://cdn.auth0.com/blog/integrate-your-saas-tools/rule-templates.png)
