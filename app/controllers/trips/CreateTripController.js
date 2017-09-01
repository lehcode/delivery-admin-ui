/**
 * Created by Antony Repin on 8/26/2017.
 */


angular.module('AdminApp')
  .controller('CreateTripController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'tripService',
      'carrierService',
      'formService',

      function ($scope,
                $rootScope,
                $state,
                tripService,
                carrierService,
                formService) {

        /**
         * AJAX flag
         *
         * @type {boolean}
         */
        $scope.processing = true;

        console.log("Initializing EditTripController");

        $scope.$on('$viewContentLoaded', function () {
          console.info('"Edit Trip" view content loaded');
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
        if (!!$rootScope.trip === true){
          $rootScope.trip = null;
        }

        // $scope.$watch('carrier', function (newVal, oldVal) {
        //   debugger;
        //   console.log("Carrier: ", newVal);
        // });
				//
        // $scope.$watch('trip', function (newVal, oldVal) {
        //   debugger;
        //   console.log("Trip: ", newVal);
        // });
				//
        // $scope.$watch('trip.attributes.from_city.attributes.name', function (newVal, oldVal) {
        //   console.log("from_city.name: ", newVal);
        // });

        /**
         * Initialize controller
         */
        (function () {
          if ($state.current.data.formAction === 'edit' && !$scope.trip.id) {
            $scope.state.go('trips');
          }
          configure();
          getCarriers();
          getShipmentsProperties();
          getCities();
        })();

        /**
         * Configure controller
         */
        function configure() {

          var now = new Date();

          $scope.minDepartureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          $scope.maxDepartureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, now.getHours(), now.getMinutes());
        }

        /**
         * Fetch Carriers list from server
         */
        function getCarriers() {
          $scope.processing = true;
          carrierService.getList()
            .then(function (data) {
              $scope.carriers = data;
              $scope.processing = false;
            });
        };

        /**
         * Get shipment properties for select list
         */
        function getShipmentsProperties() {
          $scope.processing = true;
          formService.getShipmentSizes()
            .then(function (data) {
              $scope.shipmentSizes = data;
              $scope.processing = false;

              // formService.getShipmentCategories()
              //   .then(function (data) {
              //     $scope.shipmentCategories = data;
              //     $scope.processing = false;
              //   });

            })
        };

        /**
         * Get cities for Carrier current location
         */
        function getCities() {
          $scope.processing = true;
          formService.getCities()
            .then(function (data) {
              $scope.cities = data;
              $scope.processing = false;
            });
        };

        /**
         * Save Trip entity
         * @param e {Event}
         */
        $scope.saveEntity = function (e) {

          $scope.processing = true;

          var fillable = [
            'carrier_id',
            'from_city_id',
            'to_city_id',
            'departure_date',
          ];

          var formData = new FormData();

          formData.append('carrier_id', $scope.carrier.id);

          angular.forEach($scope.carrier.attributes, function (value, key) {
            if (key === 'current_city') {
              formData.append('from_city_id', value.id);
            }
          });

          var departureDate = moment($scope.trip.attributes.departure_date);
          var dt = $scope.trip.attributes.departure_time.match(/^(\d{2}):(\d{2})/);
          departureDate.utc().hours(dt[1]);
          departureDate.utc().minutes(dt[2]);
          departureDate = departureDate.utc().format("YYYY-MM-DD HH:mm") + ":00";

          angular.forEach($scope.trip.attributes, function (value, key) {
            if (key === 'departure_date') {
              formData.append(key, departureDate);
            }

            if (key === 'destination_city') {
              formData.append('to_city_id', parseInt(value.id));
            }

            if (key === 'shipment_size') {
              formData.append('shipment_size_id', value.id);
            }
          });

          if (!!$scope.trip.id === true) {
            tripService.update($scope.trip.id, formData)
              .then(function (data) {
                $rootScope.trip = data;
                $scope.processing = false;
                $scope.state.go('trips');
              });
          } else {
            tripService.create(formData)
              .then(function (data) {
                $rootScope.trip = data;
                $scope.processing = false;
                $scope.state.go('trips');
              });
          }

        }

      }]
  );
