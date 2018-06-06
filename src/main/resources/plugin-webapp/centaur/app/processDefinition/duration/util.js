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

            var avgDurationUnit = util.commonConversion.checkTimeUnit(avgDuration);
            var maxDurationUnit = util.commonConversion.checkTimeUnit(maxDuration);
            var avgDurationHTML = util.commonConversion.convertTimes(avgDuration, avgDurationUnit).toString() + ' ' + avgDurationUnit;
            var maxDurationHTML = util.commonConversion.convertTimes(maxDuration, maxDurationUnit).toString() + ' ' + maxDurationUnit;
            var curDurationHTML = util.checkIfCurValid(util, curDuration);

            var html = util.createHTML(util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML);

            util.commonOverlays.setOffset(html, $window.localStorage, util.procDefId + "_" + elementID + "_duration");
            util.commonOverlays.addDraggableFunctionality($window.localStorage, util.procDefId + "_" + elementID + "_duration", elementID, html);

            var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, html, 120, -40);
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
            var curDurationUnit = util.commonConversion.checkTimeUnit(curDuration);
            return util.commonConversion.convertTimes(curDuration, curDurationUnit).toString() + ' ' + curDurationUnit;
        } else {
            return '-';
        }
    },

    /**
     * Creates an the HTML needed to display the duration. This function also checks if something is 
     * selected in the options tab.
     * 
     * @param   Object  util            object of this class, to call its functions and variables
     * @param   Object  $window         browser window containing localStorage
     * @param   String  curDurationHTML string to display with the current duration
     * @param   String  avgDurationHTML string to display with the average duration
     * @param   String  maxDurationHTML string to display with the maximum duration
     * @return  String                  string which represents an HTML line which will be added later to the document
     */
    createHTML: function (util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML) {
        var data = {};
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity current duration")) {
            data['cur'] = {value: curDurationHTML};
        }
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity average duration")) {
            data['avg'] = {value: avgDurationHTML};
        }
        if (util.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_" + "Activity maximum duration")) {
            data['max'] = {value: maxDurationHTML};
        }

        var html = document.createElement('div');
        html.className = "durationText";
        html.appendChild(util.commonVariables.createVariableUl(data));

        return html;
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