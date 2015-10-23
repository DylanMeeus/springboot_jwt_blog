---
layout: post
title: "Using LDAP with C#"
description: "Learn about LDAP and how to integrate it in your C# projects"
date: 2015-10-23 09:00
author: 
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#596D5F"
  image: https://cdn.auth0.com/blog/ldap/logo.png
  image_size: "110%"
  image_bg_color: "#596D5F"
  blog_series: true
tags: 
- ldap
- lightweight directory access protocol
- c#
- single sign on
- sso
- post-series
---

In this post series we will study the [Lightweight Directory Access Protocol (LDAP)](https://tools.ietf.org/html/rfc4511). LDAP was developed in the '90s as an open, simpler alternative to other directory protocols. In this post we will study what you can do with it and how to integrate it in your C# applications. Read on!

-----

## What is LDAP?
LDAP is a protocol defining a series of operations through which you can access information that is part of a **directory**. A directory is a tree containing a set of **attributes** associated with a unique identifier (or primary key). If you are familiar with document based databases this may sound familiar. The primary key is usually a **name**. This means that LDAP is perfectly suited as a **user information database**. Even though most of the time it is used as a user directory, LDAP is perfectly suited as a generic information sharing service.

![LDAP's tree-structured attributes](https://cdn.auth0.com/blog/ldap/ldap-tree.png)

One common use of LDAP is as part of **single-sign-on (SSO)** systems. If you are not familiar with SSO, read our introduction to SSO [here](https://auth0.com/blog/2015/09/23/what-is-and-how-does-single-sign-on-work/).

The following diagram shows how a simple SSO system can work using LDAP. The diagram shows a simplified [Microsoft Active Directory](https://en.wikipedia.org/wiki/Active_Directory) configuration using LDAP. Active Directory stores user information in a LDAP server. When a user attempts to login to his or her Windows PC, Windows validates the login information against the LDAP/Active Directory server.

![LDAP-based Microsoft Active Directory](https://cdn.auth0.com/blog/ldap/active-directory.png)

## Protocol overview
The best way of understanding a protocol is getting your hands a bit dirty and learning its inner workings. Fortunately, barring binary encoding details and other low-level stuff, LDAP is a fairly simple protocol. LDAP defines a series of **operations** that are available to clients. Clients can connect to two types of servers:

- **Directory System Agent (DSA):** a server which allows LDAP operations
- **Global Catalog:** a special type of server that stores reduced sets of replicated information from other servers to speed-up cross-DSA searches.

Clients may perform requests to the server. In turn, the server may answer those requests **asynchronously**. Certain types of operations are synchronous. Additionaly, the server may send special messages to the clients even when there are no pending requests that require a response. All information is encoded using **ASN.1** (see below for more details). TLS and/or SASL may be used to ensure privacy and perform authentication.

![LDAP is an asynchronous protocol](https://cdn.auth0.com/blog/ldap/ldap-async-2.png)

### Supported operations
Common operations supported by LDAP are:

- Search for specific entries
- Test if a given attribute is present and has the specified value
- Add/modify/delete entries
- Move an entry to a different path

Furthermore, additional protocol management operations are defined (connect, disconnect, negotiate protocol version, etc.).

### ASN.1 and BER encoding
All operations are performed using messages encoded in Abstract Syntax Notation One (ASN.1) format using Basic Encoding Rules (BER). ASN.1 is defined in [ITU standard X.680](http://www.itu.int/itu-t/recommendations/rec.aspx?rec=x.680) while BER and other encodings are part of [ITU standard X.690](https://www.itu.int/rec/T-REC-X.690/en).

ASN.1 defines a series of **datatypes** (such as integer, string, etc.), a textual format description (schema) and a textual representation of values. BER, on the other hand, defines a **binary encoding** for ASN.1. BER is a traditional tag-length-value encoding. For a nice summary of BER encoding, see [here](https://en.wikipedia.org/wiki/X.690#BER_encoding).

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
.NET provides a convenient set of classes to access LDAP and Active Directory servers. You can find the docs [here](https://msdn.microsoft.com/en-us/library/system.directoryservices.protocols(v=vs.110).aspx). The following example has been tested against OpenLDAP 2.4.

The user model for our example includes fields for:

- uid: user id (name)
- ou: organizational unit
- userPassword: hashed user password
- objectClass: typical classes for user accounts

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
/// </summary>
/// <param name="user">The user to add</param>
public void addUser(UserModel user)
{
    var request = new AddRequest(user.DN, new DirectoryAttribute[] {
        new DirectoryAttribute("uid", user.UID),
        new DirectoryAttribute("ou", user.OU),
        new DirectoryAttribute("userPassword", user.UserPassword),
        new DirectoryAttribute("objectClass", new string[] { "top", "account", "simpleSecurityObject" })
    });

    connection.SendRequest(request);
}
```

### Searching in the directory
```C#
/// <summary>
/// Performs a search in the LDAP server. This method is generic in its return value to show the power
/// of searches. A less generic search method could be implemented to only search for users, for instance.
/// </summary>
/// <param name="baseDn">The distinguished name of the base node at which to start the search</param>
/// <param name="ldapFilter">An LDAP filter as defined by RFC4515</param>
/// <returns>A flat list of dictionaries which in turn include attributes and the distinguished name (DN)</returns>
public List<Dictionary<string, string>> search(string baseDn, string ldapFilter)
{
    var request = new SearchRequest(baseDn, ldapFilter, SearchScope.Subtree, null);
    var response = (SearchResponse)connection.SendRequest(request);

    var result = new List<Dictionary<string, string>>();

    foreach(SearchResultEntry entry in response.Entries)
    {
        var dic = new Dictionary<string, string>();
        dic["DN"] = entry.DistinguishedName;

        foreach (string attrName in entry.Attributes.AttributeNames)
        {
            //For simplicity, we ignore multi-value attributes
            dic[attrName] = string.Join(",", entry.Attributes[attrName].GetValues(typeof(string)));
        }

        result.Add(dic);
    }

    return result;
}
```
### Modifying an entry
```C#
/// <summary>
/// This method shows how to modify an attribute.
/// </summary>
/// <param name="oldUid">Old user UID</param>
/// <param name="newUid">New user UID</param>
public void changeUserUid(string oldUid, string newUid)
{
    var oldDn = string.Format("uid={0},ou=users,dc=example,dc=com", oldUid);
    var newDn = string.Format("uid={0},ou=users,dc=example,dc=com", newUid);

    DirectoryRequest request = new ModifyDNRequest(oldDn, "ou=users,dc=example,dc=com", "uid=" + newUid);
    connection.SendRequest(request);

    request = new ModifyRequest(newDn, DirectoryAttributeOperation.Replace, "uid", new string[] { newUid });
    connection.SendRequest(request);
}
```

### Deleting an entry
```C#
/// <summary>
/// This method shows how to delete anything by its distinguised name (DN).
/// </summary>
/// <param name="dn">Distinguished name of the entry to delete</param>
public void delete(string dn)
{
    var request = new DeleteRequest(dn);
    connection.SendRequest(request);
}
```

Get the [full code](https://github.com/auth0/blog-ldap-csharp-example).

## Aside: setting up Auth0 for LDAP use
At Auth0 we care about all our clients. If you have an existing LDAP deployment, you can integrate it with Auth0. LDAP deployments are usually installed inside a **corporate network**. In other words, they are *private*. Since they are private, there is no access to the LDAP server from the outside. Since our authentication solution works from the **cloud**, it is necessary to provide a means for the internal network to communicate with our servers. This is what we provide in the form of the [Active Directory/LDAP connector](https://auth0.com/docs/connector). This is a service that is installed in your network to provide a bridge between your LDAP server and our own servers in the cloud. Worry not! The connector uses an **outbound connection** to our servers so you don't need to set up special rules in your firewall.

![Auth0 + LDAP](https://cdn.auth0.com/docs/media/articles/connections/enterprise/active-directory/ldap-connect.png)

To enable LDAP for your Auth0 apps, first go to `Connections` -> `Enterprise` -> `Active Directory / LDAP`. Follow the steps to setup the LDAP connector (you will need the LDAP server details) and then enable LDAP for your app.

![Auth0 dashboard + LDAP](https://cdn.auth0.com/blog/ldap/auth0-dashboard-ldap.jpg)

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
LDAP was designed as a lightweight protocol to access directory contents. As it evolved through the years it gained important features such as authentication and transport security. As a well defined means to get user information, it has found its way to small and big deployments. Its simplicity and openness have kept LDAP relevant through the years. Nowadays, single sign on systems can also work using LDAP. Fortunately, integrating LDAP to existing or new projects is easy. In our next post, we will show you how to access LDAP from Java client. Stay tuned!

