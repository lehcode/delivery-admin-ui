/**
 * Created by Antony Repin on 8/4/2017.
 */

angular.module('AdminApp')
  .factory('animationService',
    [
      'api',
      'settings',
      '$animate',

      function (api,
                settings,
                $animate) {

        return {
          hide: function (selector) {
            var el = angular.element(selector);
            $animate.addClass(el, 'ng-hide');
          },
          show: function (selector) {
            var el = angular.element(selector);
            $animate.removeClass(el, 'ng-hide');
          },
        };
      }]
  );
