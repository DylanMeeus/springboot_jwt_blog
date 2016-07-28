---
layout: post
title: "How to Build Customer Trust in Your SaaS Through SOC 2"
description: Learn what SOC2 is and how we implemented it at Auth0
date: 2016-01-18 13:30
alias: /2016/01/18/how-to-build-your-customer-trust-through-soc-2/
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: #221E20
  image: https://cdn.auth0.com/blog/soc/logo.png
tags:
- customer-trust
- soc
- soc-2
- boost-revenue
related:
- 2014-12-11-auth0-achieves-soc-2-certification
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2015-06-23-another-big-milestone
---

The SaaS model is built on one thing—trust. Data breaches can cost millions, so it’s paramount companies can trust their SaaS providers with their data. As a SaaS, if people don’t trust you with their data, it will destroy you.

However if they do trust you, you can become the go-to SaaS provider in your sector for all companies, from bootstrappers up to enterprise. This will significantly increase your potential customer base as you expand into these enterprise areas, and drastically increase your revenue from these companies.

So showing that you can be trusted is essential for a SaaS company moving into enterprise, and one of the best ways to build trust in your service is through SOC 2 attestation.

We’ve recently successfully completed our SOC 2 Type II audit. Here’s why we went for this report and why every SaaS should consider this as the future of trust in the cloud.

## **What’s SOC?**

<div class="" style="text-align: center;"><img style="margin: 0;" src="https://cdn.auth0.com/blog/soc/soc2-logo.jpg" alt="SOC Logo" />
</div>

Back in the day there was no cloud. Enterprise companies had their own datacenters, performed their own processing, and calculated their own analytics. They only had internal data. To fight against internal fraud, the American Institute of Certified Public Accountants, AICPA, came up with a way of reporting how financial institutions controlled their internal data, called SAS 70. It focused on the risks related to this internal control of sensitive data—principally the privacy and the integrity of the data.

This was all well and good, but then SaaS came along. This paradigm shift from internal data to data living in the cloud and constantly moving back and forth between different cloud providers left these previous protocols in the past. Now internal data controls weren’t the only problem, there were also complex issues surrounding the security of this data as it moved between the different providers, and the availability of all these external systems.

For some time, SAS 70 continued to be used, but it [became widely abused](http://blogs.gartner.com/french_caldwell/2012/10/09/time-to-stop-misusing-ssae-16-in-vendor-marketing/comment-page-1). Renamed SOC 1 (Service Organization Controls 1), some SaaS providers touted a SOC 1 attestation as proof that their service is secure and can be trusted, but that was never the intent. SOC 1 helped firms comply with financial audits and prevent fraud, but it says nothing about what controls external providers should have in place to protect customer data in the cloud.

As SaaS took off, it became increasingly important for businesses to know that these external companies had the right security in place to protect any sensitive data. A new standard was needed, built around increasing the trust financial firms could put in SaaS.

Along came SOC 2.

### SOC 2 Is All About Trust

SOC 2 was set up to define the criteria for how external SaaS companies should manage their customers' data. It uses 5 Trust Principles set out by the AICPA so companies know whether the SaaS can be trusted. An independent third party audits the SaaS provider and generates a report for the SaaS, showing they do what they say. The [5 Trust Principles](http://www.aicpa.org/interestareas/informationtechnology/resources/soc/trustservices/pages/trust%20services%20principles%E2%80%94an%20overview.aspx) are:

* Security: The system is protected against unauthorized access.
* Availability: The system is available for operation and use as committed or agreed.
* Processing Integrity: System processing is complete, accurate, timely, and authorized.
* Confidentiality: Information designated as confidential is protected as committed or agreed.
* Privacy: Personal information is collected, used, retained, disclosed and destroyed in conformity with the commitments in the entity’s privacy notice and with criteria set forth in Generally Accepted Privacy Principles issued by the AICPA and CICA (Canadian Institute of Chartered Accountants).

A SOC 2 report can include just 1 of these principles or all 5 depending on what the SaaS does with other companies' data. Most companies want to know two main things from potential SaaS providers: do they have the security in place to prevent a data breach, and will their service be available constantly? These 2 Trust Principles—Security and Availability—were the the principles Auth0 has been audited on.

### Type II Is All About CONSISTENCY

Both SOC 1 and SOC 2 reports have two types, Type I and Type II.  Last year we announced our [SOC 2 Type I](https://auth0.com/blog/2014/12/11/auth0-achieves-soc-2-certification/) report. Today we’re announcing our SOC 2 Type II report. What’s the difference?

The distinction is in what each attestation reports:

* Type I—reports on whether the systems are **suitably designed**. It gives an overview of the systems a SaaS has in place to satisfy the Trust Principles it’s being audited on.
    * This type of report looks at your company and your procedures to determine whether they are designed to do the job you say they do. For instance, does your secure communications app correctly encrypt data?
    * However, a Type I report doesn’t take into consideration how well these actually work in practice. For that, you need:
* Type II—these reports look at the actual effectiveness of the system design and if it’s **operating as designed**.
    * They audit how well your software, team, and procedures worked with actual data within that timeframe.
    *  Were there any security lapses? Was your service down for any significant time? Was the data processed effectively? Did your secure comms app continually encrypt data over the timeframe, 12 months in our case, the auditors tested your system?

It’s the Type II reports that your customers really want. They want to see whether your system operates effectively over the long term.

When you have a SOC 2 Type II report, you can show it to customers as evidence that you do what you say. It shows that external auditors have agreed that the control systems you have in place work as you say they do, observed over an extended period.

Any potential enterprise customer can see that you conform to the highest standards of the AICPA and that you walk the walk, not just talk the talk. When it comes time for your customers to satisfy *their* auditors of *their* compliance, they can point to your SOC 2 report and show they are using compliant services themselves. For instance, to satisfy our  auditors, the security team here at Auth0 reviews the SOC 2 assessments of our hosting providers to make sure their security controls are operating effectively.

## The Benefits of SOC 2

Having a SOC 2 report available for potential customers opens you up to entirely new billion-dollar industries.

First and foremost, the financial industry: banks, investment companies, mortgage providers, even firms printing customer statements will only work with providers that have SOC 2 attestation. Adoption of these security standards and protocols makes CIOs and CSOs much more confident about using SaaS solutions.

Beyond finance institutions, health, insurance, payroll, and HR businesses all deal with sensitive data that require the highest standards of data protection that SOC 2 represents. They may also require their own certification, but having SOC 2 attestation shows you are serious about data security. In fact, all companies have sensitive data, so being able to show your security has been audited and that you can be trusted builds confidence in your business for all potential customers.

And SOC 2 goes even further. Because these billion-dollar enterprise firms require SOC 2 compliance throughout all the SaaS providers they work with, these SaaS providers also need to use SOC 2 compliant vendors. Therefore if you want to sell to other SaaS providers you have to be SOC 2 compliant. Then these 3rd party vendors can also become a new customer base.

![Being SOC compliant lets you sell to companies that require it](https://cdn.auth0.com/blog/soc/soc2-compliance.png)

Not only can you increase your customer base through a SOC 2 audit, branching out into financial sectors, health sectors, and other areas with sensitive data, it also works as a marketing tool for more general customers, implicitly demonstrating how well your company works.

This report shows that you have been externally audited as trustworthy. More than marketing materials, or your word, it's objective proof that you can be trusted with someone else's data.

## **How We Got Our SaaS Ready For SOC 2**

If you want to [go upmarket](https://auth0.com/blog/2015/08/18/how-to-go-upmarket-and-grow-your-revenue-by-20x/) and start to attract big enterprise customers then SOC 2 attestation can often be a deal-breaker. Companies dealing with sensitive data want end-to-end compliance and not having SOC 2 means that they won’t even talk to you.

Here’s how our methods and procedures helped get Auth0 SOC 2 ready in the 2 Trust Principles we were audited on—security and availability—and can give you an insight into what’s needed to get this attestation.

### Security

A big part of Auth0 is our continual deployment. We deploy three to four times a day without downtime.

{% include tweet_quote.html quote_text="A big part of Auth0 is our continual deployment. We deploy three to four times a day without downtime." %}

To make this work, we need to be continually testing and integrating new code through staging and into production. Nobody at Auth0 can push to production without the approval of another team member, and no code goes live without making its way through our continuous integration and delivery server. This orchestrates all the tests needed for each job:

* **Unit Testing**—every core project at Auth0 has its own unit tests specifically built to verify code functionality. No job continues into production until all the unit tests for its specific project go green.
* **Functional Testing**—if the project is part of our frontend we have to test if it’s working as expected. For that we simulate a human workflow (such as opening up [auth0.com](http://auth0.com/) and trying to login into the dashboard) and check that all the elements on the page load as expected and that the action was able to be executed. We check over multiple browser and machine configurations. Again, if there are errors, the job is stopped and the errors logged.
* **HTTP Tests**—we run automated HTTP tests using [Runscope](https://www.runscope.com/) to validate that our APIs are working correctly. The results show the HTTP response, body, and headers of the response, the result of the assertions, and any custom script we might have defined. In case of failure, the Slack integration notifies our Slack channel. These test suites are executed on a scheduled basis targeting our production environment and after our CI server deploys to our staging environment.

As we use Slack integrations to run these tests, the Slack history then serves as our central repository for what happened when, as traceability is key for compliance. In case anything does go wrong, we can also automatically roll back the most recent release.

We keep our customers up-to-date on the latest releases at [releases.auth0.com](http://releases.auth0.com/), where customers are notified of any significant additions, fixes, or changes to the application.

With Auth0, data is encrypted in transit through Transport Layer Security (TLS) and at rest in an [AWS Elastic Block Store](https://aws.amazon.com/ebs/) (EBS). EBS encrypts both data and backup snapshots, is constantly monitored, and employs multiple redundancies. We also regularly perform failover tests to make sure we can move to backup effectively and securely.

In terms of detecting security issues with our app or site, we use a security monitoring platform to detect anomalies occurring within our infrastructure.

Our codebase is audited quarterly by [Lift Security](https://liftsecurity.io/), who are Linux and Node.js experts, and we encourage responsible security research on Auth0 through our [white hat](https://auth0.com/whitehat) program. If anyone discovers a security vulnerability in Auth0, we’ll work with them to validate and respond to all reported issues, and will happily put them on our [Researcher Hall of Fame](https://auth0.com/whitehat) to thank them.

### Availability

Availability is integral to SaaS, and at Auth0 we have designed our systems with the goal that our users, and your users, never see any down time.

Our High Availability system has been architected to incorporate multiple redundancies at all levels:

![Auth0 High Availability Architecture](https://cdn.auth0.com/blog/soc/high-availability-architecture.png)

The 3-part strategy is actually quite simple:

* **Redundancy in critical systems**—If one database is taken down, a secondary database from a different availability zone is elected as primary.
* **Rapid failure detection**—If there is an outage on the primary datacenter, the DNS immediately detects that and start redirecting requests to another datacenter in a different location.
* **Quick, safe failover**—We take a database snapshot every few hours, so we always have an up-to-date backup of all data available in case of catastrophe.

Our database snapshots also lets us recover from any issue quickly. It also has a feature that has come in very helpful for some of our customers. We can query the backup snapshot without having to restore the full dataset. This means that if a customer makes a mistake and, say, accidentally deletes all their data, we can recover their data in a matter of minutes.  A few of our customers have been very grateful for this service so far!

Our commitment to availability goes further than just the system architecture. The application is built to assure extra availability. How we manage user sessions, partition functionality, prioritize availability of modules, and handle transient conditions all facilitate increased availability of the app.

To keep our customers up-to-date on our availability, we use 2 systems:

* [status.auth0.com](http://status.auth0.com/) shows our customers the current status of our site, API, and dashboard. This is externally hosted (by [StatusPage.io](http://statuspage.io/)) so if we ever go down, any of our customers can still access this page and find updates from the team that are working on the outage.
* [uptime.auth0.com](http://uptime.auth0.com/) gives our customers in-depth uptime information, via [Pingdom](http://pingdom.com/), about pages from our site, so if they are suffering a slow connection they can check this page to see what current responses times are.

Additionally, we hit up Twitter and email whenever we need to get in contact with our customers quickly.

### Common Criteria: People & Procedures

As important as the software and infrastructure we use are the people, procedures, and policies we have instituted to optimize our workflow at Auth0.

Internally we keep track of our policies and procedures with versioning, so we can easily review how they’ve changed over time. Whenever a policy or procedure is approved we simply add the approver and date to the end of the document so everyone know it’s up-to-date.

To comply with SOC 2 we needed certain documents in place, which we already had as best practices. We’ve created written policies on password protection (something close to our hearts), patch management, encryption, and employee code of conduct.

For procedures, we have approved measures for change management, data breaches, DoS attacks and system backup and recovery. More specifically for us, we also document exactly who has access to certain code projects. This last point is important, particularly for SaaS startups. Openness and all-access to commonplace among these types of companies, but when it comes to SOC 2, access control is a fundamental requirement.
——
For companies that deal with financial data, or any data of a sensitive nature, SOC 2 is non-negotiable. Though it may seem like a significant burden for you and your team to pursue this attestation, the rewards can be immense.

A SOC 2 banner on your site starts to put you in line for an entirely new level of company, large enterprise businesses that need to protect their customer data, their employee data, and their corporate data with the highest levels of security. Successfully completing a SOC 2 audit shows these companies that you meet these high standards and that you’re serious about compliance if its required in their industry.

Not only that, but it also shows them that you can be trusted and that your entire team is dedicated to this security mission and the protection of your customers data.
