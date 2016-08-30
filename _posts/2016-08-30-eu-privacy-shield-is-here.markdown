---
layout: post
title: "The EU Privacy Shield Is Here"
description: The new body of rules promises to tighten up data security for consumers in Europe.
date: 2016-08-30 08:51
author: 
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design: 
  bg_color: "#044EA1"
  image: https://cdn.auth0.com/blog/eu-privacy-shield/logo.png
tags: 
- privacy-shield
- safe-harbor
related:
- 2016-08-16-how-real-state-companies-can-implement-open-id-connect-with-auth0
- 2016-08-02-analysis-of-enterprise-connections-data
- 2016-05-17-why-identity-federation-matters
---

The European Commission decided last year that the [Safe Harbor Principles](https://auth0.com/blog/safe-harbor-still-matters/), which outlined rules for the security of data transferred between the United States and EU by companies, were no longer robust enough. So they replaced Safe Harbor with the [EU-US Privacy Shield Framework](https://www.privacyshield.gov/welcome).

The Shield isn't a law, it's a system of rules that companies can comply with and get certification for. Therefore it's not a government mandate, but companies that comply will be authorized to transfer personal data from the EU to the U.S. 

This new body of rules promises more stringent protection of data and more oversight for those companies transferring data across the Atlantic.

## What's The Difference Between Safe Harbor And The Privacy Shield

The new EU Privacy Shield was agreed on in August this year with the intention of patching up the holes in Safe Harbor but also upgrading the security that American companies had to ensure.

The Shield is different from Safe Harbor mostly because it calls for the US Department of Commerce to play a larger role in monitoring and supervising compliance, including carrying out reviews and investigations of companies that participate. The Shield is pushing data legislation above and beyond Safe Harbor:

* Participating US companies are now required to post detailed privacy policies on their sites.
* US companies must allow EU citizens to opt out of data sharing with third parties.
* US companies can only process data that is “relevant” to the reason it was collected and must delete personal data that is no longer being used for the purposes it was collected for.
* EU citizens can file complaints via multiple avenues, more than under Safe Harbor.
* If a US company is found in violation by the Fair Trade Commission it has to publish the nature of its non-compliance.
* Even if they withdraw from The Shield, US companies might still have to comply with certain obligations.

Like Safe Harbor, American companies have to self-comply with the Privacy Shield. Doing so allows them to receive certification that their data transferral to the EU is secure. Auth0 is in the process of complying with the brand new EU-US Privacy Shield Framework. 

Currently we already follow many of the rules laid out in The Shield. In our [privacy policy](https://auth0.com/privacy) we demonstrate how discerning we are with data collection—we only ask for personal information we need to deliver our services and to ensure our site is running properly. We may also analyze your data through aggregated data pools, so that no individual is highlighted in our studies. This protects the privacy of our users.

## Why Was The Shield Introduced

With the constant business that flows between the European Union and the United States, sensitive data is moving back and forth across the two unions continuously. The goal with both Safe Harbor and the new EU Privacy Shield is to protect the data of [individual European consumers](https://medium.com/@nichchung/eu-u-s-privacy-shield-how-snowden-and-schrems-led-the-eu-to-armor-up-94207ee96702#.248ekl938). 

Safe Harbor was implemented in 2000. It was established after Google was launched and before Facebook came on the scene. Despite the fact that it was born before the internet looked anything close to what it does today, Safe Harbor wasn't updated until recently.

![A brief safe harbor history](https://cdn.auth0.com/blog/eu-privacy-shield/safe-harbor-history.gif)

*Source: [iapp](https://iapp.org/resources/article/a-brief-history-of-safe-harbor/)*

Safe Harbor was overturned after Edward Snowden demonstrated how the [NSA was collecting and tracking data](http://www.wired.com/2015/10/tech-companies-can-blame-snowden-data-privacy-decision/). These revelations were compounded by Max Schrems, an Austrian law student who [brought a complaint to the European Court of Justice](http://www.businessinsider.com/ecj-safe-harbor-ruling-bots-expected-2015-10) about Facebook's data collection. He asked the Irish Data Protection Commissioner to stop allowing Facebook, an American company, to transfer data from EU citizens to America. 

It soon became clear to EU citizens that their data could also be mined by the American government body without the consent of EU citizens.

After that one-two punch from Snowden and then Schrems, the European Commission was determined to create a new body of rules that would improve on Safe Harbor and make it even more transparent. And so the EU-US Privacy Shield Framework cracks down on insecure data collection and increases government oversight. 

## What Do I Have To Do To Join The Shield

The Privacy Shield requires self-compliance. That means there's no law demanding that you follow the rules set out by Shield, rather your company can opt to do so and receive certification. In complying with The Shield, organizations will be authorized to transfer the personal data of EU residents to the U.S. 

There are four requirements to joining Shield:

1. The company must be under the authority of the FTC or another U.S. agency (i.e. should be an American company or doing business in America) so these groups can ensure compliance
2. The company must make public its commitment to follow the rules laid out in Shield
3. The company must publicly post its privacy policy
4. The company must implement the Principles laid out in Shield

Any company that wants to be certified by the Department of Commerce for Shield must give them a very detailed description of how the company will be using the personal data of EU citizens. The certificate has to be renewed annually.

While we aren't yet Shield-certified, Auth0 is [already SOC 2 Type II certified](https://auth0.com/security). We also conform to the OpenID Connect protocol and offer HIPAA BAA agreements for companies transferring sensitive personal health information. 

We follow a series of verified identity standards and have built our services around them, including LDAP, SAML, OAuth, and JSON Web Tokens. We also maintain the integrity of the data we collect and ensure [security](https://auth0.com/security) through encryption and password hashing. With Auth0 you can ensure up to five levels of password complexity and even opt into custom rules that implement the [OWASP recommendations](https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls). Through Auth0 you can harness these powerful standards to protect your own applications. When we receive Shield-certification, that too will be available.

## The Future Of Data Protection

As soon as Shield landed on August 1, companies like [Microsoft](https://blogs.microsoft.com/eupolicy/2016/08/01/microsoft-signs-up-for-privacy-shield/) and [Workday](http://blogs.workday.com/workday-self-certified-on-day-one-of-privacy-shield/) were already signed up. But Shield is just the beginning for the new generation of data legislation in the EU. 

The EU-US Privacy Shield Framework promises to improve on current data collection practices and companies that get certified within it are signaling to their consumers that they value privacy and data protection. In 2018, data legislation within the EU is scheduled to expand again with the [General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation). Shield is almost a primer for the new Regulation.

Data flow should always be secure no matter where in the world you're located. We are stringent in ensuring all the data we're trusted with remains protected. The EU-US Privacy Shield Framework will make sure that American companies are responsible for all the data they collect so consumers remain safe.
