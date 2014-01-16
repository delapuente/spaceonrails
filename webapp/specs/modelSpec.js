
describe('The model proxy', function () {
  'use strict'

  var xhr, request, callback;
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

  describe('Post related methods()', function () {

    it('`getPostList()` asks for the complete list of posts', function () {
      model.getPostList(callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('localhost:3000/posts');
      expect(callback.calledOnce).toBe(true);
    });

    it('`getPostList(n)` asks for the nth page of posts', function () {
      var page = 3;
      model.getPostList(page, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('localhost:3000/posts?page=' + page);
      expect(callback.calledOnce).toBe(true);
    });

    it('`getPost(id)` asks for the post with the specified id', function () {
      var id = 3;
      model.getPost(id, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('localhost:3000/posts/' + id);
      expect(callback.calledOnce).toBe(true);
    });

    it('`deletePost(id)` deletes the post with the specified id', function () {
      var id = 3;
      model.deletePost(id, callback);
      request.respond(200, {}, '');

      expect(request.method).toBe('DELETE');
      expect(request.url).toBe('localhost:3000/posts/' + id);
      expect(callback.calledOnce).toBe(true);
    });

    it('`updatePost(id, patch)` updates the post with the specified id with ' +
    'the JS object specified.', function () {
      var id = 3, patch = { test: 'test' };
      model.updatePost(id, patch, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('PATCH');
      expect(request.url).toBe('localhost:3000/posts/' + id);
      expect(request.requestBody).toBe(JSON.stringify(patch));
      expect(callback.calledOnce).toBe(true);
    });

    it('`newPost(post)` put the post specified in post in the server',
    function () {
      var post = { test: 'test' };
      model.newPost(post, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('POST');
      expect(request.url).toBe('localhost:3000/posts');
      expect(request.requestBody).toBe(JSON.stringify(post));
      expect(callback.calledOnce).toBe(true);
    });

  });

  describe('Comment related methods', function () {

    it('`newComment(postId, comment)` adds a new comment for the ' +
    'specified post', function () {
      var id = 3, comment = { test: 'test' };
      model.newComment(id, comment, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('POST');
      expect(request.url).toBe('localhost:3000/posts/' + id + '/comments');
      expect(request.requestBody).toBe(JSON.stringify(comment));
      expect(callback.calledOnce).toBe(true);
    });

    it('`getComments(id)` asks for the comments for the post with specified ' +
    'id', function () {
      var id = 3;
      model.getComments(id, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('GET');
      expect(request.url).toBe('localhost:3000/posts/' + id + '/comments');
      expect(callback.calledOnce).toBe(true);
    });

    it('`deleteComment(id)` deletes the comment with the given id for the ' +
    'post with the specified id.', function () {
      var postId = 1, id = 3;
      model.deleteComment(postId, id, callback);
      request.respond(200, {}, '');

      expect(request.requestHeaders['Accept']).toBe('application/json');
      expect(request.method).toBe('DELETE');
      expect(request.url)
        .toBe('localhost:3000/posts/' + postId + '/comments/' + id);
      expect(callback.calledOnce).toBe(true);
    });

  });

});
