'use strict';

define(['require', 'angular', '../../common/refresh', '../../common/options'], function(require, angular) {

    var commonRefresh = require('../../common/refresh');

    /**
     * commonUtil containing variable data
     */
    var commonOptions = require('../../common/options');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$timeout', '$http', '$window', 'Uri',
        function($scope, $timeout, $http, $window, Uri) {
            // important reset, since commonRefresh is not deleted upon a reload
            commonRefresh.prevData = null;

            /**
             * set process definition id from parent
             */
            var procDefId = commonRefresh.procDefId = $scope.$parent.processDefinition.id;

            /**
             * set process instance id from parent
             */
            commonRefresh.procInstId = $scope.$parent.processInstance.id;

            var setPoll = function() {
                /**
                 * Stores the seconds between polls
                 * @type {number}
                 */
                commonRefresh.refresh = 1000 * parseInt(commonOptions.getOption($window.localStorage, procDefId,
                    commonOptions.defaultRefreshRate, "refresh"));

                commonRefresh.setInterval($scope, $http, Uri, commonRefresh, function(data, prevData) {
                    if(!angular.equals(data, prevData)) {
                        window.location.reload(true);
                    }
                });
            };
            setPoll();

            /**
             * subscribe to any broadcast variable refresh changes
             */
            commonOptions.register($scope, ["cockpit.plugin.centaur:options:var-refresh-change"], function(){
                setPoll();
            });
        }
    ];

    /**
     * Configuration object that places plugin as a plugin on the diagram
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
            id: 'refresh',
            label: 'Refresh',
            overlay: overlay,

            priority: 20
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processInstance.refresh', []);

    ngModule.config(Configuration);

    return ngModule;
});
