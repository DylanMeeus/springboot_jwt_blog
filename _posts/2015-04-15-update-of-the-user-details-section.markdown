---
layout: post
title: "Update of the user's details section"
description: "Good news! We have redesigned the user's profile page in order to make use of the new API v2."
date: 2015-04-15 15:57
alias: /2015/04/15/update-of-the-user-details-section/
author:
  name: Pablo Terradillos
  url: http://twitter.com/tehsis
  mail: tehsis@auth0.com
  avatar: https://s.gravatar.com/avatar/647b1eea820b3fc8a5aee0383930b888?s=60
design:
  image: https://cldup.com/MTjz9l-URX.png
  image_size: "200%"
  image_top: "90%"
  image_left: "90%"
tags:
- dashboard
- product
related:
- 2016-04-18-progressive-profiling
- 2016-04-14-safely-use-best-customer-retention-tactics
- 2015-09-11-7-ways-to-2x-your-revenue-growth-by-putting-your-user-data-to-work
---

**TL;DR**

  * We have redesigned the user's profile page to use the new [API v2](https://auth0.com/docs/apiv2).
  * API v2 brings an improved way of [handling metadata](https://auth0.com/docs/apiv2Changes#8). In short, metadata will be stored in a separate section (__app\_metadata__ and __user\_metadata__) on the user structure and not merged with root attributes, which had caused confusion before.
  * The data you've modified in our previous dashboard version or using API v1 is now under __app\_metadata__.
  * This is a change on the __Dashboard__, not on the runtime. There are __no breaking changes__ to your apps.

<!-- more -->

Good news! We have redesigned the user's profile page in order to make use of the new [API v2](https://auth0.com/docs/apiv2).

User's data is now separated in three sections, each one with different meanings according to what it represents.

### User Identity Section

On the main section you will find essential data such as the user's email and login access information.

![](https://cdn.auth0.com/blog/new-profile-1.png)

### Metadata Section

The __Metadata__ section is the part of the user's data that you can modify.

In the previous user's profile, the _metadata_ was merged with the user's root-level attributes which created some confusion. To make everythig more explicit and easier to find, we've decided to keep it separate.

![](https://cdn.auth0.com/blog/new-profile-2.png)

If you modified user attributes in the past through the dashboard, you will find the additional attributes under __app\_metadata__  after this change (since the dashboard was using API v1).

> [Learn more](https://auth0.com/docs/apiv2Changes#8) about when to use __app\_metadata__ vs __user\_metadata__.

### Identity Provider Attributes Section

Last but not least, there's the __Identity Provider Attributes__ section. Here you will find all the information retrieved from the authentication provider (e.g. Facebook, Twitter, Google, SAML, your own provider, etc.).

![](https://cdn.auth0.com/blog/new-profile-3.png)

This data is read-only. Let's say you'd like to modify the picture that is coming from the Facebook profile. You won't be able to change the attribute in the __Identity Provider Attributes__ section. Instead you need to set the `picture` attribute in the `user_metadata` property and then in your application you would do:

```
<img src="<%= user.user_metadata.picture || user.picture %>">
```

The previous code snippet tries to use the `picture` property from `user_metadata` and if it doesn't exist it uses the default (`user.picture`).

### Raw JSON

Finally, you can easily take a look at the raw JSON format that will be served by our API at the new __Raw JSON__ tab.

![](https://cdn.auth0.com/blog/new-profile-4.png)
