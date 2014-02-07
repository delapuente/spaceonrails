
describe('The template library', function () {
  'use strict'

  var Template = template.Template;
  var getHTML = template.getHTML;

  var fakeDocument;
  beforeEach(function () {
    fakeDocument = document.createElement('div');
    fakeDocument = document.implementation.createHTMLDocument();
    fakeDocument.body.innerHTML =
      '<span data-template="test"><a href="/post/{{ id }}">{{title}}</a>' +
      '</span>';
  });

  describe('Template instances', function () {

    it('are built from an element took as reference', function () {
      var reference = fakeDocument.body.children[0];
      var template = new Template(reference);

      expect(template.reference).not.toBe(reference);
      expect(template.reference.tagName).toBe(reference.tagName);
      expect(template.reference.innerHTML).toBe(reference.innerHTML);
    });

    describe('the `render()` method', function () {

      it('accepts an object and return a document fragment with a copy of ' +
      'the reference replacing `{{ key }}` substrings with the object values ' +
      'for those keys.', function () {
        var reference = fakeDocument.body.children[0];
        var template = new Template(reference);
        var object = { title: 'Test title', id: 1 };
        var rendered = template.render(object);

        expect(rendered instanceof DocumentFragment).toBe(true);
        expect(getHTML(rendered))
          .toBe('<span><a href="/post/1">Test title</a></span>');
      });

      it('removes the `data-template` custom attribute if present.',
      function () {
        var reference = document.createElement('span');
        reference.setAttribute('data-template', '');
        var template = new Template(reference);
        var rendered = template.render({});
        expect(getHTML(rendered)).toBe('<span></span>');
      });


      it('accepts an array of objects and return a document fragment with ' +
      'many copies of the reference as array items, each of them filled with' +
      'the corresponding object.', function () {

        var reference = fakeDocument.body.children[0];
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

  describe('`getHTML()` helper function', function () {
    it('gets the HTML for an element.', function () {
      var test = document.createElement('div');
      test.innerHTML = '<span>Test</span>';
      expect(getHTML(test)).toBe('<div><span>Test</span></div>');
    });
  });

  describe('the `gatherTemplates()` utility', function () {

    it('collects and detach from the passed node all the templates returning' +
    'a dictionary of templates indexed by the names of the template.',
    function () {
      var templateLibrary = template.gatherTemplates(fakeDocument);
      expect(templateLibrary.test).toBeDefined();
      expect(templateLibrary.test instanceof Template).toBe(true);
      expect(getHTML(templateLibrary.test.reference))
        .toBe('<span data-template="test">' +
              '<a href="/post/{{ id }}">{{title}}</a></span>');
      expect(fakeDocument.body.children.length).toBe(0);
    });

    it('allows dot notation inside a name template to nest templates.',
    function () {
      fakeDocument.body.innerHTML =
        '<span data-template="test.a"><a href="/post/{{ id }}">{{title}}</a>' +
        '</span>' +
        '<span data-template="test.b"><a href="/post/{{ id }}">{{title}}</a>' +
        '</span>';
      var templateLibrary = template.gatherTemplates(fakeDocument);
      expect(typeof templateLibrary.test).toBe('object');
      expect(templateLibrary.test.a instanceof Template).toBe(true);
      expect(templateLibrary.test.b instanceof Template).toBe(true);
      expect(fakeDocument.body.children.length).toBe(0);
    });

    it('complains if repeated ids found', function () {
      fakeDocument.body.innerHTML =
        '<span data-template="test.a"><a href="/post/{{ id }}">{{title}}</a>' +
        '</span>' +
        '<span data-template="test.a"><a href="/post/{{ id }}">{{title}}</a>' +
        '</span>';
      function gatherWithRepeatedIds() {
        var templateLibrary = Template.gatherTemplates(fakeDocument);
      }
      expect(gatherWithRepeatedIds).toThrow();
    });

  });

});
