---
layout: post
title: "How To Safely Use The 3 Best Customer Retention Tactics"
description: Making security your best Customer Retention Hack
date: 2016-04-14 12:30
permalink: /2016/04/14/safely-use-best-customer-retention-tactics/
author:
  name: Diego Poza
  mail: diego.poza@auth0.com
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/customer-retention-techniques/logo.png
tags:
- customer-retention
- customer-retention-techniques
- retention-hacks
related:
- 2016-04-18-progressive-profiling
- 2016-04-14-safely-use-best-customer-retention-tactics
- 2016-04-25-angularjs-authentication-screencast-series-part-4
---

So much of your energy after launching a product goes into marketing. You want to see your product in the hands of as many customers as possible, and you want it done quickly. However, if you want to see real growth, the energy you spend on acquiring new customers should always be outpaced by the energy you spend on retaining customers.

Acquiring a new customer can cost anywhere from[ 5 to 25 times](https://hbr.org/2014/10/the-value-of-keeping-the-right-customers/) as much as retaining an existing one, and a simple 5% increase in customer retention can lead to a profit increase of [25% to 95%](https://hbr.org/2014/10/the-value-of-keeping-the-right-customers/). Fortunately, this is common knowledge at this point, and most companies prioritize retention.

{% include tweet_quote.html quote_text="A simple 5% increase in customer retention can lead to a profit increase of 25% to 95%" %}

Unfortunately, most companies only focus their retention strategies around building a more engaging user experience, and fail to give enough attention to the most important part of customer retention: security.

## Why Security Is The Best Customer Retention Hack

Customer retention, essentially, is a combination of loyalty and trust. If you give customers an enjoyable, valuable experience, you can gain their loyalty. Gaining their trust, however, requires you to protect them. This is particularly relevant in today’s digital age, where high-profile hacks seem to happen every day.

One study found that [75%](http://www.safenet-inc.com/resources/data-protection/customer-loyalty-data-breaches-infographic/) of consumers believe companies don’t take the protection of their data seriously enough. The same study found that 64% of customers say they are unlikely to ever do business again with a company if their private data is breached. It’s hard to find another event that could immediately strip 65% of your customer base, regardless of how engaging your product is.

The only thing between your company and this plummet is your security protocol, and so it better be good. With this in mind, we took 4 of the most common retention strategies and adapted them for security.

## 1. Use Push Notifications To Engage Customers—Just Don’t Accidentally Steal Their Data

In 2015, users who opted into push notifications for a given app showed an average [171% increase](http://info.localytics.com/blog/2015-the-year-that-push-notifications-grew-up) in engagement compared to users who opted out. [Appcues](http://www.appcues.com/), a service that builds in-app experiences for non-programmers, observes that e-commerce apps, in particular, can experience boosts in engagement of [278% via push notifications](http://www.appcues.com/blog/why-feature-blindness-is-killing-your-apps-retention-and-how-you-can-fix-it/).

The New York Times recently embraced push notifications by building an 11 person team completely dedicated to crafting and scheduling push notifications for their readership. Andrew Phelps, the team's leader, said that it [allows readers to](http://digiday.com/publishers/inside-new-york-times-new-push-notifications-team/) “treat their lock screen like an inbox.”

![Push Notifications](https://cdn.auth0.com/blog/customer-retention-techniques/push-notifications.jpeg)
_source: [Medium](https://cdn-images-1.medium.com/max/800/1*EbQjVSgYsFfL3vcy42n8AA.jpeg)_

It makes sense. If readers aren’t looking at your app, it doesn’t matter what you update, they won’t see it. What is less discussed is the potential security risk of misused push notifications.

### Why it’s a security risk

Microsoft released an iOS version of their Outlook app in 2015 that featured push notifications. However, developer and security blogger René Winkelmeyer discovered that the app was collecting an invasive amount of data. For example, the app required access to your Google Drive, DropBox, and OneDrive accounts. It also [stored your mail and server credentials](https://blog.winkelmeyer.com/2015/01/warning-microsofts-outlook-app-for-ios-breaks-your-company-security/), constantly scanning your server and account.

This means that even if you turned the app off, Microsoft’s central service would check your email and send push notifications to you. This also means that all of your personal information and credentials would be stored on Microsoft’s cloud.

Issues of privacy aside, collecting data you don’t need increases your liability without any benefit to you. The more of a customer’s data you hold, the greater the damage will be should you ever experience a breach. Look at TJX.

{% include tweet_quote.html quote_text="The more of a customer’s data you hold, the greater the damage will be should you ever experience a breach." %}

In 2005, the retailer was the victim of one of the [largest cyber attacks in history](http://www.wired.com/2007/10/tjx-failed-to-n/), resulting in the theft of thousands of credit card numbers. In the words of Canadian privacy commissioner [Jennifer Stoddart](https://www.washingtonpost.com/business/technology/), “The company collected too much personal information, kept it too long and relied on weak encryption to protect it.”

As [many critics](http://searchsecurity.techtarget.com/magazineContent/Companies-Collecting-Too-Much-Customer-Data-Increase-Exposure) would go on to point out, keeping data on your customers that is not absolutely essential to your transaction just makes things worse for you in the event of a breach.

### How to stay safe

This one has a relatively simple solution, and it’s based around the idea that data is a [toxic asset](https://www.schneier.com/blog/archives/2016/03/data_is_a_toxic.html). By toxic, we mean that storing user data makes you vulnerable. In the last year, data breaches at the [IRS](http://fortune.com/2016/02/10/irs-hack-refunds/), [CIA](http://motherboard.vice.com/read/teen-who-hacked-cia-email-is-back-to-prank-us-spy-chief), [OPM](http://www.nbcnews.com/tech/security/opm-hack-government-finally-starts-notifying-21-5-million-victims-n437126), and the slightly less stately [Ashley Madison](http://www.wired.com/2015/08/check-loved-one-exposed-ashley-madison-hack/) have proven this.

Combating it comes in two parts. One comes as a recommendation from the Center of Democracy and Technology: only collect [vitally necessary data](https://cdt.org/insight/data-in-the-on-demand-economy-privacy-and-security-in-government-data-mandates/), and never store it indefinitely. If you don’t need socials, don’t collect them. If a user deactivates their account, either delete the data or store it on an offline drive.

The second part is to use high-level authentication. For example, by using the Auth0 dashboard or a GitHub integration, you can use [Auth0’s Rules](https://auth0.com/docs/rules) to authenticate users according to many protocols, based on a [variety of attributes](https://auth0.com/docs/rules/context), including their name, user agent, POST request, IP, and many others. All of this can be done with a few lines of code, allowing you to easily decide who can access what data during the authentication process.

## 2. Social Logins Work Wonders, If You Provide A Back-Up Plan

If you want to [skyrocket your conversion rates](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/) and increase retention, you need to integrate social logins. Your signup conversions can jump 20%, and your registration rates can soar to a 50% increase.

The reasoning behind this is clear. When it comes to product development, streamlining your customer’s experience, without losing your robustness, is the name of the game. You want your product to be intuitive. Social login does this in two ways.

First, it makes logging into the app more convenient. Instead of adding another account to the mess of usernames and passwords they already manage, you let your customers login with an account they already have. Easy.

![Social Logins works wonders](https://cdn.auth0.com/blog/customer-retention-techniques/social-logins.png)

Along with this, by connecting your app to social media, you’ve made it that much easier for your customers to share your product via social media. For example, the average media site saw a [300% increase](http://blog.hubspot.com/blog/tabid/6307/bid/12393/Facebook-s-Like-Button-Turns-One-Usage-Data.aspx) in traffic after integrating with Facebook.

Increasing conversion rates and making your customers’ lives easier is a hard prospect to pass up. Even Mailchimp, who famously penned an anti-social login article, [posted said article](https://blog.mailchimp.com/social-login-buttons-arent-worth-it/) on their blog—which supports social login.

### Why it’s a security risk

In 2013, Facebook locked thousands of users out of their accounts and required that they submit [proof of a government ID](http://www.theblaze.com/stories/2013/10/29/absurd-facebook-requesting-government-id-to-unlock-accounts-again/) for processing. Companies whose apps relied on Facebook social logins were subsequently [locking their customers out](https://hbr.org/2013/12/mitigating-the-risks-of-social-login/) for days.

While being locked out of Facebook isn’t life or death (unless you built your company on Facebook, as many do), being locked out of your work account, or being locked out of a service your company requires, can cause downtime, costing you money and customers.

 In Fortune 1000 companies, for example, the cost of application failure is between [$500,000 and $1 million per hour](http://www.reuters.com/article/idUSnMKWyC4T8a+1d4+MKW20150204).

If you rely entirely on the stability of someone else’s platform, you’re rolling the dice everyday as to whether or not your customers will be able to access your service.

### How to stay safe

Redundancy is key in security. At Auth0, we allow you to integrate social logins from over[ 30 different platforms](https://auth0.com/learn/social-login/), including Facebook, Twitter, LinkedIn, PayPal, Wordpress, and many more. If you connect your app to even 3 of these platforms, all 3 would have to simultaneously crash to lock your customer out.

![Auth0 Lock](https://cdn.auth0.com/blog/customer-retention-techniques/auth0-lock.png)


[Auth0 Lock](https://auth0.com/lock), a plug-and-play login field you can easily embed in your app to incorporate as many of our supported social platforms as you’d like. From your Auth0 dashboard, simply navigate to the “Social” category (it’s under “Connections”), and click toggle on/off whichever platforms you’d like.

![Social Connections](https://cdn.auth0.com/blog/customer-retention-techniques/social-connections.png)

Incorporating a system of redundancies in this way doesn’t just increase the number of services your customers can authenticate with, it increases the number of platforms they can easily share your product on.

## 3.  Email Is A Corner Stone of Retention, And a Huge Security Risk

If you read any list of customer retention tactics, one of the first suggestions will always be to use a service like [Customer.io](https://customer.io/) to send targeted and automated messages to your customers at different stages in their lifecycle.

For example, you can have emails [automatically sent](https://customer.io/docs/transactional-email.html) to customers when they register, when they finish onboarding, and when their usage data slows. In addition, you can personalize how you send the message, for example sending at the [time of day](https://customer.io/docs/welcome-email.html) most convenient to your customer.

This is great advice. Personalized emails have [6x higher](http://marketingland.com/study-70-brands-personalizing-emails-missing-higher-transaction-rates-revenue-73241) open rate, and [81% of users](http://www.emarketer.com/Article/Personalization-Sees-Payoffs-Marketing-Emails/1010563) say they’re more likely to make a purchase from a company that sends personalized email. The beauty retailer Sephora, worth a little over [$2.2 billion](https://en.wikipedia.org/wiki/Sephora), bases its digital marketing campaign around targeting so specific that it takes into account the customer’s [skin tone](https://blogs.adobe.com/digitalmarketing/digital-marketing/personalization-success-sephora-leading-brands-thrive/) before sending an email.

However, using email without regard for security is a big gamble—one that could break your company.

### Why it’s a security risk

Phishing scams—from old-fashioned [Nigerian prince scams](http://www.pcworld.com/article/192664/the_story_behind_the_nigerian_phishing_scam.html) to more modern “[artisanal spam](https://auth0.com/blog/2016/02/29/the-new-trend-of-artisanal-spam/)”—are a cultural staple of the internet at this point. Everyone has received a dodgy email or seen a questionable pop-up asking them to “Download this urgent update!!!” and most of us have the wherewithal to ignore them.

You would think that in today’s tech-savvy world, government agencies would be too sophisticated to fall for these ploys. You’d be wrong.

In the last year, the director of the CIA, the [US Director of National Intelligence](http://motherboard.vice.com/read/teen-who-hacked-cia-email-is-back-to-prank-us-spy-chief), and President Obama’s senior advisor on science and technology have all fallen victim to phishing attacks, allegedly led by the same group of high school students.

John Holdren, senior advisor on science and tech, had his information stolen when attackers [spoofed his email address](http://motherboard.vice.com/read/teens-who-hacked-cia-director-also-hit-white-house-official) and asked his wife Cheryl for the password to their joint Xfinity account. From there, they were able to infiltrate other private accounts, eventually forwarding all incoming calls to the Holden’s home to the Free Palestine Movement.

The attack on CIA Director John Brennan featured a different type of social engineering. The hackers were able to [spoof their credentials](http://www.wired.com/2015/10/hacker-who-broke-into-cia-director-john-brennan-email-tells-how-he-did-it/) with Verizon, pretending to be company employees to access Brennan’s personal data, which they used to reset his personal AOL email address’ password.

### How to stay safe

In all of these examples, the attackers were focused on stealing the victims’ passwords. If you did away with passwords altogether, you’d make these attacks quite a bit more difficult.

Auth0’s [Passwordless Login](https://auth0.com/passwordless) does just this. Instead of typing in their credentials, users [click a magic link](https://auth0.com/docs/connections/passwordless/spa-email-link) that is sent to them via email.

![Passwordless Magic Link Flow](https://cdn.auth0.com/blog/customer-retention-techniques/passwordless-diagram.png)

While this severely limits an attacker's capability for accessing your app with a legitimate user’s credentials, it does not entirely prevent attackers from spoofing an email from you to gain a user’s credentials for other accounts, like their email address.

In order to prevent this, you need to do two things. Educate your users on staying aware of phishing attacks, and incorporate [DMARC, SPF, and DKIM](https://auth0.com/docs/connections/passwordless/faq) functionality either through your own custom email provider, or an Auth0 supported service like[ SendGrid](https://sendgrid.com/). These protocols, in combination, analyze an email’s headers and signatures to make sure that it is being sent from a legitimate domain, and that it has not been tampered with by a third party.

And if you’re trying to communicate something that needs very extreme security and privacy, consider using our new open-source [Sharelock](https://sharelock.io/). It allows you to share a secret exclusively with whoever you’d like via email or any other social platform. The software uses high-level encryption, and never stores your messages on any server. They are transmitted in the URL itself. Also, because it’s open-source, you can feel free to deploy it to your own server as you’d like.

![Sharelock.io](https://cdn.auth0.com/blog/customer-retention-techniques/sharelock.png)


## The More You Do, The More You Need To Worry About Security

Every developer understands feature creep. As Steli Efti, founder of [Close.io](http://close.io/), points out, developing unnecessary add-ons [will give you](http://blog.close.io/lean-sales-customer-development-pitfalls-that-will-sink-your-startup) a “haphazard product bloated by feature creep” full of “features that no one cares about.”

The risk developers discuss less is the relationship between extra features and vulnerability. Incorporating an email system, video content, social logins, or push notifications, if done right, will give you a dramatic boost in customer retention. Each addition, however, also increases the number of things you have to secure.

Failing to secure your products is the surest way to sink any retention plan. It doesn’t matter how engaging your content is, if you can’t protect your data, you will not be able to keep customers.
