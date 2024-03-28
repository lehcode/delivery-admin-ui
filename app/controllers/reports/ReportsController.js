/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('ReportsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing ReportsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Reports view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
