var _ = require('underscore'),
    path = require('path'),
    passport = require('passport'),
    AuthCtrl = require('./controllers/auth'),
    UserCtrl = require('./controllers/user'),
    LinkEntryCtrl = require('./controllers/linkentry'),
    User = require('./models/User.js'),
    userRoles = require('../client/js/routingConfig').userRoles,
    accessLevels = require('../client/js/routingConfig').accessLevels;

var routes = [

  // Views
  {
    path: '/partials/*',
    httpMethod: 'GET',
    middleware: [function (req, res) {
      var requestedView = path.join('./', req.url);
      res.render(requestedView);
    }]
  },

  // Local Auth
  {
    path: '/register',
    httpMethod: 'POST',
    middleware: [AuthCtrl.register]
  },
  {
    path: '/login',
    httpMethod: 'POST',
    middleware: [AuthCtrl.login]
  },
  {
    path: '/logout',
    httpMethod: 'POST',
    middleware: [AuthCtrl.logout]
  },

  // User resource
  {
    path: '/users',
    httpMethod: 'GET',
    middleware: [UserCtrl.index],
    accessLevel: accessLevels.user
  },

  //Linkentry
  {
    path: '/addnewlinkentry',
    httpMethod: 'POST',
    middleware: [LinkEntryCtrl.add]
  },
  {
    path: '/linkentries',
    httpMethod: 'GET',
    middleware: [LinkEntryCtrl.index],
    accessLevel: accessLevels.user
  },

  // All other get requests should be handled by AngularJS's client-side routing system
  {
    path: '/*',
    httpMethod: 'GET',
    middleware: [function (req, res) {
      var role = userRoles.public, username = '';
      if (req.user) {
        role = req.user.role;
        username = req.user.username;
      }
      res.cookie('user', JSON.stringify({
        'username': username,
        'role': role
      }));
      res.render('index');
    }]
  }
];

module.exports = function (app) {

  _.each(routes, function (route) {
    route.middleware.unshift(ensureAuthorized);
    var args = _.flatten([route.path, route.middleware]);

    switch (route.httpMethod.toUpperCase()) {
      case 'GET':
        app.get.apply(app, args);
        break;
      case 'POST':
        app.post.apply(app, args);
        break;
      case 'PUT':
        app.put.apply(app, args);
        break;
      case 'DELETE':
        app.delete.apply(app, args);
        break;
      default:
        throw new Error('Invalid HTTP method specified for route ' + route.path);
        break;
    }
  });
}

function ensureAuthorized(req, res, next) {
  var role;
  if (!req.user) role = userRoles.public;
  else          role = req.user.role;

  var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;

  if (!(accessLevel.bitMask & role.bitMask)) return res.send(403);
  return next();
}
