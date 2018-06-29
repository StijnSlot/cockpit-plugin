define({
    /**
     * Common util files. These are examples.
     */
    // commonConversion: {},
    // commonOptions: {},
    // commonOverlays: {},

    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

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
     * @param   localStorage           browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           contains viewer
     * @param   processDiagram    diagram containing elements
     */
    myNewModule: function (util, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        var elementRegistry = viewer.get('elementRegistry');
        util.commonOverlays.canvas = viewer.get('canvas');

        // The following code is to make the KPI selectable

        if (util.commonOptions.getOption(localStorage, util.procDefId, "false", "KPI", /* "KPI_name", needs to be added in common/KPI.js */) === "false") {
            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        // Queries which can get data from the database. 

        var promise1 = $http.get(Uri.appUri("plugin://centaur/:engine/process-activity" +
            "?procDefId=" + util.procDefId));
        var promise2 = $http.get(Uri.appUri("plugin://centaur/:engine/instance-start-time" +
            "?procDefId=" + util.procDefId));    

        $q.all([promise1, promise2]).then(function (data) {
            var activityStatistics = data[0].data;
            var instanceStartTime = data[1].data;

            elementRegistry.forEach(function (shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                
                // Put here your code....

            });
        });
    },

});