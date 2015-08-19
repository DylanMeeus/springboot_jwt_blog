---
layout: post
title: "Adding Two-Factor Authentication to your Node.js + Express Apps with passport.js and Google Authenticator"
description: "Learn how to easily add 2FA to your Node.js + Express app using TOTP"
date: 2015-08-14 18:00
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

Authentication has increasingly become an important part of all web applications and sites. Long gone are the days of applications that simply performed an action without getting any details about the identity of the user who performed the actions. In this post, we will explore one of the most powerful (and easiest) ways of improving the security of your authentication process: two-factor authentication (2FA).

-----

## Two-factor authentication
2FA has become quite popular. As you may have guessed, it works by providing an additional layer of authentication that is independent of the main layer. Most applications make use of the usual username + password combination, though any two independent authentication methods may be combined. In the following paragraphs, we will explore one authentication method that has become popular for use as the second step in 2FA: the time-based one-time password algorithm (TOTP).

## Time-based one-time password algorithm
TOTP is defined in [RFC 6238](https://tools.ietf.org/html/rfc6238). It is free and simple. There are many open-source implementations for both the client-side and server-side components. In particular, Google has developed an application that is freely available for Android, iOS and the web: Google Authenticator. This application allows us to integrate TOTP easily into our developments. We will explore how to do so in the following sections, but first I'll give you a quick summary of TOTP and how it usually works.

![Typical 2FA flowchart](http://cdn.auth0.com/blog/twofa/Flowchart.png "Typical 2FA flowchart")

As you may have gathered from the chart above, the main requirement for TOTP to work is a shared secret. This shared secret needs to be generated and then stored by both the client- and the server-side components of the system. This usually means that an "enrollment" step is necessary before making TOTP available in an application.

Another important thing to keep in mind, as the name of the algorithm implies, the generated codes are time-dependent. The client and the server need to synchronize their clocks, and the codes become invalid after a certain amount of time. 

### Cool (and not so cool) features
The cool thing about TOTP is that once the enrollment step is complete (i.e. a shared key has been set up between the client and the server), any client-side device can generate the code required for your application. This device does not need to be online, nor does it need to be the device where your application is running. The only requirement is that the clocks need to be (somewhat) synchronized and that the shared key must be known to both sides. I consider this to be quite cool. 

Another cool feature is that it is quite easy to integrate with most applications (as you will see in the example below).

Now for that bad side: we are still sharing a secret. The whole point of a password is that it must be secret. So how is that different from the shared secret in TOTP? This is true and it could be considered a weakness for your use case. If so, consider other authentication methods. The upside when compared to a password is that the device storing it need not be the same as the one that runs or serves the application that needs to perform the authentication (as we said before). Consider this difference carefully when picking TOTP for your developments.

Another point against TOTP could be the inconvenient enrollment step. It may be confusing for non-technical users. This obviously depends on the application or device that will be providing the codes. Study this carefully with your UX team before deciding on TOTP. You should also consider what happens if the user loses access to his or her code-generating application or device.

## Adding TOTP to your Node.js application
As you may have seen in the previous chart, adding 2FA with TOTP to an application requires two independent steps:

1. A setup step, which basically requires creating a new, shared secret between the client- and the server-side components of the authentication system
2. An additional authentication step where the actual authentication is carried out

In this case, the first step will be handled manually by us. We will add code to generate a new random key and store it along with other user authentication information. The second step, the actual authentication, will be handled by passport-totp, a passport.js strategy that validates the user-entered TOTP code and requires access to the user-specific key. We will also require the user to install Google Authenticator (or another similar app) to generate codes with his or her cellphone. The user may also choose to use the Google Authenticator Chrome app.

You can find all the code from the following snippets here: [app.js](https://github.com/sebadoom/auth0/blob/master/twofa/backend/app.js)

### Step one: enrollment
After the usual passport.js and express.js setup, we add the necessary TotpStrategy:

```javascript
passport.use(new TotpStrategy(
    function(user, done) {
        var key = user.key;
        if(!key) {
            return done(new Error('No key'));
        } else {
            return done(null, base32.decode(key), 30); //30 = valid key period
        }
    })
);
```

As usual, passport will call this callback with the actual 'user' object as deserialized from the request. In this case, we are using a simple JSON-based file-system storage. In production, you should never store passwords and secrets as plain text. The 'user' object contains a 'key' string that may be null. If the key is null, we will consider TOTP disabled and allow logins with just a username and password. If the key is present, we will require an additional input from the user before proceeding with the login. This is what the 'ensureTotp' middleware does behind the scenes: it makes sure that if 2FA is enabled, then the user has logged in using a TOTP code (see below for the implementation). The key must be provided to passport as a byte array, but for convenience (and because Google Authenticator requires so), we store it as a BASE32 encoded string. The 'period' is the amount of time a single TOTP code is valid from the moment it is requested to the moment it is entered.

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

If the user chooses to enable TOTP, we generate a new secret key randomly. Then we encode it in BASE32 format for easy storage and to show it to the user.

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

## First steps to production: things to keep in mind
Once 2FA is enabled for a specific user, he or she must always be able to provide a TOTP code. As the code is generated from a shared secret (which the user normally does not remember), losing access to this secret or to the device that stores it can indefinitely lock out a user from his or her account. As with username + password authentication, you should provide a way for the user to recover access to his or her account. This carries important security considerations: if 2FA can easily be disabled by an attacker, it provides little additional security. Study how to provide this alternative to your users. One common way of doing so is by performing a full authentication reset through the user’s email account (disable 2FA and give the user access to his or her account through an emailed link). Another way is to send a TOTP code (via SMS) to a phone preregistered in the user account.

The SMS alternative is quite common. It is quite possible for a user to lose access to his or her phone but not to his or her phone line. For instance, consider the case of a phone being stolen (along with the app storing the shared secret). The shared secret is then lost, but the phone line can usually be reactivated in a new phone in a couple of hours. An alternative way of providing a code to the user as a fallback is usually recommended for 2FA, and SMS messages are a convenient example.

Sometimes, 2FA is used to provide additional security at special times. Some applications provide a timed activation/deactivation of 2FA. Consider if this applies to your use case. As you can see from the example above, enabling or disabled 2FA on the server is quite simple.

There is another thing to keep in mind when dealing with authentication details from your users: provide convenient ways for them to see if the authentication details (or methods) have been changed or enabled in their accounts. The sooner any suspicious activity is detected, the sooner you can take action. Send an automated email if 2FA is enabled or disabled, or a password or secret is changed.

Lastly, if you are going to use the code in the sample application from this post, then do not store passwords as plain text. TOTP shared secrets are OK as plain text (since you need to provide the key as-is to the authenticator). On the other hand, passwords must never be stored this way. Use hashes + salts, and slow or many-iteration algorithms as recommended.

## Do I have to do all this? See how it works with Auth0
Auth0 provides convenient 2FA methods that can easily be enabled. Check this out:

![Auth0 2FA](http://cdn.auth0.com/blog/twofa/auth0mfa.gif "Easy 2FA with Auth0")

All additional authentication steps can easily be scripted on Auth0 as [rules](https://auth0.com/docs/rules). As you can see, MFA is supported natively and can be enabled with just a switch. Follow the instructions, add the client IDs for the users you want to enable 2FA for and you are done. A piece of cake! You can even do contextual MFA, that is, enable MFA based on certain conditions that can be scripted. Check the [docs](https://auth0.com/docs/mfa).

## Conclusion
Adding 2FA to your node apps using TOTP and passport.js is fairly easy. Doing so improves the security of your authentication process. Google Authenticator provides a simple and stable client-side implementation of the code-generating application that any user can install in his or her phone. Just keep in mind what will happen if a user loses access to his or her code-generating device or secret key. Other than that, hack along!
