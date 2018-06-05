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
                '$scope', '$http', '$window', 'Uri', 'control', '$rootScope', 'processData', 'pageData', '$q', 'processDiagram',
                function ($scope, $http, $window, Uri, control, $rootScope, processData, pageData, $q, processDiagram) {
                    var viewer = control.getViewer();
                    var overlays = viewer.get('overlays');

                    var elementRegistry = viewer.get('elementRegistry');

                    var procDefId = $scope.$parent.processDefinition.id;                    
                    util.procDefId = procDefId;

                    util.duration(util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays);

                    // subscribe to any broadcast KPI options change
                    $rootScope.$on("cockpit.plugin.centaur:options:KPI-change", function () {
                        util.duration(util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays);
                    });



                }
            ]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
