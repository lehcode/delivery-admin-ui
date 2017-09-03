/**
 * Created by Antony Repin on 8/4/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('tripService',
    [
      'api',
      'settings',
      '$q',

      function (api,
                settings,
                $q) {

        return {
          getList: function () {
            return $q(function (resolve, reject) {
              api.setContentType('application/json')
                .get('trips')
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           *
           *
           * @param id
           * @returns {*}
           */
          get: function (id) {
            return $q(function (resolve, reject) {
              api.setContentType('application/json')
                .get('trips/' + id)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           * XHR call to add new Customer account
           *
           * @param formData
           * @returns {*}
           */
          create: function (formData) {
            return $q(function (resolve, reject) {
              api.setContentType(undefined)
                .post('trips/create', formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });

          },
          /**
           * XHR call to update existing Customer account properties
           *
           * @param id {String}
           * @param formData {Object}
           * @returns {*}
           */
          update: function (id, formData) {
            return $q(function (resolve, reject) {
              formData.append('_method', "PUT");

              api.setContentType(undefined)
                .post('trips/update/' + id, formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
        };
      }]
  );
