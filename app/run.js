// run.js
AdminApp.run(['$rootScope', 'settings', '$state', '$location', 'localStorageService',
  function($rootScope, settings, $state, $location, localStorageService) {
    $rootScope.$state = $state;
    $rootScope.$settings = settings;

    console.log("Auth token exists:", !!localStorageService.get('token'));

    if (!localStorageService.get('token')) {
      $location.path('/');
    }

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      localStorage.setItem('__stateName', toState.name);
    });
  }
]);
