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

// Load D3 library
var bulletgraphResource = require(['https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'], function () { });

define(['angular'], function (angular) {

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

                    //ADDED

                    (function () {

                        // Chart design based on the recommendations of Stephen Few. Implementation
                        // based on the work of Clint Ivy, Jamie Love, and Jason Davies.
                        // http://projects.instantcognition.com/protovis/bulletchart/
                        d3.bullet = function () {
                            var orient = "left", // TODO top & bottom
                                reverse = false,
                                duration = 0,
                                ranges = bulletRanges,
                                markers = bulletMarkers,
                                measures = bulletMeasures,
                                width = 380,
                                height = 30,
                                tickFormat = null;

                            // For each small multiple…
                            function bullet(g) {
                                g.each(function (d, i) {
                                    var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
                                        markerz = markers.call(this, d, i).slice().sort(d3.descending),
                                        measurez = measures.call(this, d, i).slice().sort(d3.descending),
                                        g = d3.select(this);

                                    // Compute the new x-scale.
                                    var x1 = d3.scale.linear()
                                        .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
                                        .range(reverse ? [width, 0] : [0, width]);

                                    // Retrieve the old x-scale, if this is an update.
                                    var x0 = this.__chart__ || d3.scale.linear()
                                        .domain([0, Infinity])
                                        .range(x1.range());

                                    // Stash the new scale.
                                    this.__chart__ = x1;

                                    // Derive width-scales from the x-scales.
                                    var w0 = bulletWidth(x0),
                                        w1 = bulletWidth(x1);

                                    // Update the range rects.
                                    var range = g.selectAll("rect.range")
                                        .data(rangez);

                                    range.enter().append("rect")
                                        .attr("class", function (d, i) { return "range s" + i; })
                                        .attr("width", w0)
                                        .attr("height", height)
                                        .attr("x", reverse ? x0 : 0)
                                        .transition()
                                        .duration(duration)
                                        .attr("width", w1)
                                        .attr("x", reverse ? x1 : 0);

                                    range.transition()
                                        .duration(duration)
                                        .attr("x", reverse ? x1 : 0)
                                        .attr("width", w1)
                                        .attr("height", height);

                                    // Update the measure rects.
                                    var measure = g.selectAll("rect.measure")
                                        .data(measurez);

                                    measure.enter().append("rect")
                                        .attr("class", function (d, i) { return "measure s" + i; })
                                        .attr("width", w0)
                                        .attr("height", height / 3)
                                        .attr("x", reverse ? x0 : 0)
                                        .attr("y", height / 3)
                                        .transition()
                                        .duration(duration)
                                        .attr("width", w1)
                                        .attr("x", reverse ? x1 : 0);

                                    measure.transition()
                                        .duration(duration)
                                        .attr("width", w1)
                                        .attr("height", height / 3)
                                        .attr("x", reverse ? x1 : 0)
                                        .attr("y", height / 3);

                                    // Update the marker lines.
                                    var marker = g.selectAll("line.marker")
                                        .data(markerz);

                                    marker.enter().append("line")
                                        .attr("class", "marker")
                                        .attr("x1", x0)
                                        .attr("x2", x0)
                                        .attr("y1", height / 6)
                                        .attr("y2", height * 5 / 6)
                                        .transition()
                                        .duration(duration)
                                        .attr("x1", x1)
                                        .attr("x2", x1);

                                    marker.transition()
                                        .duration(duration)
                                        .attr("x1", x1)
                                        .attr("x2", x1)
                                        .attr("y1", height / 6)
                                        .attr("y2", height * 5 / 6);

                                    // Compute the tick format.
                                    var format = tickFormat || x1.tickFormat(8);

                                    // Update the tick groups.
                                    var tick = g.selectAll("g.tick")
                                        .data(x1.ticks(8), function (d) {
                                            return this.textContent || format(d);
                                        });

                                    // Initialize the ticks with the old scale, x0.
                                    var tickEnter = tick.enter().append("g")
                                        .attr("class", "tick")
                                        .attr("transform", bulletTranslate(x0))
                                        .style("opacity", 1e-6);

                                    tickEnter.append("line")
                                        .attr("y1", height)
                                        .attr("y2", height * 7 / 6);

                                    tickEnter.append("text")
                                        .attr("text-anchor", "middle")
                                        .attr("dy", "1em")
                                        .attr("y", height * 7 / 6)
                                        .text(format);

                                    // Transition the entering ticks to the new scale, x1.
                                    tickEnter.transition()
                                        .duration(duration)
                                        .attr("transform", bulletTranslate(x1))
                                        .style("opacity", 1);

                                    // Transition the updating ticks to the new scale, x1.
                                    var tickUpdate = tick.transition()
                                        .duration(duration)
                                        .attr("transform", bulletTranslate(x1))
                                        .style("opacity", 1);

                                    tickUpdate.select("line")
                                        .attr("y1", height)
                                        .attr("y2", height * 7 / 6);

                                    tickUpdate.select("text")
                                        .attr("y", height * 7 / 6);

                                    // Transition the exiting ticks to the new scale, x1.
                                    tick.exit().transition()
                                        .duration(duration)
                                        .attr("transform", bulletTranslate(x1))
                                        .style("opacity", 1e-6)
                                        .remove();
                                });
                                d3.timer.flush();
                            }

                            // left, right, top, bottom
                            bullet.orient = function (x) {
                                if (!arguments.length) return orient;
                                orient = x;
                                reverse = orient == "right" || orient == "bottom";
                                return bullet;
                            };

                            // ranges (bad, satisfactory, good)
                            bullet.ranges = function (x) {
                                if (!arguments.length) return ranges;
                                ranges = x;
                                return bullet;
                            };

                            // markers (previous, goal)
                            bullet.markers = function (x) {
                                if (!arguments.length) return markers;
                                markers = x;
                                return bullet;
                            };

                            // measures (actual, forecast)
                            bullet.measures = function (x) {
                                if (!arguments.length) return measures;
                                measures = x;
                                return bullet;
                            };

                            bullet.width = function (x) {
                                if (!arguments.length) return width;
                                width = x;
                                return bullet;
                            };

                            bullet.height = function (x) {
                                if (!arguments.length) return height;
                                height = x;
                                return bullet;
                            };

                            bullet.tickFormat = function (x) {
                                if (!arguments.length) return tickFormat;
                                tickFormat = x;
                                return bullet;
                            };

                            bullet.duration = function (x) {
                                if (!arguments.length) return duration;
                                duration = x;
                                return bullet;
                            };

                            return bullet;
                        };

                        function bulletRanges(d) {
                            return d.ranges;
                        }

                        function bulletMarkers(d) {
                            return d.markers;
                        }

                        function bulletMeasures(d) {
                            return d.measures;
                        }

                        function bulletTranslate(x) {
                            return function (d) {
                                return "translate(" + x(d) + ",0)";
                            };
                        }

                        function bulletWidth(x) {
                            var x0 = x(0);
                            return function (d) {
                                return Math.abs(x(d) - x0);
                            };
                        }

                    })();

                    //ADDED

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
                     * @param   Number  elementId   ID of diagram element
                     * @param   Number  text        The text to be displayed
                     * @param   Object  shape       Shape of the element
                     * TODO: make into service
                     */
                    function addTextToId(elementId, text, shape) {
                        var $overlayHtml =
                            $(text)
                                .css({
                                    width: 'auto',
                                    height: 'auto'
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

                    /**
                     * Calculates the current duration of a instance of a process.
                     *
                     * The database only keeps track of the starting time of each
                     * process. So we calculate the current duration of each process.
                     *
                     * @param   Number  instance    Instance of a process
                     * @param   Number  elementId   ID of diagram element that represents instance
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
                     * Decides which time interval to use.
                     *
                     * The database keeps track of the duration in milli seconds.
                     * This is difficult to read in the diagram, so we convert the
                     * milli senconds into following intervals: seconds, minutes,
                     * hours, days, weeks to make it easier to read.
                     *
                     * @param   Number  duration      duration of process
                     * @return  String  durationHTML  duration as String
                     */
                    function checkTimeStandard(duration) {
                        if (duration > 1000 && duration < 60001) {
                            return 'seconds';
                        } else if (duration > 60000 && duration < 1440001) {
                            return 'minutes';
                        } else if (duration > 1440000 && duration < 34560001) {
                            return 'hours';
                        } else if (duration > 34560000 && duration < 241920001) {
                            return 'days';
                        } else if (duration > 241920000) {
                            return 'weeks';
                        } else {
                            return 'ms';
                        }
                        return durationHTML;
                    }

                    function convertTimes(duration, choice) {
                        if (choice == 'seconds') {
                            var durationHTML = (Math.round(duration / 1000 * 10) / 10);
                        } else if (choice == 'minutes') {
                            var durationHTML = (Math.round(duration / 6000 * 10) / 10);
                        } else if (choice == 'hours') {
                            var durationHTML = (Math.round(duration / 1440000 * 10) / 10);
                        } else if (choice == 'days') {
                            var durationHTML = (Math.round(duration / 34560000 * 10) / 10);
                        } else if (choice == 'weeks') {
                            var durationHTML = (Math.round(duration / 241920000 * 10) / 10);
                        } else {
                            var durationHTML = duration;
                        }
                        return durationHTML;
                    }

                    /**
                     * Combines all information of given process into single
                     * String variable which is added to its diagram element.
                     *
                     * This function receives all duration information about a given process.
                     * If any of duration variables are NULL it does not create
                     * a hmtlText variable since there is nothing to display.
                     * Otherwise it checks which time intervall to use for each
                     * duration variable and combines them into one String variable, htmlText.
                     * The htmlText variable is passed to the addTextToId() function
                     * so that the duration varables are displayed next to the
                     * process diagram element.
                     *
                     * @param   Number  minDuration   minimal duration of process
                     * @param   Number  avgDuration   average duration of process
                     * @param   Number  maxDuration   maximal duration of process
                     * @param   Number  curDuration   current duration of process
                     * @param   Number  elementID     ID of element
                     * @param   Object  shape         Shape of the element
                     */
                    function composeHTML(minDuration, avgDuration, maxDuration, curDuration, elementID, shape) {
                        if (avgDuration != null && minDuration != null && maxDuration != null && avgDuration != '0') {
                            var timeChoice = checkTimeStandard(maxDuration);
                            var minDuration = convertTimes(minDuration, timeChoice);
                            var avgDuration = convertTimes(avgDuration, timeChoice);
                            var maxDuration = convertTimes(maxDuration, timeChoice);
                            if (curDuration != null) {
                                var curDuration = convertTimes(curDuration, timeChoice);
                                var htmlText = '<div class="bullet-duration-' + elementID + '"> </div>';
                                var colorBullet = determineColor(avgDuration, maxDuration, curDuration);
                                addTextToId(elementID, htmlText, shape);
                                setGraphSettings(elementID, maxDuration, checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet);
                            } else {
                                var curDuration = 0;
                            }


                        }
                    }

                    function determineColor(avgDuration, maxDuration, curDuration) {
                        if (curDuration <= maxDuration && curDuration <= avgDuration) {
                            return 'green';
                        } else if (curDuration <= maxDuration && curDuration > avgDuration) {
                            return 'orange';
                        } else {
                            return 'red';
                        }
                    }

                    function checkIfCurBiggerMax(curDuration, maxDuration) {
                        if (curDuration >= maxDuration) {
                            return maxDuration;
                        } else {
                            return curDuration;
                        }
                    }

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
                            height = 50 - margin.top - margin.bottom;

                        var chart = d3.bullet(width, height)
                            .width(width)
                            .height(height);

                        var svg = d3.select(cssClass).selectAll("svg")
                            .data(data)
                            .enter().append("svg")
                            .attr("class", "bullet")
                            .attr("width", 100)
                            .attr("height", 50)
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

                                    composeHTML(getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);
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