---
layout: post
title: "A New Android Sample"
date: 2013-06-20 21:18
author: 
  name: Eugenio Pace
  mail: eugeniop@auth0.com
  url: http://twitter.com/eugenio_pace
  avatar: https://secure.gravatar.com/avatar/702d07476c482418b948b911504137a5?s=60
---

{% excerpt %} 
A new sample is now available on [our repo](https://github.com/auth0/Auth0-Android-Sample) for Android developers. The sample demonstrates integration with Auth0 for authentication and uses the standard techinque of delegating the authentication process to an embeded web view (extending the `WebViewClient` class).

All interactions are encapuslated in an `Activity` that you can call like in this example below:

```java
Button login = (Button) findViewById(R.id.login);
login.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        Intent authActivity = new Intent(MainActivity.this,
                com.auth0.sdk.auth0sample.AuthenticationActivity.class);

        AuthenticationActivitySetup setup;
        setup = new AuthenticationActivitySetup(Tenant, ClientID, Callback, Connection);

        authActivity.putExtra(AuthenticationActivity.AUTHENTICATION_SETUP, setup);

        startActivityForResult(authActivity, AuthenticationActivity.AUTH_REQUEST_COMPLETE);
    }
});
```
{% endexcerpt %}

The result is returned using the standard method of overriding the `onActivityResult` method:

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent authActivityResult) {
    super.onActivityResult(requestCode, resultCode, authActivityResult);

    switch(requestCode)
    {
        case AuthenticationActivity.AUTH_REQUEST_COMPLETE:
            if(resultCode==RESULT_OK)
            {
                AuthenticationActivityResult result;
                result = (AuthenticationActivityResult) authActivityResult.getSerializableExtra(AuthenticationActivity.AUTHENTICATION_RESULT);

                ((TextView) findViewById(R.id.access_token)).setText(result.accessToken);
                ((TextView) findViewById(R.id.jwt)).setText(result.JsonWebToken);
            }
            break;
    }
}
```

The `AuthenticationActivityResult` class is just a container for the two tokens you can use to call APIs:

```java
public class AuthenticationActivityResult implements Serializable {
    public String accessToken;
    public String JsonWebToken;
}
```

If your app in Auth0 is created as __Windows Azure Mobile Services__:

![](https://puu.sh/3kCLH.png)

Then the Json Web Token will be compatible with what __Mobile Services__ expects.

An end tutorial is available [here](https://docs.auth0.com/android-tutorial).

> We are working on a similar sample using Xamarin. Stay tuned!

[Try Auth0 yourself!](http://developers.auth0.com)