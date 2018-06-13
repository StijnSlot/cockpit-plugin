'use strict';

define(['require', 'angular', './util', '../../common/options', '../../common/variables', '../../common/overlays'], function(require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * get common util functionality
     */
    util.commonVariable = require('../../common/variables');
    util.commonOverlays = require('../../common/overlays');
    util.commonOptions = require('../../common/options');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $http, $window, $rootScope, Uri, control, processDiagram) {

            console.log('Overlay variables loaded');

            // process definition id is set (HARDCODED nr. of parents)
            util.procDefId = $scope.$parent.processDefinition.id;
            util.procInstanceId = $scope.$parent.processInstance.id;

            var addInstanceVar = function() {
                util.addInstanceVariables($window, $http, control, processDiagram, Uri, util)
            };
            addInstanceVar();

            var subscriptions =
                ["cockpit.plugin.centaur:options:variable-change",
                    "cockpit.plugin.centaur:options:var-num-change",
                    "cockpit.plugin.centaur:options:KPI-change"];
            util.commonOptions.register($scope, $rootScope, subscriptions, addInstanceVar);
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

    var ngModule = angular.module('cockpit.plugin.centaur.processInstance.variables', []);

    ngModule.config(Configuration);

    return ngModule;
});
