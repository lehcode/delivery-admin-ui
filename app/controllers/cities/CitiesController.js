/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('CitiesController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing CitiesController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Cities view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
