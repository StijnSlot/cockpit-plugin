'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\sample-plugin\app\demoText\brain.js');

define(['angular'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope' ,'control', 'processData', 'pageData', 'processDiagram',
                function($scope, control, processData, pageData, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var overlaysNodes = {};

                    console.log("Display bpmnElements:");
                    console.log(viewer,overlays,elementRegistry);

                    elementRegistry.forEach(function(shape) { 
                        var element = processDiagram.bpmnElements[shape.businessObject.id];
                        console.log(element.id);

                        if (element.id == 'ServiceTask_1') {
                            var $overlayHtml =
                                $('<div class="highlight-overlay">')
                                .css({
                                    width: shape.width,
                                    height: shape.height
                                });

                            overlays.add(element.id, {
                                position: {
                                top: 0,
                                left: 0
                                },
                                show: {
                                  minZoom: -Infinity,
                                  maxZoom: +Infinity
                                },
                                html: $overlayHtml
                            });
                        }

                    });
                    


                    console.log("End of decorate element");

                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram.color', []);

    ngModule.config(Configuration);

    return ngModule;
});
