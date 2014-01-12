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
The complete list of all navigation sections.
*/ 
var NAVIGATION_SECTIONS = ['post-list', 'show-post', 'edit-post', 'new-post'];

/*!
An object with pairs of **pattern** and **action**.

Each **pattern** is a [regular expression](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions)
that will be matched against the path of the URL. We use parenthesis to 
indicate parts of the URL to be remembered and passed to the initialization
callback.

**Actions** are functions. Here we call the _function factory_ `goTo()`which
returns another function in charge of hiding the current section and showing
the new one in addition to call the initializer to, for instance, populate
the section.
*/
var ROUTES = {
  '/$':                  goTo('post-list', fakeViewInitializer),
  '/posts$':             goTo('post-list', fakeViewInitializer),
  '/posts/(\\d+)$':      goTo('show-post', fakeViewInitializer),
  '/posts/(\\d+)/edit$': goTo('edit-post', fakeViewInitializer),
  '/posts/new$':         goTo('new-post', fakeViewInitializer)
};

/*!
In the complete application, going to a section will trigger some initialization
actions such as fetching data from sever and installing special handlers for
specific actions. We are simulating this initialization now by simply printing
the parameters in the console.
*/
function fakeViewInitializer(section, getParameters) {
  'use strict'

  var pathParameters = Array.prototype.slice.call(arguments, 2);
  console.log('Section:', section);
  console.log('Get parameters:', JSON.stringify(getParameters));
  console.log('Path parameters:', pathParameters + '');
}

/*!
We are not isolating the code right now so we mark the _private_ variables by
prepending a dash (`_`) before the name. Just a naming convention.
*/
var _currentLinks, _currentSection;

/*!
**Function factories** like this are functions which return other functions.
The inner function can reach the variables of the parent function. Each time
we call `goTo()`, a new namespace is created to hold parameters and variables
and a new `_doNavigation()` function is created pointing to this new namespace.

This way, back in the `ROUTES` object, we call `goTo()` once per URL to
build new `_doNavigation()` functions bound to each section. 
*/
function goTo(sectionName, initializer) {
  'use strict'

  return function _doNavigation() {
  /*!
  The special variable `arguments` hold each parameter passed to the function.
  The `arguments` variable is not a common list so it can not be used as a
  JS array. To convert it, [call the `slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
  Array's method on the `arguments` object to perform a copy of the list into a
  standard JS array.
  */
    var remainingArguments = Array.prototype.slice.call(arguments, 0);
    hideSection(_currentSection);
    _currentSection = sectionName;
    showSection(sectionName);
    initializer.apply(this, [sectionName].concat(remainingArguments));
  };
}

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
  if (document.readyState === 'interactive') {
    installRouterAndNavigate();  
  }
  else {
    document.addEventListener('DOMContentLoaded', installRouterAndNavigate);
  }
  
  /*!
  As you can see, functions can be nested inside functions. Here we use an
  inner function to reduce code repetition.
  */
  function installRouterAndNavigate() {
    installNavigation();
    hideAllSections();
    route(window.location.pathname);
  }
}

/*!
We are taking advantage of normal link elements, `<a>` to control navigation by
overwritting what to do when clicking on a link. 
*/
function installNavigation() {
  /*!
  The list returned by `getElementsByTagName()` is what JS call a
  __live list__. A live list does not need to be updated any more because it
  always contains the list of elements matching the performed query. This case
  is the list of all `<a>` elements.
  */
  if (!window._currentLinks) {
    window._currentLinks = document.getElementsByTagName('a');
  }
  
  /*!
  Given that indexing a list with negative indices result in `undefined` and no
  item of a live list can be a falsy, we use this `for` pattern to get each link
  element and overwrite its behavior when clicked.
  */
  for (var l = _currentLinks.length - 1, a; a = _currentLinks[l]; l--) {
    a.addEventListener('click', doClientNavigation);
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
  route(evt.target.getAttribute('href'));
}

function hideAllSections() {
  'use strict'
  
  window.NAVIGATION_SECTIONS.forEach(function (sectionName) {
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

function route(href) {
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
      return routes[pattern].apply(null, args);
    }
  }
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
  Finally, we iterate trough the elements of the array putting them into a
  dictionary.
  */
    parameters.forEach(function (parameter) {
      result[parameter[0]] = parameter[1];
    });
  }
  return result;
}
