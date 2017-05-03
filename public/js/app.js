'use strict';

// Declare app level module which depends on views, and components
/***
 App Main Script
 ***/

/* Metronic App */
var AdminApp = angular.module("AdminApp", [
  "ui.router",
  "ngSanitize",
  'ngResource',
  'ngRoute',
  'ngMaterial',
  'ngMdIcons',
  //'ui.grid',
  //'ui.grid.edit',
  //'ui.grid.treeView',
  //'ui.grid.resizeColumns',
  //'ui.grid.selection',
  //'ui.grid.expandable',
  //'ui.grid.pinning',
  //'ui.grid.cellNav',
  //'ui.grid.rowEdit',
]);


/**
 * Created by Antony Repin on 30.04.2017.
 */

'use strict';

/**
 * Global application configuration
 */
AdminApp.factory('settings', [
  '$rootScope',
  '$locale',

  function ($rootScope,
            $locale) {

    /**
     * Default height of rows in grid
     * @type {number}
     */
    var gridRowHeight = 36;

    $locale.id = "nl-BE";

    /**
     * Application configuration
     *
     * @type {{apiHost: string, apiVersion: string, appVersion: string, grid: {defaults: {data: null, headerRowHeight: number, rowHeight: number, idRowWidth: string, excludeProperties: string[], enableColumnResizing: boolean, enableSorting: boolean, enableHorizontalScrollbar: boolean, showGridFooter: boolean, enableFiltering: boolean, enableRowSelection: boolean, enableRowHeaderSelection: boolean, enableSelectAll: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, enableColumnMenus: boolean, onRegisterApi: settings.grid.defaults.onRegisterApi}}}}
     */
    var settings = {
        apiHost: 'http://back.barq.zee.lan/',
        apiVersion: 'v1',
        appVersion: '0.0.1',
        grid: {
          defaults: {
            data: null,
            headerRowHeight: 60,
            rowHeight: gridRowHeight,
            idRowWidth: "6%",
            excludeProperties: ['treeLevel', '$$treeLevel'],
            enableColumnResizing: true,
            enableSorting: true,
            enableHorizontalScrollbar: false,
            showGridFooter: false,
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableColumnMenus: false,
            /**
             *
             * @param gridApi
             */
            onRegisterApi: function (gridApi) {
              console.info(gridApi);
            }
          }
        },
        toastr: {
          closeButton: false,
          debug: false,
          newestOnTop: false,
          progressBar: false,
          positionClass: "toast-top-center",
          preventDuplicates: true,
          onclick: null,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut"
        }
      }
      ;

    $rootScope.settings = settings;

    /**
     * Data stores container
     * @type {{}}
     */
    $rootScope.stores = {};

    toastr.options = settings.toastr;

    return settings;
  }]);

AdminApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

/**
 * Angular Material theme configuration
 */
AdminApp.config(function ($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('blue', {
    contrastDefaultColor: 'dark',
    contrastDarkColors: ['50'],
    '50': '000000'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {default: '500', 'hue-1': '50'})
    .accentPalette('pink');

  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('grey')
});

AdminApp.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

/**
 * Created by Antony Repin on 30.04.2017.
 */

'use strict';

AdminApp.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider,
            $urlRouterProvider) {

    /**
     * Redirect on any unmatched url
     */
    $urlRouterProvider.otherwise("login");

    /**
     * API configuration
     * @type {}
     */
    var pages = {
      login: {
        url: "/login",
        controller: "LoginController",
        templateUrl: "views/login.html",
        data: {pageTitle: 'Log In'},
      },
      dashboard: {
        url: "/dashboard",
        controller: "DashboardController",
        templateUrl: "views/dashboard.html",
        data: {pageTitle: 'Dashboard'},
      },
    };

    /**
     * Add API states to app
     */
    angular.forEach(pages, function (props, alias) {
      $stateProvider.state(alias, Object.assign({resolve: {}}, props))
    });

  }]);

/**
 * Created by Antony Repin on 30.04.2017.
 */

/* Init global settings and run the app */
AdminApp.run(['$rootScope',"settings", "$state","$location",
  function ($rootScope, settings, $state,$location ) {

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    if(!localStorage.getItem('token')){
      $location.path('/');
    }
  }
]);

'use strict';

angular.module('AdminApp.version.interpolate-filter', [])
  .filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

'use strict';

AdminApp.directive('appVersion', function () {
    return function (scope, elm, attrs) {
      elm.text(scope.appVersion);
    };
  });

'use strict';

angular.module('AdminApp.version', [
  'AdminApp.version.interpolate-filter',
  'AdminApp.version.version-directive'
]).value('version', '0.0.1');

/**
 * Created by Antony Repin on 02.05.2017.
 */

angular.module('AdminApp')
  .controller('ApplicationController',
    [
      '$scope',
      '$rootScope',
      '$mdDialog',
      '$state',
      '$q',
      '$http',
      'settings',

      function ($scope,
                $rootScope,
                $mdDialog,
                $state,
                $q,
                $http,
                settings) {

        $scope.state = $state;

        /**
         * XHR loading flag
         * @type {boolean}
         */
        $rootScope.isLoading = function () {
          return $http.pendingRequests.length !== 0;
        };

        /**
         * Set user data
         */
        $scope.token = localStorage.getItem('token');

        /**
         * @type {Array}
         */
        $scope.alerts = [];

        /**
         * @type {Array}
         */
        $scope.pageAlerts = [];

        /**
         * Form alerts array
         * @type {Array}
         */
        $scope.formAlerts = [];

        /**
         * Set application language
         * @type {string}
         */
        $scope.lang = localStorage.getItem('lang') == null ? 'EN' : localStorage.getItem('lang');

        /**
         * Globally available API version variable
         * @type {string}
         */
        $scope.apiVersion = $rootScope.settings.apiVersion;
        console.info("API version: %s", $scope.apiVersion);

        /**
         * Globally available application version variable
         * @type {string}
         */
        $scope.appVersion = $rootScope.settings.appVersion;
        console.info("Application version: %s", $scope.appVersion);

        /**
         *
         * @param angularForm Object
         * @returns {Array}
         */
        $rootScope.getFormErrors = function (angularForm) {
          $scope.alerts = [];
          var messages = [];
          angular.forEach(angularForm.$error, function (el, cond) {
            console.warn("Form is invalid", angularForm);
            el.forEach(function (element) {
              if (element.$name === "")
                throw new Error("Element 'name' attribute not defined!");
              else {
                messages.push(element.$name + ' is ' + cond);
              }
            });
          });
          return messages;
        };

        /**
         * Add Bootstrap alert
         * @param msg String
         * @param type String
         */
        $rootScope.addAlert = function (msg, type) {
          type = (typeof type !== 'undefined') ? type : 'warning';
          msg = (typeof msg !== 'undefined') ? msg : '';
          $scope.alerts.push({type: type, msg: msg});
        };

        /**
         * Close alert by index
         * @param index Number
         */
        $rootScope.closeAlert = function (index) {
          $scope.alerts.splice(index, 1);
        };

        /**
         * Get validation errors
         * @param response Object
         */
        $rootScope.getResponseErrors = function (response) {
          if (response.data.hasOwnProperty('message')) {
            var m = response.data.message;
            $scope.alerts = [];
            response.data.message = JSON.parse(m);
            angular.forEach(response.data.message, function (msg) {
              angular.forEach(msg, function (err, prop) {
                $rootScope.addAlert(prop + ": " + err);
              });
            });
          }
        };

        /**
         * Get auth token
         */
        $rootScope.getToken = function () {
          //console.debug("Token: ", localStorage.getItem('token'));
          if (!!localStorage.getItem('token') === true) {
            return localStorage.getItem('token');
          }
          return false;
        };


        // /**
        //  * Get user data and set $scope variable
        //  */
        // ($rootScope.setUserData = function () {
        //   erpApi.get('management/user')
        //     .then(function (response) {
        //       if (response.status === 200) {
        //         $rootScope.$emit('rootScope:setUserData', {data: response.data});
        //         $scope.userData = response.data;
        //       } else
        //         throw response.statusText;
        //     });
        // })();

        /**
         * Close alert
         * @param index
         */
        $rootScope.closePageAlert = function (index, scope) {
          scope.pageAlerts.splice(index, 1);
          return scope;
        }

      }
    ]);


/**
 * Created by Antony Repin on 02.05.2017.
 */


angular.module('AdminApp')
  .controller('LoginController',
    [
      '$scope',
      '$rootScope',
      '$mdDialog',
      '$q',
      '$http',
      'settings',

      function ($scope,
                $rootScope,
                $state,
                $q,
                $http,
                settings) {

        console.log("Initializing LoginController");

        $scope.$on('$viewContentLoaded', function () {

        });

        /**
         * User object container
         * @type {{}}
         */
        $scope.user = {};

        /**
         * Process user login
         */
        $scope.doLogin = function () {

          if (this.loginForm.$valid) {
            var req = {
              method: 'POST',
              url: settings.apiHost + 'api/admin/' + settings.apiVersion + '/authenticate',
              data: $scope.user,
              headers: {"content-type": "application/json"}
            };

            $http(req)
              .then(function loginCallback(loginResponse) {

                if (loginResponse.status === 200) {
                  if (loginResponse.data.status === 'success') {

                    try {
                      localStorage.setItem('token', loginResponse.data.data.data.attributes.token);
                    } catch (error) {
                      console.error(error.message);
                      return;
                    }

                    Object.assign(req, {
                      method: 'POST',
                      url: settings.apiHost + 'api/admin/' + settings.apiVersion + '/user/me',
                      headers: {
                        "content-type": "application/json",
                        "authorization": "Bearer " + localStorage.getItem('token')
                      }
                    });

                    $http(req)
                      .then(function userDataCallback(userDataResponse) {
                        debugger;
                      });
                  }
                }
              });
          } else {
            this.loginForm.$setDirty();
            var alerts = '';
            $rootScope.getFormErrors(this.loginForm)
              .forEach(function (msg, idx) {
                $scope.formAlerts.push({type: 'danger', msg: msg});
                alerts += msg + "<br/>";
              });
            console.log($scope.formAlerts);
            toastr.options.closeButton = true;
            toastr["error"](alerts, "Login Error");
          }
        }

      }]);


'use strict';

angular.module('AdminApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInN0YXRlLmpzIiwicnVuLmpzIiwiaW50ZXJwb2xhdGUtZmlsdGVyLmpzIiwidmVyc2lvbi1kaXJlY3RpdmUuanMiLCJ2ZXJzaW9uLmpzIiwiQXBwbGljYXRpb25Db250cm9sbGVyLmpzIiwiTG9naW5Db250cm9sbGVyLmpzIiwiZGFzaGJvYXJkL2NpdHlTdGF0cy5qcyIsImRhc2hib2FyZC9sYXRlc3RPcmRlcnMuanMiLCJkYXNoYm9hcmQvb3JkZXJTdGF0cy5qcyIsImRhc2hib2FyZC9vcmRlcnNTdW1tYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQ0FBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8gRGVjbGFyZSBhcHAgbGV2ZWwgbW9kdWxlIHdoaWNoIGRlcGVuZHMgb24gdmlld3MsIGFuZCBjb21wb25lbnRzXG4vKioqXG4gQXBwIE1haW4gU2NyaXB0XG4gKioqL1xuXG4vKiBNZXRyb25pYyBBcHAgKi9cbnZhciBBZG1pbkFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiQWRtaW5BcHBcIiwgW1xuICBcInVpLnJvdXRlclwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgJ25nUmVzb3VyY2UnLFxuICAnbmdSb3V0ZScsXG4gICduZ01hdGVyaWFsJyxcbiAgJ25nTWRJY29ucycsXG4gIC8vJ3VpLmdyaWQnLFxuICAvLyd1aS5ncmlkLmVkaXQnLFxuICAvLyd1aS5ncmlkLnRyZWVWaWV3JyxcbiAgLy8ndWkuZ3JpZC5yZXNpemVDb2x1bW5zJyxcbiAgLy8ndWkuZ3JpZC5zZWxlY3Rpb24nLFxuICAvLyd1aS5ncmlkLmV4cGFuZGFibGUnLFxuICAvLyd1aS5ncmlkLnBpbm5pbmcnLFxuICAvLyd1aS5ncmlkLmNlbGxOYXYnLFxuICAvLyd1aS5ncmlkLnJvd0VkaXQnLFxuXSk7XG5cbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFudG9ueSBSZXBpbiBvbiAzMC4wNC4yMDE3LlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBHbG9iYWwgYXBwbGljYXRpb24gY29uZmlndXJhdGlvblxyXG4gKi9cclxuQWRtaW5BcHAuZmFjdG9yeSgnc2V0dGluZ3MnLCBbXHJcbiAgJyRyb290U2NvcGUnLFxyXG4gICckbG9jYWxlJyxcclxuXHJcbiAgZnVuY3Rpb24gKCRyb290U2NvcGUsXHJcbiAgICAgICAgICAgICRsb2NhbGUpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgaGVpZ2h0IG9mIHJvd3MgaW4gZ3JpZFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgdmFyIGdyaWRSb3dIZWlnaHQgPSAzNjtcclxuXHJcbiAgICAkbG9jYWxlLmlkID0gXCJubC1CRVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbGljYXRpb24gY29uZmlndXJhdGlvblxyXG4gICAgICpcclxuICAgICAqIEB0eXBlIHt7YXBpSG9zdDogc3RyaW5nLCBhcGlWZXJzaW9uOiBzdHJpbmcsIGFwcFZlcnNpb246IHN0cmluZywgZ3JpZDoge2RlZmF1bHRzOiB7ZGF0YTogbnVsbCwgaGVhZGVyUm93SGVpZ2h0OiBudW1iZXIsIHJvd0hlaWdodDogbnVtYmVyLCBpZFJvd1dpZHRoOiBzdHJpbmcsIGV4Y2x1ZGVQcm9wZXJ0aWVzOiBzdHJpbmdbXSwgZW5hYmxlQ29sdW1uUmVzaXppbmc6IGJvb2xlYW4sIGVuYWJsZVNvcnRpbmc6IGJvb2xlYW4sIGVuYWJsZUhvcml6b250YWxTY3JvbGxiYXI6IGJvb2xlYW4sIHNob3dHcmlkRm9vdGVyOiBib29sZWFuLCBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW4sIGVuYWJsZVJvd1NlbGVjdGlvbjogYm9vbGVhbiwgZW5hYmxlUm93SGVhZGVyU2VsZWN0aW9uOiBib29sZWFuLCBlbmFibGVTZWxlY3RBbGw6IGJvb2xlYW4sIG11bHRpU2VsZWN0OiBib29sZWFuLCBtb2RpZmllcktleXNUb011bHRpU2VsZWN0OiBib29sZWFuLCBlbmFibGVDb2x1bW5NZW51czogYm9vbGVhbiwgb25SZWdpc3RlckFwaTogc2V0dGluZ3MuZ3JpZC5kZWZhdWx0cy5vblJlZ2lzdGVyQXBpfX19fVxyXG4gICAgICovXHJcbiAgICB2YXIgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgYXBpSG9zdDogJ2h0dHA6Ly9iYWNrLmJhcnEuemVlLmxhbi8nLFxyXG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXHJcbiAgICAgICAgYXBwVmVyc2lvbjogJzAuMC4xJyxcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBoZWFkZXJSb3dIZWlnaHQ6IDYwLFxyXG4gICAgICAgICAgICByb3dIZWlnaHQ6IGdyaWRSb3dIZWlnaHQsXHJcbiAgICAgICAgICAgIGlkUm93V2lkdGg6IFwiNiVcIixcclxuICAgICAgICAgICAgZXhjbHVkZVByb3BlcnRpZXM6IFsndHJlZUxldmVsJywgJyQkdHJlZUxldmVsJ10sXHJcbiAgICAgICAgICAgIGVuYWJsZUNvbHVtblJlc2l6aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVTb3J0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVIb3Jpem9udGFsU2Nyb2xsYmFyOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0dyaWRGb290ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBlbmFibGVGaWx0ZXJpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGVuYWJsZVJvd1NlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgZW5hYmxlUm93SGVhZGVyU2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVTZWxlY3RBbGw6IGZhbHNlLFxyXG4gICAgICAgICAgICBtdWx0aVNlbGVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIG1vZGlmaWVyS2V5c1RvTXVsdGlTZWxlY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICBlbmFibGVDb2x1bW5NZW51czogZmFsc2UsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gZ3JpZEFwaVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgb25SZWdpc3RlckFwaTogZnVuY3Rpb24gKGdyaWRBcGkpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmluZm8oZ3JpZEFwaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvYXN0cjoge1xyXG4gICAgICAgICAgY2xvc2VCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IGZhbHNlLFxyXG4gICAgICAgICAgcHJvZ3Jlc3NCYXI6IGZhbHNlLFxyXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogXCJ0b2FzdC10b3AtY2VudGVyXCIsXHJcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogdHJ1ZSxcclxuICAgICAgICAgIG9uY2xpY2s6IG51bGwsXHJcbiAgICAgICAgICBzaG93RHVyYXRpb246IDMwMCxcclxuICAgICAgICAgIGhpZGVEdXJhdGlvbjogMTAwMCxcclxuICAgICAgICAgIHRpbWVPdXQ6IDUwMDAsXHJcbiAgICAgICAgICBleHRlbmRlZFRpbWVPdXQ6IDEwMDAsXHJcbiAgICAgICAgICBzaG93RWFzaW5nOiBcInN3aW5nXCIsXHJcbiAgICAgICAgICBoaWRlRWFzaW5nOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgc2hvd01ldGhvZDogXCJmYWRlSW5cIixcclxuICAgICAgICAgIGhpZGVNZXRob2Q6IFwiZmFkZU91dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIDtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRhIHN0b3JlcyBjb250YWluZXJcclxuICAgICAqIEB0eXBlIHt7fX1cclxuICAgICAqL1xyXG4gICAgJHJvb3RTY29wZS5zdG9yZXMgPSB7fTtcclxuXHJcbiAgICB0b2FzdHIub3B0aW9ucyA9IHNldHRpbmdzLnRvYXN0cjtcclxuXHJcbiAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgfV0pO1xyXG5cclxuQWRtaW5BcHAuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaGFzaFByZWZpeCgnIScpO1xyXG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy9sb2dpbid9KTtcclxufV0pO1xyXG5cclxuLyoqXHJcbiAqIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgY29uZmlndXJhdGlvblxyXG4gKi9cclxuQWRtaW5BcHAuY29uZmlnKGZ1bmN0aW9uICgkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdibHVlJywge1xyXG4gICAgY29udHJhc3REZWZhdWx0Q29sb3I6ICdkYXJrJyxcclxuICAgIGNvbnRyYXN0RGFya0NvbG9yczogWyc1MCddLFxyXG4gICAgJzUwJzogJzAwMDAwMCdcclxuICB9KTtcclxuICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnY3VzdG9tQmx1ZScsIGN1c3RvbUJsdWVNYXApO1xyXG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXHJcbiAgICAucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCB7ZGVmYXVsdDogJzUwMCcsICdodWUtMSc6ICc1MCd9KVxyXG4gICAgLmFjY2VudFBhbGV0dGUoJ3BpbmsnKTtcclxuXHJcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdpbnB1dCcsICdkZWZhdWx0JylcclxuICAgIC5wcmltYXJ5UGFsZXR0ZSgnZ3JleScpXHJcbn0pO1xyXG5cclxuQWRtaW5BcHAuY29uZmlnKFsnJHFQcm92aWRlcicsIGZ1bmN0aW9uICgkcVByb3ZpZGVyKSB7XHJcbiAgJHFQcm92aWRlci5lcnJvck9uVW5oYW5kbGVkUmVqZWN0aW9ucyhmYWxzZSk7XHJcbn1dKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQW50b255IFJlcGluIG9uIDMwLjA0LjIwMTcuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuQWRtaW5BcHAuY29uZmlnKFtcclxuICAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG5cclxuICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsXHJcbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVkaXJlY3Qgb24gYW55IHVubWF0Y2hlZCB1cmxcclxuICAgICAqL1xyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcImxvZ2luXCIpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQVBJIGNvbmZpZ3VyYXRpb25cclxuICAgICAqIEB0eXBlIHt9XHJcbiAgICAgKi9cclxuICAgIHZhciBwYWdlcyA9IHtcclxuICAgICAgbG9naW46IHtcclxuICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi5odG1sXCIsXHJcbiAgICAgICAgZGF0YToge3BhZ2VUaXRsZTogJ0xvZyBJbid9LFxyXG4gICAgICB9LFxyXG4gICAgICBkYXNoYm9hcmQ6IHtcclxuICAgICAgICB1cmw6IFwiL2Rhc2hib2FyZFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwiRGFzaGJvYXJkQ29udHJvbGxlclwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgZGF0YToge3BhZ2VUaXRsZTogJ0Rhc2hib2FyZCd9LFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBBUEkgc3RhdGVzIHRvIGFwcFxyXG4gICAgICovXHJcbiAgICBhbmd1bGFyLmZvckVhY2gocGFnZXMsIGZ1bmN0aW9uIChwcm9wcywgYWxpYXMpIHtcclxuICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoYWxpYXMsIE9iamVjdC5hc3NpZ24oe3Jlc29sdmU6IHt9fSwgcHJvcHMpKVxyXG4gICAgfSk7XHJcblxyXG4gIH1dKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQW50b255IFJlcGluIG9uIDMwLjA0LjIwMTcuXHJcbiAqL1xyXG5cclxuLyogSW5pdCBnbG9iYWwgc2V0dGluZ3MgYW5kIHJ1biB0aGUgYXBwICovXHJcbkFkbWluQXBwLnJ1bihbJyRyb290U2NvcGUnLFwic2V0dGluZ3NcIiwgXCIkc3RhdGVcIixcIiRsb2NhdGlvblwiLFxyXG4gIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBzZXR0aW5ncywgJHN0YXRlLCRsb2NhdGlvbiApIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTsgLy8gc3RhdGUgdG8gYmUgYWNjZXNzZWQgZnJvbSB2aWV3XHJcbiAgICAkcm9vdFNjb3BlLiRzZXR0aW5ncyA9IHNldHRpbmdzOyAvLyBzdGF0ZSB0byBiZSBhY2Nlc3NlZCBmcm9tIHZpZXdcclxuXHJcbiAgICBpZighbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJykpe1xyXG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgfVxyXG4gIH1cclxuXSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ0FkbWluQXBwLnZlcnNpb24uaW50ZXJwb2xhdGUtZmlsdGVyJywgW10pXG4gIC5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcodGV4dCkucmVwbGFjZSgvXFwlVkVSU0lPTlxcJS9tZywgdmVyc2lvbik7XG4gICAgfTtcbiAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5BZG1pbkFwcC5kaXJlY3RpdmUoJ2FwcFZlcnNpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxtLCBhdHRycykge1xuICAgICAgZWxtLnRleHQoc2NvcGUuYXBwVmVyc2lvbik7XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdBZG1pbkFwcC52ZXJzaW9uJywgW1xuICAnQWRtaW5BcHAudmVyc2lvbi5pbnRlcnBvbGF0ZS1maWx0ZXInLFxuICAnQWRtaW5BcHAudmVyc2lvbi52ZXJzaW9uLWRpcmVjdGl2ZSdcbl0pLnZhbHVlKCd2ZXJzaW9uJywgJzAuMC4xJyk7XG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBBbnRvbnkgUmVwaW4gb24gMDIuMDUuMjAxNy5cclxuICovXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnQWRtaW5BcHAnKVxyXG4gIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkNvbnRyb2xsZXInLFxyXG4gICAgW1xyXG4gICAgICAnJHNjb3BlJyxcclxuICAgICAgJyRyb290U2NvcGUnLFxyXG4gICAgICAnJG1kRGlhbG9nJyxcclxuICAgICAgJyRzdGF0ZScsXHJcbiAgICAgICckcScsXHJcbiAgICAgICckaHR0cCcsXHJcbiAgICAgICdzZXR0aW5ncycsXHJcblxyXG4gICAgICBmdW5jdGlvbiAoJHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZyxcclxuICAgICAgICAgICAgICAgICRzdGF0ZSxcclxuICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgJGh0dHAsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5ncykge1xyXG5cclxuICAgICAgICAkc2NvcGUuc3RhdGUgPSAkc3RhdGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFhIUiBsb2FkaW5nIGZsYWdcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICAkcm9vdFNjb3BlLmlzTG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wZW5kaW5nUmVxdWVzdHMubGVuZ3RoICE9PSAwO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB1c2VyIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGUudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5hbGVydHMgPSBbXTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5wYWdlQWxlcnRzID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvcm0gYWxlcnRzIGFycmF5XHJcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5mb3JtQWxlcnRzID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCBhcHBsaWNhdGlvbiBsYW5ndWFnZVxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLmxhbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFuZycpID09IG51bGwgPyAnRU4nIDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhbmcnKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2xvYmFsbHkgYXZhaWxhYmxlIEFQSSB2ZXJzaW9uIHZhcmlhYmxlXHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGUuYXBpVmVyc2lvbiA9ICRyb290U2NvcGUuc2V0dGluZ3MuYXBpVmVyc2lvbjtcclxuICAgICAgICBjb25zb2xlLmluZm8oXCJBUEkgdmVyc2lvbjogJXNcIiwgJHNjb3BlLmFwaVZlcnNpb24pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHbG9iYWxseSBhdmFpbGFibGUgYXBwbGljYXRpb24gdmVyc2lvbiB2YXJpYWJsZVxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLmFwcFZlcnNpb24gPSAkcm9vdFNjb3BlLnNldHRpbmdzLmFwcFZlcnNpb247XHJcbiAgICAgICAgY29uc29sZS5pbmZvKFwiQXBwbGljYXRpb24gdmVyc2lvbjogJXNcIiwgJHNjb3BlLmFwcFZlcnNpb24pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBhbmd1bGFyRm9ybSBPYmplY3RcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHJvb3RTY29wZS5nZXRGb3JtRXJyb3JzID0gZnVuY3Rpb24gKGFuZ3VsYXJGb3JtKSB7XHJcbiAgICAgICAgICAkc2NvcGUuYWxlcnRzID0gW107XHJcbiAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBbXTtcclxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyRm9ybS4kZXJyb3IsIGZ1bmN0aW9uIChlbCwgY29uZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGb3JtIGlzIGludmFsaWRcIiwgYW5ndWxhckZvcm0pO1xyXG4gICAgICAgICAgICBlbC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuJG5hbWUgPT09IFwiXCIpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50ICduYW1lJyBhdHRyaWJ1dGUgbm90IGRlZmluZWQhXCIpO1xyXG4gICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChlbGVtZW50LiRuYW1lICsgJyBpcyAnICsgY29uZCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZCBCb290c3RyYXAgYWxlcnRcclxuICAgICAgICAgKiBAcGFyYW0gbXNnIFN0cmluZ1xyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIFN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRyb290U2NvcGUuYWRkQWxlcnQgPSBmdW5jdGlvbiAobXNnLCB0eXBlKSB7XHJcbiAgICAgICAgICB0eXBlID0gKHR5cGVvZiB0eXBlICE9PSAndW5kZWZpbmVkJykgPyB0eXBlIDogJ3dhcm5pbmcnO1xyXG4gICAgICAgICAgbXNnID0gKHR5cGVvZiBtc2cgIT09ICd1bmRlZmluZWQnKSA/IG1zZyA6ICcnO1xyXG4gICAgICAgICAgJHNjb3BlLmFsZXJ0cy5wdXNoKHt0eXBlOiB0eXBlLCBtc2c6IG1zZ30pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsb3NlIGFsZXJ0IGJ5IGluZGV4XHJcbiAgICAgICAgICogQHBhcmFtIGluZGV4IE51bWJlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRyb290U2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgJHNjb3BlLmFsZXJ0cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCB2YWxpZGF0aW9uIGVycm9yc1xyXG4gICAgICAgICAqIEBwYXJhbSByZXNwb25zZSBPYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICAkcm9vdFNjb3BlLmdldFJlc3BvbnNlRXJyb3JzID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5oYXNPd25Qcm9wZXJ0eSgnbWVzc2FnZScpKSB7XHJcbiAgICAgICAgICAgIHZhciBtID0gcmVzcG9uc2UuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRzID0gW107XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEubWVzc2FnZSA9IEpTT04ucGFyc2UobSk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZXNwb25zZS5kYXRhLm1lc3NhZ2UsIGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobXNnLCBmdW5jdGlvbiAoZXJyLCBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZEFsZXJ0KHByb3AgKyBcIjogXCIgKyBlcnIpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgYXV0aCB0b2tlblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRyb290U2NvcGUuZ2V0VG9rZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUuZGVidWcoXCJUb2tlbjogXCIsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKTtcclxuICAgICAgICAgIGlmICghIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gLyoqXHJcbiAgICAgICAgLy8gICogR2V0IHVzZXIgZGF0YSBhbmQgc2V0ICRzY29wZSB2YXJpYWJsZVxyXG4gICAgICAgIC8vICAqL1xyXG4gICAgICAgIC8vICgkcm9vdFNjb3BlLnNldFVzZXJEYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICAgZXJwQXBpLmdldCgnbWFuYWdlbWVudC91c2VyJylcclxuICAgICAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy8gICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdyb290U2NvcGU6c2V0VXNlckRhdGEnLCB7ZGF0YTogcmVzcG9uc2UuZGF0YX0pO1xyXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLnVzZXJEYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAvLyAgICAgICB9IGVsc2VcclxuICAgICAgICAvLyAgICAgICAgIHRocm93IHJlc3BvbnNlLnN0YXR1c1RleHQ7XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH0pKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsb3NlIGFsZXJ0XHJcbiAgICAgICAgICogQHBhcmFtIGluZGV4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHJvb3RTY29wZS5jbG9zZVBhZ2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCwgc2NvcGUpIHtcclxuICAgICAgICAgIHNjb3BlLnBhZ2VBbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgIHJldHVybiBzY29wZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICBdKTtcclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFudG9ueSBSZXBpbiBvbiAwMi4wNS4yMDE3LlxyXG4gKi9cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnQWRtaW5BcHAnKVxyXG4gIC5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgW1xyXG4gICAgICAnJHNjb3BlJyxcclxuICAgICAgJyRyb290U2NvcGUnLFxyXG4gICAgICAnJG1kRGlhbG9nJyxcclxuICAgICAgJyRxJyxcclxuICAgICAgJyRodHRwJyxcclxuICAgICAgJ3NldHRpbmdzJyxcclxuXHJcbiAgICAgIGZ1bmN0aW9uICgkc2NvcGUsXHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLFxyXG4gICAgICAgICAgICAgICAgJHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgJHEsXHJcbiAgICAgICAgICAgICAgICAkaHR0cCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzKSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIExvZ2luQ29udHJvbGxlclwiKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVXNlciBvYmplY3QgY29udGFpbmVyXHJcbiAgICAgICAgICogQHR5cGUge3t9fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS51c2VyID0ge307XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb2Nlc3MgdXNlciBsb2dpblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmxvZ2luRm9ybS4kdmFsaWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcSA9IHtcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICB1cmw6IHNldHRpbmdzLmFwaUhvc3QgKyAnYXBpL2FkbWluLycgKyBzZXR0aW5ncy5hcGlWZXJzaW9uICsgJy9hdXRoZW50aWNhdGUnLFxyXG4gICAgICAgICAgICAgIGRhdGE6ICRzY29wZS51c2VyLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRodHRwKHJlcSlcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBsb2dpbkNhbGxiYWNrKGxvZ2luUmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5SZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAobG9naW5SZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBsb2dpblJlc3BvbnNlLmRhdGEuZGF0YS5kYXRhLmF0dHJpYnV0ZXMudG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXEsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlIb3N0ICsgJ2FwaS9hZG1pbi8nICsgc2V0dGluZ3MuYXBpVmVyc2lvbiArICcvdXNlci9tZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkaHR0cChyZXEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiB1c2VyRGF0YUNhbGxiYWNrKHVzZXJEYXRhUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkZvcm0uJHNldERpcnR5KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVydHMgPSAnJztcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5nZXRGb3JtRXJyb3JzKHRoaXMubG9naW5Gb3JtKVxyXG4gICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChtc2csIGlkeCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm1BbGVydHMucHVzaCh7dHlwZTogJ2RhbmdlcicsIG1zZzogbXNnfSk7XHJcbiAgICAgICAgICAgICAgICBhbGVydHMgKz0gbXNnICsgXCI8YnIvPlwiO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZm9ybUFsZXJ0cyk7XHJcbiAgICAgICAgICAgIHRvYXN0ci5vcHRpb25zLmNsb3NlQnV0dG9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgdG9hc3RyW1wiZXJyb3JcIl0oYWxlcnRzLCBcIkxvZ2luIEVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1dKTtcclxuIiwiIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQWRtaW5BcHAudmlldzEnLCBbJ25nUm91dGUnXSlcblxuLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3ZpZXcxJywge1xuICAgIHRlbXBsYXRlVXJsOiAndmlldzEvdmlldzEuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ1ZpZXcxQ3RybCdcbiAgfSk7XG59XSlcblxuLmNvbnRyb2xsZXIoJ1ZpZXcxQ3RybCcsIFtmdW5jdGlvbigpIHtcblxufV0pO1xuIiwiIiwiIl19
