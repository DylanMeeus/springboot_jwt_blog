This is a clone of the qraftlabs blog at [http://blog.qraftlabs.com](http://blog.qraftlabs.com).

This blog uses [Jekyll](https://github.com/mojombo/jekyll).


## Create a new blog post

	rake new_post["title of the new blog post"]

## Manage posts in the "Top Reads" section

To add a post to the "Top Reads" section you must add the tag `featured` to it. Use the `pr:` yaml front matter to sort its position. (e.g. `pr: 1` is the top post in the section).

## Customize your post's design

Use the yaml front matter in your post to customize its design. The `design` variable supports the following parameters. All of these parameters are optional.

```
---
design:
  bg_color: Set the background color for your post's header. (You can use rgb or hex colors inside double quotes) 
  bg_merge: Set to true to merge your image with your header's background color (default is false)
  image: A url path to your posts image, it will be downsized if too big to fit inside a circle.
  image-size: Set the maximum size your image will have relative to the circle. (Default is "120%")
  image_top: Set the the top offset relative to the center of the image. (Default is "50%")
  image_left: Set the the left offset relative to the center of the image. (Default is "50%")
---
```


## Run

1.  Make sure you have [RVM](http://rvm.io/) or other ruby version manager installed. 
2.  Enter the blog directory and make sure with ruby --version that you are running the right ruby version (.ruby-version file).
3.  Install dependencies with `bundle install`
4.  `bundle exec jekyll serve --watch`
5.  Open [http://localhost:4000/blog/](http://localhost:4000/blog/). Make sure you don't leave out the trailing slash (/), otherwise you will get:
![error](https://i.cloudup.com/FWLX_cUhXb.png)


## License

All the infrastracture to run this blog is open sourced under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

The exact content of the articles (the _posts folder) is Qraftlabs Copyright.
