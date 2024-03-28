/**
 * Created by Antony Repin on 8/4/2017.
 */

angular.module('AdminApp')
  .factory('formService', [
    'api',
    '$q',

    function (api,
              $q) {

      return {
        /**
         *
         * @param el {Object}
         */
        setDirtyTouched: function (el) {
          el.$setDirty();
          el.$setTouched();
        },
        /**
         * Resolve form field name from server response
         *
         * @param msg {String}
         * @returns {{type: {String}, field: {String}}}
         */
        resolveFieldFromServerMessage: function (msg) {

          var result;

          result = msg.match(/^The ([\w\s]+) field (is required)/);

          if (!!result === false) {
            result = msg.match(/^The selected ([\w\s]+) (is invalid)/);
          }

          if (!!result === false) {
            result = msg.match(/^The ([\w\s]+) has already been (taken)/);
          }

          if (!!result === false) {
            result = msg.match(/^The ([\w\s]+) (must be at least) \d+ characters/);
          }

          if (!!result === false) {
            console.error('Unknown validation error: "' + msg + '"');
          }

          if (result instanceof Array) {
            return {type: result[2], field: result[1].replace(' ', '_'),};
          }

          return false;

        },
        /**
         * Reset form and custom set form errors
         *
         * @param form
         */
        resetForm: function (form) {
          form.$setPristine();
          form.$setUntouched();
        },
        /**
         *
         * @param form {Object}
         * @param messages {Array}
         */
        showServerErrors: function (/* Object */ form, /* Array */ messages) {

          var errors = [];
          var field;

          messages.forEach(function (msg) {
            field = this.resolveFieldFromServerMessage(msg);
            if (field === false) {
              console.error('Unknown server validation error "' + msg + '"');
            }
            errors.push(Object.assign(field, {text: msg}));
          }.bind(this));

          errors.forEach(function (err) {

            var el = form[err.field];

            switch (err.type) {
              case 'is required':
                el.$setValidity('required', false);
                break;
              case 'is invalid':
                el.$setValidity('adminRole', false);
                break;
              case 'taken':
                el.$setValidity('unique', false);
                break;
              case 'must be at least':
                el.$setValidity('minlength', false);
                break;
            }

            this.setDirtyTouched(el);

          });
        },
        getShipmentSizes: function () {
          return $q(function (resolve, reject) {
            api.get('shipment/sizes')
              .then(function (response) {
               api.processResponse(response, resolve);
              });
          });
        },
        getShipmentCategories: function () {
          return $q(function (resolve, reject) {
            api.get('shipment/categories')
              .then(function (response) {
                api.processResponse(response, resolve);
              });
          });
        },
        getCities: function () {
          return $q(function (resolve, reject) {
            api.get('cities')
              .then(function (response) {
                api.processResponse(response, resolve);
              });
          });
        },
        checkPhoneExistence: function(phone){
          return $q(function(resolve, reject){
            api.get('user/phone/exists/' + phone)
              .then(function (response) {
                api.processResponse(response, resolve);
              });
          });
        }
      };
    }]
  );
