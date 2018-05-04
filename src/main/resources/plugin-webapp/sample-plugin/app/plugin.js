define(['angular'], function(angular) {

  var procDefId = "invoice:2:e163823d-4ecc-11e8-856a-104a7d534b93";

  var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {
      $http.get(Uri.appUri("plugin://sample-plugin/:engine/process-activity?procDefId=" + procDefId))
          .success(function(data) {
              $scope.processInstanceActivityDuration = data;
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
      url: 'plugin://sample-plugin/static/app/dashboard.html',
      controller: DashboardController,

      // make sure we have a higher priority than the default plugin
      priority: 12
    });
  }];

  var ngModule = angular.module('cockpit.plugin.sample-plugin', []);

  ngModule.config(Configuration);

  return ngModule;
});