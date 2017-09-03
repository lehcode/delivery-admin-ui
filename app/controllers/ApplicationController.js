/**
 * Created by Antony Repin on 02.05.2017.
 */

angular.module('AdminApp')
  .controller('ApplicationController',
    [
      '$scope',
      '$rootScope',
      '$mdDialog',
      '$state',
      '$q',
      '$http',
      'settings',
      'localStorageService',
      '$location',
      '$mdSidenav',
      '$mdPanel',
      'carrierService',
      'customerService',
      'adminService',

      function ($scope,
                $rootScope,
                $mdDialog,
                $state,
                $q,
                $http,
                settings,
                localStorageService,
                $location,
                $mdSidenav,
                $mdPanel,
                carrierService,
                customerService,
                adminService) {

        $scope.state = $state;

        /**
         * AJAX flag
         *
         * @type {boolean}
         */
        $scope.loading = true;

        // $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        //   debugger;
        // });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
          console.error(error);
        });

        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
        //   $scope.loading = false;
        // });

        /**
         * Get navigation items for user per his permissions
         */
        $scope.getNavigation = function () {

          var req = {
            method: 'GET',
            url: settings.apiHost + '/api/admin/' + settings.apiVersion + '/user/navigation',
            data: null,
            headers: {
              "content-type": "application/json",
              "authorization": "Bearer " + localStorageService.get('token')
            }
          };

          $http(req)
            .then(function successCallback(response) {
              if (response.data.status == 'success') {
                try {
                  $scope.navigation = response.data.data;
                  //$location.path('/dashboard');
                } catch (err) {
                  console.error(err);
                }
              }
            }, function errorCallback(response) {
              console.warn(response.data);
              switch (response.status) {
                case 500:
                  console.error(response);
                  return;
              }

              try {
                $location.path('/login');
              } catch (err) {
                console.error(err);
              }

            });
        };

        /**
         * Get user data and set $scope variable
         */
        $rootScope.setUserData = function () {
          $scope.authUser = JSON.parse(localStorageService.get('user'));
        };

        /**
         * Redirect to dashboard on refresh
         */
        $rootScope.redirectIfAuthenticated = function () {
          if (!!localStorageService.get('user') !== true) {
            $location.path('/login');
          } else {
            $rootScope.setUserData();
            $scope.getNavigation();
            //$location.path('/dashboard');
          }
        };
        $rootScope.redirectIfAuthenticated();

        /**
         * Set user data
         */
        $scope.token = localStorageService.get('token');

        /**
         * @type {Array}
         */
        $scope.alerts = [];

        /**
         * @type {Array}
         */
        $scope.pageAlerts = [];

        /**
         * Form alerts array
         * @type {Array}
         */
        $scope.formAlerts = [];

        /**
         * Set application language
         * @type {string}
         */
        $scope.lang = localStorageService.get('lang') == null ? 'EN' : localStorageService.get('lang');

        /**
         * Globally available API version variable
         * @type {string}
         */
        $scope.apiVersion = $rootScope.settings.apiVersion;
        console.info("API version: %s", $scope.apiVersion);

        /**
         * Globally available application version variable
         * @type {string}
         */
        $scope.appVersion = $rootScope.settings.appVersion;
        console.info("Application version: %s", $scope.appVersion);

        /**
         * API Root
         * @type {string}
         */
        $scope.apiRoot = 'api/admin/' + $rootScope.settings.apiVersion;

        /**
         *
         * @type {string}
         */
        $scope.country = settings.defaultCountry;

        $scope.$on('$viewContentLoaded', function () {

          var token = localStorageService.get('token');
          if (!!token === false) {
            $location.path('/login');
          }

          $scope.moreMenu = {
            name: 'more',
            items: [
              'Account',
              'Sign Out'
            ]
          };

        });


        /**
         *
         * @param angularForm Object
         * @returns {Array}
         */
        $rootScope.getFormErrors = function (angularForm) {
          $scope.alerts = [];
          var messages = [];
          angular.forEach(angularForm.$error, function (el, cond) {
            console.warn("Form is invalid", angularForm);
            el.forEach(function (element) {
              if (element.$name === "")
                throw new Error("Element 'name' attribute not defined!");
              else {
                messages.push(element.$name + ' is ' + cond);
              }
            });
          });
          return messages;
        };

        /**
         * Add Bootstrap alert
         * @param msg String
         * @param type String
         */
        $rootScope.addAlert = function (msg, type) {
          type = (typeof type !== 'undefined') ? type : 'warning';
          msg = (typeof msg !== 'undefined') ? msg : '';
          $scope.alerts.push({type: type, msg: msg});
        };

        /**
         * Close alert by index
         * @param index Number
         */
        $rootScope.closeAlert = function (index) {
          $scope.alerts.splice(index, 1);
        };

        /**
         * Get validation errors
         * @param response Object
         */
        $rootScope.getResponseErrors = function (response) {
          if (response.data.hasOwnProperty('message')) {
            var m = response.data.message;
            $scope.alerts = [];
            response.data.message = JSON.parse(m);
            angular.forEach(response.data.message, function (msg) {
              angular.forEach(msg, function (err, prop) {
                $rootScope.addAlert(prop + ": " + err);
              });
            });
          }
        };

        /**
         * Get auth token
         */
        $rootScope.getToken = function () {
          //console.debug("Token: ", localStorageService.get('token'));
          if (!!localStorageService.get('token') === true) {
            return localStorageService.get('token');
          }
          return false;
        };


        /**
         * Close alert
         * @param index
         */
        $rootScope.closePageAlert = function (index, scope) {
          scope.pageAlerts.splice(index, 1);
          return scope;
        };

        /**
         * Process "getNavigation" call from child scopes
         */
        $scope.$on("getNavigation", function () {
          if (!!$scope.navigation === false) {
            $scope.getNavigation();
          }
        });

        /**
         * Toggle sidebar navigation
         */
        $scope.toggleSidenav = function (menuId) {
          var el = $('.slimScrollDiv');
          if (el.hasClass('collapse')) {
            el.removeClass('collapse');
          } else {
            el.addClass('collapse');
          }
          $mdSidenav(menuId).toggle();
        };

        /**
         *
         * @param $event
         * @param menu
         */
        $scope.showToolbarMenu = function ($event, menu) {
          debugger;
          var template = '' +
            '<div class="menu-panel" md-whiteframe="4">' +
            '  <div class="menu-content">' +
            '    <div class="menu-item" ng-repeat="item in ctrl.items">' +
            '      <button class="md-button">' +
            '        <span>{{item.name}}</span>' +
            '      </button>' +
            '    </div>' +
            '    <md-divider></md-divider>' +
            '    <div class="menu-item">' +
            '      <button class="md-button" ng-click="closeMenu()">' +
            '        <span>Close Menu</span>' +
            '      </button>' +
            '    </div>' +
            '  </div>' +
            '</div>';

          var position = $mdPanel.newPanelPosition()
            .relativeTo($event.srcElement)
            .addPanelPosition(
              $mdPanel.xPosition.ALIGN_START,
              $mdPanel.yPosition.BELOW
            );

          var config = {
            id: 'toolbar_' + menu.name,
            attachTo: angular.element(document.body),
            controller: 'ApplicationController',
            controllerAs: 'ctrl',
            template: template,
            position: position,
            panelClass: 'menu-panel-container',
            locals: {
              items: menu.items
            },
            openFrom: $event,
            focusOnOpen: false,
            zIndex: 100,
            propagateContainerEvents: true,
            groupName: ['toolbar', 'menus']
          };

          try {
            $mdPanel.open(config);
          } catch (err) {
            console.error(err);
          }
        };

        $scope.closeMenu = function () {
          try {
            mdPanelRef && mdPanelRef.close();
          } catch (err) {
            console.error(err);
          }

        };

        /**
         *
         * @type {string}
         */
        var menuTemplate = '' +
          '<div class="menu-panel" md-whiteframe="4">' +
          '  <div class="menu-content">' +
          '    <div class="menu-item" ng-repeat="item in ctrl.items">' +
          '      <button class="md-button">' +
          '        <span>{{item}}</span>' +
          '      </button>' +
          '    </div>' +
          '    <md-divider></md-divider>' +
          '    <div class="menu-item">' +
          '      <button class="md-button" ng-click="ctrl.closeMenu()">' +
          '        <span>Close Menu</span>' +
          '      </button>' +
          '    </div>' +
          '  </div>' +
          '</div>';

        /**
         * Open page toolbar menu
         *
         * @param $event
         * @param menu
         */
        $scope.showToolbarMenu = function ($event, menu) {
          debugger;

          var template = menuTemplate;

          var position = $mdPanel.newPanelPosition()
            .relativeTo($event.srcElement)
            .addPanelPosition(
              $mdPanel.xPosition.ALIGN_START,
              $mdPanel.yPosition.BELOW
            );

          var config = {
            id: 'toolbar_' + menu.name,
            attachTo: angular.element(document.getElementById('carriers')),
            controller: PanelMenuCtrl,
            controllerAs: 'ctrl',
            template: template,
            position: position,
            panelClass: 'menu-panel-container',
            locals: {
              items: menu.items
            },
            openFrom: $event,
            focusOnOpen: false,
            zIndex: 100,
            propagateContainerEvents: true,
            groupName: ['toolbar', 'menus']
          };

          $mdPanel.open(config);

        };

        /**
         *
         * @param mdPanelRef
         * @constructor
         */
        function PanelMenuCtrl(mdPanelRef) {
          $scope.closeMenu = function () {
            mdPanelRef && mdPanelRef.close();
          }
        }

        /**
         *
         * @param action String
         * @param element String
         */
        $rootScope.showDialog = function (action, aclObjectName) {
          debugger;
          var elId = "#" + action.ucfirst() + aclObjectName.ucfirst() + 'Container';
          $mdDialog.show({
            contentElement: document.querySelector(elId),
            parent: angular.element(document.body)
          });
        };

        /**
         * Close dialog pane
         */
        $rootScope.hideDialog = function () {
          $mdDialog.hide();
        };

        $rootScope.phoneRegex = '^\+';

        /**
         * Redirect to entity details page
         *
         * @param e {MouseEvent}
         * @param entityName {String}
         * @param entity {Object}
         */
        $scope.openDetailsPage = function (e, entityName, entity) {
          var props = {};
          props[entityName] = entity;
          $state.go(entityName + '/details', props);
        };

        /**
         *
         * @type {string}
         */
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQCGZb0TUJaUbzsOko_SMaBVcIYBmp-0U";

        var now = new Date();

        /**
         * Minimal birthday date
         *
         * @type {Date}
         */
        $scope.minBirthdayDate = new Date(now.getFullYear() - 99, now.getMonth(), now.getDate());

        /**
         * Maximal birthday date
         *
         * @type {Date}
         */
        $scope.maxBirthdayDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());

        /**
         * Minimal departure date
         *
         * @type {Date}
         */
        $scope.minDepartureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        /**
         * maximal departure date
         *
         * @type {Date}
         */
        $scope.maxDepartureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, now.getHours(), now.getMinutes());
        $scope.departure_time = moment(now).format('HH:mm');

        /**
         * Set $scope.processing value
         */
        $scope.$on('ajaxEvent', function (event, value) {
          $scope.processing = $scope.loading = value;
          $scope.$broadcast('processing', false);
        });

      }
    ]
  );

