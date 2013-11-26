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
        ['$rootScope', function ($rootScope) {

        }]);

angular.module('dpreddit-angular')
    .controller('RegisterCtrl',
        ['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {
          $scope.role = Auth.userRoles.user;
          $scope.userRoles = Auth.userRoles;

          $scope.register = function () {
            Auth.register({
                  username: $scope.username,
                  password: $scope.password,
                  passwordrepeat: $scope.passwordrepeat,
                  role: $scope.role
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

