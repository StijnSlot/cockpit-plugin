define(['require', 'angular', '../../common/conversion', '../../common/options', '../../common/overlays', '../../common/duration'], function (require, angular) {
    /**
     * retrieve the common file containing duration functions
     */
    var util = require('../../common/duration');
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

    var overlay = [
        '$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {

            util.procDefId = $scope.$parent.processDefinition.id;
            util.procInstId = null;

            function setDuration() {
                util.duration(util, $scope, $http, $window.localStorage, Uri, $q, control, processDiagram);
            }
            setDuration();

            // subscribe to any broadcast KPI options change
            util.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], setDuration);
        }
    ];

    var Configuration = ['ViewsProvider', function (ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
