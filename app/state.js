/**
 * Created by Antony Repin on 30.04.2017.
 */

'use strict';

AdminApp.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider,
            $urlRouterProvider) {

    /**
     * Redirect on any unmatched url
     */
    $urlRouterProvider.when("/", "/login");
    $urlRouterProvider.otherwise("/under-construction");

    /**
     * API configuration
     * @type {}
     */
    var pages = {
      "login": {
        url: "/login",
        controller: "LoginController",
        templateUrl: "views/login.html",
        data: {pageTitle: 'Log In'},
      },
      "dashboard": {
        url: "/dashboard",
        controller: "DashboardController",
        templateUrl: "views/dashboard.html",
        data: {pageTitle: 'Dashboard'},
      },
      "carriers": {
        url: "/carriers",
        controller: "CarriersController",
        templateUrl: "views/carriers.html",
        data: {pageTitle: 'Carriers Management'},
      },
    };

    /**
     * Add API states to app
     */
    angular.forEach(pages, function (props, alias) {
      $stateProvider.state(alias, Object.assign({resolve: {}}, props));
    });

  }]);
