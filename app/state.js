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
    $urlRouterProvider.otherwise("login");

    /**
     * API configuration
     * @type {}
     */
    var pages = {
      login: {
        url: "/login",
        controller: "LoginController",
        templateUrl: "views/login.html",
        data: {pageTitle: 'Log In'},
      },
      dashboard: {
        url: "/dashboard",
        controller: "DashboardController",
        templateUrl: "views/dashboard.html",
        data: {pageTitle: 'Dashboard'},
      },
    };

    /**
     * Add API states to app
     */
    angular.forEach(pages, function (props, alias) {
      $stateProvider.state(alias, Object.assign({resolve: {}}, props));
    });

  }]);
