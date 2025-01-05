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

  /**
   * Factory function to configure global application settings.
   *
   * @param {Object} $rootScope - The root scope of the application.
   * @param {Object} $locale - The AngularJS locale service.
   *
   * @returns {Object} An object containing the application's settings.
   */
  function ($rootScope, $locale) {
    const gridRowHeight = 36;

    $locale.id = 'nl-BE';

    const settings = {
      apiHost: 'http://localhost:8080',
      apiVersion: 'v1',
      appVersion: '0.0.1',
      apiRoot: null,
      grid: {
        defaults: {
          data: null,
          headerRowHeight: 60,
          rowHeight: gridRowHeight,
          idRowWidth: '6%',
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
           * Callback function executed after ui-grid is registered.
           * @param {uiGridInstance} gridApi - Instance of ui-grid API
           */
          onRegisterApi: function (gridApi) {
            console.info(gridApi);
          },
        },
      },
      toastr: {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
      },
    };

    settings.apiRoot = settings.apiHost + '/api/admin/' + settings.apiVersion;

    $rootScope.settings = settings;
    $rootScope.stores = {};

    toastr.options = settings.toastr;

    return settings;
  },
])
  .config([
    '$locationProvider',
    '$routeProvider',
    function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider.otherwise('login');
    },
  ])
  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('AdminApp')
      .setStorageType('sessionStorage')
      .setDefaultToCookie(false)
      .setNotify(true, true);
  }])
  .config([
    '$mdThemingProvider',
    function ($mdThemingProvider) {
      /*
       * Angular Material theme configuration
       */
      const customBlueMap = $mdThemingProvider.extendPalette('blue', {
        contrastDefaultColor: 'dark',
        contrastDarkColors: ['50'],
        50: '000000',
      });
      $mdThemingProvider.definePalette('customBlue', customBlueMap);
      $mdThemingProvider
        .theme('default')
        .primaryPalette('customBlue', { default: '500', 'hue-1': '50' })
        .accentPalette('pink');

      $mdThemingProvider.theme('input', 'default').primaryPalette('grey');
    }
  ])
  .config([
    '$qProvider',
    function ($qProvider) {
      $qProvider.errorOnUnhandledRejections(false);
    },
  ])
  .config([
    '$mdIconProvider',
    function ($mdIconProvider) {
    $mdIconProvider
      // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
      //
      .iconSet('action', 'img/material-design-icons/svg-sprite-action.svg', 24)
      .iconSet('alert', 'img/material-design-icons/svg-sprite-alert.svg', 24)
      .iconSet('av', 'img/material-design-icons/svg-sprite-av.svg', 24)
      .iconSet(
        'communication',
        'img/material-design-icons/svg-sprite-communication.svg',
        24
      )
      .iconSet(
        'content',
        'img/material-design-icons/svg-sprite-content.svg',
        24
      )
      .iconSet('device', 'img/material-design-icons/svg-sprite-device.svg', 24)
      .iconSet('editor', 'img/material-design-icons/svg-sprite-editor.svg', 24)
      .iconSet('file', 'img/material-design-icons/svg-sprite-file.svg', 24)
      .iconSet(
        'hardware',
        'img/material-design-icons/svg-sprite-hardware.svg',
        24
      )
      .iconSet('image', 'img/material-design-icons/svg-sprite-image.svg', 24)
      .iconSet('maps', 'img/material-design-icons/svg-sprite-maps.svg', 24)
      .iconSet(
        'navigation',
        'img/material-design-icons/svg-sprite-navigation.svg',
        24
      )
      .iconSet(
        'notification',
        'img/material-design-icons/svg-sprite-notification.svg',
        24
      )
      .iconSet('social', 'img/material-design-icons/svg-sprite-social.svg', 24)
      .iconSet('toggle', 'img/material-design-icons/svg-sprite-toggle.svg', 24)
      //.iconSet('cars', 'img/material-design-icons/taxi.svg', 24)

      // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
      .iconSet(
        'avatars',
        'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg',
        24
      )
      .defaultIconSet('img/material-design-icons/svg-sprite-action.svg', 24);
  }]);
