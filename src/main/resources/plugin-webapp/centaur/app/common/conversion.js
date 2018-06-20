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
     * @param   {String}        elementID   ID of diagram element that represents instance.
     * @return  {Number}                    If no start time is present in the database: null,
     *                                      else the current time.
     */
    calculateAvgCurDuration: function (util, instances, elementID) {
        if (util.averageDuration[elementID] === undefined) {
            util.averageDuration[elementID] = [];
        }

        instances.forEach(function(instance) {
            if (instance.activityId === elementID) {
                var timeDifference = util.calculateTimeDifference(Date.parse(instance.startTime));
                util.averageDuration[elementID].push(timeDifference);
            }
        });

        if (util.averageDuration[elementID].length !== 0) {
            var total = 0;
            util.averageDuration[elementID].forEach(function(duration) {
                total = total + duration;
            });
            return (total / util.averageDuration[elementID].length);
        }

        return null;
    },

    /**
     * Calculates the average current duration of all instances of one process definition
     *
     * The database only keeps track of the starting time of each
     * process. So we have to calculate the current duration of each process.
     * @param   {Object}  util        object of this class, to call its functions and variables
     * @param   {Object}  instances    Instance of a process
     * @return  {Number}              If no starttime is present in the database: 0,
     *                                else the current time
     */
    calculateAvgCurDurationOfAllInstances: function (util, instances) {
        var counter = 0;
        var totalTime = 0;

        instances.forEach(function (instance) {
            if (instance.startTime !== undefined) {
                var timeDifference = util.calculateTimeDifference(Date.parse(instance.startTime));
                totalTime = totalTime + timeDifference;
                counter++;
            }
        });

        return (counter > 0 ? totalTime / counter : null);
    },

    /**
     * Calculates the current duration of a specific instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of a specific instance
     *
     * @param   {Array<Object>} instances   Instances of a process.
     * @param   {String}        elementID   ID of diagram element that represents instance.
     * @param   {String}        instanceID  ID of diagram instance element that represents instance.
     * @return  {Number}                    If no start time is present in the database: null,
     *                                      else the current time.
     */
    calculateCurDurationOfSpecInstance: function (instances, elementID, instanceID) {
        instances.forEach(function(instance) {
            if (instance.activityId === elementID && instance.instanceId === instanceID) {
                var startTime = Date.parse(instance[i].startTime);
                var computerTime = new Date().getTime();
                return computerTime - startTime;
            }
        });

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