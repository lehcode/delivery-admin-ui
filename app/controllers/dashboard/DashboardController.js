/**
 * Created by Antony Repin on 03.05.2017.
 */

angular.module('AdminApp')
  .controller('DashboardController', [
    '$scope',
    '$rootScope',
    'localStorageService',

    function ($scope,
              $rootScope,
              localStorageService) {

      console.log("Initializing DashboardController");

      $scope.$on('$viewContentLoaded', function () {

      });

    }
  ]);
