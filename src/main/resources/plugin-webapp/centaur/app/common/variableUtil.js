define({
    /**
     * variable containing all ids of overlays created here
     */
    overlayActivityIds: {},

    /**
     * contains user options for number of variables to show
     */
    numValue: [],

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
            util.addDots(html, util.numValue);
            util.addHoverFunctionality(html, util.numValue);
            var id = util.addTextElement(overlays, elementId, html);
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
     * Adds dots to the html object, on position variablNum
     *
     * @param html          html object containing ul elements
     * @param variableNum   number of variables to show before dots are placed
     */
    addDots: function(html, variableNum) {
        var prev = 0;
        for(var i = 0; i < html.childElementCount; i++) {
            var child = html.children[i];
            for(var j = 0; j < child.childElementCount; j++) {
                // places list item which contains three dots
                if(prev + j === variableNum) {
                    var dots = document.createElement('li');
                    dots.className = "dots";
                    for(var k = 0; k < 3; k++) {
                        var dot = document.createElement('span');
                        dot.className = "dot";
                        dots.appendChild(dot);
                    }
                    child.insertBefore(dots, child.children[j]);
                }
            }
            prev += child.childElementCount;
        }
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
        return {act_id: data.act_id, id: data.id, name: String(data.name), data: dataString, clickable: clickable};
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
    getNumValue: function(localStorage, id) {
        var get = localStorage.getItem(id);
        if(get === null) {
            localStorage.setItem(id, 5);
            return 5;
        } else {
            return parseInt(get);
        }
    }
});