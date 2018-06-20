define(function(require) {
    var angular = require('angular');
    var bulletGraph = require('./bulletgraph/main');
    var duration = require('./duration/main');

    return angular.module('cockpit.plugin.centaur.processDefinition.overview', [bulletGraph.name, duration.name]);
});
