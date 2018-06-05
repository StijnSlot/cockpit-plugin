'use strict';

define(['angular'], function(angular) {

    var controller = ["$scope", "$http", "Uri", function($scope, $http, Uri) {
        var checkExist = setInterval(function() {
            if ($(".process-definitions-list > thead > tr").length) {
                putCheckboxes();
                putButton();
                clearInterval(checkExist);
            }
        }, 100);

        $scope.test = "hi";

        function putCheckboxes() {

            // create title
            var th = document.createElement('TH');
            th.className = "ng-binding";
            th.innerHTML = "Selection";
            $(".process-definitions-list > thead > tr").append(th);

            // create checkboxes
            $(".process-definitions-list > tbody > tr").each(function(i) {
                //var name = $(this).children(".name").text();
                var td = document.createElement('TD');
                var box = document.createElement('INPUT');
                box.type = "checkbox";
                box.id = "processSelect" + i;
                box.setAttribute("ng-model", "pd.checked");
                box.setAttribute("ng-change", "processSelect(pd)");
                td.appendChild(box);
                $(this).append(td);
            });
        }

        function putButton() {
            var div = document.createElement('DIV');
            div.setAttribute("ng-app", "cockpit.plugin.centaur.processes");
            //div.setAttribute("ng-controller", "")
            var button = document.createElement("BUTTON");
            button.className = "delete-process-button";
            button.innerText = "Delete";
            div.appendChild(button);
            $(".loader-state").append(div);
        }

        $scope.processSelect = function(pd) {
            console.log(pd);
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