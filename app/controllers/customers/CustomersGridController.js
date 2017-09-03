/**
 * Created by Antony Repin on 9/3/2017.
 */

angular.module('AdminApp')
  .controller('CustomersGridController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'customerService',
      'localStorageService',
      'uiGridConstants',

      function ($scope,
                $rootScope,
                $state,
                customerService,
                localStorageService,
                uiGridConstants) {

        console.log("Initializing CustomersGridController");

        $scope.$on('$viewContentLoaded', function () {
          $scope.$parent.loading = false;
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.processing = true;

          configure();
          getGridData();

        });

        /**
         * Configure controller
         */
        function configure() {

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            enableRowHeaderSelection: false,
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
                enableCellEdit: true,
                disableCancelFilterButton: true,
                filter: {
                  term: null,
                  type: uiGridConstants.filter.SELECT,
                  selectOptions: [{value: true, label: 'Enabled'}, {value: false, label: 'Disabled'}]
                },
                cellFilter: 'mapEnabled',
                filterCellFiltered: false,
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

              localStorageService.set('customer', row.entity);
              $state.go("customer/details", {customer: row.entity});

            });
          };
        };

        /**
         * Fetch array of results from backend
         */
        function getGridData() {
          $scope.processing = true;
          customerService.getList()
            .then(function (data) {
              $scope.gridOptions.data = data.data;
              $scope.processing = false;
            });
        }

      }
    ]
  )
  .filter('mapEnabled', function () {
    var hash = {
      false: "Disabled",
      true: "Enabled",
    };

    return function (input) {
      debugger;
      if (!input) {
        return '';
      } else {
        return hash[input];
      }
    };

  })
  .filter('shortDate', function () {
    return function (dString) {
      var d = moment(new Date(dString));
      return d.format("YYYY-MM-DD");
    }
  });
