define({
    /**
     * process definition id
     */
    procDefId: "",

    /**
     * Extracts data from JSON objects and calls composeHTML()
     * function to add the extracted to the diagram.
     *
     * @param   util              object of this class, to call its functions and variables
     * @param   $http             http client for GET request
     * @param   localStorage      browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           registry containing bpmn elements
     * @param   processDiagram    diagram containing elements
     */
    bulletgraph: function (util, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        if (util.commonOptions.getOption(localStorage, util.procDefId, "true", "KPI",
            "process_bulletGraph") === "false") {
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/order-statistics" +
            "?procDefId=" + util.procDefId));
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/process-instance-start-time" +
            "?procDefId=" + util.procDefId));

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

            var getAvgDuration = orderStatistics.avgDuration;
            var getMaxDuration = orderStatistics.maxDuration;
            var getCurDuration = util.commonConversion.calculateAvgCurDuration(util.commonConversion, instances);

            util.combineBulletgraphElements(util, overlays, getAvgDuration, getMaxDuration,
                getCurDuration, element.id, localStorage, "bulletgraph-overview", "process_bulletGraph", true);

        });
    }
});
