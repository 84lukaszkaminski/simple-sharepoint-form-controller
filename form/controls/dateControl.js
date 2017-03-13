window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.string', 'utils.document', 'base', 'moment'],
    function (controls, objectHelper, stringHelper, documentHelper, base, moment) {
        'use strict';

        controls.createDateControl = function (options) {
            var priv, obj;

            function isDateTimeControl() {
                return !!priv.hoursControl;
            }

            priv = {
                dateControl: options.valueContent.getElementsByTagName('input')[0],
                hoursControl: options.valueContent.getElementsByTagName('select')[0],
                minutesControl: options.valueContent.getElementsByTagName('select')[1],
                datePicker: options.valueContent.getElementsByTagName('a')[0],
                spy: base.createSpyObject({
                    evaluateState: function () {
                        var value = obj.getValue();
                        return value ? value.toString() : null;
                    }
                })
            };

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.dateControl';
                },
                init: function () {
                    [priv.dateControl, priv.hoursControl, priv.minutesControl].filter(function (oneControl) {
                        return !!oneControl;
                    }).forEach(function (oneControl) {
                        documentHelper.addEvent(oneControl, 'change', function (e) {
                            obj.trigger('change', { domEvent: e });
                        });
                    });

                    priv.spy.on('clue', function () {
                        obj.trigger('change');
                    });

                    documentHelper.addEvent(priv.datePicker, 'click', function () {
                        priv.spy.startTracking();
                    });

                    documentHelper.addEvent(priv.dateControl, 'focus', function () {
                        priv.spy.stopTracking();
                    });
                },
                setValue: function (value) {
                    var date;
                    if (value instanceof Date) {
                        date = moment(value);
                    } else {
                        date = moment(value, options.customization.dateTimeFormat);
                    }
                    if (isDateTimeControl()) {
                        priv.hoursControl.value = date.hours();
                        priv.minutesControl.value = stringHelper.zeroPad(Math.round(Math.floor((date.minutes() || 1) / 5) * 5), 2);
                    }
                    priv.dateControl.value = date.format(options.customization.dateFormat);
                },
                getValue: function () {
                    if (isDateTimeControl()) {
                        return moment(stringHelper.format('{0} {1}:{2}', priv.dateControl.value,
                            stringHelper.zeroPad(priv.hoursControl.value, 2), stringHelper.zeroPad(priv.minutesControl.value, 2)), options.customization.dateFormat + 'HH:mm');
                    } else {
                        return moment(priv.dateControl.value, options.customization.dateFormat);
                    }
                },
                toggleAvailability: function (isAvailable) {
                    [priv.dateControl, priv.hoursControl, priv.minutesControl].filter(function (oneControl) {
                        return !!oneControl;
                    }).forEach(function (oneControl) {
                        documentHelper.toggleAttribute(oneControl, { name: 'disabled', value: 'disabled' }, !isAvailable);
                    });
                    documentHelper.toggleClass(priv.datePicker, 'simple-sp-form-hidden', !isAvailable);
                }
            });

            return obj;
        };

    });