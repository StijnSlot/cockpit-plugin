define(['require', 'angular', '../../common/bulletlibraries', '../../common/conversion', '../../common/options', '../../common/overlays', '../../common/variables', '../../common/bulletgraph'], function (require, angular) {

    /**
     * If you need external javascript libraries, please uncomment the following line.
     */
    // require('../../common/some Library');

    /**
     * Retrieve the common util files. Please retrieve first the common file of your module.
     * Please change the name to the name of your desired module.
     */
    var util = require('../../common/myNewModule');

    /* Example of loading common files */

    // util.commonConversion  = require('../../common/conversion');
    // util.commonOptions  = require('../../common/options');
    // util.commonOverlays = require('../../common/overlays');
    
    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {
            util.procDefId  = $scope.$parent.processDefinition.id;

            var putMyNewModule = function() {
                util.myNewModule(util, $http, $window.localStorage, Uri, $q, control, processDiagram);
            };
            putMyNewModule();

            util.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], putMyNewModule);
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

  // TODO Change in ngModule the name 'myNewModule' to your module name
  var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.myNewModule', []);

  ngModule.config(Configuration);

  return ngModule;
});
