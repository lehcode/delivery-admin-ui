/**
 * Created by Antony Repin on 02.05.2017.
 */


angular.module('AdminApp')
  .controller('LoginController',
    [
      '$scope',
      '$rootScope',
      '$state',
      '$q',
      '$http',
      'settings',
      '$window',
      '$location',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                $q,
                $http,
                settings,
                $window,
                $location,
                localStorageService) {

        console.log("Initializing LoginController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Login view content loaded");
        });

        $scope.user = {};
        $scope.authUser = null;

        /**
         * Process user login
         */
        $scope.doLogin = function () {

          if (this.loginForm.$valid) {
            const req = {
              method: 'POST',
              url: settings.apiHost + '/' + $scope.apiRoot + '/authenticate',
              data: $scope.user,
              headers: {"content-type": "application/json"}
            };

            $http(req)
              .then(function loginCallback(loginResponse) {

                if (loginResponse.status === 200) {
                  if (loginResponse.data.status === 'success') {

                    try {
                      localStorageService.set('token', loginResponse.data.data.attributes.token);
                    } catch (error) {
                      console.error(error.message);
                      return;
                    }

                    Object.assign(req, {
                      method: 'POST',
                      url: settings.apiHost + '/' + $scope.apiRoot + '/user/me',
                      data: null,
                      headers: {
                        "content-type": "application/json",
                        "authorization": "Bearer " + localStorageService.get('token')
                      }
                    });

                    $http(req)
                      .then(function userDataCallback(userDataResponse) {
                        if (userDataResponse.status === 200) {
                          if (userDataResponse.data.status == 'success') {

                            const userJson = JSON.stringify(userDataResponse.data.data[0]);
                            localStorageService.set('user', userJson);
                            $rootScope.setUserData();
                            $scope.getNavigation();
                            $state.go('dashboard');
                          }
                        }
                      });
                  }
                }
              });
          } else {
            this.loginForm.$setDirty();
            let alerts = '';
            $rootScope.getFormErrors(this.loginForm)
              .forEach(function (msg, idx) {
                $scope.formAlerts.push({type: 'danger', msg: msg});
                alerts += msg + "<br/>";
              });
            console.log($scope.formAlerts);
            toastr.options.closeButton = true;
            toastr["error"](alerts, "Login Error");
          }
        }

      }]);
