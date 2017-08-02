/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('CarriersController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing CarriersController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Carriers view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
