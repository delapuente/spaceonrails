/*!
The model library
=================

The **model** proxy is the module in charge to communicate with the server to
alter the real model. It abstract the concept of server and only allows
controlled high level commands such as `newPost()`, `updatePost()`,
`deletePost()` and so on.
*/

/*!
The code
--------

Again, we isolate the functionality with a __reveal pattern__.
*/
(function (global) {
  'use strict'

  // The `void` keyword evaluates an expression and always return `undefined`.
  var undefined = void 0;
  var DOMAIN = 'http:\/\/localhost:3000';

  function getPostList(page, callback) {
    if (arguments.length === 1) {
      callback = page;
      page = undefined;
    }

  /*!
  All the functions rely on the `makeXHR()` function. See for further details.
  */
    makeXHR({
      path: 'posts' + (page === undefined ? '' : '?page=' + page)
    }, callback);
  }

  function getPost(id, callback) {
    makeXHR({
      path: 'posts/' + id
    }, callback);
  }

  function updatePost(id, patch, callback) {
    makeXHR({
      method: 'patch',
      path: 'posts/' + id,
      payload: patch
    }, callback);
  }

  function deletePost(id, callback) {
    makeXHR({
      method: 'delete',
      path: 'posts/' + id
    }, callback);
  }

  function newPost(post, callback) {
    makeXHR({
      method: 'post',
      path: 'posts',
      payload: post
    }, callback);
  }

  function getComments(postId, callback) {
    makeXHR({
      path: 'posts/' + postId + '/comments'
    }, callback);
  }

  function deleteComment(postId, id, callback) {
    makeXHR({
      method: 'delete',
      path: 'posts/' + postId + '/comments/' + id
    }, callback);
  }

  function newComment(postId, comment, callback) {
    makeXHR({
      method: 'post',
      path: 'posts/' + postId + '/comments',
      payload: comment
    }, callback);
  }

  /*!
  This is the main function for sending asynchronous requests to the server.
  */
  function makeXHR(options, callback) {

  /*!
  If omitted, some parameters default in the most common actions.
  */
    var method = options.method || 'GET';
    var path = options.path || '';
    var payload = options.payload;

    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), DOMAIN + '/' + path);
  /*!
  Request headers must be set after calling `open()` but before calling `send()`
  */
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.responseType = 'json';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
  /*!
  Codes between `200` and `299` mean [successful operations](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).
  */
        var err = xhr.status < 200 || xhr.status > 299 ? xhr.status : null;
        callback && callback(err, xhr.response);
      }
    };
    xhr.onerror = function () {
      callback('error');
    };
    xhr.send(payload);
  }

  global.model = {
    getPostList: getPostList,
    getPost: getPost,
    updatePost: updatePost,
    deletePost: deletePost,
    newPost: newPost,
    getComments: getComments,
    deleteComment: deleteComment,
    newComment: newComment
  };

}(this));
