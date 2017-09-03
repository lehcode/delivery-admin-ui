/**
 * Created by Antony Repin on 9/3/2017.
 */


angular.module('AdminApp')
  .controller('EditCustomerController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'customerService',
      'localStorageService',
      'adminService',
      'formService',
      'api',

      function ($scope,
                $rootScope,
                $state,
                customerService,
                localStorageService,
                adminService,
                formService,
                api) {

        $scope.$on('$viewContentLoaded', function (e) {
          $scope.$parent.loading = false;
        });

        $scope.$watch('entity.attributes.is_enabled', function (newVal, oldVal, scope) {
          if (newVal !== oldVal) {
            newVal = newVal ? 1 : 0;
            $scope.toggleAccountState($scope.entity.id, newVal, 'customer');
          }
        });

        $scope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.customer = $scope.entity = $state.get('customer') ? $state.get('customer') : localStorageService.get('customer');
          if (!$scope.customer.id && !$scope.entity.id)
            $state.go('customers');

          $scope.passwordReset = false;
          $scope.accountStateStyle = "{'color':" + getAccountStateColor() + "}";
          $scope.processing = false;
          $scope.formEdit = true;
          $scope.passwordConfirmed = false;

        });

        /**
         * Update/save Customer profile data
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

          customerService.update(data.id, formData)
            .then(function (data) {
              switch (data.statusCode) {
                case 200:
                  $scope.entity = data.entity;
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

        /**
         *
         * @returns {string}
         */
        function getAccountStateColor() {
          if ($scope.entity) {
            return $scope.entity.attributes.is_enabled ? "'green'" : "'red'";
          }
        }

        /**
         * Reset user password
         */
        $scope.resetPassword = function (e, entity) {
          $scope.processing = true;
          adminService.resetAccountPassword(entity.id)
            .then(function (data) {
              if (data.updated === true) {
                $scope.passwordReset = true;
                localStorageService.set('passwordReset', true);
              }
              $scope.processing = false;

            });
        };

        /**
         * Toggle account status
         *
         * @param id {String}
         * @param value {Boolean}
         * @param type {String}
         */
        $scope.toggleAccountState = function () {
          $scope.processing = true;
          var entity = $scope.entity;
          api.toggleAccountState(entity.id, entity.attributes.is_enabled, 'carriers')
            .then(function (data) {
              $scope.isEnabled = data.data.status;
              $scope.accountStateStyle = "{'color':" + getAccountStateColor() + "}";
              $scope.processing = false;
            });
        };
      }
    ]
  );
