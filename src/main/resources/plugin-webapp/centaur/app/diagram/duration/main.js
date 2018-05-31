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


define(['require', 'angular', './util'], function (require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

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
                    var procDefId = $scope.$parent.processDefinition.id;

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
                     * @param   {Object}  data   minimal duration of process
                     */
                    $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function (data) {
                        $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
                        $scope.instanceStartTime = data[1];

                        /**
                         * Extracts data from JSON objects and calls composeHTML()
                         * function to add the extracted to the diagram.
                         *
                         * @param   {Object}  shape   shape of element
                         * TODO: refactor out into seperate function
                         */
                        elementRegistry.forEach(function (shape) {
                            var element = processDiagram.bpmnElements[shape.businessObject.id];
                            for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                                if ($scope.processActivityStatistics.data[i].id == element.id) {
                                    var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                                    var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                                    var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                                    var getCurDuration = util.calculateCurDuration($scope.instanceStartTime.data, element.id);

                                    util.composeHTML(util, overlays, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);
                                    break;
                                }
                            }
                        });
                    });
                }
            ]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
