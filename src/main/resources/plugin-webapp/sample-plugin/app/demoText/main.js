define(['angular'], function(angular) {

  var procDefId = "invoice:2:485730c2-4f7d-11e8-94dc-52e8da98b31d";

  var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {
      $http.get(Uri.appUri("plugin://sample-plugin/:engine/process-activity?procDefId=" + procDefId))
          .success(function(data) {
              $scope.processActivityStatistics = data;
          });

    $http.get(Uri.appUri("plugin://sample-plugin/:engine/process-instance"))
      .success(function(data) {
        $scope.processInstanceCounts = data;
      });
  }];

  var Configuration = ['ViewsProvider', function(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.dashboard', {
      id: 'process-definitions',
      label: 'Deployed Processes',
      url: 'plugin://sample-plugin/static/app/demoText/dashboard.html',
      controller: DashboardController,

      // make sure we have a higher priority than the default plugin
      priority: 12
    });
  }];

  var ngModule = angular.module('cockpit.plugin.sample-plugin.demoText.process-definitions', []);

  ngModule.config(Configuration);

  return ngModule;
});