(function (objects) {
    'use strict';

    window.simpleSharePointFormController = (function () {
        var modules;

        function initModule(module, dependencies, callback) {
            var depObjects;
            depObjects = [module].concat((dependencies || []).map(function (oneDependency) {
                if (!modules[oneDependency]) {
                    throw new Error('module with the name "' + oneDependency + '" has not been registered');
                }
                return modules[oneDependency].init();
            }));
            callback.apply(null, depObjects);
        }

        function createModule(dependencies, callback) {
            var module, parts;
            parts = [{ dependencies: dependencies, callback: callback }];

            return {
                init: function () {
                    if (!module) {
                        module = {};
                        parts.forEach(function (onePart) {
                            initModule(module, onePart.dependencies, onePart.callback);
                        });
                    }
                    return module;
                },
                addPart: function (dependencies, callback) {
                    parts.push({ dependencies: dependencies, callback: callback });
                }
            };
        }

        function createObjectModule(module) {
            return {
                init: function () {
                    return module;
                }
            };
        }

        modules = {};

        Object.keys(objects).forEach(function (oneKey) {
            modules[oneKey] = createObjectModule(objects[oneKey]);
        });

        return {
            create: function (name, dependencies, callback) {
                if (modules[name]) {
                    modules[name].addPart(dependencies, callback);
                } else {
                    modules[name] = createModule(dependencies, callback);
                }
            },
            use: function (dependencies, callback) {
                var depObjects;
                depObjects = dependencies.map(function (oneDependency) {
                    if (!modules[oneDependency]) {
                        throw new Error('module with the name "' + oneDependency + '" has not been registered');
                    }
                    return modules[oneDependency].init();
                });
                callback.apply(null, depObjects);
            }
        };
    })();

})({ 
    window: window, 
    moment: window.moment, 
    SP: window.SP 
});