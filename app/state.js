/**
 * Created by Antony Repin on 30.04.2017.
 */

'use strict';

AdminApp.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider,
            $urlRouterProvider) {

    $urlRouterProvider.when("/", "/login");
    $urlRouterProvider.otherwise("/under-construction");

    const pages = {
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
      "customers": {
        url: "/customers",
        controller: "OrdersController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Customers Management', message: "Under Construction"},
      },
      "orders": {
        url: "/orders",
        controller: "CustomersController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Customers Management', message: "Under Construction"},
      },
      "trips": {
        url: "/trips",
        controller: "TripsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Trips Management', message: "Under Construction"},
      },
      "shipments": {
        url: "/shipments",
        controller: "ShipmentsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Shipments Management', message: "Under Construction"},
      },
      "cities": {
        url: "/cities",
        controller: "CitiesController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Cities Management', message: "Under Construction"},
      },
      "admins": {
        url: "/administrators",
        controller: "AdminsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Administrators Management', message: "Under Construction"},
      },
      "audit": {
        url: "/audit",
        controller: "AuditController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Audits', message: "Under Construction"},
      },
      "payments": {
        url: "/payments",
        controller: "PaymentsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Payments Management', message: "Under Construction"},
      },
      "reports": {
        url: "/reports",
        controller: "ReportsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Reports', message: "Under Construction"},
      },
      "notifications": {
        url: "/notifications",
        controller: "NotificationsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Notifications', message: "Under Construction"},
      },
      "settings": {
        url: "/settings",
        controller: "SettingsController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'System Settings', message: "Under Construction"},
      },
    };

    /**
     * Add API states to app
     */
    angular.forEach(pages, function (props, alias) {
      $stateProvider.state(alias, Object.assign({resolve: {}}, props));
    });

  }]);
