/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('TripsGridController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'settings',
      'tripService',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                settings,
                tripService,
                localStorageService) {

        console.log("Initializing TripsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Trips view content loaded");
        });

        $scope.$watch('gridOptions.data', function (newVal, oldVal) {
          //debugger;
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

          console.log("Configuring TripsGridController");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            data: null,
            enableRowHeaderSelection: false,
            columnDefs: [
              //{field: "id", name: "ID"},
              {field: "attributes.carrier[0].attributes.username", name: "Carrier"},
              {field: "attributes.departure_date", name: "Departure", cellFilter: "longDate"},
              {field: "attributes.from_city[0].attributes.name", name: "From"},
              {field: "attributes.destination_city[0].attributes.name", name: "To"},
              {field: "attributes.created_at", name: "Created", cellFilter: "fullDate"},
            ]
          });

          $scope.gridOptions.onRegisterApi = function (gridApi) {

            $scope.gridApi = gridApi;

            $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, e) {

              if (!row.isSelected)
                return false;

              localStorageService.set('trip', row.entity);
              $scope.state.go('trip/details');

            });
          };
        }

        /**
         * Fetch Customers list from backend
         */
        function getGridData() {
          $scope.processing = true;
          tripService.getList()
            .then(function (data) {
              $scope.gridOptions.data = data.data;
              $scope.processing = false;
            });
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
  .filter('fullDate', function () {
  return function (dString) {
    var d = moment(new Date(dString));
    return d.format("YYYY-MM-DD HH:mm:ss");
  }
});
