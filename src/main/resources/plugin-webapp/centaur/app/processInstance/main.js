/*
 * Loads all the modules for the processDefinition of our plugin.
 */
'use strict';

define(function(require) {
    var angular = require('angular');
    var variables = require('./variables/main');
    var options = require('./options/main');
    return angular.module('cockpit.plugin.centaur.processInstance', [variables.name, options.name]);
});
