/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var processDefinition = require('./processDefinition/main');
    var processInstance = require('./processInstance/main');
    return angular.module('cockpit.plugin.centaur', [processDefinition.name, processInstance.name]);
});

//git hook test