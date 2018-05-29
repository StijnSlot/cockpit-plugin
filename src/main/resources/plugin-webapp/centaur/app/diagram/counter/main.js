/**
 * TODO: Summery
 *
 * TODO: Description.
 *
 * @author Tim Hübener
 * @since  23.05.2018 in progress
 */

'use strict';

define(['angular'], function(angular) {

  var Configuration = ['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
      id: 'runtime',
      priority: 20,
      label: 'Runtime',
      overlay: [
        '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', '$q', 'processDiagram',
        function($scope, $http, Uri, control, processData, pageData, $q, processDiagram) {
          var viewer = control.getViewer();
          var overlays = viewer.get('overlays');
          var elementRegistry = viewer.get('elementRegistry');
          var overlaysNodes = {};

          var procDefId = $scope.$parent.processDefinition.id;

          /**
           * Converts variable to String.
           * @param  {Number} toConvert Variable to be converted.
           * @return {String}           String representation of toConvert
           */
          function converToString(toConvert) {
            return toConvert.toString();
          }

          /**
           * Adds text to specified diagram element.
           * @param   {Number}  elementId   ID of diagram element
           * @param   {Number}  text        The text to be displayed
           * @param   {Object}  shape       Shape of the element
           * TODO: make into service
           */
          function addTextToId(elementId, text, shape) {
            var $overlayHtml =
              $(text)
              .css({
                width: shape.width,
                height: shape.height
              });

            overlays.add(elementId, {
              position: {
                top: 80,
                left: 50
              },
              show: {
                minZoom: -Infinity,
                maxZoom: +Infinity
              },
              html: $overlayHtml
            });
          }

          /**
           * Combines all information of given process into single
           * String variable which is added to its diagram element.
           *
           * This function receives all duration information about a given process.
           * If any of duration variables are NULL it does not create
           * a hmtlText variable since there is nothing to display.
           * Otherwise it checks which time intervall to use for each
           * duration variable and combines them into one String variable, htmlText.
           * The htmlText variable is passed to the addTextToId() function
           * so that the duration varables are displayed next to the
           * process diagram element.
           *
           * @param   {Number}  minDuration   minimal duration of process
           * @param   {Number}  avgDuration   average duration of process
           * @param   {Number}  maxDuration   maximal duration of process
           * @param   {Number}  curDuration   current duration of process
           * @param   {Number}  elementID     ID of element
           * @param   {Object}  shape         Shape of the element
           */
          function composeHTML(executionSequenceCounter, elementID, shape) {
            var htmlText = '<div class="counterText"> Counter: ' + executionSequenceCounter + '</div>';
            addTextToId(elementID, htmlText, shape);
          }

          /*
           * Angular http.get promises that wait for a JSON object of
           * the process activity and the instance start time.
           */
          $scope.executionSequenceCounter_temp = $http.get(Uri.appUri("plugin://centaur/:engine/execution-sequence-counter"), {
            catch: false
          });
          $scope.processVariables_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-variables" + "?procDefId=" + procDefId), {
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
            $scope.processVariables = data[1];
            console.log($scope.processVariables);
            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   {Object}  shape   shape of element
             * TODO: refactor out into seperate function
             */
            elementRegistry.forEach(function(shape) {
              var element = processDiagram.bpmnElements[shape.businessObject.id];
              for (var i = 0; i < $scope.executionSequenceCounter.data.length; i++) {
                if ($scope.executionSequenceCounter.data[i].activityId == element.id) {
                  var executionSequenceCounter = $scope.executionSequenceCounter.data[i].sequenceCounter;
                  composeHTML(executionSequenceCounter, element.id, shape);
                  break;
                }
              }
            });
          });
        }
      ]
    });
  }];

  var ngModule = angular.module('cockpit.plugin.centaur.diagram.counter', []);

  ngModule.config(Configuration);

  return ngModule;
});
