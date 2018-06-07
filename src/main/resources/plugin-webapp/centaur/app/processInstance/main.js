/*
 * Loads all the modules for the processDefinition of our plugin.
 */
'use strict';

define(function(require) {
    var angular = require('angular');
    var variables = require('./variables/main');
    return angular.module('cockpit.plugin.centaur.processInstance', [variables.name]);
});
