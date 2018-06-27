define({
    /**
     * common util files
     */
    commonConversion: {},
    commonOptions: {},
    commonOverlays: {},

    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * contains process instance id
     */
    procInstanceId: null,

    /**
     * Main function of the bulletgraph module. In here the data will be loaded
     * from the database by using promises. Also functions will be called
     * to add information to the BPMN model.
     *
     * @param   util              object of this class, to call its functions and variables
     * @param   $http             http client for GET request
     * @param   localStorage           browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           contains viewer
     * @param   processDiagram    diagram containing elements
     */
    bulletgraph: function (util, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        var elementRegistry = viewer.get('elementRegistry');
        util.commonOverlays.canvas = viewer.get('canvas');

        if (util.commonOptions.getOption(localStorage, util.procDefId, "false", "KPI", "act_bulletGraph") === "false") {
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity" +
            "?procDefId=" + util.procDefId));
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time" +
            "?procDefId=" + util.procDefId));

        $q.all([promise1, promise2]).then(function (data) {
            var activityStatistics = data[0].data;
            var instanceStartTime = data[1].data;

            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                var activity = activityStatistics.find(function(activity) {
                    return activity.id === element.id;
                });
                if(activity == null) return;

                var instances = instanceStartTime.filter(function(instance) {
                    if (instance.instanceId === util.procInstanceId) {
                        console.log("It's the same");
                        console.log(instance.instanceId);
                    }
                    return (instance.activityId === element.id &&
                        (util.procInstanceId == null || instance.instanceId === util.procInstanceId));
                });

                var getAvgDuration = activity.avgDuration;
                var getMaxDuration = activity.maxDuration;
                var getCurDuration = util.commonConversion.calculateAvgCurDuration(util.commonConversion, instances);

                util.combineBulletgraphElements(util, overlays, getAvgDuration, getMaxDuration, getCurDuration,
                    element.id, localStorage, "bullet-duration-" + element.id, "bulletgraph", false);
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
     * @param   {Object}  util              object of this class, to call its functions and variables
     * @param   {Object}  overlays          collection of overlays to add to
     * @param   {Number}  avgDuration       average duration of process
     * @param   {Number}  maxDuration       maximum duration of process
     * @param   {Number}  curDuration       current duration of process
     * @param   {String}  elementID         ID of element
     * @param   {Object}  localStorage      browser window containing localStorage
     * @param   {String}  cssClass          classname of object
     * @param   {String}  cssOverlayClass   class of overlay
     * @param   {Boolean} overview          if the sizes of the overview should be used
     */
    combineBulletgraphElements: function(util, overlays, avgDuration, maxDuration, curDuration, elementID,
                                         localStorage, cssClass, cssOverlayClass, overview) {
        if (!util.checkConditions(avgDuration, maxDuration, curDuration)) {
            return;
        }

        // initialize the overlayActivityId array
        if(util.overlayActivityIds[elementID] === undefined)
            util.overlayActivityIds[elementID] = [];

        // clear any current overlays displayed
        util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[elementID]);

        var timeChoice = util.commonConversion.checkTimeUnit(maxDuration, false);
        avgDuration = util.commonConversion.convertTimes(avgDuration, timeChoice);
        maxDuration = util.commonConversion.convertTimes(maxDuration, timeChoice);
        curDuration = util.commonConversion.convertTimes(curDuration, timeChoice);
        var colorBullet = util.determineColor(avgDuration, maxDuration, curDuration);

        var html = util.createHTML(cssClass);

        var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, html, 150, 70);

        util.commonOverlays.getOffset(html.parentNode, localStorage, util.procDefId, elementID, cssOverlayClass);

        var setOffset = function(top, left) {
            util.commonOverlays.setOffset(localStorage, util.procDefId, elementID, cssOverlayClass, top, left);
        };

        util.commonOverlays.addDraggableFunctionality(elementID, html.parentNode, util.commonOverlays.canvas,
            !overview, setOffset);

        util.overlayActivityIds[elementID].push(newOverlayId);
        util.setGraphSettings(maxDuration, util.checkIfCurBiggerMax(curDuration, maxDuration), avgDuration,
            colorBullet, cssClass, overview);
    },

    /**
     * This function decides which color the bullet graph should have on the following
     * conditions which are specified in the URD:
     * 
     * - Green: If the current duration is less or equal to the average and maximum duration.
     * - Orange: If the current duration is less or equal to the maximum duration and greater than the average duration.
     * - Red: If the current duration is greater than both the average duration and the maximum duration.
     * 
     * @param   {Number}  avgDuration   Average duration of process.
     * @param   {Number}  maxDuration   Maximum duration of process.
     * @param   {Number}  curDuration   Current duration of process.
     * @return  {String}                A string which represents the color.
     */
    determineColor: function (avgDuration, maxDuration, curDuration) {
        if (curDuration <= maxDuration && curDuration <= avgDuration) {
            return "green";
        } else if (curDuration <= maxDuration && curDuration > avgDuration) {
            return "orange";
        } else {
            return "red";
        }
    },

    /**
     * This function will check if the conditions to show the bulletgraph are
     * satisfied.The conditions to show the bulletgraph are satisfied if:
     * 
     * - Any of the duration variables are not equal to NULL.
     * - The average duration is not equal to '0'.
     * - The current duration is not equal to '0'.
     *
     * @param   {Number}  avgDuration   Average duration of process.
     * @param   {Number}  maxDuration   Maximum duration of process.
     * @param   {Number}  curDuration   Current duration of process.
     * @return  {Boolean}               If conditions are satisfied or not.
     */
    checkConditions: function (avgDuration, maxDuration, curDuration) {
        return avgDuration != null && curDuration != null && maxDuration != null &&
               avgDuration !== 0 && curDuration !== 0;
    },

    /**
     * Creates a DOM element with has a class equal to cssClass.
     *
     * @param   {String}  cssClass      Classname of the html DOM element
     * @return  {Object}                DOM element of the overlay
     */
    createHTML: function (cssClass) {
        var graph = document.createElement('DIV');
        graph.className = cssClass;
        return graph;
    },

    /**
     * This function combines all information passed into it to set the settings
     * of the bullet graph. This function is made from the code which is provided
     * on the following github: https://gist.github.com/mbostock/4061961#file-bullet-js (accessed on 29-5-2018).
     * The functions which we included are coming also from this github repository.
     * Additionally we are also using the D3 library (https://d3js.org/).
     *
     * This function adds the bulletgraph to the DOM element which is defined in a separate function.
     * In the data variable, the data for the bulletgraph will be set.
     * This data includes the range, the current value and the marker value.
     *
     * @param   {Number}  rangeBullet   Range of bulletgraph.
     * @param   {Number}  currentBullet Current value of bulletgraph.
     * @param   {Number}  markerBullet  Marker value of bulletgraph.
     * @param   {Number}  colorBullet   Color of bulletgraph.
     * @param   {String}  cssClass      classname of the graph
     * @param   {Boolean} overview      If the sizes of the overview should be used
     */
    setGraphSettings: function (rangeBullet, currentBullet, markerBullet, colorBullet, cssClass, overview) {
        var newWidth = 100;
        var newHeight = 40;
        if (overview) {
            newWidth = 160;
            newHeight = 60;
        }
        var newCSSClass = '.' + cssClass;
        var data = [{
            "ranges": [rangeBullet],
            "measures": [currentBullet, currentBullet],
            "markers": [markerBullet]
        }];
        d3.select(newCSSClass).node().getBoundingClientRect();
        var margin = { top: 5, right: 5, bottom: 15, left: 5 },
            width = newWidth - margin.left - margin.right,
            height = newHeight - margin.top - margin.bottom;

        var chart = d3.bullet(width, height)
          .width(width)
          .height(height);

        d3.select(newCSSClass).selectAll("svg")
          .data(data)
          .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", newWidth)
          .attr("height", newHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(chart);

        d3.select(newCSSClass).selectAll("rect.measure.s1")
                .attr("fill", colorBullet)
    },

    /**
     * This function checks if the current duration is greater or equal to the maximum duration
     * since the bullet graph should not exceed the maximum duration.
     * 
     * @param   {Number}  maxDuration   Maximum duration of process.
     * @param   {Number}  curDuration   Current duration of process.
     * @return  {Number}                Either current duration or maximum duration.
     */
    checkIfCurBiggerMax: function (curDuration, maxDuration) {
        return Math.min(curDuration, maxDuration);
    }
});