---
layout: post
title: "Customer Data is King: Four Ways to Know Your Customers Better"
description: "For B2C companies, nothing beats knowing who your customers are and what they want."
date: 2016-07-22 8:30
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design:
  bg_color: "#2d5487"
  image: https://cdn.auth0.com/blog/customer-data/customer-data-icon.png
tags:
- b2c
- customer
- data
- identity
- progressive-profiling
related:
- 2015-09-11-7-ways-to-2x-your-revenue-growth-by-putting-your-user-data-to-work
- 2016-04-18-progressive-profiling
- 2016-04-19-supercharge-your-registration-process
---

---

**TL;DR**: Knowing your customers is key when it comes to effectively selling to them. In this article we'll explore four ways that you can put user data to work to get to know who your customers are, what they want, and how to serve them better.

---

Business challenges exist in all industries, which is a reality that organizations need to contend with and work past. However, for businesses that are strictly consumer-facing, such as retail, some challenges can be greater than they would in others industries. For most companies, it doesn’t make any sense to target all consumers with a given offering because there’s no way to serve absolutely everyone. As the saying goes, if you try to cater to everyone you’ll end up serving no one. What B2C companies are left with, then, is the need to get specific and target a subset.

Narrowing down to a smaller target audience isn’t a silver bullet though. Even at that point, it can be difficult to find optimizations for how to market to this subset because the crowd might still be quite diverse. Perhaps your retail business has stats that say your signature women’s jacket is most popular amongst 25 - 34 year olds in Europe. Chances are good that your total audience doesn’t solely consist of this niche group. A challenge that exists in this case is how to optimize the marketing process so that effort isn’t wasted on those who likely won’t be interested in your offering.

There are many different ways that B2C companies can optimize their marketing processes, but one that can easily be overlooked is through the user authentication process. Assuming you run a website to either augment or act as the sole source of your sales, it turns out that there are a lot of ways your B2C company can use the login process to benefit your overall marketing. The key to it is insightful user data.

## 1 - Build Up Your Customers’ Profiles with Social Data

While it may be true that your customers are all unique individuals with their own hopes, fears, and dreams, there are some attributes that will be shared amongst most of them. Things like age, gender, location, and product preferences are just a few examples of user details that can be common to more than one of your customers. These are pretty typical details for companies to collect, so perhaps you’re already gathering this kind of information.

While this info is great to have and can be helpful, it really doesn’t give you the full picture of your customers. The good news, however, is that you can do better at building up a profile for your customers by leveraging their social data that comes from providers like Facebook, Google, and Twitter.

### How it Works

Chances are good that you’ve come across a website or application that allows you to log in with one of your social accounts. It’s all made possible through OAuth 2.0, a specification that enables a third party (such as a social provider) to authorize users on behalf of the requesting application.
While this is great for the user experience because logging in is a snap, there’s an even greater upside that can be realized by your company if you implement social authentication: you can collect information about your users from their social accounts. Lots of it--valuable bits of info like what events your customers have attended, which ads they’ve read and responded to, and much more.

Did a red light just go off for you? You might be wondering if this infringes on your users’ privacy. Surely your customers wouldn’t want you to know this much information about them and use it for your own marketing purposes, right?.

The key here is that your users all need to consent to sharing this information with you in the first place. When you request that they share it, they are asked very clearly if they’re ok with it. For some users, the answer is no. But for many, the answer is yes, and if it’s a yes, you now know that customer better than you did before.

### The Benefits

The benefits of having more user information for marketing purposes are probably obvious: you can use that information to target your offers to specific customers. Instead of marketing to your customers en masse, you can pick out very specific subsets and craft offers that are specific to them, all while having confidence that there’s a better chance they will respond to these offers because you have data which says so. You can analyze this enriched user information and pull out insights that wouldn’t be possible without social data.

![customer data dashboard](https://cdn.auth0.com/blog/customer-data/customer-data-1.png)

## Social Data is Easy with Auth0

Enabling social login is easy with Auth0, especially when you use the [Lock widget](https://auth0.com/lock) in your application. After [signing up for Auth0](https://auth0.com/signup), select the social identity providers you want to allow your users to log in with. You get to choose which pieces of profile information you’d like your customers to share with you.

![customer data facebook](https://cdn.auth0.com/blog/customer-data/customer-data-2.png)

When users log in with the social providers you have enabled, their data will be sent back and stored in their Auth0 profile. With this raw data in place, you’ve got a lot of options for using it to support your marketing efforts. For example, you can use the [Auth0 management API](https://auth0.com/docs/api/management/v2) to query your user data for parameters that match what you need for your campaign.

## 2 - Enhance Your Customer Info with Progressive Profiling

When enriching your customers’ profiles with social data, there are times when it’s just not possible to get all the information that you’d like. Perhaps the customer isn’t willing to share their information, or maybe they just don’t have a very robust social profile to begin with. In these cases, there’s another option: progressive profiling.

If you’re a LinkedIn user then you’ve probably already seen progressive profiling in action. In essence, progressive profiling is all about collecting user information in small quantities over time, all while providing messaging to the user which encourages them to do so. There’s nothing worse than needing to fill out dozens of form fields all at once just to start using an application. It makes for a terrible user experience, and is certainly a point of friction that can drive many customers to look for something better. With progressive profiling, you ask for just a tiny amount of information from your customers each time they log in to your app, which greatly reduces the perceived burden of filling out form fields.

### Benefits of Progressive Profiling

While it takes longer to collect user information through progressive profiling, it’s well worth the wait. It makes for a much better for user experience, so the chances of you not losing a new customer right off the bat due to a poor experience are greatly diminished.

More than this though, it provides a way for you to get the same (or similar) information you would from your customers’ social providers. You have control over the questions you ask, and just like a customer can choose to disclose information from their social profiles or not, they have the option of providing an answer to your questions or passing. Could your marketing efforts benefit by you knowing which new movies your customers have watched in the last month? Ask them the next time they log in. Sure, some might pass, but others will give you this information because they are primed to do so through consistency and commitment.

![progressive profiling question](https://cdn.auth0.com/blog/customer-data/customer-data-3.png)

![progressive profiling question](https://cdn.auth0.com/blog/customer-data/customer-data-4.png)

## Progressive Profiling is Easy with Auth0

Auth0 gives you full control over the data stored in your users’ profiles and it can be modified by using the [Auth0 management API](https://manage.auth0.com). To create progressive profiling for your application, you can create a series of “drip” questions you’d like your users to answer and then check whether or not the answers to those questions exist in your users’ profiles when they log in. If the user hasn’t answered a question, you can prompt them for it and save the answer in the user’s profile via the API.

## 3 - Get More Info with Third Parties

Social data and progressive profiling are great ways to enrich your customers’ profiles, but the story doesn’t need to end there. If you’d like to go even further, you can also get creative by consulting third parties for even more user information. There are a lot of options in this area, some of which are free. For example, if you want to know what the median income is for your users’ zipcode, you can query the US Census Bureau API. Or, if you’d like more personalized information, you can use an app like [FullContact](https://www.fullcontact.com/).

FullContact gathers and reports publicly available user information that comes from a multitude of sources. This is really helpful because although your customers likely have multiple social accounts, chances are they’re only going to use one preferred provider to log into your application, meaning you can only get social data from that single provider. Since FullContact gathers data for any visible social accounts a user has, the information in your customers’ profiles becomes a lot more robust.

![auth0 rules](https://cdn.auth0.com/blog/customer-data/customer-data-6.jpg)

### Further Enrichment is Easy with Auth0

Auth0 provides a robust [rules engine](https://auth0.com/docs/rules) which allows you to augment the authentication pipeline any way you like. This pipeline is the perfect spot to add logic to send your user’s data to a third party. For example, if you want to use FullContact, you can use a rule which sends the user’s email address to it when they sign up. You can also choose to save the information that comes back from FullContact in the user’s Auth0 profile. In fact, this rule--and many others like it--are already written for you and can be enabled with a click.

![auth0 rules](https://cdn.auth0.com/blog/customer-data/customer-data-5.png)

## 4 - Go Even Further: Analyze Your Customer Data

Services that provide additional information about your users such as FullContact can be very helpful, but another way to get to know your customer base better is by slicing and dicing your own data. There are plenty of services that can help you manage your customer data, and one great example is [Lytics](https://www.getlytics.com/). Lytics allows you to upload or send your user information to their service where it can be collected and later analyzed.

![auth0 lytics](https://cdn.auth0.com/blog/customer-data/customer-data-7.png)

### Sending Customer Data is Easy with Auth0

Sending user information to a service such as Lytics can be cumbersome, and in many implementations you might be required to write a fair amount of code to arrange communication with their API. With Auth0, however, this is a breeze. In much the same way that you can use Auth0’s rules engine to send data to services like FullContact, you can create your own custom rules to send data to Lytics when a user authenticates in your application. Simply write (or modify) a little bit of JavaScript to create a [rule](https://auth0.com/docs/rules) which augments the authentication pipeline to send data to the REST API that Lytics exposes, and you're good to go.


## Wrapping Up

Rich customer identity data is becoming one of the most important ways for B2C businesses to market and sell effectively. Not only is this data important for marketing purposes, but it’s also key to knowing your customers better in general. 

If you’re not yet using social data to enrich your customer’s profiles then you’re missing out on some important opportunities. The good news is that Auth0 can make this process very easy and also solve many important authentication problems in your apps at the same time. If you’re interested in knowing more about how customer identity can benefit your company, [get in touch](contact form)--we’d love to chat.
