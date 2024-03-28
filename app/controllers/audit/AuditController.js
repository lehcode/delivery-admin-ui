/**
 * Created by Antony Repin on 8/2/2017.
 */

angular.module('AdminApp')
  .controller('AuditController',
    [
      '$scope',
      '$rootScope',
      '$state',

      function ($scope,
                $rootScope,
                $state) {

        console.log("Initializing AuditController");

        $scope.$on('$viewContentLoaded', function () {
          console.info("Audits view content loaded");
        });

        $scope.gridData = [];

      }
    ]
  );
