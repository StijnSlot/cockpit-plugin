define({
    /**
     * Diagram canvas, contains the zoom level.
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
     * Get the offset from localStorage and add to HTML DOM element.
     *
     * @param {Object}  html              DOM element.
     * @param {Object}  localStorage      LocalStorage containing offset.
     * @param {String}  prefix            Prefix for localStorage item.
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
     * Makes HTML draggable and sets it in localStorage.
     *
     * @param {Object}  localStorage      Used for storing offset.
     * @param {String}  prefix            Used for setting offset in localStorage.
     * @param {String}  elementID         Used for making element selected.
     * @param {Object}  html              DOM element which should drag.
     * @param {Object}  canvas            Contains zoom level.
     */
    addDraggableFunctionality: function(localStorage, prefix, elementID, html, canvas, highlight) {
        html.parentNode.classList.add("djs-draggable");
        var click = {};
        var zoom = 1;

        $(html.parentNode).draggable({
            stack: ".djs-overlay",
            start: function(event) {
                // add highlight to activity
                if (highlight) {
                    $("g[data-element-id=\'" + elementID + "\']")[0].classList.add("highlight");
                }

                // remember click position for dragging speed
                click.x = event.clientX;
                click.y = event.clientY;
            },
            drag: function(event, ui) {
                // get zoom level on drag, since the user could drag while zooming
                if(canvas !== undefined) {
                    zoom = canvas.zoom();
                }

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
                if (highlight) {
                    $("g[data-element-id=\'" + elementID + "\']")[0].classList.remove("highlight");
                }

                // store settings in localStorage
                localStorage.setItem(prefix + "_offset_top", html.parentNode.style.top);
                localStorage.setItem(prefix + "_offset_left", html.parentNode.style.left);
            }
        });
    },

    /**
     * Clears all overlays whose ID is stored in overlayIDs.
     *
     * @param {Object}          overlays          Overlays object containing all processDefinition overlays.
     * @param {Array<String>}   overlayIDs        ID's of overlays which should be removed.
     */
    clearOverlays: function (overlays, overlayIDs) {
        if(overlays === undefined || overlayIDs === undefined) return;

        overlayIDs.forEach(function (element) {
            overlays.remove(element);
        });
        overlayIDs.length = 0;
    }
});