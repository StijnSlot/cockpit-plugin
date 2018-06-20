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
     * @param   $http             http client for GET request
     * @param   $window           browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           registry containing bpmn elements
     * @param   processDiagram    diagram containing elements
     */
    bulletgraph: function (util, $http, $window, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        if (util.commonOptions.getOption($window.localStorage, util.procDefId, "true", "KPI", "order_bulletGraph") === "false") {
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/order-statistics?procDefId=" + util.procDefId), {
            catch: false
        });
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/process-instance-start-time?procDefId=" + util.procDefId), {
            catch: false
        });

        $q.all([promise1, promise2]).then(function (data) {
            var orderStatistics = data[0].data[0];
            var instances = data[1].data;


            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                var startEvent = "";
                for (var i = 0; i < orderStatistics.length; i++) {

                    if (shape.type === "bpmn:StartEvent") {
                        startEvent = shape.businessObject.id;
                    }

                    if (orderStatistics.data[i].id === startEvent) {
                        var getAvgDuration = orderStatistics.data[0].avgDuration;
                        //var getMinDuration = $scope.processActivityStatistics.data[i].minDuration;
                        var getMaxDuration = orderStatistics.data[0].maxDuration;
                        var getCurDuration = util.commonConversion.calculateAvgCurDuration(util, instances);

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
        if (util.commonBulletgraph.checkConditions(avgDuration, maxDuration, curDuration)) {

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

            util.commonOverlays.getOffset(html.parentNode, $window.localStorage, util.procDefId, elementID, "overview_bulletgraph");

            var setOffset = function(top, left) {
                util.commonOverlays.setOffset($window.localStorage, util.procDefId, elementID, "overview_bulletgraph", top, left);
            };
            util.commonOverlays.addDraggableFunctionality(elementID, html.parentNode, util.commonOverlays.canvas, false, setOffset);

            util.overlayActivityIds[elementID].push(newOverlayId);
            util.commonBulletgraph.setGraphSettings(maxDuration, util.commonBulletgraph.checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet, cssClass);
        }
    }
});
