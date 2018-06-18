'use strict';

define(['require', 'angular', '../../common/conversion'], function(require, angular) {

    var conversion = require('../../common/conversion');

    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    };

    var controller = ["$rootScope", "$scope", "$http", "Uri", function($rootScope, $scope, $http, Uri) {
        $scope.userId = $rootScope.authentication.name;

        var getRequests = function() {
            $http.get(Uri.appUri("plugin://centaur/:engine/users"))
                .success(function(data) {
                    $scope.users = data;
                });

        };
        getRequests();

        setInterval(function() {
            getRequests();
        }, 10000);

        $scope.setActive = function(active, id) {
            $scope.users.find(function(user) {return user.id === id}).active = active;

            var data = $.param({
                active: String(active),
                id: id
            });
            $http.post(Uri.appUri("plugin://centaur/:engine/users/set-active"), data, config)
              .success(getRequests);
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