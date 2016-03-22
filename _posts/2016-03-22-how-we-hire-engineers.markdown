---
layout: post
title: "How we hire engineers"
description: "Provides transparecy about our hiring process and the rationale behind it."
date: 2016-03-22 12:00
author:
  name: Damian Schenkelman
  url: http://twitter.com/dschenkelman
  mail: damian@auth0.com
  avatar: https://www.gravatar.com/avatar/1c9619a22f32012221bd59296dc9a1a2??s=60
design:
  bg_color: "4F496F"
  image_size: "110%"
  image: https://cdn.auth0.com/blog/hire-engineers/hiring-logo.png
tags:
- Engineering
- Hiring
---

# tl;dr
![hiring process](https://cdn.auth0.com/blog/hire-engineers/hiring-process.png)

# The full version
Hiring is a key aspect of helping Auth0 grow. We are doing great, there's lots of things we want to get done in the short term and building a team that can handle this growth is paramount for continuing success.

There are many blog posts explaining why [startups shouldn't handle hiring like big companies do](https://zachholman.com/posts/startup-interviewing-is-fucked/). And we totally agree with this: we want to invest time to take the decision of making a new person part of our team.

For this reason we have a hiring process that requires a lot of involvement from both us and candidates.

## In the beginning
Usually conversations start when we get an email at [jobs+engineer@auth0.com](mailto:jobs+engineer@auth0.com). This is a very early stage and we have no information other than a CV and the email's contents.
The first thing we look for is:
>Does it seem like the person WANTS to work at Auth0?

This is a very important point as we believe it is important to have teammates that are passionate about the job they are doing. One of the things we do at this stage is check:
>Do the email contents reflect interest in the company and position or is this just a template that gets sent to a bunch of potential employers?

After that we take a look at the CV to _try_ to assess relevant experience and think if the candidate could do the job. Whether we think **strong yes** or are in doubt, we will move to the next step.

<div>
  <img style="margin: 10px; max-width: 150px; max-height:89px" src="https://cdn.auth0.com/blog/hire-engineers/screener.png">
  <h2 style="display: inline-block;">The screener</h2>
</div>
The next thing do is learn more about the candidate. To do this we send them a short screener -- an idea we got from [this intercom post](https://blog.intercom.io/how-we-hire-engineers-part-1/)-- with questions that look like this (they might vary a bit depending on the specific position):

1. What's your proudest professional achievement? It can be a personal project or something you did at work/school. Just a short paragraph is fine, but we’d love to know why you're proud of it.
2. Tell us about an article/blog post/github repo you found recently, why you liked it, and why we should check it out.
3. Tell us about a feature of Auth0 you really like, and why.

We also ask them to put together a small [webtask](https://webtask.io/) hack, something that should take a couple of hours.

Although there are some people that think that investing time to answer this email is not worthwhile, more often we tend to get really interesting responses. This responses are useful to learn things about the candidate, such as:

* The kind of topics this person is interested in.
* The things they know and like about Auth0: we are a company with a lot of available content, so there's lots of room to share knowledge here.
* An initial impression at their coding skills.

>If we were in doubt about a candidate, this is a chance to impress us.

We also value creativity. For example, one candidate created a pair of webtasks that played tic-tac-toe against each other using different heuristics. Another candidate, who we hired, [created a service](https://github.com/radekk/webtask-tfa-monitor) to monitor the status of user accounts using other Two-Factor-Authentication services.

<div>
  <img style="margin: 10px; max-width: 150px; max-height:89px" src="https://cdn.auth0.com/blog/hire-engineers/interview.png">
  <h2 style="display: inline-block;">The interviews</h2>
</div>
Assuming that everything went well, I have a call with candidates. The goal is to:

* Go through past work experience
* Explain the position to the candidate and gauge their interest
* Understand what they like to do and which [team](https://auth0.com/jobs/engineer) would be a good fit for them
* Evaluate the technical experience (more on "how?" below)

Up next, we do another call with the engineering lead for the position (e.g. frontend, backend, native, etc.). This is to validate the technical experience and to see if they would like to work with the candidate.

### No live coding
We believe it is really hard to assess technical knowledge with a short live coding exercise. We have all been there before: [it is VERY easy to get nervous](http://www.hanselman.com/blog/HowDoYouDealWithAnxietyWhenLiveCodingInTechnicalInterviews.aspx), it's very hard to define a problem that is actually related to the job and solvable in a short amount of time, etc.

What we do is talk. We go over situations that we have faced at Auth0 and have discussions about their implementation. It doesn't require any specific tool knowlege, it is all very conceptual and the idea is to give candidates room to ask questions about what they don't understand and go over pros and cons of each possible solution.

We believe this has worked well so far. Being in an interview is enough to make people nervous even without requiring live coding. Most candidates have expressed relief when being explained that they are not going to have to do that. We actually try to state that at the beginning of the interview, as it seems to relax them.

We know that this way of evaluating knowledge is not perfect and are continuosly improving based on feedback, but we need a way to try to determine if this person is someone we want to invest more time on for the technical exercise.

<div>
    <img style="margin: 10px; max-width: 150px; max-height:89px" src="https://cdn.auth0.com/blog/hire-engineers/tech-exercise.png">
    <h2 style="display: inline-block;">The technical exercise</h2>
</div>
After the two interviews, we move on to the technical exercise. This consists of:

1. Setting up a slack channel with everyone involved in the hiring process. We invite candidates using [this slack bot](https://github.com/auth0/webtask-scripts/blob/master/slack/invite.js).
2. Providing the exercise (which varies depending on the specific position)
3. Explaining candidates that they are free to ask questions and validate their thoughts in the channel

We want the exercise to actually be related to what candidates will be doing on the job. Because of that we use a task that either was in our backlog or still is.

It takes between 8 and 12 hours to complete, and we give ~7 days to do so. Each person approaches this differently and is in charge of managing their schedule.

What we do is guide them, by going deeper into the requirements or highlighting problems that might lie ahead. We do our best to adjust to each schedule, such as replying on late nights and weekends as we know this requires time from both parties. It is a pretty interactive process!

This is where we learn a lot about the candidate, and it's not only their coding skills. We also look at things like:

* Are they autonomous?
* Are they good at researching things they don't know?
* How do they manage expectations?
* Do they incorporate our feedback into their solution? How do they take it?
* Is the solution oriented at making life easier for customers or does it "just work"?
* Are they detail oriented?

<div>
  <img style="margin: 10px; max-width: 150px; max-height:89px" src="https://cdn.auth0.com/blog/hire-engineers/demo-cto.png">
  <h2 style="display: inline-block;">Demo and CTO chat</h2>
</div>
After the exercise is finished we setup a 1 hour call.

During the first half, a 30 minute demo is held to go over the solution's implementation. This is a good point to go over any thing that wasn't previously covered in chat.

If everything goes well, the remaining 30 minutes are spent on a chat with Matias, our CTO. He is very involved in the hiring process (actually part of the channels) and wants to get to talk to all potential team members. This is a great opportunity to ask him questions like: "How do you keep your hair so shiny?" 😄

Jokes aside, you get to talk to one of Auth0's founders. This is a good opportunity to understand our vision, how we got here and anything else you want to know about us.

## Some stats
We all know hiring is hard. We actually measure how hard it is. For example, for a particular job posting, out of 126 candidates we hired 5 of them. The following image shows a summary of the stages for that posting:
![stats](https://cdn.auth0.com/blog/hire-engineers/posting-chart.png)

## Wrapping up

This is what works for us now; and we know there's room for improvement. We continuosly adjust the technical discussions and exercises based on feedback from candidates. In fact, one of the reasons for publishing this post is that some candidates wanted to know about our hiring process before they went through it.

At Auth0 we value transparency, and to practice what we preach we want to be transparent about our recruiting process. So if at any time you want to [be part of Auth0's engineering team](https://auth0.com/jobs/engineer), you now have an idea of what to expect. 😉