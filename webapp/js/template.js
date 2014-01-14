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

(function (global) {
  'use strict'

  function Template(reference) {
    // Set the reference
  }

  Template.prototype.render = function (objects) {
    /* Interpolate the reference with objects: */

    // 1. If the object is not an array, return a document fragment with a copy
    // of the reference interpolated with the object.

    // 2. If the object is an array, return a document fragment with as many
    // copies as objects, each interpolated by one of the objects.
  };

  function getHTML(element) {
    // Return the HTML for the element
  };

  function gatherTemplates(root) {
    // Build an object with all the templates
  };

  function putIn(target, path, object) {
    // Provide a recursive implementation to follow a path in `dot notation`
  }

  global.template = {
    Template: Template,
    getHTML: getHTML,
    gatherTemplates: gatherTemplates
  };

}(this));
