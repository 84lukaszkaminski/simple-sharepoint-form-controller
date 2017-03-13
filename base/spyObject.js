window.simpleSharePointFormController.create('base', ['window', 'utils.object'], function (base, window, objectHelper) {
    'use strict';

    base.createSpyObject = function (options) {
        var priv, obj;

        function doTrack() {
            if (priv.evaluatedState != options.evaluateState()) {
                obj.trigger('clue');
                if (options.autostop) {
                    obj.stopTracking();
                }
            }
        }

        priv = {
            tracking: null,
            evaluatedState: null
        };

        obj = objectHelper.mixin(base.createEventsObject(), {
            startTracking: function () {
                priv.evaluatedState = options.evaluateState();
                priv.tracking = window.setInterval(function () {
                    doTrack();
                }, 25);
            },
            stopTracking: function () {
                if (priv.tracking) {
                    window.clearInterval(priv.tracking);
                    priv.tracking = null;
                    if (!options.autostop) {
                        doTrack();
                    }
                }
            }
        });
        
        if (options.autostart) {
            obj.startTracking();
        }

        return obj;
    };

});