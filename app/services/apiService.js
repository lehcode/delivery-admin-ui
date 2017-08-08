/**
 * Created by Antony Repin on 02.05.2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('api',
    [
      '$rootScope',
      '$http',
      'settings',
      '$location',
      '$q',
      'localStorageService',

      function ($rootScope,
                $http,
                settings,
                $location,
                $q,
                localStorageService) {

        /**
         * Exposed variable
         * @type {{}}
         */
        var api = {};

        /**
         * Make XHR request
         * @param method
         * @param url
         * @param data
         * @returns {*}
         */
        var call = function (method, url, data) {
          var params = {
            "async": true,
            "crossDomain": true,
            method: method,
            url: $rootScope.settings.apiHost + '/api/admin/' + $rootScope.settings.apiVersion + '/' + url,
            data: data,
            headers: {
              "Authorization": "Bearer " + localStorageService.get('token'),
              "Content-Type": "application/json"
            }
          };

          console.debug("Request: ", params);

          return $q(function (resolve, reject) {
            $http(params).then(function (success) {
                console.debug(success);
                resolve(success);
              },
              function (error) {
                switch (error.status) {
                  case 401:
                  case 403:
                    $location.path('/login');
                    localStorage.setItem('token', false);
                    break;
                }
                resolve(error);
              });
          });
        };

        /**
         * Make GET request
         *
         * @param url
         * @param data
         * @returns {*}
         */
        api.get = function (url) {
          return $q(function (resolve, reject) {
            call('GET', url)
              .then(function (response) {
                if (response.status === 500) {
                  console.error(response);
                }
                resolve(response);
              });
          });
        };

        /**
         * Make POST request
         *
         * @param url
         * @param data
         * @returns {*}
         */
        api.post = function (url, data) {
          return $q(function (resolve, reject) {
            call('POST', url, data)
              .then(function (response) {
                if (response.status === 500) {
                  console.error(response);
                }
                resolve(response);
              });
          });
        };

        /**
         * Make PUT request
         *
         * @param url
         * @param data
         * @returns {*}
         */
        api.put = function (url, data) {
          return $q(function (resolve, reject) {
            call('PUT', url, data)
              .then(function (response) {
                if (response.status === 500) {
                  console.error(response);
                }
                resolve(response);
              });
          });
        }

        return api;

      }
    ])
;
