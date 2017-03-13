window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'form.controlsHelper'],
    function (controls, objectHelper, documentHelper, controlsHelper) {
        'use strict';
      
        controls.createChoiceMultiControl = function (options) {
            var priv, obj;

            priv = {
                choiceControl: null
            };

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.choiceMultiControl';
                },
                init: function () {
                    var items, customChoiceItems, choiceControl;
                    items = documentHelper.nodeListToArray(options.valueContent.getElementsByTagName('input'));
                    if (controlsHelper.allowCustomValue(items)) {
                        customChoiceItems = items.splice(-2);
                    }
                    choiceControl = controls.createCheckboxChoiceControl({ inputs: items });
                    priv.choiceControl = !!customChoiceItems
                        ? controls.createCustomChoiceControl({ inputs: customChoiceItems, choiceControl: choiceControl, isMultiChoice: true })
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