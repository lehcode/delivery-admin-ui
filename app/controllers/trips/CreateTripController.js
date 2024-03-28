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
      '$q',

      function ($scope,
                $rootScope,
                $state,
                tripService,
                carrierService,
                formService,
                $q) {

        console.log("Initializing EditTripController");

        $scope.$on('$viewContentLoaded', function () {
          //console.info('"Edit Trip" view content loaded');
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
          
          $scope.processing = true;

          getCarriers()
            .then(function (data) {
              $scope.carriers = data;
              $scope.processing = false;
            });

          getShipmentsSizes()
            .then(function (data) {
              $scope.shipmentSizes = data;

              getShipmentsCategories()
                .then(function (resolve) {
                  $scope.shipmentCategories = data;

                  getCities()
                    .then(function (data) {
                      $scope.cities = data;
                    });

                });
            });
        });

        /**
         *
         * @returns {Promise}
         */
        function getCarriers() {
          return $q(function (resolve) {
            carrierService.getList()
              .then(function (data) {
                resolve(data.data);
              });
          });
        }

        /**
         *
         * @returns {Promise}
         */
        function getShipmentsSizes() {
          return $q(function (resolve) {
            formService.getShipmentSizes()
              .then(function (data) {
                resolve(data.data);
              });
          });
        }

        /**
         *
         * @returns {Promise}
         */
        function getShipmentsCategories() {
          return $q(function (resolve) {
            formService.getShipmentCategories()
              .then(function (data) {
                resolve(data.data);
              });
          });
        }

        /**
         * Get cities for Carrier current location
         */
        function getCities() {
          return $q(function (resolve) {
            formService.getCities()
              .then(function (data) {
                resolve(data.data);
              });
          });
        };

        /**
         * Save Trip entity
         * @param e {Event}
         */
        $scope.saveEntity = function (e) {

          $scope.processing = true;

          var formData = new FormData();

          formData.append('carrier_id', this.carrier.id);
          formData.append('from_city_id', parseInt(this.carrier.attributes.current_city.id));

          var dt = this.departure_time.match(/^(\d{2}):(\d{2})/);
          var departureDate = moment(this.trip.attributes.departure_date)
              .utc().hours(dt[1]).minutes(dt[2])
              .format("YYYY-MM-DD HH:mm") + ":00";

          formData.append('to_city_id', parseInt(this.trip.attributes.destination_city.id));
          formData.append('departure_date', departureDate);
          formData.append('shipment_size_id', parseInt(this.trip.attributes.shipment_size.id));

          tripService.create(formData)
            .then(function (data) {

              if (data.statusCode === 422){
                formService.showServerErrors(tripForm, data.messages);
                return false;
              }

              $scope.processing = false;
              $scope.state.go('trips');
            });

        }

      }]
  );
