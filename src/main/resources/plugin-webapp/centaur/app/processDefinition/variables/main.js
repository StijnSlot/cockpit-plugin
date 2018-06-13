'use strict';

define(['require', 'angular', './util', '../../common/overlays', '../../common/variables', '../../common/options'], function(require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    util.commonVariable = require('../../common/variables');
    util.commonOverlays = require('../../common/overlays');
    util.commonOptions = require('../../common/options');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $http, $window, $rootScope, Uri, control, processDiagram) {

            // process definition id is set (HARDCODED nr. of parents)
            util.procDefId = $scope.$parent.processDefinition.id;

            var addProcessVar = function() {
                util.addProcessVariables($window, $http, control, processDiagram, Uri, util)
            };
            addProcessVar();

            var subscriptions =
                ["cockpit.plugin.centaur:options:variable-change",
                 "cockpit.plugin.centaur:options:var-num-change",
                  "cockpit.plugin.centaur:options:KPI-change"];
            util.commonOptions.register($scope, $rootScope, subscriptions, addProcessVar);
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
