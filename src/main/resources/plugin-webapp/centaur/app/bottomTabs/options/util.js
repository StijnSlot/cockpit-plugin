define({
    setChecked: function ($window, procDefId, data) {
        data.forEach(function (variable) {
            if ($window.localStorage.getItem(procDefId + "_" + variable.name) === null) {
                $window.localStorage.setItem(procDefId + "_" + variable.name, 'false');
                variable.checked = false;
            } else {
                variable.checked = $window.localStorage.getItem(procDefId + "_" + variable.name) === 'true';
            }
        });
        console.log('ran');
    },

    changeVar:  function ($window, $rootScope, procDefId, id, checked) {
        $window.localStorage.setItem(procDefId + "_" + id, checked);
        $rootScope.$broadcast("cockpit.plugin.centaur:options:variable-change");
    },

    changeKPI: function ($window, procDefId, id, checked) {
        $window.localStorage.setItem(procDefId + "_" + id, checked);
    },

    test: function () {
        return 1;
    }
});