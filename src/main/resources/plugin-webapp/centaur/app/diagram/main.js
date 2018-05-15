/*
 * Loads all the modules for the diagram of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var color = require('./color/main');
    var duration = require('./duration/main');
    var bulletgraph = require('./bulletgraph/main');
    return angular.module('cockpit.plugin.centaur.diagram', [color.name, duration.name]);
});
