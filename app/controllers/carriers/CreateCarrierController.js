/**
 * Created by Antony Repin on 9/7/2017.
 */

angular.module('AdminApp')
  .controller('CreateCarrierController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'carrierService',
      'formService',

      function ($scope,
                $rootScope,
                $state,
                carrierService,
                formService) {

        console.log("Initializing CreateCarrierController");

        $scope.$on('$viewContentLoaded', function () {
          $scope.processing = false;
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.processing = false;
          $scope.formEdit = false;

        });

        $scope.$watch('entity', function(val){
          console.dir(val);
        });

        /**
         * Save Carrier entity
         */
        $scope.saveEntity = function () {

          $scope.formErrors = [];

          var formData = new FormData();

          var fillable = [
            'email',
            'phone',
            'name',
            'id_scan',
            'photo',
            'password',
            'password_confirmation',
            'default_address',
            'username',
            'nationality',
            'id_number',
            'birthday',
          ];

          angular.forEach(this.carrier.attributes, function (value, key) {
            angular.forEach(fillable, function (attr) {
              if (key === attr) {
                switch (key) {
                  case 'id_scan':
                  case 'photo':
                    if (value instanceof Object) {
                      formData.append(key, value);
                    } else {
                      formData.append(key, null);
                    }
                    break;
                  case 'birthday':
                    var dateString;
                    if (value instanceof String) {
                      dateString = value;
                    } else if (value instanceof Date) {
                      dateString = value.getFullYear() + '-' + value.getMonth() + '-' + value.getDate();
                    } else if (value instanceof Object) {
                      if (value.hasOwnProperty('date')) {
                        var dd = value.date;
                        dateString = moment(dd).utc().format('YYYY-MM-DD');
                      } else {
                        throw new Error('Unknown date', value);
                      }
                    } else {
                      throw new Error('Unknown date', value);
                    }

                    formData.append(key, dateString);
                    break;
                  default:
                    formData.append(key, value);
                    break;
                }
              }
            });
          });

          carrierService.create(formData)
            .then(function (data) {

              if (data.statusCode === 422){
                formService.showServerErrors(carrierForm, data.messages);
                return false;
              }

              $state.go('carriers');
            });

        };

      }
    ]
  );
