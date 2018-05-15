'use strict';

// $.getScript('https://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js', function() {
//     //script is loaded and executed put your dependent JS here
// });

var sparklineResource = require(['https://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js'], function(){

    $(".sparkline").sparkline([10,12,12,9,7], {
        type: 'bullet'});
    
});

// require('https://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js');

//Hardcoded stuff
var procDefId = "invoice:2:2a152b09-5366-11e8-8246-54ee7557b990";

//Define colors

var htmlText12 = '<div class="sparkline">';
var htmlText22 = 'My text2';
var htmlText32 = 'My text2';
var htmlText42 = 'My text3';
var htmlText52 = '</div>';
var htmlText2 = htmlText12 + htmlText52;

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
                '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', 'processDiagram',
                function($scope, $http, Uri, control, processData, pageData, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var overlaysNodes = {};

                    // console.log('colors loaded twice, yayyyyyy');
                    
                    // console.log("Display overlay:");
                    //console.log(viewer,overlays,elementRegistry);
                    console.log('Here trice met een h comes the duration data');

                    function millisToMinutes(millis) {
                        return millis / 60000;
                    }

                    $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" +
                                        "procDefId=" + procDefId))
                        .success(function(data) {
                            $scope.processActivityStatistics = data;
                            // console.log($scope.processActivityStatistics);
                            console.log('Here trice met een h comes the duration data');

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
                                            top: -30,
                                            left: 30
                                            },
                                            show: {
                                              minZoom: -Infinity,
                                              maxZoom: +Infinity
                                            },
                                            html: $overlayHtml
                                        });
                                }
        
                                for (var i = 0; i < $scope.processActivityStatistics.length; i++) {
                                    if ($scope.processActivityStatistics[i].id == element.id) {
                                        console.log('Its the same');
                                        console.log($scope.processActivityStatistics[i].id);
                                        console.log(element.id);
                                        var getAvgDuration = millisToMinutes($scope.processActivityStatistics[i].avgDuration);
                                        var getMinDuration = millisToMinutes($scope.processActivityStatistics[i].minDuration);
                                        var getMaxDuration = millisToMinutes($scope.processActivityStatistics[i].maxDuration);
                                        if (getAvgDuration != null && getMinDuration != null && getMaxDuration != null) {
                                            // var htmlText2 = getAvgDuration.toString();
                                            // var htmlText3 = getMinDuration.toString();
                                            // var htmlText4 = getMaxDuration.toString();
                                            // var htmlText = htmlText1 + 'Avg:' + htmlText2 + ' min <br>' + 'Min:' +  htmlText3 + ' min <br>' + 'Max:' +  htmlText4 + ' min' + htmlText5;
                                            addColorToId(element.id, htmlText2);
                                        }
                                        
                                        break;
                                    }
                                }                        
                            });

                            
                        });

                    
                    


                    
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.bulletgraph', []);

    ngModule.config(Configuration);

    return ngModule;
});
