define({
    /**
     * This function will check if the conditions to show the durations are
     * satisfied.
     *
     * The conditions to show the bulletgraph are satisfied if:
     * - Average and maximu, duration variables are not equal to NULL
     * - The average duration is not equal to '0'.
     *
     * @param   Number  minDuration   minimal duration of process
     * @param   Number  avgDuration   average duration of process
     * @param   Number  maxDuration   maximal duration of process
     * @param   Number  curDuration   current duration of process
     * @return  Boolean               if condtions are satisfied or not
     */
    checkConditions: function (avgDuration, maxDuration) {
        return avgDuration != null && maxDuration != null && avgDuration != '0';
    },

    /**
     * This function checks if the current duration is not equal to null. 
     * If the durrent duration is equal to null it should display a '-'.
     * 
     * @param   Object  util          object of this class, to call its functions and variables
     * @param   Number  curDuration   current duration of process
     * @return  String                either current duration or '-'
     */
    checkIfCurValid: function (util, curDuration) {
        if (curDuration != null) {
            var curDurationUnit = util.commonConversion.checkTimeUnit(curDuration);
            return util.commonConversion.convertTimes(curDuration, curDurationUnit).toString() + ' ' + curDurationUnit;
        } else {
            return '-';
        }
    },

    /**
     * Creates an the HTML needed to display the duration. This function also checks if something is 
     * selected in the options tab.
     * 
     * @param   Object  util            object of this class, to call its functions and variables
     * @param   Object  $window         browser window containing localStorage
     * @param   String  curDurationHTML string to display with the current duration
     * @param   String  avgDurationHTML string to display with the average duration
     * @param   String  maxDurationHTML string to display with the maximum duration
     * @return  String                  string which represents an HTML line which will be added later to the document
     */
    createHTML: function (util, $window, curDurationHTML, avgDurationHTML, maxDurationHTML) {
        var data = {};
        if (util.commonOptions.isSelectedOption($window.localStorage, util.procDefId + "_KPI_" + "Activity current duration")) {
            data['cur'] = {value: curDurationHTML};
        }
        if (util.commonOptions.isSelectedOption($window.localStorage, util.procDefId + "_KPI_" + "Activity average duration")) {
            data['avg'] = {value: avgDurationHTML};
        }
        if (util.commonOptions.isSelectedOption($window.localStorage, util.procDefId + "_KPI_" + "Activity maximum duration")) {
            data['max'] = {value: maxDurationHTML};
        }

        var html = document.createElement('div');
        html.className = "durationText";
        html.appendChild(util.commonVariables.createVariableUl(data));

        return html;
    }
});