/**
 * Created by Antony Repin on 30.04.2017.
 */

'use strict';

/**
 * Global application configuration
 */
AdminApp.factory('settings', [
  '$rootScope',
  '$locale',

  function ($rootScope,
            $locale) {

    /**
     * Default height of rows in grid
     * @type {number}
     */
    var gridRowHeight = 36;

    $locale.id = "nl-BE";

    /**
     * Application configuration
     *
     * @type {{apiHost: string, apiVersion: string, appVersion: string, grid: {defaults: {data: null, headerRowHeight: number, rowHeight: number, idRowWidth: string, excludeProperties: string[], enableColumnResizing: boolean, enableSorting: boolean, enableHorizontalScrollbar: boolean, showGridFooter: boolean, enableFiltering: boolean, enableRowSelection: boolean, enableRowHeaderSelection: boolean, enableSelectAll: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, enableColumnMenus: boolean, onRegisterApi: settings.grid.defaults.onRegisterApi}}}}
     */
    var settings = {
        apiHost: 'http://back.barq.zee.lan/',
        apiVersion: 'v1',
        appVersion: '0.0.1',
        grid: {
          defaults: {
            data: null,
            headerRowHeight: 60,
            rowHeight: gridRowHeight,
            idRowWidth: "6%",
            excludeProperties: ['treeLevel', '$$treeLevel'],
            enableColumnResizing: true,
            enableSorting: true,
            enableHorizontalScrollbar: false,
            showGridFooter: false,
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableColumnMenus: false,
            /**
             *
             * @param gridApi
             */
            onRegisterApi: function (gridApi) {
              console.info(gridApi);
            }
          }
        },
        toastr: {
          closeButton: false,
          debug: false,
          newestOnTop: false,
          progressBar: false,
          positionClass: "toast-top-center",
          preventDuplicates: true,
          onclick: null,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut"
        }
      }
      ;

    $rootScope.settings = settings;

    /**
     * Data stores container
     * @type {{}}
     */
    $rootScope.stores = {};

    toastr.options = settings.toastr;

    return settings;
  }]);

AdminApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

/**
 * Angular Material theme configuration
 */
AdminApp.config(function ($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('blue', {
    contrastDefaultColor: 'dark',
    contrastDarkColors: ['50'],
    '50': '000000'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {default: '500', 'hue-1': '50'})
    .accentPalette('pink');

  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('grey')
});

AdminApp.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);
