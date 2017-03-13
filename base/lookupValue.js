window.simpleSharePointFormController.create('base', [], function (base) {
    'use strict';

    base.createLookupValue = function (id, value) {
        return {
            getId: function () {
                return id;
            },
            getValue: function () {
                return value;
            }
        };
    };

});