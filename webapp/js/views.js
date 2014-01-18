/*!
Views
=====

Views are represented by functions triggered by the router when enabling a
section. Basically, the duty of a view is to ask the model for data and use it
to populate a template. Then place the template in the proper location.

/*!
The code
--------

Once the DOM is ready, we know for sure we have all the templates.
*/
if (document.readyState !== 'loading') {
  gatherTemplates();
}
else {
  document.addEventListener('DOMContentLoaded', gatherTemplates);
}

var templates;
function gatherTemplates() {
  document.removeEventListener('DOMContentLoaded', gatherTemplates);
  templates = template.gatherTemplates(document);
}

/*!
Views are self descriptives. We don't use any parameter yet but this will change
once model.js is implemented.
*/
function postListView(section, parameters) {
  'use strict'

  var list;
  model.getPostList(parameters.page, function (err, receivedList) {
    list = receivedList;

    buildList();
    buildPagination();
    updateNavigation();
    addDeletions();
  });

  function buildList() {
    var entryTemplate = templates['post-list'].entry;
    var entries = entryTemplate.render(list.entries);
    var postList = document.querySelector('#post-list ol.post-list');
    postList.innerHTML = '';
    postList.appendChild(entries);
  }

  function buildPagination() {
    var currentPage = list.page;
    var perPage = list.per_page;
    var totalEntries = list.total_entries;
    var lastPage = Math.ceil(totalEntries / perPage);

    var previousTemplate = templates.pagination.previous;
    var nextTemplate = templates.pagination.next;
    var currentTemplate = templates.pagination.current;
    var pageTemplate = templates.pagination.page;

    var paginationContainer = document.getElementsByClassName('pagination')[0];
    paginationContainer.innerHTML = '';
    if (currentPage > 1) {
      paginationContainer.appendChild(previousTemplate.render(currentPage - 1));
    }
    for (var i = 1; i <= lastPage; i++) {
      paginationContainer.appendChild(i === currentPage ?
                                      currentTemplate.render(currentPage) :
                                      pageTemplate.render(i));
    }
    if (currentPage < lastPage) {
      paginationContainer.appendChild(nextTemplate.render(currentPage + 1));
    }
  }

  function addDeletions() {
    var deleteLinks =
      document.querySelectorAll('#post-list a[data-method="delete"]');
    for (var link, i = deleteLinks.length - 1; link = deleteLinks[i]; i--) {
      link.addEventListener('click', onDeletePost);
    }
  }

  function onDeletePost(evt) {
    evt.preventDefault();
    if (!confirm('Are you sure you want to delete this post?')) { return; }

    var link = evt.target;
    var matching = link.getAttribute('href').match(/\/posts\/(\d+)/);
    var postId = matching ? matching[1] : undefined;
    if (postId) {
      model.deletePost(postId, function onceDeleted(err) {
        navigateTo('/');
      });
    }
  }
}

/*!
Notice the repeated patterns along views and try to imagine how to reduce this
repetition. You will refactor this code soon.
*/
function showPostView(section, parameters, postId) {

  /*!
  These two operations are asynchronous. We ask for a post and for its comments
  in two different and parallel tasks and they could success at different times
  in any order.
  */
  buildPostSections();
  buildCommentsSections();

  function buildPostSections() {
    model.getPost(postId, function (err, receivedPost) {
      buildTitle(receivedPost);
      buildPost(receivedPost);
      setupPostComments();
      updateNavigation();
    });
  }

  function buildCommentsSections() {
    model.getComments(postId, function (err, receivedComments) {
      buildComments(receivedComments);
      addCommentDeletions();
    });
  }

  function setupPostComments() {
    var form = document.querySelector('#add-comment form');
    form.addEventListener('submit', function onSubmit(evt) {
      evt.preventDefault();

      var payload = gatherFormFields(form);
      model.newComment(postId, payload, function onceCreated(err) {
        buildCommentsSections();
      });
    });
  }

  function buildTitle(post) {
    var subtitleTemplate = templates['show-post'].title;
    var subtitleContainer = document.querySelector('header div');
    subtitleContainer.innerHTML = '';
    subtitleContainer.appendChild(subtitleTemplate.render(post));
  }

  function buildPost(post) {
    var postTemplate = templates['show-post'].post;
    var postContainer = document.querySelector('#show-post div');
    postContainer.innerHTML = '';
    postContainer.appendChild(postTemplate.render(post));
  }

  function buildComments(comments) {
    var commentTemplate = templates['show-post'].comment;
    var commentContainer = document.querySelector('aside div');
    commentContainer.innerHTML = '';
    commentContainer.appendChild(commentTemplate.render(comments));
  }

  function addCommentDeletions() {
    var deleteLinks =
      document.querySelectorAll('aside a[data-method="delete"]');
    for (var link, i = deleteLinks.length - 1; link = deleteLinks[i]; i--) {
      link.addEventListener('click', onDeletePost);
    }
  }

  function onDeletePost(evt) {
    evt.preventDefault();
    if (!confirm('Are you sure you want to delete this comment?')) { return; }

    var link = evt.target;
    var matching =
      link.getAttribute('href').match(/\/posts\/(\d+)\/comments\/(\d+)/);
    var postId = matching ? matching[1] : undefined;
    var commentId = matching ? matching[2] : undefined;
    if (postId && commentId) {
      model.deleteComment(postId, commentId, function onceDeleted(err) {
        buildCommentsSections();
      });
    }
  }
}

function editPostView(section, parameters, postId) {
  model.getPost(postId, function (err, receivedPost) {
    var post = receivedPost;

    var formTemplate = templates['post-form'];
    var formContainer = document.querySelector('#edit-post div');
    formContainer.innerHTML = '';
    formContainer.appendChild(formTemplate.render(post));
    setupUpdatePost();
    updateNavigation();
  });

  function setupUpdatePost() {
    var form = document.querySelector('#edit-post form');
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      var update = gatherFormFields(form);
      model.updatePost(postId, update, function onceUpdated(err) {
        navigateTo('/posts/' + postId);
      });
    });
  }
}

function newPostView() {
  var emptyPost = { title: '', text: '', post_picture: '' };
  var formTemplate = templates['post-form'];
  var formContainer = document.querySelector('#new-post div');
  formContainer.innerHTML = '';
  formContainer.appendChild(formTemplate.render(emptyPost));

  setupCreatePost();

  function setupCreatePost() {
    var form = document.querySelector('#new-post form');
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      var post = gatherFormFields(form);
      model.newPost(post, function onceCreated(err, newPost) {
        navigateTo('/posts/' + newPost.id);
      });
    });
  }
}

function gatherFormFields(form) {
  var result = {};
  var elements = form.querySelectorAll('input, textarea');
  for (var i = elements.length - 1, element; element = elements[i]; i--) {
    if (element.name && element.type !== 'submit') {
      putIn(result, element.name, element.value);
    }
  }

  return result;

  function putIn(target, path, object) {
    var tokens = path.split('.');
    var current = tokens[0];
    var remainingPath = tokens.slice(1).join('.');
    if (tokens.length === 1) {
      target[current] = object;
    }
    else {
      target[current] = target[current] || {};
      putIn(target[current], remainingPath, object);
    }
  }
}
