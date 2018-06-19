define({

    commonConversion: {},

    averageDuration: {},
    
    /**
     * Convert the duration into the chosen time unit.
     *
     * The database keeps track of the duration in milliseconds.
     * This is difficult to read in the process definition, so we convert the
     * milliseconds into following intervals: seconds, minutes,
     * hours, days, weeks to make it easier to read. The choice
     * determines which time unit to use.
     *
     * @param   {Number}  duration      Duration of process.
     * @param   {String}  choice        Choice of time unit.
     * @return  {Number}                Duration as Integer.
     */
    convertTimes: function (duration, choice) {
        if (choice === 'seconds') {
            return (Math.round(duration / 1000 * 10) / 10);
        } else if (choice === 'minutes') {
            return (Math.round(duration / 60000 * 10) / 10);
        } else if (choice === 'hours') {
            return (Math.round(duration / 3600000 * 10) / 10);
        } else if (choice === 'days') {
            return (Math.round(duration / 86400000 * 10) / 10);
        } else if (choice === 'weeks') {
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
     * @param   {Number}  time      Duration of process.
     * @return  {String}            Time unit choice.
     */
    checkTimeUnit: function (time) {
        if (time > 1000 && time < 60001) {
            return 'seconds';
        } else if (time > 60000 && time < 3600001) {
            return 'minutes';
        } else if (time > 3600000 && time < 86400001) {
            return 'hours';
        } else if (time > 86400000 && time < 604800001) {
            return 'days';
        } else if (time > 604800000) {
            return 'weeks';
        } else {
            return 'ms';
        }
    },

    /**
     * Calculates the average current duration of all instances with the same ID of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we have to calculate the current duration of each process.
     * 
     * @param   {Object}        util        Object of this class, to call its functions and variables.
     * @param   {Array<Object>} instance    Instance of a process.
     * @param   {String}        elementId   ID of diagram element that represents instance.
     * @return  {Number}                    If no start time is present in the database: null,
     *                                      else the current time.
     */
    calculateAvgCurDuration: function (util, instance, elementID) {
        if (util.averageDuration[elementID] === undefined) {
            util.averageDuration[elementID] = [];
        }

        for (var i = 0; i < instance.length; i++) {
            if (instance[i].activityId === elementID) {
                var timeDifference = util.calculateTimeDifference(Date.parse(instance[i].startTime));
                util.averageDuration[elementID].push(timeDifference);
            }
        }

        if (util.averageDuration[elementID] !== undefined && util.averageDuration[elementID].length !== 0) {
            var total = 0;
            for (var i = 0; i < util.averageDuration[elementID].length; i++) {
                total = total + util.averageDuration[elementID][i];
            }
            return (total / util.averageDuration[elementID].length);
        }

        return null;
    },

    /**
     * Calculates the average current duration of all instances with the same ID of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we have to calculate the current duration of each process.
     * @param   Object  util        object of this class, to call its functions and variables
     * @param   Object  instance    Instance of a process
     * @param   String  elementId   ID of diagram element that represents instance
     * @return  Number              If no starttime is present in the database: 0,
     *                              else the current time 
     */
    calculateAvgCurDurationOfAllInstances: function (util, instance) {
        var counter = 0;
        var totalTime = 0;

        // Add all current durations to the array.
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].startTime !== undefined) {
                var timeDifference = util.calculateTimeDifference(Date.parse(instance[j].startTime));
                totalTime = totalTime + timeDifference;
                counter++;
            }
        }

        if (counter > 0) {
            return (totalTime / counter);
        } else {
            return null;
        }
    },

    /**
     * Calculates the current duration of a specific instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of each process.
     *
     * @param   {Array<Object>} instance    Instance of a process.
     * @param   {String}        elementId   ID of diagram element that represents instance.
     * @param   {String}        instanceID  ID of diagram instance element that represents instance.
     * @return  {Number}                    If no start time is present in the database: null,
     *                                      else the current time.
     */
    calculateCurDurationOfSpecInstance: function (instance, elementID, instanceID) {
        for (var i = 0; i < instance.length; i++) {
            if (instance[i].activityId === elementID && instance[i].instanceId === instanceID) {
                    var startTime = Date.parse(instance[i].startTime);
                    var computerTime = new Date().getTime();
                    return computerTime - startTime;
            }
        }
        return null;
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
     * Changes date to UTC timezone and truncates to remove milliseconds.
     *
     * @param   {String}    date        Date in local timezone.
     * @returns {String}                Date string.
     */
    toTruncatedUTC: function(date) {
        // convert to utc time
        var newDate = new Date(date).toISOString();

        // output with milliseconds and "Z" removed
        return newDate.substr(0, newDate.length - 5);
    }
});