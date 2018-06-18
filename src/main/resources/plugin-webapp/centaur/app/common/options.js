define({
    /**
     * Binds scope functions to corresponding util
     *
     * @param $scope        scope which needs functions set
     * @param $window       contains localStorage
     * @param $rootScope    for sending broadcasts
     * @param util          util file containing functions
     */
    setScopeFunctions: function($scope, $window, $rootScope, util) {
        /**
         * sets variables in list to checked according to localStorage
         */
        $scope.setVariableChecked = function() {
            util.setChecked($window.localStorage, $scope.procDefId + "_KPI_", $scope.KPI);
        };

        /**
         * sets num value of variables in scope to value in localStorage
         */
        $scope.setNumValue = function() {
            $scope.numValue = util.getVariableNum($window.localStorage, $scope.procDefId + "_var_num");
        };

        /**
         * sets refresh rate in $scope and gets it from localStorage
         */
        $scope.setRefreshRate = function() {
            $scope.refreshRate = util.getRefreshRate($window.localStorage, $scope.procDefId + "_var_refresh");
        };

        /**
         * Function that reacts to changes in variables. Calls util function
         * @param id            id of variable where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeVar = function(id, checked) {
            util.changeVar($window.localStorage, $rootScope, $scope.procDefId + '_var_' + id, checked);
        };

        /**
         * Function that reacts to changes in KPI. Calls util function
         * @param id            id of KPI where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeKPI = function(id, checked) {
            util.changeKPI($window.localStorage, $rootScope, $scope.procDefId + '_KPI_' + id, checked);
        };

        /**
         * Reacts to changes in variable number and stores in localStorage
         * @param value         value of new var number
         */
        $scope.changeVarNum = function(value) {
            util.changeVarNum($window.localStorage, $rootScope, $scope.procDefId + "_var_num", value);
        };

        /**
         * Reacts to changes in refresh rate and stores in lcoalStorage
         * @param value
         */
        $scope.changeVarRefreshRate = function(value) {
            util.changeVarRefreshRate($window.localStorage, $rootScope, $scope.procDefId + "_var_refresh", value);
        };
    },

    /**
     * Sets 'checked' attribute in variables in data according to localStorage.
     * If nothing is found in localStorage, puts false there and sets 'checked' to false.
     *
     * @param {Object}          localStorage  Contains the user options.
     * @param {String}          prefix        Used for naming the item in localStorage.
     * @param {Array<Number>}   data          Contains variables with 'checked' attribute.
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
     * Changes variable options in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  Contains user options.
     * @param {Object}  $rootScope    Used for broadcasting change.
     * @param {String}  id            Used for retrieving the correct item.
     * @param {Boolean} checked       New item value.
     */
    changeVar:  function (localStorage, $rootScope, id, checked) {
        localStorage.setItem(id, checked);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:variable-change");
    },

    /**
     * Changes KPI options in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  Contains user options.
     * @param {Object}  $rootScope    Used for broadcasting change.
     * @param {String}  id            Used for retrieving correct item.
     * @param {Boolean} checked       New item value.
     */
    changeKPI: function (localStorage, $rootScope, id, checked) {
        localStorage.setItem(id, checked);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:KPI-change");
    },

    /**
     *  Changes the value of a variable in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  Contains user options.
     * @param {Object}  $rootScope    Used for broadcasting change.
     * @param {String}  id            Used for retrieving correct item.
     * @param {Boolean} value         New item value.
     */
    changeVarNum: function(localStorage, $rootScope, id, value) {
        localStorage.setItem(id, value);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:var-num-change");
    },

    /**
     * Changes variable refresh rate in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  Contains user options.
     * @param {Object}  $rootScope    Used for broadcasting change.
     * @param {String}  id            Used for retrieving correct item.
     * @param {Number}  value         New item value.
     */
    changeVarRefreshRate: function(localStorage, $rootScope, id, value) {
        localStorage.setItem(id, value);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:var-refresh-change");
    },

    /**
     * Gets num value from localStorage, or sets it as default value.
     *
     * @param   {Object}  localStorage  Contains user options.
     * @param   {String}  id            Used for getting the options from localStorage.
     * @returns {Number}
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
     * Gets refresh rate value from localStorage, or sets its default value.
     *
     * @param   {Object}    localStorage  Contains user options.
     * @param   {String}    id            Used for getting the options from localStorage.
     * @returns {Number}
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
     * Returns if the variable with id is selected.
     * If it is undefined, assume it is selected
     *
     * @param   {Object}      localStorage Contains user options.
     * @param   {String}      id           Used for getting the options from localStorage.
     * @returns {Boolean}                  True if variable with id is selectedm,
     *                                     else False,
     */
    isSelectedOption: function (localStorage, id) {
        return localStorage.getItem(id) !== 'false';
    },

    /**
     * This function looks for each element if the instance is currently
     * on that element. When it is, it returns true, else false.
     * 
     * @param   {Array<Object>} instance    Instance of a process.
     * @param   {String}        elementID   ID of diagram element that represents instance.
     * @param   {Number}        instanceID  ID of diagram instance element that represents instance.
     * @returns {Boolean}                   True if the instance is selected,
     *                                      else False.
     */
    isSelectedInstance: function (instance, elementID, instanceID) {
        for (var j = 0; j < instance.length; j++) {
            if (instance[j].activityId === elementID) {
                if (instance[j].instanceId === instanceID) {
                    return true;   
                }
            }
        }
        return false;
    },

    /**
     * Register for broadcast changes to variable options and call the callbacks.
     *
     * @param {Object}          $scope          Local destroyable application context. 
     * @param {Object}          $rootScope      Global application context that gives broadcasts
     * @param {Array<String>}   subscriptions   Broadcast messages.
     * @param {Array<Function>} callback        Callback functions that needs to be called on change.
     */
    register: function($scope, $rootScope, subscriptions, callback) {
        var unregisters = [];

        subscriptions.forEach(function(el) {
            // subscribe to any broadcast variables options change
            unregisters.push($rootScope.$on(el, function() {
                callback();
            }));
        });

        // deregister every subscription when destroyed
        $scope.$on("$destroy", function() {
            unregisters.forEach(function(sub) {
                sub();
            })
        });
    }
});