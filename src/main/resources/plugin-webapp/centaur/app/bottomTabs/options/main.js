define(['require', 'angular', './util'], function(require, angular) {

    var util = require('./util');

    var DashboardController = ["$scope", "$window", "$http", "$rootScope", "Uri", function($scope, $window, $http, $rootScope, Uri) {
        var procDefId = $scope.$parent.processDefinition.id;

        $scope.KPI = [
            {id: "act_cur_duration", name: "Activity current duration"},
            {id: "act_avg_duration", name: "Activity average duration"},
            {id: "act_max_duration", name: "Activity maximum duration"}
        ];

        $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" +
            "?procDefId=" + procDefId))
            .success(function(data) {
                $scope.processVariables = data;

                util.setChecked($window, procDefId, $scope.processVariables);
                util.setChecked($window, procDefId, $scope.KPI);

            });

        $scope.changeVar = function(id, checked) {
            util.changeVar($window, $rootScope, procDefId, id, checked);
        };
        $scope.changeKPI = function(id, checked) {
            util.changeKPI($window, $rootScope, procDefId, id, checked);
        };
    }];

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
            id: 'options',
            label: 'Options',
            url: 'plugin://centaur/static/app/bottomTabs/options/tab.html',
            controller: DashboardController,

            priority: 1
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.bottomTabs.options', []);

    ngModule.config(Configuration);

    return ngModule;
});
