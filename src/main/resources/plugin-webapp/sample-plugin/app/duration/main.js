'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\sample-plugin\app\demoText\brain.js');

//Define colors

var htmlText1 = '<div class="durationText">';
var htmlText2 = 'My text2';
var htmlText3 = 'My text2';
var htmlText4 = 'My text3';
var htmlText5 = '</div>';
var htmlText = htmlText1 + htmlText2 + '<br>' + htmlText3 + '<br>' + htmlText4 + htmlText5;

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

                    console.log('colors loaded twice, yayyyyyy');
                    
                    console.log("Display overlay:");
                    console.log(viewer,overlays,elementRegistry);

                    elementRegistry.forEach(function(shape) { 
                        var element = processDiagram.bpmnElements[shape.businessObject.id];
                        console.log(element.id);

                        function addColorToId(elementId, duration) {
                            var $overlayHtml =
                                    $(duration)
                                    .css({
                                        width: shape.width,
                                        height: shape.height
                                    });
    
                                overlays.add(elementId, {
                                    position: {
                                    top: -20,
                                    left: -20
                                    },
                                    show: {
                                      minZoom: -Infinity,
                                      maxZoom: +Infinity
                                    },
                                    html: $overlayHtml
                                });
                        }

                        addColorToId(element.id, htmlText);
                    });
                    


                    
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
