/*!
Views
=====

Views are represented by functions triggered by the router when enabling a
section. Basically, the duties of a view are to keep the synchronization
between the model and the presentation.

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

/*!
We accumulate all templates in the `template` library acting as a library.
*/
var templates;
function gatherTemplates() {
  document.removeEventListener('DOMContentLoaded', gatherTemplates);
  templates = template.gatherTemplates(document);
}

/*!
This view controls the paginated list of posts in the server. It gets the number
of page in the `parameters.page` entry.
*/
function postListView(section, parameters) {
  'use strict'

  var list;
  model.getPostList(parameters.page, function (err, receivedList) {
    list = receivedList;

  /*!
  Once the list of pages is received, the control is transferred to the several
  helping functions to build the UI.
  */
    buildList();
    buildPagination();
  /*!
  Now we update the navitation links to attach our customized navigation to
  the new created links and finally we install the capability to delete
  posts.
  */
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

  /*!
  Adding the delete capability consist in taking all the delete links and
  attach a custom callback to intercept the navigation in the same way we
  did to intercept navigation in the router.
  */
  function addDeletions() {
    var deleteLinks =
      document.querySelectorAll('#post-list a[data-method="delete"]');
    for (var link, i = deleteLinks.length - 1; link = deleteLinks[i]; i--) {
      link.addEventListener('click', onDeletePost);
    }
  }

  /*!
  It's quite important to prevent the default action in order to avoid
  browser navigation.
  */
  function onDeletePost(evt) {
    evt.preventDefault();
  /*!
  Methods such a `alert()` or `confirm()` are some of few examples of
  synchronous JS functions. In the case of `confirm()`, the browser shows
  a dialogue to the user with the text passed as parameter and two buttons
  with `accept` and `cancel` values. If the user clicks `accept`, the function
  evaluates to `true`.
  */
    if (!confirm('Are you sure you want to delete this post?')) { return; }

  /*!
  We extract the `postId` from the `href` attribute with a simple regular
  expression.
  */
    var link = evt.target;
    var matching = link.getAttribute('href').match(/\/posts\/(\d+)/);
    var postId = matching ? matching[1] : undefined;
    if (postId) {
  /*!
  Finally, the view communicates with the model and issues a command to delete
  the post and redirects the user to the page 1 using the router.
  */
      model.deletePost(postId, function onceDeleted(err) {
        navigateTo('/');
      });
    }
  }
}

/*!
The view shows an entire post and its comments.
*/
function showPostView(section, parameters, postId) {

  /*!
  These two operations are asynchronous. We ask for a post and for its comments
  in two different and [_parallel_](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Notes)
  tasks and they could success at different times in any order.
  */
  buildPostSections();
  buildCommentsSections();

  /*!
  Once we rendered all the post, we can set up the form for posting comments.
  */
  function buildPostSections() {
    model.getPost(postId, function (err, receivedPost) {
      buildTitle(receivedPost);
      buildPost(receivedPost);
      setupPostComments();
      updateNavigation();
    });
  }

  /*!
  The comment section shows only the list of all comments and sets up the
  _deleting a comment_ functionality.
  */
  function buildCommentsSections() {
    model.getComments(postId, function (err, receivedComments) {
      buildComments(receivedComments);
      addCommentDeletions();
    });
  }

  function setupPostComments() {
    var form = document.querySelector('#add-comment form');
  /*!
  We customize the action when the formulary is sent by preventing the real
  navigation action and adding our custom request through the model.
  */
    form.addEventListener('submit', function onSubmit(evt) {
      evt.preventDefault();

  /*!
  The heleper functon `gatherFormFields()` uses the special notation we
  introduced in the view to build the automatically build the payload.
  */
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

  /*!
  Very similar to delete a post.
  */
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
  /*!
  This time, instead of navigating to some route we ask the view to rebuild
  the comments' section in order to avoid asking for the post again.
  */
        buildCommentsSections();
      });
    }
  }
}

/*!
This view and the next one are very similar. The main difference is the edit
one performs a query to the model to get the post an fill the form fields
while the new version does not perform any additional request.
*/
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

/*!
The helper function gathers all the fields in the form and uses their names
to build an object with the same structure. It uses the same function
used for the templates to follow _dot notation_ and to allow nested fields.
*/
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
