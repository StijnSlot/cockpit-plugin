define({
    /**
     * Common util files. These are examples.
     */
    // commonConversion: {},
    // commonOptions: {},
    // commonOverlays: {},

    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * Main function of the bulletgraph module. In here the data will be loaded
     * from the database by using promises. Also functions will be called
     * to add information to the BPMN model.
     *
     * @param   util              object of this class, to call its functions and variables
     * @param   $http             http client for GET request
     * @param   localStorage           browser window containing localStorage
     * @param   Uri               uniform resource identifier to create GET request
     * @param   $q                a promise
     * @param   control           contains viewer
     * @param   processDiagram    diagram containing elements
     */
    myNewModule: function (util, $http, localStorage, Uri, $q, control, processDiagram) {
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        var elementRegistry = viewer.get('elementRegistry');
        util.commonOverlays.canvas = viewer.get('canvas');

        // Put your code in here....
    },

});