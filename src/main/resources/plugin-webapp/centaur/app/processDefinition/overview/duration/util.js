define({

    commonConversion: {},

    commonDuration: {},

    commonOverlays: {},

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
     * @param   localStorage      contains user options
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                to resolve promises
     * @param   control           contains overlay, canvas, elementRegistry
     * @param   processDiagram    diagram containing elements
     */
    duration: function (util, $scope, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/order-statistics?procDefId=" + util.procDefId), {
            catch: false
        });
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/process-instance-start-time?procDefId=" + util.procDefId), {
            catch: false
        });

        $q.all([promise1, promise2]).then(function (data) {
            var orderStatistics = data[0].data[0];
            var instances = data[1].data;

            var startEvent = null;
            elementRegistry.forEach(function (shape) {
                if(shape.type === "bpmn:StartEvent")
                    startEvent = shape;
            });
            if(startEvent == null) return;

            var element = processDiagram.bpmnElements[startEvent.businessObject.id];

            var curDuration = util.commonConversion.calculateAvgCurDuration(util.commonConversion, instances);

            var avgDurationUnit = util.commonConversion.checkTimeUnit(orderStatistics.avgDuration, false);
            var maxDurationUnit = util.commonConversion.checkTimeUnit(orderStatistics.maxDuration, false);
            var avgDurationString = util.commonConversion.convertTimes(orderStatistics.avgDuration, avgDurationUnit).toString() + ' ' + avgDurationUnit;
            var maxDurationString = util.commonConversion.convertTimes(orderStatistics.maxDuration, maxDurationUnit).toString() + ' ' + maxDurationUnit;
            var curDurationString = util.commonDuration.checkIfCurValid(util, curDuration);

            if (!util.commonDuration.checkConditions(maxDurationString)) return;

            var html = util.commonDuration.createHTML(util, localStorage, curDurationString, avgDurationString,
                maxDurationString, "overviewDurationText", "overview");

            util.commonDuration.addOverlay(util.commonDuration, overlays, html, element.id, localStorage);
        });
    }
});