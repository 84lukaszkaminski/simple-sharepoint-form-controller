window.simpleSharePointFormController.create('utils.object', [], function (objectHelper) {
    'use strict';

    objectHelper.mixin = function (receiver, supplier) {
        Object.keys(supplier).forEach(function (oneKey) {
            if (receiver[oneKey] && typeof receiver[oneKey] == 'object' && typeof supplier[oneKey] == 'object') {
                objectHelper.mixin(receiver[oneKey], supplier[oneKey]);
            } else {
                receiver[oneKey] = supplier[oneKey];
            }
        });
        return receiver;
    };

    objectHelper.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    objectHelper.isNumberOrNull = function (n) {
        return n === null || objectHelper.isNumber(n);
    };

});