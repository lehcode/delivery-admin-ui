/**
 * Created by Antony Repin on 8/16/2017.
 */

'use strict';

angular.module('AdminApp')
  .directive('uniquePhone', function ($q, api, formService) {

    function link(scope, elm, attrs, ctrl) {

      ctrl.$asyncValidators.unique = function (modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          return $q.resolve(false);
        }

        if (ctrl.$$scope.$parent.formEdit) {
          if (modelValue === ctrl.$modelValue) {
            ctrl.$setValidity('uniquePhone', true);
            return $q.resolve(true);
          }
        }

        return $q(function (resolve, reject) {
          formService.checkPhoneExistence(viewValue)
            .then(function(data){
              switch (data.statusCode) {
                case 200:
                  if (data.result === true) {
                    ctrl.$setValidity('uniquePhone', false);
                    //formService.setDirtyTouched(ctrl);
                    resolve(false);
                  } else {
                    ctrl.$setValidity('uniquePhone', true);
                    resolve(true);
                  }
                  break;
                case 422:
                  ctrl.$setValidity('uniquePhone', false);
                  //formService.setDirtyTouched(ctrl);
                  //formService.showServerErrors(carrierForm, data.messages);
                  resolve(false);
                  break;
                default:
                  ctrl.$setValidity('uniquePhone', false);
                  //formService.setDirtyTouched(ctrl);
                  resolve(false);
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
