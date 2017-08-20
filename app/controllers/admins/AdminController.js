/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('AdminsController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'adminService',
      'formService',
      '$mdDialog',
      'uiGridConstants',

      function ($scope,
                $rootScope,
                $state,
                adminService,
                formService,
                $mdDialog,
                uiGridConstants) {

        console.log("Initializing AdminsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Admins view content loaded");
        });

        /**
         * UI-grid data placeholder
         *
         * @type {Array}
         */
        $scope.gridData = [];

        /**
         * User type list values
         *
         * @type {Array}
         */
        $scope.userTypes = ['Admin'];

        /**
         * Selected user type placeholder
         *
         * @type {String}
         */
        $scope.userType = null;

        /**
         * Single Administrator entity placeholder
         *
         * @type {{}}
         */
        $scope.admin = {id: null, attributes: null};

        /**
         * Administrators collection placeholder
         *
         * @type {Array}
         */
        $scope.admins = [];

        /**
         * Dialog action flags
         *
         * @type {{hash: {String}, string: {String}}}
         */
        $scope.dialogAction = {hash: null, string: null};

        $scope.passwordReset = false;

        /**
         * Initialize controller
         */
        (function () {
          configure();
          getAdmins();
        })();

        /**
         * Setup controller
         */
        function configure() {
          console.log("Configuring AdminsController");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            rowHeight: 46,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            noUnselect: false,
            enableFiltering: true,
            columnDefs: [
              //   //{field: "id", name: "ID"},
              {
                field: "attributes.username",
                name: "Username",
                width: "25%",
              },
              {field: "attributes.name", name: "Name"},
              {
                field: "attributes.last_login",
                name: "Last login",
                type: "date",
                cellFilter: 'date',
                filterCellFiltered: true,
              },
              {
                field: "attributes.is_enabled",
                name: "Active",
                width: "7%",
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><md-input-container md-no-ink>' +
                '<md-checkbox aria-label="Carrier is enabled?" ng-model="row.entity.attributes.is_enabled"></md-checkbox>' +
                '</md-input-container></div>',
                enableCellEdit: false,
                disableCancelFilterButton: true,
                filter: {
                  term: null,
                  type: uiGridConstants.filter.SELECT,
                  selectOptions: [{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]
                },
                cellFilter: 'mapEnabled',
                filterCellFiltered: true,
              },
            ]
          });

        }

        /**
         *
         * @param gridApi {Object}
         */
        $scope.gridOptions.onRegisterApi = function (gridApi) {
          $scope.gridApi = gridApi;

          $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.rowEntity = row;
            adminService.get(row.entity.id)
              .then(function (data) {
                try {
                  $scope.admin = data;
                  console.debug($scope.admin);
                  $scope.openFormDialog();
                } catch (err) {
                  console.error(err);
                }

              });
          });

        };

        /**
         * Feth list of admin accounts from backend
         */
        function getAdmins() {
          adminService.getList()
            .then(function (d) {
              $scope.usersList = d;
              $scope.gridOptions = Object.assign($scope.gridOptions, {data: $scope.usersList});
            });
        }

        /**
         * Open create/edit form dialog
         *
         * @param $event
         * @param formAction
         */
        $scope.openFormDialog = function ($event, formAction) {

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
            contentElement: document.querySelector("#adminDialogContainer"),
            parent: angular.element(document.body)
          });

        };

        /**
         * Close dialog pane
         */
        $scope.closeFormDialog = function () {
          $scope.admin = {id: null, attributes: null};
          formService.resetForm($scope.adminForm);
          $mdDialog.hide();
        };

        /**
         * Save form data
         *
         * @param event {MouseEvent}
         */
        $scope.saveAdmin = function (event) {

          var formData = new FormData();

          var fillable = [
            'name',
            'role',
            'username',
            'password',
            'password_confirmation',
            'phone',
            'photo',
          ];

          angular.forEach($scope.admin.attributes, function (value, key) {
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
                    formData.append(key, value.display_name.toLowerCase());
                    break;
                }
              }
            });
          });

          delete $scope.rowEntity;

          if (!!$scope.admin.id === true) {
            adminService.update($scope.admin.id, formData)
              .then(function (data) {
                processSaveResponse(data);
              });
          } else {
            adminService.create(formData)
              .then(function (data) {
                processSaveResponse(data);
              });
          }

        };

        /**
         * Process response for saveAdmin() method response
         *
         * @param resolved {Object}
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

              formService.resetForm($scope.adminForm);
              $scope.closeFormDialog();

              break;
            case 422:
              formService.showServerErrors($scope.adminForm, resolved.messages);
              break;
            default:
              console.error("Server Error");
              break;
          }
        };

        /**
         * Reset user password
         */
        $scope.resetPassword = function (event) {
          adminService.resetAccountPassword($scope.admin.id)
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
  .filter('mapEnabled', function () {
    var hash = {
      false: "Disabled",
      true: "Enabled",
    };

    return function (input) {
      if (!input) {
        return '';
      } else {
        return hash[input];
      }
    };

  });
