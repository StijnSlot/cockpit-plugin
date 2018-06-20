define(function(require) {
    var angular = require('angular');
    var selection = require('./selection/main');
    return angular.module('cockpit.plugin.centaur.processes', [selection.name]);
});
