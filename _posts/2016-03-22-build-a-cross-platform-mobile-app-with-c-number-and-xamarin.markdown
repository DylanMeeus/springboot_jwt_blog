---
layout: post
title: "Build a Cross-Platform Mobile App with C# and Xamarin"
description: "Learn how to build and authenticate cross-platform mobile apps written in C# with Xamarin"
date: 2016-03-22 09:38
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
design: 
  bg_color: "#333333"
  image: <A PATH TO A 200x200 IMAGE>
tags: 
- Xamarin
- C#
- Cross-Platform
---

---

**TL;DR**

---

The importance of having a great mobile app cannot be understated. The good news is that developers have a lot of options on how to build mobile apps. Native, hybrid, responsive web - and the frameworks that come with them give developers a lot of flexibility but they all have their pros and cons. Native development will likely grant the best performance, but you'll have to maintain each platform separatley. Hybrid development will allow you to target multiple platforms with one codebase, but you won't get the same performance. Responsive web will allow you to convert your web app to a mobile friendly version quickly, but you won't be able to access the native device features nor the app stores.

The general rule of thumb when building any application is that you should build it with the technology you are most familiar with. Building a native iOS app for the "performance" benefits when you have zero Objective-C knowledge will likely yield a negative result. Xamarin is a framework for building cross-platform applications in C# so if you've ever worked with the Microsoft technology stack you should feel right at home. In today's post, we'll build a cross-platform iOS and Android app with Xamarin.

## Why Xamarin?

Xamarin allows you to build native iOS, Android, Windows and Mac applications in C#. The company was founded by the creators of Mono and recently acquired by Microsoft. Over 1 million developers are using Xamarin to build apps like CineMark, MixRadio and Bastion. Xamarin is a great fit for companies who are already embedded in the Microsoft stack and have developers with extensive C# knowledge. The Xamarin Platform runs on both Windows and Mac so you truly are not limited to the Windows ecosystem but have the full strength of C# at your disposal.

C# is an excellent programming language. Statically typed, object-oriented, garbage collected and asynchronous are just some of the benefits. With Xamarin, your entire app will be written in C# and then compiled to it's native binary. The Xamarin Platform exposes platform specific API's when needed, interfaced again with C#, but generally you will be able to write the majority of your code once and have it run everywhere.

## Getting Started with Xamarin

Let's dive in and actually write some code. The first thing we'll need is the actual Xamarin Platform installed on our machine. Head over the the Xamarin website and download it. Once downloaded, the installer will ask you which platforms you are planning on developing for and will download additional dependencies automatically. If you are developing on a Windows machine, you can alternatively use Visual Studio, but as this is a tutorial introducing Xamarin - we'll stick to Xamarin Studio.

### Setting Up the Solution

With Xamarin Studio installed, we are ready to create our first project. Open up Xamarin Studio and click the **New Solution** button in the top left corner to get started. The first screen we're presented with will ask us what type of application we're building. We'll select Cross-Platform App as we're building an application that we want available on iOS and Android. We'll select a **Xamarin.Forms** app and on the next screen we'll name our app - CloudCakes, select our target platforms (Android and iOS) and select the **Use Shared Library** in the sharing section. The Shared Code selection does not matter much for us in this demo but to learn about the differences and when you might use one over the other check out the Xamarin [docs](https://docs.xamarin.com/guides/cross-platform/application_fundamentals/building_cross_platform_applications/sharing_code_options/).

Finally, we'll select a directory for our project and we'll be ready to go.

### Project Structure

With a new solution created, let's explore how Xamarin setup the project for us. There are 3 root level directories: CloudCakes, CloudCakes.Droid, CloudCakes.iOS - or if you named your app something different it'll follow the pattern {AppName}, {AppName}.Droid, {AppName}.iOS. We will spend the majority of our time in the main directory as any code written here will be shared between the Android and iOS versions of the app. The more code we can write in the main directory the better.

The platform specific directories are for writing code that will only execute on the target platform. Xamarin has already taking care of the code required to launch our apps on both Android and iOS so we should be able to just start writing code in the shared directory, build our solution and see the results. Before we start, if you open the `AppDelegate.cs` file on the iOS side and the `MainActivity.cs` on the Droid side, you'll be able to see platform specific code implemented to launch the app. If you've developed native iOS or Android apps in the past, these file names should be familiar as they match the app instantiation files for the native platforms.

### Hello World in Xamarin

Before we write our app, let's quickly open up the `CloudCakes.cs` or `{AppName}.cs` in the shared code directory. This the entry or main function into our application. Xamarin has added some boilerplate when it created the solution that just displays a message once the app is opened. To make sure this runs, let's build and run the solution. To do this, simply click the play icon in the top left corner of the screen and the iOS Simulator should launch with our Xamarin app and display the message "Welcome to Xamarin Forms!" Now let's build our app.

## CloudCakes Goes Mobile

The app we'll be building today is called CloudCakes. If you've been keeping up with the Auth0 blog, you may remember CloudCakes from our post a few weeks ago where we migrated the users from Parse to Auth0. CloudCakes is an app that allows you to get cake on demand. Up until now, you'd have to use your computer or the web responsive version of the CloudCakes website to place orders. Due to overwhelming requests, you've decided that a native mobile application is needed. Let's see how we can accomplish this with Xamarin.

 CloudCakes is a fairly simple app. We need a way to authenticate a user, allow users to view cakes and place orders, an about page for newcomers and a signup page to convert new users into "Cake Enthusiasts." Let's start with the **about** page as it is the simplest and will give us a chance to familiarize ourselves with how Xamarin works.

### About Us
The **About Us** page will give some general information about our app. Let's start by creating a new file in the shared directory. Right click on the main shared directory and navigate to the **Add** menu, in the submenu select **New File**. A new dialog box will appear giving you options for the type of file you'd like to create. As we are building a **Xamarin.Forms** app, we'll stay in the Forms section, and here we'll have 4 options for the type of files we'd like to create. We can create a **Forms ContentPage**, **Forms ContentPage Xaml**, **Forms ContentView** or **Forms ContentView Xaml**.

A **ContentPage** defines the entire view of the screen. **ContentView** on the other hand can be viewed as a section of the page. You can use multiple ContentViews to build out a ContentPage. Additionally, you have two choices in how you want to build the UI for your application. Option 1 is to build your UI with C#, Option 2 is to use XAML to build out the UI and hook up functionality via an underlying C# file. You can build the same UI's with either option but we've chosen to go with building all of our UI's in C# as there is a lot of content to cover and adding XAML on top of it would make for a very long tutorial.

We'll select the **Forms ContentPage** template and name it `AboutPage`. Xamarin will now create the template and add some boilerplate code we can work with. Let's see what Xamarin generated.

```
using System;
using Xamarin.Forms;

namespace CloudCakes
{
	public class AboutPage : ContentPage
	{
		public AboutPage ()
		{
			Content = new StackLayout {
				Children = {
					new Label { Text = "Hello ContentPage" }
				}
			};
		}
	}
}
```

This is fairly standard C# code. The page was created in the CloudCakes namespace, a new class called `AboutPage` was created that inherits ContentPage which will allow us to build our our UI. Finally, the main method for this class was created called `AboutPage()`. The `Content` variable is how we build the UI using Xamarin Forms and C#. Here we declare the type of layout we'd like, global page parameters such as padding or line spacing and then we include any components that we want the user to see. In the boilerplate example, we simply display a text label that says "Hello ContentPage." Let's write the code for the AboutUs page and examine it closer.

```
using System;
using System.Collections.Generic;
using Xamarin.Forms;

namespace CloudCakes
{
	public class AboutPage : ContentPage
	{
		public AboutPage ()
		{
			var title = new Label {
				Text = "About Us",
				FontSize = Device.GetNamedSize (NamedSize.Large, typeof(Label)),
				HorizontalOptions = LayoutOptions.CenterAndExpand,
			};
			var description = new Label {
				Text = "CloudCakes aims to revolutionize the cake delivery business by delivering on-demand cakes and other treats with the click of a button. No longer will you need to go to the store or even remember your favorite type of cake - just signup for an account and you're good to go!"
			};

			var blogTitle = new Label {
				Text = "In The News",
				HorizontalOptions = LayoutOptions.CenterAndExpand
			};

			List<string> articles = new List<string> {
				"CloudCakes raises $50m and leads the Cake-as-a-Service models",
				"Top 10 Cities With the Best Cakes",
				"CloudCakes CEO awarded for Food Innovation Award 2016"
			};

			ListView articlesView = new ListView {
				ItemsSource = articles
			};

			Content = new StackLayout {
				Padding = 30,
				Spacing = 10,
				Children = { title, description, blogTitle, articlesView }
			};
		}
	}
}
```

We've added a lot of code here. The first thing we did was add a `label`, which is just a text area, for the title. Labels can have many different properties such as font size, color, position and in the title label we've decided to increase the font and center the text horizontally. The `description` label does not have any special characteristics so we just inserted the text. Next, we created a 3rd label for a subheading and then created a list of news articles. We first created an array of articles and then created a Xamarin Forms `ListView` component and populated it with the array of articles. Finally, to display all this to the user we created a `StackLayout`, which simply stacks components one on top of the other in the order provided, and populated it with the four components we created. To provide some better styling we added some padding and vertical spacing between the components.

To see our About Us page in action, let's go to the `CloudCakes.cs` file in the shared code directory and have the About Us page load on app startup. To do this. To accomplish this, we can remove the boilerplate code that displays the "Welcome to Xamarin Forms!" and instead instantiate the `MainPage` variable with our newly created about page.

```
public App ()
    {
		MainPage = new AboutPage();
	}
```

Launch the iOS simulator and you should see the newly created About Us page.

### Orders Page

Next, let's build the UI for the Orders Page. On this page, users will place orders for different types of cakes. For the UI here, we'll want to display the user information and a list of cakes a user can order. The user will be able to click on a cake they want we'll display a message saying that the cake has been ordered. Let's take a look at the code. We'll add comments and explanations inline with the code.

```
using System;
using System.Collections.Generic;
using Xamarin.Forms;

namespace CloudCakes
{
	public class OrdersPage : ContentPage
	{
		public OrdersPage ()
		{
			// We've created a new class for holding user data.
			User user = new User {
				Name = "Ado Kukic",
				Email = "ado@email.com",
				Avatar = "https://avatars1.githubusercontent.com/u/1770570?v=3&s=460"
			};

			// We've also created a new class to hold the cake information.
			List<Cake> cakes = new List<Cake> {
				new Cake ("Chocolate Overload", 15.99),
				new Cake ("Red Velvet Cake", 19.99),
				new Cake ("Strawberry Fusion", 14.99)
			};

			// Instead of using the StackLayout like in the about page
			// we've opted to use a GridLayout to have more flexibility
			Grid grid = new Grid{
				Padding = 30
			};

			// The GridLayout adds elements slightly differently
			// The first parameter is the element we are adding -
			// in this case we create an anonymous Image.
			// Additionally, we specify where we want the image to
			// be displayed in the grid. Here we've chosen 0, 0 which
			// means the image will be placed in the top left corner
			grid.Children.Add(new Image
				{
					Aspect = Aspect.AspectFit,
					WidthRequest = 60,
					HeightRequest = 60,
					Source = ImageSource.FromUri(new Uri(user.avatar)),

				}, 0,0 );

			grid.Children.Add(new Label
				{
					Text = user.Name,
					FontSize = Device.GetNamedSize (NamedSize.Large, typeof(Label)),
					HorizontalOptions = LayoutOptions.Center
				}, 1,0 );

			grid.Children.Add(new Label
				{
					Text = user.Email,
					HorizontalOptions = LayoutOptions.Center,
					VerticalOptions = LayoutOptions.Center
				}, 1, 0);

			// We loop through the available cakes and create a
			// button for each.
			for (var i = 0; i < cakes.Count; i++) {
				Button button = new Button {
					Text = cakes [i].Name + " ($" + cakes [i].Price + ")",
					VerticalOptions = LayoutOptions.Center,
				};
				// We implement a general click event that displays a popup
				// saying that an order was placed
				// Note: In a real world scenario you would likely use a closure
				// if you were implementing this functionality - but for simplicity
				// sake we just kept it simple.
				button.Clicked += (object sender, EventArgs e) => {
					DisplayAlert ("Order Placed", "Your cake order has been placed and will arrive in 15 minutes", "OK");
				};
				// We add the buttons to the grid. In this case
				// we pass additional parameters to have greater
				// control over how the content is displayed
				grid.Children.Add(button, 0, 2, i+1, i+3);
			}

            // Finally we pass our grid into the Content variable
			Content = grid;
		}
	}

    // This is where we create our two custom classes for the User and Cake objects
	public class User {
		public string Name { get; set;}
		public string Email { get; set;}
		public string Avatar { get; set;}
	}

	public class Cake {
		public string Name { get; set;}
		public double Price { get; set;}

		public Cake(string name, double price){
			this.Name = name;
			this.Price = price;
		}

	}

```

To see the newly created Orders page, let's go back into the CloudCakes.cs file and instead of loading up the About Us Page, let's load up the Orders page. Simply replace the `MainPage = new AboutPage();` with `MainPage = new OrdersPage();` and launch the simulator. If all went well you should see the orders page. *Note: We haven't implemented user authentication yet - so we've added some static content for the user for now.*

### Signup Page

The Signup Page will allow users to create new accounts. We will forgo any email validation and to make signups as easy as possible just require an email and password. Let's build the UI.

```
using System;
using Xamarin.Forms;

namespace CloudCakes
{
	public class SignupPage : ContentPage
	{
		public SignupPage ()
		{
		    // A new element we're creating here - the Entry element
            // Entry allows us to capture user input
            // We are adding a Placeholder attribute to tell the user
            // which data we want them to enter
			var email = new Entry {
				Placeholder = "Email"
			};

			// Similar to the email entry button, we capture the
            // users password here. To hide the password from being
            // displayed we set the `IsPassword` attribute to true
			var password = new Entry {
				Placeholder = "Password",
				IsPassword = true
			};

			var signupButton = new Button {
				Text = "Sign Up"
			};

			signupButton.Clicked += (object sender, EventArgs e) => {

			};
			Content = new StackLayout {
				Padding = 30,
				Spacing = 10,
				Children = {
					new Label { Text = "Signup for a CloudCakes Account", FontSize = Device.GetNamedSize (NamedSize.Large, typeof(Label)), HorizontalOptions = LayoutOptions.Center },email,password,signupButton
				}
			};
		}
	}
}

```

Now that we've implemented the UI, let's update the CloudCakes.cs file and set the MainPage to our newly created signup page to make sure that it works and looks how we expect it to. We haven't added the implementation for the signup so clicking on the signup button will not do anything. Let's run the simulator and see how are signup page will look.

### Homepage

The homepage of our application will also act as the login page. As users cannot place orders without first logging in, it wouldn't make sense to give them access to anything else before they are authenticated. In this section we will create the UI for the login page - we'll add the functionality later on in this tutorial. Let's look at the code that is going to make up our homepage/login page.

```
using System;
using Xamarin.Forms;

namespace CloudCakes
{
	public class HomePage : ContentPage
	{
		public HomePage ()
		{

			var title = new Label {
				Text = "Welcome to CloudCakes",
				FontSize = Device.GetNamedSize (NamedSize.Large, typeof(Label)),
				HorizontalOptions = LayoutOptions.CenterAndExpand,
			};

			var aboutButton = new Button {
				Text = "About Us"
			};
			var signupButton = new Button {
				Text = "Signup"
			};

			// Here we are implementing a click event using lambda expressions
			// when a user clicks the `aboutButton` they will navigate to the
			// About Us page.
			aboutButton.Clicked += (object sender, EventArgs e) => {
				Navigation.PushAsync(new AboutPage());
			};

			// Navigation to the Signup Page (Note: We haven't created this page yet)
			signupButton.Clicked += (object sender, EventArgs e) => {
				Navigation.PushAsync(new SignupPage());
			};

			var email = new Entry {
				Placeholder = "E-Mail",
			};

			var password = new Entry {
				Placeholder = "Password",
				IsPassword = true
			};

			var login = new Button {
				Text = "Login"
			};

			// With the `PushModalAsync` method we navigate the user
			// the the orders page and do not give them an option to
			// navigate back to the Homepage by clicking the back button
			login.Clicked += (sender, e) => {
				Navigation.PushModalAsync(new OrdersPage());
			};

			Content = new StackLayout {
				Padding = 30,
				Spacing = 10,
				Children = {title, email, password, login, signupButton, aboutButton}
			};
		}


	}
}
```

We're getting there! Let's go back to the `CloudCakes.cs` file and set the MainPage to our newly created homepage. For the navigation to work, we will additionally need to wrap the ContentPage with a NavigationPage class which will allow us to perform native navigation. The code should look like `MainPage = new NavigationPage(new HomePage());`. If all went according to plan, you should be able to launch the simulator and navigate to the About Us page, Signup page and Orders page.

> We purposefully built our UI backwards so that we could introduce the different Xamarin.Forms elements in smaller chunks.

## Add Authentication to Xamarin with Auth0

With the UI and navigation in place and functional we are ready to add the login and signup functionality to our application. We will use Auth0's RESTful API to authenticate and create new users. Additionally, we will use the RestSharp library and Newtonsoft's JSON library make interfacing with the API easier. As we won't be using a datastore for this simple demo, we will store the user credentials in the `Application.Current` namespace so that we can access the user data throughout our application.

First we will implement the login functionality. When a user enters their **Email** and **Password*, we will send this data to the Auth0 `oauth/ro` endpoint which will validate the credentials and if successful return the `id_token` and `access_token` which we will use to get the user data. If we do not get an `access_token` back we will let the user know that they have entered invalid credentials. Let's get started!

```

```

## Putting It All Together