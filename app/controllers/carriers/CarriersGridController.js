/**
 * Created by Antony Repin on 9/7/2017.
 */


angular.module('AdminApp')
  .controller('CarriersGridController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'carrierService',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                carrierService,
                localStorageService) {

        console.log("Initializing CarriersGridController");

        $scope.$on('$viewContentLoaded', function () {
          $scope.processing = true;
          $scope.$parent.loading = false;
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
          configure();
          getGridData();
        });

        /**
         * Configure controller
         */
        function configure() {

          console.log("Configuring controller");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            data: null,
            enableRowHeaderSelection: false,
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
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">' +
                '<md-input-container md-no-ink>' +
                '<md-checkbox aria-label="Is article item active?" ng-model="row.entity.attributes.is_online" ng-disabled="true" ng-change="toggleAccountState()"></md-checkbox>' +
                '</md-input-container></div>',
                enableCellEdit: false,
              },
              //{field: 'id'},
              {field: "attributes.name", name: "Full Name"},
              {field: "attributes.current_city.name", name: "City"},
              {field: "attributes.current_city.country.alpha2_code", name: "Country"},
              {field: "attributes.cash_payments", name: "Cash Payments", enableFiltering: false},
              {field: "attributes.online_payments", name: "Online Payments", enableFiltering: false},
              {field: "attributes.created_at", name: "Registered", cellFilter: "longDate"},
              {field: "attributes.rating", name: "Rating", enableFiltering: false},
            ]
          });

          $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, e) {

              if (!row.isSelected)
                return false;

              localStorageService.set('carrier', row.entity);
              $state.go('carrier/details', {carrier: row.entity});

            });

          };

        }

        /**
         * Fetch Carriers list from backend
         */
        function getGridData() {
          carrierService.getList()
            .then(function (data) {
              $scope.carriers = data.data;
              $scope.gridOptions = Object.assign($scope.gridOptions, {data: $scope.carriers});
              $scope.processing = false;
            });
        }

      }
    ]
  )
  .filter('longDate', function () {
    return function (dString) {
      return moment(new Date(dString))
        .format("YYYY-MM-DD HH:mm");
    }
  });
