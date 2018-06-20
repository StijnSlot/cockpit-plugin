define({
    /**
     * This function will check if the conditions to show the durations are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Average and maximum, duration variables are not equal to NULL.
     * - The average duration is not equal to '0'.
     *
     * @param   {Number}  avgDuration   Average duration of process.
     * @param   {Number}  maxDuration   Maximum duration of process.
     * @return  {Boolean}               If conditions are satisfied or not.
     */
    checkConditions: function (avgDuration, maxDuration) {
        return (avgDuration != null && maxDuration != null && avgDuration !== 0);
    },

    /**
     * This function checks if the current duration is not equal to null. 
     * If the current duration is equal to null it should display a '-'.
     * 
     * @param   {Object}  util          Object of this class, to call its functions and variables.
     * @param   {Number}  curDuration   Current duration of process in ms.
     * @return  {String}                Either the current duration or a '-'.
     */
    checkIfCurValid: function (util, curDuration) {
        if (curDuration != null) {
            var curDurationUnit = util.commonConversion.checkTimeUnit(curDuration, false);
            return util.commonConversion.convertTimes(curDuration, curDurationUnit).toString() + ' ' + curDurationUnit;
        }
        return '-';
    },

    /**
     * Creates an HTML element needed to display the duration. This function also checks if something is 
     * selected in the options tab.
     * 
     * @param   {Object}  util              Object of this class, to call its functions and variables.
     * @param   {Object}  $window           Browser window containing localStorage.
     * @param   {String}  curDurationString String to containing the current duration.
     * @param   {String}  avgDurationString String to containing the average duration.
     * @param   {String}  maxDurationString String to containing the maximum duration.
     * @param   {String}  cssClass          Classname of object
     * @param   {String}  category          String which determine which KPI is meant (for example activity and order)
     * @return  {String}                    String which represents an HTML line which will later on be added to the document.
     */
    createHTML: function (util, $window, curDurationString, avgDurationString, maxDurationString, cssClass, category) {
        var data = {};
        if (util.commonOptions.getOption($window.localStorage, util.procDefId, "true", "KPI", category + "_cur_duration") !== "false") {
            data['cur'] = {value: curDurationString};
        }
        if (util.commonOptions.getOption($window.localStorage, util.procDefId, "true", "KPI", category + "_avg_duration") !== "false") {
            data['avg'] = {value: avgDurationString};
        }
        if (util.commonOptions.getOption($window.localStorage, util.procDefId, "true", "KPI", category + "_max_duration") !== "false") {
            data['max'] = {value: maxDurationString};
        }

        var html = document.createElement('div');
      
        html.classList.add("custom-overlay", cssClass);

        html.appendChild(util.commonVariables.createVariableUl(data));

        return html;
    }
});