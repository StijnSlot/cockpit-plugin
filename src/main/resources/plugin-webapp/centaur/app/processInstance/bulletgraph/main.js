/**
 * Displays a bulletgraph which contains the current, average and maximum duration
 * of a process onto the process diagram of Camunda.
 *
 * @author Lukas Ant.
 * @since  30.05.2018 in Testing
 */

'use strict';

define(['require', 'angular', '../../common/bulletlibraries', './util', '../../common/conversion', '../../common/options', '../../common/overlays', '../../common/variables', '../../common/bulletgraph'], function (require, angular) {

    /**
     * retrieve the bullet file containe the D3 library and functions which are needed for the bullet graphs
     * these functions from github: https://gist.github.com/mbostock/4061961#file-bullet-js (accessed 30-5-2018)
     * and D3 library: https://d3js.org/ (accessed 30-5-2018).
     */
    require('../../common/bulletlibraries');

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * retrieve the common file containing conversion functions
     */
    util.commonConversion  = require('../../common/conversion');

    /**
     * retrieve the common file containing option functions
     */
    util.commonOptions  = require('../../common/options');

    /**
     * retrieve the common file containing overlay functions
     */
    util.commonOverlays = require('../../common/overlays');

    /**
     * retrieve the common file containing variables functions
     */
    util.commonVariables = require('../../common/variables');

    /**
     * retrieve the common file containing variables functions
     */
    util.commonBulletgraph = require('../../common/bulletgraph');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = [
        '$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {
            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');
            util.commonOverlays.canvas = viewer.get('canvas');

            util.procDefId = $scope.$parent.processDefinition.id;
            util.procInstanceId = $scope.$parent.processInstance.id;

            var putBulletGraph = function() {
                util.bulletgraph(util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays);
            };
            putBulletGraph();

            util.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], putBulletGraph);
        }
    ];

  /**
   * Configuration object that places plugin
   */
  var Configuration = ['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
      id: 'runtime',
      priority: 30,
      label: 'Process Instances',
      overlay: overlay
    });
  }];

  var ngModule = angular.module('cockpit.plugin.centaur.processInstance.bulletgraph', []);

  ngModule.config(Configuration);

  return ngModule;
});
