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

Xamarin allows you to build native iOS, Android, Windows and Mac applications in C#. The company was founded by the creators of Mono and recently acquired by Microsoft. Over 1 million developers are using Xamarin to build apps like CineMark, MixRadio and Bastion. Xamarin is a great fit for companies who are already embedded in the Microsoft stack and have developers programming in C#. The Xamarin Platform runs on both Windows and Mac so you truly are not limited to Windows.

C# is an excellent programming language. Statically typed, object-oriented, garbage collected and asynchronous are just some of the features C# provides. With Xamarin, your entire app will be written in C# and then compiled to it's native binary. The Xamarin Platform exposes platform specific API's when needed, interfaced again with C#, but generally you will be able to write the majority of your code once and have it run everywhere.

## Getting Started with Xamarin

Let's dive in and actually write some code. The first thing we'll need is the actual Xamarin Platform installed on our machine. Head over the the Xamarin website and download it. Once downloaded, the installer will ask you which platforms you are planning on developing for and will download additional dependencies automatically.

With Xamarin Studio installed, we are ready to create our first project. Open up Xamarin Studio and click the **New Solution** button in the top left corner to get started. The first screen we're presented with will ask us what type of application we're building. We'll select Cross-Platform App as we're building an application that we want available on iOS and Android.