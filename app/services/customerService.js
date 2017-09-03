/**
 * Created by Antony Repin on 8/4/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('customerService',
    [
      'api',
      'settings',
      '$q',

      function (api,
                settings,
                $q) {

        return {
          /**
           * Fetch list of Customers from server
           * @returns {Promise}
           */
          getList: function () {
            return $q(function (resolve, reject) {
              api.get('customers')
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           *
           *
           * @param id {String}
           * @returns {Promise}
           */
          get: function (id) {
            return $q(function (resolve, reject) {
              api.get('customers/' + id)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           * XHR call to add new Customer account
           *
           * @param formData {FormData}
           * @returns {Promise}
           */
          create: function (formData) {
            return $q(function (resolve, reject) {
              api.setContentType(undefined)
                .post('customers/create', formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });

          },
          /**
           * XHR call to update existing Customer account properties
           *
           * @param id {String}
           * @param formData {FormData}
           * @returns {Promise}
           */
          update: function (id, formData) {
            return $q(function (resolve, reject) {
              formData.append('_method', "PUT");

              api.setContentType('multipart/form-data')
                .post('customers/update/' + id, formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           * Set account state
           *
           * @param id {String}
           * @param state {Boolean}
           * @returns {Promise}
           */
          toggleAccountState: function (id, state) {
            return $q(function (resolve, reject) {
              var s = state === true ? 1 : 0;
              api.setContentType('application/json')
                .post('customers/toggle/' + id, {is_enabled: state})
                .then(function (response) {
                  api.processResponse(response, resolve);
                })
            });
          }
        };
      }]
  );
