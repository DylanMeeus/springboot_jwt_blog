---
layout: post
title: "Building a REST API in Rust with Nickel.rs and MongoDB"
description: "Learn how to implement a simple REST API with Rust using the Nickel.rs web framework and the MongoDB Rust Driver."
date: 2015-11-24 12:00
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design: 
  image: https://cdn.auth0.com/blog/rust-api/rust-logo.png
  bg_color: "#564941"
  image_size: "90%"
  image_bg_color: "#fff"
tags: 
- rust
- cargo
- mongodb
- api
- rest
---

---
**TL;DR:** Open source crates like **[Nickel.rs](http://nickel.rs/)** and the **[MongoDB Rust Driver](https://github.com/mongodb-labs/mongo-rust-driver-prototype)** make it possible to create RESTful APIs in the Rust language. In this article, we cover how to do `GET`, `POST` and `DELETE` requests on user data. Check out the [repo](https://github.com/auth0/rust-api-example) to get the code.

---
[Rust](https://www.rust-lang.org/) is a fairly new **systems** programming language that is developed and maintained by Mozilla. It surfaced in 2010 and has been gaining a lot of traction since.

Rust has many concepts that are familiar and seen frequently in other languages, and some that aren't. A unique feature that Rust has is the way it enforces memory safety. It doesn't have a garbage collector like some other languages do, but rather handles memory allocation with the concept of **ownership**. With ownership, the compiler automatically deallocates memory when something goes out of scope.

While Rust is a general-purpose programming language, there are many packages available that make it possible to spin up a web server with it. This means that Rust might be the ideal choice for a web project if memory safety and speed are non-trivial.

In this article, we'll see how we can create a simple RESTful API with Rust. We'll also connect it to MongoDB so we can get a feel for a full end-to-end API solution. It's possible that many readers will be familiar with JavaScript and, in particular, NodeJS. For this reason, we'll intentionally draw some comparisions between our Rust implementation and how an API would be created in NodeJS. While this won't be a crash-course in the Rust language itself, we'll also take some time to explain syntax and semantics in certain places.

## Installing Rust and Setting Up the Project

To create and serve our API, we'll use **[Nickel.rs](http://nickel.rs/)**, and to interact with the database, we'll use the **[MongoDB Rust Driver](https://github.com/mongodb-labs/mongo-rust-driver-prototype)**. There are other crates (aka packages) available, especially for creating a server and API, but Nickel.rs offers an abstraction that provides a similar feel to NodeJS and, in particular, Express. This can be helpful for those coming from a Node background. 

If you don't already have Rust installed, the easiest way to get it is with the **rustup** script. If you're not on a Mac, or if you want to build from source, see the [full installation instructions](https://doc.rust-lang.org/stable/book/installing-rust.html).

```bash
curl -sf -L https://static.rust-lang.org/rustup.sh | sh
```

Within our project directory, we need a `Cargo.toml` file at the root, and a `src` folder with a `main.rs` file.

```bash
|-- src
  |-- main.rs
Cargo.toml
```

The `Cargo.toml` file is where we put some information about our project, and is also where we list the dependencies we need.

```bash
[package]

name = "rust-users"
version = "0.0.1"
authors = [ "Firstname Lastname <you@email.com>" ]

[dependencies]
nickel = "*"
mongodb = "*"
bson = "*"
rustc-serialize = "*"
```

We already mentioned that we'd need **Nickel** and the **MongoDB Rust Driver**. We also need the **BSON** crate to encode and decode BSON data, as well as **rustc-serialize** for formatting JSON that will be returned by the API.

As the last setup step, we need to simply place a `main` function within `main.rs` so the program can compile.

```rust
// src/main.rs

fn main() {
  
}
```

With that in place, let's compile what we have so far to get the project kicked off. Doing so will download all of the necessary dependencies and will also place some additional folders and files in the project directory.

```bash
cargo run
```

## Setting Up the API

Our API will have three endpoints:

* **GET** `/users` - retrieves a JSON string of all the users
* **POST** `/users/new` - saves a new user
* **DELETE** `/users/:user_id` - deletes a user based on an ID

To take things one step at a time, let's first get the API running and simply return a message to confirm things are working from each endpoint.

```rust
// src/main.rs

#[macro_use] 
extern crate nickel;

use nickel::{Nickel, JsonBody, HttpRouter};

fn main() {

    let mut server = Nickel::new();
    let mut router = Nickel::router();

    router.get("/users", middleware! { |request, response|

        format!("Hello from GET /users")

    });

    router.post("/users/new", middleware! { |request, response|

        format!("Hello from POST /users/new")

    });

    router.delete("/users/:user_id", middleware! { |request, response|

        format!("Hello from DELETE /users/:user_id")

    });

    server.utilize(router);

    server.listen("127.0.0.1:9000");
}
```

Starting at the top, we're referencing the external **nickel** crate and loading in all of its macros with `#[macro_use]`. Like functions, macros in Rust let us abstract away code into reusable blocks. One of the differences with a macro is that it can be abstracted at the syntactic-level, which can offer some benefits over functions.

In the `main` function, we first assign **server** and **router** instances to mutable variables. Next, we set up our endpoint routing and provide a simple message in the `format!` macro to be displayed when these endpoints are accessed. The `middleware!` macro is provided by Nickel.rs and reduces the amount of boilerplate code needed for each route. Double pipe characters represent a closure in Rust, and this is where our `request` and `response` paramaters go.

Finally, we need to `utilize` the server and `listen` for it on `localhost:9000`.

At this point, it's easy to see some similarities between Nickel.rs and Express. This is by design, and is nice for those coming to Rust from NodeJS.

If we compile the program with `cargo run`, we can see the API is working.

![rust api GET request](https://cdn.auth0.com/blog/rust-api/rust-api-1.png)

## Connecting to a MongoDB Collection

The MongoDB Rust Driver provides a nice interface for interacting with databases, collections and cursors. With it, we can establish a database connection and create, read, update, and delete documents as we typically would. 

MongoDB will need to be installed and running at this point, which we won't cover in this article. To get set up with MongoDB, follow the [getting started guide](https://docs.mongodb.org/getting-started/shell/).

Let's start by establishing a connection and getting the **POST** `/users/new` route working. We'll need to bring in the dependencies we have yet to reference, and `use` their components.

```rust
// src/main.rs

#[macro_use] 
extern crate nickel;

extern crate rustc_serialize;

#[macro_use(bson, doc)]
extern crate bson;
extern crate mongodb;

// Nickel
use nickel::{Nickel, JsonBody, HttpRouter};
use nickel::status::StatusCode::{self};

// MongoDB
use mongodb::{Client, ThreadedClient};
use mongodb::db::ThreadedDatabase;
use mongodb::error::Result as MongoResult;

// bson
use bson::{Bson, Document};
use bson::oid::ObjectId;

// rustc_serialize
use rustc_serialize::json::{Json, ToJson};

...
```

We'll need to create a `struct` that is encodable and decoable and gives structure to how our user data should be modeled.

```rust
// src/main.rs

...

#[derive(RustcDecodable, RustcEncodable)]
struct User {
    firstname: String,
    lastname: String,
    email: String
}
```

A `struct` in Rust give us a way to create data types that can be arbitrarily complex.

### Saving User Data 

Now within our `/users/new` route, we can connect to the database and insert a document.

```rust
// src/main.rs

...

router.post("/users/new", middleware! { |request, response|

    // Accept a JSON string that corresponds to the User struct
    let user = request.json_as::<User>().unwrap();

    let firstname = user.firstname.to_string();
    let lastname = user.lastname.to_string();
    let email = user.email.to_string();

    // Connect to the database
    let client = Client::connect("localhost", 27017)
        .ok().expect("Error establishing connection.");

    // The users collection
    let coll = client.db("rust-users").collection("users");

    // Insert one user
    match coll.insert_one(doc! { 
        "firstname" => firstname,
        "lastname" => lastname,
        "email" => email 
    }, None) {
        Ok(_) => (StatusCode::Ok, "Item saved!"),
        Err(e) => return response.send(format!("{}", e))
    }

});

...
```

We accept the request as a JSON string that should conform to the `User` struct and create some variables to hold its data. The `unwrap` method is one of several ways that Rust provides for assigning a value. While Rust provides a `match` statement to check for a value's existence and then respond with both a success and error case, `unwrap` is a quick way of assuming that the value will be present. We can see the `match` statement at work when we use `coll.insert_doc` to insert the user data. In the `Ok` condition, we respond with a success message, and in the `Err` condition we respond with an error.

For this route, we need to send a JSON string to the endpoint to save the data.

![rust api POST request](https://cdn.auth0.com/blog/rust-api/rust-api-2.png)

We should get a success message and be able to see the user saved in the database.

![rust api mongodb result](https://cdn.auth0.com/blog/rust-api/rust-api-3.png)

### Fetching User Data

It's easy to return JSON data from an endpoint when building a NodeJS app with MongoDB and Express, but it's a bit trickier with the current MongoDB driver implementation. One way to return JSON data effectively is to format MongoDB documents as a JSON string and then return the string. This would then need to be parsed on the front end with `JSON.parse`.

```rust
// src/main.rs

...

fn get_data_string(result: MongoResult<Document>) -> Result<Json, String> {
    match result {
        Ok(doc) => Ok(Bson::Document(doc).to_json()),
        Err(e) => Err(format!("{}", e))
    }
}

router.get("/users", middleware! {

    // Connect to the database
    let client = Client::connect("localhost", 27017)
      .ok().expect("Error establishing connection.");

    // The users collection
    let coll = client.db("rust-users").collection("users");

    // Create cursor that finds all documents
    let mut cursor = coll.find(None, None).unwrap();

    // Opening for the JSON string to be returned
    let mut data_result = "{\"data\":[".to_owned();

    for (i, result) in cursor.enumerate() {
        match get_data_string(result) {
            Ok(data) => {
                let string_data = if i == 0 { 
                    format!("{}", data)
                } else {
                    format!("{},", data)
                };

                data_result.push_str(&string_data);
            },

            Err(e) => return response.send(format!("{}", e))
        }
    }

    // Close the JSON string
    data_result.push_str("]}");

    // Send back the result
    format!("{}", data_result)

});

...
```

For our **GET** `/users` route, we establish a `cursor` for the endpoint which uses the `find` method to get all the documents in the `users` collection. We then iterate over the results with a `for` loop and match the results against a function called `get_data_string`. This function expects an argument of type `MongoResult` and returns a JSON string using `Bson::Document` for decoding, which happens in the `Ok` branch of the `match` statement. 

To properly parse the string on the front end, we'll need to cater to cases where there is only a single document returned and when there are multiple. If there are multiple, we need to include a comma between the results, and if there is only one, we need to omit it. The `format!` macro takes a positional specifier in this case, and returns the value of `data` that is passed as the second argument.

Finally, we close the `data_result` string before sending the data back.

![rust api GET request](https://cdn.auth0.com/blog/rust-api/rust-api-4.png)

### Deleting User Data

The final step for this example API is to allow for users to be deleted by their `objectid`. We can do this with the MongoDB Rust Driver's `delete_one` method.

```rust
// src/main.rs

...

router.delete("/users/:user_id", middleware! { |request, response|

    let client = Client::connect("localhost", 27017)
        .ok().expect("Failed to initialize standalone client.");

    // The users collection
    let coll = client.db("rust-users").collection("users");

    // Get the user_id from the request params
    let user_id = request.param("user_id").unwrap();

    // Match the user id to an bson ObjectId
    let id = match ObjectId::with_string(user_id) {
        Ok(oid) => oid,
        Err(e) => return response.send(format!("{}", e))
    };

    match coll.delete_one(doc! {"_id" => id}, None) {
        Ok(_) => (StatusCode::Ok, "Item deleted!"),
        Err(e) => return response.send(format!("{}", e))
    }

});

...
```

We use the `ObjectId::with_string` helper to decode the string representation of the `objectid`, after which it can be used in the `delete_one` method to remove the document for that user.

With the **DELETE** `/users/:user_id` route in place, we should be able to remove users from the database when we make a request to it and include the `objectid` as a parameter.

## Aside: Authentication is Easy with Auth0

Auth0 issues [JSON Web Tokens](http://jwt.io) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social (Facebook, Github, Twitter, etc.), enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code. Auth0 is perfect for [Single Page Applications](https://auth0.com/docs/sequence-diagrams) and very easy to set up.

## Wrapping Up

Rust offers some great benefits, especially around memory safety, pattern matching, and data race avoidance. This can be really important in some applications. For projects that also need to expose a data API, crates like Nickel.rs and the MongoDB Rust Driver can work well together.

Typically, an API written in Rust will require more code than if it were written in NodeJS using Express. Ultimately, any decision around which to use comes down to the tradeoffs associated with both and what is most appropriate for a given project. Developing an API with NodeJS can be faster and more concise, but Rust offers guarantees around memory safety that make it attractive.
