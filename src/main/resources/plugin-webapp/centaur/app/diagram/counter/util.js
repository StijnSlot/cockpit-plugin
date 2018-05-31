define({
  /**
   * Adds text to specified diagram element.
   * @param   {Overlay} overlays    collection of overlays to add to
   * @param   {Number}  elementId   ID of diagram element
   * @param   {Number}  text        The text to be displayed
   * @param   {Object}  shape       Shape of the element
   */
  addTextToId: function(overlays, elementId, text, shape) {
    var $overlayHtml =
      $(text)
      .css({
        width: shape.width,
        height: shape.height
      });

    overlays.add(elementId, {
      position: {
        top: 80,
        left: 50
      },
      show: {
        minZoom: -Infinity,
        maxZoom: +Infinity
      },
      html: $overlayHtml
    });
  },

  /**
   * Combines all information of given process into single
   * String variable which is added to its diagram element.
   *
   * @param   {Object}  util          object of this class, to call its functions and variables
   * @param   {Overlay} overlays      collection of overlays to add to
   * @param   {Number}  executionSequenceCounter number of processes called
   * @param   {Number}  elementID     ID of element
   * @param   {Object}  shape         Shape of the element
   */
  composeHTML: function(util, overlays, executionSequenceCounter, elementID, shape) {
    var htmlText = '<div class="counterText"> Counter: ' + executionSequenceCounter + '</div>';
    util.addTextToId(overlays, elementID, htmlText, shape);
  }

});
