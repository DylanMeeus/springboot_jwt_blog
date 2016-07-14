---
layout: post
title: "Using Azure Services without a Backend"
description: "Access Azure Storage APIs securely from browsers (i.e. using JavaScript) or native apps, without the need of a backend server."
date: 2015-02-10 09:00
author:
  name: Nathan Totten
  url: http://twitter.com/ntotten
  avatar: https://www.gravatar.com/avatar/d48b998c2dce49ca309710eba498c562.png?s=60
design:
  bg_color: "#006083"
  image: https://cldup.com/OpoAQoUwkK.png
  image_size: "150%"
  image_bg_color: none
tags:
- azure
- delegation
- spa
- login
related:
- 2014-01-27-ten-things-you-should-know-about-tokens-and-cookies
- 2015-12-17-json-web-token-signing-algorithms-overview
- 2016-04-15-angularjs-authentication-screencast-series-part-1
---

**TL;DR**: you can access Azure Storage APIs securely from browsers (i.e. using JavaScript) or native apps, without the need of a backend server. Live demo @ <http://auth0.github.io/auth0-azure-blob-sample/>

---

Today’s modern cloud provides developers with a rich choice of building blocks for creating new and innovative applications faster than ever before. Utilizing Auth0, developers can build applications that are secure and scalable without the need for a traditional backend server. This significantly reduces your time to release as well as the cost of maintenance over the life of your application.

In this post you will see an example of how you can use Auth0 and the near infinite scale of Azure Blob Storage to build a rich and secure client application without a traditional backend. This example is built entirely in HTML/JavaScript and runs in the browser while still providing secure, authenticated access to resources in Azure Blob Storage.

<!-- more -->

Below you will find a simple diagram showing how this application will work. Notice that the browser app only communicates either with Auth0 or with blob storage directly. We don’t need backend server helping with security – Auth0 does this for us.

<div style="text-align: center"><img src="https://cloudup.com/cpLqCchdjHP+"></div>

## Logging In

Authenticating with Auth0 is a breeze. To log the user in we will use the Auth0 Lock widget. After the user clicks through to login the callback will be returned and we can take the token and profile data and store them in the browser's local storage. After the data is stored, we redirect the user to the files.html page.

```js

var lock = new Auth0Lock(window.config.clientId, window.config.domain);

document.getElementById('btn-login').addEventListener('click', function() {
  lock.show({ popup: true }, function(err, profile, token) {
    if (err) {
      // Error callback
      alert('There was an error');
    } else {
      // Success calback

      // Save the JWT token.
      store.set('azure_sample_id_token', token);

      // Save the profile
      store.set('azure_sample_profile', JSON.stringify(profile));

      location.href = 'files.html';
    }
  });
});
```

## Retrieving the Azure Storage SAS Token
Auth0 integrates with a variety of identity providers as well as a number of additional services we call addons. We support a variety of addons such as [Firebase](https://auth0.com/docs/server-apis/firebase), [Salesforce](https://auth0.com/docs/server-apis/salesforce), [Azure Service Bus](https://auth0.com/docs/server-apis/azure-sb), and [Azure Storage](https://auth0.com/docs/server-apis/azure-blob-storage). You can use these addons to exchange your traditional user tokens for API specific tokens – in our example, we will use our JWT token issued by Auth0 for a Azure Blob SAS token in order for the browser client to securely read and write to storage.

```js
auth0.getDelegationToken({
  id_token: current_id_token,
  scope: "openid",
  api_type: "azure_blob",
  containerName: id_hash + "my-container-name"
}, function(err, delegationResult) {
  callback(delegationResult.azure_blob_sas);
});
```

## Rules
In addition to simply exchanging tokens we can use a feature in Auth0 called [Rules](https://auth0.com/docs/rules) to fully control user access to containers and blobs. Rules are Javascript functions that run on Auth0 in response to various authentication events. You can use rules to completely customize how authentication works inside your application.

In our example, I am simply limiting each user to a single blob that they own, but you could image that we could build a rich role-based access list for users to provide fine-grained control over storage resources. You can see the code for our rule below. Notice how we are using the Azure Storage SDK inside of the rule to check if containers exist and create new containers.

```js
function(user, context, callback) {

  var CLIENT_ID = "your_client_id_here";

  // Only run this rule for the correct app and for azure_blob delegations
  if (!(context.clientID === CLIENT_ID &&
        context.isDelegation &&
        context.request.body.api_type === 'azure_blob')) {
    return callback(null, user, context);
  }

  var blobName = context.request.body.blobName;
  var containerName = context.request.body.containerName;

  // Get user id hash
  var shasum = crypto.createHash('sha1');
  shasum.update(user.user_id);
  var hash = shasum.digest('hex');

  // Check to make sure the container belongs to the user
  if (containerName !== hash) {
    return callback(new UnauthorizedError('Not authorized.'));
  }

  // For blob requests, we are done
  if (blobName) {
    return callback(null, user, context);
  }

  var blobService = azure_storage.createBlobService(
    configuration.AZURE_STORAGE_ACCOUNT_NAME,
    configuration.AZURE_STORAGE_ACCOUNT_KEY);

  // For container list operations, ensure the container exists
  blobService.createContainerIfNotExists(containerName,
  function(error, result, response) {
    if (error) {
      return callback(error);
    }
    return callback(null, user, context);
  });  
}
```

## List Blobs in Container
Once we have our container’s SAS token, our browser app can make a request directly to Azure Blob storage to list the contents of the blob.

```js
var url = 'https://blobshare.blob.core.windows.net/' + containerName +
  '?' + sasToken + '&restype=container&comp=list';
$.ajax({
  url: url,
  type: "GET",
  success: function(data, status) {
    var model = convertResponseToModel(data);
    callback(null, model);
  },
  error: function(xhr, desc, err) {
    callback(err);
  }
});
```


## Upload a Blob
Because we want to be able to handle large files we are going to upload our file as a block blob. This allows the browser to make multiple requests to upload small chunks of a large file. This way, if one request fails we simply have to retry a small request rather than retry the entire upload. This means our browser app can handle uploads of very large sizes efficiently.

Once again, we will call our Auth0 delegation endpoint to exchange our auth token for an azure blob sas token. This token will be for a particular blob rather than a container. Because the code for uploading a blob in blocks is quite long I won’t put a snippet here. You can find a great reference on how to do that on [Gaurav Mantri’s blog](http://gauravmantri.com/2013/02/16/uploading-large-files-in-windows-azure-blob-storage-using-shared-access-signature-html-and-javascript/).

## Resources
Now that we have walked through the steps of building a secure client-only application with Azure Storage and Auth0 you can try out the [running application](http://auth0.github.io/auth0-azure-blob-sample/) yourself. Additionally, you can find the [full source](https://github.com/auth0/auth0-azure-blob-sample) on Github and [additional documentation](https://auth0.com/docs/server-apis/azure-blob-storage) about using Auth0 and Blob storage.

<div class="try-banner try-code" style="margin: 0">
    <a href="https://github.com/auth0/auth0-azure-blob-sample" target="_new" class="btn btn-default btn-lg"><i class=" icon-1392070209-icon-social-github icon"></i>Code</a>
    <a href="http://auth0.github.io/auth0-azure-blob-sample/" target="_new" class="btn btn-default btn-lg"><i class=" icon-budicon-698 icon"></i>Demo</a>
</div>

## Summary
I hope this post gave you an understanding of some of the awesome things you can do with Auth0 and the modern cloud. Be sure to sign up for your [free developer account](https://auth0.com/pricing) and check out our [quick start guides](https://auth0.com/docs). If you have any questions you can reach our entire team on [chat.auth0.com](http://chat.auth0.com/) or [@Auth0](http://twitter.com/auth0).
