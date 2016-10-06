---
layout: post
title: "Troubleshooting? This is what you shouldn’t do"
description: Impersonate users in the wrong way, and you’ll open up security holes in your app
date: 2015-12-14 12:27
alias: /2015/12/14/how-not-to-troubleshoot-bugs-by-impersonating-users/
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#49525B"
  image: https://cldup.com/ZfDpgn223K.png
  image_size: "50%"
tags:
- bugs
- user-impersonation
related:
- 2016-02-10-getting-started-with-lock-episode-2-using-customization-options
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
- 2016-04-07-integrate-auth0-into-your-existing-saas-tools
---

A customer reports a bug in your app, but you can’t reproduce it on your end. The app works exactly as it should after you login to the  app yourself and follow the same steps that the user took.

As a support rep, you now have two options:

1. Ask the user for more information. Perhaps ask them for screenshots or a screencast demonstrating the issue, or:
2. Impersonate the user—login to the app as the user, follow the steps, and experience the bug first-hand.

The problem with asking for more contextual information is that it’s even more work for the user. If they don’t do it, you’ve probably lost a customer. If they do take a screenshot or make a screencast, they’ll likely do so begrudgingly, because it takes a level of tech sophistication and more work to annotate and explain screenshots and screencasts as to make the process clear.

That’s why it’s so powerful and effective to impersonate users to solve customer issues. The customer is able to sit back, relax, and wait for the issue to be reproduced and fixed, while the support rep does all of the work.

But impersonating users can open up a pandora’s box of security complications that could turn a pedestrian bug in your app into a full-blown crisis. Here are 3 ways you shouldn’t approach troubleshooting bugs by impersonating users, and what you should do instead.

## 1. Build in a Superuser Backdoor

Early on, it’s an easy fix to give your site admin superuser access to view the logged-in pages of other users. You can then go to user-specific URLs and see what the user sees.

In reality, you’ve taken 1 problem and turned it into 2. You’ve added technical and security debt that will make your app less secure over time, and this form of debugging will actually make your app more buggy.

### You’re deliberately making your app less secure

Your permissions code might start off as something simple like the following.

```
def user_can(user, action, obj):
    if user.is_admin:
        return True
    if user.id == obj.owner_id:
        return True
    else:
        return False
```

Over time, though, you’ll add multiple types of admins and additional layers of permissions. As your app complexity increases, your code complexity will increase dramatically and you’ll see your permissions code get very complicated. What’s scary is when you’re barely able to comprehend your own permissions code, and have to rely on a combination of tests and  trial-and-error to get it right.

With any change to your code, you could be opening up admin power to a whole class of unintended users in your app—and that would be disastrous for privacy and security.

You’ve made a fundamental security error. You’re trying to maintain a secure backdoor into your app— to be secure, your app shouldn’t have that backdoor at all.

### You’ll double the number of bugs you’re dealing with

If you’re on a page that you shouldn’t be seeing except for your superuser workaround, then any action you take is one that you shouldn’t. That can break the app. Now, instead of dealing with one bug, you have two.

For example, suppose that you’re a support rep for Twitter. Twitter user Jeff comes to you with a bug: they aren’t able to “like” Jane's tweet. The twist is that Jane’s account is private—Jeff has permission to view Jane’s tweets, but your normal Twitter account doesn’t, because Jane isn’t following you.

However, you use superuser access to view Jane’s feed, and you hit “like” to see if it works. You’re able to like her tweet, but now you’ve created a data integrity issue. You shouldn’t be able to like the tweet of someone whose profile you don’t have permission to view. Later, when Jane is supposed to get an email notification after someone has liked her tweet, the app breaks, having not accounted for this state of data.

In short, you’re debugging in a manner that the rest of the app doesn’t anticipate. You’re breaking your models for how the app should work, so don’t be surprised if the actions you take in the app to debug take your entire site down.

## 2. Change the User’s Password

You can directly login as the user—with his or her permission—if you have the username and password. However, you’ve taken the basic precaution of storing encrypted, not plaintext, passwords. That means that if you want to login as the user, you’ll need to change their password.

It sounds easy enough. Change the user’s password, login, and reproduce the issue—but what looks easy on the surface can start to get complicated fast. Human error is introduced and creates vulnerabilities. And even if you do identify the issue, you may still lose the customer through the overall negative customer experience.

### Increased Vulnerability to human error

Usernames and passwords are meant to be personal to the user. When you introduce a support rep into the mix, you’re doubling the probability of human error.

Enact a company policy of having support resolve issues by changing passwords and logging in as users, and they will make human mistakes in handling those passwords. This can manifest itself in a few ways:

* **Choosing a weak password**: Instead of choosing a strong password, the support rep quickly changes the password to “password”. The password doesn’t get changed for a few days while they nail down the issue and before they get back to the user.
* **Fail to instruct or force the user to change password**: The user is given a password that they never change. The password may never have been strong enough to have been intended for normal use.  
* **Emailing password in plaintext**: The rep reproduces the issue and then emails the password in plaintext to the user. Unlike a password reset link, that password sits in the user’s inbox with credentials exposed and no expiration date.
* **Impersonation not possible for 3rd party login**: If a user has signed up via Facebook or Google sign on, the support rep won’t be able to use this method to resolve the customer issue because the rep won’t be able to change the password in the other system. That results in more confusion and potential mistakes to be made.
* **And more . . .**

This is how workarounds like changing user passwords can quickly escalate from harmless to dangerous. Ultimately, your support team isn’t an expert on security—they’re just trying to get their job done the best they can. In giving them the power to reset a user’s password to something specific, you may actually be hurting the security of your app because that ability will get misused.

### Bad UX alienates the customer

Even if changing the user’s password is a quick way to get access and find the problem, it may not be the best solution from the user experience perspective. Users want to feel that their account and data are accessible by themselves only, via a username and password combo that only they know. When that perception is shattered, they lose faith and trust in the product that it’s private and secure.

In May 2015, Uber got called out by users and the security community after [a number of users received a changed password in plaintext](http://motherboard.vice.com/read/ubers-response-to-hacked-accounts-is-more-bad-security) via email. After a hacker illegitimately accessed a user account, the support rep reset the password for that user. Instead of sending the user through a password reset process, he emailed it to him directly in plaintext.

![Uber email with plaintext password](https://cdn.auth0.com/blog/how-not-to-troubleshoot/uber-letter.png)

Top security expert Per Thorsheim, proves that Uber either has “no procedures for handling incidents like this, or they have an employee who doesn't follow procedure.”

It’s disconcerting to the user to know that another person—even if it’s a support rep—knows your password and is handling it without care. In the end, Jack, the Uber user whose account was compromised, ended up leaving Uber and asking for all of his data to be deleted.

## 3. Build Impersonation into Your App

The last solution is to actually build user impersonation into your app. Rather than pervert tools like admin access and password reset to suit this purpose, build functionality specifically designed for it.

The problem is that it’s hard. Do it wrong, and you’re opening up a way for anyone to impersonate another user. That’s why it’s best not to DIY, and instead, leave it to the experts.

### DIY impersonation

Tableau Software, a business intelligence platform, is just one of many companies that have issued a [security advisory](http://kb.tableau.com/articles/knowledgebase/security-advisory-users-can-be-impersonated) that users can impersonate other users in their system in a way that wasn’t intended.

And these aren’t your “here today, gone tomorrow” startups. Tableau went public in 2013. Influitive, a B2B marketing software startup, is another company that had a [security breach](http://status.influitive.com/incidents/ltlwms8rgx6r) due to the ability to impersonate other user accounts in its system—and they’ve raised over $40M in funding from investors.

In short, it’s hard to prevent unintended or malicious impersonation when building your account and permissions system yourself, into an already complex system. Security is one of the hardest parts of building on the web today. That’s why you want to outsource it to security experts who work obsessively to protect your app and continue to improve it.

### Outsourcing it to the experts

With an identity-as-a-service infrastructure (IaaS) like [Auth0](http://auth0.com/), you get impersonation out of the box and built by security experts. Because you get it delivered to you as a SaaS product, you get continual security updates and improvements to it so that it becomes something that you don’t have to worry about.

{% include tweet_quote.html quote_text="With an IaaS like Auth0, you get impersonation out of the box and built by security experts." %}

![Impersonation as a SaaS product](https://cdn.auth0.com/blog/how-not-to-troubleshoot/signin.png)

For example, Auth0’s [Sign in As](https://auth0.com/how-it-works) feature for user impersonation gives you the following for free:

* **Detailed auditing** of who impersonated when, which dissuades abuse and lets you track it down what it does happen.
* **Restrictions on impersonation** which allows you to reject an impersonated authentication transaction based on, for instance, corporate policies around privacy and sensitive data.
* **Unlimited customization** on who can impersonate who, when, depending on whatever context, using our [Rules engine](https://auth0.com/docs/rules). In a Rule, you have access to `user.impersonated` (the impersonated login) and `user.impersonator` (the impersonating login) and you can write arbitrary Javascript to define how it works.

Using an IaaS platform, you’re able to login to your app as the user, see everything exactly as the user sees it, and do everything exactly as the user does it. That’s because your IaaS manages all of your user identities for you.

![Clean interface into impersonation](https://cdn.auth0.com/blog/how-not-to-troubleshoot/material.png)

For engineering, you get this all without adding code complexity to your application. You can focus on building product and adding value to your customers. What customer support gets is a clean interface into impersonation rather than having to manage a human-error fraught workaround.

## When Hacking Support Goes Wrong

As you build and grow, you need to develop a secure procedure for troubleshooting bugs and managing customer support issues. Although it might be tempting to bank on quick fixes, at the end of the day, cutting corners strips away at the integrity of your application and puts your entire business at risk.

If you give your customer support team the right tools for the job, they can focus on solving customer problems and making customers happy. Give your support team the wrong tools, and you’re setting them up to make mistakes and ultimately potentially threaten the very integrity of your app.

Rather than try to hack together a solution for resolving support issues, think it all the way through, from the customer support agent on the backend to the customer experience on the front. You’ll find that the solution won’t just “get the job done” in a single instance, it’ll set your team and your customers up for long-term success.
