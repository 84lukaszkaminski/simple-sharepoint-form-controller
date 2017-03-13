window.simpleSharePointFormController.create('utils.string', ['utils.array'], function (stringHelper, arrayHelper) {
    'use strict';

    stringHelper.format = function () {
        var args, str, slots;
        args = Array.prototype.slice.call(arguments);
        str = args.shift();
        slots = str.match(/\{.+?\}/g);

        slots.forEach(function (oneSlot, index) {
            var rx = new RegExp(oneSlot.replace('{', '\\{').replace('}', '\\}'), 'g');
            str = str.replace(rx, args[index]);
        });

        return str;
    };

    stringHelper.zeroPad = function (number, length) {
        var baseString;
        baseString = '';
        for (var i = 0; i < length - number.toString().length; i++) {
            baseString += '0';
        }
        return baseString += number.toString();
    };

    stringHelper.valueOrNull = function (str) {
        return arrayHelper.contains(['', undefined], str) ? null : str;
    };

    stringHelper.valueOrEmpty = function (str) {
        return arrayHelper.contains(['', undefined], str) ? '' : str;
    };

});