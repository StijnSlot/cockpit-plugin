define({
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
    }
});