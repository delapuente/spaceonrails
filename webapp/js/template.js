/*!
The Template class
==================

*/

/*!
The code
--------
*/

(function (exports) {
  'use strict'

  function Template(reference) {
    var copy = reference.cloneNode(true);
    Object.defineProperty(this, 'reference', {
      get: function() { return copy; }
    });
  }

  Template.prototype.getHTML = function (element) {
    var container = document.createElement('div');
    container.appendChild(element.cloneNode(true));
    return container.innerHTML;
  };

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
    var html = this.getHTML(this.reference);
    html = html.replace(/{{\s*(.*?)\s*}}/g, function (matching, id) {
      return id ? object[id] : object;
    });
    var container = document.createElement('div');
    container.innerHTML = html;
    delete container.children[0].dataset.template;
    return container.children[0];
  };

  exports.Template = Template;

}(this));
