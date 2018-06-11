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
     * Gets refresh rate value from localStorage, or sets its default value
     *
     * @param localStorage  contains user optionsTab
     * @param id            used for getting the optionsTab from localStorage
     * @returns {number}
     */
    getRefreshRate: function(localStorage, id) {
        var get = localStorage.getItem(id);
        if(get === null) {
            localStorage.setItem(id, 1);
            return 1;
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
    }
});