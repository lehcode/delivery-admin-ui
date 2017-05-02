/**
 * Created by Antony Repin on 30.04.2017.
 */

/* Init global settings and run the app */
AdminApp.run(['$rootScope',"settings", "$state","$location",
  function ($rootScope, settings, $state,$location ) {

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    if(!localStorage.getItem('token')){
      $location.path('/');
    }
  }
]);
