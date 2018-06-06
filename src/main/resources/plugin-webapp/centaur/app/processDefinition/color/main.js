'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\centaur\app\demoText\brain.js');

//Define colors

var redColor = '<div class="highlight-overlay-red">';
var orangeColor = '<div class="highlight-overlay-orange">';
var greenColor = '<div class="highlight-overlay-green">';

//Define events which change color

var redEvent = 'ServiceTask_1';
var orangeEvent = 'UserTask_1';
var greenEvent = 'ServiceTask_2';


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

                    // console.log("Display bpmnElements:");
                    // console.log(viewer,overlays,elementRegistry);

                    elementRegistry.forEach(function(shape) { 
                        var element = processDiagram.bpmnElements[shape.businessObject.id];
                        // console.log(element.id);

                        function addColorToId(elementId, color) {
                            var $overlayHtml =
                                    $(color)
                                    .css({
                                        width: shape.width,
                                        height: shape.height
                                    });
    
                                overlays.add(elementId, {
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

                        switch(element.id) {
                            case redEvent:
                                addColorToId(element.id, redColor);
                                break;
                            case orangeEvent:
                                addColorToId(element.id, orangeColor);
                                break;
                            case greenEvent:
                                addColorToId(element.id, greenColor);
                            default:
                                break;
                        }
                    });
                    


                    // console.log("End of decorate element");

                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.color', []);

    ngModule.config(Configuration);

    return ngModule;
});
