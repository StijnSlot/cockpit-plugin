'use strict'
define(['angular'], function(angular) {
    var instanceCount = require('../../common/diagramPlugins/instanceCount');
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.overlay', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', 'control', 'processData', 'processDiagram', 'Loaders', '$filter', '$rootScope', '$translate', 'callbacks',
                function($scope, control, processData, processDiagram, Loaders, $filter, $rootScope, $translate, callbacks) {
                    // variables
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var stopLoading = Loaders.startLoading();
                    var overlaysNodes = {};

                    callbacks.observe(function(sources) {
                        // stop loading the plugin stuff
                        stopLoading();

                        // go through all the elements in the diagram
                        elementRegistry.forEach(function(shape) {
                            var element = processDiagram.bpmnElements[shape.businessObject.id];
                            var data = callbacks.getData.apply(null, [element].concat(sources));
                            var nodes;

                            console.log(element);
                        });
                    });
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram', []);

    ngModule.config(Configuration);

    return ngModule;
});