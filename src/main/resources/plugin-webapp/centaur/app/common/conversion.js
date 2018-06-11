'use strict',

define({

    commonConversion: {},
    
    /**
     * Convert the duration into the chosen time unit.
     *
     * The database keeps track of the duration in milli seconds.
     * This is difficult to read in the processDefinition, so we convert the
     * milli senconds into following intervals: seconds, minutes,
     * hours, days, weeks to make it easier to read. The choice
     * determines which time unit to use.
     *
     * @param   Number  duration      duration of process
     * @param   String  choice        choice of time unit
     * @return  Number                duration as Integer
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
     * Since a discision has to be made to show in the bulletgraph,
     * this determines which time unit (seconds, minutes,
     * hours, days, weeks) should be used.
     *
     * @param   Number  time      duration of process
     * @return  String            time unit choice
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
     * Calculates the current duration of a instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of each process.
     *
     * @param   Number  instance    Instance of a process
     * @param   Number  elementId   ID of diagram element that represents instance
     */
    calculateCurDuration: function (util, instance, elementID) {
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId == elementID) {
                return util.calculateTimeDifference(Date.parse(instance[j].startTime));
            }
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
    calculateAvgCurDuration: function (util, instance, elementID) {
        if (util.averageDuration[elementID] == undefined) {
            util.averageDuration[elementID] = [];
        }

        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId == elementID) {
                var timeDifference = util.calculateTimeDifference(Date.parse(instance[j].startTime));
                util.averageDuration[elementID].push(timeDifference);
            }
        }

        if (util.averageDuration[elementID] !== undefined && util.averageDuration[elementID].length != 0) {
            var total = 0;
            for (var j = 0; j < util.averageDuration[elementID].length; j++) {
                total = total + util.averageDuration[elementID][j];
            }
            return (total / util.averageDuration[elementID].length);
        }

        return null;
    },

    /**
     * Calculates the current duration of a specific instance of a process.
     *
     * The database only keeps track of the starting time of each
     * process. So we calculate the current duration of each process.
     *
     * @param   Number  instance    Instance of a process
     * @param   String  elementId   ID of diagram element that represents instance
     * @param   Number  instanceID  ID of diagram instance element that represents instance
     */
    calculateCurDurationOfSpecInstance: function (instance, elementID, instanceID) {
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId == elementID) {
                if (instance[j].instanceId == instanceID) {
                    var startTime = Date.parse(instance[j].startTime);
                    var computerTime = new Date().getTime();
                    var timeDifference = computerTime - startTime;
                    return timeDifference;
                    break;
                }
            }
        }
        return null;
    },

    /**
     * Calculates the difference between a given start time and the current computer time.
     * 
     * @param   Number startTime    start time in ms
     * @return  Number              time difference between given time and computer time.
     */
    calculateTimeDifference: function (startTime) {
        var computerTime = new Date().getTime();
        return computerTime - startTime;
    }
});