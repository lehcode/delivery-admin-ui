/**
 * Created by Antony Repin on 9/3/2017.
 */

angular.module('AdminApp')
  .controller('AdminsGridController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'adminService',
      'uiGridConstants',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                adminService,
                uiGridConstants,
                localStorageService) {

        $scope.$on('$viewContentLoaded', function () {
          //console.info("\"Admins Grid\" view content loaded");
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
            data: null,
            enableRowHeaderSelection: false,
            columnDefs: [
              {field: "attributes.username", name: "Username"},
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
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">' +
                '<md-input-container md-no-ink>' +
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
                filterCellFiltered: false,
              },
            ]
          });

          $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
          };

        }

        /**
         * Fetch array of results from backend
         */
        function getGridData() {
          $scope.processing = true;
          adminService.getList()
            .then(function (data) {
              $scope.gridOptions.data = data;
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

  });
