define(['require', 'angular',  './util', '../../common/deletion'], function(require, angular) {

    /**
     * util files with common functions
     */
    var util = require('./util');
    util.deletion = require('../../common/deletion');

    var controller = ["$scope", "$http", "$q", "Uri", function($scope, $http, $q, Uri) {

        // wait until the process definition list exists
        var checkExist = setInterval(function() {
            if ($(".process-definitions-list").length) {
                // stop the interval
                clearInterval(checkExist);

                util.initDeletion(util, $http, $q, Uri);
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