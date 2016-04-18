---
layout: post
title: "Progressive Profiling: Vital Info from Happy Customers"
description: "You can get data from your customers while keeping them happy by collecting it over time. Find out how you can use progressive profiling to your advantage."
date: 2016-04-18 08:30
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design: 
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/progressive-profiling/icon.png
tags: 
- customer service
- profiling
- customer information
- customer data
---

When a new user hits your site, you want to do everything in your power to reduce friction. You make sure all the information is there to help them make the right decision, and you set out your pricing plans clearly and concisely to show your true value.

Then they go to sign up and you hit them with a 10-field form asking every question you could think of. Name, email, password, company, phone number, favorite book, childhood pets, hopes, fears,… The list goes on. Your potential new user is no longer as they can’t be bothered to waste their lives filling out these long forms.

For companies, these forms make sense—you need this information to better understand your customers, and ultimately to better serve them. But for those same customers, they are just a data grab and an annoyance, and any form that takes more than 5 seconds to fill out is *not going to be* filled out.

But there is a way both sides can win. **Progressive Profiling.** Progressive profiling is a technique for gradually building up a profile of your customers each time they interact with your product. It allows you to keep questionnaires and forms short and to the point, but still build up a fantastic picture of each of your customers over time.

Most importantly, it means your users can immediately engage with your product, experiencing it first before you overload them with questions. You might only get a small amount of data at first, but once they start using and moving your app, they will be far more happy to give you more.

## The Problem With Long Forms

Customers are simply turned off by a long signup form. [86% ](http://www.sampleforms.org/wp-content/uploads/2012/12/How-to-optimize-registration-forms.jpg)of users say overly long forms make them quit on registrations, and reducing form fields from 11 to 4 [increases conversion rates by 120%](http://unbounce.com/conversion-rate-optimization/how-to-optimize-contact-forms/).

There are 4 main reasons people don’t fill out long forms:

1. **Lack of Value:** Unless a customer has a true need for your service, they are likely to look on a long sign up form as too much work for little benefit. If they are only signing up to give it a quick trial, or find some information only available to registered users, this friction is likely to be enough to stop the registration.
2. **Inappropriate Information:** When a customer is presented with a long sign up form they immediately think “Do they really need all this information?” Whereas you understand why it’s helpful to have company, title, or employee numbers information for your sales and marketing team, the customer doesn’t see this as necessary for their use of the service.
3. **Data Security:** The more data you have on a customer, the more there is to lose. With the substantial amount of data breaches occurring, customers are wary of handing over any data they don’t see pertinent to their own use of the service.
4. **Unreliable Data:** A combination of all 3 of these issues leads to this—customers will put random information into form fields just to get through the registration process quickly. This information will then be unusable for your sales and marketing teams.

## How Progressive Profiling Works

Progressive profiling allows you to bypass these issues by collecting information gradually from customers over time as they use your service.

For instance, if you wanted the following information:

    * First Name
    * Last Name
    * Email
    * Company
    * Title
    * Number of Employees
    * Phone Number

You could ask for all this information in one go with a 7-field registration form. Alternatively, you could split it up into 3 blocks of information, each presented to the customer with a specific use.

On signup, you ask for `Email`, name (`First Name`, `Last Name`), and `Password`. The customer sees this as the obviously necessary information for signing up, and they’re accustomed to filling it out (an extra bonus is that this information is so common that their browser will autofill these fields, lessening friction even further).

By getting customers onboard without friction, you can get straight to showing them your product’s core value. If they come back a number of times, you can then ask them further information.

For example, you can ask them for company information: `Company`, `Title`, `Number of Employees`. By this time they will have started to see the value of your product, be using it frequently, and therefore be more willing to give extra information.

Finally, after a few more logins, you can ask for phone number to help you keep in contact.

Over the course of a few interactions, you have collected exactly the same information as you would with a long registration form. But instead of putting potential customers off with an annoyingly long form, you have only asked them for the pertinent information each time, showing them the reasoning behind this information, and making each step quicker.

This engages Dr. Robert Cialdini’s [principle](http://business.illinois.edu/shavitt/BA_531/Cialdini%20-%20Compliance.pdf) of “Commitment and Consistency.” Human beings naturally strive for consistency. Once we make a mental commitment to something, regardless of how small it is, we are exponentially more likely to stay consistent in our commitment to it. 

By getting a small commitment up front with a short form, you make it much more likely that your customer will give you more information in the future. Using progressive profiling, you users can experience your product straight away, getting to understand its core value and committing to it. Though this only gives you less initial data, you can build up a relationship with users first, and then gather further information you need over time.

Progressive profiling is easy to implement with Auth0. When a user is authenticated through Auth0, that user gets a `Profile` record, which can be populated with profile information about that individual user.

Contents for the user profile can come from 3 different sources:

1. Properties supplied by the identity provider—Facebook, LinkedIn, Twitter, or an enterprise account.
2. Attributes that are dynamically created using Auth0 Rules. For instance, [this Rule](https://github.com/auth0/rules/blob/master/rules/get-FullContact-profile.md) with populate your profile information from FullContact using just the email address.
3. The user themselves can add data to their Profile record through form fields presented during authentication.

![progressive profiling flow-chart](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-1.png)


If you are using both social/enterprise login and Rules with Auth0 during your authentication process, then you should need little extra information added from your user. 

Therefore, you should **never ask what you already know**. If you already have extensive demographics from LinkedIn or Facebook, it isn’t necessary to add questions about this information to your registration process. 

## Implementing Progressive Profiling With Auth0

Information from these social providers is likely to be high-quality compared to what users may add to your login form, therefore pre-populating their profile from these sources is preferential. But if you don’t have this data, or you want to augment it, a progressive profiling structure can add any additional data you need for either customer communication, or for marketing or sales leads.

Using Rules, you can easily track how many sign in events have occurred for a user. 

Using the Auth0 [Users API](https://auth0.com/docs/api/v2#!/Users/patch_users_by_id), Auth0 provides a “bucket” for user metadata:  `user_metadata`. The user token (obtained after authentication), is sufficient to modify the contents of `user_metadata`. This feature makes it very easy to control what information gets collected and when, and then through the Users API, enrich the user profile with any information collected:

<p style="text-align:center">
<img src="https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-2.png" alt="progressive profiling user-flow"/>
</p>

In the example above, we collect `last_name` and `first_name` on signup, then on a later interaction `title` and `company`, finally in the context of an article that might interest the user, a `subscribed` property.

To see this in use, you can try our [progressive profiling demo](http://auth0.github.io/auth0-progresive-profiling-demo). The initial Lock log in/sign up screen is the same as any other:

![progressive profiling lock-screen](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-9.png)

At this point, the new user can sign up with using SSO, or with email. If they choose SSO, the profile information will already be populated from the social identity provider. But if they choose to create a new account, a new profile will be created and `user_metadata` will be populated from the inputted information:

![progressive profiling customer-info](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-4.png)

Either way, they are not asked for more information during their first visit. However, once they log out and log back in again, they are presented with further profiling questions:

![progressive profiling further-questions](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-5.png)

Once they have answered, this information is added to `user_metadata`:

![progressive profiling user-metadata](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-6.png)

A counter, `last_profiling_step`, is initiated in `user_metadata` and once they leave the app and return a second time, another profiling question is presented:

![progressive profiling another-question](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-7.png)

This data is again stored in `user_metadata` for use by your sales and marketing teams:

![progressive profiling additional-user-data](https://cdn.auth0.com/blog/progressive-profiling/progressive-profiling-8.png)

The next time the user logs in, they are not presented with any further questions, and are instead taken straight through to the app.

Instead of one long form, which a new user would either ignore and thus never sign up, or would move through quickly putting false information, you can use 3 shorter forms. These get the important information after a user has returned to you app, therefore showing that they are definitely interested in your product, and is more likely to give you true, quality information.

## Getting The Most From Your Progressive Profile Funnel

One of the great strengths of progressive profiling is that it makes your registration process dynamic. As a user registers, you can construct a buyer persona for them and tailor the registration process to them.

For example, you could use metadata in conjunction with Rules to check if your user is using a personal email address (Gmail, Hotmail, Yahoo, etc.) or a private domain, as in a work email. 

If a customer is using a company address, it will make more sense for you to ask for their corporate information before you ask for more detailed contact details like phone numbers. If they’re using a personal email address, it makes more sense to collect more contact info first.

From there, you can segment you users depending on how they answered previous questions:

* If you asked for job title, then you will want a different flow for people answering *engineer* to those answering *marketer*.
* If you asked for company size, you will want to ask different profile questions to users from a *1,000-person* company from a *5-person* company.
* If you asked when they would be interested in further information on your product, you would want a different flow depending on if the answer was *now* or *never*.

With progressive profiling, you can get high-quantity, high-quality information from your users without pushing them away with aggressive forms and questionnaires.  Progressive profiling allows you to collect just the right information from your users at just the right time. You can build up a true profile of each one, allowing you to not only serve them better, but also to help your team generate just the right leads to help your company grow.
