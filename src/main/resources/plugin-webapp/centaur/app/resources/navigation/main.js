'use strict';

define(['require', 'angular'], function(require, angular) {
    var controller = ["$scope", "Views", function($scope, Views) {
        console.log("hi");
        $scope.viewProvider = Views.getProviders({
            component: 'cockpit.resources'
        });
        console.log($scope.viewProvider);
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.navigation', {
            id: 'resources',
            label: 'Resources',
            pagePath: '#/processes',
            controller: controller,
            weight: 10
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.resources.navigation', []);

    ngModule.config(Configuration);

    return ngModule;
});
