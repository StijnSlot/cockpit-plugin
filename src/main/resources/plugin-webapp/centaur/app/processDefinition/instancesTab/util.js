define({
    /**
     * Returns process instance data with specific key
     *
     * @param $scope        contains procDef
     * @param $http
     * @param Uri
     * @param procDefKey
     */
    getData: function($scope, $http, Uri, procDefKey) {
        $http.get(Uri.appUri("engine://engine/:engine/process-instance?processDefinitionKey=" + procDefKey))
            .success(function (data) {
                $scope.instances = data;
            });
    },

    /**
     * Deletes the process instances with the specified ids
     *
     * @param $http     object to make delete request
     * @param $q        for resolving promises of requests
     * @param Uri       for resolving the url of the requests
     * @param ids       the processs instance ids to delete
     * @param callback  function that should be run after all promises are resolved
     */
    deleteIds: function($http, $q,  Uri, ids, callback) {
        var promises = [];

        ids.forEach(function(id) {
            var promise = $http.delete(Uri.appUri("engine://engine/:engine/process-instance/" + id));
            promises.push(promise);
        });

        $q.all(promises).then(function() {
            callback();
        })
    },

    /**
     * Gets the ids from the deleted processes
     *
     * @param rows          jquery object containing html rows (TR)
     * @returns {Array}     selected ids
     */
    getSelectedIds: function(rows) {
        var out = [];

        $(rows).each(function() {
            var id = $(this).find('.instance-id').text().trim();
            out.push(id);
        });

        return out;
    }
});