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

var NAVIGATION_SECTIONS = ['post-list', 'show-post', 'edit-post', 'new-post'];

var ROUTES = {
  /*
  Define here your patterns by using regular expressions and your routing
  actions by using pairs of section name and initialization function:

    'pattern1' : ['post-list', fakeViewInitializer],
    'pattern2' : ['another-section', fakeViewInitializer],
    ...
  */
  '/posts/(\\d+)$': ['show-post', fakeViewInitializer]
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

startRouter();

function startRouter() {
  'use strict'

  /* Put your initialization code here (notice you should wait for DOM to
  finish to load). Then you will be doing: */

  // 1. Install a navigation callback for each <a> element
  updateNavigation();

  // 2. Reset the state of all sections
  hideAllSections();

  // 3. Navigate to the current route
  navigateTo(window.location.pathname);
}

function updateNavigation() {
  'use strict'

  /* Use this function when you want to intervene the current links of the
  application: */

  // 1. Get all links

  // 2. Install the `doClientNavigation` callback when clicking
}

function doClientNavigation(evt) {
  'use strict'

  // 1. Prevent the real navigation from happening

  // 2. Navigate to the proper view
}

function hideAllSections() {
  'use strict'

  /* Hide all navigation sections */
}

function hideSection(sectionName) {
  'use strict'

  /* Hide all HTML elements belonging to the navigation section `sectionName` */
}

function showSection(sectionName) {
  'use strict'

  /* Show all HTML elements belonging to the navigation section `sectionName` */
}

function navigateTo(href) {
  'use strict'

  /* This is the main function of the router: */

  // 1. Determine wich routing action should be performed depending on the
  // matching pattern.

  // 2. Extract from the path, the parameters in the querystring of the URL
  // and put them in a dictionary.
  var parameters = parseGetParameters(href);

  // 3. Calls the routing action passing:
  //  - the section
  //  - the querystring parameters
  //  - captured parameters for each group in the pattern
}

function parseGetParameters(href) {
  'use strict'

  /* Convert the querystring: ?param1=value1&param2=value2... into an object:
  {
    'param1': 'value1',
    'param2': 'value2',
    ...
  }

  Try to golf (minimize) the code!
  */
}
