define(['angular'], function(angular) {

    var procDefId = "invoice:2:e163823d-4ecc-11e8-856a-104a7d534b93";
    var executionId = "e1978acf-4ecc-11e8-856a-104a7d534b93";
    var caseExecutionId = "";
    var taskId = "";

  var DashboardController = ["$scope", "$http", "Uri", function($scope, $http, Uri) {
      $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/process-instance"))
          .success(function(data) {
              $scope.processInstanceCounts = data;
          });

      $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/process-activity?" +
          "procDefId=" + procDefId))
          .success(function(data) {
              $scope.processActivityStatistics = data;
          });

      $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/instance-variables" +
          "?executionId=" + executionId +
          "&caseExecutionId=" + caseExecutionId +
          "&taskId=" + taskId))
          .success(function(data) {
              $scope.instanceVariables = data;
          });

      $http.get(Uri.appUri("plugin://cockpit-plugin/:engine/instance-start-time"))
          .success(function(data) {
              $scope.instanceStartTime = data;
          });

      console.log("Loaded");

  }];

  var Configuration = ['ViewsProvider', function(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.dashboard', {
      id: 'process-definitions',
      label: 'Deployed Processes',
      url: 'plugin://cockpit-plugin/static/app/demoText/dashboard.html',
      controller: DashboardController,

      // make sure we have a higher priority than the default plugin
      priority: 12
    });
  }];

  var ngModule = angular.module('cockpit.plugin.cockpit-plugin.demoText.process-definitions', []);

  ngModule.config(Configuration);

  return ngModule;
});