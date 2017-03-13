window.simpleSharePointFormController.create('form.fields', ['utils.object'], function (fields, objectHelper) {
    'use strict';

    fields.createChoiceField = function (options) {
        return objectHelper.mixin(fields.createBaseField(options), {
            getName: function () {
                return 'form.fields.choiceField';
            },
            getItems: function () {
                return options.control.getItems();
            },
            setFilter: function (fn, fields) {
                return options.control.setFilter(fn, fields);
            },
            updateFilter: function () {
                options.control.updateFilter();
            }
        });
    };

});