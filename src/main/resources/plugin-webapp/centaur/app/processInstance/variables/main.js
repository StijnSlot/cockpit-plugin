'use strict';

define(['require', 'angular', '../../common/options', '../../common/variables', '../../common/overlays'], function(require, angular) {

    /**
     * get common util functionality
     */
    var commonVariable = require('../../common/variables');
    var commonOptions = commonVariable.commonOptions = require('../../common/options');
    commonVariable.commonOverlays = require('../../common/overlays');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$q', '$http', '$window', 'Uri', 'control', 'processDiagram',
        function($scope, $q, $http, $window, Uri, control, processDiagram) {

            // process definition id is set (HARDCODED nr. of parents)
            commonVariable.procDefId = $scope.$parent.processDefinition.id;
            var procInstanceId = commonVariable.procInstanceId = $scope.$parent.processInstance.id;

            var request1 = function(element) {
                return Uri.appUri("engine://engine/:engine/execution" +
                    "?processInstanceId=" + procInstanceId +
                    "&activityId=" + element.id)
            };

            var request2 = function(execution) {
                return Uri.appUri("engine://engine/:engine/execution/" +
                    execution.id + "/localVariables")
            };

            var addInstanceVar = function() {
                commonVariable.addVariables($window.localStorage, $q, $http, control, processDiagram, request1, request2, commonVariable)
            };
            addInstanceVar();

            // add subscriptions to changes in the options
            var subscriptions = ["cockpit.plugin.centaur:options:variable-change", "cockpit.plugin.centaur:options:var-num-change",
                    "cockpit.plugin.centaur:options:KPI-change"];
            commonOptions.register($scope, subscriptions, addInstanceVar);
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
