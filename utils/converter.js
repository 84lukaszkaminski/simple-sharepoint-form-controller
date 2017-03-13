window.simpleSharePointFormController.create('utils.converter', ['utils.array'], function (converter, arrayHelper) {
    'use strict';

    function getItemById(id, items) {
        return arrayHelper.singleOrNull(items, function (oneItem) {
            return oneItem.getId() === id;
        });
    }

    function getItemByValue(value, items) {
        return arrayHelper.singleOrNull(items, function (oneItem) {
            return oneItem.getValue() === value;
        });
    }

    converter.toLookupValue = function (value, items) {
        if (value === null) {
            return null;
        } else if (typeof value == 'number') {
            return getItemById(value, items);
        } else if (typeof value == 'string') {
            return getItemByValue(value, items);
        } else if ('getId' in value) {
            return getItemById(value.getId());
        } else {
            throw new Error('lookup value is not valid');
        }
    };

});