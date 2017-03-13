window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document', 'utils.string'],
    function (controls, objectHelper, documentHelper, stringHelper) {
        'use strict';

        controls.createSelectChoiceControl = function (options) {
            var priv, obj;

            function filterItems() {
                var valuableOptions, beforeValue;
                beforeValue = options.select.value;
                valuableOptions = priv.filteredItems;
                priv.filteredItems = [];
                documentHelper.nodeListToArray(options.select.options).forEach(function (oneOption) {
                    valuableOptions.push(options.select.removeChild(oneOption));
                });
                valuableOptions.sort(function (a, b) {
                    return a.order == b.order ? 0 : a.order < b.order ? -1 : 1;
                }).forEach(function (oneOption) {
                    if (priv.itemsFilter(oneOption.value)) {
                        options.select.appendChild(oneOption);
                    } else {
                        priv.filteredItems.push(oneOption);
                    }
                });
                options.select.value = beforeValue;
                if (options.select.value != beforeValue) {
                    options.select.selectedIndex = 0;
                }
            }

            priv = {
                items: null,
                itemsFilter: function () { return true; },
                filteredItems: []
            };

            obj = objectHelper.mixin(controls.createBaseControl(), {
                getName: function () {
                    return 'form.controls.selectChoiceControl';
                },
                init: function () {
                    var preClickValue;
                    documentHelper.nodeListToArray(options.select.options).forEach(function (oneOption, index) {
                        oneOption.order = index;
                    });
                    priv.items = documentHelper.nodeListToArray(options.select.options).map(function (oneOption) {
                        return oneOption.value;
                    });
                    documentHelper.addEvent(options.select, 'change', function () {
                        obj.trigger('change');
                    });
                    if (options.checkChoice) {
                        preClickValue = obj.getValue();
                        documentHelper.addEvent(options.checkChoice, 'click', function () {
                            if (preClickValue != obj.getValue()) {
                                obj.trigger('change');
                                preClickValue = obj.getValue();
                            }
                        });
                    }
                },
                setValue: function (value) {
                    if (value === null) {
                        options.select.selectedIndex = 0;
                    } else {
                        options.select.value = stringHelper.valueOrEmpty(value);
                        if (options.select.value !== '' && options.checkChoice) {
                            options.checkChoice.checked = true;
                        }
                        if (options.select.value != stringHelper.valueOrEmpty(value)) {
                            options.select.selectedIndex = 0;
                            throw new Error('choice value is invalid');
                        }
                    }
                },
                getValue: function () {
                    return stringHelper.valueOrNull(options.select.value);
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
                    filterItems();
                },
                toggleAvailability: function (isAvailable) {  
                    documentHelper.toggleAttribute(options.select, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    if (options.checkChoice) {
                        documentHelper.toggleAttribute(options.checkChoice, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    }
                }
            });

            return obj;
        };

    });