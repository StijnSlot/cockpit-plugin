define(['require', 'angular', './util'], function(require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$window", "$http", "$rootScope", "Uri", function($scope, $window, $http, $rootScope, Uri) {

        /**
         * get process definition id from parent
         */
        var procDefId = $scope.$parent.processDefinition.id;

        /**
         * array containing all defined KPI's
         * TODO put these in a separate place (file)
         */
        $scope.KPI = [
            {id: "act_cur_duration", name: "Activity current duration"},
            {id: "act_avg_duration", name: "Activity average duration"},
            {id: "act_max_duration", name: "Activity maximum duration"}
        ];

        // retrieve localStorage info on KPI's and set checkboxes
        util.setChecked($window.localStorage, procDefId + "_KPI_", $scope.KPI);

        // get all variable ids for this process
        $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" +
            "?procDefId=" + procDefId))
            .success(function(data) {
                $scope.processVariables = data;

                // retrieve localStorage info on variables and set checkboxes
                util.setChecked($window.localStorage, procDefId + "_var_", $scope.processVariables);
            });

        /**
         * Function that reacts to changes in variables. Calls util function
         *
         * @param id            id of variable where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeVar = function(id, checked) {
            util.changeVar($window.localStorage, $rootScope, procDefId + '_var_' + id, checked);
            //$rootScope.$broadcast("cockpit.plugin.centaur:options:variable-change");
        };

        /**
         * Function that reacts to changes in KPI. Calls util function
         *
         * @param id            id of KPI where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeKPI = function(id, checked) {
            util.changeKPI($window.localStorage, $rootScope, procDefId + '_KPI_' + id, checked);
        };
    }];

    /**
     * Configuration object that places plugin
     */
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
