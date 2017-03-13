window.simpleSharePointFormController.create('form', ['utils.string', 'utils.object', 'base', 'formHelper', 'utils.sp', 'window', 'utils.array'],
    function (form, stringHelper, objectHelper, base, formHelper, spHelper, window, arrayHelper) {
        'use strict';

        form.createForm = function (options) {
            var priv, obj;

            priv = {
                fields: [],
                fieldsHashTable: {}
            };

            spHelper.executeOrDelayUntilEventNotified(function () {
                Array.prototype.forEach.call(window.document.getElementsByClassName('ms-formtable')[0].children[0].children, function (oneRow) {
                    if (oneRow.id != 'idAttachmentsRow') {
                        var field = formHelper.mapField({
                            row: oneRow,
                            customization: options.customization
                        });
                        field._init();
                        priv.fields.push(field);
                        priv.fieldsHashTable[field.getInternalName()] = field;
                    }
                });
                obj.trigger('ready');
            }, 'sp.bodyloaded');

            obj = objectHelper.mixin(base.createEventsObject(), {
                getField: function (internalName) {
                    if (!priv.fieldsHashTable[internalName]) {
                        throw new Error(stringHelper.format('form doesn\'t contain field with internal name "{0}"', internalName));
                    }
                    return priv.fieldsHashTable[internalName];
                },
                getFieldByTitle: function (title) {
                    var field = arrayHelper.singleOrNull(priv.fields, function (oneField) {
                        return oneField.getTitle() == title;
                    });
                    if (!field) {
                        throw new Error(stringHelper.format('form doesn\'t contain field with the title "{0}"', title));
                    }
                    return field;
                },
                getAllFields: function () {
                    return priv.fields;
                },
                getAllFieldsHashTable: function () {
                    return priv.fieldsHashTable;
                }
            });

            return obj;
        };

    });