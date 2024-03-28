/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('PaymentsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing PaymentsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Payments view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
