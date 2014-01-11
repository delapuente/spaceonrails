
var currentLinks;
function startRouter() {
  'use strict'
  
  currentLinks = document.getElementsByTagName('a');
  for (var l = currentLinks.length - 1, a; a = currentLinks[l]; l--) {
    a.addEventListener('click', preventNavigationAndRoute);
  }  
}

function preventNavigationAndRoute(evt) {
  'use strict'

  evt.preventDefault();
  route(evt.target.getAttribute('href'));
}

var routes = {
  '/$':                  goTo('post-list', fakeInitializer),
  '/posts$':             goTo('post-list', fakeInitializer),
  '/posts/(\\d+)$':      goTo('show-post', fakeInitializer),
  '/posts/(\\d+)/edit$': goTo('edit-post', fakeInitializer),
  '/posts/new$':         goTo('new-post', fakeInitializer)
};

function fakeInitializer(section, getParameters) {
  'use strict'
  var pathParameters = Array.prototype.slice.call(arguments, 2);
  console.log('Section:', section);
  console.log('Get parameters:', JSON.stringify(getParameters));
  console.log('Path parameters:', pathParameters + '');
}

function goTo(sectionName, initializer) {
  'use strict'

  return function () {
    var args = Array.prototype.slice.call(arguments);
    hideAllSections();
    showSection(sectionName);
    initializer.apply(this, [sectionName].concat(args));
  };
}

var sections = ['post-list', 'show-post', 'edit-post', 'new-post'];
function hideAllSections() {
  'use strict'
  
  sections.forEach(function (sectionName) {
    document.getElementById(sectionName).hidden = true;
    var blogParts =
      document.querySelectorAll('[data-blog-section="' + sectionName + '"]');
    for (var l = blogParts.length - 1, part; part = blogParts[l]; l--) {
      part.hidden = true;
    } 
  });
}

function showSection(sectionName) {
  document.getElementById(sectionName).hidden = false;
  var blogParts =
    document.querySelectorAll('[data-blog-section="' + sectionName + '"]');
  for (var l = blogParts.length - 1, part; part = blogParts[l]; l--) {
    part.hidden = false;
  }
}

function route(href) {
  var parameters = parseGetParameters(href);
  var matching, path, parser = document.createElement('a');
  parser.href = href;
  path = parser.pathname;
  for (var pattern in routes) if (routes.hasOwnProperty(pattern)) {
    matching = path.match(pattern);
    if (matching) {
      var args = [parameters].concat(matching.slice(1));
      return routes[pattern].apply(null, args);
    }
  }
}

function parseGetParameters(href) {
  var parameters, matching = href.match(/\?([^#]+)/);
  var result = {};
  if (matching && matching.length === 2) {
    parameters = matching[1].split('&').map(function (parameterSpec) {
      return parameterSpec.split('=');
    });
    parameters.forEach(function (parameter) {
      result[parameter[0]] = parameter[1];
    });
  }
  return result;
}

startRouter();
