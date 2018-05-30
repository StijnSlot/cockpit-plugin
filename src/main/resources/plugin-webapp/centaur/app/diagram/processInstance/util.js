define({
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

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            var html = util.createVariableList();

            $http.get(Uri.appUri("engine://engine/:engine/execution" +
                "?processInstanceId=" + util.procInstanceId +
                "&activityId=" + element.id))
                .success(function(executions) {

                    //console.log(executions);

                    util.clearOverlays(overlays, util.overlayActivityIds, element.id);

                    var i = 0;
                    executions.forEach(function(execution) {
                        $http.get(Uri.appUri("engine://engine/:engine/execution/" +
                            execution.id + "/localVariables"))
                            .success(function(data) {

                                data = util.filterVariables($window.localStorage, data, util.procDefId + "_var_");
                                util.addData(html, data, overlays, element.id, util, i, executions.length - 1);
                                i++;
                            });
                    });
                });

        });
    }
});