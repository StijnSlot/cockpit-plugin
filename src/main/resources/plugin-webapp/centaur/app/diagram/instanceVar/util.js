define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayIds: [],

    /**
     * contains user options for number of variables to show
     */
    numValue: [],

    /**
     * Adds an element with variables to each activity
     *
     * @param $window           browser window containing localStorage
     * @param $http             http client for GET request
     * @param elementRegistry   registry containing bpmn elements
     * @param processDiagram    diagram containing elements
     * @param overlays          collection of overlays to add to
     * @param Uri               uniform resource identifier to create GET request
     * @param util          object of this class, to call its functions and variables
     */
    addActivityElements: function($window, $http, elementRegistry, processDiagram, overlays, Uri, util) {
        // clear any current overlays displayed
        util.clearOverlays(overlays, util.overlayIds);

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            // get all variables attached to this activity
            $http.get(Uri.appUri("plugin://centaur/:engine/instance-variables" +
                "?procDefId=" + procDefId +
                "&actId=" + element.id))
                .success(function (data) {

                    // if data is not empty, add element
                    if(data !== undefined && data.length) {
                        var newOverlayId = util.addElement($window, overlays, Uri, element, data, util);
                        util.overlayIds.push(newOverlayId);
                    }
                });
        });
    },

    /**
     * Adds overlay to the activity element
     *
     * @param $window       browser window containing localStorage
     * @param overlays      collection of overlays to add to
     * @param Uri           uniform resource identifier to create GET request
     * @param element       activity element
     * @param data          variable data
     * @param util          object of this class, to call its functions and variables
     */
    addElement: function($window, overlays, Uri,  element, data, util) {
        // transform each variable
        data = data.map(util.transformVariableData);

        // remove all unselected variables
        data = data.filter(function(x) {
            return util.isSelectedVariable($window.localStorage, procDefId + "_var_" + x.name)
        });

        // create DOM element from data
        var html = util.createDOMElement(Uri, data, util.numValue);

        // hide children with index higher than numValue
        $(html).children().each(function(i) {
            if(i > util.numValue) $(this).css("display", "none");
        });

        // add hover functionality
        $(html).hover(function() {
            // change class to show all variables
            html.className = "variableTextFull";

            // unhide the hidden variables
            $(html).children().each(function() {
                if(!this.classList.contains('dots'))
                    $(this).css("display", "initial");
            });
        }, function() {
            // change class to smaller variable list
            html.className = "variableTextSmall";

            // hide children with index higher than numValue
            $(html).children().each(function(i) {
                if(i > util.numValue) $(this).css("display", "none");
            });
        });

        // create element from DOM element and add to overlay
        return util.addTextElement(overlays, element.id, html);
    },

    /**
     * Creates DOM element from data and options settings
     *
     * @param Uri       uniform resource identifier to create link
     * @param data      variable data from GET request
     * @returns {object}
     */
    createDOMElement: function (Uri, data) {

        var html = document.createElement('ul');
        html.className = "variableText";

        // loop over all variables to add to html string
        data.forEach(function(variable) {

            var variableHtml = document.createElement('li');

            var innerHtml = "<b>" + variable.name + ":</b> " + variable.data;

            if(variable.clickable) {
                var link = document.createElement('a');
                link.setAttribute('href', Uri.appUri("engine://engine/:engine/variable-instance/" + variable.id + "/data"));
                link.innerHTML = innerHtml;

                variableHtml.appendChild(link);
            } else {
                variableHtml.innerHTML = innerHtml;
            }

            html.appendChild(variableHtml);
        });

        return html;
    },

    /**
     * Removes all variables which are not selected by the user
     *
     * @param localStorage  contains user options
     * @param item          used for getting localStorage item option
     */
    isSelectedVariable: function(localStorage, item) {
        return localStorage.getItem(item) === 'true';
    },

    /**
     * Transforms raw variable data to object with name and data string
     *
     * @param data      has name, type and (long_, double_, text, text2)
     * @returns {{name: string, data: string}}
     */
    transformVariableData: function (data) {

        // string storing the data value of variable
        var dataString = "";

        // boolean value whether the object should be clickable
        var clickable = (data.type === "file");

        // handle different variable data types with null checking
        if (data.double_ != null) dataString = String(data.double_);
        else if (data.long_ != null) dataString = String(data.long_);
        else if (data.text != null) dataString = String(data.text);
        else dataString = String(data.text2);

        // Transform boolean 1 or 0 to true or false
        if (data.type === "boolean") dataString = (data.long_ === 1 ? "true" : "false");

        // return object with name, the data and whether or not it is a file (clickable)
        return {id: data.id, name: String(data.name), data: dataString, clickable: clickable};
    },

    /**
     * Adds html string of variable data to the bpmn element and return its id
     *
     * @param overlays      Collection of overlays to which can be added to
     * @param elementId     Id of element where we add overlay
     * @param html          DOM element of overlay
     * @returns {int}
     */
    addTextElement: function (overlays, elementId, html) {
        return overlays.add(elementId, {
            position: {
                bottom: 25,
                left: -150
            },
            show: {
                minZoom: -Infinity,
                maxZoom: +Infinity
            },
            html: html
        });
    },

    /**
     * Clears all overlays whose id is stored in overlayIds and clears overlayIds
     *
     * @param overlays      overlays object containing all diagram overlays
     * @param overlayIds    ids of overlays which should be removed
     */
    clearOverlays: function (overlays, overlayIds) {
        overlayIds.forEach(function (element) {
            overlays.remove(element);
        });
        overlayIds.length = 0;
    }
});