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
                // set default value
                localStorage.setItem(prefix + variable.name, 'true');
                variable.checked = true;
            } else {
                variable.checked = get === 'true';
            }
        });
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