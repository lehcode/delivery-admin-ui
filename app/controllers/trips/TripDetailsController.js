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

        /**
         * AJAX flag
         *
         * @type {boolean}
         */
        $scope.processing = false;

        console.log("Initializing TripDetailsController");

        $scope.$on('$viewContentLoaded', function () {
          console.info('"Trip Details" view content loaded');
        });

        /**
         * Carriers placeholder
         *
         * @type {Array}
         */
        $scope.carriers = [];

        /**
         * Shipments sizes placeholder
         *
         * @type {Array}
         */
        $scope.shipmentSizes = [];

        /**
         * Carrier entity placeholder
         *
         * @type {Object}
         */
        $scope.carrier = {};

        /**
         * Trip entity placeholder
         *
         * @type {Object}
         */
        $scope.trip = {};

        /**
         * Trip object placeholder
         *
         * @type {Object}
         */
        if (!!$rootScope.trip === true) {
          $scope.trip = !!$rootScope.trip === true ? $rootScope.trip : {};
        } else {
          $scope.trip = localStorageService.get('trip');
        }

        // $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        //   debugger;
        //   $scope.trip = null;
        // });

        if (!$scope.trip.id){
          $scope.state.go('trips');
        }

        $scope.trip.attributes.departure_date = moment($scope.trip.attributes.departure_date).format("YYYY-MM-DD HH:mm")
        $scope.trip.attributes.exp_delivery_date = moment($scope.trip.attributes.departure_date).minutes($scope.trip.attributes.approx_time).format("YYYY-MM-DD HH:mm");

        $scope.$watch('trip', function (newVal, oldVal) {
          console.debug("Trip: ", newVal);
        });

      }]
  );
