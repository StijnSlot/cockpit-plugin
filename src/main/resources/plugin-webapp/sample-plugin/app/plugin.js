/*
 * Loads all the modules of our plugin.
 */
'use strict';
console.log("hello1");

var angular = require('angular');
define(function (require) {
    var diagramModule = require('./diagram/main');
    return angular.module('cockpit.plugin.sample-plugin', [diagramModule.name]);
});

