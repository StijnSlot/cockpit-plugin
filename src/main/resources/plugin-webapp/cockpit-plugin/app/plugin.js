/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var diagramModule = require('./diagram/main');
    var demoText = require('./demoText/main');
    var temp = require('./temp/main');
    var options = require('./options/main');
    var duration = require('./duration/main');
    return angular.module('cockpit.plugin.cockpit-plugin', [diagramModule.name, demoText.name, temp.name, duration.name, options.name]);
});