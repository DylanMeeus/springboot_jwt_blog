---
layout: post
title: "Xamarin Component just released"
date: 2013-08-22 5:18
author:
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---


We are very excited to announce the release of the [Auth0 Component](http://components.xamarin.com/view/Auth0Client/) for Xamarin. As with the other SDKs we released (and [available on Github](http://github.com/auth0)), its goal is to streamline authentication with any of our [supported identity providers](http://docs.auth0.com/identityproviders). Consumer or Enterprise.

![](http://components.xamarin.com/resources/icons/component-283/Auth0-Xamarin-iOS-602-400-slideshow-resize.png)

<!-- more -->

The API is straight forward and very easy to use. It works with iOS and Android:

<code>
    var auth0 = new Auth0Client(
        "{subDomain}",
        "{clientID}",
        "{clientSecret}");

     auth0.LoginAsync (this)
           .ContinueWith(t => {
              var facebook_token = t.Result.Profile["identities"][0]["access_token"];
              var email = t.Result.Profile["email"].ToString();
 	          });
</code>

The code above will display the [Auth0 login widget](https://docs.auth0.com/login-widget) as seen in the picture above.

It is delivered as a [component](http://components.xamarin.com/), so you can get it straight into Xamarin Studio.

What you get back after login is the [normalized user profile](https://docs.auth0.com/user-profile) and [Json Web Token](http://docs.auth0.com/jwt) you can use to authenticate calls with your API.

Here's a quick end to end demo (use full screen):

<iframe width="700" height="315" src="//www.youtube.com/embed/7enbd_BQRdE?rel=0&vq=hd1080" frameborder="0" allowfullscreen></iframe>

Last but not least, if you have **Windows Azure Mobile Services** enabled in Auth0, then you can use the token to call WAMS endpoints with no changes or additional code. Auth0 will generate [the right JWT](https://docs.auth0.com/jwt#5) for you.

We want to thank the folks at Xamarin for their support and great experience!

The sample image was generated with the awesome [placeit](http://placeit.breezi.com/).

[Try Auth0 yourself!](http://www.auth0.com)