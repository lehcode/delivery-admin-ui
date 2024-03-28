/**
 * Created by Antony Repin on 8/4/2017.
 */

angular.module('AdminApp')
  .factory('adminService', [
    'api',
    '$q',

    function (api,
              $q) {

      return {
        getList: function () {
          return $q(function (resolve, reject) {
            api.get('admins')
              .then(function (response) {
                if (response.status === 200) {
                  resolve(response.data.data);
                } else {
                  console.error(response);
                }
              });
          });
        },
        get: function (id) {
          return $q(function (resolve, reject) {
            api.get('admins/' + id)
              .then(function (response) {
                if (response.status === 200) {
                  resolve(response.data.data[0]);
                } else {
                  throw new Error(response.errorText);
                }
              });
          });
        },
        create: function (formData) {
          return $q(function (resolve, reject) {
            api.setContentType(undefined)
              .post('admins/create', formData)
              .then(function (response) {
                if (response.status === 200) {
                  resolve({
                    statusCode: 200,
                    data: response.data.data[0],
                  });
                } else {
                  resolve({
                    messages: response.data.message,
                    status: response.statusText,
                    statusCode: response.status,
                  });
                }
              });
          });

        },
        update: function (id, formData) {
          return $q(function (resolve, reject) {
            formData.append('_method', "PUT");

            api.setContentType(undefined)
              .post('admins/update/' + id, formData)
              .then(function (response) {
                if (response.status === 200) {
                  resolve({
                    statusCode: 200,
                    data: response.data.data[0],
                  });
                } else {
                  resolve({
                    messages: response.data.message,
                    status: response.statusText,
                    statusCode: response.status,
                  });
                }
              });
          });
        },
        resetAccountPassword: function (id) {
          return $q(function (resolve, reject) {
            api.setContentType('application/json')
              .get('user/reset-password/' + id)
              .then(function (response) {
                switch (response.status) {
                  case 200:
                    resolve({
                      statusCode: 200,
                      updated: response.data.data.updated,
                    });
                    break;
                  default:
                    debugger;
                    reject({
                      messages: response.data.message,
                      status: response.statusText,
                      statusCode: response.status,
                    });

                }
              });
          });
        }
      };
    }]
  );
