'use strict';

define(['require', 'angular'], function(require, angular) {
    var controller = ["$rootScope", "$scope", "$http", "Uri", "$q", function($rootScope, $scope, $http, Uri, $q) {
        $scope.userId = $rootScope.authentication.name;

        // add column active and duration to table if not exist
        var first = $http.post(Uri.appUri("plugin://centaur/:engine/users/add-columns"));
        var second = $http.get(Uri.appUri("plugin://centaur/:engine/users"));

        $q.all([first, second]).then(function(data) {
            console.log(data[1].data);
            $scope.users = data[1].data;
        });

        $scope.setActive = function(active, id) {
            console.log(active + " " + id);
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