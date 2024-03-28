/**
 * Created by Antony Repin on 05.05.2017.
 */

angular.module('AdminApp')
  .controller('NavigationController', [
    '$scope',
    '$rootScope',

    function ($scope,
              $rootScope) {

      console.log("Initializing NavigationController");

      $rootScope.setUserData();
      $scope.$parent.$broadcast('getNavigation');


    }
  ]);
