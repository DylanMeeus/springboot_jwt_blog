---
layout: post
title: "JSON Web Token (JWT) Signing Algorithms Overview"
description: "Learn all about the different JWT signing algorithms and how to choose the correct one for your use case!"
date: 2015-12-17 13:00
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
- json web token
- jwt
- algorithm
- algo
- hmac
- rsa
- shared secret
- asymetric cryptography
related:
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
- 2014-01-27-ten-things-you-should-know-about-tokens-and-cookies
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

JSON Web Tokens are used in the industry more and more. The spec which defines them ([RFC7519](https://tools.ietf.org/html/rfc7519)) describes them as a compact, URL-safe means of representing claims between parties by encoding them as JSON objects which can be digitally signed or encrypted. There are several algorithms which take place in this process, we will explore some of the most common ones below. Read on!

-----

## JSON Web Token
A JSON Web Token encodes a series of *claims* in a JSON object. Some of these claims have specific meaning, while others are left to be interpreted by the users. Common claims are:

- Issuer (iss)
- Subject (sub)
- Audience (aud)
- Expiration time (exp)
- Not before (nbf)
- Issued at (iat)
- JWT ID (jti)

Some of these claims are very common. The subject claim (sub) normally describes to whom or to which application the JWT is issued. The issued at claim (iat) can be used to store the time at which the JWT is created, thus allowing JWTs to be invalidated after a certain amount of time. Other custom claims can be added.

A JWT is usually complemented with a signature or encryption. These are handled in their own specs as [JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515) and [JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516).

A signature allows a JWT to be *validated* against modifications. Encryption, on the other hand, makes sure the content of the JWT is only readable by certain parties.

### JOSE header
Signed and encrypted JWTs carry a header known as the JOSE header (JSON Object Signing and Encryption). This header describes what algorithm (signing or encryption) is used to process the data contained in the JWT. The JOSE header typically defines two attributes: `alg` and `typ`.

- alg: the algorithm used to sign or encrypt the JWT
- typ: the content that is being signed or encrypted (usually 'JWT').

### Compact Representation
JWS also defines a *compact* representation for a signed JWT:

```
BASE64URL(UTF8(JWS Protected Header)) + '.' +
BASE64URL(JWS Payload) + '.' +
BASE64URL(JWS Signature)
```

The compact representation is basically the concatenation of the JOSE header, the JWT and the details of the signature. Each component es BASE64 encoded and separated by a single dot ('.').

This results in the typical JWT representation we find in the web:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

[jwt.io](http://jwt.io) is an excellent playfield to test JWTs. Go to [http://jwt.io](http://jwt.io) and input the string above in the encoded field.

### Compact Representation for Encrypted JWTs
The compact representation for encrypted JWTs is somewhat different:

```
BASE64URL(UTF8(JWE Protected Header)) + '.' +
BASE64URL(JWE Encrypted Key) + '.' +
BASE64URL(JWE Initialization Vector) + '.' +
BASE64URL(JWE Ciphertext) + '.' +
BASE64URL(JWE Authentication Tag)
```

The ciphertext would normally contain a JWT.

Signed and encrypted JWTs are usually *nested*. That means that a signed JWT is first produced and then an encrypted version of the signed result is then created. This provides two benefits:

- The signature can't be stripped.
- The signature is private (can't be seen by others).

## Common JWT Signing Algorithms
Most JWTs in the wild are just signed. The most common algorithms are:

- HMAC + SHA256
- RSASSA-PKCS1-v1_5 + SHA256
- ECDSA + P-256 + SHA256

> The specs defines many more algorithms for signing. You can find them all in [RFC 7518](https://tools.ietf.org/html/rfc7518#section-3).

### HMAC algorithms
This is probably the most common algorithm for signed JWTs.

Hash-Based Message Authentication Codes (HMACs) are a group of algorithms that provide a way of signing messages by means of a shared key. In the case of HMACs, a cryptographic hash function is used (for instance SHA256). The strength (i.e. how hard it is to forge an HMAC) depends on the hashing algorithm being used.

The main objective in the design of the algorithm was to allow the combination of a key with a message while providing strong guarantees against tampering. Ad-hoc solutions (for example, appending the key to the message and then hashing the result) suffer from mathematical flaws that allow potential attackers to forge the signature. The HMAC algorithm is designed against that.

The algorithm per-se is quite simple (JavaScript pseudo-code with Node.js extensions):

```
// Key: Buffer with key, Message: Buffer with message
function hmacSha256(key, message) {
    // The algorithm requires the key to be of the same length as the
    // "block-size" of the hashing algorithm (SHA256 = 64-byte blocks).
    // Extension is performed by appending zeros.
    var fullLengthKey = extendOrTruncateKey(key);

    var outterKeyPad = 0x5c; // A constant defined by the spec.
    var innerKeyPad = 0x36; // Another constant defined by the spec.

    var outterKey = new Buffer(fullLengthKey.length);
    var innerKey = new Buffer(fullLengthKey.length);
    for(var i = 0; i < fullLengthKey.length; ++i) {
        outterKey[i] = outterKeyPad ^ fullLengthKey[i];
        innerKey[i] = innerKeyPad ^ fullLengthKey[i];
    }

    // sha256(outterKey + sha256(innerKey, message))
    // (Buffer.concat makes this harder to read)
    return sha256(Buffer.concat([outterKey, sha256(Buffer.concat([innerKey, message]))]));
}
```

HMACs are used with JWTs when you want a simple way for all parties to create and validate JWTs. Any party knowing the key can create new JWTs. In other words, with shared keys, it is possible for party to impersonate another one: HMAC JWTs do not provide guarantees with regards to the creator of the JWT. Anyone knowing the key can create one. For certain use cases, this is too permissive. This is where asymmetric algorithms come into play.

## RSA and ECDSA algorithms
Both RSA and ECDSA are asymmetric encryption and digital signature algorithms. What asymmetric algorithms bring to the table is the possibility of verifying or decrypting a message without being able to create a new one. This is key for certain use cases. Picture a big company where data generated by the sales team needs to be verified by the accounting team. If an HMAC were to be used to sign the data, then both the sales team and the accounting team would need to know the same key. This would allow the sales team to sign data and make it pass as if it were from the accounting team. Although this might seem unlikely, especially in the context of a corporation, there are times when the ability to verify the creator of a signature is essential. JWTs signed or encrypted with RSA or ECDSA provide this capability. A party uses its private party to sign a JWT. Receivers in turn use the public key (which must be shared in the same way as an HMAC shared key) of that party to verify the JWT. The receiving parties cannot create new JWTs using the public key of the sender.

Both RSA and ECDSA algorithms are more complex than HMAC. If you are interested in the gritty details, read [RFC 3447](https://tools.ietf.org/html/rfc3447) for RSA encryption, and the original [ECDSA paper](http://cs.ucsb.edu/~koc/ccs130h/notes/ecdsa-cert.pdf).

The main difference between RSA and ECDSA lies in speed and key size. ECDSA requires smaller keys to achieve the same level of security as RSA. This makes it a great choice for small JWTs. RSA, however, is usually faster than ECDSA. As usual, pick the one that best aligns with your requirements.

## Aside: JWTs are everywhere at Auth0
At Auth0 we rely heavily on the fetures of JWTs. All of our APIs handle authentication and authorization through JWTs. For instance, our Lock library returns a JWT that you can store client side and use for future requests to your own APIs. Thanks to JWS and JWE, the contents of the client-side JWTs are safe.

The following code shows a client-side script that performs authentication using our Lock library (plus jQuery) and stores the returned JWT as a local storage item:

```
var lock = null;
$(document).ready(function() {
   lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_ACCOUNT.auth0.com');
});

var userProfile;

$('.btn-login').click(function(e) {
  e.preventDefault();
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback
      alert('There was an error');
    } else {
      // Success callback

      // Save the JWT token.
      localStorage.setItem('userToken', token);

      // Save the profile
      userProfile = profile;
    }
  });
});
```

For any future request, the returned JWT can be included as part of the HTTP call (jQuery AJAX setup):

```
$.ajaxSetup({
  'beforeSend': function(xhr) {
    if (localStorage.getItem('userToken')) {
      xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('userToken'));
    }
  }
});
```

## Conclusion
JWTs are convenient way of representing authentication and authorization claims for your application. They are easy to parse, human readable and compact. But the killer features are in the JWS and JWE specs. With JWS and JWE all claims can be conveniently signed and encrypted, while remaining compact enough to be part of every API call. Solutions such as session-ids and server-side tokens seem old and cumbersome when compared to the power of JWTs. If you haven't worked with these technologies yet, we strongly recommend you do so in your next project. You won't be disappointed.
