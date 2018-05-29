/**
 * Displays the current, average and maximal duration of a process onto the
 * process diagram of Camunda.
 *
 * TODO: Description.
 *
 * @author Lukas Ant, Tim Hübener.
 * @since  22.05.2018 in Testing
 */

'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\centaur\app\demoText\brain.js');

//Hardcoded stuff
var procDefId = "invoice:2:e163823d-4ecc-11e8-856a-104a7d534b93";

define(['require', 'angular', './bullet'], function (require, angular) {

    //var d3 = require('./d3');

    var bullet = require('./bullet');

    var Configuration = ['ViewsProvider', function (ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
                function ($scope, $http, Uri, control, processData, pageData, $q, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var overlaysNodes = {};

                    var procDefId = $scope.$parent.processDefinition.id;


                    /**
                     * Converts variable to String.
                     * @param   Number  toConvert   Variable to be converted.
                     * @return  String              String representation of toConvert
                     * TODO: make into service
                     */
                    function converToString(toConvert) {
                        return toConvert.toString();
                    }

                    /**
                     * Adds text to specified diagram element.
                     * @param   String  elementId   ID of diagram element
                     * @param   Number  text        The text to be displayed
                     * @param   Object  shape       Shape of the element
                     * TODO: make into service
                     */
                    function addHTMLToId(elementId, text, shape) {
                        var $overlayHtml =
                            $(text)
                                .css({
                                    width: 'auto',
                                    height: 'auto'
                                });

                        overlays.add(elementId, {
                            position: {
                                top: -40,
                                left: 30
                            },
                            show: {
                                minZoom: -Infinity,
                                maxZoom: +Infinity
                            },
                            html: $overlayHtml
                        });
                    }

                    /**
                     * Calculates the current duration of a instance of a process.
                     *
                     * The database only keeps track of the starting time of each
                     * process. So we calculate the current duration of each process.
                     *
                     * @param   Number  instance    Instance of a process
                     * @param   String  elementId   ID of diagram element that represents instance
                     */
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

                    /**
                     * Decides which time unit to use.
                     *
                     * The database keeps track of the duration in milli seconds.
                     * Since a discision has to be made to show in the bulletgraph,
                     * this determines which time unit (seconds, minutes,
                     * hours, days, weeks) should be used.
                     *
                     * @param   Number  time      duration of process
                     * @return  String            time unit choice
                     */
                    function checkTimeUnit(time) {
                        if (time > 1000 && time < 60001) {
                            return 'seconds';
                        } else if (time > 60000 && time < 1440001) {
                            return 'minutes';
                        } else if (time > 1440000 && time < 34560001) {
                            return 'hours';
                        } else if (time > 34560000 && time < 241920001) {
                            return 'days';
                        } else if (time > 241920000) {
                            return 'weeks';
                        } else {
                            return 'ms';
                        }
                    }

                    /**
                     * Convert the duration into the chosen time unit.
                     *
                     * The database keeps track of the duration in milli seconds.
                     * This is difficult to read in the diagram, so we convert the
                     * milli senconds into following intervals: seconds, minutes,
                     * hours, days, weeks to make it easier to read. The choice
                     * determines which time unit to use.
                     *
                     * @param   Number  duration      duration of process
                     * @param   String  choice        choice of time unit
                     * @return  Number                duration as Integer
                     */
                    function convertTimes(duration, choice) {
                        if (choice == 'seconds') {
                            return (Math.round(duration / 1000 * 10) / 10);
                        } else if (choice == 'minutes') {
                            return (Math.round(duration / 6000 * 10) / 10);
                        } else if (choice == 'hours') {
                            return (Math.round(duration / 1440000 * 10) / 10);
                        } else if (choice == 'days') {
                            return (Math.round(duration / 34560000 * 10) / 10);
                        } else if (choice == 'weeks') {
                            return (Math.round(duration / 241920000 * 10) / 10);
                        } else {
                            return duration;
                        }
                    }

                    /**
                     * Combines all information of given process into a HTML line
                     * which will be added to the HTML file. It will also set the graphsettings
                     * which will be written to the class which is created in the HTML line.
                     *
                     * This function receives all duration information about a given process.
                     * If any conditions which are defined in a seperate checkConditions() function
                     * isn't satisfied, the bulletgraph will not display.
                     * An HTML line will be passed to the addTextToId() function 
                     * so that an class which includes an elementID will be added to the HTML file.
                     * Information which has has been collected will be passed to the setGraphSettings()
                     * function. Here it will create a bullet graph on he HTML line which has been
                     * passed into the HTML file previously.
                     *
                     * @param   Number  minDuration   minimal duration of process
                     * @param   Number  avgDuration   average duration of process
                     * @param   Number  maxDuration   maximal duration of process
                     * @param   Number  curDuration   current duration of process
                     * @param   String  elementID     ID of element
                     * @param   Object  shape         Shape of the element
                     */
                    function combineBulletgraphElements(minDuration, avgDuration, maxDuration, curDuration, elementID, shape) {
                        if (checkConditions(minDuration, avgDuration, maxDuration, curDuration)) {
                            var timeChoice = checkTimeUnit(maxDuration);
                            var minDuration = convertTimes(minDuration, timeChoice);
                            var avgDuration = convertTimes(avgDuration, timeChoice);
                            var maxDuration = convertTimes(maxDuration, timeChoice);
                            var curDuration = convertTimes(curDuration, timeChoice);
                            var colorBullet = determineColor(avgDuration, maxDuration, curDuration);
                            addHTMLToId(elementID, createHTML(elementID), shape);
                            setGraphSettings(elementID, maxDuration, checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet);
                        }
                    }

                    /**
                     * This function will check if the conditions to show the bulletgraph are
                     * satisfied.
                     *
                     * The conditions to show the bulletgraph are satisfied if:
                     * - Any of the duration variables are not equal to NULL
                     * - The average duration is not equal to '0'.
                     *
                     * @param   Number  minDuration   minimal duration of process
                     * @param   Number  avgDuration   average duration of process
                     * @param   Number  maxDuration   maximal duration of process
                     * @param   Number  curDuration   current duration of process
                     * @return  Boolean               if condtions are satisfied or not
                     */
                    function checkConditions(minDuration, avgDuration, maxDuration, curDuration) {
                        if (avgDuration != null && minDuration != null && maxDuration != null  && curDuration != null && avgDuration != '0') {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    /**
                     * Creates an HTML line with has a class that includes the elementID
                     * @param   String  elementID   Variable to be converted.
                     * @return  String              A string which represents an HTML line which will be added later
                     */
                    function createHTML(elementID) {
                        return '<div class="bullet-duration-' + elementID + '"> </div>';
                    }

                    /**
                     * This function decides which color the bullet graph should have on the following
                     * conditions which are specified in the URD:
                     * - Green: If the current duration is less or equal to the average and maximal duration
                     * - Orange: If the current duration is less or equal to the maximal duration and greater than the average duration
                     * - Red: If he current duration is greater than both the average durationa and the maximal duration
                     * @param   Number  avgDuration   average duration of process
                     * @param   Number  maxDuration   maximal duration of process
                     * @param   Number  curDuration   current duration of process
                     * @return  String              A string which represents the color
                     */
                    function determineColor(avgDuration, maxDuration, curDuration) {
                        if (curDuration <= maxDuration && curDuration <= avgDuration) {
                            return 'green';
                        } else if (curDuration <= maxDuration && curDuration > avgDuration) {
                            return 'orange';
                        } else {
                            return 'red';
                        }
                    }

                    /**
                     * This function checks if the current duration is greater or equal to the maximal duration
                     * since the bullet graph should not exceed the maximal duration.
                     * @param   Number  maxDuration   maximal duration of process
                     * @param   Number  curDuration   current duration of process
                     * @return  Number                either current duration or maximal duration
                     */
                    function checkIfCurBiggerMax(curDuration, maxDuration) {
                        if (curDuration >= maxDuration) {
                            return maxDuration;
                        } else {
                            return curDuration;
                        }
                    }

                    /**
                     * This function combines all information passed into it to set the settings
                     * of the bullet graph. This function is made from the code which is provided
                     * on the following github: https://gist.github.com/mbostock/4061961#file-bullet-js (accesed on 29-5-2018).
                     * The functions which we included are coming also from this github repository.
                     * Additionally we are also using the D3 library (https://d3js.org/).
                     *
                     * This function adds the bulletgraph to the html class which is defined in a seperate function. 
                     * The same function will be selected by using the elementID. In the data variable, the data for
                     * the bulletgraph will be set. This data includes the range, the current value and the marker value.
                     *
                     * @param   String  elementID     ID of element
                     * @param   Number  rangeBullet   range of bulletgraph
                     * @param   Number  currentBullet current value of bulletgraph
                     * @param   Number  markerBullet  marker value of bulletgraph
                     * @param   Number  colorBullet   color of bulletgraph
                     */
                    function setGraphSettings(elementID, rangeBullet, currentBullet, markerBullet, colorBullet) {
                        var cssClass = '.bullet-duration-' + elementID;
                        var data = [
                            {
                                "ranges": [rangeBullet],
                                "measures": [currentBullet, currentBullet],
                                "markers": [markerBullet]
                            }
                        ];
                        var container = d3.select(cssClass).node().getBoundingClientRect();
                        var margin = { top: 5, right: 5, bottom: 15, left: 5 },
                            width = 100 - margin.left - margin.right,
                            height = 40 - margin.top - margin.bottom;

                        var chart = d3.bullet(width, height)
                            .width(width)
                            .height(height);

                        var svg = d3.select(cssClass).selectAll("svg")
                            .data(data)
                            .enter().append("svg")
                            .attr("class", "bullet")
                            .attr("width", 100)
                            .attr("height", 40)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                            .call(chart);

                        var coloring = d3.select(cssClass).selectAll("rect.measure.s1")
                            .attr("fill", colorBullet)
                    }

                    /*
                     * Angular http.get promises that wait for a JSON object of
                     * the process activity and the instance start time.
                     */
                    $scope.processActivityStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" + "procDefId=" + procDefId), {
                        catch: false
                    });
                    $scope.instanceStartTime_temp = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"), {
                        catch: false
                    });

                    /**
                     * Waits until data is received from http.get request and
                     * added to promises.
                     *
                     * Database quersies take a relative long time. So we have to
                     * wait until the data is retrieved before we can continue.
                     *
                     * @param   Object  data   minimal duration of process
                     */
                    $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function (data) {
                        $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
                        $scope.instanceStartTime = data[1];

                        /**
                         * Extracts data from JSON objects and calls composeHTML()
                         * function to add the extracted to the diagram.
                         *
                         * @param   Object  shape   shape of element
                         * TODO: refactor out into seperate function
                         */
                        elementRegistry.forEach(function (shape) {
                            var element = processDiagram.bpmnElements[shape.businessObject.id];
                            for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                                if ($scope.processActivityStatistics.data[i].id == element.id) {
                                    var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                                    var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                                    var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                                    var getCurDuration = calculateCurDuration($scope.instanceStartTime.data, element.id);

                                    combineBulletgraphElements(getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);
                                    break;
                                }
                            }
                        });
                    });
                }
            ]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.bulletgraph', []);

    ngModule.config(Configuration);

    return ngModule;
});