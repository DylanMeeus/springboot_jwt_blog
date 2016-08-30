---
layout: post
title: "ASP.NET Core APIs on the fast-lane with Swagger and Autorest"
description: Document your ASP.NET Core Web APIs with Swagger and auto-generate authenticated clients quickly and easily with Autorest.
date: 2016-08-30 15:00
design:
  bg_color: "#000000"
  image: https://cdn.auth0.com/blog/aspnet-core-web-apis/swagger.png
author:
  name: Matías Quaranta
  url: http://twitter.com/ealsur
  mail: ealsur@ealsur.com.ar
  avatar: https://s.gravatar.com/avatar/7752008352217db815996ab04aec46e6?s=80
tags:
- asp.net core
- asp.net
- c#
- jwt
- autorest
- swagger
- authentication
related:
- 2016-06-03-add-auth-to-native-desktop-csharp-apps-with-jwt
- 2016-06-13-authenticating-a-user-with-linkedin-in-aspnet-core
---

---

**TL;DR:** Swagger is the most used API Specification Framework. In this article we'll guide you in creating Swagger-documented APIs and automatically-generated clients with Autorest. The full code is available at [this GitHub repository](https://github.com/ealsur/auth0swagger).

---

Since the very beginning, there has always been a way of **documenting** or describing your web-exposed services. Whether it was [SOAP](https://en.wikipedia.org/wiki/SOAP) on XML Web Services or Contracts for [WCF-enabled](https://msdn.microsoft.com/library/ms731082(v=vs.110).aspx) Services, there has always been some way to ease the complicated task of service-integration, but **what about REST APIs?**

## Enter Swagger

[Swagger](http://swagger.io/) is an [Open Source API Specification Framework](https://github.com/OAI/OpenAPI-Specification) that enables interactive documentation, discoverability and SDK generation over your existing REST API. Consisting mainly of a **Swagger.json** file which describes your API, this means that you don’t actually have to change anything in your current REST API methods and calls to take advantage of Swagger. There are [plenty of tools](http://swagger.io/tools/) to generate and consume a Swagger definition.

By the end of this article, and using a subset of these tools, you will be able to document and consume your APIs entirely on **ASP.NET Core**, speeding up integrations with any possible authenticated client.

## Tools of the trade

Since we will be working on ASP.NET Core (you can obtain the Runtime and Client tools [here](http://get.asp.net/) for any platform), everything I mention on this article will be Open Source, and at the end, you will have all the code available at the [Github repository](https://github.com/ealsur/auth0swagger).

As a starting point we will be using [Yeoman](http://yeoman.io/)’s [ASP.NET generator](https://github.com/OmniSharp/generator-aspnet). We could use a Visual Studio template or even run a `dotnet new`, but Yeoman is probably the most widely used scaffolding tool nowadays.

To **install Yeoman** you need an environment that has [npm](https://www.npmjs.com/) (Node.js Package Manager) which comes with the [Node.js runtime](https://nodejs.org/en/download/). Once that npm is available, installing Yeoman is simple as:

```bash
npm install -g yo
```

And installing ASP.NET generator with:

```bash
npm install --global generator-aspnet
```

For **code editing**, I’ll use [Visual Studio Code](https://code.visualstudio.com/), which can run on Windows, Mac or Linux.

We will also need [Autorest](https://github.com/Azure/autorest), a tool to auto-generate clients for Swagger-documented APIs, which can be obtained by [Nuget package](https://www.nuget.org/packages/autorest/), or [Chocolatey](https://chocolatey.org/) by running:

```bash
choco install autorest
```

Or alternatively as a Docker image with:

```bash
docker pull azuresdk/autorest:latest
```

## Gentlemen, start your engines

### Creating our API

Let’s start by creating our simple **ASPNET Core Web API**. On your command-line, run Yeoman’s generator:

```bash
yo aspnet
```

![Running Yeoman to create the API](https://cdn.auth0.com/blog/aspnet-core-web-apis/yo.PNG)

>The _Web API Application_ includes a _project.json_ with all the required dependencies set, a _Startup.cs_ file with the ASP.NET Core pipeline already configure for MVC routing and a sample _Controller_.

We can try _restoring_ and _running_ the API project to check if everything was created successfully with `dotnet restore`, `dotnet run` and opening a browser pointing to `http://localhost:5000/values`.

![Default API route](https://cdn.auth0.com/blog/aspnet-core-web-apis/api.PNG)

Once that’s done, we’ll proceed edit our App’s dependencies on the `project.json` file and add [Swashbuckle](https://github.com/domaindrivendev/Ahoy):

```json
"dependencies": {
    "Microsoft.NETCore.App": {
      "version": "1.0.0",
      "type": "platform"
    },
    "Microsoft.AspNetCore.Mvc": "1.0.0",
    "Microsoft.AspNetCore.Server.IISIntegration": "1.0.0",
    "Microsoft.AspNetCore.Server.Kestrel": "1.0.0",
    "Microsoft.Extensions.Configuration.EnvironmentVariables": "1.0.0",
    "Microsoft.Extensions.Configuration.FileExtensions": "1.0.0",
    "Microsoft.Extensions.Configuration.Json": "1.0.0",
    "Microsoft.Extensions.Configuration.CommandLine": "1.0.0",
    "Microsoft.Extensions.Options.ConfigurationExtensions": "1.0.0",
    "Swashbuckle": "6.0.0-beta901"    
  }
```

That will effectively extend our API to allow for automatic Swagger documentation generation, but first, we need to _configure_ it in the **ASP.NET Core pipeline**.

To achieve this, we go to our **Startup.cs** file and on the **ConfigureServices** method call the **AddSwaggerGen** extension:

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    /*Adding swagger generation with default settings*/
    services.AddSwaggerGen(options => {
        options.SingleApiVersion(new Info{
            Version="v1",
            Title="Auth0 Swagger Sample API",
            Description="API Sample made for Auth0",
            TermsOfService = "None"
        });
    });
}
```

Next, go to the **Configure** method (which is the one defining the pipeline) and call **UseSwagger** and **UseSwaggerUi**:

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    /*Enabling swagger file*/
    app.UseSwagger();
    /*Enabling Swagger ui, consider doing it on Development env only*/
    app.UseSwaggerUi();
   /*Normal MVC mappings*/
    app.UseMvc();
}
```

The first one will make sure that the route to your _Swagger.json_ file is handled correctly, the second one will handle routing to the Swagger UI, which will work, by default, on `http://localhost:5000/swagger/ui` (or `http://yourapidomain/swagger/ui`).

![SwaggerUI View](https://cdn.auth0.com/blog/aspnet-core-web-apis/swaggerui.PNG)

The Swagger UI is quite handy to test your methods and check their correct responses without needing tools like [Postman](https://www.getpostman.com/).

Our next step is to decorate our API methods so the Swagger documentation reflects the correct **object definitions**. This is quite easy since Swashbuckle automatically detects input objects. For output definition, just add the `[Produces]` and `[SwaggerResponse]` attributes describing the **Type** returned, like this:

```cs
[HttpGet("{id}", Name = "GetModel")]
[Produces(typeof(MyModel))]
[SwaggerResponse(System.Net.HttpStatusCode.OK, Type = typeof(MyModel))]
public IActionResult  Get(string id)
{
    return new ObjectResult(_repository.Get(id));
} 
```

And make sure to return an **ObjectResult**.

On the Swagger UI we will see this reflected as a _Model Schema_:

![Swagger Schema](https://cdn.auth0.com/blog/aspnet-core-web-apis/swaggeruiget.PNG)

### Securing our endpoints

In a real world scenario, you probably don’t want your API (or part of it) to be exposed publicly. We will now take advantage of **Auth0**’s authentication to secure our API with [Jwt Tokens](https://jwt.io/).

The first step is to add the [JwtBearer Nuget package](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer/) to our dependencies:

```json
"dependencies": {
"Microsoft.NETCore.App": {
    "version": "1.0.0",
    "type": "platform"
},
"Microsoft.AspNetCore.Mvc": "1.0.0",
"Microsoft.AspNetCore.Server.IISIntegration": "1.0.0",
"Microsoft.AspNetCore.Server.Kestrel": "1.0.0",
"Microsoft.Extensions.Configuration.EnvironmentVariables": "1.0.0",
"Microsoft.Extensions.Configuration.FileExtensions": "1.0.0",
"Microsoft.Extensions.Configuration.Json": "1.0.0",
"Microsoft.Extensions.Configuration.CommandLine": "1.0.0",
"Microsoft.Extensions.Options.ConfigurationExtensions": "1.0.0",
"Swashbuckle": "6.0.0-beta901",
"Microsoft.AspNetCore.Authentication.JwtBearer": "1.0.0"    
}
```

For our next step, you will need your **Auth0 ClientId and Domain** which you can obtain from your Dashboard:

![Getting our Auth0 credentials](https://cdn.auth0.com/blog/aspnet-core-web-apis/auth0credentials.PNG)

On the same Settings pane, go to the _Advanced Settings_ > _OAuth_ and set the **JWT Signature Algorithm** to **RS256**:

![Configuring JWT on Auth0](https://cdn.auth0.com/blog/aspnet-core-web-apis/auth0jwt.PNG)

Then, let’s modify our **ASP.NET Core pipeline** to include the Jwt Token authentication on the Configure method in your Startup.cs file:

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    /*Enabling swagger file*/
    app.UseSwagger();
    /*Enabling Swagger ui, consider doing it on Development env only*/
    app.UseSwaggerUi();
    /*It's important that this is AFTER app.UseSwagger or the swagger.json file would be innaccesible*/
    var options = new JwtBearerOptions
    {
        Audience = "Your_Auth0_ClientId",
        Authority = "Your_Auth0_Domain"
    };
    app.UseJwtBearerAuthentication(options);
    /*Normal MVC mappings*/
    app.UseMvc();
}
```

Finally, securing a Controller or Action is as simple as adding the `[Authorized]` attribute to it:

```cs
[Authorize]
[HttpGet("")]
[Produces(typeof(IEnumerable<MyModel>))]
[SwaggerResponse(System.Net.HttpStatusCode.OK, Type = typeof(IEnumerable<MyModel>))]
public IActionResult GetAll()
{
    return new ObjectResult(_repository.GetAll());
}
```

And that’s it! Your API is **secured** and only clients authenticated by Auth0 can access it.

>For more information on securing an ASP.NET Core Web API with Auth0, please refer to the [Auth0 ASP.NET Core Web API Quickstart](https://auth0.com/docs/quickstart/backend/aspnet-core-webapi)

### Streamlining clients

Next, we’ll create an **authenticated client** that can access our API easily through an auto-generated proxy.

Using Yeoman one more time, we’ll create a **Web Application Basic**:

![Creating a Web App with Yeoman](https://cdn.auth0.com/blog/aspnet-core-web-apis/yoweb.PNG)

This creates a simple ASP.NET Core MVC Web application you can try by running `dotnet restore` and `dotnet run` on the created folder (you can also follow these steps with a pre-existing ASP.NET Core application).

We’ll open a **Command Prompt** on the application’s folder and use **Autorest** to create a client as easily as running:

```bash 
autorest -Input http://your_api_domain/swagger/v1/swagger.json -OutputDirectory Api -AddCredentials true
```

The _AddCredentials_ toggle will tell Autorest that our Api needs to send authentication information on the requests, _Input_ points to the running Api swagger file (it needs to be a running or deployed Api) and _OutputDirectory_ tells Autorest where to put the automatically created files.

If you browse that folder, you’ll find two important files, the wrapper Api class, which has all the necessary methods to call all your Api routes and actions, and an Interface:

![Autorest results](https://cdn.auth0.com/blog/aspnet-core-web-apis/autorestresult.PNG)

The interface is useful if you want to use [Dependency Injection](https://docs.asp.net/en/latest/fundamentals/dependency-injection.html) in your ASP.NET Core client application.

After generating our client, Autorest will let you know that you will need the [Microsoft.Rest.ClientRuntime](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime/) Nuget package on our dependencies.

### Locking it down with Auth0 

Since our API is authenticating users from our Auth0 account, we’ll add [Auth0’s Lock](https://auth0.com/lock) to our Web application to obtain credentials that can be passed on to the API.

First, let’s add the required Nuget packages, [Microsoft.AspNetCore.Authentication.OpenIdConnect](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.OpenIdConnect/) and [Microsoft.AspNetCore.Authentication.Cookies](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.Cookies/), which results in a `project.json` file with the dependencies:

```json
"dependencies": {
"Microsoft.NETCore.App": {
    "version": "1.0.0",
    "type": "platform"
},
"Microsoft.AspNetCore.StaticFiles": "1.0.0",
"Microsoft.AspNetCore.Mvc":"1.0.0",
"Microsoft.AspNetCore.Diagnostics": "1.0.0",
"Microsoft.AspNetCore.Server.IISIntegration": "1.0.0",
"Microsoft.AspNetCore.Server.Kestrel": "1.0.0",
"Microsoft.Extensions.Configuration.EnvironmentVariables": "1.0.0",
"Microsoft.Extensions.Configuration.FileExtensions": "1.0.0",
"Microsoft.Extensions.Configuration.Json": "1.0.0",
"Microsoft.Extensions.Options.ConfigurationExtensions": "1.0.0",
"Microsoft.Rest.ClientRuntime":"2.2.0",
"Microsoft.AspNetCore.Authentication.OpenIdConnect": "1.0.0",
"Microsoft.AspNetCore.Authentication.Cookies": "1.0.0"
}
```

Then, we’ll setup authentication on our **Startup.cs** file by adding the Cookie scheme to **ConfigureServices**:

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthentication(
        options => options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme);
    services.AddMvc();
}
```

And setting up the pipeline on the **Configure** method:

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env, IOptions<Auth0Settings> auth0Settings)
{
    app.UseStaticFiles();
    app.UseDeveloperExceptionPage();
    /*Adding cookie auth*/
    app.UseCookieAuthentication(new CookieAuthenticationOptions
    {
        AutomaticAuthenticate = true,
        AutomaticChallenge = true
    });
    /*This should be BEFORE app.UseMvc to have priority on the pipeline*/
    app.UseOpenIdConnectAuthentication(new OpenIdConnectOptions("Auth0")
    {
        // Set the authority to your Auth0 domain
        Authority = "https://YOUR_AUTH0_DOMAIN",

        // Configure the Auth0 Client ID and Client Secret
        ClientId = "YOUR_AUTH0_CLIENTID",
        ClientSecret = "YOUR_AUTH0_SECRET",

        // Do not automatically authenticate and challenge
        AutomaticAuthenticate = false,
        AutomaticChallenge = false,

        // Set response type to code
        ResponseType = "code",

        // Set the callback path, so Auth0 will call back to http://localhost:5000/signin-auth0 
        // Also ensure that you have added the URL as an Allowed Callback URL in your Auth0 dashboard 
        CallbackPath = new PathString("/signin-auth0"),

        // Configure the Claims Issuer to be Auth0
        ClaimsIssuer = "Auth0",

        // Saves tokens to the AuthenticationProperties
        SaveTokens = true,

        Events = new OpenIdConnectEvents()
        {
            OnTicketReceived = context =>
            {
                // Get the ClaimsIdentity
                var identity = context.Principal.Identity as ClaimsIdentity;
                if (identity != null)
                {
                    // Check if token names are stored in Properties
                    if (context.Properties.Items.ContainsKey(".TokenNames"))
                    {
                        // Token names a semicolon separated
                        string[] tokenNames = context.Properties.Items[".TokenNames"].Split(';');

                        // Add each token value as Claim
                        foreach (var tokenName in tokenNames)
                        {
                            // Tokens are stored in a Dictionary with the Key ".Token.<token name>"
                            string tokenValue = context.Properties.Items[$".Token.{tokenName}"];

                            identity.AddClaim(new Claim(tokenName, tokenValue));
                        }
                    }
                }

                return Task.FromResult(0);
            }
        }
    });
    app.UseMvcWithDefaultRoute();
}
```

The next step is to add a **Login route**, as an example, we could use an AccountController and Login method:

```cs
public IActionResult Login(string returnUrl = "/")
{
    return new ChallengeResult("Auth0", new AuthenticationProperties() { RedirectUri = returnUrl });
}
```

Finally, we need to setup on our **Auth0 account** the **authorized callback Urls**, this is found in your Dashboard > Settings section and should point to your Web applications running domain, if you are trying it locally, remember to add a line for http://localhost too along with your deployed domain:

![Configuring Auth0 Callback Urls](https://cdn.auth0.com/blog/aspnet-core-web-apis/auth0callback.PNG)

>For a more detailed and in-depth guide on authentication for ASP.NET Core Web Apps, visit the [ASP.NET Core SDK Quickstart](https://auth0.com/docs/quickstart/webapp/aspnet-core)

Now, going back to our App and browsing the _Login_ url (http://your_site/account/login or http://localhost:yourport/account/login), we should be redirected to the Auth0 Lock:

![Logging with Auth0 Lock](https://cdn.auth0.com/blog/aspnet-core-web-apis/auth0lock.PNG)

### Passing up the credentials

Now we have a running Web Application with an authenticated user that needs to call our secured Web API, passing up the credentials is extremely easy!

Let’s say we want to call our API from an MVC Action that would list all the values from the API. First, we obtain the token from the current logged in user with:

```cs
User.Claims.First(x=>x.Type == "id_token").Value
```

And create credentials with it:

```cs
 var auth = new Microsoft.Rest.TokenCredentials(User.Claims.First(x=>x.Type == "id_token").Value);
```

Finally, we use our _Autorest generated client_ to easily obtain the information and pass the credentials:

```cs
[Authorize]
public async Task<IActionResult> List()
{J
    var auth = new Microsoft.Rest.TokenCredentials(User.Claims.First(x=>x.Type == "id_token").Value);
    var api = new Auth0SwaggerSampleAPI(new Uri("http://localhost:5000"), auth); 
    return View(await api.ValuesGetAsync());
}
```

_And that’s it!_ We don’t need to mess with headers and serialization, the **Autorest code will handle everything for you**.

## Conclusion

Documenting our Web APIs with Swagger enables rapid client generation with Autorest, which supports a wide variety of languages. Imagine how easily it would be to create **multi-client scenario** by running Autorest to create a client for your Web App in C# and a client for your Android app in Java or by simply allowing any customer to create a client in its preferred language.

The [entire code of this guide is available on Github](https://github.com/ealsur/auth0swagger), with a sample Web API and Web application you can use by just setting your Auth0 account information on the configuration files.
