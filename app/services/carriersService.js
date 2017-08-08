/**
 * Created by Antony Repin on 8/4/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('carriersService',
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
              api.get('carriers').then(function (response) {
                if(response.status === 200){
                  resolve(response.data.data);
                } else {
                  console.error(response);
                }
              });
            });
          }
        };

      }]
  );
