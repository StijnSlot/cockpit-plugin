define({


    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * Main function of the duration module. In here the data will be loaded
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
    duration: function (util, $scope, $http, $window, Uri, $q, elementRegistry, processDiagram, overlays) {
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
         * @param   {Object}  data   minimal duration of process
         */
        $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp]).then(function (data) {
            $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
            $scope.instanceStartTime = data[1];

            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   {Object}  shape   shape of element
             */
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {
                    if ($scope.processActivityStatistics.data[i].id == element.id) {
                        var getAvgDuration = $scope.processActivityStatistics.data[i].avgDuration;
                        var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                        var getMaxDuration = $scope.processActivityStatistics.data[i].maxDuration;
                        var getCurDuration = util.calculateCurDuration($scope.instanceStartTime.data, element.id);
                        util.composeHTML(util, overlays, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape, $window);
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
     * @param   Number  elementId   ID of diagram element that represents instance
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
     * Decides which time interval to use.
     *
     * The database keeps track of the duration in milli seconds.
     * This is difficult to read in the diagram, so we convert the
     * milli senconds into following intervals: seconds, minutes,
     * hours, days, weeks to make it easier to read.
     *
     * @param   Number  duration      duration of process
     * @return  String  durationHTML  duration as String
     */
    checkTimes: function (duration) {
        if (duration > 1000 && duration < 60001) {
            var durationHTML = (Math.round(duration / 1000 * 10) / 10).toString() + ' seconds';
        } else if (duration > 60000 && duration < 3600001) {
            var durationHTML = (Math.round(duration / 60000 * 10) / 10).toString() + ' minutes';
        } else if (duration > 3600000 && duration < 86400001) {
            var durationHTML = (Math.round(duration / 3600000 * 10) / 10).toString() + ' hours';
        } else if (duration > 86400000 && duration < 604800001) {
            var durationHTML = (Math.round(duration / 86400000 * 10) / 10).toString() + ' days';
        } else if (duration > 604800000) {
            var durationHTML = (Math.round(duration / 604800001 * 10) / 10).toString() + ' weeks';
        } else {
            var durationHTML = (duration).toString() + ' ms';
        }
        return durationHTML;
    },

    /**
     * Adds text to specified diagram element.
     * 
     * @param   Number  elementId   ID of diagram element
     * @param   String  text        The text to be displayed
     * @param   Object  shape       Shape of the element
     * @param   Overlay overlays    collection of overlays to add to
     * 
     */
    addTextToId: function (elementId, text, shape, overlays) {

        var $overlayHtml =
            $(text)
                .css({
                    width: shape.width,
                    height: shape.height
                });

        return overlays.add(elementId, {
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

    },

    /**
     * This function will check if the conditions to show the durations are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Average and maximu, duration variables are not equal to NULL
     * - The average duration is not equal to '0'.
     *
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Boolean               if condtions are satisfied or not
     */
    checkConditions: function (avgDuration, maxDuration) {
        return avgDuration != null && maxDuration != null && avgDuration != '0';
    },

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
     * @param   Object  util          object of this class, to call its functions and variables
     * @param   Overlay overlays      collection of overlays to add to
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @param   Number  elementID     ID of element
     * @param   Object  shape         Shape of the element
     * @param   Object  $window       browser window containing localStorage
     */
    composeHTML: function (util, overlays, avgDuration, maxDuration, curDuration, elementID, shape, $window) {
        if (util.checkConditions(avgDuration, maxDuration)) {

            // clear any current overlays displayed
            util.clearOverlays(overlays, util.overlayActivityIds, elementID);

            var avgDurationHTML = util.checkTimes(avgDuration);
            var maxDurationHTML = util.checkTimes(maxDuration);
            var curDurationHTML = util.checkIfCurValid(util, curDuration);
            var htmlText = util.createHTML(util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML);
            var newOverlayId = util.addTextToId(elementID, htmlText, shape, overlays);
            util.overlayActivityIds[elementID].push(newOverlayId);
        }
    },

    /**
     * This function checks if the current duration is not equal to null. 
     * If the durrent duration is equal to null it should display a '-'.
     * 
     * @param   Object  util          object of this class, to call its functions and variables
     * @param   Number  curDuration   current duration of process
     * @return  String                either current duration or '-'
     */
    checkIfCurValid: function (util, curDuration) {
        if (curDuration != null) {
            return util.checkTimes(curDuration);
        } else {
            return '-';
        }
    },

    /**
     * Creates an HTML line with has which will show different part depending on which KPI is
     * selected to be shown.
     * 
     * @param   Object  util            object of this class, to call its functions and variables
     * @param   Object  $window         browser window containing localStorage
     * @param   String  curDurationHTML string to display with the current duration
     * @param   String  avgDurationHTML string to display with the average duration
     * @param   String  maxDurationHTML string to display with the maximum duration
     * @return  String                  string which represents an HTML line which will be added later to the document
     */
    createHTML: function (util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML) {
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity current duration")) {
            curDurationHTML = 'Cur: ' + curDurationHTML;
        } else { curDurationHTML = '' }
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity average duration")) {
            avgDurationHTML = ' <br> Avg: ' + avgDurationHTML;
        } else { avgDurationHTML = '' }
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity maximum duration")) {
            maxDurationHTML = ' <br> Max: ' + maxDurationHTML;
        } else { maxDurationHTML = '' }
        return '<div class="durationText"> ' + curDurationHTML + avgDurationHTML + maxDurationHTML + '</div>';
    },

    /**
     * Removes all variables which are not selected by the user
     *
     * @param localStorage  contains user options
     * @param item          used for getting localStorage item option
     */
    isSelectedVariable: function (localStorage, item) {
        return localStorage.getItem(item) === 'true';
    },

    /**
     * Clears all overlays whose id is stored in overlayIds and clears overlayIds
     *
     * @param overlays              overlays object containing all diagram overlays
     * @param overlayActivityIds    ids of overlays which should be removed
     * @param id
     */
    clearOverlays: function (overlays, overlayActivityIds, id) {
        if (overlayActivityIds[id] !== undefined) {
            overlayActivityIds[id].forEach(function (element) {
                overlays.remove(element);
            });
        }
        overlayActivityIds[id] = [];
    }


});