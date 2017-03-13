window.simpleSharePointFormController.create('form', [], function (form) {
    'use strict';

    form.createRowWrapper = function (row) {
        var priv, obj;

        priv = {
            labelCell: null,
            labelContent: null,
            valueCell: null,
            valueContent: null,
            fieldDescription: null,
            fieldName: null,
            fieldInternalName: null,
            fieldType: null
        };

        obj = {
            getRow: function () {
                return row;
            },
            getFieldDescription: function () {
                return priv.fieldDescription || (priv.fieldDescription = obj.getValueCell().childNodes[1].nodeValue);
            },
            getFieldName: function () {
                return priv.fieldName || (priv.fieldName = obj.getFieldDescription().match(/FieldName="(.+?)"/)[1]);
            },
            getFieldInternalName: function () {
                return priv.fieldInternalName || (priv.fieldInternalName = obj.getFieldDescription().match(/FieldInternalName="(.+?)"/)[1]);
            },
            getFieldType: function () {
                return priv.fieldType || (priv.fieldType = obj.getFieldDescription().match(/FieldType="(.+?)"/)[1]);
            },
            getLabelCell: function () {
                return priv.labelCell || (priv.labelCell = obj.getRow().children[0]);
            },
            getLabelContent: function () {
                return priv.labelContent || (priv.labelContent = obj.getLabelCell().children[0]);
            },
            getValueCell: function () {
                return priv.valueCell || (priv.valueCell = obj.getRow().children[1]);
            },
            getValueContent: function () {
                return priv.valueContent || (priv.valueContent = obj.getValueCell().children[0]);
            }
        };

        return obj;
    };

});