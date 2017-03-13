window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'form.controlsHelper'],
    function (controls, objectHelper, documentHelper, controlsHelper) {
        'use strict';

        controls.createChoiceControl = function (options) {
            var priv, obj;

            priv = {
                choiceControl: null
            };

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.choiceControl';
                },
                init: function () {
                    var select, inputs, choiceControl;
                    select = options.valueContent.getElementsByTagName('select')[0];
                    inputs = documentHelper.nodeListToArray(options.valueContent.getElementsByTagName('input'));
                    choiceControl = !!select
                        ? controls.createSelectChoiceControl({ select: select, checkChoice: inputs[0] || null })
                        : controls.createRadioButtonChoiceControl({ inputs: inputs });
                    priv.choiceControl = controlsHelper.allowCustomValue(inputs)
                        ? controls.createCustomChoiceControl({ inputs: inputs.splice(-2), choiceControl: choiceControl })
                        : choiceControl;
                    priv.choiceControl.init();
                    priv.choiceControl.on('change', function () {
                        obj.trigger('change');
                    });
                },
                setValue: function (value) {
                    priv.choiceControl.setValue(value);
                },
                getValue: function () {
                    return priv.choiceControl.getValue();
                },
                getItems: function () {
                    return priv.choiceControl.getItems();
                },
                setFilter: function (fn, fields) {
                    priv.choiceControl.setFilter(fn, fields);
                },
                updateFilter: function () {
                    priv.choiceControl.filterItems();
                },
                toggleAvailability: function (isAvailable) {
                    priv.choiceControl.toggleAvailability(isAvailable);
                }
            });

            return obj;
        };

    });