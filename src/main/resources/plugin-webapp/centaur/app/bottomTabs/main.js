/*
 * Loads all the modules for the bottom tabs of our plugin.
 */
'use strict';

define(function (require) {
    var angular = require('angular');
    var options = require('./options/main');
    var history = require('./history/main');
    return angular.module('cockpit.plugin.centaur.bottomTabs', [options.name, history.name]);
});
