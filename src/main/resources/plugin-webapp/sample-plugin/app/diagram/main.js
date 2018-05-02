'use strict'
console.log("hello3");
define(['angular',
    'jquery'], function(angular) {

    var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {

        $http.get(Uri.appUri("plugin://sample-plugin/:engine/process-instance"))
            .success(function(data) {
                $scope.processInstanceCounts = data;
            });
    }];

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                'control', 'processData', 'pageData', 'processDiagram',
                function(control, processData, pageData, processDiagram) {
                }]
        });
    }];
    console.log("hello");
    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram', []);

    ngModule.config(Configuration);

    return ngModule;
});