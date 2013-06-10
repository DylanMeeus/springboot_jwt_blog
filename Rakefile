require "stringex"
new_post_ext = "markdown"
posts_dir    = "_posts"

#usage rake
desc 'push to github, deploy to heroku and finally notify search engines about the sitemap.xml'
task :default do
  puts '* Pushing to github'
  `git push origin`

  puts '* Deploying to heroku'
  `git push heroku`

  #notify search engines
  Rake::Task["sitemap"].invoke
end

#usage rake sitemap, but this task will be executed automatically after deploying
desc 'notify search engines'
task :sitemap do
  begin
    require 'net/http'
    require 'uri'
    puts '* Pinging Google about our sitemap'
    Net::HTTP.get('www.google.com', '/webmasters/tools/ping?sitemap=' + URI.escape('http://blog.auth0.com/sitemap.xml'))
  rescue LoadError
    puts '! Could not ping Google about our sitemap, because Net::HTTP or URI could not be found.'
  end
end

# borrowed this from octopress
# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in _posts"
task :new_post, :title do |t, args|
  mkdir_p "#{posts_dir}"
  args.with_defaults(:title => 'new-post')
  title = args.title
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
    post.puts "author: "
    post.puts "  name: <YOUR NAME>"
    post.puts "  url: <YOUR URL>"
    post.puts "  mail: <YOUR MAIL>"
    post.puts "tags: "
    post.puts "- foo"
    post.puts "---"
  end
end
