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

The goal of the course is to show the single-page application approach. This
application is in the `webapp` folder and rely on the rails server running on
`localhost:3000`. To run the static server for the webapp, enter the directory
and install ruby dependencies:

```bash
$ bundle install
```

Now make:

```bash
$ rackup -p 8000
```

Project stages
--------------

The git project has X tags matching the different stages of the project:

### Stage 0: plain

```bash
$ git checkout v0-plain
```

The `v0-plain` tag is the starting point. All the navigation is handled by the
rails application in the server and not even CSS has been applied yet.

### Stage 0: css

```bash
$ git checkout v0-css
```

The `v0-css` shows a little evolution from the previous point. It shows how
CSS3 can be used to improve the aspect of the application. Anyway, all the
functionallity is still managed by the server application.

### Stage 1: router

```bash
$ git checkout v1-router
```

```bash
$ git checkout v1-router-end
```

The router is the main component to perform client navigation without loosing
HTML5 semantics on the way. The two tags `v1-router` and `v1-router-end`
provide the skeleton for the component and an annotated implementation
respectively.

The latter can be found in `webapp/docs/routes.js.html`.

### Stage 2: templates

```bash
$ git checkout v2-template
```

```bash
$ git checkout v2-template-end
```

A template library is a piece of software able to produce HTML based on
reference markup with placeholders and data. The tag `v2-template` provides
a Jasmine specification while the `v2-template-end` includes a compliant
implementation.

The file `webapp/js/views.js` is an example of real use.

Again, annotated source can can be found in `webapp/docs/templates.js.html`.

With templates we add the Jasmine TDD library so we move towards a new stage
in the application.

### Stage 3: model

```bash
$ git checkout v3-model
```

```bash
$ git checkout v3-model-end
```

The model is the piece of software in charge of maintain the data of your
application in a convenient way. The blog presents a RESTful API to manipulate
the model but you still need a library in the client to abstract the server
access into high level commands. In `v3-model` you have the Jasmine
specification and in `v3-model-end` a compliant implementation.

Views are evolved as well to integrate with the model and you can see the usage
in `webapp/js/views.js`. One more time, the annotated source can can be found
in `webapp/docs/model.js.html`.

Now we are adding Sinon mockup and stub library and we enter the last stage of
the application.

Notes
-----

It is recommended to start a new branch while following the course so you can
make:

```bash
$ git checkout v0-plain
$ git checkout -b my-branch-from-v0
```

Don't try to follow the story of the repository because it is likely to change
and being reorganized. The only purpose of tags is to provide different
snapshots to work from.
