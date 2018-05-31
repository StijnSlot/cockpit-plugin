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
     * @param util              object of this class, to call its functions and variables
     */
    addActivityElements: function($window, $http, elementRegistry, processDiagram, overlays, Uri, util) {

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            var html = util.createVariableList();

            // get number of instance variables to show
            util.variableNum = util.getVariableNum($window.localStorage, util.procDefId + "_var_num");

            $http.get(Uri.appUri("engine://engine/:engine/process-instance" +
                "?processDefinitionId=" + util.procDefId +
                "&activityIdIn=" + element.id))
                .success(function(instances) {

                    util.clearOverlays(overlays, util.overlayActivityIds, element.id);

                    var i = instances.length - 1;
                    instances.forEach(function(instance) {

                        $http.get(Uri.appUri("engine://engine/:engine/process-instance/" +
                            instance.id + "/variables"))
                            .success(function(data) {

                                data = util.filterVariables($window.localStorage, data, util.procDefId + "_var_");

                                util.addData(html, data, overlays, element.id, util, i);
                                i++;
                            });
                    });
                });
        });
    }
});