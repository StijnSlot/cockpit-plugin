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
     * @param control           contains overlays and elementregistry
     * @param processDiagram    diagram containing elements
     * @param Uri               uniform resource identifier to create GET request
     * @param util              object of this class, to call its functions and variables
     */
    addActivityElements: function($window, $http, control, processDiagram, Uri, util) {

        // get overlay and elements from the diagram
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        var elementRegistry = viewer.get('elementRegistry');

        // set variables for commonVariable
        util.commonVariable.variableNum = util.commonOptions.getVariableNum($window.localStorage, util.procDefId + "_var_num");
        util.commonVariable.procDefId = util.procDefId;
        util.commonVariable.commonOverlays = util.commonOverlays;

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            var html = util.commonVariable.createVariableDiv();
            util.commonOverlays.setOffset(html, $window.localStorage, util.procDefId + "_" + element.id + "_variables");

            if(util.overlayActivityIds[element.id] === undefined) util.overlayActivityIds[element.id] = [];

            $http.get(Uri.appUri("engine://engine/:engine/process-instance" +
                "?processDefinitionId=" + util.procDefId +
                "&activityIdIn=" + element.id))
                .success(function(instances) {
                    util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds, element.id);

                    var i = instances.length - 1;
                    instances.forEach(function(instance) {

                        $http.get(Uri.appUri("engine://engine/:engine/process-instance/" +
                            instance.id + "/variables"))
                            .success(function(data) {
                                var id = util.commonVariable.handleVariableData(data, $window.localStorage, html,
                                    overlays, element.id, util.commonVariable, i);
                                if(id !== undefined) {
                                    util.overlayActivityIds[element.id].push(id);
                                }
                                i--;
                            });
                    });
                });
        });
    }
});
