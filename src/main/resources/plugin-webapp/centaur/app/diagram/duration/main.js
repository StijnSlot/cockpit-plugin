/**
 * Displays the current, average and maximal duration of a process onto the
 * process diagram of Camunda.
 *
 * TODO: Description.
 *
 * @author Lukas Ant, Tim Hübener.
 * @since  22.05.2018 in Testing
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
           * @param   {Number}  toConvert   Variable to be converted.
           * @return  {String}              String representation of toConvert
           * TODO: make into service
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
           * Calculates the current duration of a instance of a process.
           *
           * The database only keeps track of the starting time of each
           * process. So we calculate the current duration of each process.
           *
           * @param   {Number}  instance    Instance of a process
           * @param   {Number}  elementId   ID of diagram element that represents instance
           */
          function calculateCurDuration(instance, elementID) {
            for (var j = 0; j < instance.length; j++) {
              if (instance[j].activityId == elementID) {
                var startTime = Date.parse(instance[j].startTime);
                var computerTime = new Date().getTime();
                var timeDifference = computerTime - startTime;
                return timeDifference;
                break;
              }
            }
            return null;
          }

          /**
           * Decides which time interval to use.
           *
           * The database keeps track of the duration in milli seconds.
           * This is difficult to read in the diagram, so we convert the
           * milli senconds into following intervals: seconds, minutes,
           * hours, days, weeks to make it easier to read.
           *
           * @param   {Number}  duration      duration of process
           * @return  {String}  durationHTML  duration as String
           */
          function checkTimes(duration) {
            if (duration > 1000 && duration < 60001) {
              var durationHTML = (converToString(Math.round(duration / 1000 * 10) / 10)) + ' seconds';
            } else if (duration > 60000 && duration < 1440001) {
              var durationHTML = (converToString(Math.round(duration / 6000 * 10) / 10)) + ' minutes';
            } else if (duration > 1440000 && duration < 34560001) {
              var durationHTML = (converToString(Math.round(duration / 1440000 * 10) / 10)) + ' hours';
            } else if (duration > 34560000 && duration < 241920001) {
              var durationHTML = (converToString(Math.round(duration / 34560000 * 10) / 10)) + ' days';
            } else if (duration > 241920000) {
              var durationHTML = (converToString(Math.round(duration / 241920000 * 10) / 10)) + ' weeks';
            } else {
              var durationHTML = converToString(duration) + ' ms';
            }
            return durationHTML;
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
          $scope.processActivityStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" + "procDefId=" + procDefId), {
            catch: false
          });
          $scope.instanceStartTime_temp = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time"), {
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
