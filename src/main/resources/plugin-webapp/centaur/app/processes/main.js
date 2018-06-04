'use strict';

define(['angular'], function(angular) {

    var controller = ["$scope", "$http", "Uri", function($scope, $http, Uri) {
        var checkExist = setInterval(function() {
            if ($(".process-definitions-list > thead > tr").length) {
                console.log('loaded');
                putCheckboxes();
                clearInterval(checkExist);
            }
        }, 100);

        function putCheckboxes() {
            var th = document.createElement('th');
            th.className = "ng-binding";
            th.innerHTML = "Selection";
            $(".process-definitions-list > thead > tr").append(th);
            $(".process-definitions-list > tbody > tr").each(function(i) {
                //var name = $(this).children(".name").text();
                var td = document.createElement('td');
                var box = document.createElement('INPUT');
                box.type = "checkbox";
                box.id = "processSelect" + i;
                box.setAttribute("ng-change", "processSelect(" + i + ", checked)");
                box.setAttribute("ng-model", "checked");
                td.appendChild(box);
                $(this).append(td);
            });
        }

        $scope.processSelect = function(i, checked) {
            console.log(i + " " + checked);
        }
    }];

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processes.dashboard', {
            id: 'runtime',
            label: 'Runtime',
            url: 'plugin://centaur/static/app/processes/empty.html',
            controller: controller,

            priority: 1
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.processes', []);

    ngModule.config(Configuration);

    return ngModule;
});