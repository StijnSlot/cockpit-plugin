define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * process definition id
     */
    procDefId: "",

    /**
     * process instance id
     */
    procInstanceId: "",

    /**
     * common util file for variables
     */
    commonVariable: {},

    /**
     * common util file for overlays
     */
    commonOverlays: {},

    /**
     * common util file for options
     */
    commonOptions: {},

    /**
     * Adds an element with variables to each activity
     *
     * @param $window           browser window containing localStorage
     * @param $http             http client for GET request
     * @param control           contains overlays and elementRegistry
     * @param processDiagram    diagram containing elements
     * @param Uri               uniform resource identifier to create GET request
     * @param util              object of this class, to call its functions and variables
     */
    addInstanceVariables: function($window, $http, control, processDiagram, Uri, util) {

        // get overlay and elements from the diagram
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        // if not selected variables
        if(!util.commonOptions.isSelectedOption($window.localStorage, util.procDefId + "_KPI_" + "Variables")) {

            // loop over all elements in the diagram to clear them
            elementRegistry.forEach(function (shape) {
                // get corresponding element from processDiagram
                var element = processDiagram.bpmnElements[shape.businessObject.id];

                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        // get number of instance variables to show
        util.commonVariable.variableNum = util.commonOptions.getVariableNum($window.localStorage, util.procDefId + "_var_num");
        util.commonVariable.procDefId = util.procDefId;
        util.commonVariable.procInstanceId = util.procInstanceId;
        util.commonVariable.commonOverlays = util.commonOverlays;
        util.commonVariable.commonOptions = util.commonOptions;

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            var html = util.commonVariable.createVariableDiv();

            if(util.overlayActivityIds[element.id] === undefined) util.overlayActivityIds[element.id] = [];

            $http.get(Uri.appUri("engine://engine/:engine/execution" +
                "?processInstanceId=" + util.procInstanceId +
                "&activityId=" + element.id))
                .success(function(executions) {

                    util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);

                    var i = executions.length - 1;
                    executions.forEach(function(execution) {
                        $http.get(Uri.appUri("engine://engine/:engine/execution/" +
                            execution.id + "/localVariables"))
                            .success(function(data) {
                                var id = util.commonVariable.handleVariableData(data, $window.localStorage, html,
                                    overlays, element.id, util.commonVariable, i);
                                if(id !== undefined) util.overlayActivityIds[element.id].push(id);
                                i--;
                            });
                    });
                });

        });
    }
});