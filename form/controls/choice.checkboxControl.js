window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'utils.array'],
    function (controls, objectHelper, documentHelper, arrayHelper) {
        'use strict';

        controls.createCheckboxChoiceControl = function (options) {
            var priv, obj;
            priv = {
                items: null
            };

            obj = objectHelper.mixin(controls.createBaseControl(), {
                getName: function () {
                    return 'form.controls.checkboxChoiceControl';
                },
                init: function () {
                    priv.items = documentHelper.nodeListToArray(options.inputs).map(function (oneInput) {
                        return oneInput.nextSibling.innerText;
                    });
                    documentHelper.nodeListToArray(options.inputs).map(function (oneInput) {
                        documentHelper.addEvent(oneInput, 'change', function () {
                            obj.trigger('change');
                        });
                    });
                },
                getValue: function () {
                    var choices = documentHelper.nodeListToArray(options.inputs).filter(function (oneInput) {
                        return oneInput.checked;
                    }).map(function (oneInput) {
                        return oneInput.nextSibling.innerText;
                    });
                    return choices.length > 0 ? choices : null;
                },
                setValue: function (value) {
                    if (value !== null && !Array.isArray(value)) {
                        throw new Error('multichoice value is not valid');
                    } else {
                        documentHelper.nodeListToArray(options.inputs).filter(function (oneInput) {
                            return !documentHelper.hasClass(oneInput.parentNode, 'simple-sp-form-hidden');
                        }).forEach(function (oneInput) {
                            oneInput.checked = arrayHelper.contains(value || [], oneInput.nextSibling.innerText);
                        });
                        if (!!obj.getValue() && !!value && obj.getValue().toString() != value.toString()) {
                            throw new Error('multichoice value is not valid');
                        }
                    }
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
                        var filter = priv.itemsFilter(oneInput.nextSibling.innerText);
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