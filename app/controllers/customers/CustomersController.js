/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('CustomersController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'settings',
      '$mdDialog',
      'customerService',
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
                customerService,
                animationService,
                uiGridService,
                uiGridConstants,
                formService,
                adminService) {

        console.log("Initializing CustomersController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Customers view content loaded");
        });

        $scope.$watch('customer', function (newVal, oldVal) {
          console.log("Customer: ", newVal);
        });

        /**
         * Carrier instance container
         * @type {{}}
         */
        $scope.customer = {id: null, attributes: null};

        /**
         *
         * @type {Array}
         */
        $scope.customers = [];

        /**
         * Dialog action placeholder
         *
         * @type {{hash: {String}, string: {String}}}
         */
        $scope.dialogAction = {hash: null, string: null};

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
          getGridData();
        })();

        /**
         * Configure controller
         */
        function configure() {

          console.log("Configuring controller");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            rowHeight: 46,
            enableRowSelection: false,
            enableRowHeaderSelection: true,
            noUnselect: false,
            columnDefs: [
              {field: "attributes.username", name: "Username", pinnedLeft: true},
              {field: "attributes.name", name: "Full Name"},
              {field: "attributes.orders", name: "Orders"},
              {field: "attributes.created_at", name: "Registered", cellFilter: "shortDate"},
              {
                field: "attributes.is_enabled",
                name: "Enabled",
                width: "8%",
                cellTemplate: '<div class="ui-grid-cell-contents" flex title="TOOLTIP" layout-align="center center">' +
                '<md-input-container md-no-ink class="cell-checkbox">' +
                '<md-checkbox aria-label="Carrier is enabled?" ng-model="row.entity.attributes.is_enabled" ng-click="grid.appScope.toggleAccountState($event, row.entity)"></md-checkbox>' +
                '</md-input-container></div>',
                enableCellEdit: false,
                disableCancelFilterButton: true,
                filter: {
                  //term: "Enabled",
                  type: uiGridConstants.filter.SELECT,
                  selectOptions: [{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]
                },
                cellFilter: 'mapEnabled',
                filterCellFiltered: true,
              },
              {field: "attributes.current_city.name", name: "City"},
              {field: "attributes.current_city.country.alpha2_code", name: "Country"},
              {field: "attributes.rating", name: "Rating", enableFiltering: false},
            ]
          });

          $scope.gridOptions.data = {};

          $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, e) {

              if (!row.isSelected) return false;

              $scope.rowEntity = row;

              customerService.get(row.entity.id)
                .then(function (data) {
                  try {
                    $scope.customer = data;
                    //console.debug($scope.customer);
                    $scope.openFormDialog();
                  } catch (err) {
                    console.error(err);
                  }

                });
            });
          };
        };

        /**
         * Fetch Customers list from backend
         */
        function getGridData() {
          customerService.getList()
            .then(function (d) {
              $scope.customers = d;
              $scope.gridOptions = Object.assign($scope.gridOptions, {data: $scope.customers});
            });
        };

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
            contentElement: document.querySelector("#customerDialogContainer"),
            parent: angular.element(document.body)
          });

          var userPhotoImageContainer = document.querySelector('#userPhotoImageContainer');

          if (!!$scope.customer.attributes === true) {

            var photo = $scope.customer.attributes.photo;

            if (typeof photo === 'string' && photo.length) {
              animationService.show(userPhotoImageContainer);
            } else {
              animationService.hide(userPhotoImageContainer);
            }
          } else {
            animationService.hide(userPhotoImageContainer);
          }

        };

        /**
         * Close dialog pane
         */
        $scope.closeFormDialog = function () {
          $scope.customer = {id: null, attributes: null};
          formService.resetForm($scope.customerForm);
          $mdDialog.hide();
        };

        /**
         * Update/save Customer profile data
         *
         * @param event MouseEvent
         */
        $scope.saveCustomer = function (event) {

          $scope.processing = true;
          $scope.formErrors = [];

          var formData = new FormData();

          var fillable = [
            'email',
            'phone',
            'name',
            'photo',
            'password',
            'password_confirmation',
            'username',
          ];

          angular.forEach($scope.customer.attributes, function (value, key) {
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
                  default:
                    formData.append(key, value);
                    break;
                }
              }
            });
          });

          delete $scope.rowEntity;

          if (!!$scope.customer.id === true) {
            customerService.update($scope.customer.id, formData)
              .then(function (data) {
                processSaveResponse(data);
              });
          } else {
            customerService.create(formData)
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
                    throw new Error("Wrong entity");
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

              formService.resetForm($scope.customerForm);
              $scope.closeFormDialog();

              break;
            case 422:
              formService.showServerErrors($scope.customerForm, resolved.messages);
              break;
            default:
              console.error("Server Error");
              break;
          }

          $scope.processing = false;

        };

        /**
         * Reset user password
         */
        $scope.resetPassword = function () {
          $scope.processing = true;
          adminService.resetAccountPassword($scope.customer.id)
            .then(function (response) {
              switch (response.statusCode) {
                default:
                  throw new Error(response.error);
                  break;
                case 200:
                  if (response.data.updated === true) {
                    $scope.passwordReset = true;
                  }
                  break;
              }

              $scope.processing = false;

            });
        };

        /**
         * Toggle account enabled/disabled
         *
         * @param evt {Object}
         * @param row {Object}
         */
        $scope.toggleAccountState = function(evt, row){
          $scope.processing = true;
          customerService.toggleAccountState(row.id, !row.attributes.is_enabled)
            .then(function(data){
              $scope.processing = false;
            })
        }

      }
    ]
  )
  .filter('shortDate', function () {
    return function (dString) {
      var d = moment(new Date(dString));
      return d.format("YYYY-MM-DD");
    }
  })
  .filter('mapEnabled', function () {
    var hash = {false: "Disabled", true: "Enabled"};

    return function (input) {
      return hash[input];
    };

  });
