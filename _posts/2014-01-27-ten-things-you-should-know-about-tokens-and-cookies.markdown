---
published: "true"
layout: post
title: 10 Things You Should Know about Tokens
date: "2014-01-27 12:30"
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60
---


<img src="http://alfanatic.webs.com/alfpogs.jpg" style="width: 225px; margin-left: 30px; display: block;float:right">

Couple weeks ago we published a short article about [cookies vs tokens in the context of single page applications](/2014/01/07/angularjs-authentication-with-cookies-vs-token/), in particular applied to AngularJs apps. It seems the community is interested in this topic, so we published a second article on [token based authentication in realtime frameworks like socket.io](/2014/01/15/auth-with-socket-io/). There is a great interest in this subject so we decided to continue with an article that explores in more detail some of the most common questions around token-based authentication. So here we go...

<!-- more -->

<ol>
  <li><a href="#token-storage">Tokens need to be stored somewhere (local/session storage or cookies)</a></li>
  <li><a href="#token-expiration">Tokens can expire like cookies, but you have more control</li>
  <li><a href="#token-cross-domains">Local/session storage won't work across domains, use a marker cookie</li>
  <li><a href="#preflight">Preflight requests will be sent on each CORS request</li>
  <li><a href="#file-downloads">When you need to stream something, use the token to get a signed request</li>
  <li><a href="#xss-xsrf">It's easier to deal with XSS than XSRF</li>
  <li><a href="#token-size">The token gets sent on every request, watch out its size</li>
  <li><a href="#confidential-info">If you store confidential info, encrypt the token</li>
  <li><a href="#token-oauth">JSON Web Tokens can be used in OAuth</li>
  <li><a href="#fine-grained-authorization">Tokens are not silver bullets, think about your authorization use cases carefully</li>
</ol>


<a name="token-storage"></a>
##1. Tokens need to be stored somewhere (local/session storage or cookies)

In the context of tokens being used on single page applications, some people have brought up the issue about refreshing the browser, and what happens with the token. The answer is simple: you have to [store the token somewhere: in session storage, local storage or a client side cookie](https://github.com/auth0/angular-token-auth/blob/master/auth.client.js#L31). Most session storage polyfills fallback to cookies when the browser doesn't support it.

If you are wondering _"but if I store the token in the cookie I'm back to square one"_. Not really, in this case you are using cookies as a storage mechanism, [not as an authentication mechanism](http://sitr.us/2011/08/26/cookies-are-bad-for-you.html) (i.e. the cookie won't be used by the web framework to authenticate a user, hence no XSRF attack)

<a name="token-expiration"></a>
##2. Tokens can expire like cookies, but you have more control

Tokens have an expiration (in [JSON Web Tokens](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-15#section-4.1.4) is represented by `exp` property), otherwise someone could authenticate forever to the API once they logged in at least once. Cookies also have expiration for the same reasons.

In the world of cookies, there are different options to control the lifetime of the cookie:

  1. Cookies can be destroyed after the browser is closed (session cookies).
  2. In addition to this you can implement a server side check (typically done for you by the web framework in use), and you could implement expiration or sliding window  expiration.
  3. Cookies can be persistent (not destroyed after the browser is closed) with an expiration.

In the tokens world, once the token expires, you simply want to get a new one. You could implement an endpoint to refresh a token that will:

1. Validate the old token
2. Check if the user still exists or access hasn't been revoked or whatever makes sense for your application
3. Issue a new token with a renewed expiration

You can even store in the token the original issue date, and enforce a re-login after two weeks or so.

    app.post('/refresh_token', function (req, res) {
      // verify the existing token
      var profile = jwt.verify(req.body.token, secret);

      // if more than 14 days old, force login
      if (profile.original_iat - new Date() > 14) { // iat == issued at
        return res.send(401); // re-logging
      }

      // check if the user still exists or if authorization hasn't been revoked
      if (!valid) return res.send(401); // re-logging

      // issue a new token
      var refreshed_token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
      res.json({ token: refreshed_token });
    });

If you need revocation of tokens (useful if tokens are long-lived) you will need to have some sort of registry of issued tokens to check against.

<a name="token-cross-domains"></a>
##3. Local/session storage won't work across domains, use a marker cookie

If you set a cookie's domain to `.yourdomain.com` it can be accessed from `yourdomain.com` and `app.yourdomain.com`, making it easier to detect from the main domain (where you probably have, let's say, your marketing site) that the user is already logged in and redirect her to `app.yourdomain.com`.

Tokens stored in local/session storage, on the other hand, can't be accessed from different domains (even if these are subdomains). So what can you do?

One possible option is, when the user authenticates on `app.yourdomain.com` and you generate a token you can also set a cookie set to `.yourdomain.com`

    $.post('/authenticate, function() {
      // store token on local/session storage or cookie
        ....

        // create a cookie signaling that user is logged in
      $.cookie('loggedin', profile.name, '.yourdomain.com');
    });

Then, in `youromdain.com` you can check the existance of that cookie and redirect to `app.yourdomain.com` if the cookie exists. The token will be available on app subdomain, and from there on, the usual flow applies (if the token is still valid use it, if not get a new one unless last login was more than the threshold you set up).

It could happen that the cookie exists but the token was deleted or something else happened. In that case, the user would have to login again. But what's important to highlight here is, as we said before, we are not using the cookie as an authentication mechanism, just as a storage mechanism that happens to support storing information across different domains.

<a name="preflight"></a>
##4. Preflight requests will be sent on each CORS request

Someone pointed out that the Authorization header is not a [simple header](http://www.w3.org/TR/cors/), hence a pre-flight request would be required for all the requests to a particular URLs.

    OPTIONS https://api.foo.com/bar
    GET https://api.foo.com/bar
       Authorization: Bearer ....

    OPTIONS https://api.foo.com/bar2
    GET https://api.foo.com/bar2
       Authorization: Bearer ....

    GET https://api.foo.com/bar
       Authorization: Bearer ....

But this happens if you are sending `Content-Type: application/json` for instance. So this is already happening for most applications.

One small caveat, the `OPTIONS` request won't have the Authorization header itself, so your web framework should support treating `OPTIONS` and the subsequent requests differently (__Note:__ Microsoft IIS for some reason seems to have issues with this).

<a name="file-downloads"></a>
##5. When you need to stream something, use the token to get a signed request

When using cookies, you can trigger a file download and stream the contents easily. However, in the tokens world, where the request is done via XHR, you can't rely on that. The way you solve this is by generating a signed request like AWS does, for example. [Hawk Bewits](https://github.com/hueniverse/hawk) is a nice framework to enable this:

####__Request__:

    POST /download-file/123
    Authorization: Bearer...

####__Response__:

    ticket=lahdoiasdhoiwdowijaksjdoaisdjoasidja

This ticket is stateless and it is built based on the URL: host + path + query + headers + timestamp + HMAC, and has an expiration. So it can be used in the next, say 5 minutes, to download the file.

You would then redirect to `/download-file/123?ticket=lahdoiasdhoiwdowijaksjdoaisdjoasidja`. The server will check that the ticket is valid and continue with business as usual.

<a name="xss-xsrf"></a>
##6. It's easier to deal with XSS than XSRF

Cookies have this feature that allows setting an `HttpOnly` flag from server side so they can only be accessed on the server and not from JavaScript. This is useful because it protects the content of that cookie to be accessed by injected client-side code (XSS).

Since tokens are stored in local/session storage or a client side cookie, they are open to an XSS attack getting the attacker access to the token. This is a valid concern, and for that reason you should keep your tokens expiration low.

But if you think about the attack surface on cookies, one of the main ones is XSRF. The reality is that XSRF is one of the most misunderstood attacks, and the average developer, might not even understand the risk, so lots of applications lack anti-XSRF mechanism. However, everybody understands what injection is. Put simply, if you allow input on your website and then render that without escaping it, you are open to XSS. So based on our experience, it is easier to protect against XSS than protecting against XSRF. Adding to that, anti-XSRF is not built-in on every web framework. XSS on the other hand is easy to prevent by using the escape syntax available by default on most template engines.


<a name="token-size"></a>
##7. The token gets sent on every request, watch out its size

Every time you make an API request you have to send the token in the `Authorization` header.


    GET /foo
    Authorization: Bearer ...2kb token...

vs.

    GET /foo
    connect.sid: ...20 bytes cookie...

Depending on how much information you store in that token, it could get big. On the other hand, session cookies usually are just an identifier (connect.sid, PHPSESSID, etc.) and the rest of the content lives on the server (in memory if you just have one server or a database if you run on a server farm).

Now, nothing prevents you from implementing a similar mechanism with tokens. The token would have the basic information needed and on the server side you would __enrich__ it with more data on every API call. This is exactly the same thing cookies will do, with the difference that you have the additional benefit that this is now a conscious decision, you have full control, and is part of your code.

    GET /foo
    Authorization: Bearer ……500 bytes token….

Then on the server:

    app.use('/api',
      // validate token first
      expressJwt({secret: secret}),

      // enrich req.user with more data from db
      function(req, res, next) {
        req.user.extra_data = get_from_db();
        next();
      });

It is worth mentioning that you could also have the session stored completely on the cookie (instead of being just an identifier). Some web platforms support that, others not. For instance, in node.js you can use [mozilla/node-client-sessions](https://github.com/mozilla/node-client-sessions).

<a name="confidential-info"></a>
##8. If you store confidential info, encrypt the token

The signature on the token prevents tampering with it. TLS/SSL prevents man in the middle attacks. But if the payload contains sensitive information about the user (e.g. SSN, whatever), you can also encrypt them. The [JWT spec](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token) points to the [JWE spec](http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption) but most of the libraries don't implement JWE yet, so the simplest thing is to just encrypt with AES-CBC as shown below.

    app.post('/authenticate', function (req, res) {
      // validate user

      // encrypt profile
      var encrypted = { token: encryptAesSha256('shhhh', JSON.stringify(profile)) };

      // sing the token
      var token = jwt.sign(encrypted, secret, { expiresInMinutes: 60*5 });

      res.json({ token: token });
    }

    function encryptAesSha256 (password, textToEncrypt) {
      var cipher = crypto.createCipher('aes-256-cbc', password);
      var crypted = cipher.update(textToEncrypt, 'utf8', 'hex');
      crypted += cipher.final('hex');
      return crypted;
    }

Of course you can use the approach on #7 and keep confidential info in a database.

**UPDATE**: [Pedro Felix](https://twitter.com/pmhsfelix) correctly pointed out that MAC-then-encrypt is vulnerable to [Vaudenay-style attacks](http://www.thoughtcrime.org/blog/the-cryptographic-doom-principle/). I updated the code to do encrypt-then-MAC.

<a name="token-oauth"></a>
##9. JSON Web Tokens can be used in OAuth

Tokens are usually associated with OAuth. [OAuth 2](http://tools.ietf.org/html/rfc6749) is an authorization protocol that solves identity delegation. The user is prompted for consent to access his/her data and the authorization server gives back an `access_token` that can be used to call the APIs acting as that user.

Typically these tokens are opaque. They are called `bearer` tokens and are random strings that will be stored in some kind of hash-table storage on the server (db, cache, etc.) together with an expiration, the scope requested (e.g. access to friend list) and the user who gave consent. Later, when the API is called, this token is sent and the server lookup on the hash-table, rehydrating the context to make the authorization decision (did it expire? does this token has the right scope associated for the API that wants to be accessed?).

The main difference between these tokens and the ones we've been discussing is that signed tokens (e.g.: JWT) are "stateless". They don't need to be stored on a hash-table, hence it's a more lightweight approach. OAuth2 does not dictate the format of the `access_token` so you could return a JWT from the authorization server containing the scope/permissions and the expiration.

<a name="fine-grained-authorization"></a>
##10. Tokens are not silver bullets, think about your authorization use cases carefully

Couple of years ago we helped a big company implement a token-based architecture. This was a 100.000+ employees company with tons of information to protect. They wanted to have a centralized organization-wide store for "authentication & authorization". Think about "user X can read field id and name of clincial trial Y for hospital Z on country W" use cases. This fine-grained authorization, as you can imagine, can get unmanageable pretty quickly, not only technically but also administratively.

* Tokens can get really big
* Your apps/APIs gets more complicated
* Whoever grant these permissions will have a hard time managing all this.

We ended up working more on the information architecture side of things to make sure the right scopes and permissions were created. Conclusion: resist the temptation of putting everything into tokens and do some analysis and sizing before going all the way with this approach.

----

**Disclaimer**: when dealing with security, make sure you do the proper due dilligence. Any code/recommendation that you get here is provided as-is.

Please leave a comment or [discuss on HN](https://news.ycombinator.com/item?id=7137498).

Happy tokenizing!

_Photo taken from: http://alfanatic.webs.com/_



