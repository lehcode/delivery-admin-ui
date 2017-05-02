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
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50'],
    '50': 'ffffff'
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

      function ($scope,
                $rootScope,
                $state,
                $q,
                $http) {

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
              url: settings.apiHost + '/api/admin/' + settings.apiVersion + '/authenticate',
              data: $scope.user,
              headers: {"content-type": "application/json"}
            };

            $http(req)
              .then(function loginCallback(response) {
                localStorage.setItem('token', response.data.data.attributes.token);

                $http(req)
                  .then(function userDataCallback(response) {

                  });

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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInN0YXRlLmpzIiwicnVuLmpzIiwiaW50ZXJwb2xhdGUtZmlsdGVyLmpzIiwidmVyc2lvbi1kaXJlY3RpdmUuanMiLCJ2ZXJzaW9uLmpzIiwiQXBwbGljYXRpb25Db250cm9sbGVyLmpzIiwiTG9naW5Db250cm9sbGVyLmpzIiwiZGFzaGJvYXJkL2NpdHlTdGF0cy5qcyIsImRhc2hib2FyZC9sYXRlc3RPcmRlcnMuanMiLCJkYXNoYm9hcmQvb3JkZXJTdGF0cy5qcyIsImRhc2hib2FyZC9vcmRlcnNTdW1tYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQ0FBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8gRGVjbGFyZSBhcHAgbGV2ZWwgbW9kdWxlIHdoaWNoIGRlcGVuZHMgb24gdmlld3MsIGFuZCBjb21wb25lbnRzXG4vKioqXG4gQXBwIE1haW4gU2NyaXB0XG4gKioqL1xuXG4vKiBNZXRyb25pYyBBcHAgKi9cbnZhciBBZG1pbkFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiQWRtaW5BcHBcIiwgW1xuICBcInVpLnJvdXRlclwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgJ25nUmVzb3VyY2UnLFxuICAnbmdSb3V0ZScsXG4gICduZ01hdGVyaWFsJyxcbiAgJ25nTWRJY29ucycsXG4gIC8vJ3VpLmdyaWQnLFxuICAvLyd1aS5ncmlkLmVkaXQnLFxuICAvLyd1aS5ncmlkLnRyZWVWaWV3JyxcbiAgLy8ndWkuZ3JpZC5yZXNpemVDb2x1bW5zJyxcbiAgLy8ndWkuZ3JpZC5zZWxlY3Rpb24nLFxuICAvLyd1aS5ncmlkLmV4cGFuZGFibGUnLFxuICAvLyd1aS5ncmlkLnBpbm5pbmcnLFxuICAvLyd1aS5ncmlkLmNlbGxOYXYnLFxuICAvLyd1aS5ncmlkLnJvd0VkaXQnLFxuXSk7XG5cbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFudG9ueSBSZXBpbiBvbiAzMC4wNC4yMDE3LlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBHbG9iYWwgYXBwbGljYXRpb24gY29uZmlndXJhdGlvblxyXG4gKi9cclxuQWRtaW5BcHAuZmFjdG9yeSgnc2V0dGluZ3MnLCBbXHJcbiAgJyRyb290U2NvcGUnLFxyXG4gICckbG9jYWxlJyxcclxuXHJcbiAgZnVuY3Rpb24gKCRyb290U2NvcGUsXHJcbiAgICAgICAgICAgICRsb2NhbGUpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgaGVpZ2h0IG9mIHJvd3MgaW4gZ3JpZFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgdmFyIGdyaWRSb3dIZWlnaHQgPSAzNjtcclxuXHJcbiAgICAkbG9jYWxlLmlkID0gXCJubC1CRVwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbGljYXRpb24gY29uZmlndXJhdGlvblxyXG4gICAgICpcclxuICAgICAqIEB0eXBlIHt7YXBpSG9zdDogc3RyaW5nLCBhcGlWZXJzaW9uOiBzdHJpbmcsIGFwcFZlcnNpb246IHN0cmluZywgZ3JpZDoge2RlZmF1bHRzOiB7ZGF0YTogbnVsbCwgaGVhZGVyUm93SGVpZ2h0OiBudW1iZXIsIHJvd0hlaWdodDogbnVtYmVyLCBpZFJvd1dpZHRoOiBzdHJpbmcsIGV4Y2x1ZGVQcm9wZXJ0aWVzOiBzdHJpbmdbXSwgZW5hYmxlQ29sdW1uUmVzaXppbmc6IGJvb2xlYW4sIGVuYWJsZVNvcnRpbmc6IGJvb2xlYW4sIGVuYWJsZUhvcml6b250YWxTY3JvbGxiYXI6IGJvb2xlYW4sIHNob3dHcmlkRm9vdGVyOiBib29sZWFuLCBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW4sIGVuYWJsZVJvd1NlbGVjdGlvbjogYm9vbGVhbiwgZW5hYmxlUm93SGVhZGVyU2VsZWN0aW9uOiBib29sZWFuLCBlbmFibGVTZWxlY3RBbGw6IGJvb2xlYW4sIG11bHRpU2VsZWN0OiBib29sZWFuLCBtb2RpZmllcktleXNUb011bHRpU2VsZWN0OiBib29sZWFuLCBlbmFibGVDb2x1bW5NZW51czogYm9vbGVhbiwgb25SZWdpc3RlckFwaTogc2V0dGluZ3MuZ3JpZC5kZWZhdWx0cy5vblJlZ2lzdGVyQXBpfX19fVxyXG4gICAgICovXHJcbiAgICB2YXIgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgYXBpSG9zdDogJ2h0dHA6Ly9iYWNrLmJhcnEuemVlLmxhbi8nLFxyXG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXHJcbiAgICAgICAgYXBwVmVyc2lvbjogJzAuMC4xJyxcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICBoZWFkZXJSb3dIZWlnaHQ6IDYwLFxyXG4gICAgICAgICAgICByb3dIZWlnaHQ6IGdyaWRSb3dIZWlnaHQsXHJcbiAgICAgICAgICAgIGlkUm93V2lkdGg6IFwiNiVcIixcclxuICAgICAgICAgICAgZXhjbHVkZVByb3BlcnRpZXM6IFsndHJlZUxldmVsJywgJyQkdHJlZUxldmVsJ10sXHJcbiAgICAgICAgICAgIGVuYWJsZUNvbHVtblJlc2l6aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVTb3J0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVIb3Jpem9udGFsU2Nyb2xsYmFyOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0dyaWRGb290ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBlbmFibGVGaWx0ZXJpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGVuYWJsZVJvd1NlbGVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgZW5hYmxlUm93SGVhZGVyU2VsZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVTZWxlY3RBbGw6IGZhbHNlLFxyXG4gICAgICAgICAgICBtdWx0aVNlbGVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIG1vZGlmaWVyS2V5c1RvTXVsdGlTZWxlY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICBlbmFibGVDb2x1bW5NZW51czogZmFsc2UsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gZ3JpZEFwaVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgb25SZWdpc3RlckFwaTogZnVuY3Rpb24gKGdyaWRBcGkpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmluZm8oZ3JpZEFwaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvYXN0cjoge1xyXG4gICAgICAgICAgY2xvc2VCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICAgICAgbmV3ZXN0T25Ub3A6IGZhbHNlLFxyXG4gICAgICAgICAgcHJvZ3Jlc3NCYXI6IGZhbHNlLFxyXG4gICAgICAgICAgcG9zaXRpb25DbGFzczogXCJ0b2FzdC10b3AtY2VudGVyXCIsXHJcbiAgICAgICAgICBwcmV2ZW50RHVwbGljYXRlczogdHJ1ZSxcclxuICAgICAgICAgIG9uY2xpY2s6IG51bGwsXHJcbiAgICAgICAgICBzaG93RHVyYXRpb246IDMwMCxcclxuICAgICAgICAgIGhpZGVEdXJhdGlvbjogMTAwMCxcclxuICAgICAgICAgIHRpbWVPdXQ6IDUwMDAsXHJcbiAgICAgICAgICBleHRlbmRlZFRpbWVPdXQ6IDEwMDAsXHJcbiAgICAgICAgICBzaG93RWFzaW5nOiBcInN3aW5nXCIsXHJcbiAgICAgICAgICBoaWRlRWFzaW5nOiBcImxpbmVhclwiLFxyXG4gICAgICAgICAgc2hvd01ldGhvZDogXCJmYWRlSW5cIixcclxuICAgICAgICAgIGhpZGVNZXRob2Q6IFwiZmFkZU91dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIDtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRhIHN0b3JlcyBjb250YWluZXJcclxuICAgICAqIEB0eXBlIHt7fX1cclxuICAgICAqL1xyXG4gICAgJHJvb3RTY29wZS5zdG9yZXMgPSB7fTtcclxuXHJcbiAgICB0b2FzdHIub3B0aW9ucyA9IHNldHRpbmdzLnRvYXN0cjtcclxuXHJcbiAgICByZXR1cm4gc2V0dGluZ3M7XHJcbiAgfV0pO1xyXG5cclxuQWRtaW5BcHAuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaGFzaFByZWZpeCgnIScpO1xyXG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy9sb2dpbid9KTtcclxufV0pO1xyXG5cclxuLyoqXHJcbiAqIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgY29uZmlndXJhdGlvblxyXG4gKi9cclxuQWRtaW5BcHAuY29uZmlnKGZ1bmN0aW9uICgkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdibHVlJywge1xyXG4gICAgY29udHJhc3REZWZhdWx0Q29sb3I6ICdsaWdodCcsXHJcbiAgICBjb250cmFzdERhcmtDb2xvcnM6IFsnNTAnXSxcclxuICAgICc1MCc6ICdmZmZmZmYnXHJcbiAgfSk7XHJcbiAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCBjdXN0b21CbHVlTWFwKTtcclxuICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgLnByaW1hcnlQYWxldHRlKCdjdXN0b21CbHVlJywge2RlZmF1bHQ6ICc1MDAnLCAnaHVlLTEnOiAnNTAnfSlcclxuICAgIC5hY2NlbnRQYWxldHRlKCdwaW5rJyk7XHJcblxyXG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnaW5wdXQnLCAnZGVmYXVsdCcpXHJcbiAgICAucHJpbWFyeVBhbGV0dGUoJ2dyZXknKVxyXG59KTtcclxuXHJcbkFkbWluQXBwLmNvbmZpZyhbJyRxUHJvdmlkZXInLCBmdW5jdGlvbiAoJHFQcm92aWRlcikge1xyXG4gICRxUHJvdmlkZXIuZXJyb3JPblVuaGFuZGxlZFJlamVjdGlvbnMoZmFsc2UpO1xyXG59XSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFudG9ueSBSZXBpbiBvbiAzMC4wNC4yMDE3LlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbkFkbWluQXBwLmNvbmZpZyhbXHJcbiAgJyRzdGF0ZVByb3ZpZGVyJyxcclxuICAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuXHJcbiAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLFxyXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZGlyZWN0IG9uIGFueSB1bm1hdGNoZWQgdXJsXHJcbiAgICAgKi9cclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCJsb2dpblwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFQSSBjb25maWd1cmF0aW9uXHJcbiAgICAgKiBAdHlwZSB7fVxyXG4gICAgICovXHJcbiAgICB2YXIgcGFnZXMgPSB7XHJcbiAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGRhdGE6IHtwYWdlVGl0bGU6ICdMb2cgSW4nfSxcclxuICAgICAgfSxcclxuICAgICAgZGFzaGJvYXJkOiB7XHJcbiAgICAgICAgdXJsOiBcIi9kYXNoYm9hcmRcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcIkRhc2hib2FyZENvbnRyb2xsZXJcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9kYXNoYm9hcmQuaHRtbFwiLFxyXG4gICAgICAgIGRhdGE6IHtwYWdlVGl0bGU6ICdEYXNoYm9hcmQnfSxcclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgQVBJIHN0YXRlcyB0byBhcHBcclxuICAgICAqL1xyXG4gICAgYW5ndWxhci5mb3JFYWNoKHBhZ2VzLCBmdW5jdGlvbiAocHJvcHMsIGFsaWFzKSB7XHJcbiAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGFsaWFzLCBPYmplY3QuYXNzaWduKHtyZXNvbHZlOiB7fX0sIHByb3BzKSlcclxuICAgIH0pO1xyXG5cclxuICB9XSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEFudG9ueSBSZXBpbiBvbiAzMC4wNC4yMDE3LlxyXG4gKi9cclxuXHJcbi8qIEluaXQgZ2xvYmFsIHNldHRpbmdzIGFuZCBydW4gdGhlIGFwcCAqL1xyXG5BZG1pbkFwcC5ydW4oWyckcm9vdFNjb3BlJyxcInNldHRpbmdzXCIsIFwiJHN0YXRlXCIsXCIkbG9jYXRpb25cIixcclxuICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgc2V0dGluZ3MsICRzdGF0ZSwkbG9jYXRpb24gKSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7IC8vIHN0YXRlIHRvIGJlIGFjY2Vzc2VkIGZyb20gdmlld1xyXG4gICAgJHJvb3RTY29wZS4kc2V0dGluZ3MgPSBzZXR0aW5nczsgLy8gc3RhdGUgdG8gYmUgYWNjZXNzZWQgZnJvbSB2aWV3XHJcblxyXG4gICAgaWYoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKXtcclxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgIH1cclxuICB9XHJcbl0pO1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdBZG1pbkFwcC52ZXJzaW9uLmludGVycG9sYXRlLWZpbHRlcicsIFtdKVxuICAuZmlsdGVyKCdpbnRlcnBvbGF0ZScsIFsndmVyc2lvbicsIGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH07XG4gIH1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuQWRtaW5BcHAuZGlyZWN0aXZlKCdhcHBWZXJzaW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsbSwgYXR0cnMpIHtcbiAgICAgIGVsbS50ZXh0KHNjb3BlLmFwcFZlcnNpb24pO1xuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQWRtaW5BcHAudmVyc2lvbicsIFtcbiAgJ0FkbWluQXBwLnZlcnNpb24uaW50ZXJwb2xhdGUtZmlsdGVyJyxcbiAgJ0FkbWluQXBwLnZlcnNpb24udmVyc2lvbi1kaXJlY3RpdmUnXG5dKS52YWx1ZSgndmVyc2lvbicsICcwLjAuMScpO1xuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgQW50b255IFJlcGluIG9uIDAyLjA1LjIwMTcuXHJcbiAqL1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0FkbWluQXBwJylcclxuICAuY29udHJvbGxlcignQXBwbGljYXRpb25Db250cm9sbGVyJyxcclxuICAgIFtcclxuICAgICAgJyRzY29wZScsXHJcbiAgICAgICckcm9vdFNjb3BlJyxcclxuICAgICAgJyRtZERpYWxvZycsXHJcbiAgICAgICckc3RhdGUnLFxyXG4gICAgICAnJHEnLFxyXG4gICAgICAnJGh0dHAnLFxyXG4gICAgICAnc2V0dGluZ3MnLFxyXG5cclxuICAgICAgZnVuY3Rpb24gKCRzY29wZSxcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUsXHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2csXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAkcSxcclxuICAgICAgICAgICAgICAgICRodHRwLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLnN0YXRlID0gJHN0YXRlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBYSFIgbG9hZGluZyBmbGFnXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHJvb3RTY29wZS5pc0xvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucGVuZGluZ1JlcXVlc3RzLmxlbmd0aCAhPT0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdXNlciBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGUuYWxlcnRzID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGUucGFnZUFsZXJ0cyA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGb3JtIGFsZXJ0cyBhcnJheVxyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAgICAgKi9cclxuICAgICAgICAkc2NvcGUuZm9ybUFsZXJ0cyA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgYXBwbGljYXRpb24gbGFuZ3VhZ2VcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5sYW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhbmcnKSA9PSBudWxsID8gJ0VOJyA6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYW5nJyk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdsb2JhbGx5IGF2YWlsYWJsZSBBUEkgdmVyc2lvbiB2YXJpYWJsZVxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLmFwaVZlcnNpb24gPSAkcm9vdFNjb3BlLnNldHRpbmdzLmFwaVZlcnNpb247XHJcbiAgICAgICAgY29uc29sZS5pbmZvKFwiQVBJIHZlcnNpb246ICVzXCIsICRzY29wZS5hcGlWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2xvYmFsbHkgYXZhaWxhYmxlIGFwcGxpY2F0aW9uIHZlcnNpb24gdmFyaWFibGVcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRzY29wZS5hcHBWZXJzaW9uID0gJHJvb3RTY29wZS5zZXR0aW5ncy5hcHBWZXJzaW9uO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkFwcGxpY2F0aW9uIHZlcnNpb246ICVzXCIsICRzY29wZS5hcHBWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYW5ndWxhckZvcm0gT2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRyb290U2NvcGUuZ2V0Rm9ybUVycm9ycyA9IGZ1bmN0aW9uIChhbmd1bGFyRm9ybSkge1xyXG4gICAgICAgICAgJHNjb3BlLmFsZXJ0cyA9IFtdO1xyXG4gICAgICAgICAgdmFyIG1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhckZvcm0uJGVycm9yLCBmdW5jdGlvbiAoZWwsIGNvbmQpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRm9ybSBpcyBpbnZhbGlkXCIsIGFuZ3VsYXJGb3JtKTtcclxuICAgICAgICAgICAgZWwuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LiRuYW1lID09PSBcIlwiKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCAnbmFtZScgYXR0cmlidXRlIG5vdCBkZWZpbmVkIVwiKTtcclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goZWxlbWVudC4kbmFtZSArICcgaXMgJyArIGNvbmQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiBtZXNzYWdlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgQm9vdHN0cmFwIGFsZXJ0XHJcbiAgICAgICAgICogQHBhcmFtIG1zZyBTdHJpbmdcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBTdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICAkcm9vdFNjb3BlLmFkZEFsZXJ0ID0gZnVuY3Rpb24gKG1zZywgdHlwZSkge1xyXG4gICAgICAgICAgdHlwZSA9ICh0eXBlb2YgdHlwZSAhPT0gJ3VuZGVmaW5lZCcpID8gdHlwZSA6ICd3YXJuaW5nJztcclxuICAgICAgICAgIG1zZyA9ICh0eXBlb2YgbXNnICE9PSAndW5kZWZpbmVkJykgPyBtc2cgOiAnJztcclxuICAgICAgICAgICRzY29wZS5hbGVydHMucHVzaCh7dHlwZTogdHlwZSwgbXNnOiBtc2d9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbG9zZSBhbGVydCBieSBpbmRleFxyXG4gICAgICAgICAqIEBwYXJhbSBpbmRleCBOdW1iZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICAkcm9vdFNjb3BlLmNsb3NlQWxlcnQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICRzY29wZS5hbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdmFsaWRhdGlvbiBlcnJvcnNcclxuICAgICAgICAgKiBAcGFyYW0gcmVzcG9uc2UgT2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHJvb3RTY29wZS5nZXRSZXNwb25zZUVycm9ycyA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuaGFzT3duUHJvcGVydHkoJ21lc3NhZ2UnKSkge1xyXG4gICAgICAgICAgICB2YXIgbSA9IHJlc3BvbnNlLmRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0cyA9IFtdO1xyXG4gICAgICAgICAgICByZXNwb25zZS5kYXRhLm1lc3NhZ2UgPSBKU09OLnBhcnNlKG0pO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocmVzcG9uc2UuZGF0YS5tZXNzYWdlLCBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1zZywgZnVuY3Rpb24gKGVyciwgcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZGRBbGVydChwcm9wICsgXCI6IFwiICsgZXJyKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IGF1dGggdG9rZW5cclxuICAgICAgICAgKi9cclxuICAgICAgICAkcm9vdFNjb3BlLmdldFRva2VuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmRlYnVnKFwiVG9rZW46IFwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSk7XHJcbiAgICAgICAgICBpZiAoISFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8vIC8qKlxyXG4gICAgICAgIC8vICAqIEdldCB1c2VyIGRhdGEgYW5kIHNldCAkc2NvcGUgdmFyaWFibGVcclxuICAgICAgICAvLyAgKi9cclxuICAgICAgICAvLyAoJHJvb3RTY29wZS5zZXRVc2VyRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgIGVycEFwaS5nZXQoJ21hbmFnZW1lbnQvdXNlcicpXHJcbiAgICAgICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIC8vICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgIC8vICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgncm9vdFNjb3BlOnNldFVzZXJEYXRhJywge2RhdGE6IHJlc3BvbnNlLmRhdGF9KTtcclxuICAgICAgICAvLyAgICAgICAgICRzY29wZS51c2VyRGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgLy8gICAgICAgfSBlbHNlXHJcbiAgICAgICAgLy8gICAgICAgICB0aHJvdyByZXNwb25zZS5zdGF0dXNUZXh0O1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9KSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDbG9zZSBhbGVydFxyXG4gICAgICAgICAqIEBwYXJhbSBpbmRleFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICRyb290U2NvcGUuY2xvc2VQYWdlQWxlcnQgPSBmdW5jdGlvbiAoaW5kZXgsIHNjb3BlKSB7XHJcbiAgICAgICAgICBzY29wZS5wYWdlQWxlcnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgXSk7XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBBbnRvbnkgUmVwaW4gb24gMDIuMDUuMjAxNy5cclxuICovXHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ0FkbWluQXBwJylcclxuICAuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJyxcclxuICAgIFtcclxuICAgICAgJyRzY29wZScsXHJcbiAgICAgICckcm9vdFNjb3BlJyxcclxuICAgICAgJyRtZERpYWxvZycsXHJcbiAgICAgICckcScsXHJcbiAgICAgICckaHR0cCcsXHJcblxyXG4gICAgICBmdW5jdGlvbiAoJHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgICAgICAgICAgICRzdGF0ZSxcclxuICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgJGh0dHApIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTG9naW5Db250cm9sbGVyXCIpO1xyXG5cclxuICAgICAgICAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVc2VyIG9iamVjdCBjb250YWluZXJcclxuICAgICAgICAgKiBAdHlwZSB7e319XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLnVzZXIgPSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvY2VzcyB1c2VyIGxvZ2luXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMubG9naW5Gb3JtLiR2YWxpZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxID0ge1xyXG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgIHVybDogc2V0dGluZ3MuYXBpSG9zdCArICcvYXBpL2FkbWluLycgKyBzZXR0aW5ncy5hcGlWZXJzaW9uICsgJy9hdXRoZW50aWNhdGUnLFxyXG4gICAgICAgICAgICAgIGRhdGE6ICRzY29wZS51c2VyLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRodHRwKHJlcSlcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBsb2dpbkNhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCByZXNwb25zZS5kYXRhLmRhdGEuYXR0cmlidXRlcy50b2tlbik7XHJcblxyXG4gICAgICAgICAgICAgICAgJGh0dHAocmVxKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiB1c2VyRGF0YUNhbGxiYWNrKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS4kc2V0RGlydHkoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXJ0cyA9ICcnO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmdldEZvcm1FcnJvcnModGhpcy5sb2dpbkZvcm0pXHJcbiAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKG1zZywgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybUFsZXJ0cy5wdXNoKHt0eXBlOiAnZGFuZ2VyJywgbXNnOiBtc2d9KTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0cyArPSBtc2cgKyBcIjxici8+XCI7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mb3JtQWxlcnRzKTtcclxuICAgICAgICAgICAgdG9hc3RyLm9wdGlvbnMuY2xvc2VCdXR0b24gPSB0cnVlO1xyXG4gICAgICAgICAgICB0b2FzdHJbXCJlcnJvclwiXShhbGVydHMsIFwiTG9naW4gRXJyb3JcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfV0pO1xyXG4iLCIiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdBZG1pbkFwcC52aWV3MScsIFsnbmdSb3V0ZSddKVxuXG4uY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvdmlldzEnLCB7XG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3MS92aWV3MS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVmlldzFDdHJsJ1xuICB9KTtcbn1dKVxuXG4uY29udHJvbGxlcignVmlldzFDdHJsJywgW2Z1bmN0aW9uKCkge1xuXG59XSk7XG4iLCIiLCIiXX0=
