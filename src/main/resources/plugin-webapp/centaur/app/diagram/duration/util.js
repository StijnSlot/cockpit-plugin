define({


    /**
     * Calculates the current duration of a instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of each process.
     *
     * @param   Number  instance    Instance of a process
     * @param   Number  elementId   ID of diagram element that represents instance
     */
    calculateCurDuration: function(instance, elementID) {
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId == elementID) {
                var startTime = Date.parse(instance[j].startTime);
                var computerTime = new Date().getTime();
                var timeDifference = computerTime - startTime;
                return timeDifference;
                break;
            }
        }
        return null;
    },

    /**
     * Decides which time interval to use.
     *
     * The database keeps track of the duration in milli seconds.
     * This is difficult to read in the diagram, so we convert the
     * milli senconds into following intervals: seconds, minutes,
     * hours, days, weeks to make it easier to read.
     *
     * @param   Number  duration      duration of process
     * @return  String  durationHTML  duration as String
     */
    checkTimes: function(duration) {
        if (duration > 1000 && duration < 60001) {
            var durationHTML = (Math.round(duration / 1000 * 10) / 10).toString() + ' seconds';
        } else if (duration > 60000 && duration < 3600001) {
            var durationHTML = (Math.round(duration / 60000 * 10) / 10).toString() + ' minutes';
        } else if (duration > 3600000 && duration < 86400001) {
            var durationHTML = (Math.round(duration / 3600000 * 10) / 10).toString() + ' hours';
        } else if (duration > 86400000 && duration < 604800001) {
            var durationHTML = (Math.round(duration / 86400000 * 10) / 10).toString() + ' days';
        } else if (duration > 604800000) {
            var durationHTML = (Math.round(duration / 604800001 * 10) / 10).toString() + ' weeks';
        } else {
            var durationHTML = (duration).toString() + ' ms';
        }
        return durationHTML;
    },

    /**
     * Adds text to specified diagram element.
     * @param   Number  elementId   ID of diagram element
     * @param   String  text        The text to be displayed
     * @param   Object  shape       Shape of the element
     * TODO: make into service
     */
    addTextToId: function(elementId, text, shape, overlays) {

        var $overlayHtml =
            $(text)
                .css({
                    width: shape.width,
                    height: shape.height
                });

        overlays.add(elementId, {
            position: {
                top: -40,
                left: -40
            },
            show: {
                minZoom: -Infinity,
                maxZoom: +Infinity
            },
            html: $overlayHtml
        });
    },

    /**
     * Combines all information of given process into single
     * String variable which is added to its diagram element.
     *
     * This function receives all duration information about a given process.
     * If any of duration variables are NULL it does not create
     * a hmtlText variable since there is nothing to display.
     * Otherwise it checks which time intervall to use for each
     * duration variable and combines them into one String variable, htmlText.
     * The htmlText variable is passed to the addTextToId() function
     * so that the duration varables are displayed next to the
     * process diagram element.
     *
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @param   Number  elementID     ID of element
     * @param   Object  shape         Shape of the element
     */
composeHTML: function( avgDuration, maxDuration, curDuration, elementID, shape, util, overlays) {
        if (checkConditions(avgDuration, maxDuration)) {
            var avgDurationHTML = util.checkTimes(avgDuration);
            var maxDurationHTML = util.checkTimes(maxDuration);
            var curDurationHTML = util.checkIfCurValid(curDuration);
            var htmlText = createHTML(curDurationHTML, avgDurationHTML, maxDurationHTML);
            util.addTextToId(elementID, htmlText, shape, overlays);
        }
},

checkConditions: function(avgDuration, maxDuration) {
    if (avgDuration != null && maxDuration != null && avgDuration != '0') {
        return true;
    } else {
        return false;
    }
},

checkIfCurValid: function (curDuration) {
    if (curDuration != null) {
        return util.checkTimes(curDuration);
    } else {
        return '-';
    }
},

createHTML: function (curDurationHTML, avgDurationHTML, maxDurationHTML) {
    return '<div class="durationText"> Cur: ' + curDurationHTML + ' <br> Avg: ' + avgDurationHTML + ' <br>' + 'Max: ' + maxDurationHTML + '</div>';
}



});