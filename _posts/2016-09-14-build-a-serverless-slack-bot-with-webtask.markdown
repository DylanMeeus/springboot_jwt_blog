---
layout: post
title: "Build a Serverless Slack Bot with Webtask.io"
description: "Learn how to create a bot that posts mentions in Zendesk to relevant Slack users using the Auth0 Webtask platform"
date: 2016-09-14 08:30
author:
  name: "Thameera Senanayaka"
  url: "https://twitter.com/thameera"
  mail: "thameera@auth0.com"
  avatar: "https://en.gravatar.com/userimage/11371420/54f3fecf3ce3bbef2d7a62b4f0496de2.jpg?size=200"
design:
  bg_color: "#4A4A4A"
  image: "https://cdn.auth0.com/blog/slackbot-with-webtaks/logo.png"
tags:
- serverless
- faas
- webtask
- webtask.io
- zendesk
- slack
- automation
related:
- 2016-06-28-building-serverless-apps-with-webtask
- 2015-12-11-get-your-twitter-share-count-back-with-a-webtask
- 2015-07-28-if-this-then-node-dot-js-extending-ifttt-with-webtask-dot-io
---

If you’re like me, whenever you get a cool idea to create an app, the mere thought of preparing and maintaining a server always gets you down—and then there’s all the security considerations you have to think about. The advent of PaaS services like Heroku solved this problem to some extent. Now that serverless technologies have come into the mainstream, making your ideas reality is easier than ever.

Serverless platforms allow you to focus more on the code and get real work done without worrying about managing servers. Many people prefer the term function-as-a-service (FaaS) instead of serverless to serverless, because what essentially functions are the unit of application logic in this realm. Auth0's [Webtask](https://webtask.io/) is a hassle-free serverless platform you can use to deploy and run functions.

At Auth0, we tend to solve most of our problems using Webtasks. Here's an example of how we used them to create a Slack bot to tackle a pressing need we had.

## Go Beyond Basic Slack and Zendesk Integration

We’re not trying to brag, but Auth0 is known for its wonderful customer service. We use Zendesk to manage the hundreds of customer queries we get every day. Since this is an integral part of our day-to-day work, we use multiple Zendesk-to-Slack integrations to make sure we respond to every customer query in a timely manner.

For a long time, we needed the ability to mention someone else in a ticket. The only out-of-the box option was to cc that person’s email, but this had its own drawbacks. We wanted to achieve an integration that would go hand-in-hand with our primary method of communication: Slack. Zendesk has some basic Slack integration options, but it’s not programmable enough to handle mentions.

Then we thought, “Can we use a webtask to achieve this?”

## Webtasks to the rescue

Of course we can! Any time you want to automate something, you can use a webtask. We quickly implemented a Zendesk-mentions-to-Slack integration in a webtask. We didn’t need to procure any servers or worry about how much computing power or uptime we would need. All we had to do was write the code and create a trigger in Zendesk.

## Overview

Here’s an overview of the data flow in our app:

![Slack and Zendesk Integration](https://cdn.auth0.com/blog/slackbot-with-webtaks/slack-and-zendesk-integration.png)

Peter, a Zendesk agent, mentions his colleague Rodrigo as `<@rodrigo>`. That’s Rodrigo’s Slack username. A Zendesk trigger picks up the comment with a mention and does an HTTP POST request to our webtask. The webtask analyzes the comment and determines the exact Slack user (`@rodrigo` in this case). It then calls the Slack API to send a direct message to `@rodrigo` with details about the comment. If Peter mentioned a Slack channel name instead of a username, it would be sent to that specific Slack channel.

To set this up, we needed to do the following:

- Create a Slackbot
- Write and deploy the webtask
- Create a trigger in Zendesk

## 1. Create a Slackbot

Simply visit [this page](https://my.slack.com/services/new/bot) and enter a name for the bot. A new Slack bot will be created. After it has been created, an API token will be assigned to the bot. Make a note of this because we will need it in the next step.

## 2. Create the webtask

Now the fun begins. First, if you haven’t set up the webtask CLI, follow the three simple steps on this [webtask.io](https://webtask.io/cli) page. Once you’re done, it’s time to write the code.

Here's the code we used at Auth0. You may edit it to your liking.

```javascript
'use latest';

const request = require('request');
const _ = require('lodash@4.8.2');

const baseURL = 'https://slack.com/api/';
const usersListEndpoint = 'users.list';
const imOpenEndpoint = 'im.open';
const chatPostEndpoint = 'chat.postMessage';
let token;

/* Call the given endpoing in Slack API */
const callAPI = (endpoint, form, cb) => {
  request.post(baseURL + endpoint, {form}, (err, res, body) => {
    if (err) return cb(err);

    body = JSON.parse(body);
    if (!body.ok) return cb(body.error);

    return cb(null, body);
  });
};

/* Find Slack ID of the user with given username */
const findUser = (username, cb) => {
  callAPI(usersListEndpoint, {token}, (err, body) => {
    if (err) return cb(err);

    const user = _.find(body.members, {name: username});

    if (!user) return cb(`User ${username} not found`);
    cb(null, user.id);
  });
};

/* Open a direct msg channel with given Slack user id */
const openIM = (user, cb) => {
  callAPI(imOpenEndpoint, {token, user}, (err, body) => {
    if (err) return cb(err);
    cb(null, body.channel.id);
  });
};

/* Post message to specified Slack channel */
const postMsg = (channel, data, cb) => {
  const obj = {
    title: `#${data.id} | ${data.title}`,
    title_link: 'https://auth0.zendesk.com/agent/tickets/' + data.id,
    fields: [
      {title: 'Mentioned by', value: data.author},
      {title: 'Comment', value: data.comment},
      {title: 'Tags', value: data.tags}
    ]
  };
  callAPI(chatPostEndpoint, {
    token,
    channel,
    as_user: false,
    username: 'Zendesk Mentions Bot',
    icon_url: 'http://i.imgur.com/IhN4IzR.png?1',
    text: 'You were mentioned in this ticket:',
    attachments: JSON.stringify([obj])
  }, (err, body) => {
    if (err) { console.log(err); return cb(err); }
    cb(null);
  });
};

/* Extract mentioned user's name from comment */
const extractName = (comment) => {
  const start = comment.indexOf('<@') + 2;
  const end = comment.substr(start).indexOf('>');
  return comment.substr(start, end);
};

module.exports = (context, cb) => {

  // Slack bot token
  token = context.data.BOT_TOKEN;

  const name = extractName(context.data.comment).toLowerCase();

  findUser(name, (err, id) => {
    if (err) {
      // If no such user, assume it's a channel
      return postMsg(name, context.data, cb);
    }

    return openIM(id, (err, channelId) => {
      if (err) { console.log(err); return cb(); }
      else postMsg(channelId, context.data, cb);
    });
  });

};
```

That’s less than 100 lines of code!

The entry point to the code is the line starting with `module.exports = (context, cb) => {`. When the webtask is triggered, this function will be executed, which will in turn call the rest of the functions when necessary.

For security reasons, we add the bot’s token as a configuration (as described below) instead of in the code. Then we find the mentioned name from the comment text. We check Slack to see if such a user exists. If not, we assume it’s a channel name and post it into the channel with that name. If a user is found, we open an IM channel with that user and post the message.

Save this code in a file named `slackmention.js` and enter the following command to deploy it as a webtask:

```
wt create --secret BOT_TOKEN=<Slack bot token from step 1 goes here> slackmention.js
```

After the webtask is deployed, the CLI will present you with its unique URL. We will use this in the next step.

## 3. Create a trigger in Zendesk

The last step is to tell Zendesk to call our webtask when it sees a comment that might have a mention in it. You need to be an admin in Zendesk to do this. If you are not, reach out to your friendly Zendesk admin (and don’t forget to give them a cookie!).

In Zendesk, go to **Settings > Extensions** and create a new HTTP target with the webtask’s URL as the URL (obtained in Step 2), POST as the method, and JSON as the content type.


Now go to **Settings > Triggers** and create a new trigger with _‘Ticket: Comment text...’_ as the condition, “Contains the following string” as the op, and `<@` as the string. The performed action should be _‘Notifications: Notify target’_ set to the HTTP target created above. Set the JSON body as follows:

{% highlight json %}
{% raw %}
{ "id": "{{ticket.id}}", "title": "{{ticket.title}}", "comment": "{{ticket.latest_comment}}", "author": "{{ticket.latest_comment.author.name}}", "tags": "{{ticket.tags}}" }
{% endraw %}
{% endhighlight %}

## Test it!

Now we are all done. To test our new setup, add the following comment in a new (or existing) Zendesk ticket. You can add it to a public comment or an internal comment.


```
Hello <@thameera>!
```

Replace `thameera` with your Slack username, of course. If you performed all the steps in order, you will get a Slack notification like this:

![Slack mention in the Zendesk ticket](https://cdn.auth0.com/blog/slackbot-with-webtaks/zendesk-bot-with-slack-mention.png)

That’s it! You can customize the trigger and the webtask to suit your company’s needs and deploy your own Zendesk-to-Slack-mentions implementation in a few minutes. For example, you can modify it to send an email or send a DM via HipChat if that’s your chat application of choice.

## Conclusion

The next time you need to create a bot, automate something, or write a program, remember that you can use a webtask to say no to [yak shaving](http://www.hanselman.com/blog/YakShavingDefinedIllGetThatDoneAsSoonAsIShaveThisYak.aspx) and focus on your code.

You can start experimenting with webtasks by creating a free Auth0 account below or heading directly to [https://webtask.io](https://webtask.io). Enjoy!