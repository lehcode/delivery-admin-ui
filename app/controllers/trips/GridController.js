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

        /**
         * AJAX flag
         *
         * @type {boolean}
         */
        $scope.processing = true;

        /**
         *
         * @type {Array}
         */
        $scope.trips = null;

        /**
         * Dialog action placeholder
         *
         * @type {{hash: {String}, string: {String}}}
         */
        $scope.formAction = {hash: null, string: null};

        /**
         * Initialize controller
         */
        (function () {
          configure();
          getGridData();
        })();

        function configure() {

          console.log("Configuring controller");

          var gridDefaults = $rootScope.settings.grid.defaults;

          $scope.gridOptions = Object.assign(gridDefaults, {
            enableRowHeaderSelection: false,
            columnDefs: [
              {field: "id", name: "ID"},
              {field: "attributes.carrier[0].attributes.username", name: "Carrier"},
              {field: "attributes.created_at", name: "Date", cellFilter: "date"},
              {field: "attributes.from_city[0].attributes.name", name: "From"},
              {field: "attributes.destination_city[0].attributes.name", name: "To"},
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
              $scope.gridOptions.data = data;
              $scope.processing = false;
            });
        }

      }
    ]
  );
