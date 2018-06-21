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
     * @param   $http             http client for GET request
     * @param   localStorage      contains user options
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                to resolve promises
     * @param   control           contains overlay, canvas, elementRegistry
     * @param   processDiagram    diagram containing elements
     */
    duration: function (util, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/order-statistics" +
            "?procDefId=" + util.procDefId));
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/process-instance-start-time" +
            "?procDefId=" + util.procDefId));

        $q.all([promise1, promise2]).then(function (data) {
            var statistics = data[0].data[0];
            var instances = data[1].data;

            var startEvent = null;
            elementRegistry.forEach(function (shape) {
                if(shape.type === "bpmn:StartEvent")
                    startEvent = shape;
            });
            if(startEvent == null) return;

            var element = processDiagram.bpmnElements[startEvent.businessObject.id];

            var curDuration = util.commonConversion.calculateAvgCurDuration(util.commonConversion, instances);

            var avgDurationUnit = util.commonConversion.checkTimeUnit(statistics.avgDuration, false);
            var maxDurationUnit = util.commonConversion.checkTimeUnit(statistics.maxDuration, false);
            var avgDuration = util.commonConversion.convertTimes(statistics.avgDuration, avgDurationUnit).toString()
                + ' ' + avgDurationUnit;
            var maxDuration = util.commonConversion.convertTimes(statistics.maxDuration, maxDurationUnit).toString()
                + ' ' + maxDurationUnit;
            curDuration = util.checkIfCurValid(util, curDuration);

            if (!util.checkConditions(avgDuration, maxDuration)) return;

            var html = util.createHTML(util, localStorage, curDuration, avgDuration,
                maxDuration, "overviewDurationText", "process");

            util.addOverlay(util, overlays, html, element.id,
                localStorage, "overview-duration", true);
        });
    }
});