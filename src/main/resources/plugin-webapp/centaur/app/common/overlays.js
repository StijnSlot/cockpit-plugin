define({
    /**
     * diagram canvas, contains zoom level
     */
    canvas: {},

    /**
     * Adds HTML string of variable data to the BPMN element and return its id.
     *
     * @param   {Array<Object>} overlays      Collection of overlays which can be added to.
     * @param   {String}        elementId     Id of element where we add overlay.
     * @param   {Object}        html          DOM element of overlay.
     * @param   {Number}        bottom        The vertical offset.
     * @param   {Number}        left          The horizontal offset.
     * @returns {Number}
     */
    addTextElement: function (overlays, elementId, html, bottom, left) {
        return overlays.add(elementId, {
            position: {
                bottom: bottom,
                left: left
            },
            show: {
                minZoom: -Infinity,
                maxZoom: +Infinity
            },
            html: html
        });
    },

    /**
     * Get the offset from localStorage and add to html DOM element
     *
     * @param html              Dom element
     * @param localStorage      LocalStorage containing offset
     * @param prefix            prefix for localStorage item
     */
    setOffset: function(html, localStorage, prefix) {
        var offsetTop = localStorage.getItem(prefix + "_offset_top");
        if (offsetTop !== null) {
            $(html.parentNode).css("top", offsetTop);
        }
        var offsetLeft = localStorage.getItem(prefix + "_offset_left");
        if (offsetLeft !== null) {
            $(html.parentNode).css("left", offsetLeft);
        }
    },

    /**
     * Makes html draggable and sets it in localStorage
     *
     * @param localStorage      used for storing offset
     * @param prefix            used for setting offset in localStorage
     * @param elementID         used for making element selected
     * @param html              Dom element which should drag
     * @param canvas            contains zoom level
     */
    addDraggableFunctionality: function(localStorage, prefix, elementID, html, canvas) {
        html.parentNode.classList.add("djs-draggable");
        var click = {};

        $(html.parentNode).draggable({
            stack: ".djs-overlay",
            start: function(event) {
                // add highlight to activity
                $("g[data-element-id=\'" + elementID + "\']")[0].classList.add("highlight");

                // remember click position for dragging speed
                click.x = event.clientX;
                click.y = event.clientY;
            },
            drag: function(event, ui) {
                // get zoom level on drag, since the user could drag while zooming
                var zoom = canvas.zoom();

                // original position of draggable
                var original = ui.originalPosition;

                // edit the position based on mouse position and zoom level
                ui.position = {
                    left: (event.clientX - click.x + original.left) / zoom,
                    top:  (event.clientY - click.y + original.top ) / zoom
                };
            },
            stop: function() {
                // remove highlight from the activity
                $("g[data-element-id=\'" + elementID + "\']")[0].classList.remove("highlight");

                // store settings in localStorage
                localStorage.setItem(prefix + "_offset_top", html.parentNode.style.top);
                localStorage.setItem(prefix + "_offset_left", html.parentNode.style.left);
            }
        });
    },

    /**
     * Clears all overlays whose id is stored in overlayIds
     *
     * @param overlays          overlays object containing all processDefinition overlays
     * @param overlayIds        ids of overlays which should be removed
     */
    clearOverlays: function (overlays, overlayIds) {
        if(overlays === undefined || overlayIds === undefined) return;

        overlayIds.forEach(function (element) {
            overlays.remove(element);
        });
        overlayIds.length = 0;
    }
});