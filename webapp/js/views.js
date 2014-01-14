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
Here there are some fake objects emulating a post list, a single post and
some comments.
*/
var FAKE_POST_LIST = {
  "page": 2,
  "per_page": 5,
  "total_entries": 15,
  "entries": [
    { "id":  6, "title": "Sample post 6" },
    { "id":  7, "title": "Sample post 7" },
    { "id":  8, "title": "Sample post 8" },
    { "id":  9, "title": "Sample post 9" },
    { "id": 10, "title": "Sample post 10" }
  ]
};

var FAKE_POST = {
  "id": 1,
  "title": "A sample post",
  "text": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut " +
          "risus leo, tristique vitae ultricies vel, eleifend fermentum au" +
          "gue. Mauris a nunc aliquet neque laoreet bibendum eu mollis eni" +
          "m. Vivamus semper tempus ante, vel suscipit orci. Proin non fel" +
          "is in magna tempus commodo. Nullam condimentum tincidunt nulla " +
          "elementum aliquam. Etiam ligula erat, ultrices vitae accumsan e" +
          "get, tincidunt luctus felis. Sed eget augue convallis, laoreet " +
          "eros vel, sodales ante. Sed vulputate adipiscing magna, et laci" +
          "nia leo posuere in. In at justo urna. Vestibulum molestie, mi s" +
          "ed volutpat pulvinar, libero dolor blandit est, non fringilla m" +
          "etus lacus sed mi. Ut felis odio, blandit sed dolor id, tempus " +
          "gravida ante. Pellentesque ultrices, massa id hendrerit placera" +
          "t, urna orci aliquet nulla, nec consectetur odio sem vel justo." +
          "</p><p>Curabitur a ipsum lobortis, suscipit eros at, tempor sap" +
          "ien. Cras sed semper eros, eu pellentesque justo. Donec venenat" +
          "is nibh tellus, non rutrum lacus consequat eu. Curabitur non ar" +
          "cu sit amet leo tempor suscipit vel vel purus. Cras pulvinar so" +
          "dales justo, ac porttitor dolor consectetur sit amet. Ut auctor" +
          " arcu sed imperdiet porta. Proin suscipit ante vel lacinia orna" +
          "re. Integer mattis est et quam cursus, et commodo sapien ultric" +
          "es.</p>",
  "post_picture": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYA" +
                "AACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4O" +
                "HwAAAABJRU5ErkJggg=="
};

var FAKE_COMMENTS = [
  { "id":1,"commenter":"Huey","body":"Huey says something.","post_id":1 },
  { "id":2,"commenter":"Dewey","body":"Dewey says something.","post_id":1 },
  { "id":3,"commenter":"Louie","body":"Louie says something.","post_id":1 },
  { "id":4,"commenter":"John","body":"John says something.","post_id":1 },
  { "id":5,"commenter":"Jimmy","body":"Jimmy says something.","post_id":1 },
];

/*!
Views are self descriptives. We don't use any parameter yet but this will change
once model.js is implemented.
*/
function postListView(section, parameters) {

  buildList();
  buildPagination();
  installNavigation();

  function buildList() {
    var entryTemplate = templates['post-list'].entry;
    var entries = entryTemplate.render(FAKE_POST_LIST.entries);
    var postList = document.querySelector('#post-list ol.post-list');
    postList.innerHTML = '';
    postList.appendChild(entries);
  }

  function buildPagination() {
    var currentPage = FAKE_POST_LIST.page;
    var perPage = FAKE_POST_LIST.per_page;
    var totalEntries = FAKE_POST_LIST.total_entries;
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
}

/*!
Notice the repeated patterns along views and try to imagine how to reduce this
repetition. You will refactor this code soon.
*/
function showPostView(section, parameters, postId) {
  buildTitle();
  buildComments();
  buildPost();

  function buildTitle() {
    var subtitleTemplate = templates['show-post'].title;
    var subtitleContainer = document.querySelector('header div');
    subtitleContainer.innerHTML = '';
    subtitleContainer.appendChild(subtitleTemplate.render(FAKE_POST));
  }

  function buildComments() {
    var commentTemplate = templates['show-post'].comment;
    var commentContainer = document.querySelector('aside div');
    commentContainer.innerHTML = '';
    commentContainer.appendChild(commentTemplate.render(FAKE_COMMENTS));
  }

  function buildPost() {
    var postTemplate = templates['show-post'].post;
    var postContainer = document.querySelector('#show-post div');
    postContainer.innerHTML = '';
    postContainer.appendChild(postTemplate.render(FAKE_POST));
  }
}

function editPostView(section, parameters, postId) {
  var formTemplate = templates['post-form'];
  var formContainer = document.querySelector('#edit-post div');
  formContainer.innerHTML = '';
  formContainer.appendChild(formTemplate.render(FAKE_POST));
}

function newPostView() {
  var emptyPost = { title: '', text: '', post_picture: '' };
  var formTemplate = templates['post-form'];
  var formContainer = document.querySelector('#new-post div');
  formContainer.innerHTML = '';
  formContainer.appendChild(formTemplate.render(emptyPost));
}
