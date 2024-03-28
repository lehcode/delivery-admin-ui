/**
 * Created by Antony Repin on 8/31/2017.
 */

angular.module('AdminApp')
  .directive('backButton', ['$window', function($window) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('click', function () {
        $window.history.back();
      });
    }
  };
}]);
