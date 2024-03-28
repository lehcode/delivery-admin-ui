/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('SettingsController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing SettingsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Settings view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
