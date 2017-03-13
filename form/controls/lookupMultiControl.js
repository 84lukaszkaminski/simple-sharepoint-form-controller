window.simpleSharePointFormController.create('form.controls', ['utils.object', 'base', 'utils.document', 'utils.array', 'utils.converter', 'utils.string'],
    function (controls, objectHelper, base, documentHelper, arrayHelper, converter, stringHelper) {
        'use strict';

        controls.createLookupMultiControl = function (options) {
            var priv, obj;

            function filterItems() {
                function _filterItems(valueControl) {
                    var valuableOptions;
                    if (valueControl == priv.itemsControl) {
                        valuableOptions = priv.filteredItems;
                        priv.filteredItems = [];
                    } else {
                        valuableOptions = [];
                    }
                    documentHelper.nodeListToArray(valueControl.options).forEach(function (oneOption) {
                        valuableOptions.push(valueControl.removeChild(oneOption));
                    });
                    valuableOptions.sort(function (a, b) {
                        return a.title == b.title ? 0 : a.title < b.title ? -1 : 1;
                    }).forEach(function (oneOption) {
                        if (priv.itemsFilter(base.createLookupValue(+oneOption.value, oneOption.text))) {
                            valueControl.appendChild(oneOption);
                        } else {
                            priv.filteredItems.push(oneOption);
                        }
                    });
                }
                _filterItems(priv.selectionControl);
                _filterItems(priv.itemsControl);
            }

            function initFormControls() {
                var inputs, selects;
                inputs = options.valueContent.getElementsByTagName('input');
                selects = options.valueContent.getElementsByTagName('select');

                priv.hiddenSelection = inputs[0];
                priv.itemsControl = selects[0];
                priv.selectionControl = selects[1];
                priv.addItemButton = inputs[3];
                priv.removeItemButton = inputs[4];

                priv.items = inputs[1].value.split('|t |t |t').map(function (oneItem) {
                    var lookup = oneItem.split('|t');
                    return base.createLookupValue(+lookup[0], lookup[1]);
                });
            }

            function lookupStringValueToLookups(str) {
                var splittedStr, values;
                splittedStr = str.split('|t');
                values = [];
                if (splittedStr.length > 1) {
                    for (var i = 0; i < splittedStr.length; i = i + 2) {
                        values.push(base.createLookupValue(+splittedStr[i], splittedStr[i + 1]));
                    }
                } else {
                    return null;
                }
            }

            function lookupsToLookupStringValue(lookups) {
                return lookups === null || lookups.length === 0
                    ? null
                    : lookups.map(function (oneLookup) {
                        return stringHelper.format('{0}|t{1}', oneLookup.getId(), oneLookup.getValue().replace('|', '||'));
                    }).join('|t');
            }

            function arrangeItems(optionIds) {
                var allOptions = [];

                [priv.itemsControl, priv.selectionControl].forEach(function (oneSelect) {
                    documentHelper.nodeListToArray(oneSelect.options).forEach(function (oneOption) {
                        allOptions.push(oneSelect.removeChild(oneOption));
                    });
                });

                allOptions.filter(function (oneOption) {
                    return !arrayHelper.contains(optionIds, +oneOption.value);
                }).sort(function (a, b) {
                    return a.title == b.title ? 0 : a.title < b.title ? -1 : 1;
                }).forEach(function (oneOption) {
                    priv.itemsControl.appendChild(oneOption);
                });

                allOptions.filter(function (oneOption) {
                    return arrayHelper.contains(optionIds, +oneOption.value);
                }).forEach(function (oneOption) {
                    if (arrayHelper.contains(optionIds, +oneOption.value)) {
                        priv.selectionControl.appendChild(oneOption);
                    }
                });
            }

            priv = {
                hiddenSelection: null,
                itemsControl: null,
                selectionControl: null,
                addItemButton: null,
                removeItemButton: null,
                items: null,
                itemsFilter: function () { return true; },
                filteredItems: []
            };

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.lookupMultiControl';
                },
                init: function () {
                    initFormControls();
                    [priv.addItemButton, priv.removeItemButton].forEach(function (oneButton) {
                        documentHelper.addEvent(oneButton, 'click', function (e) {
                            obj.trigger('change', { domEvent: e });
                        });
                    });
                },
                setValue: function (value) {
                    var lookups, lookupIds;
                    if (!value || value.length === 0) {
                        lookups = null;
                        lookupIds = [];
                    } else if (Array.isArray(value)) {
                        lookups = value.map(function (oneValue) {
                            return converter.toLookupValue(oneValue, priv.items);
                        });
                        lookupIds = lookups.map(function (oneLookup) {
                            return oneLookup.getId();
                        });
                    } else {
                        throw new Error('multi lookup value is not valid');
                    }
                    priv.hiddenSelection.value = !lookups ? '' : lookupsToLookupStringValue(lookups);
                    arrangeItems(lookupIds);
                },
                getValue: function () {
                    return lookupStringValueToLookups(priv.hiddenSelection.value);
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
                    [priv.itemsControl, priv.selectionControl, priv.addItemButton, priv.removeItemButton].forEach(function (oneControl) {
                        documentHelper.toggleAttribute(oneControl, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    });
                    if (isAvailable) {
                        documentHelper.toggleAttribute(priv.addItemButton, { name: 'disabled', value: 'disabled' }, !priv.itemsControl.options.length);
                        documentHelper.toggleAttribute(priv.removeItemButton, { name: 'disabled', value: 'disabled' }, !priv.selectionControl.options.length);
                    }
                }
            });

            return obj;
        };

    });