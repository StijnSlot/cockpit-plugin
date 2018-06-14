define(['require', 'angular', '../../common/deletion'], function(require, angular) {

    var deletion = require('../../common/deletion');

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$http", "Uri", "$q", function($scope, $http, Uri, $q) {

        /**
         * set process definition id from parent
         */
        $scope.procDefKey = $scope.$parent.processDefinition.key;

        getData($scope, $http, Uri);

        $scope.handleDelete = function() {
            var rows = deletion.getSelectedRows(".process-instances > tbody > tr");
            if(rows.length) {
                if(confirm("Are you sure you want to delete the selected process instances?")) {
                    var ids = getSelectedIds(rows);
                    deleteIds($http, $q, Uri, ids);
                }
            }  else {
                alert("No process instance was selected.");
            }
        };

        function getSelectedIds(rows) {
            var out = [];

            $(rows).each(function() {
                var id = $(this).find('.instance-id').text().trim();
                out.push(id);
            });

            return out;
        }


    }];

    function deleteIds($http, $q,  Uri, ids) {
        var promises = [];
        ids.forEach(function(id) {
            var promise = $http.delete(Uri.appUri("engine://engine/:engine/process-instance/" + id));
            promises.push(promise);
        });

        $q.all(promises).then(function() {
            window.location.reload();
        })
    }

    function getData($scope, $http, Uri) {
        $http.get(Uri.appUri("engine://engine/:engine/process-instance?processDefinitionKey=" + $scope.procDefKey))
            .success(function (data) {
                $scope.instances = data;
            });
    }

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
