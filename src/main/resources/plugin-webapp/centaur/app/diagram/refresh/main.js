'use strict';

define(['require', 'angular'], function(require, angular) {
    var previousInstances = null;

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$timeout', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $timeout, $http, $window, $rootScope, Uri, control, processDiagram) {
            var poll = function() {
                $timeout(function() {
                    /**
                     * set process definition id from parent
                     */
                    var procDefId = $scope.$parent.processDefinition.id;
                    $http.get(Uri.appUri("plugin://centaur/:engine/refresh" +
                        "?procDefId=" + procDefId))
                        .success(function(data) {
                            if (previousInstances == null) {
                                previousInstances = data;
                            }
                            if (!angular.equals(previousInstances, data)) {
                                window.location.reload(true);
                            }
                        });
                    poll();
                }, 1000);
            };     
           poll();
        }
    ];

    /**
     * Configuration object that places plugin
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
