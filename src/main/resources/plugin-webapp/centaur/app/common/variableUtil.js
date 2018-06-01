define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains user options for number of variables to show
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
     * Creates DOM element from data and options settings
     *
     * @returns {object}
     */
    createVariableList: function() {

        var html = document.createElement('div');
        html.className = "variableTextSmall";

        return html;
    },

    /**
     * Adds variable data for one instance/execution to html object
     *
     * @param html          html object which variable data needs to be added
     * @param data          variable data
     * @param overlays      overlays object where overlay can be added
     * @param elementId     id of activity element
     * @param util          util object containing functions
     * @param i             number of variable objects still to come (counting down to 0)
     */
    addData: function(html, data, overlays, elementId, util, i) {
        html.appendChild(util.createVariableUl(data));

        if(!i && html.childElementCount) {
            util.addDots(html, util);
            util.addHoverFunctionality(html, util.variableNum);
            var id = util.addTextElement(overlays, elementId, html);

            if(util.overlayActivityIds[elementId] === undefined) util.overlayActivityIds[elementId] = [];
            util.overlayActivityIds[elementId].push(id);
        }
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
                if(prev + j === util.variableNum) {
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
            html.className = "variableTextFull";

            // unhide the hidden variables
            $(html).children().each(function() {
                $(this).children().each(function() {
                    $(this).removeAttr("style");
                });
            });
        }, function() {
            // change class to smaller variable list
            html.className = "variableTextSmall";

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
     * @param localStorage  contains user options
     * @param data          variables to filter
     * @param prefix        prefix before variable name, for localStorage
     */
    filterVariables: function(localStorage, data, prefix) {
        var out = {};
        for(var variable in data) {
            if(localStorage.getItem(prefix + variable) === 'true') {
                out[variable] = data[variable];
            }
        }
        return out;
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
                left: -120
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
     * @param overlays              overlays object containing all diagram overlays
     * @param overlayActivityIds    ids of overlays which should be removed
     * @param id
     */
    clearOverlays: function (overlays, overlayActivityIds, id) {
        if(overlayActivityIds[id] !== undefined) {
            overlayActivityIds[id].forEach(function (element) {
                overlays.remove(element);
            });
        }
        overlayActivityIds[id] = [];
    },

    /**
     * Gets num value from localStorage, or sets it as default value
     *
     * @param localStorage  contains user options
     * @param id            used for getting the options from locaLStorage
     * @returns {number}
     */
    getVariableNum: function(localStorage, id) {
        var get = localStorage.getItem(id);
        if(get === null) {
            localStorage.setItem(id, 5);
            return 5;
        } else {
            return parseInt(get);
        }
    }
});