/**
 * Created by Antony Repin on 8/16/2017.
 */

'use strict';

angular.module('AdminApp')
  .directive('adminUsername', function ($q, api, formService) {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.unique = function (modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            return $q.resolve();
          }

          return $q(function(resolve, reject){
            api.get('user/exists/' + viewValue)
              .then(function (response) {
                switch (response.status) {
                  case 200:
                     if (response.data.result === true) {
                       ctrl.$setValidity('adminUsername', false);
                       formService.setDirtyTouched(ctrl);
                       reject();
                    } else {
                       ctrl.$setValidity('adminUsername', true);
                       resolve();
                     }
                    break;
                  default:
                    return def.reject();
                    break;
                }
              });
          });
        };
      }
    }
  });
