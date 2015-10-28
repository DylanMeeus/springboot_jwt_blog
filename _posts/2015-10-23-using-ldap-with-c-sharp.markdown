---
layout: post
title: "Using LDAP and Active Directory with C# 101"
description: "In this tutorial learn how to integrate LDAP and Active Directory (AD) with your C# projects"
date: 2015-10-28 10:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#596D5F"
  image: https://cdn.auth0.com/blog/ldap/logo.png
  image_size: "110%"
  blog_series: true
tags: 
- ldap
- lightweight directory access protocol
- c#
- single sign on
- sso
- active directory
- ad
- .net
- authentication
- post-series
---

In this post series we will study the [Lightweight Directory Access Protocol (LDAP)](https://tools.ietf.org/html/rfc4511): a protocol developed in the '90s as an open, simpler alternative to other directory protocols. We will also talk about Active Directory (Microsoft's LDAP implementation with extra features) and how to use it as an authentication mechanism. For the purposes of this post we will focus on the generic [LdapConnection API](https://msdn.microsoft.com/en-us/library/system.directoryservices.protocols.aspx). In the next post we will take a look at the Active Directory specific [PrincipalContext API](https://msdn.microsoft.com/en-us/library/system.directoryservices.accountmanagement.principalcontext.aspx). Get the [full code](https://github.com/auth0/blog-ldap-csharp-example) and read on!

-----

## What is LDAP?
LDAP is a protocol defining a series of operations through which you can access information that is part of a **directory**. A directory is a tree containing a set of **attributes** associated with a unique identifier (or primary key). If you are familiar with document based databases this may sound familiar. The primary key is usually a **name**. This means that LDAP is perfectly suited as a **user information database**. Even though most of the time it is used as a user directory, LDAP can also work as a generic information sharing service.

![LDAP's tree-structured attributes](https://cdn.auth0.com/blog/ldap/ldap-tree.png)

One common use of LDAP is as part of **single-sign-on (SSO)** systems. If you are not familiar with SSO, read our [introduction to SSO](https://auth0.com/blog/2015/09/23/what-is-and-how-does-single-sign-on-work/).

The following diagram shows how a simple SSO system can work using LDAP. The diagram shows a simplified [Microsoft Active Directory](https://en.wikipedia.org/wiki/Active_Directory) configuration using LDAP. Active Directory stores user information in a LDAP server. When a user attempts to login to his or her Windows PC, Windows validates the login information against the LDAP/Active Directory server. Whenever a user tries to do something that requires authentication, an application can use information from the Active Directory server to validate the user's identity. Of course, if SSO is not required, Active Directory can also be used as a simple authentication mechanism.

![LDAP-based Microsoft Active Directory](https://cdn.auth0.com/blog/ldap/active-directory.png)

## Protocol overview
The best way of understanding a protocol is getting your hands a bit dirty and learning its inner workings. Fortunately, barring binary encoding details and other low-level stuff, LDAP is a fairly simple protocol. LDAP defines a series of **operations** that are available to clients. Clients can connect to two types of servers:

- **Directory System Agent (DSA):** a server which allows LDAP operations
- **Global Catalog:** a special type of server that stores reduced sets of replicated information from DSAs to speed-up searches.

Clients send requests to the server. In turn, the server answers those requests. Most requests are **asynchronous**, others are necessarily synchronous (such as the connection handshake). Additionaly, the server may send special messages to the clients even when there are no pending requests that require a response (for example the server may send a message to notify clients that it is shutting down). All information is encoded using **ASN.1** (see below for more details). TLS and/or SASL may be used to ensure privacy and perform authentication.

![LDAP is an asynchronous protocol](https://cdn.auth0.com/blog/ldap/ldap-async-2.png)

### Supported operations
The following operations have .NET samples. A full working example can be found in the example section below.

Common operations supported by LDAP are:

- Search for specific entries

```C#
var request = new SearchRequest("ou=users,dc=example,dc=com", "(objectClass=simpleSecurityObject)", SearchScope.Subtree, null);
var response = (SearchResponse)connection.SendRequest(request);
foreach(SearchResultEntry entry in response.Entries)
{
    //Process the entries
}
```

- Test if a given attribute is present and has the specified value

```C#
var request = new CompareRequest("uid=test,ou=users,dc=example,dc=com", "userPassword", "{SSHA}dFyxYbqyPKlQ7Py1T14XupyVfz7UFIz+");
var response = (CompareResponse)connection.SendRequest(request);
if(response.ResultCode == ResultCode.CompareTrue)
{
    //Attribute present and has the right value
}
```

- Add/modify/delete entries

```C#
var request = new AddRequest("uid=test,ou=users,dc=example,dc=com", new DirectoryAttribute[] {
    new DirectoryAttribute("uid", "test"),
    new DirectoryAttribute("ou", "users"),
    new DirectoryAttribute("userPassword", "badplaintextpw"),
    new DirectoryAttribute("objectClass", new string[] { "top", "account", "simpleSecurityObject" })
});
connection.SendRequest(request);
```

- Move an entry to a different path

```C#
var request = new ModifyDNRequest("uid=test,ou=users,dc=example,dc=com", "ou=administrators,dc=example,dc=com", "uid=test");
connection.SendRequest(request);
```

Furthermore, additional protocol management operations are defined (connect, disconnect, negotiate protocol version, etc.).

### ASN.1 and BER encoding
All operations are performed using messages encoded in Abstract Syntax Notation One (ASN.1) format using Basic Encoding Rules (BER). ASN.1 is defined in [ITU standard X.680](http://www.itu.int/itu-t/recommendations/rec.aspx?rec=x.680) while BER and other encodings are part of [ITU standard X.690](https://www.itu.int/rec/T-REC-X.690/en).

ASN.1 defines a series of **datatypes** (such as integer, string, etc.), a textual format description (schema) and a textual representation of values. BER, on the other hand, defines a **binary encoding** for ASN.1. BER is a traditional tag-length-value encoding. If you are interested in the gritty details, Wikipedia has a nice summary of [BER encoding](https://en.wikipedia.org/wiki/X.690#BER_encoding).

Here is a schema taken directly from [LDAP's RFC](https://tools.ietf.org/html/rfc4511#appendix-B) that shows the message format for LDAP:

```ASN.1
LDAPMessage ::= SEQUENCE {
     messageID       MessageID,
     protocolOp      CHOICE {
          bindRequest           BindRequest,
          bindResponse          BindResponse,
          unbindRequest         UnbindRequest,
          searchRequest         SearchRequest,
          searchResEntry        SearchResultEntry,
          searchResDone         SearchResultDone,
          searchResRef          SearchResultReference,
          modifyRequest         ModifyRequest,
          modifyResponse        ModifyResponse,
          addRequest            AddRequest,
          addResponse           AddResponse,
          delRequest            DelRequest,
          delResponse           DelResponse,
          modDNRequest          ModifyDNRequest,
          modDNResponse         ModifyDNResponse,
          compareRequest        CompareRequest,
          compareResponse       CompareResponse,
          abandonRequest        AbandonRequest,
          extendedReq           ExtendedRequest,
          extendedResp          ExtendedResponse,
          ...,
          intermediateResponse  IntermediateResponse },
     controls       [0] Controls OPTIONAL }

MessageID ::= INTEGER (0 ..  maxInt)
```

In the example above, we can see that an LDAP message carries a message id (an integer going from 0 to `maxInt`), an operation object (each object is defined elsewhere) and an extra field called `control` (which is defined somewhere else in the schema under `Control`). LDAP is defined using the same notation as the data format it uses internally. Behold the power of ASN.1!

A simpler example with actual data:

```ASN.1
World-Schema DEFINITIONS AUTOMATIC TAGS ::= 
BEGIN
  Human ::= SEQUENCE {
     name UTF8String,
     first-words UTF8String DEFAULT "Hello World",
     age  CHOICE {
        biblical INTEGER (1..1000),
        modern  INTEGER (1..100)
     } OPTIONAL
  }
END

first-man Human ::= 
{
    name "Adam", 
    -- use default for first-words --
    age biblical: 930
}
```

In this example we first see a schema for a `human`. A `human` has 2 required fields (`name` and `first-words`) and an optional field (`age`). The `first-words` fields has a default value of "Hello World" in case it is missing in a model. The `age` field in turn is one of two options: `biblical` (an integer from 1 to 1000) or `modern` (an integer from 1 to 100). What follows after the schema is a `human` model conforming to the above schema (a human named "Adam", using the default value for `first-words`, with a biblical age of 930).

### LDAP Data Interchange Format (LDIF)
Even though LDAP uses ASN.1 internally, and ASN.1 can be represented as text, there is a different textual representation for LDAP information called [LDAP Data Interchange Format (LDIF)](https://tools.ietf.org/html/rfc2849). Here's a sample:

```LDIF
dn: cn=Barbara J Jensen,dc=example,dc=com
cn: Barbara J Jensen
cn: Babs Jensen
objectclass: person
description: file:///tmp/babs
sn: Jensen
```

The two-letter attributes in the example above are:

- dn: distinguished name
- dc: domain component
- cn: common name
- sn: surname

LDIF can also be used as a means to perform operations:

```LDIF
dn: cn=Babs Jensen,dc=example,dc=com
changetype: modify
add: givenName
givenName: Barbara
givenName: babs
```

The examples above make it clear the distinguished name (DN) uniquely identifies an entry.

When talking about LDAP, LDIF is much more common than the alternatives. In fact, tools such as OpenLDAP use LDIF as input/output.

## Example: using LDAP from a C# client
.NET provides a convenient set of classes to access LDAP and Active Directory servers. Here are the relevant [.NET docs](https://msdn.microsoft.com/en-us/library/system.directoryservices.protocols.aspx). The following example has been tested against OpenLDAP 2.4. Get the [full code](https://github.com/auth0/blog-ldap-csharp-example).

The user model for our example includes fields for:

- uid: user id (name)
- ou: organizational unit
- userPassword: hashed user password
- objectClass: typical classes for user accounts

Note this is not the model for an Active Directory user. Active Directory users can be validated using the *bind* operation (see below).

### Validating user credentials using bind
In practice, credentials stored in a LDAP directory are validated using the *bind* operation. The bind operation means "log-in to a LDAP server using a specific set of credentials". If the bind operation succeeds, the credentials are valid. The mapping of a user to an actual entry in the LDAP directory is setup in the server configuration (Active Directory has specific rules for this, other LDAP servers leave this detail to the administrator).

```C#
/// <summary>
/// Another way of validating a user is by performing a bind. In this case the server
/// queries its own database to validate the credentials. It is defined by the server
/// how a user is mapped to its directory.
/// </summary>
/// <param name="username">Username</param>
/// <param name="password">Password</param>
/// <returns>true if the credentials are valid, false otherwise</returns>
public bool validateUserByBind(string username, string password)
{
    bool result = true;
    var credentials = new NetworkCredential(username, password);
    var serverId = new LdapDirectoryIdentifier(connection.SessionOptions.HostName);

    var conn = new LdapConnection(serverId, credentials);
    try
    {
        conn.Bind();
    }
    catch (Exception)
    {
        result = false;
    }
    
    conn.Dispose();

    return result;
}
```

### Validating user credentials manually
If you have full access to the credentials stored in the directory, you can compare the hashed passwords of your users to validate credentials. Note that this is NOT how Active Directory stores credentials. Users in an Active Directory server must be validated using the "bind" operation (using either this API or PrincipalContext, which we will discuss in the next post). See the previous example for information on how to perform a *bind operation* using this API.

```C#
/// <summary>
/// Searches for a user and compares the password.
/// We assume all users are at base DN ou=users,dc=example,dc=com and that passwords are
/// hashed using SHA1 (no salt) in OpenLDAP format.
/// </summary>
/// <param name="username">Username</param>
/// <param name="password">Password</param>
/// <returns>true if the credentials are valid, false otherwise</returns>
public bool validateUser(string username, string password)
{
    var sha1 = new SHA1Managed();
    var digest = Convert.ToBase64String(sha1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
    var request = new CompareRequest(string.Format("uid={0},ou=users,dc=example,dc=com", username), 
        "userPassword", "{SHA}" + digest);
    var response = (CompareResponse)connection.SendRequest(request);
    return response.ResultCode == ResultCode.CompareTrue;
}
```

### Establishing a connection
```C#
public Client(string username, string domain, string password, string url)
{
    var credentials = new NetworkCredential(username, password, domain);
    var serverId = new LdapDirectoryIdentifier(url);

    connection = new LdapConnection(serverId, credentials);
}
```

Connection parameters used for this example are:

- `username`: test
- `domain`: example.com
- `password`: test
- `url`: localhost:389

Check your server's configuration to pick the right connection parameters. If you are using LDAP + SASL, do not forget to set the right SASL params in the OpenLDAP config file. For instance, the following line tells OpenLDAP to use the SASL database directly.

```
sasl-auxprops sasldb
```

### Adding a user to the directory
```C#
/// <summary>
/// Adds a user to the LDAP server database. This method is intentionally less generic than the search one to
/// make it easier to add meaningful information to the database. 
/// NOTE: this is not an Active Directory user.
/// </summary>
/// <param name="user">The user to add</param>
public void addUser(UserModel user)
{
    var sha1 = new SHA1Managed();
    var digest = Convert.ToBase64String(sha1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(user.UserPassword)));

    var request = new AddRequest(user.DN, new DirectoryAttribute[] {
        new DirectoryAttribute("uid", user.UID),
        new DirectoryAttribute("ou", user.OU),
        new DirectoryAttribute("userPassword", "{SHA}" + digest),
        new DirectoryAttribute("objectClass", new string[] { "top", "account", "simpleSecurityObject" })
    });

    connection.SendRequest(request);
}
```

See the [full code](https://github.com/auth0/blog-ldap-csharp-example) for examples on searching, modifying and deleting entries.

## Aside: setting up Auth0 for LDAP use
At Auth0 we care about all our clients. If you have an existing LDAP deployment, you can integrate it with Auth0. LDAP deployments are usually installed inside a **corporate network**. In other words, they are *private*. Since they are private, there is no access to the LDAP server from the outside. Since our authentication solution works from the **cloud**, it is necessary to provide a means for the internal network to communicate with our servers. This is what we provide in the form of the [Active Directory/LDAP connector](https://auth0.com/docs/connector). This is a service that is installed in your network to provide a bridge between your LDAP server and our own servers in the cloud. Worry not! The connector uses an **outbound connection** to our servers so you don't need to set up special rules in your firewall.

![Auth0 + LDAP](https://cdn.auth0.com/blog/ldap/diagram__4.png)

To enable LDAP for your Auth0 apps, first go to `Connections` -> `Enterprise` -> `Active Directory / LDAP`. Follow the steps to setup the LDAP connector (you will need the LDAP server details) and then enable LDAP for your app.

<video width="600" autoplay loop>
    <source src="https://cdn.auth0.com/blog/ldap/Auth0LDAP2.webm" type="video/webm">
    <source src="https://cdn.auth0.com/blog/ldap/Auth0LDAP2.mp4" type="video/mp4">
    <img width="600" src="https://cdn.auth0.com/blog/ldap/auth0ldap.gif">
</video>

The following examples use the LDAP server setup for our C# example above.

### Auth0 + LDAP using our 'lock' library
Once you have enabled LDAP in the dashboard and setup the connector, you can follow the usual steps for our [lock library](https://auth0.com/docs/libraries/lock). Logging-in using an email and password just works!

Showing the login popup in your page is as easy as:

```javascript
// Initialize Auth0Lock with your `clientID` and `domain`
var lock = new Auth0Lock('xxxxxx', '<account>.auth0.com');

// and deploy it
var login = document.querySelector('a#login')

login.onclick = function (e) {
  e.preventDefault();
  lock.show(function onLogin(err, profile, id_token) {
    if (err) {
      // There was an error logging the user in
      return alert(err.message);
    }

    // User is logged in
  });
};
```

### Auth0 + LDAP using our REST API
If you cannot or don't want to use the *lock* library, you can log-in using our [RESTful API for database, passwordless and LDAP users](https://auth0.com/docs/auth-api#!#post--oauth-ro).

```
curl -H 'Content-Type: application/json' -X POST -d '{ "client_id":"FyFnhDX2kSqtpMZ6pGe6QpQuJmD7s4dj", "username":"test", "password":"test" }' https://speyrott.auth0.com/oauth/ro
```

## Conclusion
LDAP was designed as a lightweight protocol to access directory contents. As it evolved through the years it gained important features such as authentication and transport security. As a well defined means to get user information, it has found its way to small and big deployments. Its simplicity and openness have kept LDAP relevant through the years. Nowadays, single sign on systems can also work using LDAP. Fortunately, integrating LDAP to existing or new projects is easy. In our next post, we will focus on Active Directory specifics using the [PrincipalContext API](https://msdn.microsoft.com/en-us/library/system.directoryservices.accountmanagement.principalcontext.aspx). Stay tuned!

