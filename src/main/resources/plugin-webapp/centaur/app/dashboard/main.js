define(function(require) {
    var angular = require('angular');
    var resources = require('./resources/main');
    return angular.module('cockpit.plugin.centaur.dashboard', [resources.name]);
});