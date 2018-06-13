'use strict';

define(['require', 'angular', '../../common/conversion'], function(require, angular) {

    var conversion = require('../../common/conversion');

    var controller = ["$rootScope", "$scope", "$http", "Uri", function($rootScope, $scope, $http, Uri) {
        $scope.userId = $rootScope.authentication.name;

        var getRequest = function() {
            $http.get(Uri.appUri("plugin://centaur/:engine/users"))
                .success(function(data) {
                    $scope.users = data;
                });
        };
        getRequest();

        // wait until the process definition list exists
        var checkExist = setInterval(function() {
            getRequest();
        }, 10000);
        /*$http.get(Uri.appUri("plugin://centaur/:engine/users"))
            .success(function(data) {
                console.log(data);
                $scope.users = data;
            });*/

        $scope.setActive = function(active, id) {
            $scope.users.find(function(user) {return user.id === id}).active = active;
            $http.post(Uri.appUri("plugin://centaur/:engine/users/set-active" +
                "?active=" + String(active) +
                "&id=" + id));
            //getRequest();
        };

        $scope.calcUtilPerc = function(user) {
            if(user.timeActive === 0) return 100;

            return 100 * (user.timeActive - user.timeIdle) / user.timeActive;
        };

        $scope.calcIdlePerc = function(user) {
             return 100 - $scope.calcUtilPerc(user);
        };

        $scope.convertTimes = function(millis) {
            var unit = conversion.checkTimeUnit(millis);
            var time = conversion.convertTimes(millis, unit);

            return time + " " + unit;
        };
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = ['ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.dashboard', {
            id: 'resources',
            label: 'Resources',
            url: 'plugin://centaur/static/app/resources/view/tab.html',
            controller: controller,
            priority: 10
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.resources.view', []);

    ngModule.config(Configuration);

    return ngModule;
});