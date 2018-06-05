/**
 * Adds a counter to CallActivity tasks.
 *
 * Camunda has the ability to have a task call multiple tasks in sequence or
 * parallel. However, the amount of tasks called it not displayed in the diagram
 * by default. This module adds a counter to display this number at the bottom
 * right of a call activity task.
 *
 * @author Tim Hübener
 * @since  23.05.2018 in progress
 * @since  31.05.2018 in testing
 */

'use strict';

define(['require', 'angular', './util'], function(require, angular) {

  var util = require('./util');

  var overlay = [
    '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
    function($scope, $http, Uri, control, processData, pageData, $q, processDiagram) {
      var viewer = control.getViewer();
      var overlays = viewer.get('overlays');
      var elementRegistry = viewer.get('elementRegistry');
      var overlaysNodes = {};

      var procDefId = $scope.$parent.processDefinition.id;

      /*
       * Angular http.get promise that waits for a JSON object of
       * the executionSequenceCounter.
       */
      $scope.executionSequenceCounter_temp = $http.get(Uri.appUri(
        "plugin://centaur/:engine/execution-sequence-counter"), {
        catch: false
      });

      /**
       * Waits until data is received from http.get request and
       * added to promises.
       *
       * Database quersies take a relative long time. So we have to
       * wait until the data is retrieved before we can continue.
       *
       * @param   {Object}  data   minimal duration of process
       */
      $q.all([$scope.executionSequenceCounter_temp]).then(function(data) {
        $scope.executionSequenceCounter = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
        // console.log($scope.executionSequenceCounter);
        /**
         * Extracts data from JSON objects and calls composeHTML()
         * function to add the extracted to the diagram.
         *
         * @param   {Object}  shape   shape of element
         */
        elementRegistry.forEach(function(shape) {
          var element = processDiagram.bpmnElements[shape.businessObject.id];
          for (var i = 0; i < $scope.executionSequenceCounter.data.length; i++) {
            if ($scope.executionSequenceCounter.data[i].activityId == element.id &&
              element.$type == 'bpmn:CallActivity' && $scope.executionSequenceCounter.data[i].long_ > 0) {
              var executionSequenceCounter = $scope.executionSequenceCounter.data[i].long_;
              util.composeHTML(util, overlays, executionSequenceCounter, element.id, shape);
              break;
            }
          }
        });
      });
    }
  ]

  /**
   * Configuration object that places plugin
   */
  var Configuration = ['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
      id: 'runtime',
      priority: 20,
      label: 'Runtime',
      overlay: overlay
    });
  }];

  var ngModule = angular.module('cockpit.plugin.centaur.processDefinition.counter', []);

  ngModule.config(Configuration);

  return ngModule;
});
