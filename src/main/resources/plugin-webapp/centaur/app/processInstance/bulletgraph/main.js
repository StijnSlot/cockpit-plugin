define(['require', 'angular', '../../common/bulletlibraries', '../../common/conversion', '../../common/options', '../../common/overlays', '../../common/variables', '../../common/bulletgraph'], function (require, angular) {

    /**
     * retrieve the bullet file containe the D3 library and functions which are needed for the bullet graphs
     * these functions from github: https://gist.github.com/mbostock/4061961#file-bullet-js (accessed 30-5-2018)
     * and D3 library: https://d3js.org/ (accessed 30-5-2018).
     */
    require('../../common/bulletlibraries');

    /**
     * retrieve the common file containing variables functions
     */
    var util = require('../../common/bulletgraph');

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
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = [
        '$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {
            util.procDefId  = $scope.$parent.processDefinition.id;
            util.procInstanceId = $scope.$parent.processInstance.id;

            var putBulletGraph = function() {
                util.bulletgraph(util, $http, $window.localStorage, Uri, $q, control, processDiagram);
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
