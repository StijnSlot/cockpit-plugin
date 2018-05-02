/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var diagramModule = require('./diagram/main');
    return angular.module('cockpit.plugin.sample-plugin', [diagramModule.name]);
});

