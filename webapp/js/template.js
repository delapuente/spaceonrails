/*!
The template library
====================

The **template** library is an utility to fill HTML fragments in order to
display models. There are severals libraries to this end out there, most of
them use precompiled versions of the templates (see [Handlebars](http://handlebarsjs.com/))
for performance reasons.

This one is based on a non-very-famous technique called [_template animation_](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you).
Although it can loose on performance, this technique is a quite good
decission for didactical purposes as it requires several DOM manipulation.
*/

/*!
The code
--------

Now we are using an autofunction to keep our code isolated. The autofunction
will receive the global object in order to export or import functionallity.
This is a variation of [**revealing module pattern**](http://carldanley.com/js-revealing-module-pattern/)
where not a single line of JS is executed out of the autofunction.
*/

(function (global) {
  /*!
  Applying this isolation pattern, the `'use strict'` pragma is only needed
  here and **all our code** will be executed in strict mode.
  */
  'use strict'

  function Template(reference) {
    var copy = reference.cloneNode(true);
  /*!
  `Object.defineProperty()` method is new to JS 1.8 and allow defining
  properties of objects in several ways via a [descriptor object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).
  This case we are defining a read-only (by default) property.
  */
    Object.defineProperty(this, 'reference', { value: copy });
  }

  /*!
  The main method of the render object is quite simple. Just normalize the
  parameter to be an array and ask for a new interpolated object for each
  object in the array.
  */
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
  /*!
  All the trick is here. The regular expression detects the field intended to
  be used in the HTML and replaces it by the proper value.
  */
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

  /*!
  A recursive definition is an elegant way of defining this dot-notation
  accessor by considering the base case that when no _dots_ remain.
  */
  function putIn(target, path, object) {
    var tokens = path.split('.');
    var current = tokens[0];
    var remainingPath = tokens.slice(1).join('.');
    if (tokens.length === 1) {
      if (typeof target[current] !== 'undefined') {
        throw new Error('Duplicated id for a template: "' + path + '"');
      }
      target[current] = object;
    }
    else {
      target[current] = target[current] || {};
      putIn(target[current], remainingPath, object);
    }
  }

  global.template = {
    Template: Template,
    getHTML: getHTML,
    gatherTemplates: gatherTemplates
  };

}(this));
