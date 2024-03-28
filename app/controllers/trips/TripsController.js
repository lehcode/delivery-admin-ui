/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('TripsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing TripsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Trips view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
