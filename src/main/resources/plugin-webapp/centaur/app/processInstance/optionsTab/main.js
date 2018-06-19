define(['require', 'angular', '../../common/options', "../../common/KPI"], function(require, angular) {

    /**
     * commonUtil containing variable data
     */
    var util = require('../../common/options');

    var KPI = require("../../common/KPI");

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
        $scope.procDefId = $scope.$parent.$parent.processInstance.definitionId;

        /**
         * array containing all defined KPI's
         */
        $scope.KPI = KPI.list;

        util.setScopeFunctions($scope, $window.localStorage, $rootScope, util);

        // get all variable ids for this process
        $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" +
            "?procDefId=" + $scope.procDefId +
            "&procInstanceId=" + procInstanceId))
            .success(function(data) {
                $scope.processVariables = data;

                // retrieve localStorage info on variables and set checkboxes
                util.setChecked($window.localStorage, $scope.procDefId, "variables", $scope.processVariables);
            });
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processInstance.runtime.tab', {
            id: 'processInstance-options',
            label: 'Options',
            url: 'plugin://centaur/static/app/processDefinition/optionsTab/tab.html',
            controller: DashboardController,

            priority: -1
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processInstance.options', []);

    ngModule.config(Configuration);

    return ngModule;
});