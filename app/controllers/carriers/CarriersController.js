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

      function ($scope,
                $rootScope,
                $state,
                settings,
                $mdDialog,
                carriersService) {

        console.log("Initializing CarriersController");

        $scope.$on('$viewContentLoaded', function () {
          console.log("Carriers view content loaded");
        });

        /**
         * Carrier instance container
         * @type {{}}
         */
        $scope.carrier = null;

        /**
         *
         * @type {Array}
         */
        $scope.carriers = null;

        /**
         * Initialize controller
         */
        (function () {
          configure();
          carriersService.getList()
            .then(function (d) {
              $scope.gridOptions.data = d;
            });
        })();

        /**
         * Configure controller
         */
        function configure() {

          console.log("Configuring controller");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.carriersMenu = {
            name: 'more',
            items: [
              {name: 'Add Carrier', sref: "/carriers/create"}
            ]
          };

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

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              debugger;
            });

          };

        }

        /**
         * Open dialog with create/edit form
         * @param action
         */
        $scope.openFormDialog = function (e, action) {
          debugger;
          switch (action) {
            case 'edit':
              $mdDialog.show({
                contentElement: document.querySelector("#editCarrierDialogContainer"),
                parent: angular.element(document.body)
              });
              break;

            default:
              $mdDialog.show({
                contentElement: document.querySelector("#createCarrierDialogContainer"),
                parent: angular.element(document.body)
              });
          }

        };

        /**
         * Close dialog pane
         */
        $scope.closeFormDialog = function () {
          $('.modal').hide();
          $mdDialog.hide();
          $scope.carrier = {};
        };

      }
    ]
  );
