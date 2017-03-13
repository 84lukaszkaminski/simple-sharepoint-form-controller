/* jshint unused:false */
window.simpleSharePointFormController.create('form.controls', ['base', 'utils.object'], function (controls, base, objectHelper) {
    'use strict';

    controls.createBaseControl = function (options) {
        return objectHelper.mixin(base.createEventsObject(), {
            getName: function () {
                return 'form.controls.baseControl';
            },
            init: function () {
                throw new Error('method "init" is not implemented yet');
            },
            setValue: function (value) {
                throw new Error('method "setValue" is not implemented yet');
            },
            getValue: function () {
                throw new Error('method "getValue" is not implemented yet');
            },
            toggleAvailability: function (isAvailable) {
                throw new Error('method "toggleAvailability" is not implemented yet');
            }
        });
    };

});