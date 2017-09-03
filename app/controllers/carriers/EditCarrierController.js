/**
 * Created by Antony Repin on 9/7/2017.
 */


angular.module('AdminApp')
  .controller('EditCarrierController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'localStorageService',
      'carrierService',
      'adminService',
      'api',

      function ($scope,
                $rootScope,
                $state,
                localStorageService,
                carrierService,
                adminService,
                api) {

        console.log("Initializing EditCarrierController");

        $scope.$on('$viewContentLoaded', function () {
          $scope.processing = false;
          $scope.$parent.loading = false;
        });

        $scope.$watch('entity.attributes.is_enabled', function (newVal, oldVal, scope) {
          if (newVal !== oldVal) {
            newVal = newVal ? 1 : 0;
            $scope.toggleAccountState($scope.entity.id, newVal, 'carrier');
          }
        });

        $scope.$watch('entity', function (val) {
          if (val) {
            $scope.$parent.loading = false;
            console.info("Carrier: ", val);
          }
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.carrier = $state.get('carrier') ? $state.get('carrier') : localStorageService.get('carrier');
          if (!$scope.entity.id)
            $state.go('carriers');

          $scope.processing = false;
          $scope.formEdit = true;
          $scope.passwordReset = false;

        });

        /**
         * Save Carrier entity
         */
        $scope.saveEntity = function () {

          var formData = new FormData();

          (this.idScan instanceof Object) ? formData.append('id_scan', this.idScan) : formData.append('id_scan', null);
          (this.profilePhoto instanceof Object) ? formData.append('photo', this.profilePhoto) : formData.append('photo', null);
          formData.append('birthday', getBirthdayDate(this.entity.attributes.birthday));

          var fillable = [
            'email',
            'phone',
            'name',
            'password',
            'password_confirmation',
            'default_address',
            'username',
            'nationality',
            'id_number',
          ];

          angular.forEach(this.entity.attributes, function (value, key) {
            angular.forEach(fillable, function (attr) {
              if (key === attr) {
                formData.append(key, value);
              }
            });
          });

          carrierService.update($scope.entity.id, formData)
            .then(function (data) {

              if (data.statusCode === 422) {
                formService.showServerErrors(carrierForm, data.messages);
                return false;
              }

              var carrier = $scope.carrier = data.data[0];
              localStorageService.set('carrier', carrier);
              $state.go('carriers', {carrier: carrier});
            });

        };

        /**
         * Get carrier birthday date
         *
         * @returns {String}
         */
        function getBirthdayDate() {

          var dateString;
          var value = $scope.entity.attributes.birthday;

          if (typeof value === 'string' || value instanceof Date) {
            dateString = moment(value).utc().format('YYYY-MM-DD');
          } else {
            throw new Error('Unknown date', value);
          }

          return dateString;

        }

        /**
         * Reset account password
         */
        $scope.resetPassword = function () {
          $scope.processing = true;
          adminService.resetAccountPassword($scope.entity.id)
            .then(function (response) {
              switch (response.statusCode) {
                case 200:
                  if (response.updated === true) {
                    $scope.passwordReset = true;
                  }
                  break;
                default:
                  console.error(response);
              }
              $scope.processing = false;
            });
        };

        /**
         *
         * @returns {string}
         */
        function getAccountStateColor() {
          if ($scope.carrier) {
            return $scope.entity.attributes.is_enabled ? "'green'" : "'red'";
          }
        }

        /**
         * Toggle account status
         *
         * @param id {String}
         * @param value {Boolean}
         * @param type {String}
         */
        $scope.toggleAccountState = function () {
          $scope.processing = true;
          var entity = $scope.carrier;
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
