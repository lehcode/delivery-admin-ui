/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('CustomersController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing CustomersController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Customers view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
