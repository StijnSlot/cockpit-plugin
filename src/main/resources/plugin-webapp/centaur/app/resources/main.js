/*
 * Loads all the modules for the processDefinition
 */
'use strict';

define(function(require) {
    var angular = require('angular');
    var navigation = require('./navigation/main');
    var view = require('./view/main');
    return angular.module('cockpit.plugin.centaur.dashboard', [navigation.name, view.name]);
});