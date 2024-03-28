/**
 * Created by Antony Repin on 8/9/2017.
 */

'use strict';

angular.module('AdminApp')
  .factory('uiGridService',
    [
      'settings',

      function (settings) {

        return {
          /**
           * Update row of the ui-grid
           *
           * @param rowEntity {Object}
           * @param gridData {Object}
           * @returns {Object}
           */
          updateRow: function (rowEntity, gridData) {
            angular.forEach(gridData, function(gridRow, rowIdx){
              if (gridRow.$$hashKey === rowEntity.entity.$$hashKey){
                gridRow.attributes = rowEntity.entity.attributes;
              }
            });
            return gridData;
          },
        };
      }]
  );
