
describe('The model proxy', function () {
  'use strict'

  var xhr, request, callback;
  var response = { test: 'test' };
  var responseText = JSON.stringify(response);
  var responseHeaders = { 'Content-Type': 'application/json' };

  beforeEach(function () {
    callback = sinon.spy();
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function (xhrequest) {
      request = xhrequest;
    };
  });

  afterEach(function () {
    xhr.restore();
  });

  it('Contains a set of methods to perform operation on the model. All ' +
  'the methods accept a callback as last parameter. The callback follows ' +
  'a node.js signature with the error as first parameter and the response as ' +
  'second.', function () {  });

  describe('Post related methods', function () {

    it('`getPostList(callback)` asks for the complete list of posts',
    function () {
      model.getPostList(callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('http://localhost:3000/posts');
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`getPostList(n, callback)` asks for the nth page of posts',
    function () {
      var page = 3;
      model.getPostList(page, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('http://localhost:3000/posts?page=' + page);
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`getPost(id, callback)` asks for the post with the specified id',
    function () {
      var id = 3;
      model.getPost(id, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('http://localhost:3000/posts/' + id);
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`deletePost(id, callback)` deletes the post with the specified id',
    function () {
      var id = 3;
      model.deletePost(id, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.method).toBe('DELETE');
      expect(request.url).toBe('http://localhost:3000/posts/' + id);
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`updatePost(id, patch, callback)` updates the post with the ' +
    'specified id with the JS object specified.', function () {
      var id = 3, patch = { test: 'test' };
      model.updatePost(id, patch, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.requestHeaders['Content-Type'])
        .toBe('application/json;charset=utf-8');
      expect(request.method).toBe('PATCH');
      expect(request.url).toBe('http://localhost:3000/posts/' + id);
      expect(request.requestBody).toBe(JSON.stringify(patch));
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`newPost(post, callback)` put the post specified in post in the server',
    function () {
      var post = { test: 'test' };
      model.newPost(post, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.requestHeaders['Content-Type'])
        .toBe('application/json;charset=utf-8');
      expect(request.method).toBe('POST');
      expect(request.url).toBe('http://localhost:3000/posts');
      expect(request.requestBody).toBe(JSON.stringify(post));
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

  });

  describe('Comment related methods', function () {

    it('`newComment(postId, comment, callback)` adds a new comment for the ' +
    'specified post', function () {
      var id = 3, comment = { test: 'test' };
      model.newComment(id, comment, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.requestHeaders['Content-Type'])
        .toBe('application/json;charset=utf-8');
      expect(request.method).toBe('POST');
      expect(request.url)
        .toBe('http://localhost:3000/posts/' + id + '/comments');
      expect(request.requestBody).toBe(JSON.stringify(comment));
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`getComments(id, callback)` asks for the comments for the post with ' +
    'specified id', function () {
      var id = 3;
      model.getComments(id, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url)
        .toBe('http://localhost:3000/posts/' + id + '/comments');
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

    it('`deleteComment(postId, id, callback)` deletes the comment with the ' +
    'given id for the post with the specified id.', function () {
      var postId = 1, id = 3;
      model.deleteComment(postId, id, callback);
      request.respond(200, responseHeaders, responseText);

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('DELETE');
      expect(request.url)
        .toBe('http://localhost:3000/posts/' + postId + '/comments/' + id);
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(null)).toBe(true);
    });

  });

});
