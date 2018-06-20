define(['require', 'angular', './util', '../../../common/conversion', '../../../common/options',
    '../../../common/overlays', '../../../common/variables', '../../../common/duration'], function (require, angular) {

    /**
     * retrieve the common util functions
     */
    var util = require('./util');
    util.commonDuration = require('../../../common/duration');
    util.commonConversion = util.commonDuration.commonConversion = require('../../../common/conversion');
    util.commonOverlays = util.commonDuration.commonOverlays = require('../../../common/overlays');
    util.commonOptions = util.commonDuration.commonOptions = require('../../../common/options');

    var overlay = ['$scope', '$http', '$window', 'Uri', 'control', '$rootScope', 'processData', 'pageData', '$q', 'processDiagram',
        function ($scope, $http, $window, Uri, control, $rootScope, processData, pageData, $q, processDiagram) {

            util.procDefId = $scope.$parent.processDefinition.id;

            var setDuration = function() {
                util.duration(util, $scope, $http, $window.localStorage, Uri, $q, control, processDiagram);
            };
            setDuration();

            // subscribe to any broadcast KPI options change
            util.commonOptions.register($rootScope, ["cockpit.plugin.centaur:options:KPI-change"], setDuration);
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

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.overview.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
