define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * number of variables to show
     */
    variableNum: 5,

    /**
     * contains process definition id
     */
    procDefId: "",

    /**
     * contains process instance id
     */
    procInstanceId: "",

    /**
     * common overlay util
     */
    commonOverlays: "",

    /**
     * common options util
     */
    commonOptions: "",

    /**
     * Adds an element with variables to each activity
     *
     * @param localStorage      containing user options
     * @param $q                for resolving promises
     * @param $http             http client for GET request
     * @param control           contains overlays and elementRegistry
     * @param processDiagram    diagram containing elements
     * @param request1          function taking activityId and giving a http get request
     * @param request2          function taking elementId and giving a http get request
     * @param util              object of this class, to call its functions and variables
     */
    addVariables: function(localStorage, $q, $http, control, processDiagram, request1, request2, util) {

        // get overlay and elements from the diagram
        var viewer = control.getViewer();
        var overlays = viewer.get('overlays');
        util.commonOverlays.canvas = viewer.get('canvas');
        var elementRegistry = viewer.get('elementRegistry');

        // if not selected variables
        if(util.commonOptions.getOption(localStorage, util.procDefId, "true", "KPI", "variables") === "false") {

            // loop over all elements in the diagram to clear them
            elementRegistry.forEach(function (shape) {
                // get corresponding element from processDiagram
                var element = processDiagram.bpmnElements[shape.businessObject.id];

                util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);
            });
            return;
        }

        // get number of instance variables to show
        util.variableNum = util.commonOptions.getOption(localStorage, util.procDefId,
            util.commonOverlays.defaultVariableNum, "variable-number");

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            var html = util.createVariableDiv();

            if(util.overlayActivityIds[element.id] === undefined) {
                util.overlayActivityIds[element.id] = [];
            }

            $http.get(request1(element)).success(function(instances) {
                var promises = [];

                instances.forEach(function(instance) {
                    var promise = $http.get(request2(instance)).success(function(data) {
                        util.handleVariableData(data, localStorage, html, overlays, element.id, util);
                    });

                    promises.push(promise);
                });

                $q.all(promises).then(function() {
                    util.commonOverlays.clearOverlays(overlays, util.overlayActivityIds[element.id]);

                    if(html.childElementCount) {
                        var id = util.finishElement(localStorage, html, overlays, element.id, util);
                        util.overlayActivityIds[element.id].push(id);
                    }
                });
            });
        });
    },

    /**
     * Creates DOM element for variables
     *
     * @returns {object}
     */
    createVariableDiv: function() {
        var html = document.createElement('div');
        html.classList.add("custom-overlay", "variableTextSmall");
        return html;
    },

    /**
     * handles the variable data, adding it to the html
     *
     * @param data              variable data
     * @param localStorage      contains the options
     * @param html              html element to which to add
     * @param overlays          overlays object to which to add the overlay
     * @param elementId         element id to which to add the overlay
     * @param util              util object containing the functions
     */
    handleVariableData: function(data, localStorage, html, overlays, elementId, util) {
        data = util.filterVariables(data, localStorage, util.procDefId, "variables", util.commonOptions);
        html.appendChild(util.createVariableUl(data));
    },

    /**
     * Adds variable data for one instance/execution to html object
     *
     * @param localStorage  used for storing draggable position in addDraggableFunctionality
     * @param html          html object which variable data needs to be added
     * @param overlays      overlays object where overlay can be added
     * @param elementId     id of activity element
     * @param util          util object containing functions
     */
    finishElement: function(localStorage, html, overlays, elementId, util) {
        util.addDots(html, util);
        util.addHoverFunctionality(html);
        var id = util.commonOverlays.addTextElement(overlays, elementId, html, -5, -80);
        util.commonOverlays.setOffset(html, localStorage, util.procDefId + "_" + elementId + "_variables");

        util.commonOverlays.addDraggableFunctionality(localStorage, util.procDefId + "_" + elementId + "_variables",
            elementId, html, util.commonOverlays.canvas, true);

        return id;
    },

    /**
     * Creates a ul element containing the variable data
     *
     * @param data      variable data for single instance/execution
     * @returns {HTMLUListElement}
     */
    createVariableUl: function(data) {

        var variables = document.createElement('ul');

        for(var variable in data) {

            var variableHtml = document.createElement('li');

            var variableName = "<b>" + variable + ":</b> ";
            var variableData;

            // adds clickable link for files
            if(data[variable].value !== null) {
                variableData = data[variable].value;
            } else {
                variableData = data[variable].valueInfo.fileName;
            }

            variableHtml.innerHTML = variableName + variableData;

            variables.appendChild(variableHtml);
        }

        // insert empty list item
        if(!variables.childElementCount) {
            var li = document.createElement('LI');
            li.innerHTML = "<b>* no variables *</b>";
            variables.appendChild(li);
        }

        variables.className = "djs-draggable";
        return variables;
    },

    /**
     * Adds dots to the html object, on position variableNum
     *
     * @param html          html object containing ul elements
     * @param util          object containing variableNum and createDots
     */
    addDots: function(html, util) {
        var prev = 0;
        for(var i = 0; i < html.childElementCount; i++) {
            var child = html.children[i];
            for(var j = 0; j < child.childElementCount; j++) {
                // places list item which contains three dots
                if(prev + j === parseInt(util.variableNum)) {
                    child.insertBefore(util.createDots(3), child.children[j]);
                    return;
                }
            }
            prev += child.childElementCount;
        }
    },

    /**
     * Creates dots and returns list item
     *
     * @param number        number of dots to create
     * @returns {HTMLLIElement}
     */
    createDots: function(number) {
        var dots = document.createElement('li');
        dots.className = "dots";
        for(var k = 0; k < number; k++) {
            var dot = document.createElement('span');
            dot.className = "dot";
            dots.appendChild(dot);
        }
        return dots;
    },

    /**
     * Adds the hovering functionality to html object
     *
     * @param html      div element with variable data
     */
    addHoverFunctionality: function(html) {
        // initialize removing dots
        var dots = false;
        // hide children with index higher than numValue
        $(html).children().each(function() {
            $(this).children().each(function () {
                if (dots) $(this).css("display", "none");
                if (this.classList.contains('dots')) dots = true;
            });
        });

        // add hover functionality
        $(html).hover(function() {
            // change class to show all variables
            html.classList.remove("variableTextSmall");
            html.classList.add("variableTextFull");

            // unhide the hidden variables
            $(html).children().each(function() {
                $(this).children().each(function() {
                    $(this).removeAttr("style");
                });
            });
        }, function() {
            // change class to smaller variable list
            html.classList.remove("variableTextFull");
            html.classList.add("variableTextSmall");

            var dots = false;
            // hide children with index higher than numValue
            $(html).children().each(function() {
                $(this).children().each(function() {
                    if(dots) $(this).css("display", "none");
                    if(this.classList.contains('dots')) dots = true;
                });
            });
        });
    },

    /**
     * Removes all variables which are not selected by the user
     *
     * @param data          variables to filter
     * @param localStorage  contains user options
     * @param procDefId     process definition id
     * @param prefix        prefix before variable name, for localStorage
     * @param util          contains isSelectedOption
     */
    filterVariables: function(data, localStorage, procDefId, prefix, util) {
        var out = {};
        for(var variable in data) {
            if(util.getOption(localStorage, procDefId, "true", prefix, variable) !== "false") {
                out[variable] = data[variable];
            }
        }
        return out;
    }
});