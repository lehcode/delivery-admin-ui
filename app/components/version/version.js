'use strict';

angular.module('AdminApp.version', [
  'AdminApp.version.interpolate-filter',
  'AdminApp.version.version-directive'
]).value('version', '0.0.1');
