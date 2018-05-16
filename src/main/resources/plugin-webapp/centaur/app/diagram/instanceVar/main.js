'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\centaur\app\demoText\brain.js');

//Hardcoded stuff
var procDefId = "invoice:2:2a152b09-5366-11e8-8246-54ee7557b990";

//Define colors

var htmlText1 = '<div class="durationText">';
var htmlText2 = 'My text2';
var htmlText3 = 'My text2';
var htmlText4 = 'My text3';
var htmlText5 = '</div>';
var htmlText = htmlText1 + htmlText2 + '<br>' + htmlText3 + '<br>' + htmlText4 + htmlText5;

define(['angular'], function(angular) {

    var overlay = [
        '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', 'processDiagram',
        function($scope, $http, Uri, control, processData, pageData, processDiagram) {
            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');

            console.log(processData);

            //console.log('colors loaded twice, yayyyyyy');

            //console.log("Display overlay:");
            //console.log(viewer,overlays,elementRegistry);

            //$http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" +
                //"procDefId=" + procDefId))
                //.success(function(data) {
                    //$scope.processActivityStatistics = data;
                    // console.log($scope.processActivityStatistics);
                    // console.log('Here comes the duration data');

                    elementRegistry.forEach(function(shape) {
                        var element = processDiagram.bpmnElements[shape.businessObject.id];
                        console.log(element);
                        console.log(element.id);
                    });
                //});
        }]

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            label: 'Instance Variables',
            priority: 20,
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.instanceVar', []);

    ngModule.config(Configuration);

    return ngModule;
});
