/**
 * Created by Antony Repin on 30.04.2017.
 */

/* Init global settings and run the app */
AdminApp.run(['$rootScope', 'settings', '$state', '$location', 'localStorageService',
  function ($rootScope, settings, $state, $location, localStorageService) {

    $rootScope.$state = $state;
    $rootScope.$settings = settings;

    console.log(localStorageService.get('token'));

    if (!localStorageService.get('token')) {
      $location.path('/');
    }
  }
]);
