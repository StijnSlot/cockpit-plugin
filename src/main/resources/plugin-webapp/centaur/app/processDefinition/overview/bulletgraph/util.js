define({
    commonConversion: {},

    commonOptions: {},

    commonOverlays: {},

    commonVariables: {},

    commonBulletgraph: {},

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
        if (util.commonOptions.getOption($window.localStorage, util.procDefId, "true", "KPI", "order_bulletGraph") === "false") {
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

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
         * @param   Object  data   minimal duration of process
         */
        $q.all([$scope.processActivityStatistics_temp, $scope.instanceStartTime_temp, $scope.orderStatistics_temp]).then(function (data) {
            $scope.processActivityStatistics = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
            $scope.instanceStartTime = data[1];
            $scope.orderStatistics = data[2];

            /**
             * Extracts data from JSON objects and calls composeHTML()
             * function to add the extracted to the diagram.
             *
             * @param   Object  shape   shape of element
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
                        var getMinDuration = 12;

                        util.combineBulletgraphElements(util, overlays, getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, $window);
                        break;
                    }
                }
            });
        });
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
    combineBulletgraphElements: function (util, overlays, minDuration, avgDuration, maxDuration, curDuration, elementID, $window) {
        if (util.commonBulletgraph.checkConditions(minDuration, avgDuration, maxDuration, curDuration)) {

            var cssClass = "bullet-duration-overview";

            // initialize the overlayActivityId array
            if(util.overlayActivityIds[elementID] === undefined)
                util.overlayActivityIds[elementID] = [];

            // clear any current overlays displayed
            util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[elementID]);
            
            var timeChoice = util.commonConversion.checkTimeUnit(maxDuration, false);
            var minDuration = util.commonConversion.convertTimes(minDuration, timeChoice);
            var avgDuration = util.commonConversion.convertTimes(avgDuration, timeChoice);
            var maxDuration = util.commonConversion.convertTimes(maxDuration, timeChoice);
            var curDuration = util.commonConversion.convertTimes(curDuration, timeChoice);
            var colorBullet = util.commonBulletgraph.determineColor(avgDuration, maxDuration, curDuration);

            var html = util.commonBulletgraph.createHTML(cssClass);

            var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, html, 120, 30);

            util.commonOverlays.setOffset(html, $window.localStorage, util.procDefId + "_" + elementID + "_overview_bulletgraph");
            util.commonOverlays.addDraggableFunctionality($window.localStorage, util.procDefId + "_" + elementID + "_overview_bulletgraph",
                elementID, html, util.commonOverlays.canvas, false);

            util.overlayActivityIds[elementID].push(newOverlayId);
            util.commonBulletgraph.setGraphSettings(elementID, maxDuration, util.commonBulletgraph.checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet, cssClass);
        }
    }
});
