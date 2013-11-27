'use strict';

/* Controllers */

angular.module('dpreddit-angular')
    .controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {
      $scope.user = Auth.user;
      $scope.userRoles = Auth.userRoles;
      $scope.accessLevels = Auth.accessLevels;

      $scope.logout = function () {
        Auth.logout(function () {
          $location.path('/login');
        }, function () {
          $rootScope.error = "Failed to logout";
        });
      };
    }]);

angular.module('dpreddit-angular')
    .controller('LoginCtrl',
        ['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {

          $scope.rememberme = true;
          $scope.login = function () {
            Auth.login({
                  username: $scope.username,
                  password: $scope.password,
                  rememberme: $scope.rememberme
                },
                function (res) {
                  $location.path('/');
                },
                function (err) {
                  $rootScope.error = "Failed to login";
                });
          };

          $scope.loginOauth = function (provider) {
            $window.location.href = '/auth/' + provider;
          };
        }]);

angular.module('dpreddit-angular')
    .controller('HomeCtrl',
        ['$rootScope', '$scope', 'LinkEntry', function ($rootScope, $scope, LinkEntry) {

          $scope.loading = true;
          LinkEntry.getAll(function (res) {
            $scope.linkEntries = res;
            $scope.loading = false;
          }, function (err) {
            $rootScope.error = "Failed to fetch LinkEntry.getAll.";
            $scope.loading = false;
          });

        }]);

angular.module('dpreddit-angular')
    .controller('RegisterCtrl',
        ['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {

          $scope.register = function () {
            Auth.register({
                  username: $scope.username,
                  password: $scope.password,
                  passwordrepeat: $scope.passwordrepeat,
                  role: Auth.userRoles.user
                },
                function () {
                  $location.path('/');
                },
                function (err) {
                  $rootScope.error = err;
                });
          };
        }]);

angular.module('dpreddit-angular')
    .controller('NewLinkEntryCtrl',
        ['$rootScope', '$scope', '$location', 'LinkEntry', function ($rootScope, $scope, $location, LinkEntry) {

          $scope.addnewlinkentry = function () {
            LinkEntry.addnewlinkentry({
              linkentrytitle: $scope.newlinkentrytitle,
              linkentryurl: $scope.newlinkentryurl
            },
            function () {
              $location.path('/');
            },
            function (err) {
              $rootScope.error = err;
            });
          };
        }]);

angular.module('dpreddit-angular')
    .controller('PrivateCtrl',
        ['$rootScope', function ($rootScope) {
        }]);

