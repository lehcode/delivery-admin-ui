/**
 * Created by Antony Repin on 8/26/2017.
 */


angular.module('AdminApp')
  .controller('TripDetailsController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'tripService',
      'carrierService',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                tripService,
                carrierService,
                localStorageService) {

        console.log("Initializing TripDetailsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info('"Trip Details" view content loaded');
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.processing = false;

          if (!!$rootScope.trip === true) {
            $scope.trip = !!$rootScope.trip === true ? $rootScope.trip : {};
          } else {
            $scope.trip = localStorageService.get('trip');
          }

          if (!$scope.trip.id){
            $scope.state.go('trips');
          }

          $scope.entity = $scope.trip;

          $scope.trip.attributes.departure_date = moment($scope.trip.attributes.departure_date).utc()
            .format("YYYY-MM-DD HH:mm")
          $scope.trip.attributes.exp_delivery_date = moment($scope.trip.attributes.departure_date).utc()
            .minutes($scope.trip.attributes.approx_time)
            .format("YYYY-MM-DD HH:mm");

          $scope.$watch('trip', function (newVal, oldVal) {
            console.debug("Trip: ", newVal);
          });

        });

      }]
  );
