/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var processModule = require('./processes/main');
    var processDefinition = require('./processDefinition/main');
    var processInstance = require('./processInstance/main');
    return angular.module('cockpit.plugin.centaur', [processModule.name, processDefinition.name, processInstance.name]);
});

//git hook test