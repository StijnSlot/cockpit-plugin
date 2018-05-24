'use strict';

// $.getScript('https://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js', function() {
//     //script is loaded and executed put your dependent JS here
// });

var bulletgraphResource = require(['https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'], function () {

});

// require('https://omnipotent.net/jquery.sparkline/2.1.2/jquery.sparkline.js');

//Hardcoded stuff

//Define colors

var htmlText12 = '<div class="bullet-chart-container">';
var htmlText22 = 'My text2';
var htmlText32 = 'My text2';
var htmlText42 = 'My text3';
var htmlText52 = '</div>';
var htmlText2 = htmlText12 + htmlText52;

//Define events which change color

var redEvent = 'ServiceTask_1';
var orangeEvent = 'UserTask_1';
var greenEvent = 'ServiceTask_2';




define(['angular'], function (angular) {

    var Configuration = ['ViewsProvider', function (ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', 'processDiagram',
                function ($scope, $http, Uri, control, processData, pageData, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');
                    var elementRegistry = viewer.get('elementRegistry');
                    var overlaysNodes = {};

                    var procDefId = $scope.$parent.processDefinition.id;


                    // console.log('colors loaded twice, yayyyyyy');

                    // console.log("Display overlay:");
                    //console.log(viewer,overlays,elementRegistry);
                    console.log('Here trice met een h comes the duration data');

                    function millisToMinutes(millis) {
                        return millis / 60000;
                    }

                    $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" +
                        "procDefId=" + procDefId))
                        .success(function (data) {
                            $scope.processActivityStatistics = data;
                            // console.log($scope.processActivityStatistics);
                            console.log('Here trice met een h comes the duration data');


                            //ADDED

                            // Chart design based on the recommendations of Stephen Few. Implementation
                            // based on the work of Clint Ivy, Jamie Love, and Jason Davies.
                            // http://projects.instantcognition.com/protovis/bulletchart/
                            d3.bullet = function (width, height) {
                                var orient = "left", // TODO top & bottom
                                    reverse = false,
                                    duration = 0,
                                    ranges = bulletRanges,
                                    markers = bulletMarkers,
                                    measures = bulletMeasures,
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
                                            .attr("class", function (d, i) {
                                                return "range s" + i;
                                            })
                                            .attr("width", w0)
                                            .attr("height", 30)
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
                                            .attr("class", function (d, i) {
                                                return "measure s" + i;
                                            })
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
                                            .attr("height", height / 2)
                                            .attr("x", reverse ? x1 : 0)
                                            .attr("y", height / 4);

                                        var measureLabel = g.append('text')
                                            .attr('class', 'measure-label')
                                            .append('tspan')
                                            .attr('dy', '.3em')
                                            .text(measurez[0])
                                            .attr('x', 10)
                                            .attr('y', height / 2);


                                        // Update the marker lines.
                                        var marker = g.selectAll("line.marker")
                                            .data(markerz);

                                        marker.enter().append("line")
                                            .attr("class", "marker")
                                            .attr("x1", x0)
                                            .attr("x2", x0)
                                            .attr("y1", 0)
                                            .attr("y2", height)
                                            .transition()
                                            .duration(duration)
                                            .attr("x1", x1)
                                            .attr("x2", x1);

                                        marker.transition()
                                            .duration(duration)
                                            .attr("x1", x1)
                                            .attr("x2", x1)
                                            .attr("y1", 0)
                                            .attr("y2", height);

                                        // Compute the tick format.
                                        var format = tickFormat || x1.tickFormat(8);

                                        // Update the tick groups.
                                        var tick = g.selectAll("g.tick")
                                            .data(x1.ticks(4), function (d) {
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
                                    return "translate(" + -x(d) + ",0)";
                                };
                            }

                            function bulletWidth(x) {
                                var x0 = x(0);
                                return function (d) {
                                    return Math.abs(x(d) - x0);
                                };
                            }

                            //ADDED

                            elementRegistry.forEach(function (shape) {
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

                                            var data = [
                                                {
                                                    "title": "",
                                                    "subtitle": "",
                                                    "ranges": [300],
                                                    "measures": [220, 220],
                                                    "markers": [250]
                                                }
                                            ];
                                            var container = d3.select('.bullet-chart-container').node().getBoundingClientRect();
                                            var margin = { top: 5, right: 40, bottom: 20, left: 120 },
                                                width = container.width - margin.left - margin.right,
                                                height = 75 - margin.top - margin.bottom;

                                            var chart = d3.bullet(width, height)
                                                .width(width)
                                                .height(height);

                                            var svg = d3.select(".bullet-chart-container").selectAll("svg")
                                                .data(data)
                                                .enter().append("svg")
                                                .attr("class", "bullet")
                                                .attr("width", "auto")
                                                .attr("height", height + margin.top + margin.bottom)
                                                .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                                                .call(chart);

                                            var title = svg.append("g")
                                                .style("text-anchor", "end")
                                                .attr("transform", "translate(-6," + height / 2 + ")");

                                            title.append("text")
                                                .attr("class", "title")
                                                .text(function (d) { return d.title; });

                                            title.append("text")
                                                .attr("class", "subtitle")
                                                .attr("dy", "1em")
                                                .text(function (d) { return d.subtitle; });

                                            d3.selectAll("button").on("click", function () {
                                                svg.datum(randomize).call(chart.duration(1000)); // TODO automatic transition
                                            });


                                            function randomize(d) {
                                                if (!d.randomizer) d.randomizer = randomizer(d);
                                                d.ranges = d.ranges.map(d.randomizer);
                                                d.markers = d.markers.map(d.randomizer);
                                                d.measures = d.measures.map(d.randomizer);
                                                return d;
                                            }

                                            function randomizer(d) {
                                                var k = d3.max(d.ranges) * .2;
                                                return function (d) {
                                                    return Math.max(0, d + k * (Math.random() - .5));
                                                };
                                            }


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
