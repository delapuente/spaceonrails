use Rack::Static,
  :urls => [
    "/fonts", "/images", "/js", "/lib", "/specs", "/styles",
    "/test-runner.html"
  ]

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
