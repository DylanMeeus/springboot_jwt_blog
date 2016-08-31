---
layout: post
title: "Stateless Sessions for Stateful Minds: JWTs Explained and How You Can Do The Switch"
description: "If you are interested in migrating to a stateless sessions approach, here's your guide!"
date: 2016-08-31 13:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- stateless
- session
- stateless session
- stateless authentication
- stateless auth
- jwt
- jwts
related:
- 2015-12-17-json-web-token-signing-algorithms-overview
- 2016-06-20-jwt-101-webinar-video-learn-more-about-json-web-tokens
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
---

In this article we introduce the concept of stateless sessions for developers used to statefull sessions. We point the benefits, and how a team could go about switching from one to the other. We will also show a sample setup using JWTs obtained through Auth0.

{% include tweet_quote.html quote_text="If you want to migrate to stateless sessions, this is your guide!" %}

-----

## The Benefits of Going Stateless
Authentication has been for a long time a stateful affair. Let the user input his or her credentials, generate a unique session id, store it server-side and hand it back to the user. All user details are to be stored server-side. Every service that requires some sort of information about the user must consult the data store. In a sense, this is expected. If user data is centralized, there are no ways user data can be fudged. Furthermore, no out-of-date problems are possible. Everything is stored in a central place. For complex architectures this can be limiting: getting data from the central store for every other operation can be troublesome. If authentication and authorization were stateless each operation would carry all necessary data contained in them. So how could we go about doing this?

One of the cool things about session ids is that they are **opaque**. “Opaque” means no data can be extracted from it by third parties (other than the issuer). The association between session id and data is entirely done server-side. Are there any other ways of achieving something of the sort without relying on state? Enter cryptography.

One way of achieving such a feat is by encrypting data. Consider this: what if we created a special “session id” that was the result of encrypting data with a secret key (stored server-side). We could send that data to a client without worrying about him or her ever reading what was contained in it. In other words, we could keep the *opaque* feature of our session ids intact but at the same time embed arbitrary data in it. That means that getting to that data server-side needs no additional communication between a server and the datastore: the server only needs to decrypt the data contained in that special “session id”. Of course, calling that a “session id” is no longer accurate. From now on, we will know these elements as **tokens**.

So how is this useful? What type of data could we store in a **token** such that it proved beneficial in comparison to classic session ids? For starters: the actual server-side user id and name. Now, whenever a service needs to access additional data from a user, it doesn’t have to first map a session id to a user, it can take the user id directly from the token, after decrypting it. 

Let’s take this a step further. What if we included an additional field in the token, one that carried information about the types of operations available for the user? Say we call that field “scope” and we define two scopes: “user” and “admin”. Admin users have access to additional administrative operations. Now, whenever a user uses the token to perform an operation, say by making a call to an API endpoint, the service handling that endpoint can simply validate and decrypt the token, look for the right “scopes” in it and **authorize** (or deny) the user to perform that operation.

As you can see, having a token carry a certain payload reduces chattiness in the backend. Certain operations, and the roundtrips and transactions associated with them, can be completely eliminated. In other words, certain **state**, usually handled in the backend, can now be passed to the client in a safe way. That state is then carried by the client and updated accordingly each time the client performs an operation against the server. The client cannot manipulate that state. The integrity of that state is crucial to the security and integrity of the backend. This is why validation and encryption are requirements.

{% include tweet_quote.html quote_text="Having a token carry a certain payload reduces chattiness in the backend" %}

There are drawbacks, though. While session IDs are usually small, tokens carrying a payload can be expected to be bigger. As these tokens are part of every call, there exists a point at which the overhead of the additional data becomes problematic. We will explore this and other issues in later sections of this article.

We will now focus on an actual implementation for what we have described so far: [JSON Web Tokens](https://jwt.io). 

## The Technical Magic: JWTs, Digital Signatures and Encryption
Although it certainly is possible to encrypt any data, encode it in a text representation and then pass that to the client as a token on your own, there already exist convenient alternatives for doing just that. A popular one is the JSON Web Token (JWT) spec, along with the JSON Web Signature (JWS) and JSON Web Encryption (JWE) specs, which complement the actual data format with signatures and encryption.

Using a common data format allows for easy interoperability with established solutions. It is perfectly fine to develop your own token solution (as long as you [don’t roll your own crypto](http://security.stackexchange.com/questions/18197/why-shouldnt-we-roll-our-own)). However, JWTs are the established solution, and you can’t go wrong with them.

Here’s how a JWT typically looks after encoding and signing it:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSdzIHVzZXIgSUQiLCJuYW1lIjoiSm9obiBEb2UiLCJzY29wZSI6WyJhZG1pbiIsInVzZXIiXX0.uf_oBjC19qj28JR_3z-gu5Lb7Pbk3wWgnyiTZkJeoYc
```

Head over to [jwt.io](https://jwt.io), paste the JWT and have a look at its contents. The shared secret is “secret” (no quotes). You will notice a typical JWT is composed of three parts:

Header: a small JSON object describing the algorithm and the type of JWT in question.
Payload: the actual usable data, a JSON object of arbitrary content (although some fields are defined by the JWT spec).
Signature: what makes a JWT safe to use: both the header and the data can be validated against tampering using this.

Each part is separated by a dot (.). By making use of a convenient data representation such as JSON, JWTs have ensured ease of use in many different languages and frameworks. JSON is also lightweight when it comes to syntax, which helps in keeping the token as small as possible.

In our sample JWT, the payload is quite small:

```json
{
  "sub": "John Doe's user ID",
  "name": "John Doe",
  "scope": ["admin", "user"]
}
```

Note, however, crucial information is included in it. We have an actual user ID, which could be used to directly access relevant user information from our database. There is also the actual user name. No need to fetch it from a database if you just want to show it. And last, but not least, there are “scopes”, used in our example to authorize the user to perform certain operations. Again, there is no need to check this user’s authorization level by going to our user database, this data is available right in the JWT.

Of course, none of this could be trusted if the JWT weren’t signed. JWTs allow for [different signing and encryption algorithms](https://auth0.com/blog/2015/12/17/json-web-token-signing-algorithms-overview/). These are specified in the JWT header. In this case, our sample JWT uses the rather common HS256 algorithm (as defined by the JWS spec). HS256 is simply an [HMAC + SHA256 algorithm](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code) with Base64 encoding.

For the most part, JWTs are usually just signed. However, if your JWT contains data that must not be visible to third parties, then encrypting it using JWE is your only choice. A typical encryption scheme uses an already signed JWT as the payload for encryption. This is known as a nested JWT. It is acceptable to use the same key for encryption and validation.

A word of caution: although JWTs aim to reduce the complexities involved in developing your own solution, care is still needed. A rather common attack against signed JWTs involves stripping the signature and then changing the header to reflect a lack of signature. If you are not enforcing a check for the presence of a signature in your server, a forged JWT could pass as a valid one. Arguably, proper API design on the part of JWT library developers could help in this case.

### Going Stateless: Updating a Stateful Architecture for Stateless Operation
First things first: before going stateless, make sure this is appropriate for your architecture. Although we have talked about the benefits of keeping state client-side in the form of signed tokens, there are use cases where this is not the best option. Item 10 in [10 Things You Should Know About Tokens and Cookies](https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/) makes a good point: if you find yourself requiring ever bigger tokens to accomplish something, then the disadvantages probably outweigh the advantages.

A typical (simplified) stateful architecture will look like this:

![Simplified stateful architecture](https://cdn.auth0.com/blog/stateless/1.png)

Requests arrive at the public gateway. The [public gateway](https://auth0.com/blog/2015/09/13/an-introduction-to-microservices-part-2-API-gateway/) may handle, among other things, load balancing and authentication. Once the request is deemed valid, it usually is passed to internal services. The gateway may embed additional data in the request: the data associated to a session. If the gateway does not do this, each service may in turn query the relevant databases themselves. In essence, whatever data cannot be extracted from the session id must be retrieved from a datastore.

In contrast, a simplified stateless architecture may look a bit like this:

![Simplified stateless architecture](https://cdn.auth0.com/blog/stateless/2.png)

The obvious difference lies in the way the gateway authenticates the incoming request. By using a JWT, the gateway validates the token through its digital signature. Most token-based systems rely on a “revoked tokens” database. This is a security feature of certain systems: since tokens are validated cryptographically, if a token is leaked, it will still be valid. If there is any reason to believe a token was leaked, it should be blacklisted to prevent further access. The only way to do this is by checking each token against a revoked tokens database in the backend.

An alternative way of dealing with leaked tokens is by setting a short expiration date in them. Every time the token is used this date is validated. If the token has expired, the user must reauthenticate. If the date is valid at the time the token is used for a request, a new, different token, with a new expiration date may be issued. In this way, a single leaked token is only valid for a short window of time. In practice, timed-tokens and blacklists are used in combination. Blacklists are used for long-lived tokens.

As you can imagine, checking for blacklisted tokens negates some of the benefits of the token-based approach. However, tokens can have a greater impact: by keeping relevant information for common calls in them, some requests can be handled without hitting the datastore (or by making queries smaller). This is why there are less arrows pointing to the user database in the stateless diagram. A subtle but important difference.

Note that although the user database is not used by any of the services in the image, it is still necessary (other services may require it). There is only so much information a token can carry.

## Going Stateless
The good thing about going stateless is that you can use both approaches at the same time. If you currently have a session-id based architecture, you can add JWTs to certain calls. Or you can embed session-ids in the token and have the API gateway unpack them and then pass them on to internal services.

Another alternative, explained in detail in [5 Steps to Add Modern Authentication to Legacy Apps](https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/), involves making the JWT a cookie. In other words, using the JWT as a unique session id. If your architecture allows for flexibility when it comes to session id formats, this might be the best option.

A per-service based approach is usually a good starting point. This allows you to isolate and test changes in selected non-critical parts of your architecture. The gateway will need to be updated though, and that is a critical part of any service-based architecture. Keep this in mind.

### A combined approach: cookies and session ids
So, let’s suppose you currently have a session based architecture:

![Session based architecture](https://cdn.auth0.com/blog/stateless/3.png)

The gateway, as usual, validates session ids. In other words, it checks for its presence in the “active_sessions” table. A key-value database is used for this, as single-key queries are optimally handled by it. Data associated to that session is also stored in that database. In our case only one field is associated to a session id: the user id. Since the associated data is small, and a request is necessary to check the validity of the session, the data is retrieved and added as a special header to the original request: `OurApp-User-ID`.

The user id is a unique identifier (a primary key) that can be used to access user data in the users’ database, a separate, relational database.
When a request is received, the API gateway looks for the `Cookie` header, extracts the session id from it, and queries the session database for its presence. If the session is present, the request is passed on to the right service.

The service may, in turn, perform additional queries based on the user id to accomplish its task.

Now let’s take a look at how a mixed approach would work.

![Mixed stateless/stateful sessions](https://cdn.auth0.com/blog/stateless/4.png)

For our mixed approach we will embed the JWT in the cookie. This assumes our cookie already supports multiple key/value pairs internally (most HTTP frameworks support this). In other words, our cookie will now carry the session id and the JWT.

When a request arrives at our gateway, now we check for the presence of the JWT. If the JWT is present in the cookie, we validate it (this includes checking for its presence in our list of blacklisted tokens). Additionally, since we don’t know whether the target service supports JWTs or not, we compare the embedded session in the JWT with the cookie session. If they match, the cookie can also be considered valid. If this is the case, the gateway extracts the user id from the JWT, adds it as a `OurApp-User-ID` header and then forwards the request to the target service. The gateway may also add a session id extracted from the JWT if it is missing from the original request. This way, what the target service “sees” is perfectly compatible with what would be present in the stateful version of our architecture.

On the other hand, if the JWT is not present, the traditional path is followed: the session is validated against a database, the user id is added as a header and the request is then passed to the target service. Additionally, the gateway may generate a new JWT and embed it in the response, as a new cookie. In other words, this upgrades the cookie to the mixed session + JWT cookie. From then on, if the JWT is present it is used instead.

![Mixed stateless/stateful sessions](https://cdn.auth0.com/blog/stateless/5.png)

As services are updated to use the JWT, the session-id and OurApp-User-ID header may be dropped from our API. When this is the case, we have fully switched to the stateless approach.

## Negative aspects
If you have read this far, you might we wondering what are the negative aspects of switching to a stateless architecture. In fact, if your sessions are already big enough, it may even be counterproductive.

There is a point at which the size of the token becomes big enough to play against its use. This point depends on several things: request payload size, latency, cost of performing additional queries at the backend, etc. However, you should always strive to keep tokens as small as possible but not smaller than necessary. In general, tokens can be kept in manageable sizes.

If that is not the case, aggregating requests might be an option. If a request is big enough to justify the size of a big token (in other words its overhead is not that big), big tokens might still be a reasonable choice. Although not very common in modern web applications, the [Data Transfer Object (DTO) pattern](https://en.wikipedia.org/wiki/Data_transfer_object) might be worth exploring.

Since tokens in general remain the same for all requests (although possible, endpoint specific tokens are not the norm), the DTO pattern may not easily apply to your architecture. In that case, session ids (or a mixed approach) might be worth keeping.

In general, a typical session id is 21+ bytes long in string form. On the other hand, a JWT with a user id, authorization data and the actual user name (to easily display it in the frontend) is 170+ bytes long in string form.

It will depend on your specific use case whether this difference is negligible or not, or whether the speed difference between a database lookup and JWT validation favors one case or the other.

Other factors such as API call frequency must be considered as well. For instance: are our request queues too big due to many concurrent users? How does the use of bigger tokens impact on our server’s memory in this case? Will using a database increase latency or will JWT validation do so due to hardware limitations? What is the breaking point? As usual, only data from your specific use case can tell. Benchmark and test to your heart’s content.

## Example: getting a JWT using Auth0
Auth0 acts as a bridge between a login provider and your application. JWTs are the perfect tool for this: they can carry any information between a login provider and your application, without having state stored in a database.

1. <a href="javascript:signup()">Sign up</a> for a free Auth0 account.
2. [Go to the dashboard](https://manage.auth0.com/#/applications) and create a new application.
3. For simplicity, we will test a simple user + password database connection. This should be enabled by default, if not, check the [connections section](https://manage.auth0.com/#/connections/database).
4. To get the JWT for a user `test@test.com` with password `test` (check [here](https://auth0.com/docs/api/authentication#!#post--dbconnections-signup) for the user creation API), send the following HTTP post request:

```text
https://<username>.auth0.com/oauth/ro
Content-Type: 'application/json'
{
  "client_id":   "YOUR APPLICATION CLIENT ID", // InfoQTest
  "username":    "test@test.com",
  "password":    "test",
  "id_token":    "",
  "connection":  "Username-Password-Authentication",
  "grant_type":  "password",
  "scope":       "openid",
  "device":      ""
}
```

If everything is right, you should get something like this:

```json
{
  "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NwZXlyb3R0LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1NzQzNzI5Y2I0OGNjODlkMTNhYTBmOTgiLCJhdWQiOiJtSXBBUXBaRERKMnR4WENIQTBaUjVVVTI2bU5pTnV4byIsImV4cCI6MTQ2NDA3NDA5OCwiaWF0IjoxNDY0MDM4MDk4fQ.FABgOD0lvnFImrsFEq6b8-fXJhgiqC6rq-RMkmIWA-o",
  "access_token": "0oaab2tyG9ZHo779",
  "token_type": "bearer"
}
```

The content is:

```json
{
  "iss": "https://speyrott.auth0.com/",
  "sub": "auth0|5743729cb48cc89d13aa0f98",
  "aud": "mIpAQpZDDJ2txXCHA0ZR5UU26mNiNuxo",
  "exp": 1464074098,
  "iat": 1464038098
}
```

## Conclusion
Tokens, by virtue of being able to be validated on their own, require less queries in the backend. Additionally, custom data may be embedded in them, simplifying the flow of certain common operations such as authorization. The size of tokens may be a problem as the information contained in them gets bigger. Chatty architectures may worsen the symptoms in that case. For most scenarios, tokens are a great choice.
Switching from a session based architecture to a token based architecture may be done incrementally. This makes it a great choice for old or new architectures.
