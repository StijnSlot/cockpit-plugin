'use strict';

define(['require', 'angular', '../../common/options'], function(require, angular) {
    /**
     * Stores the JSON list of the previous instances polled
     * @type {JSON}
     */
    var previousInstances = null;

    /**
     * commonUtil containing variable data
     */
    var commonOptions = require('../../common/options');

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$timeout', '$http', '$window', '$rootScope', 'Uri',
        function($scope, $timeout, $http, $window, $rootScope, Uri) {

            /**
             * set process definition id from parent
             */
            var procDefId = $scope.$parent.processDefinition.id;

            /**
             * Stores the seconds between polls
             * @type {number}
             */
            var refresh = commonOptions.getRefreshRate($window.localStorage, procDefId + "_var_refresh")*1000;

            /**
             * subscribe to any broadcast variable refresh changes
             */
            var listener = $rootScope.$on("cockpit.plugin.centaur:options:var-refresh-change", function() {
                refresh = commonOptions.getRefreshRate($window.localStorage, procDefId + "_var_refresh")*1000;
            });

            $scope.$on("$destroy", function() {
                listener();
            });

            /**
             * Polling function that gets called every set seconds
             */
            var poll = function() {
                $timeout(function() {
                    /**
                     * HTTP request that retrieves the list of instances
                     * for the specified process definition id
                     */
                    $http.get(Uri.appUri("plugin://centaur/:engine/refresh" +
                        "?procDefId=" + procDefId))
                        .success(function(data) {

                            // check if we have a set reference instance list
                            if (previousInstances == null) {
                                previousInstances = data;
                            }

                            /**
                             * refresh if the stored reference list does not equal
                             * the retrieved list
                             */
                            if (!angular.equals(previousInstances, data)) {
                                window.location.reload(true);
                            }
                        });
                    // call poll again
                    poll();
                }, refresh);
            };
            // initial call to poll function
            poll();
        }
    ];

    /**
     * Configuration object that places plugin as a plugin on the diagram
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            label: 'Instance Variables',
            priority: 20,
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.refresh', []);

    ngModule.config(Configuration);

    return ngModule;
});
