/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('OrdersGridController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'orderService',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                orderService,
                localStorageService) {

        console.log("Initializing OrdersGridController");

        $scope.$on('$viewContentLoaded', function () {
          //
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.$emit('ajaxEvent', true);
          $scope.orders = null;

          configure();
          getGridData();

        });

        /**
         * Configure controller
         */
        function configure() {

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            data: null,
            enableRowHeaderSelection: false,
            columnDefs: [
              {field: "id", name: "ID"},
              {field: "attributes.customer[0].attributes.username", name: "Customer"},
              {field: "attributes.trip[0].attributes.carrier[0].attributes.username", name: "Carrier"},
              {field: "attributes.trip[0].attributes.departure_date", name: "Departure Date", cellFilter: "longDate"},
              {field: "attributes.trip[0].attributes.from_city[0].attributes.name", name: "From"},
              {field: "attributes.trip[0].attributes.destination_city[0].attributes.name", name: "To"},
              {field: "attributes.status", name: "Status"},
            ]
          });

          $scope.gridOptions.onRegisterApi = function (gridApi) {

            $scope.gridApi = gridApi;

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, e) {

              if (!row.isSelected)
                return false;

              localStorageService.set('order', row.entity);
              $scope.state.go('order/details', { order: row.entity });

            });
          };

        }

        /**
         * Fetch Customers list from backend
         */
        function getGridData() {
          $scope.processing = true;
          orderService.getList()
            .then(function (data) {
              $scope.gridOptions.data = data.data;
              $scope.$emit('ajaxEvent', false);
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
