/**
 * Created by Antony Repin on 9/3/2017.
 */


angular.module('AdminApp')
  .controller('CustomerDetailsController',
    [
      '$scope',
      '$rootScope',
      '$state',
      'localStorageService',

      function ($scope,
                $rootScope,
                $state,
                localStorageService) {

        $scope.$on('$viewContentLoaded', function (e) {
          $scope.$parent.loading = false;
        });

        $scope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams) {
          debugger;
        });

        $scope.$watch('entity', function (v) {
          console.info("Customer", v);
        });

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

          $scope.entity = $state.get('customer') ? $state.get('customer') : localStorageService.get('customer') ? localStorageService.get('customer') : null;
          if (!$scope.entity.id)
            $state.go('customers');

          $scope.entity.attributes.created_at = moment($scope.entity.attributes.created_at).utc()
            .format("YYYY-MM-DD HH:mm:ss");

          $scope.paymentType = $scope.entity.attributes.payment_info[0].attributes.card_number ? "Card" : "Cash";
          $scope.lastLogin = moment($scope.entity.attributes.last_login).format("YYYY-MM-DD HH:mm:ss");

        });

        /**
         * Redirect to Edit page
         */
        $scope.goEdit = function () {
          localStorageService.set('customer', $scope.entity);
          $state.go('customer/edit', {customer: $scope.entity});

        }
      }
    ]
  );
