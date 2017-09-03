/**
 * Created by Antony Repin on 9/7/2017.
 */


angular.module('AdminApp')
  .controller('CarrierDetailsController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                localStorageService) {

        console.log("initializing CarrierDetailsController");

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.entity = $state.get('carrier') ? $state.get('carrier') : localStorageService.get('carrier');
          if (!$scope.entity.id) $state.go('carriers');

          $scope.processing = false;
          $scope.entity.attributes.created_at = moment($scope.entity.attributes.created_at).utc()
            .format("YYYY-MM-DD HH:mm");
          $scope.entity.attributes.last_login = moment($scope.entity.attributes.last_login).utc()
            .format("YYYY-MM-DD HH:mm");
          $scope.entity.attributes.birthday = moment($scope.entity.attributes.birthday).utc()
            .format("YYYY-MM-DD");

        });

        $scope.$on('$viewContentLoaded', function () {
          $scope.$parent.loading = false;
        });

        $scope.$on('$stateChangeFailure', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$watch('entity', function (newVal, oldVal) {
          console.debug("Carrier: ", newVal);
        });

        $scope.goEdit = function () {
          localStorageService.set('carrier', $scope.entity);
          $state.go('carrier/edit', {carrier: $scope.entity});
        }

      }
    ]
  );
