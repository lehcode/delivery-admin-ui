/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('NotificationsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing NotificationsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Notifications view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
