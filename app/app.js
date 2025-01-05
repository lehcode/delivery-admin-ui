'use strict';

/**
 * This code defines an AngularJS module named "AdminApp" and includes various dependencies such as routing,
 * sanitization, resource handling, material design components, and grid functionalities. The module is set
 * up to facilitate a robust admin interface with features for editing, selection, and expandable grids,
 * along with support for local storage and file input.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AdminApp = angular.module("AdminApp", [
  "ui.router",
  "ngSanitize",
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
  'ui.slimscroll',
  'lfNgMdFileInput'
]);

