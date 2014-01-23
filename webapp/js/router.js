/*!
The router
==========

The **router** is a component intended to map URLs with views.
In a MVC, the **router** is part of the controller. There are several routing
mechanisms; here we use a simple and didactical one to provide several
examples of advanced JavaScript uses.

Our proposal is to split our single-page application into several
_navigation sections_, each identified by the custom attribute
`data-navigation-section`. When detecting a route, the application will move
to that section by hidding the current one and showing the new one.
*/

/*!
The code
--------

*/

/*!
An object with pairs of **pattern** and **action**.

Each **pattern** is a [regular expression](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions)
that will be matched against the path of the URL. We use parenthesis to
indicate parts of the URL to be remembered and passed to the initialization
callback.

**Actions** are pairs of section and view function. The view function will be
in charge of populate the section and add the extra functionallity.
*/
var ROUTES = {
  '^/$':                    ['post-list', fakeViewInitializer],
  '/posts/?$':             ['post-list', fakeViewInitializer],
  '/posts/(\\d+)/?$':      ['show-post', fakeViewInitializer],
  '/posts/(\\d+)/edit/?$': ['edit-post', fakeViewInitializer],
  '/posts/new/?$':         ['new-post', fakeViewInitializer]
};

/*!
In the complete application, going to a section will trigger some initialization
actions such as fetching data from server and installing special handlers for
specific actions. We are simulating this initialization now by simply printing
the parameters in the console.
*/
function fakeViewInitializer(section, querystringParams) {
  'use strict'

  var capturedGroups = Array.prototype.slice.call(arguments, 2);
  console.log('Section:', section);
  console.log('Querystring parameters:', JSON.stringify(querystringParams));
  console.log('Path parameters:', capturedGroups + '');
}

/*!
We are not isolating the code right now so we mark the _private_ variables by
prepending a dash (`_`) before the name. Just a naming convention.
*/
var _currentLinks, _currentSection, _navigationSections;

/*!
A clean code reccommendation is to start with running code as soon as possible
and write dependencies just below. This way you don't read a lot of code pieces
you don't know how they interact but just the working piece of code. It is your
choice if I want to go deeper or not.
*/
startRouter();

function startRouter() {
  /*!
  The `'use-strict'` pragma is no more than a string telling the JavaScript
  interpreter we want run this code in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode).
  It has function scope, meaning only the code inside the function with the
  pragma will be run in strict mode. It is quite important to not write
  `'use-strict'` as a global because this will force **all the code** to be
  run this way causing incompatibilites where legacy mode is still neccessary.
  */
  'use strict'

  /*!
  Here we check for [document state](https://developer.mozilla.org/en-US/docs/Web/API/document.readyState),
  if all the DOM has been parsed, install the router and forces firs navigation.
  If not, [wait for DOM to be completely loaded](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/DOMContentLoaded).
  */
  if (document.readyState !== 'loading') {
    installRouterAndNavigate();
  }
  else {
    document.addEventListener('DOMContentLoaded', installRouterAndNavigate);
  }

  /*!
  As our history state is the URL (a very Webby approach), to show the proper
  view we should only _client-navigate_ to that URL.
  */
  window.onpopstate = function (event) {
    if (event.state) {
      navigateTo(event.state);
    }
  };

  /*!
  As you can see, functions can be nested inside functions. Here we use an
  inner function to reduce code repetition.
  */
  function installRouterAndNavigate() {
    updateNavigation();
    autodiscoverSections();
    hideAllSections();
    navigateTo(window.location.pathname);
  }
}

/*!
We are taking advantage of normal link elements, `<a>` to control navigation by
overwritting what to do when clicking on a link.
*/
function updateNavigation() {
  'use strict'

  /*!
  The list returned by `getElementsByTagName()` is what JS call a
  __live list__. A live list does not need to be updated any more because it
  always contains the list of elements matching the performed query. This case
  is the list of all `<a>` elements.
  */
  if (!window._currentLinks) {
    window._currentLinks = document.getElementsByTagName('a');
  }

  for (var a, i = 0, l = _currentLinks.length; i < l; i++) {
    a = _currentLinks[i]
    a.addEventListener('click', doClientNavigation);
  }
}

/*!
Fill the navigation sections found in the SPA. It uses an object to
automatically avoid repetitions. You can extract the keys of an object
by using `Object.keys()` method.
*/
function autodiscoverSections() {
  'use strict'

  if (!_navigationSections) {
  /*!
  With `Object.create()` we create a new object with its prototype set to the
  passed object. Passing `null` the object has no prototype: it is the simplest
  object possible.
  */
    _navigationSections = Object.create(null);
  }

  var navigationSections =
    document.querySelectorAll('[data-navigation-section]');

  for (var section, i = 0, l = navigationSections.length; i < l; i++) {
    section = navigationSections[i].dataset.navigationSection;
    _navigationSections[section] = true;
  }
}

function doClientNavigation(evt) {
  'use strict'

  /*!
  By calling `preventDefault()` we avoid the default action of the link which
  is navigate to the `href` URL by performing a `GET` request to the server.
  */
  evt.preventDefault();
  evt.stopPropagation();
  navigateTo(evt.target.getAttribute('href'));
}

function hideAllSections() {
  'use strict'

  Object.keys(_navigationSections).forEach(function (sectionName) {
     hideSection(sectionName);
  });
}

function hideSection(sectionName) {
  'use strict'

  setSectionVisibility(sectionName, false);
}

function showSection(sectionName) {
  'use strict'

  setSectionVisibility(sectionName, true);
}

function setSectionVisibility(sectionName, visibility) {
  'use strict'

  /*!
  New JavaScript `querySelector()` and `querySelectorAll()` methods mimic the
  famous _jQuery_ behavior and allow CSS selector to query the DOM for a
  collection of the elements matching the CSS selector provided. Here we are
  using an [attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).
  */
  var selector = '[data-navigation-section="' + sectionName + '"]';
  var navParts = document.querySelectorAll(selector);
  for (var l = navParts.length - 1, part; part = navParts[l]; l--) {
    part.hidden = !visibility;
  }
}

/*!
The function has split its responsibility in two: pattern matching and
DOM changes. Here the pattern matching process is attended while DOM changes
are in the next function.
*/
function navigateTo(href) {
  'use strict'

  var routes = window.ROUTES;
  var parameters = parseGetParameters(href);

  /*!
  New in JavaScript 1.8, `<a>` elements implement [`URLUtils`](https://developer.mozilla.org/en-US/docs/Web/API/URLUtils)
  interface which allow us to use the link as an URL parser.
  */
  var matching, path, parser = document.createElement('a');
  parser.href = href;
  path = parser.pathname;

  /*!
  The loop pass through each pattern trying to find a match for the current
  path. If found, it call the routing action associated to that pattern passing
  the query parameters as a dictionary and all the groups found in the path.
  */
  for (var pattern in routes) if (routes.hasOwnProperty(pattern)) {
    matching = path.match(pattern);
    if (matching) {
      var args = [parameters].concat(matching.slice(1));
      var sectionPair = routes[pattern];
      changeToSection(href, sectionPair[0], sectionPair[1], args);
      return;
    }
  }
}

/*!
The function hidesthe current section and shows the new one. Finally calls
the `viewFunction` callback passing sections name, querystring parameters
and captured groups as arguments.
*/
function changeToSection(href, sectionName, viewFunction, args) {
  'use strict'

  hideSection(_currentSection);
  _currentSection = sectionName;
  showSection(sectionName);

  /*!
  As our URL contains all the information for the view, it suffices to store
  the href as the history state, setting the URL accordingly.
  */
  window.history.pushState(href, '', href);

  viewFunction.apply(this, [sectionName].concat(args));
}


function parseGetParameters(href) {
  'use strict'

  /*!
  Looking for the querystring of an URL is not hard. Just look for the substring
  following the `?` character until the end or until finding a `#` character.
  */
  var matching = href.match(/\?([^#]+)/);
  var result = {};
  if (matching && matching.length === 2) {
  /*!
  Some functional style is presented here. Note how first we split the
  querystring by the `&` character, then pass through the list items
  applying a second split to separate parameter name and value into tuples.
  */
    var parameters = matching[1].split('&').map(function (parameterSpec) {
      return parameterSpec.split('=');
    });
  /*!
  Finally, we iterate through the elements of the array putting them into a
  dictionary.
  */
    parameters.forEach(function (parameter) {
      result[parameter[0]] = parameter[1];
    });
  }
  return result;
}
