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

    procInstanceId: "",

    /**
     * Creates DOM element from data and options settings
     *
     * @returns {object}
     */
    createVariableList: function() {

        var html = document.createElement('ul');
        html.className = "variableTextSmall";

        return html;
    },

    addData: function(html, data, overlays, elementId, util, i, max) {
        util.addVariables(html, data, util.numValue);
        if(i > 0) util.addSeparator(html, util.numValue);

        if(i === max && html.childElementCount) {
            util.addHoverFunctionality(html, util.numValue);
            var id = util.addTextElement(overlays, elementId, html);
            util.overlayActivityIds[elementId].push(id);
        }
    },

    addVariables: function(html, data, variableNum) {

        for(var variable in data) {

            // places list item which contains three dots
            if(html.childElementCount === variableNum) {
                var dots = document.createElement('li');
                dots.className = "dots";
                for(var j = 0; j < 3; j++) {
                    var dot = document.createElement('span');
                    dot.className = "dot";
                    dots.appendChild(dot);
                }
                html.appendChild(dots);
            }

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

            html.appendChild(variableHtml);
        }
    },

    addSeparator: function(html, variableNum) {
        if(html.childElementCount === variableNum) return;

        var li = document.createElement('li');
        var separator = document.createElement('div');
        separator.className = "separator";
        li.appendChild(separator);
        html.appendChild(li);
    },

    addHoverFunctionality: function(html, variableNum) {
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
                if(i > variableNum) $(this).css("display", "none");
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
    }
});