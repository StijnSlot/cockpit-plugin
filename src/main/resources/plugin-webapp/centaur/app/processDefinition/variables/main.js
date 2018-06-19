'use strict';

define(['require', 'angular', '../../common/overlays', '../../common/variables', '../../common/options'], function(require, angular) {

    var commonVariable = require('../../common/variables');
    var commonOptions = commonVariable.commonOptions = require('../../common/options');
    commonVariable.commonOverlays = require('../../common/overlays');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$q', '$http', '$window', 'Uri', 'control', 'processDiagram',
        function($scope, $q, $http, $window, Uri, control, processDiagram) {

            // process definition id is set (HARDCODED nr. of parents)
            var procDefId = commonVariable.procDefId = $scope.$parent.processDefinition.id;

            var request1 = function(element) {
                return Uri.appUri("engine://engine/:engine/process-instance" +
                    "?processDefinitionId=" + procDefId +
                    "&activityIdIn=" + element.id)
            };

            var request2 = function(instance) {
                return Uri.appUri("engine://engine/:engine/process-instance/" +
                    instance.id + "/variables")
            };

            var addProcessVariables = function() {
                commonVariable.addVariables($window.localStorage, $q, $http, control, processDiagram, request1, request2, commonVariable)
            };
            addProcessVariables();

            // add subscriptions to changes in the options
            var subscriptions = ["cockpit.plugin.centaur:options:variable-change", "cockpit.plugin.centaur:options:var-num-change",
                    "cockpit.plugin.centaur:options:KPI-change"];
            commonOptions.register($scope, subscriptions, addProcessVariables);
        }
    ];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            label: 'Instance Variables',
            priority: 20,
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.variables', []);

    ngModule.config(Configuration);

    return ngModule;
});
