'use strict'
define(['angular'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', 'control', 'processData', 'processDiagram', 'Loaders', '$filter', '$rootScope', '$translate',
                function($scope, control, processData, processDiagram, Loaders, $filter, $rootScope, $translate) {
                    var viewer = control.getViewer();

                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram', []);

    ngModule.config(Configuration);

    return ngModule;
});