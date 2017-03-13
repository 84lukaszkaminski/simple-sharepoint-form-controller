window.simpleSharePointFormController.create('form.controls', ['utils.object', 'base', 'utils.document', 'utils.array', 'utils.converter'],
    function (controls, objectHelper, base, documentHelper, arrayHelper, converter) {
        'use strict';

        controls.createLookupControl = function (options) {
            var priv, obj;

            function filterItems() {
                var valuableOptions, beforeValue;
                beforeValue = priv.valueControl.value;
                valuableOptions = priv.filteredItems;
                priv.filteredItems = [];
                documentHelper.nodeListToArray(priv.valueControl.options).forEach(function (oneOption) {
                    valuableOptions.push(priv.valueControl.removeChild(oneOption));
                });
                valuableOptions.sort(function (a, b) {
                    return a.order == b.order ? 0 : a.order < b.order ? -1 : 1;
                }).forEach(function (oneOption) {
                    if (priv.itemsFilter(base.createLookupValue(+oneOption.value, oneOption.text))) {
                        priv.valueControl.appendChild(oneOption);
                    } else {
                        priv.filteredItems.push(oneOption);
                    }
                });
                priv.valueControl.value = beforeValue;
                if (priv.valueControl.value != beforeValue) {
                    priv.valueControl.selectedIndex = 0;
                }
            }

            priv = {
                valueControl: options.valueContent.getElementsByTagName('select')[0],
                items: null,
                itemsFilter: function () { return true; },
                filteredItems: []
            };

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.lookupControl';
                },
                init: function () {
                    documentHelper.nodeListToArray(priv.valueControl.options).forEach(function (oneNode, index) {
                        oneNode.order = index;
                    });
                    priv.items = documentHelper.nodeListToArray(priv.valueControl.options).map(function (oneNode) {
                        return base.createLookupValue(+oneNode.value, oneNode.text);
                    });
                    documentHelper.addEvent(priv.valueControl, 'change', function (e) {
                        obj.trigger('change', { domEvent: e });
                    });
                },
                setValue: function (value) {
                    var selection = converter.toLookupValue(value, priv.items);
                    if (selection === null) {
                        priv.valueControl.selectedIndex = 0;
                    } else {
                        priv.valueControl.value = selection.getId();
                        if (priv.valueControl.value != selection.getId()) {
                            priv.valueControl.selectedIndex = 0;
                            throw new Error('lookup value is invalid');
                        }
                    }
                },
                getValue: function () {
                    return priv.valueControl.options.selectedIndex == -1
                        ? null
                        : arrayHelper.singleOrNull(priv.items, function (oneItem) {
                            return oneItem.getId() == priv.valueControl.options[priv.valueControl.selectedIndex].value;
                        });
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
                    documentHelper.toggleAttribute(priv.valueControl, { name: 'disabled', value: 'disabled' }, !isAvailable);
                }
            });

            return obj;
        };

    });