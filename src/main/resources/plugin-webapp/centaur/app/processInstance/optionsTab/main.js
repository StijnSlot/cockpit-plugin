define(['require', 'angular', '../../common/options'], function(require, angular) {

    /**
     * commonUtil containing variable data
     */
    var util = require('../../common/options');

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$window", "$http", "$rootScope", "Uri", function($scope, $window, $http, $rootScope, Uri) {

        /**
         * process instance id
         */
        var procInstanceId = $scope.$parent.$parent.processInstance.id;

        /**
         * get process definition id from parent
         */
        var procDefId = $scope.$parent.$parent.processInstance.definitionId;

        console.log(procDefId + " " + procInstanceId);

        /**
         * array containing all defined KPI's
         * TODO put these in a separate place (file)
         */
        $scope.KPI = [
            {id: "act_cur_duration", name: "Activity current duration"},
            {id: "act_avg_duration", name: "Activity average duration"},
            {id: "act_max_duration", name: "Activity maximum duration"},
            {id: "bulletgraph", name: "Bulletgraph"}
        ];

        // retrieve localStorage info on KPI's and set checkboxes
        $scope.setVariableChecked = function() {
            util.setChecked($window.localStorage, procDefId + "_KPI_", $scope.KPI);
        };

        $scope.setNumValue = function() {
            $scope.numValue = util.getVariableNum($window.localStorage, procDefId + "_var_num");
        };

        /**
         * TODO: Write comments
         * @param value
         */
        $scope.setRefreshRate = function() {
            $scope.refreshRate = util.getRefreshRate($window.localStorage, procDefId + "_var_refresh");
        };

        // get all variable ids for this process
        $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" +
            "?procDefId=" + procDefId +
            "&procInstanceId=" + procInstanceId))
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

        $scope.changeVarNum = function(value) {
            util.changeVarNum($window.localStorage, $rootScope, procDefId + "_var_num", value);
        };

        /**
         * TODO: Write comments
         * @param value
         */
        $scope.changeVarRefreshRate = function(value) {
            util.changeVarRefreshRate($window.localStorage, $rootScope, procDefId + "_var_refresh", value);
        }
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processInstance.runtime.tab', {
            id: 'processInstance-options',
            label: 'Options',
            url: 'plugin://centaur/static/app/processInstance/optionsTab/tab.html',
            controller: DashboardController,

            priority: 0
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processInstance.options', []);

    ngModule.config(Configuration);

    return ngModule;
});