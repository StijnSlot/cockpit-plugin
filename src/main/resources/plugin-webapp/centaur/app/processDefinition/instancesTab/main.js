define(['require', 'angular', './util', '../../common/deletion'], function(require, angular) {

    var util = require('./util');

    var deletion = require('../../common/deletion');

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$http", "Uri", "$q", function($scope, $http, Uri, $q) {

        /**
         * set process definition key from parent
         */
        var procDefKey = $scope.$parent.processDefinition.key;

        util.getData($scope, $http, Uri, procDefKey);

        $scope.handleDelete = function() {
            var rows = deletion.getSelectedRows(".process-instances > tbody > tr");
            if(rows.length) {
                if(confirm("Are you sure you want to delete the selected process instances?")) {
                    var ids = util.getSelectedIds(rows);
                    util.deleteIds($http, $q, Uri, ids,
                        function() {util.getData($scope, $http, Uri, procDefKey);});
                }
            }  else {
                alert("No process instance was selected.");
            }
        };
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
            id: 'all-process-instances',
            label: 'All instances',
            url: 'plugin://centaur/static/app/processDefinition/instancesTab/tab.html',
            controller: DashboardController,

            priority: 9
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.instances', []);

    ngModule.config(Configuration);

    return ngModule;
});
