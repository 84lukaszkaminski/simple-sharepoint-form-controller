window.simpleSharePointFormController.create('utils.document', [], function (documentHelper) {
    'use strict';

    function removeSpaces(str) {
        return str.replace(/\s{2,}/g, ' ');
    }

    documentHelper.addEvent = function (element, name, handler) {
        if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
        } else {
            element.addEventListener(name, handler);
        }
    };

    documentHelper.removeEvent = function (element, name, handler) {
        if (element.detachEvent) {
            element.detachEvent('on' + name, handler);
        } else {
            element.removeEventListener(name, handler);
        }
    };

    documentHelper.addClass = function (element, className) {
        if (!documentHelper.hasClass(element, className)) {
            if (element.className) {
                element.className = removeSpaces(element.className + ' ' + className);
            } else {
                element.className = className;
            }
        }
    };

    documentHelper.removeClass = function (element, className) {
        if (documentHelper.hasClass(element, className)) {
            element.className = removeSpaces(element.className.replace(className, ''));
        }
    };

    documentHelper.toggleClass = function (element, className, isPresent) {
        if (isPresent === true) {
            documentHelper.addClass(element, className);
        } else if (isPresent === false) {
            documentHelper.removeClass(element, className);
        } else {
            if (documentHelper.hasClass(element, className)) {
                documentHelper.removeClass(element, className);
            } else {
                documentHelper.addClass(element, className);
            }
        }
    };

    documentHelper.hasClass = function (element, className) {
        return element.className.indexOf(className) != -1;
    };

    documentHelper.isVisible = function (element) {
        return window.getComputedStyle(element).display != 'none';
    };

    documentHelper.addAttribute = function (element, attribute) {
        element.setAttribute(attribute.name, attribute.value);
    };

    documentHelper.removeAttribute = function (element, attribute) {
        element.removeAttribute(attribute.name);
    };

    documentHelper.toggleAttribute = function (element, attribute, isPresent) {
        if (isPresent === true) {
            documentHelper.addAttribute(element, attribute);
        } else if (isPresent === false) {
            documentHelper.removeAttribute(element, attribute);
        } else {
            if (documentHelper.hasAttribute(element, attribute)) {
                documentHelper.removeAttribute(element, attribute);
            } else {
                documentHelper.addAttribute(element, attribute);
            }
        }
    };

    documentHelper.nodeListToArray = function (nodeList) {
        return Array.prototype.map.call(nodeList, function (oneNode) {
            return oneNode;
        });
    };

});