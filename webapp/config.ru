require 'rack/rewrite'

use Rack::Rewrite do
  rewrite   %r{/posts\.*$},    '/index.html'
end

use Rack::Static,
  :urls => ["/fonts", "/images", "/js", "/lib", "/specs", "/styles"],
  :root => "."

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('index.html', File::RDONLY)
  ]
}
