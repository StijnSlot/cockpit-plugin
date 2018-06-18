'use strict';

define(['require', 'angular'], function(require, angular) {
    var controller = ["$scope", "Views", function($scope, Views) {
        $scope.viewProvider = Views.getProviders({
            component: 'cockpit.resources'
        });
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.navigation', {
            id: 'resources',
            label: 'Resources',
            pagePath: '#/reports',
            controller: controller,
            weight: 10
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.resources.navigation', []);

    ngModule.config(Configuration);

    return ngModule;
});
