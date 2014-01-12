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

The git project has X tags matching the different stages of the project:

 0. `v0-plain` is the starting point. All the navigation is handled by the rails
 application and not even CSS has been applied yet.

 1. `v1-css` is a little evolution over the starting point. Some advanced CSS
 has been applied but the navigation continues being synchronous and template
 driven via server `*.erb` files.

 2. `v2.1-router` starts the web application providing the `webapp` folder
 as well as the skeleton for the router module (`webapp/js/router.js`).

 3. `v2.2-template` continues with the web application by providing the
 skeleton for the template processor (`webapp/js/template.js`), a little
 software to manipulate the DOM.

 4. `v2.3-webservice` introduces the final stage of the web application and
 provide the skeleton for the different controllers for each blog section
 (`webapp/js/controllers/`). Each controller will modify the model by
 using a REST API provided by the server in rails.

 5. `v3-testsuite` adds the test suite required to validate our architecture.

 6. `v4-done` implements the architecture and passes the test suite.

**NOTE**: At this moment, only `v0-plain`, `v1-css` and `v2.1-router` are
available.

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

Don't try to follow the story of the repository because it is likely to change
and being reorganized. The only purpose of tags is to provide different
snapshots to work from.
