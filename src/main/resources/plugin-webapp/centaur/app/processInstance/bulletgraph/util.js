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
    extractDiagram: function(util, processActivityStatistics, instanceStartTime, $window, elementRegistry, processDiagram, overlays) {
        console.log("ExtractDiagram called");
        elementRegistry.forEach(function (shape) {
            var element = processDiagram.bpmnElements[shape.businessObject.id];
            for (var i = 0; i < processActivityStatistics.length; i++) {
                if (processActivityStatistics[i].id === element.id) {
                    var getAvgDuration = processActivityStatistics[i].avgDuration;
                    var getMaxDuration = processActivityStatistics[i].maxDuration;
                    var getCurDuration = util.commonBulletgraph.commonConversion.calculateCurDurationOfSpecInstance(instanceStartTime, element.id, util.commonBulletgraph.procInstanceId);

                    var cssClass = util.setSepcificBulletGraphCssClass(element.id);
                    var cssOverlayClass = util.setSepcificBulletGraphOverlayCssClass;
    
                    util.commonBulletgraph.combineBulletgraphElements(util.commonBulletgraph, overlays, getAvgDuration, getMaxDuration, getCurDuration, element.id, $window, cssClass, cssOverlayClass);
                    break;
                }
            }
        });
    },

    setSepcificBulletGraphCssClass: function (elementId) {
        return "bullet-duration-" + elementId;
    },

    setSepcificBulletGraphOverlayCssClass: function () {
        return "overview_bulletgraph";
    }
});
