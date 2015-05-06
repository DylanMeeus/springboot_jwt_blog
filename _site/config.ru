require 'rack/contrib/try_static'

use Rack::TryStatic,
  :urls => ["/img", "/js", "/css"],
  :root => "_site"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => '_site, max-age=86400'
    },
    File.open('_site/index.html', File::RDONLY)
  ]
}
