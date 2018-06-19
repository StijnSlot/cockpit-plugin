define({

    commonConversion: {},

    commonOptions: {},

    commonOverlays: {},

    commonVariables: {},

    commonDuration: {},


    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * variable containing all current duration of the bulletgraph
     */
    averageDuration: {},

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
        $scope.orderStatistics_temp = $http.get(Uri.appUri("plugin://centaur/:engine/order-statistics?" + "procDefId=" + util.procDefId), {
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
        $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp, $scope.orderStatistics_temp]).then(function (data) {
            $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
            $scope.instanceStartTime = data[1];
            $scope.orderStatistics = data[2];

            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   {Object}  shape   shape of element
             */
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                var startEvent = "";
                for (var i = 0; i < $scope.processActivityStatistics.data.length; i++) {

                    if (shape.type === "bpmn:StartEvent") {
                        startEvent = shape.businessObject.id;
                    }

                    if ($scope.processActivityStatistics.data[i].id === startEvent) {
                        var getAvgDuration = $scope.orderStatistics.data[0].avgDuration;
                        //var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                        var getMaxDuration = $scope.orderStatistics.data[0].maxDuration;
                        var getCurDuration = util.commonConversion.calculateAvgCurDurationOfAllInstances(util.commonConversion, $scope.instanceStartTime.data);

                        util.composeHTML(util, overlays, getAvgDuration, getMaxDuration, getCurDuration, element.id, shape, $window);
                        break;
                    }
                }
            });
        });
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
        if (util.commonDuration.checkConditions(avgDuration, maxDuration)) {

            var cssClass = "overviewDurationText";

            // initialize the overlayActivityId array
            if(util.overlayActivityIds[elementID] === undefined)
                util.overlayActivityIds[elementID] = [];

            // clear any current overlays displayed
            util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[elementID]);

            var avgDurationUnit = util.commonConversion.checkTimeUnit(avgDuration, false);
            var maxDurationUnit = util.commonConversion.checkTimeUnit(maxDuration, false);
            var avgDurationHTML = util.commonConversion.convertTimes(avgDuration, avgDurationUnit).toString() + ' ' + avgDurationUnit;
            var maxDurationHTML = util.commonConversion.convertTimes(maxDuration, maxDurationUnit).toString() + ' ' + maxDurationUnit;
            var curDurationHTML = util.commonDuration.checkIfCurValid(util, curDuration);

            var html = util.commonDuration.createHTML(util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML, cssClass, "order");

            var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, html, 120, -80);

            util.commonOverlays.setOffset(html, $window.localStorage, util.procDefId + "_" + elementID + "_overview_duration");
            util.commonOverlays.addDraggableFunctionality($window.localStorage, util.procDefId + "_" + elementID + "_overview_duration",
                elementID, html, util.commonOverlays.canvas, false);

            util.overlayActivityIds[elementID].push(newOverlayId);
        }
    }
});