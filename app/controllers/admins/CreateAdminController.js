/**
 * Created by Antony Repin on 9/3/2017.
 */


angular.module('AdminApp')
  .controller('CreateAdminController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'adminService',

      function ($scope,
                $rootScope,
                $state,
                adminService) {

        console.log("Initializing CreateAdminController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("\"Orders Grid\" view content loaded");
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.processing = false;
          $scope.userTypes = ['Admin'];

          if (!!$scope.gridOptions === true) {
            $scope.gridOptions.data = null;
          }

        });

        /**
         * Save form data
         *
         * @param e {MouseEvent}
         * @param data {Object}
         */
        $scope.saveEntity = function () {

          var formData = new FormData();

          $scope.processing = true;

          var fillable = [
            'name',
            'role',
            'username',
            'password',
            'password_confirmation',
            'phone',
            'photo',
          ];

          angular.forEach(this.entity.attributes, function (value, key) {
            angular.forEach(fillable, function (attr) {
              if (key === attr) {
                switch (key) {
                  default:
                    formData.append(key, value);
                    break;
                  case 'photo':
                    if (value instanceof Object) {
                      formData.append(key, value);
                    } else {
                      formData.append(key, null);
                    }
                    break;
                  case 'role':
                    formData.append(key, value.toLowerCase());
                    break;
                }
              }
            });
          });

          adminService.create(formData)
            .then(function (data) {

              if (data.statusCode === 422){
                formService.showServerErrors(adminForm, data.messages);
              }

              $state.go("administrators");
            });

        };

      }
    ]
  );
