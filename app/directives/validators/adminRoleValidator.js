/**
 * Created by Antony Repin on 8/16/2017.
 */

'use strict';

angular.module('AdminApp')
  .directive('adminRole', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {

        ctrl.$validators.adminRole = function (modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            return false;
          }

          var roles = ['admin', 'support', 'accountant'];

          for (var i in roles) {
            if (roles[i] == modelValue.toLowerCase()) return true;
          }

          return false;

        };
      }
    }
  });
