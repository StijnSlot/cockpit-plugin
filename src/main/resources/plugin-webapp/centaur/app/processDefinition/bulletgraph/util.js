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
    extractDiagram: function(util, processActivityStatistics, instanceStartTime, $scope, $window, elementRegistry, processDiagram, overlays) {
        elementRegistry.forEach(function (shape) {
            var element = processDiagram.bpmnElements[shape.businessObject.id];
            for (var i = 0; i < processActivityStatistics.length; i++) {
                if (processActivityStatistics[i].id === element.id) {
                    var getAvgDuration = processActivityStatistics[i].avgDuration;
                    var getMinDuration = processActivityStatistics[i].minDuration;
                    var getMaxDuration = processActivityStatistics[i].maxDuration;
                    var getCurDuration = commonBulletgraph.commonConversion.calculateAvgCurDuration(commonBulletgraph.commonConversion, instanceStartTime, element.id);
    
                    util.combineBulletgraphElements(util, overlays, getMinDuration, getAvgDuration, getMaxDuration, getCurDuration, element.id, $window);
                    break;
                }
            }
        });
    },

    /**
     * Combines all information of given process into a HTML line
     * which will be added to the HTML file. It will also set the graphsettings
     * which will be written to the class which is created in the HTML line.
     *
     * This function receives all duration information about a given process.
     * If any conditions which are defined in a seperate checkConditions() function
     * isn't satisfied, the bulletgraph will not display.
     * An HTML line will be passed to the addTextToId() function 
     * so that an class which includes an elementID will be added to the HTML file.
     * Information which has has been collected will be passed to the setGraphSettings()
     * function. Here it will create a bullet graph on he HTML line which has been
     * passed into the HTML file previously.
     *
     * @param   Object  util          object of this class, to call its functions and variables
     * @param   Overlay overlays      collection of overlays to add to
     * @param   Number  minDuration   minimum duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximum duration of process
     * @param   Number  curDuration   current duration of process
     * @param   String  elementID     ID of element
     * @param   Object  shape         Shape of the element
     * @param   Object  $window       browser window containing localStorage
     */
    combineBulletgraphElements: function (util, overlays, minDuration, avgDuration, maxDuration, curDuration, elementID, $window) {
        if (util.commonBulletgraph.checkConditions(minDuration, avgDuration, maxDuration, curDuration)) {

            var cssClass = "bullet-duration-" + elementID;

            // initialize the overlayActivityId array
            if(commonBulletgraph.overlayActivityIds[elementID] === undefined)
                commonBulletgraph.overlayActivityIds[elementID] = [];

            // clear any current overlays displayed
            commonBulletgraph.commonOverlays.clearOverlays(overlays, commonBulletgraph.overlayActivityIds[elementID]);
            
            var timeChoice = commonBulletgraph.commonConversion.checkTimeUnit(maxDuration, false);
            var minDuration = commonBulletgraph.commonConversion.convertTimes(minDuration, timeChoice);
            var avgDuration = commonBulletgraph.commonConversion.convertTimes(avgDuration, timeChoice);
            var maxDuration = commonBulletgraph.commonConversion.convertTimes(maxDuration, timeChoice);
            var curDuration = commonBulletgraph.commonConversion.convertTimes(curDuration, timeChoice);
            var colorBullet = commonBulletgraph.commonBulletgraph.determineColor(avgDuration, maxDuration, curDuration);

            var html = commonBulletgraph.commonBulletgraph.createHTML(cssClass);

            var newOverlayId = commonBulletgraph.commonOverlays.addTextElement(overlays, elementID, html, 120, 30);

            util.commonOverlays.getOffset(html.parentNode, $window.localStorage, util.procDefId, elementID,"bulletGraph");

            var setOffset = function(top, left) {
                commonBulletgraph.commonOverlays.setOffset($window.localStorage, commonBulletgraph.procDefId, elementID, "bulletGraph", top, left);
            };
            util.commonOverlays.addDraggableFunctionality(elementID, html.parentNode, util.commonOverlays.canvas, true, setOffset);

            commonBulletgraph.overlayActivityIds[elementID].push(newOverlayId);
            utcommonBulletgraphil.commonBulletgraph.setGraphSettings(elementID, maxDuration, commonBulletgraph.commonBulletgraph.checkIfCurBiggerMax(curDuration, maxDuration), avgDuration, colorBullet, cssClass);
        }
    }
});
