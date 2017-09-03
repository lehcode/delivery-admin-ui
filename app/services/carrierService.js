/**
 * Created by Antony Repin on 8/4/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('carrierService',
    [
      'api',
      'settings',
      '$q',

      function (api,
                settings,
                $q) {

        return {
          /**
           * Fetch carriers collection from server
           *
           * @param orderBy {String}
           * @param order {String}
           * @returns {Promise}
           */
          getList: function (orderBy, order) {
            return $q(function (resolve, reject) {

              var uri = !!orderBy === true ? 'carriers/' + orderBy : 'carriers';
              uri += !!order === true ? '/' + order : '';

              api.setContentType('application/json')
                .get('carriers')
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           * Fetch single Carrier entity
           *
           * @param id {String}
           * @returns {Promise}
           */
          get: function (id) {
            return $q(function (resolve, reject) {
              api.get('carriers/' + id)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
          /**
           * Add new Carrier account
           *
           * @param formData
           * @returns {Promise}
           */
          create: function (formData) {
            return $q(function (resolve, reject) {
              api.setContentType(undefined)
                .post('carriers/create', formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });

          },
          /**
           * Update existing Carrier account properties
           *
           * @param id {String}
           * @param formData {Object}
           * @returns {Promise}
           */
          update: function (id, formData) {
            return $q(function (resolve, reject) {
              formData.append('_method', "PUT");
              api.setContentType(undefined)
                .post('carriers/update/' + id, formData)
                .then(function (response) {
                  api.processResponse(response, resolve);
                });
            });
          },
        };
      }]
  );
