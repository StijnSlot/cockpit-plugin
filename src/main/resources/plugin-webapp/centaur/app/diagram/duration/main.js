'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\centaur\app\demoText\brain.js');

//Hardcoded stuff

//Define colors

var htmlText1 = '<div class="durationText">';
var htmlText2 = 'My text2';
var htmlText3 = 'My text2';
var htmlText4 = 'My text3';
var htmlText5 = '</div>';
var htmlText = htmlText1 + htmlText2 + '<br>' + htmlText3 + '<br>' + htmlText4 + htmlText5;

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

                    var procDefId = $scope.$parent.processDefinition.id;
                    
                    //console.log("Display overlay:");
                    //console.log(viewer,overlays,elementRegistry);

                    function millisToMinutes(millis) {
                        return millis / 60000;
                    }

                    function getStartTime(){
                        console.log("getStartTime");
                        $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"))
                                .success(function(data) {
                                    $scope.instanceStartTime = data;
                                    console.log($scope.instanceStartTime);
                                });
                        console.log("StartTime received");
                        console.log($scope.instanceStartTime);
                        return $scope.instanceStartTime;
                    }

                    $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" +
                                        "procDefId=" + procDefId))
                        .success(function(data) {
                            $scope.processActivityStatistics = data;

                            $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"))
                                .success(function(data) {
                                    $scope.instanceStartTime = data;
                                    console.log($scope.instanceStartTime);

                                    console.log("StartTime received");

                                    //console.log($scope.processActivityStatistics);

                                    elementRegistry.forEach(function(shape) { 
                                        var element = processDiagram.bpmnElements[shape.businessObject.id];
                                        //console.log(element.id);
                
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
                                                    left: -30
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
                                                // console.log('Its the same');
                                                // console.log($scope.processActivityStatistics[i].id);
                                                console.log(element.id);
                                                var getAvgDuration = millisToMinutes($scope.processActivityStatistics[i].avgDuration);
                                                var getMinDuration = millisToMinutes($scope.processActivityStatistics[i].minDuration);
                                                var getMaxDuration = millisToMinutes($scope.processActivityStatistics[i].maxDuration);

                                                var getCurrentTime = 'not found';

                                                for (var j = 0; j < $scope.instanceStartTime.length; j++) {
                                                    if ($scope.instanceStartTime[j].activityId == element.id) {
                                                        var getCurrentTime = $scope.instanceStartTime[j].startTime;
                                                        var getCurrentTimeMS = Date.parse(getCurrentTime);
                                                        var getComputerTime = new Date();
                                                        var getComputerTimeMS = getComputerTime.getTime();
                                                        var getActualTime = getComputerTimeMS - getCurrentTimeMS;
                                                        var getActualTime = millisToMinutes(getActualTime);
                                                        break;
                                                    }
                                                }

                                                console.log(getCurrentTime);

                                                if (getAvgDuration != null && getMinDuration != null && getMaxDuration != null && getAvgDuration != '0') {
                                                    var htmlText2 = getAvgDuration.toString();
                                                    var htmlText3 = getMinDuration.toString();
                                                    var htmlText4 = getMaxDuration.toString();
                                                    var htmlText4222 = getActualTime.toString();
                                                    var htmlText = htmlText1 + 'Avg:' + htmlText2 + ' min <br>' + 'Min:' +  htmlText3 + ' min <br>' + 'Max:' +  htmlText4 + ' min <br>' + 'Cur:' + htmlText4222 + htmlText5;
                                                    addColorToId(element.id, htmlText);
                                                }
                                                break;
                                            }
                                        }                        
                                    });
                                });     
                        });  
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
