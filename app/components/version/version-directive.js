'use strict';

AdminApp.directive('appVersion', function () {
    return function (scope, elm, attrs) {
      elm.text(scope.appVersion);
    };
  });
