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

        if (ctrl.$$scope.$parent.dialogAction.hash === 'edit') {
          return $q.resolve(true);
        }

        if (ctrl.$isEmpty(modelValue)) {
          return $q.resolve(false);
        }



        return $q(function (resolve, reject) {
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
      //scope : true,
      link: link
    }
  });
