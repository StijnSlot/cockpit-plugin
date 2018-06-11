define({
    /**
     * storage of order (asc/desc) per order property
     */
    order: {
        "endTime" : "desc",
        "startTime" : "desc",
        "duration" : "desc"
    },

    /**
     * Flips the sorting direction and returns the sort order
     *
     * @param   {String}  sortByProperty  the property that is sorted by
     * @param   {Object}  util            contains auxiliary functions and properties
     * @returns {String}                  sort order
     */
    flipSortOrder: function(sortByProperty, util) {
        // get current sorting order
        var sortOrder = util.order[sortByProperty];

        // flip from asc to desc and other way around
        sortOrder = (sortOrder === "desc" ? "asc" : "desc");

        // set the new sort order
        util.order[sortByProperty] = sortOrder;

        // flip the sorting arrows
        util.setSortingArrows(sortByProperty, sortOrder);

        return sortOrder;
    },

    /**
     * Sets the direction of the sorting arrows
     *
     * @param {String}  sortBy      order property
     * @param {String}  sortOrder   sorting direction (asc/desc)
     **/
    setSortingArrows: function(sortBy, sortOrder) {
        // remove all preexisting arrows
        $(".sortingArrows").removeClass("glyphicon-menu-down");
        $(".sortingArrows").removeClass("glyphicon-menu-up");

        // add correct arrows to sortBy
        if(sortOrder === "asc") {
            $("#"+sortBy).addClass("glyphicon glyphicon-menu-up");
        } else {
            $("#"+sortBy).addClass("glyphicon glyphicon-menu-down");
        }
    },

    /**
     * get history data, returns a promise
     *
     * @param   {Object}  $http           to create get request for history data
     * @param   {Object}  Uri             to generate the get string
     * @param   {String}  sortByProperty  the property which should be sorted by
     * @param   {String}  sortOrder       sorting order (asc/desc)
     * @param   {String}  procDefId       process definition id
     * @returns {Promise}                   history data
     */
    getData: function($http, Uri, sortByProperty, sortOrder, procDefId) {
        return new Promise(function(resolve) {
            $http.get(Uri.appUri("engine://engine/:engine/history/process-instance" +
                "?processDefinitionId=" + procDefId +
                "&finished=true" +
                "&sortBy=" + sortByProperty +
                "&sortOrder=" + sortOrder))
                .success(function (data) {
                    resolve(data);
                });
        });
    }
});