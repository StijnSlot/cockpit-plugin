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
    var overlay = ['$scope', '$timeout', '$http', '$window', '$rootScope', 'Uri',
        function($scope, $timeout, $http, $window, $rootScope, Uri) {

            // important reset, since commonRefresh is not deleted upon a reload
            commonRefresh.prevData = null;

            /**
             * set process definition id from parent
             */
            var procDefId = commonRefresh.procDefId = $scope.$parent.processDefinition.id;
            commonRefresh.procInstId = null;

            /**
             * Stores the seconds between polls
             * @type {number}
             */
            commonRefresh.refresh = commonOptions.getRefreshRate($window.localStorage, procDefId + "_var_refresh")*1000;

            var setPoll = function() {
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
            commonOptions.register($scope, $rootScope, ["cockpit.plugin.centaur:options:var-refresh-change"], function(){
                commonRefresh.refresh = commonOptions.getRefreshRate($window.localStorage, procDefId + "_var_refresh")*1000;
                setPoll();
            });
        }
    ];

    /**
     * Configuration object that places plugin as a plugin on the diagram
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'refresh',
            label: 'Refresh',
            overlay: overlay,

            priority: 20
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.refresh', []);

    ngModule.config(Configuration);

    return ngModule;
});
