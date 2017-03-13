window.simpleSharePointFormController.create('formHelper', ['form.controls', 'utils.object', 'form.fields', 'form', 'utils.document', 'utils.array', 'window', 'base'],
    function (formHelper, controls, objectHelper, fields, form, documentHelper, arrayHelper, window, base) {
        'use strict';

        function getSPClientUserControlProvider(internalName) {
            var spy, obj;

            function _getSPClientUserControlProvider() {
                var key = arrayHelper.singleOrNull(Object.keys(window.SPClientPeoplePicker.SPClientPeoplePickerDict), function (oneKey) {
                    var regex = new RegExp('^' + internalName + '_.{8}-.{4}-.{4}-.{4}-.{12}_\\$ClientPeoplePicker$');
                    return regex.test(oneKey);
                });
                return window.SPClientPeoplePicker.SPClientPeoplePickerDict[key];
            }

            spy = base.createSpyObject({ evaluateState: function () { return !!window.SPClientPeoplePicker; }, autostop: true, autostart: true });
            spy.on('clue', function () {
                obj.trigger('ready', { spClientUserControl: _getSPClientUserControlProvider() });
            });

            obj = base.createEventsObject();
            return obj;
        }

        function mapControl(options) {
            var controlOptions, customization;
            controlOptions = {
                valueContent: options.valueContent
            };
            customization = options.customization || {};

            switch (options.fieldType) {
                case 'SPFieldText':
                    return controls.createTextControl(controlOptions);
                case 'SPFieldNumber':
                case 'SPFieldCurrency':
                    return controls.createNumberControl(controlOptions);
                case 'SPFieldDateTime':
                    return controls.createDateControl(objectHelper.mixin(controlOptions, {
                        customization: {
                            dateFormat: customization.dateFormat,
                            dateTimeFormat: customization.dateTimeFormat
                        }
                    }));
                case 'SPFieldLookup':
                    return controls.createLookupControl(controlOptions);
                case 'SPFieldLookupMulti':
                    return controls.createLookupMultiControl(controlOptions);
                case 'SPFieldUser':
                case 'SPFieldUserMulti':
                    return controls.createUserControl(objectHelper.mixin(controlOptions, {
                        spClientControlProvider: getSPClientUserControlProvider(options.internalName)
                    }));
                case 'SPFieldChoice':
                case 'SPFieldOutcomeChoice':
                    return controls.createChoiceControl(controlOptions);
                case 'SPFieldMultiChoice':
                    return controls.createChoiceMultiControl(controlOptions);
                case 'SPFieldBoolean':
                    return controls.createBooleanControl(controlOptions);
                case 'SPFieldURL':
                    return controls.createUrlControl(controlOptions);
                default:
                    return controls.createBaseControl(controlOptions);
            }
        }

        formHelper.mapField = function (options) {
            var row, label, control;
            row = form.createRowWrapper(options.row);
            label = form.createFieldLabel({
                labelContent: row.getLabelContent()
            });
            control = mapControl({
                internalName: row.getFieldInternalName(),
                fieldType: row.getFieldType(),
                valueContent: row.getValueContent(),
                customization: options.customization
            });

            documentHelper.addClass(row.getRow(), 'simple-sp-form-field');
            documentHelper.addClass(row.getValueContent(), 'simple-sp-value-content');

            switch (row.getFieldType()) {
                case 'SPFieldLookup':
                case 'SPFieldLookupMulti':
                case 'SPFieldChoice':
                case 'SPFieldOutcomeChoice':
                case 'SPFieldMultiChoice':
                    return fields.createChoiceField({
                        row: row,
                        label: label,
                        control: control
                    });
                default:
                    return fields.createBaseField({
                        row: row,
                        label: label,
                        control: control
                    });
            }
        };

    });