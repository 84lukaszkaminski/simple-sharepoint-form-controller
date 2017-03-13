window.simpleSharePointFormController.create('base', [], function (base) {
    'use strict';

    base.createEventsObject = function () {
        var priv, obj;

        priv = {
            subscribers: {}
        };

        obj = {
            on: function (name, handler) {
                if (!priv.subscribers[name]) {
                    priv.subscribers[name] = [];
                }
                priv.subscribers[name].push(handler);
            },
            off: function (name, handler) {
                if (!priv.subscribers[name] || priv.subscribers[name].indexOf(handler) == -1) {
                    throw new Error('there is no "' + name + '" event to delete');
                }
                priv.subscribers[name].slice(priv.subscribers[name].indexOf(handler), 1);
            },
            trigger: function (name, e) {
                if (priv.subscribers[name]) {
                    priv.subscribers[name].forEach(function (oneHandler) {
                        if (!e) { e = {}; }
                        if (!e.srcElement) { e.srcElement = obj; }
                        oneHandler(e);
                    });
                }
            }
        };

        return obj;
    };

});