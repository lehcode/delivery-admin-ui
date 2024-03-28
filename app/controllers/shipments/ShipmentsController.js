/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('ShipmentsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing ShipmentsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Shipments view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
