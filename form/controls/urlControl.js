window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document'], function (controls, objectHelper, documentHelper) {
    'use strict';

    controls.createUrlControl = function (options) {
        var priv, obj;

        priv = {
            valueControl: options.valueContent.getElementsByTagName('input')[0],
            descriptionControl: options.valueContent.getElementsByTagName('input')[1]
        };

        obj = objectHelper.mixin(controls.createBaseControl(options), {
            getName: function () {
                return 'form.controls.urlControl';
            },
            init: function () {
                [priv.valueControl, priv.descriptionControl].forEach(function (oneControl) {
                    documentHelper.addEvent(oneControl, 'change', function (e) {
                        obj.trigger('change', { domEvent: e });
                    });
                });
            },
            setValue: function (value) {
                if (typeof value == 'object') {
                    priv.valueControl.value = value.url;
                    priv.descriptionControl.value = value.description;
                } else if (typeof value == 'string') {
                    priv.valueControl.value = value;
                } else {
                    throw new Error('value is not valid');
                }
            },
            getValue: function () {
                return {
                    url: priv.valueContent.value,
                    description: priv.descriptionControl.value
                };
            },
            toggleAvailability: function (isAvailable) {
                [priv.valueControl, priv.descriptionControl].forEach(function (oneControl) {
                    documentHelper.toggleAttribute(oneControl, { name: 'disabled', value: 'disabled' }, !isAvailable);
                });
            }
        });

        return obj;
    };

});