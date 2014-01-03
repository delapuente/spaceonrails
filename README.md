Space on Rails blog
===================

**Space on Rails blog** is a simple Ruby on Rails project to illustrate how
to pass from a _fat-server_ approach to a client based application.

Installation
------------

Clone the repository and enter the directory:

```bash
$ git clone https://github.com/lodr/spaceonrails
$ cd spaceonrails
```

Install Ruby dependencies (you'll need [bundler](http://bundler.io/)):

```bash
$ bundle install
```

Populate the database:

```bash
$ rake db:migrate
$ rake db:seed
```

Start the server:

```bash
$ rails server
```

Project stages
--------------

The git project has 5 tags matching the different stages of the project:

 0. `v0-plain` is the starting point. All the navigation is handled by the rails
 application and not even CSS has been applied yet.  
 1. `v1-css` is the second stage of maturity of the HTML5 application. CSS has
 been applied but the navigation continues being synchronous and template driven
 via server `*.erb` files.
 2. `v2-ajax` is the third evolution of the blog. All the navigation has been
 replaced by asynchronous HTTP requests and DOM & history manipulation via JS
 and HTML5 APIs. 
 3. `v3-testsuite` adds the test suite required to validate our architecture.
 4. `v4-done` implements the architecture and passes the test suite.
 
**NOTE**: At this moment, only `v0-plain` and `v1-css` are available.

Changing from one to another is as simple as making check out of the tag. I.e.:

```bash
$ git checkout v1-css
```

It is recommended to start a new branch while following the course so you can
make:

```bash
$ git checkout v0-plain
$ git checkout -b my-branch-from-v0
```
