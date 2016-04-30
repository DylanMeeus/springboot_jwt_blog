---
layout: post
title: "Everything You Wanted to Know About OAuth 2 (But Were too Afraid to Ask)"
description: This is the recording and transcription of a webinar we ran about OAuth 2 recently.
date: 2016-04-20 10:00
author: 
  name: Kassandra Perch
  url: http://twitter.com/nodebotanist
  mail: kassandra.perch@auth0.com
  avatar: https://s.gravatar.com/avatar/bc94ff6211e645a2bdb4fdc60e23ad85.jpg?s=200
design: 
  bg_color: "#333333"
  image: "https://cdn.auth0.com/styleguide/1.0.0/img/badge.png"
  image_size: "50%"
tags: 
- OAuth
- Webinar
- OAuth 2
- Video
related:
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
- 2015-09-04-an-introduction-to-microservices-part-1
- 2016-02-02-switching-from-social-logins-to-saml-in-minutes-with-auth0
---

<div class="wistia_responsive_padding" style="padding:42.29% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/1vo7e1x18t?seo=false&videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Transcript:

So like I said, the title of this webinar is "Everything You Wanted to Know about OAuth 2 But Were Too Afraid to Ask." I'm Cassandra Perch. I am a developer evangelist for Auth 0. We are an authentication-as-a-service company, but we're actually not gonna talk about the product today. We're just gonna scope our conversation to OAuth.

So what is OAuth? OAuth is a specification that allows users to delegate access to their data without sharing their username and password with that service. That's cool. But why do you care, as a developer? There's a lot of information and a lot of uses that OAuth provides, that you wouldn't normally get without it, which include things like social graphs of your users, sharing information via your users, things like tweeting and posting to Facebook. You can aggregate user data in order to find interests, et cetera, about your users. 

One of the bonuses is if you use OAuth as your authentication system, you don't have to manage your own authentication system. You can rely on OAuth to authenticate your users. So you don't have to worry about that. 

But it's just about social logins and data. Right? If I'm not interested in social data or Twitter or anything, then it's not . . . OAuth's not for me. Right? Well, that's far from the truth. Actually, there's a lot of applications for OAuth that are beyond just social logins, things like IOT devices, micro services, and data storage. All of these use OAuth in one form or another. Something real quick. Okay. I am still broadcasting. Awesome.

So how did OAuth and, essentially, OAuth 2 come about? A little bit of history really helps you understand how OAuth works and why OAuth works. Before OAuth, applications just had users share the usernames and passwords directly with third-party services. There were varying protocols for different platforms, but the core was the same. If a web app wanted data from another service, it asked for the user's credentials to that service. So for instance, if you wanted to provide your data from Twitter to a service, you would provide your Twitter username and password to the service.

There were many, many drawbacks to this approach. One of these was that you had users trusting their service credentials with unknown applications. If you were trying to run a secure application, and you unknowingly had users sharing their credentials with an insecure third-party site, that could be a huge problem. Phishing attacks were super simple back before OAuth because all you had to do was pose as a cool new application that merely needed new data from your third-party service, and then you would have their username and password.

From the implementation side, if the user changed their service credentials, every single one of the connected applications then broke because they could no longer log in. A final problem is the all-or-nothing of permissions. You either had complete access to a user's account and could perform all of the actions that that user could, or none because they didn't give you their credentials. The only question so far is: when do you think we'll start? So I think we've answered that one. 

So like everything else on the web, everyone made their own way to redirect the user and return access to the data. Microsoft had their own protocol. Yahoo had their own protocol. Just like everything else on the web, every company had their own way of doing things, and it became an absolute nightmare to implement third-party-delegated access because you had to learn the specific way that that platform does it.

So finally, the OAuth 1 standard was created. This added very strong benefits for the developer community. One of these was a smaller learning curve. As more and more companies adopted the OAuth standard, you only had to learn OAuth once in order to be able to log in and delegate access to several services. It's more secure because, as a standard, it's community-vetted. The best part is everyone started doing things the same way. We could write libraries, and we could write tools that abstracted away the nitty-gritty details of OAuth and allow everyone to use it.

So how is OAuth 2 different from OAuth 1? There are two major differences. There's a lot of little differences, but we're gonna stick with the major ones here. One is that OAuth 1 was designed with just traditional server-client web applications in mind. This is becoming a smaller and smaller portion of real-world web applications between single-page applications, IOT devices. There are just way too many different scenarios for OAuth 1 to be flexible enough to deal with. We'll talk about how OAuth 2 is a little more flexible in a little bit. We talk about client profiles.

Another big switch was that OAuth 1 required signed tokens and signatures in order for OAuth to complete. In OAuth 2, you do not need signed tokens. You can just have barrier tokens. We'll talk about the difference of these things and why that's important in a little bit as well. Before I move forward, I'll check for more questions. Nope. All right.

So how does OAuth, in general, work? We're gonna start with some terminology. For the purposes of the slides, I have bolded, to the best of my ability, every use of these vocabulary words, so that it's a little easier to follow along. We're gonna start with some nouns. 

So a resource server. This is the server hosting user-owned resources that are protected by OAuth. This is the Twitter API. This is the GitHub API. This is the Facebook API. This is the server that holds the data that you are trying to get delegated access to. A resource owner is the person with the ability to grant access to that data. Typically this is the user of the application, your Facebook user, Twitter, GitHub users, et cetera. 

A client is the application making requests on behalf of the resource owner, to the resource server. So the client is essentially your application, because you are asking the resource owner, "Hey. Will you give me access to your data on this resource server?" Finally, the authorization server. This gets consent from the resource owner, for a client, to access the resource server. Consider it a gateway of sorts. We send the user to the authorization server. They authorize our client, and then the authorization server returns a way for us to access the resource server.

That was a lot of text, and that could be a little hard to understand. So I'm going to go over it with a graphic. So what we've got here is a typical OAuth flow. This is our resource owner or our user, and the first step is the user tries to log into the client, which is your application. The user is redirected to the authorization server, where they log in and give the client permission to access their data. The authorization server then returns permission to access user data. Your client then requests user data from the resource server, and, provided everything went well, the step five is that it sends back the user data. This is a typical flow between the nouns that we just talked about.

Now that we've spoken about nouns, I'm gonna check for questions. Nope. No more questions. Then we are going to talk about some verbs that we deal with commonly in OAuth. Check one more thing. Okay. Good. That's still running. So some verbs.

Authentication is the action of verifying a user's identity. For instance, when I go to the airport, I pass my passport to the TSA agent. The agent is authenticating that my identity matches my passport. Federated authentication is using a third-party system to authenticate users. If you use OAuth to authenticate for your application, you are performing federated authentication. A good real-world example of this is sometimes when I go into customs, instead of handing my passport to an agent, I put my passport in a scanner, which then uses a third-party service to determine whether my passport is valid. That also constitutes federated authentication.

Authorization is the action of verifying a user has permission to do something. For instance, if I've already authenticated myself with Facebook, but I try to post something to the wall of someone who is not a friend, and they have not authorized that action, then I will get an error. I do not have permission to do that. So you authorize yourself to perform actions. You authenticate. Then you authorize, because you need to tell the server that you are who you are and prove that before you start asking if you can do things. Makes sense.

Delegated authorization is the core of OAuth, and that is granting someone or some application permission to act on your behalf. Again, that's a lot of words, and I want to put it into a graphic to cater to the visual learners in the audience.

So this is very similar to the last diagram. However, I've added the verbs that we just went over to this diagram. We still start with the resource owner in the upper-left corner. The user tries to log into the client and is redirected to the authorization server. The user authenticates themselves with the service and then delegates authorization of certain tasks to your client. The authorization server then returns authorization to access the resource server. Your client uses the delegated authorization to access the resource server, and the resource server sends back user data. Check for questions, and then we will continue on. Okay. We'll continue on.

So the general statement of OAuth. Using OAuth, you are redirecting the resource owner to the resource authorization server, where they authenticate themselves and delegate permissions to your client. Then your client is given some form of access token that it can use to authenticate and authorize itself with the resource server.

So now that we have the general idea, we're going to go a little deeper into the OAuth 2 specification by talking about client profiles, access tokens, and authorization flows. I've mentioned checking for questions, but I haven't mentioned this. Feel free to ask a question on the questions panel at any time. I check them at regular intervals. The questions panel kind of looks like this. I will check it between each section really, to see if there are more questions to be answered. The way you ask a question is on the side panel of your GoToWebinar. Okay.

So client profiles. These are classifications of the client that the specification talks about. Three of these . . . There are quite a few, but we're gonna go over the three that are the most common. . . . are the server-side web application, which is what you think about when you think about a traditional web application. You have client-side code running in a browser, server-side code running in a server, and they exchange between the two. Another type of client is the client-side application running in a browser. This is new to OAuth 2. Another one new to OAuth 2 is  native applications. This is your iOS and Android applications that may be making HTTP requests but are not, in themselves, a web application.

So we were talking about types of access tokens, and I just mentioned the access token. So a refresh token. These tokens can be used to reauthorize a client without asking the resource owner to re-authenticate. What this means for our system is you can basically . . . Access tokens have a time to live. So you can . . . When an access token has run out of time, if you have a refresh token, you can submit that refresh token with, probably, possibly, other credentials to the authorization server for the resource and say, "I would like a new access token." If everything goes well, you will get a new access token. You will not need the resource owner to re-authenticate. This can be good, from a user-interface perspective. This could be bad from a security perspective. You have to take very . . . Take that into account before thinking about using refresh tokens. Check that the audio is not . . . Okay. Cool. So far, no more audio issues. All right.

So an authorization code. These are codes meant to be sent back to your app server and traded for an access token and/or a refresh token. So this is typically used in a server-based web application. You make the request from the browser to the authorization server, and the authorization server returns an authorization code. Your browser-side code then sends this back to your server, and your server negotiates with the authorization server, using that code, to receive an access token. This keeps access tokens out of the browser and, therefore, a little more secure, because it's very easy to get access tokens when they're available in the browser.

So that's a good question. What is the point of using a refresh token when a user can request for another  token? So it's mostly a UI perspective. If you . . . For instance, let's say Tweet Deck or a Twitter client, and you want to continuously be logged into this Twitter client, and you don't want to have to re-log-in to Twitter every time that access token runs out. That is a good application for a refresh token because the app can then use that refresh token to obtain another access token without having to ask the user to log back into Twitter. I hope that answered your question. Perfect. Perfect. All right. I'll continue then.

How can I send access tokens? There are three ways. However, one is preferred over the other two. The preferred method is to use the HTTP authorization header with the format "Bearer," with a capital B, as in "boy," space, and then your access token. The reason this is the preferred method is because HTTP headers are cached on a very limited basis, especially the authorization header. So you're much less likely to accidentally give away your access token.

You can use it as a query parameter. In fact, for single-page applications, this is the easiest way to do it, and it is very useful for legacy systems or systems in which headers can be hard to manipulate. Finally, you can use a form-and-coded body parameter. This is still used by some older versions of OAuth APIs, but has mostly been deprecated.

So I mentioned tokens don't have to be signed. That's true. One of the biggest and most controversial changes of OAuth 2 is the removal of the requirement for tokens to be signed. This means services do not need to verify the request came from an authorized source. Pardon me. Do not need to verify that request. So this can be especially dangerous in situations where you have your access token in the browser, for instance. It's very easy to get a hold of that token. Once you've gotten a hold of that token, if you're not requiring a signature, you can take that token and, until it is expired or revoked, use it to make authorized requests to a resource server.

So that sounds really insecure. At first glance, that's very true. That's why many services still use signed tokens and/or require other credentials to be sent with requests, such as client IDs and client secrets. For instance, the Twitter API requires that a client seeker be sent with your request in order to prevent an unauthorized request if someone does get a hold of your access token. 

Now a common question at this point is, "How can I easily use signed tokens with OAuth 2?" JWTs, also known as JSON web tokens, are a very easy way to use signed access tokens in your OAuth 2 implementation. You can learn more about these at JWT.io. For instance, Auth 0, when we make OAuth requests, we do use signed JWTs. So we do verify that the request is coming from a confirmed party, because JWTs are signed with either a symmetrical or asymmetrical secret. Like I said, you can learn even  more at JWT.io. 

Okay. So we're gonna talk about authorization flows. What these mean . . . These are different ways . . . I put Auth 0 instead of OAuth. My apologies. These are different ways OAuth can be implemented to account for different client pro . . . So most APIs require you to register as a developer and register your application before authenticating with OAuth. This is so you can use extra credentials to either assign access tokens or authenticate that requests are coming from your application. This is true for all of the authorization flows that we are about to discuss.

For instance, when you want to make an application that works with GitHub, you have to log in with your GitHub ID, which authenticates you as a developer, and then you have to register your application, which gives you a client ID and a client secret. That allows you to authenticate any request you send to the GitHub API, to prove that your application is making those requests. So if your access token is compromised, you can still prevent unauthorized access to your delegated authorization, which sounds like a mouthful. Okay.  Yeah. Yeah, I will continue to keep checking the questions. Definitely. That's pretty much every slide now. I'm gonna do that. Okay.

So for the server-side web application flow, we will return an authorization code to our browser instead of an access token. Our browser will then talk to our server and request an access token and possibly a refresh token, using that data. This is more secure because the browser does not receive an access token. It allows for the use of refresh tokens. Check for audio issues. Nope. Cool. So I'll go onto the graphic.

So from the . . . This is our application here on the left, and this is the resource servers that we are trying to authenticate with on the right. Step one is your web application will redirect the resource owner to the resource authorization server. A real-life example of this is whenever you click the "Log in with Twitter" button, and the Twitter login page shows up with Twitter styling and Twitter's URL. That's this step one.

Step two is the user authenticates the resource owner, authenticates and delegates authorization to your client. If that goes correctly, step three will be that the resource authorization server returns an authorization code to your client web application, your browser. Now these are usually very short-lived codes because you are meant to exchange them for access tokens really quickly. So you'll want to move on to step four, which is sending the authorization code to your web server. Step five is that your web server will send the authorization code and a secret or other credentials to the resource authorization server to request a full access token and/or a refresh token.

Step six is if everything is correct, the resource authorization server will return an access token to your server. Your server can then use this access token to request resources from the server, and step eight is, hopefully, those resources will get back. Finally, your web application server does anything it needs to do to the data and sends the resources back to the browser. Okay. Still no mic-misbehavings. Good.

So this is the flow for refreshing a token. So your browser-side application requests user resources from server. The resource app . . . Your server says, "Uh-oh. My access token is expired. The time to life is gone, but I do have a refresh token." So it makes a request with the refresh token, and then secret or other credentials to request a new access token. The resource authorization server then, hopefully, returns a new access token. Then the rest of the flow sounds very familiar. Your server uses that access token and other credentials to request resources, which will be returned to your server. You can do whatever you want with them and send them back to the browser. Okay.

So that was the traditional flow, basically, if you have a client and a server for your web application. Now we're gonna talk a little bit about single-page applications and what is called the implicit grant flow. The reason this is done is because single-page applications are becoming more and more popular. The access token in this flow is passed directly to the browser. These tokens are usually very short-lived and do not allow many permissions. They also typically are not signed because there's no point in keeping a secret in the browser, because it's going to be accessible by the user. 

This flow does not allow for refresh tokens because then, if someone got a hold of that refresh token from your browser, they could very easily continue to make requests on behalf of your user, even though they aren't you. Tokens are not easily sign-able because, like I said, a secret is very hard to keep in a browser, and authentication is a little harder because you have to do it more often, and you have to ask your users to re-implement, re-authorize, re-authenticate more often. Okay. Still looking good on the mic. I think we found a winner.

So this is what that looks like, graphically. Here on the left, we have our client web application. Note, we do not have a server this time. We redirect the user, just like we do with every other flow, and the user authenticates and delegates permission  back to the client. Remember, this time, it returns a full access token, which you can then use to authenticate yourself with the resource server and get resources back. While there are fewer steps to this flow, and it does seem easier to implement on face-value, there are drawbacks. Like I said, the access tokens are very short-lived.

This is generally used in situations where it's a one-off. You're gonna log into Twitter once, ask for some of their profile data, and show them something cool. A real-world example I can think of was, in February, they did "Who is your Twitter valentine?" You clicked the button, and it logged you into Twitter, and it took your tweets, and it looked at them, and it said, "This is your Twitter valentine." This would be an excellent application of this OAuth flow because you don't need that access token to live very long. You won't be asking users to log in over and over again, because they're really only gonna need it once. So that's a very good use of this authorization flow. Okay. Cool. Mic's still running.

There are other flows. We're just gonna kind of talk about these in passing because they're not used very commonly, but they're still good to know about. One is the password-based grant flow. This is very similar to the days before OAuth because the user does give their user name and client or password to your client, and your client exchanges these for an access token. This is really only used in situation where passing these credentials back to your client server is okay. 

One of the major common uses is first-party services OAuth-ing against each other. For instance, if you have a web application server and a web API server under your domain, especially if you're using micro services, this could be a reasonable OAuth flow for you because you trust all of your services. They all belong under your security umbrella. So passing credentials between these services is considered okay. 

Another flow is the client credentials flow. In this flow, the client server has pre-stored credentials and exchanges them for access and refresh tokens. This is used when the resource owner is acting on behalf of themselves, rather than delegating authorization to someone else. One of the most common examples I've seen of this is a server connecting to Amazon S3, using OAuth. You pass . . . You log your application with Amazon S3. It gives you a token to send, and you send that token to Amazon S3 in order . . . when your web app starts, in order to use Amazon S3. So this is . . . The spec calls these "pre-arranged credential conditions." 

Which flow would I recommend for hybrid apps with a client server? I would definitely recommend the traditional flow any time you have access to a client server. This will keep your access token out of the browser, and it will keep your access token away from possible misuse. So that is definitely what I recommend for hybrid apps and native apps, anything that has access to a server. 

The last flow we're going to talk about is the device profile flow. The resource owner is typically given a URL, and when they go to that URL, are given a code. They go to that URL, either enter a code or receive a code, and enter the code in the device. So there's two ways you can go about doing that. This authenticates and delegates authorization to the client. This is used when devices do not have their own browsers or limited input. This is where I mentioned IOT having a big part to play in OAuth. This is where that part would play.

A good real-world example of this is if you have a Playstation 4, and you go to log into a TV service, like Hulu. Instead of having to enter your username and password on a game pad, which can be painful, it says, "Go to this URL," and it's on the Hulu domain. You go to it or whatever service, and you log in. Then it has a code on the TV screen, and you enter that code into the page that it sends you to, and then it authenticates that gaming device with that service. So this definitely works well for IOT situations. 

Okay. That's all well and good. We've gone over the ins and outs, to a very strong degree, of the OAuth specification, but now we're going to implement it. What I'm going to do is live code a node JS express app, to allow me to log in and authenticate with GitHub. So let me get my live coding set up. Let me check for any more questions. I don't see any. 

Oh, here we are. Where does Othos [SP] password authentication fall among these? That definitely falls among . . . It's outside OAuth. So we perform OAuth first, and then the password list authentication is an added step after we perform OAuth, because we have already received . . . Oh, no. Sorry. It's not after. It's in the middle. The authentication flow . . . Let  me pull up one of the graphics so I can show you what I mean.

Here we are. So the resource authorization server, once . . . That's the refresh flow. Here we go. Once the user authenticates and delegates authorization, this is where the password list step would go into play. The resource authorization server would then make an external request to our SMS provider, which would then send a text message to the user, which the user would then enter into a page that the resource authorization server shows. Then, if all of that went well, that's when step three would happen, and you would get your authorization code.

Ah. So how can redirect URLs be used in single-page applications? Typically, the way this is done is via a link. So when you redirect the user in this case . . . In fact, a lot of the OAuth APIs will provide you with a button that has a URL. Basically, you copy-paste the HTML, or it just gives you a URL to put into a link. So typically, for single-page applications, you still have to redirect. You still have to leave your single-page application. 

But yes, you will . . . You also can, when you are doing a client-side application, use a pop-up instead of leaving your application. Some OAuth providers support this. Auth 0 supports this, but it doesn't recommend it because mobile browsers have a really hard time with pop-ups, especially from an OAuth perspective. So from a client side, from an SPA, single-page application, you can either redirect the user with a link and then come back to your application and handle that new state, or you can use a pop-up, and then the pop-up will return the access token as a piece of a URL. Hope that answers your question. Cool. All right.

Okay. So let me set up my live coding setup, and we'll get started with that. Let me move the questions off here. I'm gonna go to here. So this is my terminal. Hopefully the text is big enough. I can see the questions panel no matter what I'm doing now. So if you need text enlarged or need me to slow down at any point, please let me know. That way, I can get this to work properly. Not what I meant to do. Here we are. One moment while I get something set up. Sorry about that. There we are. Okay. Just pulling up my notes so I don't mess anything up here. As you may know, live coding can be difficult.

So I've got my terminal here. I've got a project folder set up already. I have an index.js, a node modules folder, a package.JSON, and some views. In the views folder, I have hello.jade and user.jade. I'm gonna be using Express, the latest version, and Jade Templates. So let's look at the code that already exists.

What I've got here is my index.js. I'm pulling in Express and creating an Express application. Then I'm requiring a Cookie Parser and Body Parser. These are very typical bootstraps for express. I'm setting the view engine to Jade, and I have one route, that when you get the root route, we're going to render Hello, just the text. Then we're going to listen on port 1337. Now I'm going to pull up a new incognito window, so we can see that in action.

Also, I'm going to do this. Nodemon index.js. So if you've never used Nodemon before, for you node users, Nodemon is a really handy tool. It watches your files. Any time you save a file in your project, it will reload the node code itself. So when I make changes in my text editor, I'll be able to see them in the browser immediately. So my browser . . . I'm going to go to my local host, port 13. I'm going to actually click that text field and then go to local host, port 1337. 

Neat. Oh, it would help if I spelled "local host" correctly. Wouldn't it? Like I said, live coding is hard. There we are. You can see the "Hello" once the tabs disappear. So we do have a working Express application. What we want to build is an application where it will say, "Hello. Log in with GitHub." We'll click the link, and then it'll take us to the GitHub login page, and then it will take us back to the application once we've authenticated and say, "Hello, display name, comma, AKA username," with a logout button, which we can then use to log out.

We're going to do this by using Passport. So first, we're going to install some node modules. I'm going to close out Nodemon real quick, and I'm going to install MPM Install and save these. I'm going to install Passport and Passport GitHub. Passport is a module that . . . If you've ever had to implement OAuth in any way, shape, or form before, will  save your life in node because it handles all of the little details of doing that. So Passport, itself, handles mostly just OAuth or handles strategies. Passport.GitHub is a Passport strategy that works with the GitHub servers. This way, I don't even need to remember the URLs for our authorization server. I just need to tell Passport what my credentials are and that I wish to log in.

I'm also going to install .env. What this does is . . . I can create a .env file with, for instance, secret credentials that maybe I don't want viewers of a webinar to see and load them into my node application without having to expose them. As you can see in my folder, I do have a .env file that does contain my credentials from registering with GitHub. Like I said, step zero of any flow is to register your application and obtain your app credentials with the OAuth server that you are trying to access. So I have .env. I have these. All right. 

I will install one more thing in a little bit. But for now, we'll leave that out. Also, I will post a link to the questions, to the . . . Actually, I'll just do that right now, before I forget. I'm going to make this public. Make it public. All right. This is public. So in the questions panel here, I am placing . . . Come on. Oh, I apparently can't ask questions. So how am I gonna communicate . . . Oh, I know how I can do this. I will . . . It'll be in the followup email, the link to the gist that contain all of the code that we're going to do today. Sorry about that, that little distraction there. Okay.

So let's set up Passport. So I'm going to run my Nodemon script again, just so I know if there's any errors. I can scroll back here to check for errors every time I save something. So under my express require, I'm going to include Passport. Under that, I'm going to include my Passport strategy. Now I'm just going to call this "Strategy" with a capital S. That is a very Passport convention. Basically it'll look nicer in the long run, and you can come to the top and see which strategy I mean through Passport.GitHub. Then I'm going to say, "Let .env equal require.env." Then I'm going to say, ".config." What this does is it loads my .env file and allows me access to everything in that file.

So we have our Express application, and we have our middle-ware declared here. We're going to want to put Passport in as middle-ware. But before we do that, we need to set up Passport in general. So we're going to say, "It's Passport.u's new strategy." So Passport strategies are objects  that you can run with the new operator. Now we're going to pass a few things into this. We're going to pass a client ID, which is the client ID that I got from registering with GitHub, because I used .env instead of exposing my client ID to everyone watching this video. I will pull it out of my .env file. My client secret will also be passed, and that also is in my .env setup.

So these two pieces, as I mentioned earlier, what they do is they tell GitHub whenever I make a request. I am who I say I am. I have this secret key that tells you it's me. Please let me in. Here's the secret password. Finally, we are going to pass a call-back URL. Most . . . So I mentioned in all of the flows and diagrams that you are redirected back to your application. Most, if not all, OAuth providers require you to designate authorized call-back URLs in your configuration when you register your application. This is so your access token cannot be hijacked. This is so your authorization codes cannot be hijacked. 

The OAuth provider will check, when you redirect back from the authorization server, that it matches one of these registered call-back URLs. If it doesn't, it will error and not give an access token. Again, that is to prevent anybody who may get any of your credentials. As long as they don't get into your dashboard and add a new URL, they will not be capable of logging in as you or performing requests as you. So I'm gonna set my call-back URL to HTTP//localhostport1337/callback. I have already registered this URL on the GitHub developer dashboard.

The thing we're going to pass after the object . . . Let me indent this a little bit to make it a little more clean. Strategy. We're gonna pass a function. This function is a call-back. What it is is . . . When we have our access token and our refresh token, and we'll get our profile back, and CB is a call-back that we will pass in to say, "When I'm done authenticating, this is what I'd like to do." We can now do things like serialize the user. We can just call the call-back with a profile.

Like many node applications, this call-back system  does rely on an error-first situation. So we're just going to call the call-back we pass in with null, because we have no error, and the profile. In the real world, you'll want to check for errors before calling your call-back with null set to the error. So that is that. I'm gonna save, and I'm gonna check for errors in my terminal. I do not have any errors. Then I'm going to go to my application, to make sure that it still runs, and it does still run. Okay. We're in good shape. Okay. 

To answer the question, we are recording this, and you will get the followup email, and the recording will be made available. So if you need . . . If any of you need to leave early, the recording will be made available to everyone who signed up. Yeah, sorry about all the delays with the audio issues. Anyway, let's continue on with this live coding.

So we have set up Passport to use the GitHub strategy. Next, we're going to tell Passport how we want to serialize the user, once we get the user back. For us, this is going to be a very simple function, but in the real world, you'll want to modify a lot of data in your application to use that data. You might want to make extra, for instance, database calls, but we're just going to call call-back with null and the user.

The same thing is for the serialized user. So I'm going to copy this and paste it to save a little time, and I'm gonna say, "De-serialize user." Instead of passing a user, it passes an object. So we're going to change that, and we're going to change that. Gonna save and check that I have errors. I do not. Okay.

We've set up Passport. Now we want to tell our Express app to use Passport as middle-ware. We're going to do this by adding the Express session, so that we will have session use of our . . . Pardon me. . . . session use of our user. So I'm going to do Express.session. I'm going to call that Express session call with an object. Secret is keyword K. This is a secret that your server will use to encrypt your session. Re-save. It's set to true. Let me . . . Actually, let me do this. Let me put this on another line. So I can make sure you all see what's going on here. Okay.

So re-save is true. Save and initialize. It's true. Okay. So I have all that going for me. Gonna make sure I don't have any errors or missing perens [SP]. I do. Unexpected token. App require. Okay. Oh, I forgot dot-use. My apologies. Dot-use. Save. Check again. All right. There we go. 

Now that we have our session, we're gonna set up our password. I'm gonna scroll up a little bit. So now, we're going to say App.use, Passport.initialize, and this runs every request to make sure Passport is ready to go, in case it needs to authenticate, and then app.usepassport.session. This works with express.session in order to store our user in the session. Okay. We have now set it up so that we can use Passport to log in with GitHub. We have no errors. I'm gonna check one more time in my application here. Yep. We're still good. We're still running. All right. Let's get to the fun stuff.

We're going to create our login page and login route. So I have a file in here called "Hello.jade." Right now, it says, "H1 hello," but we want to create a link in there that will allow us to log in. So we're gonna say, "A h-ref [SP] equals forward-slash login," and it will say, "Log in with GitHub." Save that. Then I'm gonna go back to my index.js, and I'm going to create . . . I'm going to . . . Res.render [SP] is set to "hello." So save. We'll go back to the browser, and we'll check to see if our link shows up. As you can see, we now have that link. If we click it, we get a 404 because we haven't written that route. Let's do that now.

So we're going to . . . Let me scroll this up. Write, "App.get." Make sure there's no more questions. There are. Okay. App.get/login and a function. It takes a rec and a res. What I want to do is . . . I don't even need this function call. What I'm going to do is just call Passport.authenticate. I'm going to pass this string GitHub so it knows to use the GitHub strategy. This is for situations in which you could have multiple strategies, like if you want GitHub and Twitter and Facebook. This Passport.authenticate takes that name. So it will go to the GitHub strategy. 

So I've saved this. I'm gonna check for any errors. I don't have any errors. I'm gonna check again. I'm gonna log in. As you can see, it now takes me to the sign-in with GitHub. Now before I actually sign in with GitHub, I'm gonna make sure my call-back is ready for when I'm done. Now you'll note, when we set it up, we said that our call-back will be at slash-call-back. So let's write that call-back. App.get/callback. Would help if I could remember how to type today.

So we're going to pass multiple functions to this. The first one is Passport.authenticate GitHub, and we're going to pass an object that says, "Failure redirect is slash-login." They are the same function name. That is true, but what happens here is Passport now knows when you call authenticate GitHub, that this is the call-back. So basically, it checks to make sure that there are no errors from the GitHub login, and that's where the failure redirect comes in. It will send us back to the login page if there is an error from GitHub's side or from invalid username/password, or the user just refused to grant us delegation.

The second function I'm going to pass is our . . . This is our success. We've . . . Inside this function, we can assume . . . Yay. We've logged into GitHub. So I'm gonna push this code up a little bit. There we go. So we've logged into GitHub in this request. So what we're gonna want to do is redirect the user to their dashboard, for instance, or in our case, we're going to redirect them, res.redirect, to forward-slash profile. This will be a page that we will set up that will show the user their profile. Now let me make sure I've got all my parentheses in a row. I do not. Okay. Here we are. I see. That closing parenthesis. There we are.

Let's save. Let's check for errors. Okay. Now let's check here. I'm gonna log in with GitHub. Oh, that's correct. I have to check my phone real quick. I have to factor authentication on my GitHub because security. So now we cannot get profile, which is fine because we haven't written that route. So let's write the profile route so we can log in. Okay. So app.get/profile. We're gonna pass a function. We are going to, when the profile is accessed, ensure that the user is logged in. To do this, we are going to install another MPM module. I'm gonna close out Nodemon for a moment. I'm going to MPM install connect ensure login. Save it.

So what this does is it works with Passport, and it's a piece of middle-ware that says, "If the user is logged in, let them in." All right. So now I'm gonna go back. I'm actually going to re-run Nodemon. Oh, unexpected . . . Oh, that's right. I did that in the middle of that. So the first piece of middle-ware, when we call profile, is going to be our require, connect, ensure, login.ensure, logged in. So this, again, makes sure that the user is logged in before they are allowed to access their profile. Then we pass our function that takes a rec and a res. I'm also gonna make sure to put that parenthesis back.

We are going to res.render the user view with the user set to rec.user. This is where Passport stores our user for us, is in rec.user. We do not have to store it ourselves. Okay. All right. So now let's check the User.jade to see what we've got going there. Actually let's save this file so it doesn't . . . It does not error. Good. User.jade. Okay. We don't have anything in User.jade. So let's get on that. Let's give our users something to look at when they log in.

So I'm going to create a pair in H1 of Hello. Then I'm going to add the user's username. So user was what we passed in, and username is what GitHub uses to store the username. I'm going to create an H2 with AKA space, that should be there, and then the variable user.displayname, which is what GitHub uses for your full name. 

Finally, I'm going to create a link with the H-ref of forward-slash logout. That will allow us to log out of GitHub. Well, actually, it's not logging out of GitHub. It's just logging out of our app. So we're just going to leave it at logout. So we save that. Now I'm going to go back to my browser and log back in. Let me check for errors. No errors. I'm gonna try this again. I'm gonna log in with GitHub. Because I've already logged in, it did not re-ask me for my credentials. It just took me straight to the user page. Now, as you can see, you can see, "Hello, comma, node botanist." Node botanist is my GitHub username, AKA Cassandra Perch, which is my display name, and a logout button. If I click the logout button, we don't have a logout.

So what I'm going to do is create the logout. So we're gonna go back to index JS and app.get/logout. We're gonna pass it a function, rec and res, and we are going to say rec.logout. So Passport has attached a logout function to the request that will allow us to logout. Then we will tell our user, send them back to the homepage. So let's try logging out again. Let's make sure there's no errors. There are no errors. Let's try logging out.

Okay. Hello. Log in with GitHub. Logging in. I can log out. Now, if I go to profile, when I'm not logged in, that shouldn't be happening. That should have logged me out. All right. I'm gonna have to take a look at why that did not destroy the session. Okay. Sorry about that. One of those "it worked last night" sort of problems. 

Okay. So that is how you implement OAuth in a node application. I mentioned that we were only going to touch on what Auth 0 does. This is an easy way to implement OAuth in your node applications. However, when you have more than one strategy, it can get very complicated, very quickly. Auth 0 has flipping switches for new profiles. You complete step zero of the OAuth flow. Get your client credential and client secret. You go to your OAuth dashboard or your Auth 0 dashboard. You can tell how I get those two mixed up all the time. You flip a switch, add your credentials, and you'll be able to allow your users to log in with multiple strategies, instead of having to implement each one with Passport or whatever language library  you use.

If there are any more questions, go ahead and ask them now. I will answer them. I'll wait for another minute or so, and then I will end the session. Please note, this has been recorded. We will probably edit the recording to kind of take out the audio issues. I am going to absolutely figure out what happened and fix that for our next webinar. Keep an eye out on the Auth 0 Twitter account for our next webinar, which should be in the next couple weeks. I hope you enjoyed your experience. Yeah, I'll wait for questions for a little bit, and then I'll end the webinar. 

## Source Code:

```javascript
'use strict'

let express = require('express')
let passport = require('passport')
let Strategy = require('passport-github').Strategy
let dotenv = require('dotenv').config()

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:1337/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  }))

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

let app = express()

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'jade')

app.get('/',
  function(req, res){
    res.render('hello')
  })

app.get('/login',
  passport.authenticate('github'))

app.get('/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile')
  })

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log(req.user)
    res.render('user', { user: req.user })
  })

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.listen(1337)
```
