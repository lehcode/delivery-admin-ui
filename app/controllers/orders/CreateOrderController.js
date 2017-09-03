/**
 * Created by Antony Repin on 9/2/2017.
 */
angular.module('AdminApp')
  .controller('CreateOrderController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'orderService',
      'customerService',
      'formService',
      '$q',
      '$mdDialog',
      'NgMap',
      'NavigatorGeolocation',
      'settings',
      'tripService',

      function ($scope,
                $rootScope,
                $state,
                orderService,
                customerService,
                formService,
                $q,
                $mdDialog,
                NgMap,
                NavigatorGeolocation,
                settings,
                tripService) {

        $scope.$on('$viewContentLoaded', function (e) {

          // NavigatorGeolocation.getCurrentPosition()
          //   .then(function (position) {
          //
          //     var lat = position.coords.latitude, lng = position.coords.longitude;
          //     var loc = {};
          //
          //     //$scope.componentRestrictions = "{country: '" + google.loader.ClientLocation.address.country_code + "'}";
          //
          //     // if (google.loader.ClientLocation) {
          //     //   debugger;
          //     //   $scope.componentRestrictions = "{country: '" + google.loader.ClientLocation.address.country_code + "'}";
          //     // }
          //
          //     //.. do something lat and lng
          //   }, function (error) {
          //     switch (error.code) {
          //       case error.PERMISSION_DENIED:
          //         console.error("User denied the request for Geolocation.");
          //         break;
          //       case error.POSITION_UNAVAILABLE:
          //         console.error("Location information is unavailable.");
          //         break;
          //       case error.TIMEOUT:
          //         console.error("The request to get user location timed out.");
          //         break;
          //       case error.UNKNOWN_ERROR:
          //         console.error("An unknown error occurred.");
          //         break;
          //     }
          //   });
        });

        $scope.$watch('maps.version', function (newVal) {
          console.log(newVal);
        });

        $scope.$watch('vm.origin', function (newVal, oldVal) {
          if (newVal !== '' && newVal.length > 3)
            $scope.start_coord = doGeocode(newVal);
        });

        $scope.$watch('vm.destination', function (newVal, oldVal) {
          if (newVal !== '' && newVal.length > 3)
            $scope.end_coord = doGeocode(newVal);
        });

        $scope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.entity = null;
          $scope.processing = true;
          $scope.editing = false;
          $scope.searchText = null;
          $scope.tripSearchText = null;
          $scope.vm = {origin: "", destination: ""};
          $scope.maps = google.maps;
          $scope.phoneRegex = $rootScope.phoneRegex;

          getCustomers()
            .then(function (data) {
              $scope.customers = data;

              getCities()
                .then(function (data) {
                  $scope.cities = data;

                  getShipmentSizes()
                    .then(function (data) {
                      $scope.shipmentSizes = data;

                      getShipmentCategories()
                        .then(function (data) {
                          $scope.shipmentCategories = data;

                          getTrips().then(function (data) {
                            $scope.trips = data;
                            $scope.processing = false;
                            $scope.$emit('ajaxEvent', false);
                          });

                        });
                    });
                });
            });
        });

        /**
         * Get Customers list for dropdown
         *
         * @returns {Object}
         */
        function getCustomers() {
          return $q(function (resolve) {
            customerService.getList()
              .then(function (resolved) {
                resolve(resolved.data);
              });
          });
        }

        /**
         * Get Cities list for dropdown
         *
         * @returns {Object}
         */
        function getCities() {
          return $q(function (resolve) {
            customerService.getList()
              .then(function (resolved) {
                resolve(resolved.data);
              });
          });
        }

        /**
         * Get shipment sizes list
         *
         * @returns {Array}
         */
        function getShipmentSizes() {
          return $q(function (resolve) {
            formService.getShipmentSizes()
              .then(function (resolved) {
                resolve(resolved.data);
              });
          });
        }

        /**
         * Get shipment categories list
         *
         * @returns {Array}
         */
        function getShipmentCategories() {
          return $q(function (resolve) {
            formService.getShipmentCategories()
              .then(function (resolved) {
                resolve(resolved.data);
              });
          });
        }

        /**
         * Get trips list
         *
         * @returns {Array}
         */
        function getTrips() {
          return $q(function (resolve) {
            tripService.getList()
              .then(function (resolved) {
                resolve(resolved.data);
              });
          });
        }

        /**
         * Filter results for autocomplete
         *
         * @param query
         * @returns {*}
         */
        $scope.querySearch = function (query, elName) {

          try {
            switch (elName) {
              case 'username':
                var result = query ? $scope.customers.filter(createFilterFor(query, elName)) : $scope.customers;
              case 'trip':
                var result = query ? $scope.trips.filter(createFilterFor(query, elName)) : $scope.trips;
            }
          } catch (e) {
            console.error(e);
          }

          return result;
        };

        /**
         * Create filter for query
         *
         * @param query
         * @returns {filterFn}
         */
        function createFilterFor(query, elName) {

          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(item) {
            var r;
            switch (elName) {
              case 'username':
                r = item.attributes.username.indexOf(query.toString()) === 0;
                break;
              case 'trip':
                r = item.id.indexOf(lowercaseQuery) === 0;
                break;
            }
            return r;
          };

        }

        /**
         * Convert address string to geo coordinates
         *
         * @param textValue
         * @returns {*}
         */
        function doGeocode(textValue) {
          return $q(function (resolve, reject) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: textValue,
                componentRestrictions: {country: $scope.country.alpha2_code},
              },
              function (result, status) {
                if (status == 'OK') {
                  console.dir(result[0]);
                  resolve(result[0].geometry.location);
                } else {
                  console.error('Geocode error: "' + status + '"');
                }
              },
              function (error) {
                debugger;
              });
          });
        }

        /**
         * SAve entity
         * @param e {MouseEvent}
         */
        $scope.saveEntity = function (e) {

          $scope.processing = true;

          var formData = new FormData();
          var start = [];
          var end = [];
          var scope = this;

          doGeocode($scope.vm.origin).then(function (coords) {

            start['lat'] = coords.lat().toString();
            start['lng'] = coords.lng().toString();

            doGeocode($scope.vm.destination).then(function (coords) {

              end['lat'] = coords.lat().toString();
              end['lng'] = coords.lng().toString();

              formData.append('customer', scope.selectedCustomer.attributes.username);
              formData.append('start_coord[lat]', start['lat']);
              formData.append('start_coord[lng]', start['lng']);
              formData.append('end_coord[lat]', end['lat']);
              formData.append('end_coord[lng]', end['lng']);
              formData.append('recipient_name', scope.recipient.name);
              formData.append('recipient_phone', scope.recipient.phone);
              formData.append('recipient_notes', scope.recipient.notes ? scope.recipient.notes : null);
              formData.append('shipment_size', scope.shipment.size);
              formData.append('shipment_category', scope.shipment.category);
              formData.append('price', scope.price);

              if (!!scope.trip_id === true) {
                formData.append('trip_id', scope.selectedTrip.id);
              }

              if (scope.shipment.images) {
                scope.shipment.images.forEach(function (item) {
                  formData.append('images[]', item);
                });
              }

              orderService.create(formData).then(function (data) {
                debugger;
                switch (data.statusCode) {
                  case 422:
                    formService.showServerErrors(scope.orderForm, data.messages);
                    break;
                  case 200:
                    //$scope.go('order/details', {entity: data});
                    break;
                }
              });

            });

          });

        };
      }
    ]
  );
