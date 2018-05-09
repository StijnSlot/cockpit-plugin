/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var diagramModule = require('./diagram/main');
    var demoText = require('./demoText/main');
    var temp = require('./temp/main');
    //var options = require('./options/main');
    return angular.module('cockpit.plugin.sample-plugin', [diagramModule.name, demoText.name, temp.name]);
});
