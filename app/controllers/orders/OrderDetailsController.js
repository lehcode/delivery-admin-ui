/**
 * Created by Antony Repin on 9/2/2017.
 */

angular.module('AdminApp')
  .controller('OrderDetailsController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'orderService',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                orderService,
                localStorageService) {

        console.log("Initializing OrderDetailsController");

        $scope.$on('$viewContentLoaded', function () {
          //
        });

        $scope.$watch('entity', function (newVal, oldVal) {
          console.debug("Order: ", newVal);
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.entity = $state.get('order') ? $state.get('order') : localStorageService.get('order');
          if (!$scope.entity.id)
            $state.go('orders');
          $scope.processing = false;

        });

      }
    ]);
