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
          getList: function () {
            return $q(function (resolve, reject) {
              api.get('customers')
                .then(function (response) {
                  if (response.status === 200) {
                    resolve(response.data.data);
                  } else {
                    console.error(response);
                  }
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
              api.get('customers/' + id)
                .then(function (response) {
                  if (response.status === 200) {
                    resolve(response.data.data[0]);
                  } else {
                    console.error(response);
                  }
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
                .post('customers/create', formData)
                .then(function (response) {
                  switch (response.status) {
                    case 200:
                      resolve({
                        statusCode: response.status,
                        data: response.data.data[0]
                      });
                      break;
                    default:
                      reject({
                        messages: response.data.message,
                        status: response.statusText,
                        statusCode: response.status,
                      });
                  }
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
                .post('customers/update/' + id, formData)
                .then(function (response) {
                  if (response.status === 200) {
                    resolve({
                      statusCode: 200,
                      data: response.data.data[0],
                    });
                  } else {
                    reject({
                      messages: response.data.message,
                      status: response.statusText,
                      statusCode: response.status,
                    });
                  }
                });
            });
          },
          toggleAccountState: function (id, enabled) {
            return $q(function (resolve, reject) {

              var fd = new FormData();
              fd.append('enabled', enabled);

              api.post('customers/toggle/' + id, {enabled: enabled})
                .then(function (data) {
                  switch (data.status) {
                    case 200:
                      resolve(data.data[0]);
                      break;
                    default:
                      reject({
                        messages: response.data.message,
                        status: response.statusText,
                        statusCode: response.status,
                      })
                  }
                })
            });
          }
        };
      }]
  );
