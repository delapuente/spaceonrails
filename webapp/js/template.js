/*!
The template library
====================

The **template** library is an utility to specialize HTML in order to display
models. There are severals libraries to this end such as [Handlebars](http://handlebarsjs.com/)
but most of them works with precompiled template documents.

This one is based on a non-very-famous technique called [_template animation_](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you).
Although it is not very used dure to performance problems, it is a quite good
decission for didactical purposes as it illustrates several DOM manipulation
methods.
*/

/*!
The code
--------

Now we are using an autofunciton to keep our code isolated. The autofunciton
will receive the global object in order to export or import functionallity.
*/

(function (global) {
  /*! Applying this pattern, the `'use strict'` pragma is only needed here. */
  'use strict'

  function Template(reference) {
    var copy = reference.cloneNode(true);
    Object.defineProperty(this, 'reference', {
      get: function() { return copy; }
    });
  }

  function putIn(target, path, object) {
    var tokens = path.split('.');
    var current = tokens[0];
    if (tokens.length === 1) {
      if (typeof target[current] !== 'undefined') {
        throw new Error('Duplicated id for a template: "' + path + '"');
      }
      target[current] = object;
    }
    else {
      target[current] = target[current] || {};
      putIn(target[current], tokens.slice(1).join('.'), object);
    }
  }

  Template.prototype.render = function (objects) {
    objects = !Array.isArray(objects) ? [objects] : objects;
    var object, fragment = document.createDocumentFragment();
    for (var i = 0, l = objects.length; i < l; i++) {
      object = objects[i];
      fragment.appendChild(this.getFilledWith(object));
    }
    return fragment;
  };

  Template.prototype.getFilledWith = function (object) {
    var html = getHTML(this.reference);
    html = html.replace(/{{\s*(.*?)\s*}}/g, function (matching, id) {
      return id ? object[id] : object;
    });
    var container = document.createElement('div');
    container.innerHTML = html;
    delete container.children[0].dataset.template;
    return container.children[0];
  };

  function getHTML(element) {
    var container = document.createElement('div');
    container.appendChild(element.cloneNode(true));
    return container.innerHTML;
  };

  function gatherTemplates(root) {
    var library = {};
    var templates = root.querySelectorAll('[data-template]');
    for (var l = templates.length - 1, node; node = templates[l]; l--) {
      var path = node.dataset.template;
      putIn(library, path, new Template(node));
      node.parentNode.removeChild(node);
    }
    return library;
  };

  global.template = {
    Template: Template,
    getHTML: getHTML,
    gatherTemplates: gatherTemplates
  };

}(this));
