define({
    /**
     * common bulletgraph util
     */
    commonBulletgraph: {},

    /**
     * Extracts data from JSON objects and calls composeHTML()
     * function to add the extracted to the diagram.
     *
     * @param   Object  shape   shape of element
     */
    extractDiagram: function (util, processActivityStatistics, instanceStartTime, orderStatistics, $window, elementRegistry, processDiagram, overlays) {
        elementRegistry.forEach(function (shape) {

            var element = processDiagram.bpmnElements[shape.businessObject.id];
            var startEvent = "";
            for (var i = 0; i < processActivityStatistics.length; i++) {

                if (shape.type === "bpmn:StartEvent") {
                    startEvent = shape.businessObject.id;
                }

                if (processActivityStatistics[i].id === startEvent) {
                    var getAvgDuration = orderStatistics[0].avgDuration;
                    var getMaxDuration = orderStatistics[0].maxDuration;
                    var getCurDuration = util.commonBulletgraph.commonConversion.calculateAvgCurDurationOfAllInstances(util.commonBulletgraph.commonConversion, instanceStartTime);

                    var cssClass = util.setSepcificBulletGraphCssClass(element.id);
                    var cssOverlayClass = util.setSepcificBulletGraphOverlayCssClass;

                    util.commonBulletgraph.combineBulletgraphElements(util.commonBulletgraph, overlays, getAvgDuration, getMaxDuration, getCurDuration, element.id, $window, cssClass, cssOverlayClass);
                    break;
                }
            }
        });
    },

    setSepcificBulletGraphCssClass: function (elementId) {
        return "bullet-duration-overview";
    },

    setSepcificBulletGraphOverlayCssClass: function () {
        return "overview_bulletgraph";
    }
});
