define({
    /**
     * Gets num value from localStorage, or sets it as default value
     *
     * @param localStorage  contains user optionsTab
     * @param id            used for getting the optionsTab from localStorage
     * @returns {number}
     */
    getVariableNum: function(localStorage, id) {
        var get = localStorage.getItem(id);
        if(get === null) {
            localStorage.setItem(id, 5);
            return 5;
        } else {
            return parseInt(get);
        }
    },

    /**
     * Removes all variables which are not selected by the user
     *
     * @param localStorage  contains user optionsTab
     * @param item          used for getting localStorage item option
     */
    isSelectedVariable: function (localStorage, item) {
        return localStorage.getItem(item) === 'true';
    },

    /**
     * This function looks for each element if the instance is currently
     * on that element. When it is, it returns true, else false.
     * 
     * @param   Object  instance    Instance of a process
     * @param   String  elementId   ID of diagram element that represents instance
     * @param   Number  instanceID  ID of diagram instance element that represents instance
     */
    isSelectedInstance: function (instance, elementID, instanceID) {
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId == elementID) {
                if (instance[j].instanceId == instanceID) {
                    return true;   
                }
            }
        }
        return false;
    }
});