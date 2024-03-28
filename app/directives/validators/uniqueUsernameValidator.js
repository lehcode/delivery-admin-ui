/**
 * Created by Antony Repin on 8/16/2017.
 */

'use strict';

angular.module('AdminApp')
  .directive('uniqueUsername', function ($q,
                                        api,
                                        formService) {

    function link(scope, elm, attrs, ctrl) {

      ctrl.$asyncValidators.unique = function (modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          return $q.resolve(false);
        }

        if (ctrl.$$scope.$parent.formEdit) {
          if (modelValue === viewValue) {
            ctrl.$setValidity('uniqueUsername', true);
            return $q.resolve(true);
          }
        }

        return $q(function (resolve, reject) {
          api.get('user/exists/' + viewValue)
            .then(function (response) {
              switch (response.status) {
                case 200:
                  if (response.data.result === true) {
                    ctrl.$setValidity('uniqueUsername', false);
                    formService.setDirtyTouched(ctrl);
                    reject();
                  } else {
                    ctrl.$setValidity('uniqueUsername', true);
                    resolve(true);
                  }
                  break;
                default:
                  reject();
                  break;
              }
            });
        });
      };
    }

    return {
      require: 'ngModel',
      restrict: 'A',
      link: link
    }
  });
