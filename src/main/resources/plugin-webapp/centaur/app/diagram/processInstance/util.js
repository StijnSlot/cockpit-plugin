define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains user options for number of variables to show
     */
    numValue: [],

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * Adds an element with variables to each activity
     *
     * @param $window           browser window containing localStorage
     * @param $http             http client for GET request
     * @param elementRegistry   registry containing bpmn elements
     * @param processDiagram    diagram containing elements
     * @param overlays          collection of overlays to add to
     * @param Uri               uniform resource identifier to create GET request
     * @param util          object of this class, to call its functions and variables
     */
    addActivityElements: function($window, $http, elementRegistry, processDiagram, overlays, Uri, util) {

        $http.get(Uri.appUri("engine://engine/:engine/process-instance" +
            "?processDefinitionId=" + util.procDefId))
            .success(function(instances) {
                instances.forEach(function(instance) {
                    $http.get(Uri.appUri("engine://engine/:engine/process-instance/" +
                        instance.id + "/variables"))
                        .success(function(data) {
                            console.log(data);
                        });
                });
            });

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            // get all variables attached to this activity
            $http.get(Uri.appUri("engine://engine/:engine/execution" +
                "?processDefinitionId=" + util.procDefId +
                "&activityId=" + element.id))
                .success(function(executions) {
                    if(!executions.length) return;

                    console.log(executions);

                    executions.forEach(function(execution) {
                        $http.get(Uri.appUri("engine://engine/:engine/execution/" +
                            execution.id + "/localVariables"))
                            .success(function(data) {
                                console.log(data);
                            });
                    });

                });

            // get all variables attached to this activity
            $http.get(Uri.appUri("plugin://centaur/:engine/instance-variables" +
                "?procDefId=" + util.procDefId +
                "&actId=" + element.id))
                .success(function (data) {

                    // clear any current overlays displayed
                    util.clearOverlays(overlays, util.overlayActivityIds, element.id);

                    // transform each variable
                    data = data.map(util.transformVariableData);

                    // remove all unselected variables
                    data = data.filter(function(x) {
                        return util.isSelectedVariable($window.localStorage, util.procDefId + "_var_" + x.name)
                    });

                    // if data is not empty, add element
                    if(data !== undefined && data.length && util.numValue > 0) {
                        var newOverlayId = util.addElement($window, overlays, Uri, element, data, util);
                        util.overlayActivityIds[element.id].push(newOverlayId);
                    }
                });
        });
    }
});