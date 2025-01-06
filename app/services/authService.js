/**
 * Created by Antony Repin on 8/4/2017.
 */

export const authServiceFactory = [
  'settings',
  '$q',

  function (settings, $q) {
    const service = {};

    service.getAuthData = async function() {
      const token = localStorageService.get('token');
      if (!token) {
        return null;
      }

      try {
        const response = await $http({
          method: 'POST',
          url: `${settings.apiHost}/${settings.apiRoot}/user/me`,
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200 && response.data.status === 'success') {
          return response.data.data[0];
        }
        return null;
      } catch (error) {
        console.error('Auth data fetch error:', error);
        return null;
      }
    };

    return service;
  },
];

// Register with AngularJS module
const AdminApp = angular
  .module('AdminApp')
  .factory('authService', authServiceFactory);

export default AdminApp;
