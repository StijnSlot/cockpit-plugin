/*
 * Loads all the modules of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var processModule = require('./processes/main');
    var diagramModule = require('./diagram/main');
    var bottomTabsModule = require('./bottomTabs/main');
    var demoText = require('./demoText/main');
    return angular.module('cockpit.plugin.centaur', [processModule.name, diagramModule.name, demoText.name, bottomTabsModule.name]);
});

//git hook test