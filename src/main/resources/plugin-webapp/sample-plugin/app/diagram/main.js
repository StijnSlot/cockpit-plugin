'use strict'

// var instanceCount = require('src\main\resources\plugin-webapp\sample-plugin\app\demoText\brain.js');

define(['angular'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                'control', 'processData', 'pageData', 'processDiagram',
                function(control, processData, pageData, processDiagram) {
                    console.log("test demoText");
                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram', []);

    ngModule.config(Configuration);

    return ngModule;
});
