define({
    /**
     * array of average duration for activity elements
     */
    averageDuration: {},
    
    /**
     * Converts the duration based on the chosen time unit.
     *
     * The database keeps track of the duration in milliseconds.
     * This is difficult to read, therefore it has to be converted.
     * This function converts an given time in ms to seconds, minutes,
     * hours, days, based ont he given time unit choice.
     *
     * @param   {Number}  duration      Duration in ms.
     * @param   {String}  choice        Choice of time unit.
     * @return  {Number}                Duration as number.
     */
    convertTimes: function (duration, choice) {
        if (choice === 's' || choice === 'seconds') {
            return (Math.round(duration / 1000 * 10) / 10);
        } else if (choice === 'm' || choice === 'minutes') {
            return (Math.round(duration / 60000 * 10) / 10);
        } else if (choice === 'h' || choice === 'hours') {
            return (Math.round(duration / 3600000 * 10) / 10);
        } else if (choice === 'd' || choice === 'days') {
            return (Math.round(duration / 86400000 * 10) / 10);
        } else if (choice === 'w' || choice === 'weeks') {
            return (Math.round(duration / 604800000 * 10) / 10);
        } else {
            return duration;
        }
    },

    /**
     * Decides which time unit to use.
     *
     * The database keeps track of the duration in milli seconds.
     * Since a decision has to be made to show in the bulletgraph,
     * this determines which time unit (seconds, minutes,
     * hours, days, weeks) should be used.
     *
     * @param   {Number}  time      Duration of process
     * @param   {Boolean} longUnit  If long version of the unit should be shown
     * @return  {String}            Time unit choice
     */
    checkTimeUnit: function (time, longUnit) {
        var out;
        if (time > 1000 && time < 60001) {
            out = "seconds";
        } else if (time > 60000 && time < 3600001) {
            out = "minutes";
        } else if (time > 3600000 && time < 86400001) {
            out = "hours";
        } else if (time > 86400000 && time < 604800001) {
            out = "days";
        } else if (time > 604800000) {
            out = "weeks";
        } else {
            return "ms";
        }

        if(!longUnit) {
            out = out.charAt(0);
        }
        return out;
    },

    /**
     * Calculates the average current duration of all instances with the same ID of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we have to calculate the current average duration of each process.
     * 
     * @param   {Object}        util        Object of this class, to call its functions and variables.
     * @param   {Array<Object>} instances   Instance of a process.
     * @return  {Number}                    If no start time is present in the database: null,
     *                                      else the current time.
     */
    calculateAvgCurDuration: function (util, instances) {
        if(!instances.length) return null;

        var total = 0;
        instances.forEach(function(instance) {
            total += util.calculateTimeDifference(Date.parse(instance.startTime));
        });

        return (total / instances.length);
    },

    /**
     * Calculates the difference between a given start time and the current computer time.
     * 
     * @param   {Number}    startTime   Start time in ms.
     * @return  {Number}                Time difference between given time and computer time.
     */
    calculateTimeDifference: function (startTime) {
        var computerTime = new Date().getTime();
        return computerTime - startTime;
    },

    /**
     * Changes date to UTC timezone and truncates to remove milliseconds and 'Z'.
     *
     * @param   {String}    date        Date in local timezone.
     * @returns {String}                Date string.
     */
    toTruncatedUTC: function(date) {
        var newDate = new Date(date).toISOString();
        return newDate.substr(0, newDate.length - 5);
    }
});