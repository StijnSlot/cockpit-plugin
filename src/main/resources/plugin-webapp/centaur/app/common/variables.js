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
     * common overlay util
     */
    commonOverlays: "",

    /**
     * Creates DOM element from data and options settings
     *
     * @returns {object}
     */
    createVariableDiv: function() {
        var html = document.createElement('div');
        html.className = "variableTextSmall";
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
     * @param i                 number of variable elements still to go
     */
    handleVariableData: function(data, localStorage, html, overlays, elementId, util, i) {
        data = util.filterVariables(localStorage, data, util.procDefId + "_var_");
        html.appendChild(util.createVariableUl(data));;
        if(!i && html.childElementCount)
            return util.finishElement(localStorage, html, overlays, elementId, util);
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
        util.addHoverFunctionality(html, util.variableNum);
        util.commonOverlays.addDraggableFunctionality(localStorage, util.procDefId + "_" + elementId + "_variables", elementId, html);
        return util.commonOverlays.addTextElement(overlays, elementId, html, -50, -50);
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

        variables.className = "   djs-draggable";
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
    }
});