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

        var httpHeaders = {
          "Content-Type": "application/json"
        };

        var authToken = localStorageService.get('token');

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
            headers: Object.assign(httpHeaders, {
              "Authorization": "Bearer " + authToken,
            })
          };

          console.debug("Request: ", params);

          return $q(function (resolve, reject) {
            $http(params)
              .then(function (success) {
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
                switch (response.status) {
                  case 200:
                    resolve(response);
                    break;
                  default:
                    reject("Server Error");
                    console.error(response.data.message[0]);
                }
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
                switch (response.status) {
                  case 200:
                  case 422:
                    resolve(response);
                    break;
                  default:
                    reject("Server Error");
                    console.error(response.data.message[0]);
                }
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
            data._method = "PUT";
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
         * Set Content-Type header
         * @param value
         * @returns {api}
         */
        api.setContentType = function (value) {
          httpHeaders["Content-Type"] = value;
          return this;
        }

        /**
         * Process response by code
         *
         * @param response
         * @param resolve
         * @returns {Object}
         */
        api.processResponse = function (response, resolve) {
          switch (response.status) {
            case 200:
              resolve({
                statusCode: response.status,
                data: response.data.data
              });
              break;
            case 422:
              resolve({
                messages: response.data.message,
                status: response.statusText,
                statusCode: response.status,
              });
              break;
            default:
              console.error({
                messages: response.data.message,
                status: response.statusText,
                statusCode: response.status,
              });
          }
        };

        /**
         * Toggle Carrier account enabled/disabled
         *
         * @param id {String}
         * @param value {Number}
         * @param prefix {String}
         * @returns {Promise}
         */
        api.toggleAccountState = function (id, value, prefix) {
          return $q(function (resolve, reject) {
            api.setContentType('application/json')
              .post(prefix + '/toggle/' + id, {is_enabled: value})
              .then(function (response) {
                api.processResponse(response, resolve);
              })
          });
        };

        return api;

      }
    ])
;
