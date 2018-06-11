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
    },

    /**
     * Changes variable refresh rate in localStorage and broadcast
     *
     * @param localStorage  contains user options
     * @param $rootScope    used for broadcasting change
     * @param id            used for retrieving correct item
     * @param value         new item value
     */
    changeVarRefreshRate: function(localStorage, $rootScope, id, value) {
        localStorage.setItem(id, value);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:var-refresh-change");
    },

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
            if (instance[j].activityId === elementID) {
                if (instance[j].instanceId === instanceID) {
                    return true;   
                }
            }
        }
        return false;
    },

    /**
     * Register for broadcast changes to variable options and call
     *
     * @param $scope            scope that can be destroyed
     * @param $rootScope        rootScope that gives broadcasts
     * @param subscriptions     array of strings with broadcast messages
     * @param callback          callback functions that needs to be called on change
     */
    register: function($scope, $rootScope, subscriptions, callback) {
        var deregisters = [];

        subscriptions.forEach(function(el) {
            // subscribe to any broadcast variables options change
            deregisters.push($rootScope.$on(el, function() {
                callback();
            }));
        });

        // deregister every subscription when destroyed
        $scope.$on("$destroy", function() {
            deregisters.forEach(function(sub) {
                sub();
            })
        });
    }
});