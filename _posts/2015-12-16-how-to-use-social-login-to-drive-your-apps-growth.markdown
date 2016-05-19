---
layout: post
title: "How to Use Social Login to Drive Your App’s Growth"
description: Social login is the quickest way to engage your users and drive your growth
date: 2015-12-16 12:21
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design: 
  bg_color: #222228"
  image: https://cdn.auth0.com/blog/social-login-makes-apps-grow/logo.png
tags: 
- social-login
- app-growth
- increase-registrations
related:
- 2015-09-23-what-is-and-how-does-single-sign-on-work
- 2016-02-08-how-to-authenticate-on-android-using-social-logins
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

People look at social login as just an easier way to log in. That’s true, but it’s a bit simplistic. 

What gets overlooked is how the very best companies and stickiest products maximize social login not just at login but at every step of the customer journey. They pull user information to create more personal onboarding experiences and they pull social data to make addictive notifications that bring users back to the app.

Here are 3 ways to use social login to improve conversion rates, get users to activation as quickly as possible, and re-engage and retain users. In short, social login helps you broaden your funnel, turn users into customers, and drive down churn—which provides the basis for long-term and sustainable growth.

## Increase Your Sign Up Conversion Rate by 20%

Social login makes it super simple to sign up for a new product. You reduce friction by providing 1-click sign up rather than having to fill out multiple form fields, put in your email and select yet another password.

![Pinterest Social Login](https://cdn.auth0.com/blog/social-login-makes-apps-grow/pinterest-social-login.png)

It’s no surprise then that social login helps lift conversion rates. The numbers vary wildly on exactly how much conversion rates improve—and in addition, much of this data has been provided by social login providers themselves, who are obviously interested parties. However, the numbers generally show an improvement in conversion, and in some cases, very significant increases.

* “[40-60% increase](https://www.quora.com/What-impact-does-social-login-have-on-conversion-rates) in conversion rates with some reaching upwards of 130%”
* “Conversion rates [increase anywhere from 20-40%](https://www.quora.com/What-impact-does-social-login-have-on-conversion-rates) after social login implementation”
* “Conversion rates [increase up to 20%](https://www.quora.com/What-impact-does-social-login-have-on-conversion-rates)[”](https://www.quora.com/What-impact-does-social-login-have-on-conversion-rates)
* “Both options (traditional form plus social login) [converts 8.5% more](http://ux.stackexchange.com/questions/53155/any-stats-data-advocating-integrated-social-logins-over-traditional-user-passw) website visitors to form submitters”
* “Social login increases registration rates by [up to 50%](http://janrain.com/product/social-login/)”

![Website to Form Conversion](https://cdn.auth0.com/blog/social-login-makes-apps-grow/website-to-form-conversion.png)

Even MailChimp—which came out against social login after [experimenting with it for a month](https://blog.mailchimp.com/social-login-buttons-arent-worth-it/)—showed a 3.4% lift in conversion from landing to login. MailChimp ultimately decided to rip it out based on concerns around branding and design. Nevertheless, given that MailChimp deals with tens of millions of visitors a week, a 3.4% conversion rate improvement captured a huge absolute number of people with a minimal amount of work. 

### Key Takeaway

Per ounce of work, implementing social login is one of the quickest wins around for driving up your sign up conversion rates and widening your funnel.

<div class="" style="text-align: center;"><img style="margin: 0; max-width: 250px;" src="https://cdn.auth0.com/docs/media/landings/sl-what-is/what-is-social-login.png" alt="Social Login with Auth0" />
</div>

With an identity as a service provider like Auth0, you get nearly every [social login](https://auth0.com/learn/social-login) option without having to do any additional work. Turning on a social login provider is a matter of flipping a switch rather than learning yet another API.

![Enabling Social Login in Auth0](https://cdn.auth0.com/content/social-login/enabling-social-providers-2.gif)

Then [customize the login](https://auth0.com/docs/libraries/lock/customization) to emphasize social login or even potentially only allow social login. A/B test different configurations to optimize your conversion rate.

![Login Customization](https://cdn.auth0.com/blog/social-login-makes-apps-grow/login-customization.png)

## Activate Users During Onboarding Immediately via Personalization

Personalizing your onboarding flow is one of the most powerful ways to improve your activation rate and turn more trial prospects into paying customers. 

But how can you personalize your onboarding flow for people you don’t know anything about? They just signed up and haven’t used your product at all.

The answer is Facebook. Or Google, Twitter, GitHub and LinkedIn. On all of these social networks that we use, we’ve grown a massive bodies of information about ourselves that you as an app developer can use to tailor a personal onboarding experience.

![Facebook Social Login Setup in Auth0](https://cdn.auth0.com/blog/social-login-makes-apps-grow/facebook-setup.png)


Here is a short list of user attributes you can pull from [Facebook via social login](https://auth0.com/docs/connections/social/facebook):

* Basic Profile
* Home town
* About Me description
* Email
* Location
* Birthday
* Website 
* Education History
* Work History
* Friend List
* Friend’s Likes
* User’s Likes
* And more . . . 

You can use all of that information to make the onboarding experience incredibly personal. For example, after you sign up to Instagram via Facebook, the app’s personalized onboarding flow kicks in and they show you your friends staring right back at you.

![Instagram On Boarding](https://cdn.auth0.com/blog/social-login-makes-apps-grow/instagram-.png)

That gets you to the “aha!” activation moment very quickly. Rather than having to build a follower list manually out of vague recommendations, the app is able to pull the exact people you want to follow (your friends) via Facebook Graph API after social login. You immediately have a highly relevant and personal feed, and that shows you the value of Instagram right away.

Instagram heavily emphasizes social login on their home screen. Log in with Facebook is the top and highlighted option, whereas email is put underneath in plaintext.


<div class="" style="text-align: center;"><img style="margin: 0; max-width: 250px;" src="https://cdn.auth0.com/blog/social-login-makes-apps-grow/instgram-login.PNG" alt="Instagram Social Login" />
</div>

### Key Takeaway

Don’t leave your onboarding flow generic, delivering the same experience to everyone no matter how different they are. Do whatever you can to personalize your onboarding flow. For many apps, that means pushing the user through social login and using the information culled from their network to create a highly personal onboarding experience. 

[Appcues](http://appcues.com/) is a user-onboarding-as-a-service that makes it super simple to create personalized user onboarding flows. As an incredibly easy way to get started with personalized onboarding flows, take the info that you pull from social login and drop it into your onboarding messaging using simple user properties like `{aboutMe}`, `{website}` and `{educationHistory}`. 

![Appcues Welcome](https://cdn.auth0.com/blog/social-login-makes-apps-grow/appcues-welcome.png)

A more advanced technique is to distill social login information into buyer personas. For example, suppose that you pull a user’s job history from Facebook or LinkedIn social login. You can segment trial prospects into 4 groups, your 4 buyer personas: engineer, marketer, product manager, and designer. Then giving each a different onboarding flow tailored to their user case.

![Role Based OnBoard](https://cdn.auth0.com/blog/social-login-makes-apps-grow/role-based-onboard.png)

## Drive 3x Engagement with Push and Email Notifications

According to mobile analytics platform [Localytics](http://info.localytics.com/blog/push-messaging-drives-88-more-app-launches-for-users-who-opt-in), users who enable push notifications have nearly 3x the engagement rate versus those who disable push. That’s because user notifications via push on mobile or email are one of the biggest drivers of engagement and re-engagement.

We’re all familiar with notifications that tell us what has happened to us—for instance, when someone likes or comments on our Facebook post. Or, when someone mentions us on Twitter or hearts our photo on Instagram. 

The problem with those notifications is that they require that the users themselves are already active. In the words of former [Facebook product manager Meenal Balar](http://firstround.com/review/heres-what-a-real-growth-strategy-looks-like-road-tested-by-facebook-and-remind/): “We found that the notifications we were sending to our most engaged users didn't make a huge impact — they were coming back to the site every day anyway.” 

Where you’ll make the biggest impact with notifications is by engaging *inactive* users. Foursquare, for example, is able to email you with a personal, relevant message even if you haven’t been active in the app. It will notify you with where your friends have been going and what they’ve been liking.

![Foursquare personalized email](https://cdn.auth0.com/blog/social-login-makes-apps-grow/foursquare-email.png)

That shows the massive power of driving users to make friend and following relationships in your app. You can deliver effective notifications based on what connections are doing in the app because you know that they’ll be relevant and interesting to the user. To complete the loop, the notification will reactivate the user and get them back in the app.

It’s social login that provides the basic social graph upon which your app’s social graph will be built. Like in Instagram, as above, the moment you sign up, you can connect to the social graph you’ve painstakingly built on Facebook or Twitter. Further, as social connections join the app, you can notify the user and ask them to make that connection inside of your app as well.

<div class="" style="text-align: center;"><img style="margin: 0; max-width: 250px;" src="https://cdn.auth0.com/blog/social-login-makes-apps-grow/instagram-notifications.PNG" alt="Instagram Notifications based on Social Profiles" />
</div>

The upshot is that the user’s social graph inside of your app will be stronger, and that will provide the basis for more relevant notifications. This can re-engage your users in your app, showing them how their friends are using at the value they get from it. Ultimately, what you’re aiming for is a “smile graph”, where [retention](https://amplitude.com/blog/2015/11/24/cohorts-to-improve-your-retention/) might dip initially, but over time, users get reactivated and they become active in the app again. Retention then curves back up and growth takes off. 

![Evernote Smile Graph](https://cdn.auth0.com/blog/social-login-makes-apps-grow/evernote-smile-graph.png)

### Key Takeaway

Social login strengthens connections in your app which provides the basis for notifications that improve retention. Make sure that you’re using the information you get from social login over the entire customer lifecycle, not just during onboarding.

To Janet Choi at Customer.io, [notifications about what your friends are doing](https://customer.io/blog/persuasive-emails.html) are among the most powerful because of a neurobiological mechanism in the human brain called the “framing effect.” We as humans don’t process wins and losses the same—we fear loss much more than we enjoy gain. What results is the emotional trigger commonly known as FOMO, or fear of missing out, which is a powerful driver in social apps to get people to re-engage to see what they’re missing.

[Customer.io](http://customer.io/) is a SaaS product that makes it easy to send lifecycle emails based on what happens in your app. You can use it to set up a simple recurring email where you point out what your friends are doing in the app.

For instance, at social-location check-in app Swarm, they take a very literal approach to this tactic. Approximately every 2 months, they sent out an email with the subject “You’re missing your friends’ check-ins”. It includes a count of how many of my friends checked in and how many check-ins they logged with a call to action to satisfy your FOMO, open the app, and join in on the fun.

![Swarm Email](https://cdn.auth0.com/blog/social-login-makes-apps-grow/swarm-email.png)

## It’s Better Together

Social login is so useful because our social and professional connections provide the foundation for so much of what we do both for fun and at work. Fundamentally, we rarely have fun and get stuff done alone—we do it in social and professional contexts. 

When you connect via social login, you’re importing that context into the app to get up and running more quickly and to make the experience richer. Whether you have the latest hot social consumer app or a B2B enterprise app, integrating social login is one of the simplest things you can do to make every aspect of the user lifecycle more sticky and drive growth.
