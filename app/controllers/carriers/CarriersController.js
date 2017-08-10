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
      'carriersService',
      'animationService',
      'uiGridService',
      'uiGridConstants',

      function ($scope,
                $rootScope,
                $state,
                settings,
                $mdDialog,
                carriersService,
                animationService,
                uiGridService,
                uiGridConstants) {

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

        $scope.dialogAction = 'Create new';

        $scope.formErrors = [];

        $scope.rowEntity;

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
              {field: 'id'},
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
              carriersService.get(row.entity.id)
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

        function getCarriers() {
          carriersService.getList()
            .then(function (d) {

              // d.forEach(function (item, idx) {
              //   if (!!item.attributes.birthday.date) {
              //     try {
              //       d[idx]['attributes']['birthday']['date'] = item.attributes.birthday.date.match(/^\d{4}-\d{2}-\d{2}/)[0];
              //     } catch (err) {
              //       console.error(err);
              //     }
              //   }
              // });

              $scope.carriers = d;
              $scope.gridOptions = Object.assign($scope.gridOptions, {data: $scope.carriers});
            });
        }

        /**
         * Open dialog with create/edit form
         * @param action
         */
        $scope.openFormDialog = function (action) {

          switch (action) {
            default:
              $scope.dialogAction = 'Edit ';
              break;
            case 'create':
              $scope.dialogAction = 'Add new ';
              break;
          }

          $mdDialog.show({
            contentElement: document.querySelector("#carrierDialogContainer"),
            parent: angular.element(document.body)
          });

          var idScanImageContainer = document.getElementById('idScanImageContainer');
          var userPhotoImageContainer = document.getElementById('userPhotoImageContainer');

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
          //$('.modal').hide();
          $mdDialog.hide();
          $scope.carrier = {id: null, attributes: null};
          $scope.formErrors = [];
        };

        /**
         * Update/save carrier profile data
         *
         * @param event MouseEvent
         */
        $scope.saveCarrier = function (event) {

          //event.preventDefault();
          //event.stopPropagation();
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
                  // case 'password':
                  // case 'password_confirmation':
                  //   debugger;
                  //   formData.append(key, value);
                  //   break;
                  case 'id_scan':
                  case 'photo':
                    if (value instanceof Object) {
                      formData.append(key, value);
                    } else {
                      formData.append(key, null);
                    }
                    break;
                  case 'birthday':
                    var dateString = value.getFullYear() + '-' + value.getMonth() + '-' + value.getDate();
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
            carriersService.update($scope.carrier.id, formData, $scope.rowEntity)
              .then(function (data) {
                processSaveResponse(data);
              });
          } else {
            carriersService.create(formData)
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
                  //$scope.gridApi.core.queueGridRefresh();
                }
              } catch (err) {
                console.error(err);
              }

              $scope.closeFormDialog();
              break;
            case 422:
              $scope.formErrors = resolved.messages;
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

      }
    ]
  );
