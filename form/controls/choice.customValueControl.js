window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'base', 'utils.string', 'utils.array'],
    function (controls, objectHelper, documentHelper, base, stringHelper, arrayHelper) {
        'use strict';

        controls.createCustomChoiceControl = function (options) {
            var priv, obj;

            function isChecked() {
                return priv.checkedControl.checked;
            }

            priv = {
                checkedControl: options.inputs[0],
                valueControl: options.inputs[1]                
            };

            obj = objectHelper.mixin(base.createEventsObject(), {
                getName: function () {
                    return 'form.controls.customChoiceControl';
                },
                init: function () {
                    var preClickValue;
                    preClickValue = obj.getValue();
                    options.choiceControl.init();
                    documentHelper.addEvent(priv.valueControl, 'change', function () {
                        obj.trigger('change');
                    });
                    documentHelper.addEvent(priv.checkedControl, 'click', function () {
                        if (preClickValue != obj.getValue()) {
                            obj.trigger('change');
                            preClickValue = obj.getValue();
                        }
                    });
                    options.choiceControl.on('change', function () {
                        obj.trigger('change');
                    });
                },
                setValue: function (value) {
                    var choiceControlValue, customValues;
                    try {
                        options.choiceControl.setValue(value);
                        priv.valueControl.value = '';
                        priv.checkedControl.checked = false;
                    } catch (err) {
                        if (options.isMultiChoice) {
                            choiceControlValue = options.choiceControl.getValue() || [];
                            customValues = value.filter(function (oneCustomValue) {
                                return !arrayHelper.contains(choiceControlValue, oneCustomValue);
                            });
                            value = customValues[customValues.length - 1];
                        }
                        priv.valueControl.value = stringHelper.valueOrEmpty(value);
                        priv.checkedControl.checked = value !== null;
                    }
                },
                getValue: function () {
                    if (isChecked()) {
                        if (options.isMultiChoice) {
                            return (options.choiceControl.getValue() || []).concat(stringHelper.valueOrNull(priv.valueControl.value));
                        } else {
                            return stringHelper.valueOrNull(priv.valueControl.value);
                        }
                    } else {
                        return options.choiceControl.getValue();
                    }
                },
                getItems: function () {
                    return options.choiceControl.getItems();
                },
                setFilter: function (fn, fields) {
                    options.choiceControl.setFilter(fn, fields);
                },
                updateFilter: function () {
                    options.choiceControl.filterItems();
                },
                toggleAvailability: function (isAvailable) {
                    options.inputs.forEach(function (oneInput) {
                        documentHelper.toggleAttribute(oneInput, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    });
                    options.choiceControl.toggleAvailability(isAvailable);
                }
            });

            return obj;
        };

    });