/*
 * Loads all the modules for the processDefinition of our plugin.
 */
'use strict';

define(function(require) {
    var angular = require('angular');
    var variables = require('./variables/main');
    var bulletgraph = require('./bulletgraph/main');
    var duration = require('./duration/main');
    var options = require('./optionsTab/main');
    var refresh = require('./refresh/main');
    return angular.module('cockpit.plugin.centaur.processInstance', [variables.name, bulletgraph.name, duration.name,
        options.name, refresh.name]);
});
