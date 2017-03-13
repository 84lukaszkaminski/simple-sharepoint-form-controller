window.simpleSharePointFormController.create('form', ['utils.string'], function (form, stringHelper) {
    'use strict';

    form.createFieldLabel = function (options) {
        var priv;

        priv = {
            labelNode: options.labelContent.getElementsByTagName('nobr')[0]
        };

        return {
            setLabel: function (label) {
                var requirementSign = priv.labelNode.innerHTML.match(/<span.+?class="ms-accentText".+?span>/);
                requirementSign = requirementSign ? requirementSign[0] : '';
                priv.labelNode.innerHTML = stringHelper.format('{0}{1}', label, requirementSign);
            }
        };
    };

});