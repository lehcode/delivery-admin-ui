/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('CarriersController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'settings',
      '$mdDialog',
      'carrierService',
      'animationService',
      'uiGridService',
      'uiGridConstants',
      'formService',
      'adminService',

      function ($scope,
                $rootScope,
                $state,
                settings,
                $mdDialog,
                carrierService,
                animationService,
                uiGridService,
                uiGridConstants,
                formService,
                adminService) {

        console.log("Initializing CarriersController");

        $scope.$on('$viewContentLoaded', function () {
          console.log("Carriers view content loaded");
        });

        // $scope.$watch('id_scan', function (newVal, oldVal) {
        //   debugger;
        // });

        /**
         * Carrier instance container
         * @type {{}}
         */
        $scope.carrier = {id: null, attributes: null};

        /**
         *
         * @type {Array}
         */
        $scope.carriers = [];

        /**
         * Dialog action placeholder
         *
         * @type {{hash: {String}, string: {String}}}
         */
        $scope.dialogAction = {hash: null, string: null};

        $scope.formErrors = [];

        $scope.confirmations = [];

        /**
         * Boolean
         *
         * @type {boolean}
         */
        $scope.allowUsernameEdit = true;

        /**
         *
         * @type {Object}
         */
        $scope.rowEntity = null;

        /**
         *
         * @type {boolean}
         */
        $scope.passwordReset = false;

        /**
         * Initialize controller
         */
        (function () {
          configure();
          getCarriers();
        })();

        /**
         * Configure controller
         */
        function configure() {

          console.log("Configuring controller");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            rowHeight: 46,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            noUnselect: true,
            columnDefs: [
              {field: "attributes.username", name: "Username", pinnedLeft: true},
              {
                field: "attributes.is_enabled",
                name: "Enabled",
                pinnedLeft: true,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><md-input-container md-no-ink><md-checkbox aria-label="Carrier is enabled?" ng-model="row.entity.attributes.is_enabled"></md-checkbox></md-input-container></div>',
                enableCellEdit: false,
              },
              {
                field: "attributes.is_online",
                name: "Online",
                pinnedLeft: true,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><md-input-container md-no-ink><md-checkbox aria-label="Is article item active?" ng-model="row.entity.attributes.is_online" ng-disabled="true"></md-checkbox></md-input-container></div>',
                enableCellEdit: false,
              },
              //{field: 'id'},
              {field: "attributes.name", name: "Full Name"},
              {field: "attributes.current_city.name", name: "City"},
              {field: "attributes.current_city.country.alpha2_code", name: "Country"},
              {field: "attributes.cash_payments", name: "Cash Payments", enableFiltering: false},
              {field: "attributes.online_payments", name: "Online Payments", enableFiltering: false},
              {field: "attributes.rating", name: "Rating", enableFiltering: false},
            ]
          });

          $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              $scope.rowEntity = row;
              carrierService.get(row.entity.id)
                .then(function (data) {
                  try {
                    $scope.carrier = data;
                    console.debug($scope.carrier);
                    $scope.openFormDialog();
                  } catch (err) {
                    console.error(err);
                  }

                });
            });

          };

        }

        /**
         * Fetch Carriers list from backend
         */
        function getCarriers() {
          carrierService.getList()
            .then(function (d) {
              $scope.carriers = d;
              $scope.gridOptions = Object.assign($scope.gridOptions, {data: $scope.carriers});
            });
        }

        /**
         * Open dialog with create/edit form
         * @param action
         */
        $scope.openFormDialog = function (formAction) {

          $scope.passwordReset = false;

          switch (formAction) {
            default:
              $scope.dialogAction = {hash: 'edit', string: 'Edit '};
              $scope.allowUsernameEdit = false;
              break;
            case 'create':
              $scope.dialogAction = {hash: 'create', string: 'Add new '};
              $scope.allowUsernameEdit = true;
              break;
          }

          $mdDialog.show({
            contentElement: document.querySelector("#carrierDialogContainer"),
            parent: angular.element(document.body)
          });

          var idScanImageContainer = document.querySelector('#idScanImageContainer');
          var userPhotoImageContainer = document.querySelector('#userPhotoImageContainer');

          if (!!$scope.carrier.attributes === true) {

            var scan = $scope.carrier.attributes.id_scan;
            var photo = $scope.carrier.attributes.photo;

            if (typeof scan === 'string' && scan.length) {
              animationService.show(idScanImageContainer);
            } else {
              animationService.hide(idScanImageContainer);
            }

            if (typeof photo === 'string' && photo.length) {
              animationService.show(userPhotoImageContainer);
            } else {
              animationService.hide(userPhotoImageContainer);
            }
          } else {
            animationService.hide(idScanImageContainer);
            animationService.hide(userPhotoImageContainer);
          }

        };

        /**
         * Close dialog pane
         */
        $scope.closeFormDialog = function () {
          $scope.carrier = {id: null, attributes: null};
          formService.resetForm($scope.carrierForm);
          $mdDialog.hide();
        };

        /**
         * Update/save carrier profile data
         *
         * @param event MouseEvent
         */
        $scope.saveCarrier = function (event) {

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

          angular.forEach($scope.carrier.attributes, function (value, key) {
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
                        //var dd = new Date(value.toString());
                        var GMDate = new Date(dd.toGMTString());
                        dateString = moment(GMDate).format('YYYY-MM-DD');
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

          delete $scope.rowEntity;

          if (!!$scope.carrier.id === true) {
            carrierService.update($scope.carrier.id, formData)
              .then(function (data) {
                processSaveResponse(data);
              });
          } else {
            carrierService.create(formData)
              .then(function (data) {
                processSaveResponse(data);
              });
          }

        };

        /**
         * Close dialog and refresh grid
         *
         * @param data Object
         */
        var processSaveResponse = function (resolved) {
          switch (resolved.statusCode) {
            case 200:
              try {
                if (!!$scope.rowEntity === true) {
                  if ($scope.rowEntity.entity.id !== resolved.data.id) {
                    throw Error();
                  }
                  $scope.rowEntity.entity.attributes = resolved.data.attributes;
                  $scope.gridOptions.data = uiGridService.updateRow($scope.rowEntity, $scope.gridOptions.data);
                } else {
                  var items = $scope.gridOptions.data;
                  items.forEach(function (item, idx) {
                    delete items[idx]['$$hashKey'];
                  });
                  items.unshift(resolved.data);
                  $scope.gridOptions.data = items;
                }
              } catch (err) {
                console.error(err);
              }

              formService.resetForm($scope.carrierForm);
              $scope.closeFormDialog();

              break;
            case 422:
              formService.showServerErrors($scope.carrierForm, resolved.messages);
              break;
            default:
              console.error("Server Error");
              break;
          }
        };

        /**
         * Current date
         *
         * @type {Date}
         */
        var now = new Date;

        /**
         * Calculate minimal birthday date
         *
         * @type {Date}
         */
        $scope.minBirthdayDate = new Date(
          now.getFullYear() - 99,
          now.getMonth(),
          now.getDate()
        );

        /**
         * Calculate  maximal bityhday date
         *
         * @type {Date}
         */
        $scope.maxBirthdayDate = new Date(
          now.getFullYear() - 16,
          now.getMonth(),
          now.getDate()
        );

        /**
         * Reset user password
         */
        $scope.resetPassword = function () {
          adminService.resetAccountPassword($scope.carrier.id)
            .then(function (response) {
              switch (response.statusCode) {
                case 200:
                  if (response.data.updated === true){
                    $scope.passwordReset = true;
                  }
                  break;
              }
            })
        };

      }
    ]
  )
// .config(function($mdDateLocaleProvider) {
//   $mdDateLocaleProvider.formatDate = function(date) {
//     return date;
//   };
// })
;
