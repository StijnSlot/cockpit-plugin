define(['require', 'angular', './util', '../../../common/conversion', '../../../common/options', '../../../common/overlays', '../../../common/variables', '../../../common/duration'], function (require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * retrieve the common file containing duration functions
     */
    util.commonDuration = require('../../../common/duration');

    /**
     * retrieve the common file containing conversion functions
     */
    util.commonConversion = util.commonDuration.commonConversion = require('../../../common/conversion');

    /**
     * retrieve the common file containing overlay functions
     */
    util.commonOverlays = util.commonDuration.commonOverlays = require('../../../common/overlays');

    /**
     * retrieve the common file containing option functions
     */
    util.commonOptions = util.commonDuration.commonOptions = require('../../../common/options');

    var Configuration = ['ViewsProvider', function (ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', '$http', '$window', 'Uri', 'control', '$rootScope', 'processData', 'pageData', '$q', 'processDiagram',
                function ($scope, $http, $window, Uri, control, $rootScope, processData, pageData, $q, processDiagram) {

                    util.procDefId = $scope.$parent.processDefinition.id;

                    var setDuration = function() {
                        util.duration(util, $scope, $http, $window.localStorage, Uri, $q, control, processDiagram);
                    };
                    setDuration();

                    // subscribe to any broadcast KPI options change
                    util.commonOptions.register($rootScope, ["cockpit.plugin.centaur:options:KPI-change"], setDuration);
                }
            ]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.overview.duration', []);

    ngModule.config(Configuration);

    return ngModule;
});
