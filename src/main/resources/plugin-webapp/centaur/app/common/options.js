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
            $scope.numValue = parseInt(util.getOption(localStorage, $scope.procDefId, util.defaultVariableNum, "variable-number"));
        };

        /**
         * sets refresh rate in $scope and gets it from localStorage
         */
        $scope.setRefreshRate = function() {
            $scope.refreshRate = parseInt(util.getOption(localStorage, $scope.procDefId, util.defaultRefreshRate, "refresh"));
        };

        /**
         * Function that reacts to changes in variables. Calls util function
         * @param id            id of variable where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeVar = function(id, checked) {
            util.changeOption(localStorage, $rootScope, "variable-change", $scope.procDefId, checked, 'variables', id);
        };

        /**
         * Function that reacts to changes in KPI. Calls util function
         * @param id            id of KPI where change occurred
         * @param checked       value of change, either true or false
         */
        $scope.changeKPI = function(id, checked) {
            util.changeOption(localStorage, $rootScope, "KPI-change", $scope.procDefId, checked, 'KPI', id);
        };

        /**
         * Reacts to changes in variable number and stores in localStorage
         * @param value         value of new var number
         */
        $scope.changeVarNum = function(value) {
            util.changeOption(localStorage, $rootScope, "var-num-change", $scope.procDefId, value, "variable-number", undefined);
        };

        /**
         * Reacts to changes in refresh rate and stores in lcoalStorage
         * @param value
         */
        $scope.changeRefreshRate = function(value) {
            util.changeOption(localStorage, $rootScope, "refresh-change", $scope.procDefId, value, "refresh", undefined);
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
        var processOptions = localStorage.getItem(procDefId);

        if(processOptions == null) {
            processOptions = {};
            processOptions[prefix] = {};
        } else {
            processOptions = JSON.parse(processOptions);
            if(processOptions[prefix] === undefined) {
                processOptions[prefix] = {};
            }
        }
        var changed = false;
        data.forEach(function (element) {
            var get = processOptions[prefix][element.name];
            if (get === undefined) {
                processOptions[prefix][element.name] = 'true';
                changed = true;
                element.checked = true;
            } else {
                element.checked = (get === 'true');
            }
        });

        if(changed) localStorage.setItem(procDefId, JSON.stringify(processOptions));
    },

    /**
     * Changes KPI options in localStorage and broadcasts this change.
     *
     * @param {Object}  localStorage  contains user options
     * @param {Object}  $rootScope    used for broadcasting change
     * @param {String}  broadcast     broadcast message to send
     * @param {String}  procDefId     process definition id
     * @param {String}  value         new item value
     * @param {String}  id            used for retrieving correct item
     * @param {String}  subId         optional. used when id contains object
     */
    changeOption:  function (localStorage, $rootScope, broadcast, procDefId, value, id, subId) {
        var processOptions = localStorage.getItem(procDefId);
        processOptions = (processOptions == null ? {} : JSON.parse(processOptions));

        if(subId !== undefined) {
            if(processOptions[id] === undefined) processOptions[id] = {};
            processOptions[id][subId] = String(value);
        } else {
            processOptions[id] = String(value);
        }

        localStorage.setItem(procDefId, JSON.stringify(processOptions));

        $rootScope.$broadcast("cockpit.plugin.centaur:options:" + broadcast);
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

        var processOptions = localStorage.getItem(procDefId);

        if(processOptions == null) {
            processOptions = {};
        } else {
            processOptions = JSON.parse(processOptions);
        }

        var get = processOptions[item];

        if(get === undefined) {
            if(subItem !== undefined) {
                processOptions[item] = {};
                processOptions[item][subItem] = defaultValue;
            } else {
                processOptions[item] = String(defaultValue);
            }
            localStorage.setItem(procDefId, JSON.stringify(processOptions));
            return defaultValue;
        } else if(subItem !== undefined) {
            get = get[subItem];

            if(get === undefined) {
                processOptions[item][subItem] = String(defaultValue);
                localStorage.setItem(procDefId, JSON.stringify(processOptions));
                return defaultValue;
            }
        }

        return get;
    },

    /**
     * This function looks for each element if the instance is currently
     * on that element. When it is, it returns true, else false.
     *
     * @param   {Array<Object>} instances    Instances of a process.
     * @param   {String}        elementId   ID of diagram element that represents instance.
     * @param   {Number}        instanceId  ID of diagram instance element that represents instance.
     * @returns {Boolean}                   True if the instance is selected,
     *                                      else False.
     */
    isSelectedInstance: function (instances, elementId, instanceId) {
        return instances.some(function(instance) {
            return (instance.activityId === elementId && instance.instanceId === instanceId);
        });
    },

    /**
     * Register for broadcast changes to variable options and call the callbacks.
     * Deregisters every subscription when destroyed
     *
     * @param {Object}        $scope            scope that can be destroyed
     * @param {Array<String>} subscriptions     array of strings with broadcast messages
     * @param {Function}      callback          callback functions that needs to be called on change
     */
    register: function($scope, subscriptions, callback) {
        var unregisters = [];

        subscriptions.forEach(function(el) {
            unregisters.push($scope.$on(el, function() {
                callback();
            }));
        });

        $scope.$on("$destroy", function() {
            unregisters.forEach(function(sub) {
                sub();
            })
        });
    }
});