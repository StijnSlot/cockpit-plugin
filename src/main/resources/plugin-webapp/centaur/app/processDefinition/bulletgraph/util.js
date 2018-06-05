define({
    commonConversion: {},

    commonOptions: {},

    commonOverlays: {},

    commonVariables: {},

    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * Main function of the bulletgraph module. In here the data will be loaded
     * from the database by using promises. Also functions will be called
     * to add information to the BPMN model.
     *
     * @param   util              object of this class, to call its functions and variables
     * @param   $scope            object with corresponding properties and methods
     * @param   $http             http client for GET request
     * @param   $window           browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   elementRegistry   registry containing bpmn elements
     * @param   processDiagram    diagram containing elements
     * @param   overlays          collection of overlays to add to
     */
    bulletgraph: function (util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays) {
        /*
             * Angular http.get promises that wait for a JSON object of
             * the process activity and the instance start time.
             */
        $scope.processActivityStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?" + "procDefId=" + util.procDefId), {
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
         * @param   Object  data   minimal duration of process
         */
        $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function (data) {
            $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
            $scope.instanceStartTime = data[1];

            console.log($scope.processActivityStatistics);
            console.log($scope.instanceStartTime);

            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   Object  shape   shape of element
             */
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                    if ($scope.processActivityStatistics.data[i].id == element.id) {
                        var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                        var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                        var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                        var getCurDuration = util.calculateCurDuration($scope.instanceStartTime.data, element.id);

                        util.combineBulletgraphElements(util, overlays, getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape, $window);
                        break;
                    }
                }
            });
        });
    },

    /**
     * Calculates the current duration of a instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of each process.
     *
     * @param   Number  instance    Instance of a process
     * @param   String  elementId   ID of diagram element that represents instance
     */
    calculateCurDuration: function (instance, elementID) {
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
    },

    /**
     * Combines all information of given process into a HTML line
     * which will be added to the HTML file. It will also set the graphsettings
     * which will be written to the class which is created in the HTML line.
     *
     * This function receives all duration information about a given process.
     * If any conditions which are defined in a seperate checkConditions() function
     * isn't satisfied, the bulletgraph will not display.
     * An HTML line will be passed to the addTextToId() function 
     * so that an class which includes an elementID will be added to the HTML file.
     * Information which has has been collected will be passed to the setGraphSettings()
     * function. Here it will create a bullet graph on he HTML line which has been
     * passed into the HTML file previously.
     *
     * @param   Object  util          object of this class, to call its functions and variables
     * @param   Overlay overlays      collection of overlays to add to
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @param   String  elementID     ID of element
     * @param   Object  shape         Shape of the element
     * @param   Object  $window       browser window containing localStorage
     */
    combineBulletgraphElements: function (util, overlays, minDuration, avgDuration, maxDuration, curDuration, elementID, shape, $window) {
        if (util.checkConditions(minDuration, avgDuration, maxDuration, curDuration)) {

            // clear any current overlays displayed
            util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds, elementID);
            
            var timeChoice = util.commonConversion.checkTimeUnit(maxDuration);
            var minDuration = util.commonConversion.convertTimes(minDuration, timeChoice);
            var avgDuration = util.commonConversion.convertTimes(avgDuration, timeChoice);
            var maxDuration = util.commonConversion.convertTimes(maxDuration, timeChoice);
            var curDuration = util.commonConversion.convertTimes(curDuration, timeChoice);
            var colorBullet = util.determineColor(avgDuration, maxDuration, curDuration);
            var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, util.createHTML(util, $window, elementID), 120, 30);
            util.overlayActivityIds[elementID].push(newOverlayId);
            console.log(util.overlayActivityIds);
            util.setGraphSettings(elementID, maxDuration, util.checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet);
            
        }
    },

    /**
     * This function will check if the conditions to show the bulletgraph are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Any of the duration variables are not equal to NULL
     * - The average duration is not equal to '0'.
     *
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Boolean               if conditions are satisfied or not
     */
    checkConditions: function (minDuration, avgDuration, maxDuration, curDuration) {
        if (avgDuration != null && minDuration != null && maxDuration != null && curDuration != null && avgDuration != 0) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * This function decides which color the bullet graph should have on the following
     * conditions which are specified in the URD:
     * - Green: If the current duration is less or equal to the average and maximal duration
     * - Orange: If the current duration is less or equal to the maximal duration and greater than the average duration
     * - Red: If he current duration is greater than both the average durationa and the maximal duration
     * 
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  String              A string which represents the color
     */
    determineColor: function (avgDuration, maxDuration, curDuration) {
        if (curDuration <= maxDuration && curDuration <= avgDuration) {
            return 'green';
        } else if (curDuration <= maxDuration && curDuration > avgDuration) {
            return 'orange';
        } else {
            return 'red';
        }
    },

    /**
     * Creates an HTML line with has a class that includes the elementID. If the bulletgraph
     * is not selected to show it will add another class to the HTML to hide the bulletgraph
     * 
     * @param   Object  util            object of this class, to call its functions and variables
     * @param   Object  $window         browser window containing localStorage
     * @param   String  elementID   Variable to be converted.
     * @return  String              A string which represents an HTML line which will be added later
     */
    createHTML: function (util, $window, elementID) {
        if (util.commonOptions.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Bulletgraph")) {
            return '<div class="bullet-duration-' + elementID + '"> </div>';
        } else { return '<div class="bullet-duration-' + elementID + ' bullet-hidden"> </div>' }
    },

    /**
     * This function combines all information passed into it to set the settings
     * of the bullet graph. This function is made from the code which is provided
     * on the following github: https://gist.github.com/mbostock/4061961#file-bullet-js (accesed on 29-5-2018).
     * The functions which we included are coming also from this github repository.
     * Additionally we are also using the D3 library (https://d3js.org/).
     *
     * This function adds the bulletgraph to the html class which is defined in a seperate function. 
     * The same function will be selected by using the elementID. In the data variable, the data for
     * the bulletgraph will be set. This data includes the range, the current value and the marker value.
     *
     * @param   String  elementID     ID of element
     * @param   Number  rangeBullet   range of bulletgraph
     * @param   Number  currentBullet current value of bulletgraph
     * @param   Number  markerBullet  marker value of bulletgraph
     * @param   Number  colorBullet   color of bulletgraph
     */
    setGraphSettings: function (elementID, rangeBullet, currentBullet, markerBullet, colorBullet) {
        var cssClass = '.bullet-duration-' + elementID;
        var data = [
            {
                "ranges": [rangeBullet],
                "measures": [currentBullet, currentBullet],
                "markers": [markerBullet]
            }
        ];
        var container = d3.select(cssClass).node().getBoundingClientRect();
        var margin = { top: 5, right: 5, bottom: 15, left: 5 },
            width = 100 - margin.left - margin.right,
            height = 40 - margin.top - margin.bottom;

        var chart = d3.bullet(width, height)
          .width(width)
          .height(height);

        var svg = d3.select(cssClass).selectAll("svg")
          .data(data)
          .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", 100)
          .attr("height", 40)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);

            var coloring = d3.select(cssClass).selectAll("rect.measure.s1")
                .attr("fill", colorBullet)
    },

    /**
     * This function checks if the current duration is greater or equal to the maximal duration
     * since the bullet graph should not exceed the maximal duration.
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Number                either current duration or maximal duration
     */
    checkIfCurBiggerMax: function (curDuration, maxDuration) {
        if (curDuration >= maxDuration) {
            return maxDuration;
        } else {
            return curDuration;
        }
    }
});
