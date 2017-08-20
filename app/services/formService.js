/**
 * Created by Antony Repin on 8/4/2017.
 */

angular.module('AdminApp')
  .factory('formService', [
    'api',

    function (api) {

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

          result = msg.match(/^The ([\w\s]+) field (is required)\.$/);

          if (!!result === false) {
            result = msg.match(/^The selected ([\w\s]+) (is invalid)\.$/);
          }

          if (!!result === false) {
            result = msg.match(/^The ([\w\s]+) has already been (taken)\.$/);
          }

          if (!!result === false) {
            result = msg.match(/^The ([\w\s]+) (must be at least) 8 characters\.$/);
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
        showServerErrors: function (form, messages) {

          var errors = [];
          var field;

          messages.forEach(function (msg, idx) {
            field = this.resolveFieldFromServerMessage(msg);
            if (field === false) {
              throw new Error('Unknown server validation error "' + msg + '"');
            }
            errors.push(Object.assign(field, {text: msg}));
          });

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
        }
      };
    }]
  );
