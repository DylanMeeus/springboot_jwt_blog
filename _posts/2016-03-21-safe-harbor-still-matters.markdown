---
layout: post
title: "Safe Harbor May Be Dead, But It Still Matters"
description: Why The Court's Decision Changes Nothing About Safe Harbor being a Good Security Practice
date: 2016-03-21 13:30
alias: /2016/03/21/safe-harbor-still-matters/
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: #222F64
  image: https://cdn.auth0.com/blog/safe-harbor-not-dead/logo.png
tags:
- safe-harbor
- privacy-shield
related:
- 2015-04-27-auth0-europe-launches
- 2014-12-11-auth0-achieves-soc-2-certification
- 2015-03-10-blacklist-json-web-token-api-keys
---

Late last year, the European Court of Justice declared that the existing rules for protecting data transferred between the United States and Europe—the Safe Harbor Privacy Principles—were no longer valid.

Originally devised to turn the EU states' various privacy policies into a coherent framework and make it easier for American firms to conduct business there, Safe Harbor required companies to self-certify that they met certain requirements on security, data integrity, and accessibility.

But then came Ed Snowden and revelations about the NSA's indiscriminate collection of data, and suddenly it was just a matter of time before Safe Harbor fell apart. The final nail in the coffin came when Max Schrems, a young Austrian law student, filed a complaint with the European Court of Justice about Facebook's collection practices.

According to the ECJ's final determination, Safe Harbor was virtually unenforceable since there was no longer any clear way for a company to really guarantee security and integrity. That doesn't mean, however, that we should just ignore the principles that Safe Harbor once codified.

## The Safe Harbor Principles

Even though Safe Harbor is no longer legally binding agreement, we still believe that Safe Harbor set out a lot of really important ideas about privacy and security—a list of best practices that can ensure you always stay on top of protecting users and their sensitive information whether you're operating in the EU or not.

There are[ seven principles in all](http://trade.gov/media/publications/pdf/safeharbor-selfcert2009.pdf):

* **Notice** - You have to tell people why you're collecting data, how you're using it, and how they can get in touch with questions or complaints.
* **Choice** - If you're going to send someone's data to a third party or use it for a reason you haven't disclosed, users have to have the opportunity to opt out of that.
* **Onward Transfer** - Any third parties interacting with data need to also follow these principles.
* **Security** - You have to do as much as you can to make sure no data is lost, damaged, or stolen.
* **Data Integrity** - The data you collect should be relevant to the service you're providing for your users.
* **Access** - You need to give your users control over their own data, whether that's editing, removing, or simply reviewing.
* **Enforcement** - There has to be an enforcement mechanism in place.

Some align closely with each other, but three—security, data integrity, and access—are fundamental to how good security policy should be run. First, there are the concrete steps taken to protect the data that's being collected. Then, there are the human intentions and behaviors behind that collection. Lastly, there's the recourse and redress that users have in case things go wrong. Each is critical to a good security policy, and when they're not followed, there are often disastrous results.

## 1. Safeguard User Data Against Leaks And Attacks

In 2014, [a huge breach](http://www.huffingtonpost.com/2014/05/21/ebay-hack_n_5364505.html) at eBay exposed the personal information of more than a hundred million users. Similar hacks have occurred at the Home Depot, JP Morgan, Target, TJ Maxx, Heartland Payment Systems, and [many, many more](http://www.huffingtonpost.com/entry/biggest-worst-data-breaches-hacks_us_55d4b5a5e4b07addcb44fd9e).

That doesn't mean that these companies had no security—all it takes is one weak link. In the wake of a large hack of Anthem Healthcare, security researchers identified a basic oversight at the root of the problem: data in transit was heavily encrypted and protected, but data *at rest *[was not](http://www.bloomberg.com/news/videos/2015-02-13/why-do-companies-with-security-keep-getting-hacked-).

![Anthem Hacked](https://cdn.auth0.com/blog/safe-harbor-not-dead/Anthem-hack.jpg)

This proves that security is not something you can just implement at one stage—it has to be a comprehensive, company-wide project.

What's alarming is that all of these companies had huge infrastructures behind them and huge amounts of resources they could have tapped in the interest of creating strong security protocols. Whether these breaches came about as the result of poor internal training or a lack of totally security-minded development, it's clear that the need to keep data secure is a seriously urgent one.

### The security principle

One of the central tenets of the Safe Harbor Framework is security. From accidental disclosures or losses of information to unauthorized access, you have to keep the data that you collect from your users safe. Otherwise, you could put the livelihood and privacy of a lot of people at risk.

Keeping the information that your users give up to you secure is also an issue of trust and reliability. When that data involves credit card information and phone numbers, a lapse is not just a momentary inconvenience or a changed password: a serious breach of sensitive data can be very difficult to rectify. And while customers may shrug it off if they were unaffected, the impact on your reputation can be difficult to repair.

### How Auth0 does security

This urgency is why Auth0 is [compliant with SOC-2](https://auth0.com/blog/2016/01/18/how-to-build-your-customer-trust-through-soc-2/), the most recent and rigorous standard for protection of financial information: without it, no bank or investment company would use us at all. We're [also HIPAA compliant](https://auth0.com/learn/why-hipaa-compliance-is-vital-your-business/), which means we're trusted to deal with sensitive health information. And there are many more safeguards built into Auth0, [including](https://auth0.com/security):

* Hashed *bcrypt *passwords that are nearly impossible to crack even in the case of a breach
* OAuth permission scopes so users never give up any more information than they absolutely need to
* A DDoS mitigation layer that we test frequently to keep your system safe from bandwidth-flooding attacks
* Rate limiting and IP address blocking to stop brute force attacks in their tracks

But of course, providing security doesn't just mean properly encrypting, transferring and storing data. It also means making sure that *any *third parties that come in contact with your users or data meet the same standard as well.

We do work with a small number of third parties which use cookies to help us improve Auth0. They track, for instance, how often certain pages are visited, or how often error messages are received. Our privacy page [includes links](https://auth0.com/privacy) to the individual privacy policies of each—Google, Mixpanel, Segment, and Intercom—and they meet our standards completely.

## 2. Preserve Data Integrity By Collecting Less Of It

In 2014, the American Library Association publicly [criticized ](http://www.ala.org/news/press-releases/2014/10/adobe-responds-ala-egregious-data-breach-some-action-expected-week-oct-20)Adobe for transmitting without encryption the reading activities and library records of Adobe Digital Editions (ADE) users around the world.

That was bad, especially for users in places where it's critical to keep your reading activity confidential. But the ALA's main point was that this data didn't need to be collected at all. Adobe retorted that they had to collect it for “facilitating the implementation of different licensing models”—but that doesn't explain the long-term storage of reading activities.

![Adobe sending data to servers](https://cdn.auth0.com/blog/safe-harbor-not-dead/adobe-data-to-servers.png)
    (Source: [Electronic Frontier Foundation](https://www.eff.org/deeplinks/2014/10/what-we-can-learn-adobe-e-reader-mess))

In fact, it doesn't seem like they had any reason to store this information at all, and that in doing so they made themselves vulnerable to an attack that could have serious, even deadly consequences. There are many places around the world, after all, with regimes that are very interested in what their people are reading.

What the ALA was pointing towards was the idea that data collection should always minimized—as Bruce Schneier says, personal information is always a kind of “[toxic asset.](https://www.schneier.com/blog/archives/2016/03/data_is_a_toxic.html)” The more of it you collect, the more vulnerable you and your users are to serious damage in the event of a breach.

### The integrity principle

Having a sophisticated system for encrypting and protecting user data is great, but it doesn't mean anything if you're collecting that data in the wrong way. Not only do you have to be transparent about how you're doing it, you have to make sure everything you collect is absolutely relevant and required for you to do your job.

When you live in the big data era it can be easy to over-collect, but just because a piece of information is available for you to collect doesn't mean it's actually relevant or necessary. Collecting vast swaths of unnecessary data can actually be really dangerous, both for your users and for your company.

### How Auth0 does integrity

Integrity is why our [privacy policy](https://auth0.com/privacy) makes it absolutely clear why we collect every piece of information we collect, and we also make it clear that we cease storing information when it's no longer required.

We're also upfront about the vulnerabilities inherent to your system. We tell our users that we may be compelled to disclose data to governments in the case of a court order or subpoena, that we may do so if a user's actions could cause harm or [violate our terms](https://auth0.com/terms), and that *no *security system is down-right impenetrable. This is meant not to scare people—it's just so they think twice before sending us anything that's truly sensitive.

As an identity-as-a-service provider, we take unique and incredibly stringent security precautions—even so, we go to great lengths to make sure that everything we write about our privacy policies is comprehensible. The jargon-ridden, overly legalistic privacy policies out there are often trying to [conceal something](http://www.nytimes.com/interactive/2015/06/28/technology/Firesale-Listy.html).

The bottom line is that collecting data honestly and transparently is the only responsible way, and a change in the legal framework surrounding security that doesn't really change anything.

## 3. Give Users The Power To Access All Of Their Data

Facebook has been at the center of numerous scandals around user access to and control over their own information. It's not so much true anymore, but in the service's very early days, you couldn't even remove yourself from the database without going through and [painstakingly](http://time.com/4695/7-controversial-ways-facebook-has-used-your-data/) deleting yourself one piece of content at a time.  

![Deleting your info from Facebook was painstakingly at first](https://cdn.auth0.com/blog/safe-harbor-not-dead/thumbs-up.png)

This was one of a few missteps that led the FTC, in 2011, to force Facebook into receiving [regular audits for privacy](https://www.ftc.gov/news-events/press-releases/2011/11/facebook-settles-ftc-charges-it-deceived-consumers-failing-keep). Another misstep came after, when they decided they would keep user messages around after account deletion. They thought it was important that the recipient of the messages be able to see them: many people, including the FTC, disagreed.

Facebook has obviously changed since then, and so have their security practices. More importantly, we can follow along as the FTC publically audits them for the next two decades: there's accountability.

### The control principle

People have a right to access, edit and rescind the data that at one point they let you collect. It's all about giving the user control. Even if you collect a minimal amount of absolutely relevant user data and do so safely and securely, you still have to let people review how much they gave and take it back if they want.

{% include tweet_quote.html quote_text="People have a right to access, edit and rescind the data that at one point they let you collect." %}

That control also goes hand in hand with accountability. If you're able to access the data you provided to a service and you then see that an independent audit has revealed serious flaws in their security, that audit actually has teeth: you can remove your data and move on.  

### How Auth0 does control

First of all, we invite anyone with questions or issues having to do with our privacy policy to get in touch at [open a support ticket](https://support.auth0.com). That same email can also be used to access or modify any kind of information stored in your account, or stop us from contacting you further.

Additionally, [we provide](https://auth0.com/security) information such as the results of tests done by third parties on our encryption methods. If you want, you can do a live check on our implementation of SSL anytime you like. This test measures how vulnerable the Auth0 site is to attacks and hijackings. Here's a recent result:

![Auth0 Scored A+ in Qualys SSL Test](https://cdn.auth0.com/blog/safe-harbor-not-dead/qualys-ssl-test.png)

We also provide links to the companies—[Liftsecurity.io](http://liftsecurity.io/) and [Sakurity](http://sakurity.com/)—that do our audits, and a full copy of the model contract clauses that we must [currently use](https://auth0.com/mcc) to transfer user data from the EU to the US.

We don't want people to feel “comfortable” with that information and therefore more likely to sign up for Auth0. We want them to see that we've made the materials they need for an informed decision public. If we were audited and found totally lacking, then the element of user control we hold dear would suddenly take on paramount importance.  

## The Coming Privacy Shield

Of course, Safe Harbor's now out of the picture. But the EU and US have agreed, [in theory](http://europa.eu/rapid/press-release_IP-16-216_en.htm), on a new data protection framework.

“Privacy Shield,” as it's called, introduces some unique factors to help address European concerns about data collection while easing the process of doing business for American companies. One is the establishment of an ombudsman. Based in the US State Department, she will review complaints from EU citizens and help them find redress in cases where it's warranted.

<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/safe-harbor-not-dead/eu-us-shield-border.png" alt="Safe Harbor is not dead - it evolved to Privacy Shield" />
</div>

Penny Pritzker, US commerce secretary, [says](http://www.nytimes.com/2016/03/09/technology/penny-pritzker-on-the-privacy-shield-pact-with-europe.html) one of the hardest parts of the negotiation was explaining to the European side that this ombudsman would be independently reporting to the Secretary of State, not the intelligence community.

Since Safe Harbor fell apart in no small part due to revelations of NSA spying by Ed Snowden, the establishment of an independent watchdog against US surveillance was an essential part of the agreement to get right.

[Other measures include](https://www.commerce.gov/privacyshield):

* More rigorous oversight of security certifications inside the US and other strong obligations on companies that deal with the personal data of Europeans
* More cooperation between American and European regulatory officials
* Actual limitations and transparency requirements for public authorities (law enforcement, national security) who want to access data
* A 45-day deadline for any American companies to respond to redress requests coming from EU citizens

The process for ratification is extensive and involves the support of several different regulatory bodies inside the EU, but that process is expected to conclude by June.

Either way, we here at Auth0 will keep doing what we have been doing—following the most stringest possible security standards internally, being transparent about all of it, and always giving you control over your data.   
