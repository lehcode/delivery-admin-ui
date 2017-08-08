/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('OrdersController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing OrdersController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Orders view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
