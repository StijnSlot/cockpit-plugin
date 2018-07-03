define(['require', 'angular', '../../../common/bulletlibraries', './util', '../../../common/conversion',
    '../../../common/options', '../../../common/overlays', '../../../common/bulletgraph'], function (require, angular) {
    /**
     * retrieve the bullet file contains the D3 library and functions which are needed for the bullet graphs
     * from github: https://gist.github.com/mbostock/4061961#file-bullet-js (accessed 30-5-2018)
     * and D3 library: https://d3js.org/ (accessed 30-5-2018).
     */
    require('../../../common/bulletlibraries');

    /**
     * retrieve the common util files
     */
    var util = require('./util');
    var common = require('../../../common/bulletgraph');
    common.commonConversion  = require('../../../common/conversion');
    common.commonOptions  = require('../../../common/options');
    common.commonOverlays = require('../../../common/overlays');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {
            util.procDefId = $scope.$parent.processDefinition.id;

            putBulletGraph();
            common.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], putBulletGraph);

            function putBulletGraph() {
                util.bulletgraph(common, $http, $window.localStorage, Uri, $q, control, processDiagram)
            }
        }
    ];

  /**
   * Configuration object that places plugin
   */
  var Configuration = ['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
      id: 'runtime',
      priority: 30,
      label: 'Runtime',
      overlay: overlay
    });
  }];

  var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.overview.bulletgraph', []);

  ngModule.config(Configuration);

  return ngModule;
});
