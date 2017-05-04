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
      'localStorageService',

      function ($scope,
                $rootScope,
                $mdDialog,
                $state,
                $q,
                $http,
                settings,
                localStorageService) {

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
        $scope.token = localStorageService.get('token');

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
        $scope.lang = localStorageService.get('lang') == null ? 'EN' : localStorageService.get('lang');

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
          //console.debug("Token: ", localStorageService.get('token'));
          if (!!localStorageService.get('token') === true) {
            return localStorageService.get('token');
          }
          return false;
        };


        /**
         * Get user data and set $scope variable
         */
        $rootScope.setUserData = function () {
          $scope.authUser = JSON.stringify(localStorageService.get('user'));
        };

        /**
         * Set user navigation items
         */
        $rootScope.setUserNav = function(){

        };

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

