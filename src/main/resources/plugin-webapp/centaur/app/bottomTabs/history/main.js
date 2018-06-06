define(['require', 'angular'], function(require, angular) {

    /**
     * Controller object containing all behavior
     */
    var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {

        /**
         * get process definition id from parent
         */
        var procDefId = $scope.$parent.processDefinition.id;
        var order = {
            "endTime" : "desc",
            "startTime" : "desc",
            "duration" : "desc",
        };

        function flip(sortByProperty, by) {

            $(".sortingArrows").removeClass("glyphicon-menu-down");
            $(".sortingArrows").removeClass("glyphicon-menu-up");

            if(by == "desc") {
                $("#"+sortByProperty).addClass("glyphicon glyphicon-menu-up");
            } else {
                $("#"+sortByProperty).addClass("glyphicon glyphicon-menu-down");
            }
        }

        // get all sorted variable ids for this process
        $scope.setData = function(sortByProperty) {
            sortOrderProperty = order[sortByProperty];
            if (sortOrderProperty == "desc") {
                sortOrderProperty = "asc";
                order[sortByProperty] = sortOrderProperty;
                flip(sortByProperty,"desc");
            } else {
                sortOrderProperty = "desc"
                order[sortByProperty] = sortOrderProperty;
                flip(sortByProperty,"asc");
            }
            
            console.log("got data: " + sortByProperty + ", " + sortOrderProperty);
            $http.get(Uri.appUri("engine://engine/:engine/history/process-instance" +
                "?processDefinitionId=" + procDefId +
                "&finished=true" +
                /*$scope.startedBefore !== undefined ? "&startedBefore=\"" + $scope.startedBefore + ":00.000Z\"" : "") +
                ($scope.startedAfter !== undefined ? "&startedAfter=\"" + $scope.startedAfter + ":00.000Z\"" : "") +
                ($scope.finishedBefore !== undefined ? "&finishedBefore=\"" + $scope.finishedBefore + ":00.000Z\"" : "") +
                ($scope.finishedAfter !== undefined ? "&finishedAfter=\"" + $scope.finishedAfter + ":00.000Z\"" : "") +*/
                "&sortBy=" + sortByProperty +
                "&sortOrder=" + sortOrderProperty))
                .success(function (data) {
                    $scope.processInstances = data;
                });
        };

        //defaults to descending ordering by endtime
        $scope.setData("endTime");

        $scope.checkTimes = function (duration) {
            var durationString;
            if (duration > 1000 && duration < 60001) {
                durationString = (Math.round(duration / 1000 * 10) / 10).toString() + ' seconds';
            } else if (duration > 60000 && duration < 3600001) {
                durationString = (Math.round(duration / 60000 * 10) / 10).toString() + ' minutes';
            } else if (duration > 3600000 && duration < 86400001) {
                durationString = (Math.round(duration / 3600000 * 10) / 10).toString() + ' hours';
            } else if (duration > 86400000 && duration < 604800001) {
                durationString = (Math.round(duration / 86400000 * 10) / 10).toString() + ' days';
            } else if (duration > 604800000) {
                durationString = (Math.round(duration / 604800001 * 10) / 10).toString() + ' weeks';
            } else {
                durationString = (duration).toString() + ' ms';
            }
            return durationString;
        };

        $scope.toTruncatedUTC = function(time) {
            // convert to utc time
            var date = new Date(time).toISOString();

            // output with milliseconds and "Z" removed
            return date.substr(0, date.length - 5);
        }

    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
            id: 'history',
            label: 'Finished Process Instances',
            url: 'plugin://centaur/static/app/bottomTabs/history/tab.html',
            controller: DashboardController,

            priority: 5
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.bottomTabs.history', []);

    ngModule.config(Configuration);

    return ngModule;
});
