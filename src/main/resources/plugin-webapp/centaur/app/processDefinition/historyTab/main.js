define(['require', 'angular', './util', '../../common/conversion'], function(require, angular) {

    /**
     * util files
     */
    var util = require('./util');
    var commonConversion = require('../../common/conversion');

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {

        /**
         * set process definition id from parent
         */
        var procDefId = $scope.$parent.processDefinition.id;

        // get all sorted variable ids for this process
        $scope.setData = async function(sortByProperty) {
            var sortOrder = util.flipSortOrder(sortByProperty, util);

            $scope.processInstances = await util.getData($http, Uri, sortByProperty, sortOrder, procDefId);
            $scope.$apply();
        };

        //defaults to descending ordering by endtime
        $scope.setData("endTime");

        // put common conversion methods in scope
        $scope.convertTimes = commonConversion.convertTimes;
        $scope.checkTimeUnit = commonConversion.checkTimeUnit;
        $scope.toTruncatedUTC = commonConversion.toTruncatedUTC;
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
            id: 'history',
            label: 'History',
            url: 'plugin://centaur/static/app/processDefinition/historyTab/tab.html',
            controller: DashboardController,

            priority: 5
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.history', []);

    ngModule.config(Configuration);

    return ngModule;
});
