define(['angular'], function(angular) {

    var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {

        $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/process-variables" +
            "?procDefId=" + $scope.$parent.processDefinition.id))
            .success(function(data) {
                $scope.processVariables = data;
            });
    }];

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
            id: 'optionsTab',
            label: 'Options tab',
            url: 'plugin://cockpit-plugin/static/app/options/tab.html',
            controller: DashboardController,

            priority: 20
        });
    }];

    var ngModule = angular.module('cockpit.plugin.cockpit-plugin.demoText.optionsTab', []);

    ngModule.config(Configuration);

    return ngModule;
});