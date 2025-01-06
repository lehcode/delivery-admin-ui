/**
 * Created by Antony Repin on 8/4/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('authService',
    [
      'settings',
      '$q',

      function (settings,
                $q) {

        return {
          getAuthData: function () {
            return $q(function(resove, reject){
              // Implementation
            });
          }
        };

      }]
  );
