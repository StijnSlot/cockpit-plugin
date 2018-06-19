define({
    /**
     * default rate of checking for updates
     */
    defaultRefreshRate: 1,

    /**
     * default number of variables to show in box
     */
    defaultVariableNum: 5,

    /**
     * Binds scope functions to corresponding util
     *
     * @param $scope        scope which needs functions set
     * @param localStorage  contains options
     * @param $rootScope    for sending broadcasts
     * @param util          util file containing functions
     */
    setScopeFunctions: function($scope, localStorage, $rootScope, util) {
        /**
        * sets variables in list to checked according to localStorage
        */
        $scope.setVariableChecked = function() {
            util.setChecked(localStorage, $scope.procDefId, "variables", $scope.processVariables);
        };

        /**
        * sets variables in list to checked according to localStorage
        */
        $scope.setKPIChecked = function() {
            util.setChecked(localStorage, $scope.procDefId, "KPI", $scope.KPI);
        };

        /**
         * sets num value of variables in scope to value in localStorage
         */
        $scope.setNumValue = function() {
            $scope.numValue = util.getOption(localStorage, $scope.procDefId, util.defaultVariableNum, "variable-number");
        };

        /**
         * sets refresh rate in $scope and gets it from localStorage
         */
        $scope.setRefreshRate = function() {
            $scope.refreshRate =  util.getOption(localStorage, $scope.procDefId, util.defaultRefreshRate, "refresh");
        };

        /**
         * Function that reacts to changes in variables. Calls util function
         * @param id            id of variable where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeVar = function(id, checked) {
            util.changeCollection(localStorage, $rootScope, $scope.procDefId, 'variables', id, checked, "variable-change");
        };

        /**
         * Function that reacts to changes in KPI. Calls util function
         * @param id            id of KPI where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeKPI = function(id, checked) {
            util.changeCollection(localStorage, $rootScope, $scope.procDefId, 'KPI', id, checked, "KPI-change");
        };

        /**
         * Reacts to changes in variable number and stores in localStorage
         * @param value         value of new var number
         */
        $scope.changeVarNum = function(value) {
            util.changeOption(localStorage, $rootScope, $scope.procDefId, "variable-number", value, "var-num-change");
        };

        /**
         * Reacts to changes in refresh rate and stores in lcoalStorage
         * @param value
         */
        $scope.changeVarRefreshRate = function(value) {
            util.changeOption(localStorage, $rootScope, $scope.procDefId, "refresh", value, "refresh-change");
        };
    },

    /**
     * Sets 'checked' attribute in variables in data according to localStorage.
     * If nothing is found in localStorage, puts false there and sets 'checked' to false.
     *
     * @param {Object}  localStorage  contains user options
     * @param {String}  procDefId     process definition id
     * @param {String}  prefix        used for naming the item in localStorage
     * @param {Array}   data          contains variables with checked attribute
     */
    setChecked: function (localStorage, procDefId, prefix, data) {
        console.log("4" + procDefId);
        var processOptions = localStorage.getItem(procDefId);

        if(processOptions == null) {
            localStorage.setItem(processOptions, "{}");
            processOptions = {prefix: {}};
        } else {
            processOptions = JSON.parse(processOptions);
            if(processOptions[prefix] === undefined) {
                processOptions[prefix] = {};
            }
        }
        
        data.forEach(function (element) {
            var get = processOptions[prefix][element.name];
            if (get === undefined) {
                // set default value
                processOptions[prefix][element.name] = 'true';
                element.checked = true;
            } else {
                element.checked = (get === 'true');
            }
        });

        localStorage.setItem(procDefId, JSON.stringify(processOptions));
    },

    /**
     * Changes variable options in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  contains user options
     * @param {Object}  $rootScope    used for broadcasting change
     * @param {String}  procDefId     process definition id
     * @param {String}  id            used for retrieving correct item
     * @param {String}  value         new item value
     * @param {String}  broadcast     broadcast message to be 
     */
    changeOption:  function (localStorage, $rootScope, procDefId, id, value, broadcast) {
        console.log("3" + procDefId);
        var processOptions = localStorage.getItem(procDefId);
        processOptions = (processOptions == null ? {} : JSON.parse(processOptions));

        processOptions[id] = String(value);
        localStorage.setItem(procDefId, JSON.stringify(processOptions));

        $rootScope.$broadcast("cockpit.plugin.centaur:options:" + broadcast);
    },

    /**
     * Changes KPI options in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  contains user options
     * @param {Object}  $rootScope    used for broadcasting change
     * @param {String}  procDefId     process definition id
     * @param {String}  id            used for retrieving correct item
     * @param {String}  value         new item value
     * @param broadcast     broadcast message to send
     */
    changeCollection: function (localStorage, $rootScope, procDefId, prefix, id, value, broadcast) {
        console.log("2" + procDefId);
        var processOptions = localStorage.getItem(procDefId);
        processOptions = (processOptions == null ? {} : JSON.parse(processOptions));

        if(processOptions[prefix] === undefined) {
            processOptions[prefix] = {};
        }

        processOptions[prefix][id] = String(value);
        localStorage.setItem(procDefId, JSON.stringify(processOptions));

        $rootScope.$broadcast("cockpit.plugin.centaur:options:" + broadcast);
    }
  
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
     * @param {Object}  localStorage  contains user optionsTab
     * @param {String}  procDefId     processDefinitionId, where options are stored
     * @param {String}  defaultValue  defaultValue in case nothing is set
     * @param {String}  item          used for getting the optionsTab from localStorage
     * @param {String}  subItem       optional. subitem of item
     * @returns {String}
     */
    getOption: function(localStorage, procDefId, defaultValue, item, subItem) {
        console.log("1" + procDefId);
        var processOptions = localStorage.getItem(procDefId);

        if(processOptions == null) {
            localStorage.setItem(processOptions, "{}");
            processOptions = {};
        } else {
            processOptions = JSON.parse(processOptions);
        }

        var get = processOptions[item];

        if(get === undefined) {
            if(subItem !== undefined) {
                processOptions = {};
                processOptions[subItem] = String(defaultValue);
            } else {
                processOptions[item] = String(defaultValue);
            }
            localStorage.setItem(procDefId, JSON.stringify(processOptions));
            return defaultValue;
        }
        if(subItem !== undefined) {
            get = get[subItem];

            if(get === undefined) {
                processOptions[item][subItem] = String(defaultValue);
                localStorage.setItem(procDefId, JSON.stringify(processOptions));
                return defaultValue;
            }
        }

        return get;
    }

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
     * @param {Object}        $scope            scope that can be destroyed
     * @param {Array<String>} subscriptions     array of strings with broadcast messages
     * @param {Function}      callback          callback functions that needs to be called on change
     */
    register: function($scope, subscriptions, callback) {
        var unregisters = [];

        subscriptions.forEach(function(el) {
            // subscribe to any broadcast variables options change
            unregisters.push($scope.$on(el, function() {
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