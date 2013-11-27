'use strict';

angular.module('dpreddit-angular')
    .factory('Auth', function ($http, $cookieStore) {

      var accessLevels = routingConfig.accessLevels
          , userRoles = routingConfig.userRoles
          , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

      $cookieStore.remove('user');

      function changeUser(user) {
        _.extend(currentUser, user);
      };

      return {
        authorize: function (accessLevel, role) {
          if (role === undefined)
            role = currentUser.role;

          return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function (user) {
          if (user === undefined)
            user = currentUser;
          return user.role.title == userRoles.user.title;
        },
        register: function (user, success, error) {
          $http.post('/register', user).success(function (res) {
            changeUser(res);
            success();
          }).error(error);
        },
        login: function (user, success, error) {
          $http.post('/login', user).success(function (user) {
            changeUser(user);
            success(user);
          }).error(error);
        },
        logout: function (success, error) {
          $http.post('/logout').success(function () {
            changeUser({
              username: '',
              role: userRoles.public
            });
            success();
          }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
      };
    });

angular.module('dpreddit-angular')
    .factory('Users', function ($http) {
      return {
        getAll: function (success, error) {
          $http.get('/users').success(success).error(error);
        }
      };
    });

angular.module('dpreddit-angular')
    .factory('LinkEntry', function ($http) {
      return {
        getAll: function (success, error) {
          $http.get('/linkentries').success(success).error(error);
        },
        addnewlinkentry: function (newlinkentry, success, error) {
          $http.post('/addnewlinkentry', newlinkentry).success(function (res) {
            success();
          }).error(error);
        },
        getbyid: function (linkentryid, success, error) {
          $http.get('/linkentry/' + linkentryid).success(success).error(error);
        }
      };
    });
angular.module('dpreddit-angular')
    .factory('Comment', function ($http) {
      return {
        getAll: function (success, error) {
          $http.get('/comments').success(success).error(error);
        },
        addcomment: function (newcomment, success, error) {
          $http.post('/addcomment', newcomment).success(function (res) {
            success();
          }).error(error);
        },
        vote: function(commentid, value, success, error) {
          $http.get('/votecomment/' + commentid + '/' + value).success(success).error(error);
        }
      };
    });
