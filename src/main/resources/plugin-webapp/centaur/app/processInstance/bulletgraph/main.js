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
     * retrieve the common file containing variables functions
     */
    var commonBulletgraph = util.commonBulletgraph = require('../../common/bulletgraph');

    /**
     * retrieve the common file containing conversion functions
     */
    commonBulletgraph.commonConversion  = require('../../common/conversion');

    /**
     * retrieve the common file containing option functions
     */
    commonBulletgraph.commonOptions  = require('../../common/options');

    /**
     * retrieve the common file containing overlay functions
     */
    commonBulletgraph.commonOverlays = require('../../common/overlays');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = [
        '$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {
            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');
            commonBulletgraph.commonOverlays.canvas = viewer.get('canvas');

            commonBulletgraph.procDefId = $scope.$parent.processDefinition.id;
            commonBulletgraph.procInstanceId = $scope.$parent.processInstance.id;

            var putBulletGraph = function() {
                var processActivityStatistics = {};
                var instanceStartTime = {};
                commonBulletgraph.bulletgraph(commonBulletgraph, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays, function(data) {
                    processActivityStatistics = data[0].data;
                    instanceStartTime = data[1].data;
                    util.extractDiagram(util, processActivityStatistics, instanceStartTime, $window, elementRegistry, processDiagram, overlays);
                });
            };
            putBulletGraph();

            util.commonBulletgraph.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], putBulletGraph);
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
