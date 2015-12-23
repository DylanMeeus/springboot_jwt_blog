---
layout: post
title: "What 3 Security Stories of 2015 Can Teach You About Your Security in 2016"
description: Here’s why SaaS companies should be offering their premium security features to everyone next year.
date: 2015-12-23 17:35
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design: 
  bg_color: "#191716"
  image: https://cdn.auth0.com/blog/3-security-stories/logo.png
tags: 
- security stories
- security breaches
- protonMail
- DDoS
---

2015 has been the year of the data breach. Ashley Madison, Talk Talk, Slack, LastPass, and HipChat, to name a few, have all seen their services compromised this year by unauthorized data breaches or attacks.

These sites, in fact most sites, are easy pickings for attackers because security has long been far down the todo list of most developers. They don’t think about it until something goes wrong, or when they do think about it, it’s as an add-on feature only available to enterprise level customers.

But in 2016 customers will start to look for serious security in the products they’re using. By moving away from the mindset that security is only needed for high-level customers, SaaS companies can offer features that were previously only for enterprise to all their customers. This not only makes their products highly secure, they can also use this ingrained security as a differentiating feature for users. Users are now looking for serious security, and if you can offer it, you are way ahead of your competitors.

Here are 3 security issues that came up in 2015 and how to change your security mindset in 2016 to mitigate these issues and build security into the core of your service.

## ProtonMail: Blackmail By DDoS

Back in November, anyone attempting to access Swiss-based encrypted email service [ProtonMail](https://protonmail.com/) just saw this:

![ProtonMail page unavailable](https://cdn.auth0.com/blog/3-security-stories/protonmail.jpeg)

The [entire service was offline](https://grahamcluley.com/2015/11/armada-collective-ddos/), hit by a powerful Distributed Denial of Service (DDoS) attack. Over 100 companies that relied on ProtonMail for encrypted communications were paralyzed, unable to work themselves while ProtonMail’s servers were being assaulted. This wasn’t done for fun by some tweens, or by some anarchist group for some perceived sleight to the world.  

It was purely for money. 

ProtonMail was blackmailed by a group called ‘The Armada Collective’ who turned their DDoS cannon on the site and demanded $6,000 worth of Bitcoin to stop. DDoSing is nothing new, but add blackmail via a completely anonymous payment system like Bitcoin, and what was a minor annoyance becomes a serious criminal threat.

A Denial of Service (DoS) attack is when attackers try to make your site unavailable for other users. They take up all of your available network resources, making it impossible for your normal customers to reach your site, so they only ever see a page like the one that met ProtonMail’s customers in November.

![How DoS attacks work](https://cdn.auth0.com/blog/3-security-stories/DoS-attack.png)

A Distributed Denial of Service (DDoS) attack takes this type of attack one step further. This attack comes from multiple angles, with multiple attackers, either collaborators or compromised computers that are surreptitiously running as part of a ‘botnet’. There are different ways that attackers can ramp up the amount of traffic hitting your site, but at its core, DDoS attacks create an availability problem, meaning your resources are inoperative for your customers.

![How DDoS attacks work](https://cdn.auth0.com/blog/3-security-stories/DDoS-attack.png)

ProtonMail was hit with over 100 Gbps of traffic, wiping out access to the companies servers. The assault continued for days, until, under pressure from their customers, ProtonMail paid up. ProtonMail wasn’t the first, and won’t be the last to be hit by DDoSing blackmailers. The Armada Collective continues, DDoS-sing its way around SaaS companies, trying to extort Bitcoins from anyone they can hit and take offline. 

### How to mitigate against DDoS: Outscale the attack

DDoS attacks are all about scale. The attackers send a level of traffic that your servers simply can’t handle. If you can scale up your architecture at this point, you can keep your service online while increasing the time and resources needed by the attackers. If you do this, then the attackers will quickly go and find an easier target. Pay up and they’ll see you as the easy target next time around.

When using Amazon Web Services (AWS) they recommend considering the chance of a DDoS attack when building your server architecture and being [ready to absorb an attack](https://d0.awsstatic.com/whitepapers/DDoS_White_Paper_June2015.pdf) when it comes by scaling up dynamically to deal with the extra load.

AWS has two forms of scaling:

* Horizontal: Adding more instances (virtual servers) to your infrastructure
* Vertical: Adding instances with more capacity—more memory, higher I/O performance

Using these two scaling techniques in unison, you can distribute traffic to several different instances, load balancing and dispersing the attack over a wider area. The means that a) the attackers have to use more and more of their own resources to achieve their objective, and b) you have more time to analyze the attack and respond.

AWS lets you set up [auto scaling](http://docs.aws.amazon.com/AutoScaling/latest/DeveloperGuide/WhatIsAutoScaling.html), setting up a desired capacity for your infrastructure, but also a scaling target you are willing to hit when the load increases during an attack (or if you suddenly become *really* popular).

<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/3-security-stories/autoscaling-basic-diagram.png" alt="Autoscaling diagram" />
</div>

In this scenario, the AWS system will always make sure you have 1 instance at your disposal, try and keep 2 available, and give you up to 4 when things go sideways. This extra scale will then give you the latitude to look at where the attack is coming from and determine whether you can georestrict traffic, set thresholds for HTTP requests, or block specific IP addresses from accessing your servers.

AWS isn’t the only cloud provider that supports auto-scaling for dealing with changes in traffic demand. [Microsoft Azure](https://azure.microsoft.com/en-us/documentation/articles/cloud-services-how-to-scale/), [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-automate-the-scaling-of-your-web-application-on-digitalocean), and other big cloud hosting companies offer auto-scaling. Even smaller ISPs will help you out of a hole if you get attacked. 

Contingency planning is key for DDoS attacks. DDosing blackmailers are now targeting SaaS sites, knowing that these companies can’t afford to be offline for long, and might end up paying any ransom demands to get their product back up. By putting a plan in place before your servers go down, you can make sure your service is available consistently and that you aren’t beholden to blackmailers if they do target your site.

Additionally, building on top of an existing framework such as AWS means that you will definitely have the capacity to scale when the time comes, and can quickly take on any extra load without having to deal with all of these issues at the absolute worst time—when you’re being attacked.


## VTech: Massive Data Breach Via SQL Injection

2015 was the year of the data breach, and perhaps no breach outdid the [November hack of VTech](http://www.troyhunt.com/2015/11/when-children-are-breached-inside.html) in showing how lax some companies can be with very personal data. Not only where the details of 4.8 million adults stolen, but also the personal information of 6.3 million children.

VTech make a number of electronic children’s toys, and have their very own app store that both parents and children can sign up for. Using SQL injection, the attacker got access to the database behind this app store, stealing the personal information of anyone who had signed up. For the parents, this information included:

* Name
* Address
* Email
* Secret question and answer
* Encrypted password

Though the passwords held in the database were nominally encrypted (the database column was called *encrypted_password*), the encryption was only a straightforward MD5 hash, with no extra cryptographic techniques, such as [salting](https://en.wikipedia.org/wiki/Salt_(cryptography)), used on the passwords. They are easily crackable, or even [searchable](https://www.lightbluetouchpaper.org/2007/11/16/google-as-a-password-cracker/).

More worrying was the easy access to the personal information of the children on the database. This information included:

* Username
* Date of birth
* Gender
* Password
* Parent ID

So not only were the DOB, gender and password (totally unencrypted this time) of the children’s accounts easily accessible, but using the *Parent ID*, these accounts could be then linked to full names and addresses of parents. [Further reports](http://motherboard.vice.com/en_uk/read/hacker-obtained-childrens-headshots-and-chatlogs-from-toymaker-vtech) showed that images and chatlogs from the children were also obtained in the same data breach.

Luckily, the hacker who hit VTech did it only to highlight the lax security implemented by the tech company, passing the data to a journalist at [Motherboard](http://motherboard.vice.com/read/one-of-the-largest-hacks-yet-exposes-data-on-hundreds-of-thousands-of-kids) instead of selling it. 

Not only was the site susceptible to SQL injection, but the site also transmitted all information—passwords and all personal information—*en clair*, over an unencrypted connection and never using a TLS connection. Neither was the data held encrypted, apart from the cursory encryption of the passwords.  

### How to mitigate against SQL Injection: Regular Security Audits

SQL Injection is just one of the [Top 10 Web Application Security Risks](https://www.owasp.org/index.php/Top_10_2013-Top_10) that the Open Web Application Security Project (OWASP) has identified. Other risks are:

* Cross-Site Scripting (XSS)
* Cross-Site Request Forgery (CSRF)
* Broken Authentication
* Data Exposure
* Security Misconfiguration

Along with SQL Injection, VTech was making at least 2 further mistakes—data exposure and security misconfiguration—that are on this list. No doubt a security researcher would find that they were making almost all of these mistakes.

That is why it is vital for all companies to run security audits on their sites. Unfortunautely, this isn’t what happens. Instead, developers take a ‘I’ll fix it when it’s found’ mentality, presuming that their coding skills are awesome enough that they don’t make such elementary mistakes. That’s probably what VTech’s developers thought.

Services such as [Tinfoil Security](https://www.tinfoilsecurity.com/) will scan your site monthly, weekly, or even daily looking for possible vulnerabilities that attackers could use to compromise your service.

![Tinfoil Security Dashboard](https://cdn.auth0.com/blog/3-security-stories/tinfoil-security.png)

Tinfoil will run automated scans on your site, checking for these vulnerabilities and testing all possible access points.

![Tinfoil Security Results](https://cdn.auth0.com/blog/3-security-stories/tinfoil-results.png)

For any developer, these would be easy fixes. It is more common that the developers simply don’t realize that the site is vulnerable rather than them being unable to secure it effectively. 

The continuous security that a SaaS product affords means that any updates to your site that might break your security can easily be found and fixed, and any new vulnerabilities that become known in the security field are quickly implemented in the scan and can be found on your site.

Instead of either a) ignoring these security holes, or b) trying to find them all yourself, building on top of a SaaS product allows someone else to do all the heavy lifting, in a field where they are an expert, and allows you to get on building the shiny stuff.

## Starbucks: A Lack of User Authentication

1 in 6 payments at Starbucks is now made using their app. You upload money onto it via a credit/debit card or PayPal account and, with a quick scan of the screen, you’ve got your Chestnut Praline Latte. The app is so popular that, in the past year, Starbucks made [$146 million in interest](http://www.bloomberg.com/bw/articles/2014-01-24/starbucks-just-sold-1-dot-4-billion-in-gift-cards-dot-what-did-it-do-with-that-cash) on the money sitting dormant on these cards alone.

But Starbucks aren’t the only people making money off the app—[so are thieves](http://money.cnn.com/2015/05/13/technology/hackers-starbucks-app/).  Users have noticed that they have been suddenly been inundated with notifications from the app, telling them that they are gifting money to other people’s cards in a flurry. They drain the money off the app, transferring the money onto other Starbucks cards that they can then sell on the black market.

Worse still, the app has a function called ‘auto-reload’. When you account hits zero it will automatically add more money to your Starbucks card from your linked account. This way thieves can drain your bank account or Paypal account in a matter of a few minutes, transferring the money onto Starbucks cards that they can then sell on the black market.

Thieves can do all of this with simple stolen passwords. Users don’t consider their coffee app as something that needs strong security, but once it is linked up to a bank account or PayPal account, it suddenly becomes a conduit to all of your money. We don’t immediately associate these apps with all our wealth, but if you have a gift card or payment app that is linked directly to your bank account, then anyone with access has access to your money. 

### How to mitigate against lack of authentication: multifactor authentication

Multifactor authentication (MFA) should be a necessity for any app that is dealing with anything sensitive, whether its money, data, or information. This shouldn’t be something offered for a premium or as a last resort (as happened with [Slack](http://techcrunch.com/2015/03/27/slack-got-hacked/) after they were hacked), but a feature available to every user.

MFA requires a user to have access to another linked account (a separate email account or phone number) or access to the actual device in order to login to the service.

Once the user is asked for their username and password for an account, they are then either sent a separate code to the email account of phone, or can use an authentication app on the device. Even if the username/password is compromised, as in the Starbucks example above, thieves still can’t access the app without physical access to the device.

In Auth0, [setting up MFA](https://auth0.com/learn/get-started-with-mfa) for your service is as easy as flipping a switch.

![Enabling Multifactor Authentication in Auth0](https://cdn.auth0.com/blog/3-security-stories/enabling-mfa-auth0.png)

You can then choose your authentication provider, and MFA will be automatically enabled for users trying to login to your service.

![How Multifactor Authentication works](https://cdn.auth0.com/blog/3-security-stories/duo.gif)

Once a user has used MFA to authenticate on a device, a rule can easily be setup to whitelist that device, making their subsequent logins straightforward. Rules can also be set up to trigger MFA on certain conditions:

* The location, or change in location of the device
* Device used to login
* The network used

Because MFA is so easy to implement via services such as Auth0, there is now no excuse for not offering it. Having MFA makes your entire system more secure (hence why Mailchimp offers a [10% discount](http://www.theverge.com/2013/3/27/4152602/mailchimp-rewarding-users-ten-percent-off-two-step-security) to customers that enable it), and therefore offering it to all your customers makes good security as well as business sense.

## The Need For a 'Security First' Model

In a [recent post](http://blog.learningbyshipping.com/2015/12/15/hallway-debates-a-2016-product-manager-discussion-guide/) on his thoughts for the coming year, Steven Sinofsky, venture capitalist at prominent firm Andreessen Horowitz, emphasized the importance of security in 2016: 

*“Nearly every discussion about what to purchase or what to build next needs to happen in the context of security and privacy.”*

With all the data breaches and security issues in 2015, customers are going to expect that providers build their products with intrinsic security features. So far in SaaS, security has been a bolt-on feature, mainly emphasized for enterprise clients and left out of lower-priced tiers. 

But, as the example of ProtonMail shows, smaller companies are no longer out of the hackers sights. What was previously only for enterprise is now as important for boostrapping services. Security should be among the first wave of product features that developers build in to their own services, making sure that security is deep-rooted within the product.

But with the proliferation of affordable Security-as-a-Service products now available, any developer, whether bootstrapper or enterprise, can embed security right at the core of their product, offering what was once a premium offering to every customer, and making their service safer to use for all.

