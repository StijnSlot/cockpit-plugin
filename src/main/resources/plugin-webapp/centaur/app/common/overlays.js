define({
    /**
     * Adds html string of variable data to the bpmn element and return its id
     *
     * @param overlays      Collection of overlays to which can be added to
     * @param elementId     Id of element where we add overlay
     * @param html          DOM element of overlay
     * @param bottom        the right offset
     * @param left          the left offset
     * @returns {int}
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
     * @param localStorage      Localstorage containing offset
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
     */
    addDraggableFunctionality: function(localStorage, prefix, elementID, html) {
        html.parentNode.classList.add("djs-draggable");
        $(html.parentNode).css("position", "relative");

        $(html.parentNode).draggable({
            stack: ".djs-overlay",
            start: function() {
                $("g[data-element-id=\'" + elementID + "\']")[0].classList.add("highlight");
            },
            stop: function() {
                $("g[data-element-id=\'" + elementID + "\']")[0].classList.remove("highlight");

                // store settings in localStorage
                localStorage.setItem(prefix + "_offset_top", $(html.parentNode).css("top"));
                localStorage.setItem(prefix + "_offset_left", $(html.parentNode).css("left"));
            }
        });
    },

    /**
     * Clears all overlays whose id is stored in overlayIds and clears overlayIds
     *
     * @param overlays              overlays object containing all processDefinition overlays
     * @param overlayActivityIds    ids of overlays which should be removed
     * @param elementId             id of activity element
     */
    clearOverlays: function (overlays, overlayActivityIds, elementId) {
        if(overlayActivityIds[elementId] !== undefined) {
            overlayActivityIds[elementId].forEach(function (element) {
                overlays.remove(element);
            });
        }
        overlayActivityIds[elementId] = [];
    }
});