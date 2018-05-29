define({
    /**
     * Sets checked attribute in variables in data according to localStorage
     * If nothing is found localStorage, puts false there and sets checked to false
     *
     * @param localStorage  contains user options
     * @param prefix        used for naming the item in localStorage
     * @param data          contains variables with checked attribute
     */
    setChecked: function (localStorage, prefix, data) {
        data.forEach(function (variable) {
            var get = localStorage.getItem(prefix + variable.name);
            if (get === null) {
                localStorage.setItem(prefix + variable.name, 'false');
                variable.checked = false;
            } else {
                variable.checked = get === 'true';
            }
        });
    },

    /**
     * Gets num value from localStorage, or sets it as default value
     *
     * @param localStorage  contains user options
     * @param id            used for getting the options from locaLStorage
     * @returns {number}
     */
    getNumValue: function(localStorage, id) {
        var get = localStorage.getItem(id);
        if(get === null) {
            localStorage.setItem(id, 5);
            return 5;
        } else {
            return parseInt(get);
        }
    },

    /**
     * Changes variable options in localStorage and broadcasts this change
     *
     * @param localStorage  contains user options
     * @param $rootScope    used for broadcasting change
     * @param id            used for retrieving correct item
     * @param checked       new item value
     */
    changeVar:  function (localStorage, $rootScope, id, checked) {
        localStorage.setItem(id, checked);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:variable-change");
    },

    /**
     * Changes KPI options in localStorage and broadcasts this change
     *
     * @param localStorage  contains user options
     * @param $rootScope    used for broadcasting change
     * @param id            used for retrieving correct item
     * @param checked       new item value
     */
    changeKPI: function (localStorage, $rootScope, id, checked) {
        localStorage.setItem(id, checked);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:KPI-change");
    },

    /**
     * Changes variable number in localStorage and broadcasts
     *
     * @param localStorage  contains user options
     * @param $rootScope    used for broadcasting change
     * @param id            used for retrieving correct item
     * @param value         new item value
     */
    changeVarNum: function(localStorage, $rootScope, id, value) {
        localStorage.setItem(id, value);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:var-num-change");
    }
});