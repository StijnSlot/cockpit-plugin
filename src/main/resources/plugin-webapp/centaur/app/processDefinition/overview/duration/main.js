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


define(['require', 'angular', './util', '../../../common/conversion', '../../../common/options', '../../../common/overlays', '../../../common/variables', '../../../common/duration'], function (require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * retrieve the common file containing conversion functions
     */
    util.commonConversion  = require('../../../common/conversion');

    /**
     * retrieve the common file containing option functions
     */
    util.commonOptions  = require('../../../common/options');

    /**
     * retrieve the common file containing overlay functions
     */
    util.commonOverlays = require('../../../common/overlays');

    /**
     * retrieve the common file containing variables functions
     */
    util.commonVariables = require('../../../common/variables');

    /**
     * retrieve the common file containing duration functions
     */
    util.commonDuration = require('../../../common/duration');

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
                    util.commonOverlays.canvas = viewer.get('canvas');

                    var elementRegistry = viewer.get('elementRegistry');

                    util.procDefId = $scope.$parent.processDefinition.id;

                    util.duration(util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays);

                    // subscribe to any broadcast KPI options change
                    var listener = $rootScope.$on("cockpit.plugin.centaur:options:KPI-change", function () {
                        util.duration(util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays);
                    });

                    $scope.$on("$destroy", function() {
                        listener();
                    });
                }
            ]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.overview.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
