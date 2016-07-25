---
layout: post
title: "Creating your first Symfony app and adding authentication"
description: Learn how to build your first Symfony application and add authentication to it.
date: 2016-07-21 8:30
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#3B3B3B"
  image: https://cdn.auth0.com/blog/Symfony/Logo.png
tags:
- symfony
- api
- authentication
- web-app
- auth0
related:
- 2015-11-13-build-an-app-with-vuejs
- 2016-06-23-creating-your-first-laravel-app-and-adding-authentication
- 2016-04-13-authentication-in-golang
---

---

**TL;DR:** Symfony is a PHP framework, made up of a lot of decoupled and reusable components. It's a framework that promotes standardization and professionalism, supports best practices and interoperability of applications. In this tutorial, I'll show you how easy it is to build a web application with Symfony and add authentication to it without banging your head on a wall! Check out the [repo](https://github.com/auth0/symfony-got) to get the code.

---

[Symfony Framework](https://symfony.com) has a vibrant community just like its counterpart - **Laravel**. The ecosystem around **Symfony Framework** thrives from the utmost significance of the plethora of reusable PHP components that **Symfony** provides. These components are used throughout **PHP** land. Tools like WordPress, Drupal, phpBB and Laravel depend on **Symfony Framework** components a lot. Well-known PHP projects such as [Silex](http://silex.sensiolabs.org/), [Twig](http://twig.sensiolabs.org/) and [Swiftmailer](http://swiftmailer.org/) originated from **Symfony** projects. One notable Symfony community is [Sensiolabs Connect](https://connect.sensiolabs.com/), which is an extensive professional network for Symfony developers.

## Symfony Components

**Symfony Framework** consists of a set of reusable PHP components. **Symfony** Components are decoupled and reusable PHP libraries. Many PHP applications around the world make use of **Symfony Framework** components. You can use any of these components in your own applications independently from the Symfony Framework. These amazing components include:

* [Asset](https://github.com/symfony/asset) - Manages URL generation and versioning of web assets such as CSS stylesheets, JavaScript files and image files
* [Browserkit](https://github.com/symfony/browser-kit) - Simulates the behavior of a web browser
* [Console](https://github.com/symfony/console) - Eases the creation of beautiful and testable command line interfaces
* [Debug](https://github.com/symfony/debug) - Provides tools to ease debugging PHP code
* [DomCrawler](https://github.com/symfony/dom-crawler) - Eases DOM navigation for HTML and XML documents. Laravel utilizes this component for integrated testing
* [Filesystem](https://github.com/symfony/filesystem) - Provides basic utilities for the filesystem
* [HttpKernel](https://github.com/symfony/http-kernel) - Provides the building blocks to create flexible and fast HTTP-based frameworks
* [Routing](https://github.com/symfony/routing) - Maps an HTTP request to a set of configuration variables
* [Yaml](https://github.com/symfony/yaml) - Loads and dumps YAML files.

**Symfony Framework** allows a developer to create plugins called **Bundles**. Everything is a bundle in Symfony, including both the core framework functionality and the code written for your application. This gives a developer the flexibility to use pre-built features packaged in third-party bundles or to distribute your own bundles. Read more about Symfony [Bundles](https://symfony.com/doc/current/book/bundles.html#main).

We'll be building a simple character listing app with **Symfony 3.1** like we did with Laravel [here](https://auth0.com/blog/2016/06/23/creating-your-first-laravel-app-and-adding-authentication/). Our app will simply list **10 Game of Thrones characters** and their real names. Once we add authentication to the app, all logged-in users will have the privilege of knowing these celebrity characters personally.

## Let's Get Started

Symfony utilizes [Composer](http://getcomposer.org/) to manage its dependencies. So, before using Symfony, make sure you have Composer installed on your machine. We can install Symfony Framework by issuing the `composer create-project` command in your terminal like so: `composer create-project symfony/framework-standard-edition GOT` or using the `symfony` installer. There are several Symfony distributions available, such as [Symfony Rest Edition](https://github.com/gimler/symfony-rest-edition), [Hello World Edition](https://github.com/symfony/symfony-hello-world) and [CMF Standard Edition](https://github.com/symfony-cmf/standard-edition). A developer is at liberty to choose any to get started with.

It's faster to spin up a new app using the `symfony` command like so: `symfony new GOT` . Check out the Symfony [docs](https://symfony.com/doc/current/book/installation.html#main) to learn how to set up the Symfony installer.

## Explore Directory Structure

**Symfony Framework** automatically ships with a default directory structure like the one below:

```bash

your-project/
├─ app/
│  ├─ config/
│  └─ Resources/
├─ bin/
│  └─ console
├─ src/
│  └─ AppBundle/
├─ tests/
│  └─ AppBundle/
├─ var/
│  ├─ cache/
│  ├─ logs/
│  └─ sessions/
├─ vendor/
│  └─ ...
└─ web/
   ├─ app.php
   └─ ...

```

The recommended purpose for each of these directories can be found below:

  * `app/config` - Contains all the configuration defined for any environment
  * `app/Resources` - Contains all the templates and translation files for the application
  * `bin` - Contains the executable files
  * `src/AppBundle` - Contains all the Symfony-specific code (controllers and routes), your domain code (e.g., Doctrine classes) and all your business logic
  * `tests/AppBundle` - Contains all the tests of the application
  * `var/cache` - Contains all the cache files generated by the application
  * `var/logs` - Contains all the log files generated by the application
  * `var/sessions` - Contains all the session files generated by the application
  * `vendor` - Contains all application dependencies installed by Composer
  * `web` - Contains all the front controller files and all the web assets, such as stylesheets, JavaScript files and images.

## Setting Up the Controllers

Open up the `src/AppBundle/Controller` directory and delete the `DefaultController.php` file. We are going to create new controller files, so we don't actually need the `DefaultController`. Now, go ahead and create `ListController.php`, `RegistrationController.php` and `SecurityController.php` files inside the directory.

Open up `src/AppBundle/Controller/ListController.php` and configure it like so:

```php

<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ListController extends Controller
{
    public function showAction(Request $request)
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

        return $this->render('default/index.html.twig', array('character' => $characters));
    }
}

```

`$this->render('default/index.html.twig', array('character' => $characters))` indicates that we are passing the `$characters` array to a view called `index.html.twig` in a `default` directory. We'll create that view in the later part of this post.

Open up `src/AppBundle/Controller/RegistrationController.php` and configure it like so:

```php

<?php
namespace AppBundle\Controller;

use AppBundle\Entity\User;
use AppBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class RegistrationController extends Controller
{
    /**
     * @Route("/register", name="register")
     */
    public function registerAction(Request $request)
    {
        // Create a new blank user and process the form
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Encode the new users password
            $encoder = $this->get('security.password_encoder');
            $password = $encoder->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);

            // Set their role
            $user->setRole('ROLE_USER');

            // Save
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('login');
        }

        return $this->render('auth/register.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}

```

Here, we mapped this controller to the `register` route. The `registerAction` processes the user registration form and persists to database; if the form has not been submitted yet, it renders the form created from `Symfony` FormBuilder. Next, let's create the FormBuilder.

### Creating User Type

Create a `Form` folder inside `src/AppBundle` directory. Now, go ahead and create `UserType.php` inside `src/AppBundle/Form` directory and configure it like so:

```php

<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('email', EmailType::class)
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options' => ['label' => 'Password'],
                'second_options' => ['label' => 'Confirm Password'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'AppBundle\Entity\User',
        ]);
    }
}

```

**Symfony** ships with a Form builder that helps us with generation of forms in our applications. Read more about [Symfony Forms](https://symfony.com/doc/current/book/forms.html).

Open up `src/AppBundle/Controller/SecurityController.php` and configure it like so:

```php

<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends Controller
{
    /**
     * @Route("/login", name="login")
     */
    public function loginAction(Request $request)
    {
       $helper = $this->get('security.authentication_utils');

       return $this->render(
           'auth/login.html.twig',
           array(
               'last_username' => $helper->getLastUsername(),
               'error'         => $helper->getLastAuthenticationError(),
           )
       );
    }

    /**
     * @Route("/login_check", name="security_login_check")
     */
    public function loginCheckAction()
    {

    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logoutAction()
    {

    }
}

```

This controller above actually takes care of our login process. Once the `/login` route is hit, the `loginAction` renders the login template, then the `login_check` route will be hit once a user clicks the login button. A user will be logged out once the `logout` route has been hit.

## Setting Up the Model

Symfony Framework is configured in a way that you can use any ORM (Object Relational Mapping) of your choice. The Symfony full-stack Framework doesn't integrate any ORM by default; the Symfony Standard Edition, which is the most widely used distribution, comes integrated with [Doctrine](http://www.doctrine-project.org/). The Doctrine ORM lets you map objects to a relational database.

### Configure the Database

Before we set up our model entity, let's configure our database connection. The default driver Symfony ships with is MySQL.

Open up `app/config/parameters.yml` and set up your config like so:

```yaml

# This file is auto-generated during the composer install
parameters:
    database_host: 127.0.0.1
    database_port: 3306
    database_name: symfony-got
    database_user: homestead
    database_password: secret
    mailer_transport: smtp
    mailer_host: 127.0.0.1
    mailer_user: null
    mailer_password: null
    secret: 81d300585b3dfdf6a3161e48d970e2baea252e42

```

Now that Doctrine can connect to your database, the following command can automatically generate an empty `symfony-got` database for you like so:

```bash
php bin/console doctrine:database:create
```

You can also just use [Laravel Homestead](https://laravel.com/docs/5.2/homestead) to set up your app. With that, you don't have to run the `doctrine:database:create` command since vagrant would have created the database during provisioning.

### Create the User Entity

Create an `Entity` folder inside `src/AppBundle` directory. Now, go ahead and create `User.php` inside the `src/AppBundle/Entity` directory and configure it like so:

```php

<?php
namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity
 * @UniqueEntity(fields="email", message="This email address is already in use")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id;
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    protected $email;

    /**
     * @ORM\Column(type="string", length=40)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=50)
     */
    protected $role;

    /**
     * @Assert\Length(max=4096)
     */
    protected $plainPassword;

    /**
     * @ORM\Column(type="string", length=64)
     */
    protected $password;

    public function eraseCredentials()
    {
        return null;
    }

    public function getRole()
    {
        return $this->role;
    }

    public function setRole($role = null)
    {
        $this->role = $role;
    }

    public function getRoles()
    {
        return [$this->getRole()];
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getUsername()
    {
        return $this->email;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;
    }

    public function getSalt()
    {
        return null;
    }
}

```

You now have a basic `User` entity with mapping information so that Doctrine knows exactly how to persist it. There is no table in our database yet, all we have is the `User` Schema. Fortunately, Doctrine can automatically create all the database tables needed for every known entity in your application. To do this, run:

```bash

php bin/console doctrine:schema:update --force

```

## Setting Up the Routes

Symfony Framework allows several options for setting up routes. It supports annotations and the option of explicitly stating it in `app/config/routing.yml`. The goal of the Symfony routing system is to parse any URL and determine which controller should be executed. In this tutorial, we'll make use of annotations within our Controllers.

![Symfony Routing Diagram](http://symfony.com/doc/current/_images/request-flow.png)

*(Source: [Symfony](http://symfony.com))*

Open up `src/AppBundle/Controller/ListController.php` and configure it like so:

```php
  /**
   * @Route("/", name="welcome")
   */
  public function showAction(Request $request)
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

      return $this->render('default/index.html.twig', array('character' => $characters));
  }
```

I just added the `@Route` annotation. Once a request hits the `/` route, it invokes the `showAction` method of the `ListController` and renders the returned value in the `index` twig view. We'll configure the `twig` view later in this post.

## Setting Up Authentication

**Symfony 3** ships with an awesome security component called **Guard** that simplifies authentication process. Let's take advantage of it in our app. The first step is to configure the Symfony security settings.

Open up `app/config/security.yml` and configure it like so:

```yaml

security:
    encoders:
        AppBundle\Entity\User: bcrypt
    providers:
        database_users:
            entity: { class: AppBundle:User, property: email }
    firewalls:
        # disables authentication for assets and the profiler, adapt it according to your needs
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false

        main:
            anonymous: ~
            guard:
                authenticators:
                    - app.form_login_authenticator
            logout:
                path: /logout
                target: /

```

These settings configure Symfony to use `bcrypt` to hash passwords, `email` field when looking up users and the Symfony Guard authenticator that we will create in a bit.

Create a new folder `Security` inside the `src/AppBundle` directory. Now, go ahead and create our custom Guard Authenticator `FormLoginAuthenticator.php` inside the `Security` directory.

_FormLoginAuthenticator.php_

```php

<?php
namespace AppBundle\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;
use Symfony\Component\Security\Core\Security;

class FormLoginAuthenticator extends AbstractFormLoginAuthenticator
{
    private $router;
    private $encoder;

    public function __construct(RouterInterface $router, UserPasswordEncoderInterface $encoder)
    {
        $this->router = $router;
        $this->encoder = $encoder;
    }

    public function getCredentials(Request $request)
    {
        if ($request->getPathInfo() != '/login_check') {
          return;
        }

        $email = $request->request->get('_email');
        $request->getSession()->set(Security::LAST_USERNAME, $email);
        $password = $request->request->get('_password');

        return [
            'email' => $email,
            'password' => $password,
        ];
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $email = $credentials['email'];

        return $userProvider->loadUserByUsername($email);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        $plainPassword = $credentials['password'];
        if ($this->encoder->isPasswordValid($user, $plainPassword)) {
            return true;
        }

        throw new BadCredentialsException();
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        $url = $this->router->generate('welcome');

        return new RedirectResponse($url);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
       $request->getSession()->set(Security::AUTHENTICATION_ERROR, $exception);

       $url = $this->router->generate('login');

       return new RedirectResponse($url);
    }

    protected function getLoginUrl()
    {
        return $this->router->generate('login');
    }

    protected function getDefaultSuccessRedirectUrl()
    {
        return $this->router->generate('welcome');
    }

    public function supportsRememberMe()
    {
        return false;
    }
}

```

The `getCredentials()` fetches the email address and password from the request, `getUser()` uses that to load the user and then `checkCredentials()` checks if the password matches the user account that `getUser()` fetched. If it matches and the user exists, then `onAuthenticationSuccess()` is called, otherwise `onAuthenticationFailure()` is called. The `getLoginUrl()` and `getDefaultSuccessRedirectUrl()` must be implemented since we are inheriting the GuardAuthenticator. These methods return the login URL and the URL that a successful login should redirect to respectively.The remember_me functionality is not needed in this app, so we return false in `supportsRememberMe()`.

**Symfony Framework** needs to be aware about our custom Guard Authenticator. Now, open up `app/config/services.yml` and register in the **Symfony Services** list like so:

```yaml

# Learn more about services, parameters and containers at
# http://symfony.com/doc/current/book/service_container.html
parameters:
#    parameter_name: value

services:
    app.form_login_authenticator:
        class: AppBundle\Security\FormLoginAuthenticator
        arguments: ["@router", "@security.password_encoder"]

```

## Setting Up Views

**Symfony Framework** ships with a powerful templating engine called [Twig](http://twig.sensiolabs.org/). Twig allows you to write concise, readable templates that are more friendly to web designers and, in several ways, more powerful than PHP templates.

The views needed for authentication in this app are in the `app/Resources/views/auth` directory. The base layout for our application has also been configured in the `app/Resources/views/base.html.twig`. All of these views use the Bootstrap CSS framework, but you are free to customize them however you wish.

Open up your `app/Resources/views/default/index.html.twig` and configure it like so:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}
{% endraw %}

{% raw %}
{% block body %}
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-success">
                <div class="panel-heading">List of Game of Thrones Characters</div>

                {% if app.user != null %}
                  <table class="table">
                      <tr>
                          <th>Character</th>
                          <th>Real Name</th>
                      </tr>

                      {% for key, item in character %}
                        <tr>
                          <td>{{ key }}</td><td>{{ item }}</td>
                        </tr>
                      {% endfor %}
                  </table>
                {% endif %}


            </div>

            {% if app.user == null %}
              <a href="/login" class="btn btn-info"> You need to login to see the list 😜😜 >></a>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}
{% endraw %}
{% endhighlight %}

Here, we are looping through the `$characters` array data passed from the `ListController` for appropriate rendering in the `index.html.twig` view.

`app.user == null` - You can check if a user is authenticated or not. It returns true if a user is logged-in and null if a user is not.

Create `login.html.twig` and `register.html.twig` templates inside `app/Resources/views/auth` directory. Configure them respectively like so:

_login.html.twig_

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}
{% endraw %}

{% raw %}
{% block body %}
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Login</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" method="POST" action="{{ path('security_login_check') }}">
                        {% if error %}
                            <div class="alert alert-danger">
                                {{ error.messageKey|trans(error.messageData) }}
                            </div>
                        {% endif %}

                        <div class="form-group">
                            <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control" name="_email" value="{{ last_username }}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label">Password</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="_password">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-btn fa-sign-in"></i> Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
{% endraw %}
{% endhighlight %}

_register.html.twig_

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}
{% endraw %}

{% raw %}
{% block body %}
<div class="container">
  <div class="row">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
          <div class="panel-heading">Register</div>
          <div class="panel-body">
            {{ form_start(form) }}
            <div class="form_group">
                <div class="col-md-8 col-md-offset-2">
                  {{ form_row(form.name, {'attr': {'class': 'form-control'}}) }}
                </div>
            </div>

            <div class="form_group">
                <div class="col-md-8 col-md-offset-2">
                {{ form_row(form.email, {'attr': {'class': 'form-control'}}) }}
                </div>
            </div>

            <div class="form_group">
                <div class="col-md-8 col-md-offset-2">
                {{ form_row(form.plainPassword.first, {'attr': {'class': 'form-control'}}) }}
                </div>
            </div>

            <div class="form_group">
                <div class="col-md-8 col-md-offset-2">
                {{ form_row(form.plainPassword.second, {'attr': {'class': 'form-control'}}) }}
              </div>
            </div>

            <div class="form-group">
                <div class="col-md-8 col-md-offset-4" style="margin-top:5px;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-btn fa-user"></i> Register
                    </button>
                </div>
            </div>
            {{ form_end(form) }}
          </div>
        </div>
    </div>
  </div>
</div>
{% endblock %}
{% endraw %}

{% endhighlight %}

We are making use of the **Symfony** built-in [form](https://symfony.com/doc/current/book/forms.html) methods in this template.

With all the routes and views fully set up, your application should look like this:

_Landing Page_

![Landing Page](https://cdn.auth0.com/blog/symfony/landing-page.png)

_Login Page_

![Login Page](https://cdn.auth0.com/blog/symfony/login-page.png)

_Register Page_

![Register Page](https://cdn.auth0.com/blog/symfony/register-page.png)

Try registering a user on the application. It should register you successfully and log you in like so:

![Landing Page while authenticated](https://cdn.auth0.com/blog/symfony/authenticated-user.png)


## The Profile Debug Toolbar

**Symfony** ships with an awesome web debug toolbar. It is one of the most recognizable elements of Symfony applications. It provides all sorts of information about sessions, cookies, variables, load time, service providers, request-response time cycle, app size  and also an extensive error log. This toolbar actually increases the productivity of Symfony developers because it makes debugging super easy!

![Symfony debug Toolbar](https://cdn.auth0.com/blog/symfony/debug-toolbar.png)

![Symfony Profiling](https://cdn.auth0.com/blog/symfony/profile-toolbar.png)

![Symfony Error Notice](https://cdn.auth0.com/blog/symfony/error-notice.png)

![Symfony Error Profiling](https://cdn.auth0.com/blog/symfony/error-profiling.png)

You can disable the toolbar by setting the value of `toolbar` to `false` in `app/config/config_dev.yml` like so:

```yaml

web_profiler:
    toolbar: false
    intercept_redirects: false

```

## Symfony vs. Other PHP Frameworks

Right now, Laravel is the most trending PHP framework in the world. Laravel thrives on excellent and straightforward documentation. It's also easier to learn. Symfony, on the other hand, is a very stable and mature framework. It's great for very large web projects. Symfony has been around for so long that several PHP projects and frameworks like Laravel depend on many of its components. Symfony forces you as a developer to learn Solid OOP. Many open-source projects build on Symfony components, thus allowing a developer who is well-versed in Symfony to easily work on other PHP projects. CakePHP has an awesome inbuilt ORM that makes building queries and relationships a piece of cake. If you want an excellent comparison of Symfony and other PHP frameworks, check [here](http://zenofcoding.com/2015/11/16/the-great-php-mvc-framework-showdown-of-2016-cakephp-3-vs-symfony-2-vs-laravel-5-vs-zend-2/).

## Aside: Using Auth0 with Symfony Framework

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in our Symfony apps by using the [Lock Widget](https://auth0.com/lock). If you don't already have an Auth0 account, [sign up](https://auth0.com/signup) for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), select **Applications** from the navigational menu, then select the app you want to connect with **Symfony**.

### Step 1: Install and Configure Auth0 plugin

Follow the instructions [here](https://auth0.com/docs/quickstart/webapp/symfony) to configure the Auth0 plugin.

**Note:** Symfony 3 only works with `0.5.*@dev` version of the `hwi/oauth-bundle`

### Step 2: Register the Callback

Head over to your Auth0 [dashboard](https://manage.auth0.com/#/applications/) and register a callback like so: `http://symfony-got.app/auth0/callback` and logout URL `http://symfony-got.app/logout`.


### Step 3: Include Auth0's Lock Widget

Open up `default/index.html.twig` and configure it like so:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}
{% endraw %}

{% raw %}
{% block body %}
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
{% endblock %}
{% endraw %}
{% endhighlight %}

When the login button is clicked, the Auth0 lock widget comes up:

![Auth0 Lock Widget](https://cdn.auth0.com/blog/symfony/auth0-lock.png)


### Step 4: Use Lock Widget

Register with the Lock Widget. Once a user registers, it stores the user information in your Auth0 dashboard. We can retrieve this info using the `HWI\Bundle\OAuthBundle\Security\Core\User\OAuthUserProvider` class methods.

_logged_in_user_

![Logged In User](https://cdn.auth0.com/blog/symfony/loggedin-user.png)


With Auth0, you can have all your users' information stored without having to run your own database. You can configure the Lock UI to handle authentication. Auth0 provides powerful analytics about users signing up on your platform such as the browser the user logged in with, the location, device, number of logins and more, out of the box!


## Wrapping Up

You have just built your first app with Symfony 3. We just barely scratched the surface in this tutorial. This is designed to help you get started in building your own apps with Symfony framework. You can leverage the knowledge gained here to build bigger and better apps. Symfony teaches you a lot about how to develop good, transparent, well-tested and well-coded applications with PHP. When compared with other PHP frameworks, Symfony is very stable. In fact, several PHP frameworks depend on Symfony components. It’s one of the few frameworks out there bundled with good documentation and certifications for developers. Would you prefer Laravel over Symfony or vice versa? Let me know your thoughts in the comment section 😊

{% include tweet_quote.html quote_text="Symfony is one of the few frameworks out there with good documentation and certifications for developers." %}
