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
      apiHost: 'http://back.barq.zee.lan',
      apiVersion: 'v1',
      appVersion: '0.0.1',
      apiRoot: null,
      defaultCountry: {
        short_name: 'Saudi Arabia',
        db_id: 195,
        alpha2_code: 'sa',
        alpha3_code: 'sau',
        numeric_code: 682
      },
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
    };

    settings.apiRoot = settings.apiHost + '/api/admin/' + settings.apiVersion;

    $rootScope.settings = settings;

    /**
     * Data stores container
     * @type {{}}
     */
    $rootScope.stores = {};

    toastr.options = settings.toastr;

    return settings;
  }]);

AdminApp.config([
  '$locationProvider',
  '$routeProvider',
  '$mdDateLocaleProvider',
  'localStorageServiceProvider',

  function ($locationProvider,
            $routeProvider,
            $mdDateLocaleProvider,
            localStorageServiceProvider) {

    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    //$routeProvider.otherwise('login');

    localStorageServiceProvider
      .setPrefix('AdminApp')
      .setStorageType('sessionStorage')
      .setDefaultToCookie(false)
      .setNotify(true, true);

    // uiGmapGoogleMapApiProvider.configure({
    //   key: 'AIzaSyDQCGZb0TUJaUbzsOko_SMaBVcIYBmp-0U',
    //   v: '3.20',
    //   libraries: 'weather,geometry,visualization'
    // });

  }]);

/**
 * Angular Material theme configuration
 */
AdminApp.config(function ($mdThemingProvider) {

  var customBlueMap = $mdThemingProvider.extendPalette('green', {
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50'],
    '50': '000000'
  });

  $mdThemingProvider.definePalette('customBlue', customBlueMap);

  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {default: '500', 'hue-1': '50'})
    .accentPalette('grey');

  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('amber');

  //$mdThemingProvider.disableTheming();
});

AdminApp.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);


AdminApp.config(function ($mdIconProvider) {
  $mdIconProvider
  // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
  //
    .iconSet('action', 'img/material-design-icons/svg-sprite-action.svg', 24)
    .iconSet('alert', 'img/material-design-icons/svg-sprite-alert.svg', 24)
    .iconSet('av', 'img/material-design-icons/svg-sprite-av.svg', 24)
    .iconSet('communication', 'img/material-design-icons/svg-sprite-communication.svg', 24)
    .iconSet('content', 'img/material-design-icons/svg-sprite-content.svg', 24)
    .iconSet('device', 'img/material-design-icons/svg-sprite-device.svg', 24)
    .iconSet('editor', 'img/material-design-icons/svg-sprite-editor.svg', 24)
    .iconSet('file', 'img/material-design-icons/svg-sprite-file.svg', 24)
    .iconSet('hardware', 'img/material-design-icons/svg-sprite-hardware.svg', 24)
    .iconSet('image', 'img/material-design-icons/svg-sprite-image.svg', 24)
    .iconSet('maps', 'img/material-design-icons/svg-sprite-maps.svg', 24)
    .iconSet('navigation', 'img/material-design-icons/svg-sprite-navigation.svg', 24)
    .iconSet('notification', 'img/material-design-icons/svg-sprite-notification.svg', 24)
    .iconSet('social', 'img/material-design-icons/svg-sprite-social.svg', 24)
    .iconSet('toggle', 'img/material-design-icons/svg-sprite-toggle.svg', 24)
    //.iconSet('cars', 'img/material-design-icons/taxi.svg', 24)

    // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
    .iconSet('avatars', 'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg', 24)
    .defaultIconSet('img/material-design-icons/svg-sprite-action.svg', 24);
});
