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
                top: -40,
                left: -40
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
          function composeHTML(minDuration, avgDuration, maxDuration, curDuration, elementID, shape) {
            if (avgDuration != null && minDuration != null && maxDuration != null && avgDuration != '0') {
              var minDurationHTML = checkTimes(minDuration);
              var avgDurationHTML = checkTimes(avgDuration);
              var maxDurationHTML = checkTimes(maxDuration);
              if (curDuration != null) {
                var curDurationHTML = checkTimes(curDuration);
              } else {
                var curDurationHTML = '-';
              }

              var htmlText = '<div class="durationText"> Cur: ' + curDurationHTML + ' <br> Avg: ' + avgDurationHTML + ' <br>' + 'Max: ' + maxDurationHTML + '</div>';
              addTextToId(elementID, htmlText, shape);
            }
          }

          /*
           * Angular http.get promises that wait for a JSON object of
           * the process activity and the instance start time.
           */
          //TODO: Get data from database
          // $scope.processActivityStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" + "procDefId=" + procDefId), {catch: false});
          // $scope.instanceStartTime_temp = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"), {catch: false});

          /**
           * Waits until data is received from http.get request and
           * added to promises.
           *
           * Database quersies take a relative long time. So we have to
           * wait until the data is retrieved before we can continue.
           *
           * @param   {Object}  data   minimal duration of process
           */
          $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function(data) {
            $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
            $scope.instanceStartTime = data[1];

            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   {Object}  shape   shape of element
             * TODO: refactor out into seperate function
             */
            elementRegistry.forEach(function(shape) {
              var element = processDiagram.bpmnElements[shape.businessObject.id];
              for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                if ($scope.processActivityStatistics.data[i].id == element.id) {
                  var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                  var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                  var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                  var getCurDuration = calculateCurDuration($scope.instanceStartTime.data, element.id);

                  composeHTML(getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape);
                  break;
                }
              }
            });
          });
        }
      ]
    });
  }];

  var ngModule = angular.module('cockpit.plugin.centaur.diagram.duration', []);

  ngModule.config(Configuration);

  return ngModule;
});
