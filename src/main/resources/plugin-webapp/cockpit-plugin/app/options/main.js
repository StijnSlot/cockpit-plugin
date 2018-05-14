define(['angular'], function(angular) {

    var DashboardController = ["$scope", "$window", "$http", "Uri", function($scope, $window, $http, Uri) {

        var procDefId = $scope.$parent.processDefinition.id;

        $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/process-variables" +
            "?procDefId=" + procDefId))
            .success(function(data) {
                $scope.processVariables = data;

                for(var i in data) {
                    var variable = $scope.processVariables[i];
                    if($window.localStorage.getItem(variable.name) === null) {
                        $window.localStorage.setItem(variable.name, 'false');
                        variable.checked = 'false';
                    } else {
                        variable.checked = $window.localStorage.getItem(variable.name) === 'true';
                    }
                }
            });

        $scope.change = function(name, checked) {
            $window.localStorage.setItem(name, checked);
        }
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