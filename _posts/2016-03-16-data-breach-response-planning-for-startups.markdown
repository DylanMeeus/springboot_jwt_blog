---
layout: post
title: "Data Breach Response Planning for Startups"
description: Security is a challenge at most startups. Here's some advice on planning for the worst case scenario, a large-scale data breach.
date: 2016-03-16 11:12
author: 
  name: Eugene Kogan
  url: https://twitter.com/eugk
  mail: eugene.kogan@auth0.com
design: 
  bg_color: "#4b3832"
  image: <A PATH TO A 200x200 IMAGE>
tags: 
- security
- incident response
- data breach
---

Data Breach Response Planning for Startups A serious data breach can have massive negative repercussions for any organization, including the loss of customers, revenue, reputation, even intellectual property. For a startup, it can mean the end of your business. 

Unfortunately, startups are often completely unprepared to deal with a major security incident that involves a breach of sensitive data. Unlike larger, more mature organizations, startups have no choice but to be lean and spend their limited resources carefully. Startups are also worth much less than bigger companies, and all of their energy is focused on growth and proving a business model. So it’s no wonder that they tend to spend less time and money on issues like security, let alone data breach response.

On the other hand, no one wants to see their fledgling company go out of business because of a security breach. So how much time and money does it make sense for a startup to invest in preparing for a breach? I think of planning for the worst as somewhat of an insurance policy. You hope that a data breach doesn’t happen to your company. You put some effort into preventing one through reasonable security controls. But just in case something goes wrong (like if that small security incident suddenly becomes a breach of your credit card database) you want to be prepared.

Now that I’m responsible for security at Auth0, issues like this are increasingly on my mind. It’s my first time working at a startup, having spent the last 15 years working security at huge organizations like AT&T, Amazon.com, and the US Department of Defense. These guys are seriously prepared for anything, from a laptop with malware to a major natural disaster. But when you join a startup, you quickly learn how to pave the road as you’re driving it. For us, now is a good time to start planning further ahead, especially for unlikely but potentially devastating scenarios like a data breach.

Let’s assume your startup has enough valuable intellectual property, a growing user base, and increasing amounts of customer data. It’s likely that you’re already dealing with security incidents on a regular basis. You have a decent incident response plan that is sufficient for the common security issues that small companies face, and it’s probably not a big deal to quietly take care of these in-house.

A data breach is not a run of the mill security incident. What I’m talking about here is a major “oh crap” moment when you realize your entire user database was posted on Pastebin, along with those passwords you meant to hash with something better than SHA-1 but didn’t quite get around to doing. (It’s ok, we’re a startup, right? No! Bad startup! That’s what [Auth0](https://auth0.com) is for.)

So how would your company respond to such a breach? Do you know the legal requirements for notifying your customers? Should you contact law enforcement? Who do you call first and how long can you wait? Every data breach is different, so I’m not going to attempt to provide specific answers to these questions. A lot will depend on how big your business is, how many users were impacted, where they live, what kind of data was lost, and so on. 

** My goal is to help startups prepare for a data breach and to come up with a simple response plan without spending too much money. **

For a small company trying to respond to a major security incident like a data breach, the best thing to do is to ask for help. It’s just not practical or realistic to have all the necessary expertise in-house, at least not until your business can justify having a very large (and expensive) information security organization.

** I recommend having the following relationships in place _before_ you need them: **

* Cyber liability insurance
* Legal council with data breach experience
* Public relations firm with data breach experience
* Incident response and forensics consulting firm

Having these vendors under contract prior to an incident occurring is critical. I hope it’s obvious why you’d want cyber insurance in advance, just like you’d want car insurance before getting into an accident. But there are several good reasons for lining up the rest of your response network in advance. First is the issue of timeliness. It takes time to negotiate a contract with a new vendor, even at a startup. But when you’re responding to an incident, you don’t have any time to spare. You’re already late! Also, a lot of the best vendors will be booked up for weeks in advance, working for their current customers. If your plan is to call an IR firm and hope that they can come help you later today, you will be sorely disappointed (or shocked by how much they want to charge you).

Speaking of cost, there are ways to help reduce the upfront expense of being prepared while simultaneously reducing the cost of an eventual response. Lawyers are expensive, and I don’t have any tips on fixing that problem just yet. So pick a good lawyer with a track record of working on major data breaches, and sign a contract to have him or her on a retainer. You should be able to do this without paying much (or anything) up front.

A public relations firm will be a major asset when it comes time to communicate with your customers. The way a company handles a data breach in the public eye can have a huge impact to how people react. You want to provide just enough details but no more, be accurate so you don’t have to issue a correction later, and take responsibility when appropriate. A PR firm with experience in dealing with data breaches will be able to help you get the right message across. That can go along way to mitigating the damage to your reputation and hopefully reducing the number of lost customers. Once you have a PR firm finalized, it may be worth paying them to draft up some boilerplate press releases for potential breach scenarios, just to save time later on.

Something to keep in mind is that even if you already have a PR firm that your startup uses for standard PR needs, they might be totally clueless when it comes to security incidents. You need to ask them the right questions to find out. If your current firm isn’t up to speed, it’s worth having a second PR firm on board just for breach response.

Do you really need an external IR firm to help you respond to a data breach? If you’re a startup, the answer is almost definitely yes. First of all, it’s unlikely that you have a security team with deep technical expertise in digital forensics. You need that expertise to be certain that the cause and extent of the breach has been accurately identified. And if you can’t be sure of that, then you can’t be sure the breach has been fully contained. This is especially true if the cause is an intentional intrusion by an attacker, who may be actively evading your response efforts. For a serious breach that involves law enforcement, you’ll be grateful to have security consultants with LE backgrounds helping you out.

Even with a team of experts, there is never a 100% guarantee that everything has been found and cleaned up. But you stand a much better chance of doing this correctly if you engage an experienced IR firm. Also, when it comes time to do a press release, having a well-known firm on your side will help your users feel like you’re taking the incident seriously.

When choosing an incident response firm, reputation goes a long way. The firms with better reputations attract better talent, at least on average. As always, it pays to ask around for recommendations from people you trust. The bigger firms are generally all decent, and will have several advantages over the smaller guys. First, all major firms offer a zero cost retainer option, so you can sign a contract and have them ready to go without spending any money upfront. Second, they will probably be quicker to respond than a smaller firm, simply because they have more consultants available at any given time.

Another advantage bigger firms have (not just IR, this goes for PR and legal as well) is their breadth of experience. This can be especially important if your startup has customers in foreign countries with strict privacy laws or notification requirements, or if you’re using a complex or niche technology stack. Is your product built with OpenBSD, Scala, and Spark, hosted on Oracle’s cloud? You should probably make sure the IR firm has people with experience using those technologies. Startups tend to be on the bleeding edge and most security consultants simply can’t keep up.

Up until now I’ve mostly avoided talking about cyber insurance, partially because I hate the word “cyber.” But the reality is that every significant business should have some cyber liability coverage to help absorb the financial burden of a large-scale data breach. You will need a policy that’s tailored to your company, its projected growth, and the risks associated with your industry.

The first step to getting cyber insurance is to find a knowledgeable broker. It pains me to say this, since we techies generally don’t enjoy dealing with middlemen like brokers, but that’s really the only way to go at this point (until a startup comes along and successfully disrupts this model). Again, ask your industry peers for recommendations on a cyber insurance broker, and don’t assume your regular business insurance guy will know anything about this stuff. If you start this process with the wrong broker, you may end up with an inappropriate policy that will fail you when it comes time to file a claim.

Selecting a cyber insurance policy should actually be one of your first steps, once you have a clueful broker and a basic incident response plan in place. The reason for this is that almost all agencies will have a list of approved vendors that you’re strongly suggested to use in the event of an incident. They have pre-negotiated rates with these vendors, and they are (allegedly) vetted and deemed competent. It’s usually possible to get an exception to use a vendor that’s not on your insurance agency’s list, but that means jumping through more hoops to get them approved. If you go down this road, your broker should help you out and provide advice. So if you have a particular PR or IR firm in mind that you really want to work with, you should let your broker know before you start shopping around for a policy. I don’t recommend signing any contracts until you are sure that your cyber insurance policy will allow you to work with the vendor in question. This includes legal council and other vendor categories that I haven’t even mentioned, such as credit monitoring and notification service providers.

** Here’s my recommended action plan for getting your startup in a good place, ready to respond to a large-scale data breach: **

1. Think about security, work on improving it, and have a decent incident response plan.
1. Document some potential data breach scenarios that your company might face, including the kinds of data that might be impacted, the number of users you have, where they’re located, and so on.
1. Contact a few cyber insurance brokers, ideally from trusted recommendations. Pick one who is knowledgeable and willing to work with startups.
1. Work with your broker, CFO, and security team to find a policy that meets your requirements.
1. Be aware of the agency’s approved vendor list, and ask for exceptions (if you have any in mind) before buying a policy.
1. Carefully select vendors to help you in case of a breach. That includes at least legal, PR, and IR firms.
1. Sign a contract with these vendors so that they are ready to help you respond at a moment’s notice. Go for zero cost retainers if that makes financial sense for your business.
1. Review all of the above as your startup grows and changes over the year. If your revenue explodes, you will need to increase your insurance coverage sooner rather than later.

You can never be too prepared when it comes to security. So what are you waiting for?
