---
layout: post
title: "Creating your first Laravel app and adding authentication"
description: Learn how to build your first Laravel application and add authentication to it.
date: 2016-06-17 10:30
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#4D185A"
  image: https://laravel.com/assets/img/laravel-logo.png
tags:
- api
- jwts
- authentication
- web-app
- laravel
- auth0
related:
- 2015-11-13-build-an-app-with-vuejs
- 2016-04-13-authentication-in-golang
- 2016-06-02-ruby-authentication-secure-rack-apps-with-jwt
---

---

**TL;DR:** Laravel is a great PHP framework. Currently, it is the most starred PHP project on [github.com](https://github.com) and a lot of companies and people all over the world use it to build amazing applications. In this tutorial, I'll show you how easy it is to build a simple web application with Laravel and add authentication to it without breaking a sweat. Check out the [repo](https://github.com/auth0/laravel-auth0-got) to get the code.

---

**Laravel** is a free, open-source PHP framework designed for building web applications with an expressive and elegant syntax. **Laravel** has a high level of abstraction which shields the common developer from complex inner workings. **Laravel** saves you time and effort because it comes shipped with a lot of features out of the box. These amazing features include:

* Database Migrations
* Eloquent ORM
* Simple Authentication
* Authorization and Policies
* Scheduler
* Queuing
* Mailing
* Blade templating engine
* Filesystem and Cloud Storage
* Event Handling

**Laravel** did not attempt to rewrite a lot of its functionalities from scratch, it makes good use of already written and well tested components from the PHP community. Laravel is one of the few frameworks that actually comes with development environments such as [Homestead](https://laravel.com/docs/5.2/homestead) and [Valet](https://laravel.com/docs/5.2/valet). The [documentation](https://laravel.com/docs) is very detailed and there is a large community around Laravel. Some of the notable communities are [laracasts.com](https://laracasts.com/discuss), [larajobs.com](https://larajobs.com/), [laravel-news.com](https://laravel-news.com/), [laravelpodcast.com](http://www.laravelpodcast.com/) and [larachat.co](https://larachat.co/).

Laravel is currently at version 5.2. **Laravel 5.3** is currently in development and is due for release this month. Here is a quick look at some of these new features:

* Ability to rollback one migration like so `php artisan migrate:rollback --step-1`
* The Blade foreach/forelse loops now gives you access to a `$loop` variable to easily determine first and last iterations
* Eloquent collections are cleanly serialized and re-pulled by queued jobs
* Queue console output now shows the actual class names
* Ability to customize simple paginations in your views
* Ability to pass additional values to firstOrCreate Model method
* Query Builder will return collections instead of arrays
* Ability to load your own migration paths from a service provider.
* **Laravel Echo** - I'm actually looking forward to this. It will make building realtime apps with Laravel very painless.

We'll be building a simple character listing app with **Laravel 5.2**. Our app will simply list **10 Game of throne characters** and their real names. Once we add authentication to the app, all logged-in users will have the privilege of knowing these celebrity characters personally.


## Let's get started

Laravel utilizes [Composer](http://getcomposer.org/) to manage its dependencies. So, before using Laravel, make sure you have Composer installed on your machine. We can install Laravel by issuing the Composer `create-project` command in your terminal like so: `composer create-project --prefer-dist laravel/laravel GOT` or using the `laravel` installer.

It's actually faster to spin up a new app using the `laravel` command like so: `laravel new GOT` . Check out the Laravel [docs](https://laravel.com/docs/5.2#installing-laravel) to learn how to set up the laravel installer.

If you used the `laravel` installer command to create a new app, then you have to run `composer install` immediately after the previous command to install all the dependencies.

## Explore Directory Structure

Laravel applications follow the **Model-View-Controller** design pattern.

![mvc_diagram_with_routes](https://cloud.githubusercontent.com/assets/2946769/16150856/adb0a74c-3491-11e6-82c5-701941efd1fe.png)

*(Source: [Self Taught Coders](https://selftaughtcoders.com))*

In a nutshell,

  * **Models** query your database and returns the necessary data.
  * **Views** are pages that render data
  * **Controllers** handle user requests, retrieve data from the Models and pass them unto the views.

Read more about [MVC](http://www.tomdalling.com/blog/software-design/model-view-controller-explained/) here.

<img width="1034" alt="screen shot 2016-06-17 at 1 55 25 pm" src="https://cloud.githubusercontent.com/assets/2946769/16151142/474075e4-3493-11e6-8f46-c846646c6287.png">

The app directory is the **meat** of your laravel application. It houses the following directories:

  * `Console` - Contains all your Artisan commands
  * `Http` - Contains all your controllers, middlewares, requests and routes file
  * `Providers` - Contains all your application service providers. You can read more about [Service Providers]() here
  * `Events` - Contains all your event classes.
  * `Exceptions` - Contains your application exception handler and custom exception classes.
  * `Jobs` - Contains all the jobs queued by your application
  * `Listeners` - Contains all the handler classes for your events.
  * `Policies` - Contains the authorization policy classes for your application. Policies are used to determine if a user can perform a given action against a resource.

The other directories namely:
  * `boostrap` contains your framework autoloading files and generated cache files
  * `config` contains your app's configuration files.
  * `database` contains your database migrations and seeds.
  * `public` contains your assets(images, JavaScript, css etc).
  * `resources` contains your views and localization files.
  * `storage` contains all your compiled Blade templates, file caches and logs.
  * `tests` contains all your tests.
  * `vendor` contains your app dependencies.


## Setting Up The Controller

Open up your terminal and run this command below to create a `ListController`.

```bash
php artisan make:controller ListController
```

Open up `app/Http/Controllers/ListController.php` and configure it like so:

```php
<?php

namespace App\Http\Controllers;

class ListController extends Controller
{
    public function show()
    {
       $characters = [
         'Daenerys Targaryen' => 'Emilia Clarke',
         'Jon Snow'           => 'Kit Harington',
         'Arya Stark'         => 'Maisie Williams',
         'Melisandre'         => 'Carice van Houten',
         'Khal Drogo'         => 'Jason Momoa',
         'Tyrion Lannister'   => 'Peter Dinklage',
         'Ramsay Bolton'      => 'Iwan Rheon',
         'Petyr Baelish'      => 'Aidan Gillen',
         'Brienne of Tarth'   => 'Gwendoline Christie',
         'Lord Varys'         => 'Conleth Hill'
       ];

       return view('welcome')->withCharacters($characters);
    }
}
```

`view('welcome')->withCharacters($characters)` indicates that we are passing the `$characters` array to a view called `welcome.blade.php`. We'll create that view in the later part of this post.

## Setting Up The Model

Laravel Models are stored by default in the root of the `app` directory. The `User` model comes shipped and configured with the Laravel framework. Only the `User` model is needed in this application so we won't create any model. However, if you want to create more models, you can simply run the command below like so:

```bash
php artisan make:model <modelName>
```

where <modelName> represents the name of the Model you want to create.

## Setting Up The Routes

Open up `app/Http/routes.php` and configure it like so:

```php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'ListController@show');
```

Once a request hits the `/` route, it invokes the `show` method of the `ListController` and renders the returned value in the `welcome` view. We'll configure the `welcome` view later in this post.

## Setting Up Authentication

One fascinating thing about Laravel is that it comes with authentication out of the box. You just have to configure it. Next, open up your terminal and run this command like so:

```bash
php artisan make:auth
```

Be careful enough to only do this on fresh applications.

<img width="1008" alt="screen shot 2016-06-19 at 2 34 10 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177617/f0ff3406-362a-11e6-9144-1393c8031f2b.png">

As you can see, some files have been copied into our application, the routes have also been updated. The route file has been populated with additional information like so:

<img width="658" alt="screen shot 2016-06-19 at 3 22 39 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177907/d9f07318-3631-11e6-997c-48f35aeb7107.png">

`Route::auth()` is a method that cleanly encapsulates all the login and register routes.

Now, the views needed for authentication are in the `resources/views/auth` directory. The base layout for our application has also been configured in the `resources/views/layouts` directory. All of these views use the Bootstrap CSS framework, but you are free to customize them however you wish.

Open up your `welcome.blade.php` and configure it like so:

```php
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-success">
                <div class="panel-heading">List of Game of Thrones Characters</div>

                    @if(Auth::check())
                      <!-- Table -->
                      <table class="table">
                          <tr>
                              <th>Character</th>
                              <th>Real Name</th>
                          </tr>
                          @foreach($characters as $key => $value)
                            <tr>
                              <td>{{ $key }}</td><td>{{ $value }}</td>
                            </tr>
                          @endforeach
                      </table>
                    @endif


            </div>
            @if(Auth::guest())
              <a href="/login" class="btn btn-info"> You need to login to see the list 😜😜 >></a>
            @endif
        </div>
    </div>
</div>
@endsection
```

Here, we are looping through the `$characters` array data passed from the `ListController` for appropriate rendering in the `welcome` view.

`Auth::check()` - You can check if a user is authenticated or not via this method from the `Auth` Facade. It returns true if a user is logged-in and false if a user is not. Check [here](https://laravel.com/docs/5.2/facades) to know how Facades work in Laravel.

`Auth::guest()` - This does the opposite of `Auth::check()`. It returns true if a user is not logged-in and false if a user is logged-in. Check [here](https://laravel.com/api/5.2/Illuminate/Auth/Guard.html) to see all the methods you can call on the `Auth` Facade.

Now that we have all the routes and views setup, your application should look like this:

Landing Page

<img width="1107" alt="screen shot 2016-06-19 at 3 41 17 pm" src="https://cloud.githubusercontent.com/assets/2946769/16184678/390eb9a2-36b6-11e6-8e70-4c4550e2a3b4.png">

Login Page

<img width="1098" alt="screen shot 2016-06-19 at 3 29 33 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177928/b4ce7822-3632-11e6-9f9c-34bacd74eba7.png">

Register Page

<img width="1099" alt="screen shot 2016-06-19 at 3 29 44 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177929/b9b7741a-3632-11e6-92da-95b5039c4cce.png">

## Run Migrations

Migrations are like version control for your database, allowing a team to easily modify and share the application's database schema. In **Laravel**, they are placed in the `database/migrations` directory. Each migration file name contains a timestamp which allows **Laravel** to determine the order of the migrations.

Luckily for us, the user migration files comes by default with a fresh **Laravel** install. Check the `database/migrations` directory to ensure you have at least two migration files named `xxx_create_users_table.php` and `xxx_create_password_resets_table.php` where `xxx` represents the timestamp.

Now, run this command from your terminal:

```bash
php artisan migrate
```
The `users` and `password_resets` table will be created on running this command. Ensure the appropriate database name has been set in your `.env` file. The value should be assigned to this `DB_DATABASE` constant.

## Path Customization

Open up `AuthController.php` in `app/Http/Controllers/Auth` directory. There is a `$redirectTo` variable like so:

```php
/**
* Where to redirect users after login / registration.
*
* @var string
*/
protected $redirectTo = '/';
```
It can be configured to whatever route you want the user to be redirected to just after registration or login. In our case, the user should be redirected to the landing page, so we don't need to change anything.

Now, go ahead and register. It should register you successfully and log you in like so:

<img width="1102" alt="screen shot 2016-06-19 at 5 45 22 pm" src="https://cloud.githubusercontent.com/assets/2946769/16178630/c31a5898-3645-11e6-8ca2-7f38360ad2c6.png">


## Using the Auth Middleware

Middlewares provide a convenient mechanism for filtering HTTP requests entering your application. For example, **Laravel** includes a middleware that verifies the user of your application is authenticated. If the user is not authenticated, the middleware will redirect the user to the login screen. However, if the user is authenticated, the middleware will allow the request to proceed further. The `app/Http/Middleware` directory contains several middlewares.

Let's check out how the `auth` middleware works.

Add a new route to your `routes.php` file like so:

```php
Route::get('/got', [
  'middleware' => ['auth'],
  'uses' => function () {
   echo "You are allowed to view this page!";
}]);
```
Now, log out, then try to access that route, you will be redirected back to the `/login` route. The Laravel `auth` middleware intercepted the request, checked if the user was logged-in, discovered that the user was not logged-in, then redirected the user back to the `login` page.

## Aside: Using Auth0 with Laravel

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in our Laravel apps by using the [Lock Widget](https://auth0.com/lock). If you don't already have an Auth0 account, [sign up](https://auth0.com/signup) for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), select **Applications** from the navigational menu, then select the app you want to connect with **Laravel**.

### Step 1: Install and Configure Auth0 plugin

Follow the instructions [here](https://auth0.com/docs/quickstart/webapp/laravel) to configure the Auth0 plugin.

### Step 2: Register the callback

Head over to your Auth0 [dashboard](https://manage.auth0.com/#/applications/PATkFym2gZQS3lEIUCS68qrSl8jgVD7P/settings) and register a callback like so: `http://laravel-auth0.dev/auth0/callback` and logout URL `http://laravel-auth0.dev/logout`.

Open up your routes and add this:

```php
Route::get('/auth0/callback', function() {
   dd(Auth0::getUser());
});
```

### Step 3: Include Auth0's Lock Widget

Open up `welcome.blade.php` and configure it like so:

```php
@extends('layouts.app')

@section('content')
<script src="https://cdn.auth0.com/js/lock-9.1.min.js"></script>
<script type="text/javascript">

  var lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN');


  function signin() {
    lock.show({
        callbackURL: 'YOUR_AUTH0_CALLBACK_URL'
      , responseType: 'code'
      , authParams: {
        scope: 'openid email'  // Learn about scopes: https://auth0.com/docs/scopes
      }
    });
  }
</script>
<button onclick="window.signin();">Login</button>
@endsection
```
When the login button is clicked, the auth screen comes up like so:

<img width="1099" alt="screen shot 2016-06-19 at 8 17 49 pm" src="https://cloud.githubusercontent.com/assets/2946769/16179378/ab1b3292-365b-11e6-929f-13352d0447bd.png">


### Step 4: Configure & Use Lock Widget in Routes.php

Add this to your `routes.php` file:

```php
Route::get('/auth0/callback', function() {
   dd(Auth0::getUser());
});
```

Now, once a user registers, it stores the user information in your Auth0 dashboard. We can retrieve this info using the `Auth0::getUser()` method. We can also hook onto the onLogin event using `Auth0::onLogin(function(...))`.

<img width="1106" alt="screen shot 2016-06-19 at 8 18 47 pm" src="https://cloud.githubusercontent.com/assets/2946769/16179468/d645c33a-365e-11e6-9f04-389cfe1d81c5.png">


Access can be restricted with **Auth0 Middleware**, just add this `'auth0.jwt' => 'Auth0\Login\Middleware\Auth0JWTMiddleware'` in the `$routeMiddleware` array in `app/Http/Kernel.php`. Then use `auth0.jwt` middleware on your routes.

With Auth0, you can have all your users information stored without having to run your own database. You can configure the Lock UI, It provides powerful analytics about users signing up on your platform such as, the browser the user logged in with, the location, device, number of logins out of the box!

<img width="845" alt="screen shot 2016-06-19 at 8 43 50 pm" src="https://cloud.githubusercontent.com/assets/2946769/16179466/c67f3bac-365e-11e6-8b22-67db28b9b7ba.png">


It's actually very simple to use Auth0 Lock Widget, just as we have seen above!

## Wrapping Up

Well done! You have just built your first app with Laravel. Laravel is an awesome framework to work with. It focuses on simplicity, clarity and getting work done. As we saw in this tutorial, you can easily add authentication to your Laravel apps. This is designed to help you get started on building your own apps with Laravel. You can leverage the knowledge gained here to build bigger and better apps.
Please, let me know if you have any questions or observations in the comment section. 😊
