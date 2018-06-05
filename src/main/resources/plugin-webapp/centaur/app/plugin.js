/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var processDefinition = require('./processDefinition/main');
    var processInstance = require('./processInstance/main');
    var diagramRefresh = require('./diagram/refresh/main');
    return angular.module('cockpit.plugin.centaur', [processDefinition.name, processInstance.name, diagramRefresh.name]);
});

//git hook test