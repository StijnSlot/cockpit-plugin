/*
 * Loads all the modules of our plugin.
 */
'use strict';

var angular = require('angular'),
    diagramModule = require('./diagram/color');

module.exports = angular.module('cockpit.plugin.sample-plugin', [diagramModule.name]);