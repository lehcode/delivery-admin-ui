/**
 * Created by Antony Repin on 9/6/2017.
 */

angular.module('AdminApp')
  .factory('geoService',
    [
      'settings',

      function (settings) {
        return {
          getApi: function () {

            var params = {
              "async": true,
              "crossDomain": true,
              method: 'GET',
              url: 'http://maps.google.com/maps/api/js?key=AIzaSyDQCGZb0TUJaUbzsOko_SMaBVcIYBmp-0U&libraries=places',
            };

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
          }
        };
      }
    ]);
