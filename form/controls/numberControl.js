window.simpleSharePointFormController.create('form.controls', ['utils.object'], function (controls, objectHelper) {
    'use strict';

    controls.createNumberControl = function (options) {
        var priv;

        priv = {
            valueControl: options.valueContent.getElementsByTagName('input')[0]
        };

        return objectHelper.mixin(controls.createTextControl(options), {
            getName: function () {
                return 'form.controls.numberControl';
            },
            setValue: function (value) {
                if (!objectHelper.isNumberOrNull(value)) {
                    throw new Error('value is not a number');
                }
                priv.valueControl.value = value === null ? null : +value;
            },
            getValue: function () {
                var value = priv.valueControl.value;
                return value === '' ? null : +value;
            }
        });
    };

});