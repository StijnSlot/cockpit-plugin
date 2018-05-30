'use strict';

define(['require', 'angular', './util', '../../bottomTabs/options/util', '../../common/variableUtil'], function(require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');
    var commonUtil = require('../../common/variableUtil');

    /**
     * variable containing all ids of overlays created here
     */
    var optionsUtil = require('../../bottomTabs/options/util');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $http, $window, $rootScope, Uri, control, processDiagram) {

            // process definition id is set (HARDCODED nr. of parents)
            var procInstId = $scope.$parent.processInstance.id;
            commonUtil.procInstanceId = procInstId;

            // get overlay and elements from the diagram
            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');

            // get number of instance variables to show
            commonUtil.numValue = optionsUtil.getNumValue($window.localStorage, procDefId + "_var_num");

            // add the activity variable elements to the overlay
            util.addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri, commonUtil);

            // subscribe to any broadcast variables options change
            $rootScope.$on("cockpit.plugin.centaur:options:variable-change", function() {
                util.addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri, commonUtil)
            });

            // subscribe to any broadcast variable number changes
            $rootScope.$on("cockpit.plugin.centaur:options:var-num-change", function() {
                // get number of instance variables to show
                commonUtil.numValue = optionsUtil.getNumValue($window.localStorage, procDefId + "_var_num");

                util.addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri, commonUtil) });
        }
    ];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
            id: 'runtime',
            label: 'Process Instances',
            priority: 20,
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.processInstance', []);

    ngModule.config(Configuration);

    return ngModule;
});
