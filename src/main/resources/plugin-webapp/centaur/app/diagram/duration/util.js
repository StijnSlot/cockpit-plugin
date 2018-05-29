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
        var durationHTML = ((Math.round(duration / 1000 * 10) / 10).toString()) + ' seconds';
    } else if (duration > 60000 && duration < 1440001) {
        var durationHTML = ((Math.round(duration / 6000 * 10) / 10).toString()) + ' minutes';
    } else if (duration > 1440000 && duration < 34560001) {
        var durationHTML = ((Math.round(duration / 1440000 * 10) / 10).toString()) + ' hours';
    } else if (duration > 34560000 && duration < 241920001) {
        var durationHTML = ((Math.round(duration / 34560000 * 10) / 10).toString()) + ' days';
    } else if (duration > 241920000) {
        var durationHTML = ((Math.round(duration / 241920000 * 10) / 10).toString()) + ' weeks';
    } else {
        var durationHTML = (duration).toString() + ' ms';
    }
    return durationHTML;
    }
});