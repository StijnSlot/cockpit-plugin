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
                        // return millis / 60000;
                        return millis;
                    }

                    function converToString(toConvert) {
                        return toConvert.toString();
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

                    function addTextToId(elementId, duration, shape) {
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

                    function calculateCurDuration(instance, elementID) {
                        for (var j = 0; j < instance.length; j++) {
                            if (instance[j].activityId == elementID) {
                                var startTime = Date.parse(instance[j].startTime);
                                var computerTime = new Date().getTime();
                                var timeDifference = millisToMinutes(computerTime - startTime);
                                return timeDifference;
                                break;
                            }
                        }
                    }

                    function checkTimes(duration) {
                        if (duration > 1000 && duration < 60001) {
                            var durationHTML = (converToString(Math.round(duration / 1000))) + ' seconds';
                        } else if (duration > 60000 && duration < 1440001) {
                            var durationHTML = (converToString(Math.round(duration / 6000))) + ' minutes';
                        } else if (duration > 1440000) {
                            var durationHTML = (converToString(Math.round(duration / 1440000))) + ' hours';
                        } else {
                            var durationHTML = converToString(duration) + ' ms';
                        }
                        return durationHTML;
                    }

                    function composeHTML(minDuration, avgDuration, maxDuration, curDuration, elementID, shape) {
                        if (avgDuration != null && minDuration != null && maxDuration != null && avgDuration != '0') {
                            var minDurationHTML = checkTimes(minDuration);
                            var avgDurationHTML = checkTimes(avgDuration);
                            var maxDurationHTML = checkTimes(maxDuration);
                            var curDurationHTML = checkTimes(curDuration);
                            var htmlText = '<div class="durationText"> Cur: ' + curDurationHTML + ' <br> Avg: ' + avgDurationHTML + ' <br>' + 'Min: ' +  minDurationHTML + ' <br>' + 'Max: ' +  maxDurationHTML + '</div>';
                            addTextToId(elementID, htmlText, shape);
                        }
                    }

                    $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" +
                                        "procDefId=" + procDefId))
                        .success(function(data) {
                            $scope.processActivityStatistics = data;

                            $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"))
                                .success(function(data) {
                                    $scope.instanceStartTime = data;

                                    elementRegistry.forEach(function(shape) { 
                                        var element = processDiagram.bpmnElements[shape.businessObject.id];


                                        for (var i = 0; i < $scope.processActivityStatistics.length; i++) {
                                            if ($scope.processActivityStatistics[i].id == element.id) {
                                                var getAvgDuration = millisToMinutes($scope.processActivityStatistics[i].avgDuration);
                                                var getMinDuration = millisToMinutes($scope.processActivityStatistics[i].minDuration);
                                                var getMaxDuration = millisToMinutes($scope.processActivityStatistics[i].maxDuration);
                                                var getCurDuration = calculateCurDuration($scope.instanceStartTime, element.id);

                                                composeHTML(getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);                                                
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
