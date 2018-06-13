'use strict';

define(['require', 'angular'], function(require, angular) {
    var controller = ["$rootScope", "$scope", "$http", "Uri", function($rootScope, $scope, $http, Uri) {
        $scope.userId = $rootScope.authentication.name;

        $http.get(Uri.appUri("plugin://centaur/:engine/users"))
            .success(function(data) {
                console.log(data);
                $scope.users = data;
            });

        $scope.setActive = function(active, id) {
            $scope.users.find(function(user) {return user.id === id}).active = active
            $http.post(Uri.appUri("plugin://centaur/:engine/users/set-active" +
                "?active=" + String(active) +
                "&id=" + id));
        }
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