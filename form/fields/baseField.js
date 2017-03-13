window.simpleSharePointFormController.create('form.fields', ['base', 'utils.object', 'utils.document'],
    function (fields, base, objectHelper, documentHelper) {
        'use strict';

        fields.createBaseField = function (options) {
            var priv, obj;

            priv = {
                availabilityEvaluator: function () { return true; },
                visibilityEvaluator: function () { return true; }
            };

            obj = objectHelper.mixin(base.createEventsObject(), {
                _init: function () {
                    options.control.init();
                    options.control.on('change', function (e) {
                        obj.trigger('change', e);
                    });
                },
                getName: function () {
                    return 'form.fields.baseField';
                },
                getInternalName: function () {
                    return options.row.getFieldInternalName();
                },
                getTitle: function () {
                    return options.row.getFieldName();
                },
                getFieldType: function () {
                    return options.row.getFieldType();
                },
                setLabel: function (label) {
                    options.label.setLabel(label);
                },
                setValue: function (value) {
                    options.control.setValue(value);
                },
                getValue: function () {
                    return options.control.getValue();
                },
                show: function () {
                    documentHelper.toggleClass(options.row.getRow(), 'simple-sp-form-hidden', false);
                },
                hide: function () {
                    documentHelper.toggleClass(options.row.getRow(), 'simple-sp-form-hidden', true);
                },
                enable: function () {
                    options.control.toggleAvailability(true);
                },
                disable: function () {
                    options.control.toggleAvailability(false);
                },
                addClass: function(cssClass) {
                    documentHelper.addClass(options.row.getRow(), cssClass);
                },
                removeClass: function(cssClass) {
                    documentHelper.removeClass(options.row.getRow(), cssClass);
                }
            });

            return obj;
        };
    });