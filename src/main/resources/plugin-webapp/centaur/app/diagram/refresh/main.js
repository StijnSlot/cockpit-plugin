'use strict';

define(['require', 'angular'], function(require, angular) {

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$timeout', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $timeout, $http, $window, $rootScope, Uri, control, processDiagram) {
            var poll = function() {
                $timeout(function() {
                    console.log("Hello");
                    /**
                    * set process definition id from parent
                    */
                    var procDefId = $scope.$parent.processDefinition.id;
                    
                    $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" +
                            "?procDefId=" + procDefId))
                            .success(function(data) {
                                if (data == ) {

                                }

                                // retrieve localStorage info on variables and set checkboxes
                                util.setChecked($window.localStorage, procDefId + "_var_", $scope.processVariables);
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
