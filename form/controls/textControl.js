window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document'], function (controls, objectHelper, documentHelper) {
    'use strict';

    controls.createTextControl = function (options) {
        var priv, obj;

        priv = {
            valueControl: options.valueContent.getElementsByTagName('input')[0]
        };

        obj = objectHelper.mixin(controls.createBaseControl(options), {
            getName: function () {
                return 'form.controls.textControl';
            },
            init: function () {
                documentHelper.addEvent(priv.valueControl, 'change', function (e) {
                    obj.trigger('change', { domEvent: e });
                });
            },
            setValue: function (value) {
                priv.valueControl.value = value;
            },
            getValue: function () {
                return priv.valueControl.value;
            },
            toggleAvailability: function (isAvailable) {
                documentHelper.toggleAttribute(priv.valueControl, { name: 'disabled', value: 'disabled' }, !isAvailable);
            }
        });

        return obj;
    };

});