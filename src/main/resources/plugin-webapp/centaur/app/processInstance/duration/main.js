define(['require', 'angular', '../../common/conversion', '../../common/options',
        '../../common/overlays', '../../common/duration'], function (require, angular) {
    /**
     * retrieve the common files containing help functions
     */
    var util = require('../../common/duration');
    util.commonConversion  = require('../../common/conversion');
    util.commonOptions  = require('../../common/options');
    util.commonOverlays = require('../../common/overlays');

    var overlay = [
        '$scope', '$http', '$window', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, processData, pageData, $q, processDiagram) {

            util.procDefId = $scope.$parent.processDefinition.id;
            util.procInstId = $scope.$parent.processInstance.id;

            function setDuration() {
                util.duration(util, $http, $window.localStorage, Uri, $q, control, processDiagram);
            }
            setDuration();

            // subscribe to any broadcast KPI options change
            util.commonOptions.register($scope, ["cockpit.plugin.centaur:options:KPI-change"], setDuration);
        }
    ];

    var Configuration = ['ViewsProvider', function (ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processInstance.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
