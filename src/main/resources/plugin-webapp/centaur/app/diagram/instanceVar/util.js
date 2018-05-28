define({
    /**
     * Creates DOM element from data and options settings
     *
     * @param Uri           uniform resource identifier to create link
     * @param data          variable data from GET request
     * @param variableNum   number of variables to be displayed without hovering
     * @returns {object}
     */
    createDOMElement: function (Uri, data, variableNum) {

        var html = document.createElement('ul');
        html.className = "variableTextSmall";

        var act_id;

        var sepCounter = 0;

        for(var i = 0; i < data.length; i++) {

            var variable = data[i];

            // creates separator, list item with div inside
            // only if no dots should be placed, and act_id changes
            if(i + sepCounter !== variableNum && act_id !== undefined && act_id !== variable.act_id) {
                var li = document.createElement('li');
                var separator = document.createElement('div');
                separator.className = "separator";
                li.appendChild(separator);
                html.appendChild(li);
                sepCounter++;
            }

            // places list item which contains three dots
            if(i + sepCounter === variableNum) {
                var dots = document.createElement('li');
                dots.className = "dots";
                for(var j = 0; j < 3; j++) {
                    var dot = document.createElement('span');
                    dot.className = "dot";
                    dots.appendChild(dot);
                }
                html.appendChild(dots);
            }
            act_id = variable.act_id;

            var variableHtml = document.createElement('li');

            var variableName = "<b>" + variable.name + "</b>: ";
            var variableData = variable.data;

            // adds clickable link for files
            if(variable.clickable) {
                var link = document.createElement('a');
                link.setAttribute('href', Uri.appUri("engine://engine/:engine/variable-instance/" + variable.id + "/data"));
                link.innerHTML = variable.data;
                variableData = link.outerHTML;
            }

            variableHtml.innerHTML = variableName + variableData;

            html.appendChild(variableHtml);
        }//);

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