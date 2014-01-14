
describe('The Template class', function () {
  'use strict'

  var fakeDocument;

  beforeEach(function () {
    fakeDocument = document.createElement('div');
    fakeDocument.innerHTML =
      '<span><a href="/post/{{ id }}">{{title}}</a></span>';
  });

  var getHTML = Template.prototype.getHTML;

  describe('`getHTML()` helper function', function () {
    it('gets the HTML for an element.', function () {
      var test = document.createElement('div');
      test.innerHTML = '<span>Test</span>';
      expect(Template.prototype.getHTML(test))
        .toBe('<div><span>Test</span></div>');
    });
  });

  describe('Template instances', function () {

    it('are built from an element took as reference', function () {
      var reference = fakeDocument.children[0];
      var template = new Template(reference);

      expect(template.reference).not.toBe(reference);
      expect(template.reference.tagName).toBe(reference.tagName);
      expect(template.reference.innerHTML).toBe(reference.innerHTML);
    });

    describe('the `render()` method', function () {

      it('accepts an object and return a document fragment with a copy of ' +
      'the reference filled with object values.', function () {
        var reference = fakeDocument.children[0];
        var template = new Template(reference);
        var object = { title: 'Test title', id: 1 };
        var rendered = template.render(object);

        expect(rendered instanceof DocumentFragment).toBe(true);
        expect(getHTML(rendered))
          .toBe('<span><a href="/post/1">Test title</a></span>');
      });

      it('accepts an array of objects and return a document fragment with ' +
      'many copies of the reference as array items, each of them filled with' +
      'the corresponding object.', function () {

        var reference = fakeDocument.children[0];
        var template = new Template(reference);
        var objects = [
          { title: 'Test title', id: 1 },
          { title: 'Test title 2', id: 2 }
        ];
        var rendered = template.render(objects);

        expect(rendered instanceof DocumentFragment).toBe(true);
        expect(rendered.children.length).toBe(2);

        expect(getHTML(rendered.children[0]))
          .toBe('<span><a href="/post/1">Test title</a></span>');
        expect(getHTML(rendered.children[1]))
          .toBe('<span><a href="/post/2">Test title 2</a></span>');
      });

      it('removes the `data-template` custom attribute if present.',
      function () {
        var reference = document.createElement('span');
        reference.setAttribute('data-template', '');
        var template = new Template(reference);
        var rendered = template.render({});
        expect(getHTML(rendered)).toBe('<span></span>');
      });

      it('accepts the syntax {{}} to replace by the object itself.',
      function () {
        var reference = document.createElement('span');
        reference.innerHTML = '{{}}';
        var template = new Template(reference);
        var rendered = template.render('test');
        expect(getHTML(rendered)).toBe('<span>test</span>');
      });

    });

  });

});
