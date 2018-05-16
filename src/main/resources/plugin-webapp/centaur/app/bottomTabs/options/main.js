define(['angular'], function(angular) {

    var DashboardController = ["$scope", "$window", "$http", '$rootScope', "Uri", function($scope, $window, $http, $rootScope, Uri) {
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

                for(var i in data) {
                    var variable = $scope.processVariables[i];
                    if($window.localStorage.getItem(procDefId + "_" + variable.name) === null) {
                        $window.localStorage.setItem(procDefId + "_" + variable.name, 'false');
                        variable.checked = 'false';
                    } else {
                        variable.checked = $window.localStorage.getItem(procDefId + "_" + variable.name) === 'true';
                    }
                }

                for(var i in $scope.KPI) {
                    var variable = $scope.KPI[i];
                    if($window.localStorage.getItem(variable.id) === null) {
                        $window.localStorage.setItem(variable.id, 'false');
                        variable.checked = 'false';
                    } else {
                        variable.checked = $window.localStorage.getItem(variable.id) === 'true';
                    }
                }
            });

        $scope.changeVar = function(id, checked) {
            $window.localStorage.setItem(procDefId + "_" + id, checked);
            $rootScope.$broadcast("cockpit.plugin.centaur:options:variable-change");
        }

        $scope.changeKPI = function(id, checked) {
            $window.localStorage.setItem(id, checked);
        }

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