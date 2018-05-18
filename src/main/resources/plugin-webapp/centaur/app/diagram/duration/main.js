'use strict';

define(['angular'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
                function($scope, $http, Uri, control, processData, pageData, $q, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var overlaysNodes = {};

                    var procDefId = $scope.$parent.processDefinition.id;

                    function converToString(toConvert) {
                        return toConvert.toString();
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
                                top: -40,
                                left: -40
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
                                var timeDifference = computerTime - startTime;
                                return timeDifference;
                                break;
                            }
                        }
                        return null;
                    }

                    function checkTimes(duration) {
                        if (duration > 1000 && duration < 60001) {
                            var durationHTML = (converToString(Math.round(duration / 1000 * 10) / 10)) + ' seconds';
                        } else if (duration > 60000 && duration < 1440001) {
                            var durationHTML = (converToString(Math.round(duration / 6000 * 10) / 10)) + ' minutes';
                        } else if (duration > 1440000 && duration < 34560001) {
                            var durationHTML = (converToString(Math.round(duration / 1440000 * 10) / 10)) + ' hours';
                        } else if (duration > 34560000 && duration < 241920001) {
                            var durationHTML = (converToString(Math.round(duration / 34560000 * 10) / 10)) + ' days';
                        } else if (duration > 241920000) {
                            var durationHTML = (converToString(Math.round(duration / 241920000 * 10) / 10)) + ' weeks';
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
                            if (curDuration != null) {
                                var curDurationHTML = checkTimes(curDuration);
                            } else {
                                var curDurationHTML = '-';
                            }
                            
                            var htmlText = '<div class="durationText"> Cur: ' + curDurationHTML + ' <br> Avg: ' + avgDurationHTML + ' <br>' + 'Max: ' +  maxDurationHTML + '</div>';
                            addTextToId(elementID, htmlText, shape);
                        }
                    }

                    $scope.processActivityStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" + "procDefId=" + procDefId), {catch: false});
                    $scope.instanceStartTime_temp = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"), {catch: false});

                    $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function(data){
                      $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
                      $scope.instanceStartTime = data[1];
                      elementRegistry.forEach(function(shape) {
                          var element = processDiagram.bpmnElements[shape.businessObject.id];
                          for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                              if ($scope.processActivityStatistics.data[i].id == element.id) {
                                  var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                                  var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                                  var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                                  var getCurDuration = calculateCurDuration($scope.instanceStartTime.data, element.id);

                                  composeHTML(getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);
                                  break;
                              }
                          }
                      });
                    });
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
