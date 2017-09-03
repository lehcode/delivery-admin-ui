/**
 * Created by Antony Repin on 9/4/2017.
 */


angular.module('AdminApp')
  .controller('CreateCustomerController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'customerService',
      'localStorageService',
      'formService',

      function($scope,
               $rootScope,
               $state,
               customerService,
               localStorageService,
               formService){

        $scope.$on('$viewContentLoaded', function (e) {
          //
        });

        $scope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.entity = null;
          $scope.processing = false;
          $scope.editing = false;
          $scope.passwordConfirmed = false;

        });

        /**
         * Save Customer profile data
         *
         * @param e {MouseEvent}
         * @param data {Object}
         */
        $scope.saveEntity = function (e, data) {

          $scope.processing = true;

          var formData = new FormData();

          var fillable = [
            'email',
            'phone',
            'name',
            'photo',
            'password',
            'password_confirmation',
            'username',
            'is_enabled',
          ];

          angular.forEach(data.attributes, function (value, key) {
            angular.forEach(fillable, function (attr) {
              if (key === attr) {
                switch (key) {
                  case 'photo':
                    if (value instanceof Object) {
                      formData.append(key, value);
                    } else {
                      formData.append(key, null);
                    }
                    break;
                  case 'is_enabled':
                    formData.append(key, value === true ? 1 : 0);
                    break;
                  default:
                    formData.append(key, value);
                    break;
                }
              }
            });
          });

          customerService.create(formData)
            .then(function (data) {
              switch (data.statusCode) {
                case 200:
                  $scope.processing = false;
                  $scope.entity = null;
                  localStorageService.set('customer', data.entity);
                  $state.go("customers", {customer: data.entity});
                  break;
                case 422:
                  formService.showServerErrors($scope.$$childTail.customerForm, data.messages);
                  break;
                default:
                  console.error("Fatal error");
              }
            });

        };

      }
    ]
  );
