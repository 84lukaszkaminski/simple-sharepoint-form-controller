window.simpleSharePointFormController.create('utils.sp', ['window', 'SP'], function (spHelper, window, SP) {
    'use strict';

    spHelper.getSPPageContexInfo = function () {
        return window._spPageContextInfo;
    };

    spHelper.getCurrentCultureName = function () {
        return spHelper.getSPPageContexInfo().currentCultureName;
    };

    spHelper.executeOrDelayUntilEventNotified = function (fn, script) {
        SP.SOD.executeOrDelayUntilEventNotified(fn, script);
    };

});