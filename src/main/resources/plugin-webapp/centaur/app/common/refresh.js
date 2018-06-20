define({
    refreshRate: 1000,

    prevData: null,

    poll: null,

    procDefId: null,

    procInstId: null,

    /**
     *
     * @param {Object}    $scope    angular scope object, to watch for destruction
     * @param {Object}    $http     used for making get requests to server
     * @param {Object}    Uri       used for resolving get string
     * @param {Object}    util      this object, containing variables like refreshRate
     * @param {Function}  callback  callback function to call with new and previous data
     */
    setInterval: function($scope, $http, Uri, util, callback) {
        if(util.poll != null) {
            clearInterval(util.poll);
        }

        util.poll = setInterval(function() {
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