window.simpleSharePointFormController.create('form.controls', ['utils.object'], function (controls, objectHelper) {
    'use strict';

    controls.createCurrencyControl = function (options) {
        return objectHelper.mixin(controls.createNumberControl(options), {
            getName: function () {
                return 'form.controls.currencyControl';
            },
        });
    };

});