window.simpleSharePointFormController.create('form.controls', ['utils.object', 'utils.document'],
    function (controls, objectHelper, documentHelper) {
        'use strict';

        controls.createUserControl = function (options) {
            var priv, obj;

            priv = {
                clientInput: options.valueContent.getElementsByClassName('sp-peoplepicker-editorInput')[0],
                spClientUserControl: null,
                beforeReadyStateValue: undefined
            };

            function setNullValue() {
                priv.spClientUserControl.GetAllUserInfo().forEach(function () {
                    priv.spClientUserControl.DeleteProcessedUser();
                });
            }

            obj = objectHelper.mixin(controls.createBaseControl(options), {
                getName: function () {
                    return 'form.controls.userControl';
                },
                init: function () {
                    options.spClientControlProvider.on('ready', function (e) {
                        priv.spClientUserControl = e.spClientUserControl;
                        if (priv.beforeReadyStateValue !== undefined) {
                            obj.setValue(priv.beforeReadyStateValue);
                        }
                    });
                },
                setValue: function (value) {
                    if (priv.spClientUserControl === null) {
                        priv.beforeReadyStateValue = value;
                        return;
                    }

                    if (value === null) {
                        setNullValue();
                    } else if (Array.isArray(value) && priv.spClientUserControl.AllowMultipleUsers) {
                        setNullValue();
                        value.forEach(function (oneValue) {
                            priv.clientInput.value = oneValue;
                            priv.spClientUserControl.AddUnresolvedUserFromEditor(true);
                        });
                    } else if (typeof value == 'string' && !priv.spClientUserControl.AllowMultipleUsers) {
                        setNullValue();
                        priv.clientInput.value = value;
                        priv.spClientUserControl.AddUnresolvedUserFromEditor(true);
                    } else {
                        throw new Error('user value is not valid');
                    }
                },
                getValue: function () {
                    var value;
                    value = priv.spClientUserControl.GetAllUserInfo();
                    if (value.length === 0) {
                        return null;
                    } else {
                        return value;
                    }
                },
                toggleAvailability: function (isAvailable) {
                    documentHelper.toggleClass(priv.clientInput, 'simple-sp-form-hidden', !isAvailable);
                    documentHelper.toggleClass(options.valueContent, 'simple-sp-form-disabled-user-field', !isAvailable);
                }
            });

            return obj;
        };

    });