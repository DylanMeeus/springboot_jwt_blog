---
layout: post
title: "From Theory to Practice: Adding Two-Factor Authentication to Node.js"
description: "Learn how to easily add 2FA/MFA to your Node.js + Express.js apps using TOTP"
date: 2015-08-20 18:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#3071BE"
  image: https://cdn.auth0.com/blog/mfa/logo_ga.svg
  image_size: "70%"
  image_bg: "#3071BE"
tags: 
- authentication
- passport.js
- passport-totp
- express.js
- totp
- rfc-6238
- google authenticator
- node.js
- two-factor
- multi-factor
- 2fa
- mfa
- auth
---

-----

Authentication has increasingly become an important part of all web applications and sites. Long gone are the days of applications that simply performed an action without getting any details about the identity of the user who performed the actions. In this post, we will explore one of the most powerful (and easiest) ways of improving the security of your authentication process: two-factor authentication (2FA / MFA).

-----

## Two-factor authentication
2FA has become quite popular. As you may have guessed, it works by providing an additional layer of authentication that is independent of the main layer. Most applications make use of the usual username + password combination, though any two independent authentication methods may be combined. In the following paragraphs, we will explore one authentication method that has become popular for use as the second step in 2FA: the time-based one-time password algorithm (TOTP).

## Time-based one-time password algorithm
TOTP is defined in [RFC 6238](https://tools.ietf.org/html/rfc6238). It is free and simple. There are many open-source implementations for both the client-side and server-side components. In particular, Google has developed an application that is freely available for Android, iOS and the web: Google Authenticator. This application allows us to integrate TOTP easily into our developments. We will explore how to do so in the following sections, but first I'll give you a quick summary of TOTP and how it usually works in two steps:

1. **Enrollment:** enabling 2FA for a specific user.
2. **Login:** using 2FA to log in.

![Typical 2FA flowchart](https://cdn.auth0.com/blog/twofa/Flowchart.png "Typical 2FA flowchart")

As you may have gathered from the chart above, the main requirement for TOTP to work is a **shared secret**. This shared secret needs to be generated and then stored by both the client- and the server-side components of the system. This usually means that an "enrollment" step is necessary before making TOTP available in an application.

Another important thing to keep in mind, as the name of the algorithm implies, the generated codes are time-dependent. The **client and the server need to synchronize their clocks**, and the codes become invalid after a certain amount of time. 

## Adding TOTP to your Node.js application
As you have seen in the previous chart, adding 2FA with TOTP to an application requires two independent steps. In our example, the second step (the actual authentication) will be handled by passport-totp, a passport.js strategy that validates the user-entered TOTP code and requires access to the user-specific key. We will also require the user to install Google Authenticator (or another similar app) to generate codes with his or her cellphone. The user may also choose to use the Google Authenticator Chrome app.

You can find all the code from the following snippets here: [app.js](https://github.com/sebadoom/auth0/blob/master/twofa/backend/app.js)

### Step one: enrollment
In our example, the first step will be handled manually by us. We will add code to generate a new random key and store it along with other user authentication information.

After the usual passport.js and express.js setup, we add the necessary TotpStrategy:

```javascript
passport.use(new TotpStrategy(
    function(user, done) {
        // The user object carries all user related information, including
        // the shared-secret (key) and password.
        var key = user.key;
        if(!key) {
            return done(new Error('No key'));
        } else {
            return done(null, base32.decode(key), 30); //30 = valid key period
        }
    })
);
```

As usual, passport will call this callback with the actual 'user' object as deserialized from the request. The 'user' object contains a 'key' string that may be null. If the key is null, we will consider TOTP disabled and allow logins with just a username and password. If the key is present, we will require an additional input from the user before proceeding with the login. The key must be provided to passport as a byte array, but for convenience (and because Google Authenticator requires so), we store it as a BASE32 encoded string. The 'period' is the amount of time a single TOTP code is valid from the moment it is requested to the moment it is entered.

The enrollment step requires the user to be already logged in (as this is necessary to enable or disable TOTP in the server for each specific account). If the user chooses to enable TOTP, we present the shared secret as a QR code ready to scan and save in Google Authenticator:

```javascript
app.get('/totp-setup', 
    isLoggedIn,
    ensureTotp,
    function(req, res) {
        var url = null;
        if(req.user.key) {
            var qrData = sprintf('otpauth://totp/%s?secret=%s', 
                                 req.user.username, req.user.key);
            url = "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=" + 
                   qrData;
        }
    
        res.render('totp-setup', {
            strings: strings,
            user: req.user,
            qrUrl: url 
        });
    }
);

app.post('/totp-setup',
    isLoggedIn,
    ensureTotp,
    function(req, res) {
        if(req.body.totp) {
            req.session.method = 'totp';
            
            var secret = base32.encode(crypto.randomBytes(16));
            //Discard equal signs (part of base32, 
            //not required by Google Authenticator)
            //Base32 encoding is required by Google Authenticator. 
            //Other applications
            //may place other restrictions on the shared key format.
            secret = secret.toString().replace(/=/g, '');
            req.user.key = secret;
        } else {
            req.session.method = 'plain';
            
            req.user.key = null;
        }
        
        res.redirect('/totp-setup');
    }
);
```

If the user chooses to enable TOTP, we generate a new secret key randomly. Then we encode it in BASE32 format for easy storage and to show it to the user. The 'ensureTotp' middleware makes sure that if 2FA is enabled, then the user has logged in using a TOTP code (see below for the implementation).

### Step two: a new authentication step
Once 2FA is enabled, logins will now have two steps: a username and password will be required as usual, and then, a six-digit code will be input, which the user will need to get from Google Authenticator every time he or she wants to login. So, we will add the necessary code to perform the login and allow the user to enter the code after the first step is complete.

#### Logins are now performed in two steps if the user has 2FA enabled

```javascript
app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        if(req.user.key) {
            req.session.method = 'totp';
            res.redirect('/totp-input');
        } else {
            req.session.method = 'plain';
            res.redirect('/totp-setup');
        }
    }
);
```

After the usual username + password authentication, we check whether a TOTP code is required. If so, we redirect the user to the "totp-input" page. Otherwise we send him or her to the usual place after logging in (in this case, for simplicity, we just keep a totp-setup page as the landing page after a successful login). Keep in mind that all places that require authentication need to check for both the standard login and the TOTP login (which is optional) for this to be secure. For instance:

```javascript
app.get('/totp-setup', 
    isLoggedIn,
    ensureTotp,
    function(req, res) {
        var url = null;
        if(req.user.key) {
            var qrData = sprintf('otpauth://totp/%s?secret=%s', 
                                 req.user.username, req.user.key);
            url = "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=" + 
                   qrData;
        }
    
        res.render('totp-setup', {
            strings: strings,
            user: req.user,
            qrUrl: url 
        });
    }
);
```

And here are the implementations of the middleware elements that perform the check:

```javascript
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

function ensureTotp(req, res, next) {
    if((req.user.key && req.session.method == 'totp') ||
       (!req.user.key && req.session.method == 'plain')) {
        next();
    } else {
        res.redirect('/login');
    }
}
```

As you can see, for the TOTP check, we make use of a helper variable ('method') inside the session. Session information is stored on the server, so this is safe to do. The client just keeps a session ID. This extra session variable is set in the login handler (POST), which we have shown above.

## Is this production ready?
In the previous paragraphs we covered the basics of 2FA. Here's what you need to keep in mind when going into production:

- **Phone or device unavailable:** Consider what happens if a user loses access to his or her code-generating device or application (or shared-secret). Provide a means for the user to recover access to his or her account without compromising security (email links, SMS messages, etc.).
- **Reset 2FA from backend:** Depending on your use case, it may be necessary to add the means to disable or reset 2FA data directly from the backend. Usually, this is accomplished by requiring the user to perform the enrollment step one more time after login.
- **Fallback for people who don't have smartphones:** If a user chooses not to use a smartphone, any of the recovery methods may be enabled indefinitely.
- **Audit and notify users of changes:** Provide convenient ways for users to see if the authentication details (or methods) have been changed or enabled in their accounts. This allows for early detection of suspicious activity. Automated emails are a good choice.
- **Encrypt shared secrets**: Per [RFC 6238](https://tools.ietf.org/html/rfc6238#section-5), you should store shared-secrets using a cryptographically secure reversible algorithm and keep the keys in memory only as long as necessary. Do not reinvent the wheel; use existing and well-tested libraries for this.

## Conclusion
We showed in this blog post how easy it is to get started with 2FA using TOTP. It does not require a lot of infrastructure. Google Authenticator, Microsoft Authenticator, Authy and other TOTP applications are available in multiple platforms which makes adoption easy. But don't forget to take into account the non-happy-path: people reset their phone, it gets lost or stolen, or sometimes they don't even have one.

For simplicity, the code in our example uses a simple JSON file as storage. In production you would normally keep user data in a proper (and secure) database. Get the code: [app.js](https://github.com/sebadoom/auth0/blob/master/twofa/backend/app.js).

## Aside: How it works in Auth0
Auth0 provides convenient [2FA](https://auth0.com/learn/multi-factor-authentication) methods that can easily be enabled. Check this out:

![Auth0 2FA](https://cdn.auth0.com/blog/grow-revenue/mfa.png "Easy 2FA with Auth0")

- **A Switch Away:** 2FA is enabled with just a toggle. No changes are required to your application.
- **Multiple TOTP Clients:** Auth0 works with various client-side TOTP-generating apps: Google Authenticator, Microsoft Authenticator, Authy, etc.
- **Contextual and Programmable 2FA:** Contextual 2FA: enforce 2FA for users according to your own scripted rules.

Check the [docs](https://auth0.com/docs/mfa) and the [landing page](https://auth0.com/learn/multi-factor-authentication).

