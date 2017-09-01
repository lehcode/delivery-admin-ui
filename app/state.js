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
      "customers": {
        url: "/customers",
        controller: "CustomersController",
        templateUrl: "views/customers.html",
        data: {pageTitle: 'Customers Management', message: ""},
      },
      "orders": {
        url: "/orders",
        controller: "CustomersController",
        templateUrl: "views/default.html",
        data: {pageTitle: 'Customers Management', message: "Under Construction"},
      },
      "trips": {
        url: "/trips",
        controller: "TripsGridController",
        templateUrl: "views/Trip/grid.html",
        data: {pageTitle: 'Trips Management', message: ""},
      },
      "trip/create": {
        url: "/trip/create",
        controller: "CreateTripController",
        templateUrl: "views/Trip/create.html",
        data: {
          pageTitle: 'Create Trip',
          message: "",
          formAction: "create",
        },
      },
      // "trip/edit": {
      //   url: "/trip/edit",
      //   controller: "EditTripController",
      //   templateUrl: "views/Trip/edit.html",
      //   data: {
      //     pageTitle: 'Edit Trip',
      //     message: "",
      //     formAction: "edit",
      //   },
      // },
      "trip/details": {
        url: "/trip/details",
        controller: "TripDetailsController",
        templateUrl: "views/Trip/details.html",
        data: {
          pageTitle: 'Trip Details',
          message: "",
          formAction: "edit",
        },
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
      "administrators": {
        url: "/administrators",
        controller: "AdminsController",
        templateUrl: "views/admins.html",
        data: {pageTitle: 'Administrators Management', message: null},
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
