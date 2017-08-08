/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('AdminController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing AdminController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Admins view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
