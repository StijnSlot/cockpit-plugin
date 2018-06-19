define({
    refreshRate: 1000,

    prevData: null,

    poll: null,

    procDefId: null,

    procInstId: null,

    setInterval: function($scope, $http, Uri, util, callback) {
        if(util.poll != null) {
            clearInterval(util.poll);
        }

        util.poll = setInterval(function() {
            /**
             * HTTP request that retrieves the list of instances
             * for the specified process definition id
             */
            $http.get(Uri.appUri("plugin://centaur/:engine/refresh" +
                (util.procDefId != null ? "?procDefId=" + util.procDefId : "") +
                (util.procInstId != null ? "&procInstId=" + util.procInstId : "")))
                .success(function(data) {

                    // check if we have a set reference instance list
                    if (util.prevData == null) {
                        util.prevData = data;
                    }
                    callback(data, util.prevData);
                });
        }, util.refresh);

        $scope.$on("$destroy", function() {
            clearInterval(util.poll);
        });
    }
});