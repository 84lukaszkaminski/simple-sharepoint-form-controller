window.simpleSharePointFormController.create('utils.array', [], function (arrayHelper) {
    'use strict';

    arrayHelper.remove = function (arr, item) {
        var index = arr.indexOf(item);
        if (index !== -1) {
            arr.slice(index, 1);
            arrayHelper.remove(arr, item);
        }
    };

    arrayHelper.contains = function (arr, item) {
        return arr.indexOf(item) !== -1;
    };

    arrayHelper.containsAny = function (arr, items) {
        return items.some(function (oneItem) {
            return arrayHelper.contains(arr, oneItem);
        });
    };

    arrayHelper.singleOrNull = function (arr, fn) {
        var items = arr.filter(fn);
        if (items.length === 0) {
            return null;
        } else if (items.length === 1) {
            return items[0];
        } else {
            throw new Error('array contains more than one item');
        }
    };

});