---
layout: post
title: "5 Ways to Make Your App More Secure in Less than 20 Minutes"
description: "How to improve your app's security with features like MFA, encryption and more with just a few lines of Javascript."
date: 2015-10-22 14:34
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "4F496F"
  image_size: "110%"
  image: https://cdn.auth0.com/blog/security-post/security-post.png
tags:
- Security
related:
- 2015-08-20-from-theory-to-practice-adding-two-factor-to-node-dot-js
- 2015-12-29-how-paypal-could-have-avoided-account-hack
- 2015-12-17-json-web-token-signing-algorithms-overview
---

From Ashley Madison to Home Depot to Sony, it feels like every week, there’s a new high-profile security breach where millions of user records with sensitive information gets leaked to hackers.

Fundamentally, this happens because security is hard. Hackers are experts in security, but you probably aren’t, even as an experienced developer. This stacks the deck against you—as you build out your authentication and identity system while you scale, you may not recognize where you’re creating opportunities for the bad guy.

Moreover, security gets de-prioritized on your roadmap because it’s hard to build and isn't immediately urgent.  When you get around to worrying about security, it’s too late—you’ve had a breach and you need to go into damage control mode.

When you finally come out the other side, you need to do a massive overhaul of your systems and company culture to pay off your accumulated “security debt” from years of neglect . . . if you’re lucky and your company still exists.

But the security landscape is changing. With identity-as-a-service providers like Auth0, you’re able to outsource security to experts whose 100% focus day and night is to make sure that your user data is secure. Your IaaS becomes a platform on top of which you can easily layer on additional security services that protects your user data as you grow and scale.

{% include tweet_quote.html quote_text="With identity-as-a-service providers like Auth0, you’re able to outsource security to experts whose 100% focus day and night is to make sure that your user data is secure." %}

## An App Store for Adding Security to Your App

When you add a new security measure to your homegrown identity system, like multifactor authentication (MFA), you need to wire it up to your code by hand. This can be very time consuming, add considerable code complexity, and leave room for inconsistencies and errors.

With Rules in Auth0, you’re able to add your new security feature—like MFA, encryption and more—with just a few lines of Javascript. The code lives on Auth0, executes in a sandboxed environment there, and runs every time a user logs in. You get a familiar, consistent interface to your user model and that makes it easy to use and creates system-wide reliability.

Adding security services to your app becomes as easy as adding an app to your phone in Apple’s App Store or Google Play.

### How Rules work

Rules in Auth0 are code snippets written in Javascript that are executed as part of the authentication process. They essentially allow you to extend the Auth0 API with your own customizations, and without having to write any additional code on your end.
![Auth0 Rules](https://cdn.auth0.com/blog/5-ways-to-make-your-app-more-secure/auth0-rules.png)
When a user signs up, logs in, or authenticates in general, an authentication request is made to Auth0 (Step 1). After the user authenticates in step 3, the rules are run on step 4 and the result is passed back to the App.

It’s after the user authenticates, but before we’ve logged in the user that we can add more constraints around login to increase the app’s security. MFA is just one example of this.

 We’re able to take all kinds of contextual data about the user to evaluate whether an additional security measures should be triggered—which goes a long way towards protecting sensitive user data and app integrity.

Here are 5 simple Rules that you can use today to improve your app’s security—and each one shouldn’t take more than 20 minutes to set up.


## 5 Security Rules

### 1. Multifactor Authentication

```
function (user, context, callback) {

  var CLIENTS_WITH_MFA = ['{REPLACE_WITH_YOUR_CLIENT_ID}'];
  // run only for the specified clients
  if (CLIENTS_WITH_MFA.indexOf(context.clientID) !== -1) {
    // uncomment the following if clause in case you want to request a second factor only from user's that have user_metadata.use_mfa === true
    // if (user.user_metadata && user.user_metadata.use_mfa){
      context.multifactor = {
        //required
        provider: 'duo',
        ikey: 'DIXBMN...LZO8IOS8',
        skey: 'nZLxq8GK7....saKCOLPnh',
        host: 'api-3....049.duosecurity.com',

        // optional. Force DuoSecurity everytime this rule runs. Defaults to false. if accepted by users the cookie lasts for 30 days (this cannot be changed)
        // ignoreCookie: true,

        // optional. Use some attribute of the profile as the username in DuoSecurity. This is also useful if you already have your users enrolled in Duo.
        // username: user.nickname,

        // optional. Admin credentials. If you provide an Admin SDK type of credentials. auth0 will update the realname and email in DuoSecurity.
        // admin: {
        //  ikey: 'DIAN...NV6UM',
        //  skey: 'YL8OVzvoeeh...I1uiYrKoHvuzHnSRj'
        // },
      };
    // }
  }

  callback(null, user, context);
}
```

(Auth0 Rule for [Duo Security](https://github.com/auth0/rules/blob/master/rules/duo-multifactor.md))

Multifactor authentication has gone from a luxury that only the biggest enterprise companies offer to their employees to an expected security feature even in consumer apps like [Twitter](https://blog.twitter.com/2013/getting-started-with-login-verification).

 After a user logs in with their username and password, MFA requires that the user also prove that they are in possession of the phone (or another device or separate account) that’s associated with the user account. This additional layer of security protects the user even when their username and password has been compromised.
![Multifactor Authentication Flow](https://cdn.auth0.com/blog/5-ways-to-make-your-app-more-secure/multi-factor-authentication-flow-video.gif)
You can set up the Rule in fewer than 10 minutes and it will trigger multifactor authentication via [Duo Security](http://duosecurity.com/) or Google Authenticator to happen upon login. Here’s how it works:

1. The user logs in.
2. The MFA service kicks in and prompts the user to authenticate with their second device. If it’s the user’s first login, they’re prompted enroll their device with the MFA provider and that gets associated with their user account.
3. The user is granted access to the app.

Setting up the Rule is as easy as flipping a switch, selecting your MFA provider, and then configuring the associated Rule.
![Choosing MFA provider](https://cdn.auth0.com/blog/5-ways-to-make-your-app-more-secure/choosing-mfa-provider.png)
What’s especially powerful about the Rule is that you can easily configure MFA to get triggered on different conditions, like:

* Geographic location or change in location
* Type of network used
* Device used to login or change in device

And to do that, all you need to do is write a bit of extra conditional logic in Javascript for your Rule. This helps you tailor how onerous the MFA burden is. You can have MFA triggered every time the user logs in, or only under abnormal conditions.

Here’s an example of a modified Rule that triggers MFA when the user accesses the app from a different device or location.

```
`function (user, context, callback) {

  var deviceFingerPrint = getDeviceFingerPrint();

  if( user.lastLoginDeviceFingerPrint !== deviceFingerPrint ){

    user.persistent.lasLoginDeviceFingerPrint = deviceFingerPrint;

    context.multifactor = {
      ignoreCookie: true,
      provider: 'duo'
    };
  }

  callback(null, user, context);

  function getDeviceFingerPrint(){
    var shasum = crypto.createHash('sha1');
    shasum.update(context.request.userAgent);
    shasum.update(context.request.ip);
    return shasum.digest('hex');
  }
}`
```

### 2. SMS when there’s a log in from a different IP

```
function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  var currentFingerprint = clientFingerprint();

  var previousFingerprint = user.app_metadata.lastDeviceFingerPrint;
  user.app_metadata.lastDeviceFingerPrint = currentFingerprint;

  auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
    .then(function(){
      if( !user.phone ) return callback(null, user, context);
      if( !previousFingerprint ||
        previousFingerprint === currentFingerprint ) {
        return callback(null, user, context);
      }

      notifyUser(function(e){
        return callback(e,user,context);
      });
    })
    .catch(function(err){
      callback(err);
    });


  //Computes user device fingerprint with userAgent + IP address
  function clientFingerprint()
  {
    var shasum = crypto.createHash('sha1');
    shasum.update(context.request.userAgent);
    shasum.update(context.request.ip);
    return shasum.digest('hex');
  }

  //Sends user SMS via Twilio
  function notifyUser(done){
    var twilioAccount = 'YOUR TWILIO ACCOUNT';
    var twilioAuthToken = 'YOUR TWILIO AUTH TOKEN';

    request.post( {
      url: 'https://api.twilio.com/2010-04-01/Accounts/' + twilioAccount + '/Messages.json',
      auth: {
        'user': twilioAccount,
        'pass': twilioAuthToken,
      },
      form: {
        'Body': 'You\'ve logged in from a different device or location.',
        'To': user.phone,
        'From': '+18668888888'
      }
    }, function(e,r,b) {
      if (e) return done(e);
      if (r.statusCode !== 201) return done(new Error(r.statusCode));
      return done(null);
    });
 }
}
```

(Auth0 Rule for [sending SMS on log in from different IP ](https://github.com/auth0/rules/blob/master/rules/sends-sms-with-twilio.md))

Alterting users to suspicious activity can empower users to protect themselves from hackers by giving them advance notice to change their passwords or set up MFA.

This rule sends a text message to the user’s phone whenever someone logs in to their account via a different device or location from the previous login.

Here is a similar notification that [Facebook sends](http://piersdillonscott.com/tag/geolocation/) in email form:
![Facebook Security Email Form](https://cdn.auth0.com/blog/5-ways-to-make-your-app-more-secure/facebook-security-email.png)
Note that they don’t just notify you that a new device has logged in, they also issue you a call to action to protect your account information if it wasn’t you that logged in.

And even when it’s the user herself who has logged in from a different location or device, the text message won’t be a nuisance. That you’re looking out for their security will impress them. In addition, you could issue an alternative call to action to set up MFA to further strengthen the security on their account.

### 3. User fraud score

```
function (user, context, callback) {
  // score fraudscore once (if it's already set, skip this)
  user.app_metadata = user.app_metadata || {};
  if (user.app_metadata.socure_fraudscore) return callback(null, user, context);

  var SOCURE_KEY = 'YOUR SOCURE API KEY';

  if(!user.email) {
    // the profile doesn't have email so we can't query their api.
    return callback(null, user, context);
  }

  // socurekey=A678hF8E323172B78E9&email=jdoe@acmeinc.com&ipaddress=1.2.3.4&mobilephone=%2B12015550157
  request({
    url: 'https://service.socure.com/api/1/EmailAuthScore',
    qs: {
      email:  user.email,
      socurekey: SOCURE_KEY,
      ipaddress: context.request.ip
    }
  }, function (err, resp, body) {
    if (err) return callback(null, user, context);
    if (resp.statusCode !== 200) return callback(null, user, context);
    var socure_response = JSON.parse(body);
    if (socure_response.status !== 'Ok') return callback(null, user, context);

    user.app_metadata = user.app_metadata || {};
    user.app_metadata.socure_fraudscore = socure_response.data.fraudscore;
    user.app_metadata.socure_confidence = socure_response.data.confidence;
    // "details":[  
    //     "blacklisted":{  
    //        "industry":"Banking and Finance",
    //        "reporteddate":"2014-07-02",
    //        "reason":"ChargeBack Fraud"
    //     }
    // ]
    user.app_metadata.socure_details = socure_response.data.details;

    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function(){
        callback(null, user, context);
      })
      .catch(function(err){
        callback(null, user, context);
      });
  });
}
```

(Auth0 Rule for [Socure](https://github.com/auth0/rules/blob/master/rules/socure_fraudscore.md))

If you’ve created an online marketplace like AirBnB or eBay, protecting your buyers and sellers from fraud is one of the most important things you can do to increase the trustworthiness of the marketplace and ensure that more transactions happen there.

The Rule above calculates a fraud score for every user based on their email address and IP address. It uses the cloud service [Socure](http://socure.com/), which aggregates data from social media, offline identity verification services, and publicly available data on the web to determine whether a user is real or fake.

You can use that data to protect your app and your users by putting users with high fraud scores on a watchlist, or require additional verification before they can transact with other users.

And the Rule will get you the information you need at the time of registration, not after the user has a history of fraudulent transactions on the site—by which point, it could be too late.

### 4. Force email verification

```
function (user, context, callback) {
  if (!user.email_verified) {
    return callback(new UnauthorizedError('Please verify your email before logging in.'));
  } else {
    return callback(null, user, context);
  }
}
```

(Auth0 Rule for [forcing email verification](https://github.com/auth0/rules/blob/master/rules/email-verified.md))

Facebook showed the power of using the user’s email address to make your app ridiculously viral. The user's [name@college.edu](mailto:name@college.edu) email address shows the app developer that the user attends College. That means that the app developer can add the user to network College instead of dropping them into an empty app where they have to build their own experience from scratch.

Yammer did the same with [name@company.com](mailto:name@company.com) email addresses, and it became the fastest growing enterprise app ever as a result. Today, this tactic is a tool in the toolbox of ludicrously fast-growing SaaS companies like Slack to leverage the company network to add as many users as quickly as possible.

To make this work from a security standpoint, the user must prove that they actually own the email address and belong to the network signified by their email address. This is where the email verification process comes into play: have your app email the user with a unique, obscure, automatically-generated link to a page. That will force them to prove that they have access to the email account by logging in and clicking on the link to verify.

If you don’t have this email verification step, you’ll show an imposter or hacker sensitive information internal to the company, and that would be disastrous.

This Rule denies any user who hasn’t verified their email address from logging in. What’s great about implementing email verification this way is that it doesn’t complicate your existing authentication code. Rules can be chained together and turned on and off individually, which keeps things simple and nicely modular.

### 5. Encrypt sensitive data

```
function (user, context, callback) {
  user.app_metadata = user.app_metadata || { };
  user.app_metadata.private_data = encrypt({
    license_key: '1234567',
    social_security_number: '56789'
  });

  callback(null, user, context);

  function encrypt(data) {
    var iv = new Buffer(configuration.ENCRYPT_IV);
    var decodeKey = crypto.createHash('sha256')
      .update(configuration.ENCRYPT_PASSWORD, 'utf-8').digest();
    var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
    return cipher.update(JSON.stringify(data || {}), 'utf8', 'base64') + cipher.final('base64');
  }
}
```

(Auth0 Rule for [encrypting sensitive data](https://github.com/auth0/rules/blob/master/rules/encrypt-sensitive-data.md))

Encrypting sensitive user data minimizes the damage that occurs if hackers compromise a user’s account or find a way to leak user data.

{% include tweet_quote.html quote_text="Encrypting sensitive user data minimizes the damage that occurs if hackers compromise a user’s account or find a way to leak user data.
" %}

Recently, crowdfunding site Patreon announced that it had been [hacked](http://motherboard.vice.com/read/the-whole-works-is-in-there-hackers-dump-data-from-patreon-crowdfunding-site). Attackers got away with 2.3 million email addresses, user names, and shipping addresses—plus, it included private messages sent via the site’s internal messaging platform of a highly personal nature.

But it could’ve been worse.

As a crowdfunding platform, Patreon stored user tax information as well, and if that got leaked, it would  have been disastrous for the site’s members. However, Patreon encrypted all of the tax information with a 2048-bit RSA, and stored the encryption keys on a separate server that wasn’t compromised. That meant that sensitive and personally-identifying tax information that could have been used for rampant identity theft remained secure.

Use this Rule to provide that protection to your user. This Rule takes sensitive data, like a user’s social security number or his license key, encrypts it, and stores it as [metadata](https://auth0.com/docs/rules/metadata-in-rules) associated with the user account.

## Do Good and Do Well
![Trello Pricing](https://cdn.auth0.com/blog/5-ways-to-make-your-app-more-secure/trello-pricing.jpg)
These Rules quickly and easily add extra security to your app to protect your users—and if you bundle them together, you have something you can charge more for.

Use them to assemble an [enterprise tier](https://auth0.com/blog/2015/08/18/how-to-go-upmarket-and-grow-your-revenue-by-20x/), charge 5x your basic tier, and use that to grow your revenue by 20x.

Not only will that help you make more money, it will give you a profit incentive to keep improving the security on your app, aligning you and your customers’ interests for the long term.
