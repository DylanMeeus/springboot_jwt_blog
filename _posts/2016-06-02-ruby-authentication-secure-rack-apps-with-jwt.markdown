---
layout: post
title: "Ruby Authentication: Secure Your Rack Application with JWT"
description: JSON Web Tokens (JWT) provide an easy way to add authentication to Ruby apps. Learn all about how to secure your Rack API!
date: 2016-06-02 8:30
alias: /2016/06/02/ruby-authentication-secure-rack-apps-with-jwt/
author:
  name: Alex Sears
  url: http://twitter.com/searsaw
  mail: alexwsears@gmail.com
  avatar: "https://s.gravatar.com/avatar/6c0654e56c8c73ffee8f76fe03d18ccf?s=80"
design:
  bg_color: "#240B0D"
  image: https://cdn.auth0.com/blog/ruby-auth-with-jwt/logo.png
tags:
- ruby
- rack
- sinatra
- jwt
- apis
---

Early on in my career, when I was a wee little junior dev, learning Ruby on Rails and looking to impress, I came across an issue that is all too common these days. How do I authenticate a request with an API when the consuming client is a browser? This is a problem that will need to be solved if you are building a single page application.  At the time, I thought a single numeric "API token" that was returned to the user when they logged in was enough. Looking back, I realize how dumb of a move this was. It's extremely insecure!

Recently, I have been reading that [JSON Web Tokens](https://auth0.com/learn/json-web-tokens/) (also written as JWTs and pronounced "jots") are the way to go when authenticating with an API. If you haven't heard of JWTs, check out [the website](https://jwt.io/) and [read this blog post on using them with APIs](https://auth0.com/blog/2014/12/02/using-json-web-tokens-as-api-keys/). They make authenticating a user securely very easy.

Today, we are going to explore using JWTs in a Ruby environment, specifically with Rack apps. This includes Rails and Sinatra applications. Let's get to it! Create a new directory for this project and move into it.

```
mkdir ruby-jwt-api
cd ruby-jwt-api
```

First, let's setup the basic API itself. Create a `Gemfile` with the following in it.

```
source "https://rubygems.org"

gem 'sinatra'
gem 'jwt'
gem 'json'
```

Then, run `bundle`. If you don't already have bundler installed, run `gem install bundler`. This will install the dependencies we need. Next we need to create our `config.ru` file to run our Sinatra application.  Put the following in a file called `config.ru`.

```
require File.expand_path '../main.rb', __FILE__

run Rack::URLMap.new({
  '/' => Public,
  '/api' => Api
})
```

Here we are loading a file called `main.rb` and then setting up a new Rack application and running it. We create the application this way so we can put our JWT protection on only the API routes and not the public routes. We are loading the file, but we haven't created it yet! Let's do that. Create a file called `main.rb` and put the following in it.

```
require 'json'
require 'jwt'
require 'sinatra/base'

class Api < Sinatra::Base

  def initialize
    super

    @accounts = {
      tomdelonge: 10000,
      markhoppus: 50000,
      travisbarker: 1000000000
    }
  end

  get '/money' do
    content_type :json
    { message: "Hello, World!" }.to_json
  end
end

class Public < Sinatra::Base

  def initialize
    super

    @logins = {
      tomdelonge: 'allthesmallthings',
      markhoppus: 'therockshow',
      travisbarker: 'whatsmyageagain'
    }
  end

  post '/login' do
    username = params[:username]
    password = params[:password]

    if @logins[username.to_sym] == password
      content_type :json
      { message: "You logged in. Yay you!" }.to_json
    else
      halt 401
    end
  end

end
```

This code sets up our two application routes. The only public route we have right now is `/login`. It authenticates a user based on a username and password. Currently, it just returns a confirmation message. This is where we will eventually return a JWT the user can use to authenticate with the API. The API only has one route for now also called `/money`. It returns a simple message now too. Notice, we have hardcoded the values for our users. Normally this would come from a database of some sort.

Run `rackup` on the command line to start the server. Here are what our responses look like if we hit each of these endpoints. We hit the login route and get a success...

![First successful hit to the server endpoint](https://cdn.auth0.com/blog/ruby-auth/first_successful_hit.png)

...hit the login route and get an error...

![First unsuccessful hit to the server endpoint](https://cdn.auth0.com/blog/ruby-auth/first_unsuccessful_hit.png)

...and hit the `/api/money` route to make sure our routing works correctly.

![First Successful API Hit](https://cdn.auth0.com/blog/ruby-auth/first_successful_api_hit.png)

Now that we know our endpoints are working, let's add authentication and authorization using JWTs. We need to make sure that when we log our user in, we return a JWT so the user can use it to authenticate in the future.

```
post '/login' do
  username = params[:username]
  password = params[:password]

  if @logins[username.to_sym] == password
    content_type :json
    { token: token(username) }.to_json
  else
    halt 401
  end
end

def token username
  JWT.encode payload(username), ENV['JWT_SECRET'], 'HS256'
end

def payload username
  {
    exp: Time.now.to_i + 60 * 60,
    iat: Time.now.to_i,
    iss: ENV['JWT_ISSUER'],
    scopes: ['add_money', 'remove_money', 'view_money'],
    user: {
      username: username
    }
  }
end
```

Let's analyze this. We have changed what happens on a successful login. We set the content type to JSON and then return a Hash that has the token in it.

The token is generated by calling the `token` method and passing it the username. `token` uses [the jwt gem](https://github.com/jwt/ruby-jwt) to create an encoded JWT. It takes the payload, the secret, and the algorithm we want to use to sign the token. Our `token` method calls another method we created called `payload` which simply returns a Hash that contains all the data we want in our token payload.

Some things to note about the payload. It has an expiration date, which will be verified later. We also give it an issuer that we can verify later, a set of scopes that this token allows a user to do, and some data about our user. A sample response would look like this.

Restart your server. Make sure to pass the environment variables to it when you run it like so.

```
JWT_SECRET=someawesomesecret JWT_ISSUER=moneyapi.com rackup
```

![Retrieving a Successful JSON Web Token](https://cdn.auth0.com/blog/ruby-auth/successful_token.png)

We have our first token! Yay! Notice how I have passed two environment variables on the command line. It's a good practice to pass these sorts of values in environment variables to avoid hardcoding them in our source code. These variables are used when creating (and later validating) our tokens.

Now we need to create a piece of middleware that will validate our token and then add the scopes and user data from the token to the request environment. This will allow us to access this information in our API routes. Add the following to our `main.rb` file.

```
class JwtAuth

  def initialize app
    @app = app
  end

  def call env
    begin
      options = { algorithm: 'HS256', iss: ENV['JWT_ISSUER'] }
      bearer = env.fetch('HTTP_AUTHORIZATION', '').slice(7..-1)
      payload, header = JWT.decode bearer, ENV['JWT_SECRET'], true, options

      env[:scopes] = payload['scopes']
      env[:user] = payload['user']

      @app.call env
    rescue JWT::DecodeError
      [401, { 'Content-Type' => 'text/plain' }, ['A token must be passed.']]
    rescue JWT::ExpiredSignature
      [403, { 'Content-Type' => 'text/plain' }, ['The token has expired.']]
    rescue JWT::InvalidIssuerError
      [403, { 'Content-Type' => 'text/plain' }, ['The token does not have a valid issuer.']]
    rescue JWT::InvalidIatError
      [403, { 'Content-Type' => 'text/plain' }, ['The token does not have a valid "issued at" time.']]
    end
  end

end
```

This is a simple Rack middleware setup. In the `call` method, we get the `HTTP_AUTHORIZATION` value out of the environment hash, which represents the `Authorization` header in the request.  We use `fetch` so we get a string if `HTTP_AUTHORIZATION` doesn't exist and then use `slice` to prevent throwing an error if the string indexes we want don't exist. This will strip off the "Bearer: " part of the `Authorization` header. We then decode the JWT and add the scopes and user data to the environment hash. Lastly, we call the next part in our middleware stack and pass it our modified environment.

We have wrapped this code in a `begin, rescue`. This is because the `jwt` gem will throw different exceptions for each thing that may be wrong with it, such as the validation not passing. We catch each one and return a good error message for it.

Now that we have the data available on our request environment, let's use it in our API route.

```
class Api < Sinatra::Base

  use JwtAuth

  def initialize
    super

    @accounts = {
      tomdelonge: 10000,
      markhoppus: 50000,
      travisbarker: 1000000000
    }
  end

  get '/money' do
    scopes, user = request.env.values_at :scopes, :user
    username = user['username'].to_sym

    if scopes.include?('view_money') && @accounts.has_key?(username)
      content_type :json
      { money: @accounts[username] }.to_json
    else
      halt 403
    end
  end

end
```

Here, we initialize the class with some data, like we did with the `Public` class. Notice we `use JwtAuth` in this class. This is our way of including our token authentication middleware. This causes it to be run before the routes on this class are run. We then setup a `/money` route. This route grabs the scopes and user out of the environment. It then gets the username out of the user data. It checks to make sure this token has the `view_money` scope and that the username is a valid one in the data we have. If all this checks out, it returns the amount of money in the account. That's all there is to it.

![Hiting the Get Money route](https://cdn.auth0.com/blog/ruby-auth/get_money.png)

We can use this same setup to add and remove money from these accounts.

```
post '/money' do
  scopes, user = request.env.values_at :scopes, :user
  username = user['username'].to_sym

  if scopes.include?('add_money') && @accounts.has_key?(username)
    amount = request[:amount]
    @accounts[username] += amount.to_i

    content_type :json
    { money: @accounts[username] }.to_json
  else
    halt 403
  end
end

delete '/money' do
  scopes, user = request.env.values_at :scopes, :user
  username = user['username'].to_sym

  if scopes.include?('remove_money') && @accounts.has_key?(username)
    amount = request[:amount]

    @accounts[username] -= amount.to_i
    if @accounts[username] < 0
      @accounts[username] = 0
    end

    content_type :json
    { money: @accounts[username] }.to_json
  else
    halt 403
  end
end
```

Here we are doing similar work as the previous route except we are sending `POST` and `DELETE` requests to add and remove money.  Our output would look like this when adding money...

![Adding Money using the API endpoint](https://cdn.auth0.com/blog/ruby-auth/add_money.png)

...and when removing money.

![Deleting Money using the API endpoint](https://cdn.auth0.com/blog/ruby-auth/delete_money.png)

As you can see, we can now use JWTs to add and remove money also. You may have noticed that we have some duplicated code here though. That's not good when we can prevent it! Luckily, we can. We can refactor our code like so.

```
get '/money' do
  process_request request, 'view_money' do |req, username|
    content_type :json
    { money: @accounts[username] }.to_json
  end
end

post '/money' do
  process_request request, 'add_money' do |req, username|
    amount = req[:amount]
    @accounts[username] += amount.to_i

    content_type :json
    { money: @accounts[username] }.to_json
  end
end

delete '/money' do
  process_request request, 'remove_money' do |req, username|
    amount = request[:amount]

    @accounts[username] -= amount.to_i
    if @accounts[username] < 0
      @accounts[username] = 0
    end

    content_type :json
    { money: @accounts[username] }.to_json
  end
end

def process_request req, scope
  scopes, user = req.env.values_at :scopes, :user
  username = user['username'].to_sym

  if scopes.include?(scope) && @accounts.has_key?(username)
    yield req, username
  else
    halt 403
  end
end
```

We have extracted the common code out into its own method and pass in the functionality for each route into the `process_request` method as a block.

That's all there is to it. We can now use our `JwtAuth` middleware anywhere we want to protect routes with JSON web tokens.

![Drop the mic](https://media.giphy.com/media/R3FSRO8Z9D0lO/giphy.gif)

## What about Auth0?

[Auth0](https://auth0.com/) handles all this business of authenticating your users and creating JWTs so you can concentrate on building your application. There's even [a gem](https://github.com/auth0/ruby-auth0) that makes interacting with the Auth0 API so much easier. Let them handle the boring authentication while you build the next MyFaceTwiSterGram.

Wanna integrate Auth0 with RoR? Simple. The excellent writers over at Auth0 have you covered. They have written [extensive documentation](https://auth0.com/docs/quickstart/webapp/rails/) on how to do just that. It goes a little something like this.

### Add Omniauth and Auth0's strategy

Add the following to your `Gemfile` and run `bundle install`.

```
gem 'omniauth', '~> 1.3'
gem 'omniauth-auth0', '~> 1.4'
```

### Initialize Omniauth

Put the following in a file at `config/initializers/auth0.rb`, replacing the ALL_CAPS values with their actual values received when creating an application on the Auth0 dashboard.

```
Rails.application.config.middleware.use OmniAuth::Builder do
  provider(
    :auth0,
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'YOUR_NAMESPACE',
    callback_path: "/auth/auth0/callback"
  )
end
```

### Add the callback handler for Auth0

Use this command to create a controller to handle the Auth0 callback.

```
rails generate controller auth0 callback failure --skip-template-engine --skip-assets
```

In this newly-created file, add the logic to handle the success and failure of the callback.

```
class Auth0Controller < ApplicationController
  def callback
    # This stores all the user information that came from Auth0
    # and the IdP
    session[:userinfo] = request.env['omniauth.auth']

    # Redirect to the URL you want after successfull auth
    redirect_to '/dashboard'
  end

  def failure
    # show a failure page or redirect to an error page
    @error_msg = request.params['message']
  end
end
```

Also, replace the routes we created earlier with the following ones instead.

```
get "/auth/auth0/callback" => "auth0#callback"
get "/auth/failure" => "auth0#failure"
```

### Add the callback to Auth0's dashboard

You need to make sure you add the callback URL to the [Application Settings](https://manage.auth0.com/#/applications) in the Auth0 dashboard area.

For example, the callbacks we have created will be reached at `http://yourUrl/auth/auth0/callback`.

### Pick a method of triggering the login

There are multiple ways you can trigger the login flow in your application. For example, you could use the Auth0 Lock widget, Passwordless, or some custom UI. Here is what the code would look like to use the Lock widget in modal form.

```html
  <script src="https://cdn.auth0.com/js/lock-9.1.min.js"></script>
  <script type="text/javascript">

    var lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_NAMESPACE');


    function signin() {
      lock.show({
        callbackURL: '',
        responseType: 'code',
        authParams: {
          scope: 'openid email'  // Learn about scopes: https://auth0.com/docs/scopes
        }
      });
    }
  </script>
  <button onclick="window.signin();">Login</button>
```

### Accessing User Info

Once all this is setup, you can access user information like you normally would when using the Omniauth gem and its provider gems.

```ruby
class DashboardController < SecuredController
  def show
    @user = session[:userinfo]
  end
end
```

```html
  <div>
    <img class="avatar" src="<%= @user[:info][:image] %>"/>
    <h2>Welcome <%= @user[:info][:name] %></h2>
  </div>
```

This is only a portion of the information you can get from their docs. [Head over there](https://auth0.com/docs/quickstart/webapp/rails) to get more information on integrating with Rails.

## Authentication is hard

Authentication in a web application can be difficult. However, whether you use Auth0 or roll your own solution, the `jwt` ruby gem offers a simple way to use JWTs in your ruby application. This allows stateless authentication that can be used in a traditional application or a decentralized API.

{% include tweet_quote.html quote_text="Authentication in a web application can be difficult. However, Auth0 simplifies it with JWTs." %}
