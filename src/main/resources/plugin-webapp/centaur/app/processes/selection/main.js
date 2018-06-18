'use strict';

define(['require', 'angular',  './util', '../../common/deletion'], function(require, angular) {

    var util = require('./util');

    var deletion = require('../../common/deletion');

    var controller = ["$scope", "$http", "$q", "Uri", function($scope, $http, $q, Uri) {

        // wait until the process definition list exists
        var checkExist = setInterval(function() {
            if ($(".process-definitions-list").length) {
                // stop the interval
                clearInterval(checkExist);
                
                util.putCheckboxes();
                var deleteButton = util.putDeleteButton();

                $(deleteButton).click(function() {
                    var rows = deletion.getSelectedRows(".process-definitions-list > tbody > tr");

                    if(!rows.length) {
                        alert("No process is selected.");
                    } else if(confirm("Are you sure you want to delete the selected processes?")) {
                        var ids = util.getSelectedIds(rows);
                        util.deleteProcessDefinition($http, $q, Uri, ids);
                    }
                });
            }
        }, 100);
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processes.dashboard', {
            id: 'runtime',
            label: 'Runtime',
            url: 'plugin://centaur/static/app/processes/selection/empty.html',
            controller: controller,

            priority: 1
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processes.selection', []);

    ngModule.config(Configuration);

    return ngModule;
});