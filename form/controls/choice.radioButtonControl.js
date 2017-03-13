window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'utils.string', 'utils.array'],
    function (controls, objectHelper, documentHelper, stringHelper, arrayHelper) {
        'use strict';

        controls.createRadioButtonChoiceControl = function (options) {
            var priv, obj;

            priv = {
                items: null,
                itemsFilter: function () { return { isDisabled: false, isHidden: false }; }
            };

            obj = objectHelper.mixin(controls.createBaseControl(), {
                getName: function () {
                    return 'form.controls.radioButtonChoiceControl';
                },
                init: function () {
                    var preClickValue;
                    preClickValue = obj.getValue();
                    priv.items = documentHelper.nodeListToArray(options.inputs).map(function (oneInput) {
                        return oneInput.value;
                    });
                    documentHelper.nodeListToArray(options.inputs).map(function (oneInput) {
                        documentHelper.addEvent(oneInput, 'change', function () {
                            if (preClickValue != oneInput.value) {
                                obj.trigger('change');
                                preClickValue = oneInput.value;
                            }
                        });
                    });
                },
                setValue: function (value) {
                    var flag;
                    documentHelper.nodeListToArray(options.inputs).filter(function (oneIpnut) {
                        return !documentHelper.hasClass(oneIpnut.parentNode, 'simple-sp-form-hidden');
                    }).forEach(function (oneInput) {
                        oneInput.checked = oneInput.value == stringHelper.valueOrEmpty(value);
                        if (oneInput.checked) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        throw new Error('choice value is invalid');
                    }
                },
                getValue: function () {
                    var choice = arrayHelper.singleOrNull(documentHelper.nodeListToArray(options.inputs), function (oneInput) {
                        return oneInput.checked;
                    });
                    return choice && stringHelper.valueOrNull(choice.value);
                },
                getItems: function () {
                    return priv.items;
                },
                setFilter: function (fn, fields) {
                    priv.itemsFilter = fn;
                    if (fields) {
                        fields.forEach(function (oneField) {
                            oneField.on('change', obj.updateFilter);
                        });
                    }
                    obj.updateFilter();
                },
                updateFilter: function () {
                    documentHelper.nodeListToArray(options.inputs).forEach(function (oneInput) {
                        var filter = priv.itemsFilter(oneInput.value);
                        documentHelper.toggleAttribute(oneInput, { name: 'disabled', value: 'disabled' }, !!filter.isDisabled);                        
                        documentHelper.toggleClass(oneInput.parentNode, 'simple-sp-form-hidden', !!filter.isHidden);
                        if (filter.isHidden) {
                            oneInput.checked = false;
                        }
                    });
                },
                toggleAvailability: function (isAvailable) {
                    options.inputs.forEach(function (oneInput) {
                        documentHelper.toggleAttribute(oneInput, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    });
                }
            });

            return obj;
        };

    });