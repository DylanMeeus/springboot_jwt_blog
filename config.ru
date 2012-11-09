require 'rack'
require 'rack/contrib/try_static'
require 'rack/contrib/static_cache'

system("jekyll")

use Rack::CommonLogger

use Rack::StaticCache, 
    :urls => ["/css", "/js" ], :root => "_site",
    :duration => 0.5

use Rack::TryStatic, 
    :root => "_site",   # static files root dir
    :urls => %w[/],     # match all requests 
    :try => ['.html', 'index.html', '/index.html'] # try these postfixes sequentially

map '/' do
  # otherwise 404 NotFound
  run Proc.new {|env| [404, {"Content-Type" => "text/html"}, ["Not Found... Sorry!"]] }
end