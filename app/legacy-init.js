(function() {
  // Initialize the AngularJS app with all dependencies
  const adminApp = angular.module('AdminApp', [
    'ui.router',
    'ngSanitize',
    'ngResource',
    'ngRoute',
    'ngMaterial',
    'ngMdIcons',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.treeView',
    'ui.grid.resizeColumns',
    'ui.grid.selection',
    'ui.grid.expandable',
    'ui.grid.pinning',
    'ui.grid.cellNav',
    'LocalStorageModule',
    'ngSlimScroll',
    'lfNgMdFileInput'
  ]);

  // Make it globally available
  window.AdminApp = adminApp;
})();




