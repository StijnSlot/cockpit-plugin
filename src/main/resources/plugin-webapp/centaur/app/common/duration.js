define({
    commonConversion: {},
    commonOverlays: {},
    commonOptions: {},

    procDefId: "",

    procInstId: null,

    overlayActivityIds: {},

    /**
     * Main function of the duration module. In here the data will be loaded
     * from the database by using promises. Also functions will be called
     * to add information to the BPMN model.
     *
     * @param   util              object of this class, to call its functions and variables
     * @param   $scope            object with corresponding properties and methods
     * @param   $http             http client for GET request
     * @param   localStorage      contains user options
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           registry containing bpmn elements
     * @param   processDiagram    diagram containing elements
     */
    duration: function (util, $scope, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        util.commonOverlays.canvas = viewer.get('canvas');
        var overlays = viewer.get('overlays');
        var elementRegistry = viewer.get('elementRegistry');

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity?procDefId=" + util.procDefId), {
            catch: false
        });
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time?procDefId=" + util.procDefId), {
            catch: false
        });

        $q.all([promise1, promise2]).then(function (data) {
            var processActivityStatistics = data[0].data;
            var instanceStartTime = data[1].data;

            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                var activity = processActivityStatistics.find(function(activity) {
                    return (activity.id === element.id);
                });
                if(activity == null) return;

                var instances = instanceStartTime.filter(function(instance) {
                    return (instance.activityId === element.id &&
                        (util.procInstId == null || instance.instanceId === util.procInstId));
                });
                var curDuration = util.commonConversion.calculateAvgCurDuration(util.commonConversion, instances);

                var avgDurationUnit = util.commonConversion.checkTimeUnit(activity.avgDuration, false);
                var maxDurationUnit = util.commonConversion.checkTimeUnit(activity.maxDuration, false);
                var avgDuration = util.commonConversion.convertTimes(activity.avgDuration, avgDurationUnit).toString() +
                    ' ' + avgDurationUnit;
                var maxDuration = util.commonConversion.convertTimes(activity.maxDuration, maxDurationUnit).toString() +
                    ' ' + maxDurationUnit;
                curDuration = util.checkIfCurValid(util, curDuration);

                if (!util.checkConditions(avgDuration, maxDuration)) return;

                var html = util.createHTML(util, localStorage, curDuration, avgDuration, maxDuration, "durationText", "act");

                util.addOverlay(util, overlays, html, element.id, localStorage, "duration");
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
     * Otherwise it checks which time interval to use for each
     * duration variable and combines them into one String variable, htmlText.
     * The htmlText variable is passed to the addTextToId() function
     * so that the duration varables are displayed next to the
     * process diagram element.
     *
     * @param   {Object}  util          object of this class, to call its functions and variables
     * @param   {Object}  overlays      collection of overlays to add to
     * @param   {Object}  html          DOM element
     * @param   {Number}  elementID     ID of element
     * @param   {Object}  localStorage  browser window containing localStorage
     * @param   {String}  id            id of item in localStorage
     */
    addOverlay: function (util, overlays, html, elementID, localStorage, id) {
        // initialize the overlayActivityId array
        if(util.overlayActivityIds[elementID] === undefined)
            util.overlayActivityIds[elementID] = [];

        // clear any current overlays displayed
        util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[elementID]);

        var newOverlayId = util.commonOverlays.addTextElement(overlays, elementID, html, 120, -40);

        util.commonOverlays.getOffset(html.parentNode, localStorage, util.procDefId, elementID, id);
        var setOffset = function(top, left) {
            util.commonOverlays.setOffset(localStorage, util.procDefId, elementID, id, top, left);
        };
        util.commonOverlays.addDraggableFunctionality(elementID, html.parentNode, util.commonOverlays.canvas, true, setOffset);

        return util.overlayActivityIds[elementID].push(newOverlayId);
    },

    /**
     * This function will check if the conditions to show the durations are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Average and maximum, duration variables are not equal to NULL.
     * - The average duration is not equal to '0'.
     *
     * @param   {Number}  avgDuration   Average duration of process.
     * @param   {Number}  maxDuration   Maximum duration of process.
     * @return  {Boolean}               If conditions are satisfied or not.
     */
    checkConditions: function (avgDuration, maxDuration) {
        return (avgDuration != null && maxDuration != null && avgDuration !== 0);
    },

    /**
     * This function checks if the current duration is not equal to null. 
     * If the current duration is equal to null it should display a '-'.
     * 
     * @param   {Object}  util          Object of this class, to call its functions and variables.
     * @param   {Number}  curDuration   Current duration of process in ms.
     * @return  {String}                Either the current duration or a '-'.
     */
    checkIfCurValid: function (util, curDuration) {
        if (curDuration != null) {
            var curDurationUnit = util.commonConversion.checkTimeUnit(curDuration, false);
            return util.commonConversion.convertTimes(curDuration, curDurationUnit).toString() + ' ' + curDurationUnit;
        }
        return '-';
    },

    /**
     * Creates an HTML element needed to display the duration. This function also checks if something is 
     * selected in the options tab.
     * 
     * @param   {Object}  util              Object of this class, to call its functions and variables.
     * @param   {Object}  localStorage      contain user options
     * @param   {String}  curDurationString String to containing the current duration.
     * @param   {String}  avgDurationString String to containing the average duration.
     * @param   {String}  maxDurationString String to containing the maximum duration.
     * @param   {String}  cssClass          Classname of object
     * @param   {String}  category          String which determine which KPI is meant (for example activity and order)
     * @return  {String}                    String which represents an HTML line which will later on be added to the document.
     */
    createHTML: function (util, localStorage, curDurationString, avgDurationString, maxDurationString, cssClass, category) {
        var html = document.createElement('DIV');
      
        html.classList.add("custom-overlay", cssClass);

        var ul = document.createElement('UL');

        var li;
        if (util.commonOptions.getOption(localStorage, util.procDefId, "true", "KPI", category + "_cur_duration") !== "false") {
            li = document.createElement('LI');
            li.innerHTML = "<b>cur: </b>" + curDurationString;
            ul.appendChild(li);
        }
        if (util.commonOptions.getOption(localStorage, util.procDefId, "true", "KPI", category + "_avg_duration") !== "false") {
            li = document.createElement('LI');
            li.innerHTML = "<b>avg: </b>" + avgDurationString;
            ul.appendChild(li);
        }
        if (util.commonOptions.getOption(localStorage, util.procDefId, "true", "KPI", category + "_max_duration") !== "false") {
            li = document.createElement('LI');
            li.innerHTML = "<b>max: </b>" + maxDurationString;
            ul.appendChild(li);
        }

        html.appendChild(ul);
        return html;
    }
});