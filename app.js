window.simpleSharePointFormController.use(['form'], function (formModule) {
    'use strict';

    var form, fields;

    form = formModule.createForm({
        customization: {
            dateFormat: 'YYYY-MM-DD',
            dateTimeFormat: 'YYYY-MM-DD HH:mm'
        }
    });

    function setAvailabilityEvaluator(options) {
        function _evaluate() {
            if (options.evaluator()) {
                options.field.enable();
            } else {
                options.field.disable();
            }
        }
        options.relatedFields.forEach(function (oneField) {
            oneField.on('change', _evaluate);
        });
        _evaluate();
    }

    function setVisibilityEvaluator(options) {
        function _evaluate() {
            if (options.evaluator()) {
                options.field.show();
            } else {
                options.field.hide();
            }
        }
        options.relatedFields.forEach(function (oneField) {
            oneField.on('change', _evaluate);
        });
        _evaluate();
    }

    form.on('ready', function () {
        fields = form.getAllFieldsHashTable();

        setVisibilityEvaluator({
            field: fields.Title,
            relatedFields: [fields.number, fields.text],
            evaluator: function () {
                return fields.number.getValue() > 0 || fields.text.getValue() == '!';
            }
        });

        setAvailabilityEvaluator({
            field: fields.multilookup,
            relatedFields: [fields.text, fields.lookup],
            evaluator: function () {
                return fields.text.getValue() == '?' || fields.lookup.getValue() && fields.lookup.getValue().getId() == 1;
            }
        });

        fields.date.setValue(new Date());

        fields.dateAndTime.setValue(new Date());

        fields.dateAndTime.on('change', function () {
            fields.lookup.setValue(12);
            fields.multilookup.setValue(null);
            fields.multilookup.setValue([12, 37]);
        });

        [fields.lookup, fields.multilookup].forEach(function (oneField) {
            oneField.setFilter(function (item) {
                return item.getId() < fields.number.getValue();
            }, [fields.number]);
        });

        setAvailabilityEvaluator({
            field: fields.hyperlink,
            relatedFields: [fields.Title],
            evaluator: function () {
                return false;
            }
        });

        fields.Title.setLabel('nowy tytuł');
        fields.Title.setValue(fields.text == form.getField('text') == form.getFieldByTitle('text'));
        fields.dateAndTime.setLabel('Data i czas');

        fields.boolean.on('change', function (e) {
            if (e.srcElement.getValue()) {
                fields.user.setValue(null);
                fields.multiuser.setValue(['Łukasz Kamiński', 'admin']);
            } else {
                fields.user.setValue('Łukasz Kamiński');
                fields.multiuser.setValue(null);
            }
            [fields.choice, fields.radiobuttonChoice, fields.choicePlus, fields.radiobuttonChoicePlus].forEach(function (oneField) {
                try {
                    if (oneField.getValue() == 'Wprowadź wybór #1') {
                        oneField.setValue('Wprowadź wybór #2');
                    } else if (oneField.getValue() == 'Wprowadź wybór #2') {
                        oneField.setValue('Wprowadź wybór #3');
                    } else if (oneField.getValue() == 'Wprowadź wybór #3') {
                        oneField.setValue('Wprowadź wybór #4');
                    } else if (oneField.getValue() == 'Wprowadź wybór #4') {
                        oneField.setValue('Wprowadź wybór #5');
                    } else if (oneField.getValue() == 'Wprowadź wybór #5') {
                        oneField.setValue(null);
                    } else if (oneField.getValue() == null) {
                        oneField.setValue('Wprowadź wybór #1');
                    }
                } catch (err) {
                    console.log(err);
                }
            });

            [fields.multichoice, fields.choiceMultiPlus].forEach(function (oneField) {
                try {
                    if (oneField.getValue() == null) {
                        oneField.setValue(['Wprowadź wybór #1']);
                    } else if (oneField.getValue().toString() == 'Wprowadź wybór #1') {
                        oneField.setValue(['Wprowadź wybór #1', 'Wprowadź wybór #2']);
                    } else if (oneField.getValue().toString() == 'Wprowadź wybór #1,Wprowadź wybór #2') {
                        oneField.setValue(['Wprowadź wybór #1', 'Wprowadź wybór #2', 'Wprowadź wybór #3']);
                    } else if (oneField.getValue().toString() == 'Wprowadź wybór #1,Wprowadź wybór #2,Wprowadź wybór #3') {
                        oneField.setValue(['Wprowadź wybór #1', 'Wprowadź wybór #2', 'Wprowadź wybór #3', 'Wprowadź wybór #4']);
                    } else if (oneField.getValue().toString() == 'Wprowadź wybór #1,Wprowadź wybór #2,Wprowadź wybór #3,Wprowadź wybór #4') {
                        oneField.setValue(['Wprowadź wybór #1', 'Wprowadź wybór #2', 'Wprowadź wybór #3', 'Wprowadź wybór #5']);
                    } else {
                        oneField.setValue(null);
                    }
                } catch (err) {
                    oneField.setValue(null);
                    console.log(err);
                }
            });
        });

        [fields.choice, fields.choicePlus, fields.radiobuttonChoice, fields.radiobuttonChoicePlus, fields.multichoice, fields.choiceMultiPlus].forEach(function (oneField) {
            oneField.setFilter(function (item) {
                return +item[item.length - 1] < fields.number.getValue();
            }, [fields.number]);
        });

        [fields.choice, fields.radiobuttonChoice, fields.choicePlus, fields.radiobuttonChoicePlus, fields.multichoice, fields.choiceMultiPlus].forEach(function (oneField) {
            setAvailabilityEvaluator({
                field: oneField,
                relatedFields: [fields.boolean],
                evaluator: function () {
                    return fields.boolean.getValue();
                }
            });
        });

        [fields.user, fields.multiuser].forEach(function (oneField) {
            setAvailabilityEvaluator({
                field: oneField,
                relatedFields: [fields.text],
                evaluator: function () {
                    return fields.text.getValue();
                }
            });
        });
    });

});