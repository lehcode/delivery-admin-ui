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
        controller: "CarriersGridController",
        templateUrl: "views/Carrier/grid.html",
        data: {
          pageTitle: 'Carriers Management',
          createRoute: 'carrier/create',
          entityName: 'Carrier',
        },
      },
      "carrier/details": {
        url: "/carrier/details",
        controller: "CarrierDetailsController",
        templateUrl: "views/Carrier/details.html",
        data: {
          pageTitle: 'Carrier Details',
          createRoute: 'carrier/create',
          entityName: 'Carrier',
        },
      },
      "carrier/edit": {
        url: "/carrier/edit",
        controller: "EditCarrierController",
        templateUrl: "views/Carrier/edit.html",
        data: {
          pageTitle: 'Edit Carrier',
          createRoute: 'carrier/create',
          editRoute: 'carrier/edit',
          entityName: 'Carrier',
        },
      },
      "carrier/create": {
        url: "/carrier/create",
        controller: "CreateCarrierController",
        templateUrl: "views/Carrier/edit.html",
        data: {
          pageTitle: 'Add Carrier',
          createRoute: 'carrier/create',
          editRoute: 'carrier/edit',
          entityName: 'Carrier',
        },
      },
      "customers": {
        url: "/customers",
        controller: "CustomersGridController",
        templateUrl: "views/Customer/grid.html",
        data: {
          pageTitle: 'Customers Management',
          createRoute: 'customer/create',
          entityName: 'Customer',
        },
      },
      "customer/create": {
        url: "/customer/create",
        controller: "CreateCustomerController",
        templateUrl: "views/Customer/edit.html",
        data: {
          pageTitle: 'Create Customer',
          entityName: 'Customer',
          action: 'create',
        },
      },
      "customer/edit": {
        url: "/customer/edit",
        controller: "EditCustomerController",
        templateUrl: "views/Customer/edit.html",
        data: {
          pageTitle: 'Edit Customer',
          createRoute: 'customer/create',
          editRoute: 'customer/edit',
          entityName: 'Customer',
          action: 'edit',
        },
      },
      "customer/details": {
        url: "/customer/details",
        controller: "CustomerDetailsController",
        templateUrl: "views/Customer/details.html",
        data: {
          pageTitle: 'Customer Details',
          createRoute: 'customer/create',
          entityName: 'Customer',
        },
      },
      "orders": {
        url: "/orders",
        controller: "OrdersGridController",
        templateUrl: "views/Order/grid.html",
        data: {
          pageTitle: 'Orders Management',
          createRoute: 'order/create',
          entityName: 'Order',
        },
      },
      "order/create": {
        url: "/order/create",
        controller: "CreateOrderController",
        templateUrl: "views/Order/create.html",
        data: {
          pageTitle: 'Create Order',
          entityName: 'Order',
          action: 'create',
        },
      },
      "order/details": {
        url: "/order/details",
        controller: "OrderDetailsController",
        templateUrl: "views/Order/details.html",
        data: {
          pageTitle: 'Order Details',
          entityName: 'Order',
          createRoute: 'order/create',
        },
      },
      "trips": {
        url: "/trips",
        controller: "TripsGridController",
        templateUrl: "views/Trip/grid.html",
        data: {
          pageTitle: 'Trips Management',
          createRoute: 'trip/create',
          entityName: 'Trip',
        },
      },
      "trip/create": {
        url: "/trip/create",
        controller: "CreateTripController",
        templateUrl: "views/Trip/create.html",
        data: {
          pageTitle: 'Create Trip',
          createRoute: 'trip/create',
          entityName: 'Trip',
          //action: 'create',
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
          createRoute: 'trip/create',
          entityName: 'Trip',
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
        url: "/admins",
        controller: "AdminsGridController",
        templateUrl: "views/Admin/grid.html",
        data: {
          pageTitle: 'Administrators Management',
          entityName: 'Administrator',
          createRoute: 'administrator/create',
        },
      },
      "administrator/details": {
        url: "/admin/details",
        controller: "AdminDetailsController",
        templateUrl: "views/Admin/details.html",
        data: {
          pageTitle: 'Account Details',
          entityName: 'Administrator',
          createRoute: 'administrator/create',
        },
      },
      "administrator/create": {
        url: "/admin/create",
        controller: "CreateAdminController",
        templateUrl: "views/Admin/create.html",
        data: {
          pageTitle: 'Add New Administrator',
          entityName: 'Administrator',
          createRoute: 'administrator/create',
        },
      },
      "administrator/edit": {
        url: "/admin/edit",
        controller: "EditAdminController",
        templateUrl: "views/Admin/edit.html",
        data: {
          pageTitle: 'Edit Administrator',
          entityName: 'Administrator',
          createRoute: 'administrator/create',
        },
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
