/**
* Adds a counter to CallActivity tasks.
*
* Camunda has the ability to have a task call multiple tasks in sequence or
* parallel. However, the amount of tasks called it not displayed in the diagram
* by default. This module adds a counter to display this number at the bottom
* right of a call activity task.
*
* @author Tim Hübener
* @since  23.05.2018 in progress
* @since  31.05.2018 in testing
*/

'use strict';

define(['require', 'angular', './util', '../../common/overlays', '../../common/options'], function(require, angular) {

    var util = require('./util');

    util.commonOverlays = require('../../common/overlays');

    util.commonOptions = require('../../common/options');

    var overlay = ['$scope', '$http', 'Uri', 'control', '$q', 'processDiagram', '$window',
        function($scope, $http, Uri, control, $q, processDiagram, $window) {
            util.procDefId = $scope.$parent.processDefinition.id;

            var setCounter = function() {
                util.getCounterData($window.localStorage, $http, Uri, control, processDiagram, util);
            };
            setCounter();

            util.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], setCounter);
        }
    ];

    /**
    * Configuration object that places plugin
    */
    var Configuration = ['ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.counter', []);

    ngModule.config(Configuration);

    return ngModule;
});
