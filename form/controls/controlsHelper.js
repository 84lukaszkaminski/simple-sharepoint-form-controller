window.simpleSharePointFormController.create('form.controlsHelper', [], function (controlsHelper) {
    'use strict';

    controlsHelper.allowCustomValue = function (inputs) {
        return !!(inputs.length > 0 && inputs[inputs.length - 1].getAttribute('type') == 'text');
    };

});