define({
  /**
   * common overlays util file
   */
  commonOverlays: {},

  /**
   * process definition id
   */
  procDefId: "",

  /**
   * Combines all information of given process into single
   * String variable which is added to its diagram element.
   *
   * @param   (Object}  localStorage              contains offset settings
   * @param   {Object}  util                      object of this class, to call its functions and variables
   * @param   {Object}  overlays                  collection of overlays to add to
   * @param   {Number}  executionSequenceCounter  number of processes called
   * @param   {Number}  elementID                 ID of element
   */
  composeHTML: function(localStorage, util, overlays, executionSequenceCounter, elementID) {
    var html = util.createHTML (executionSequenceCounter);
    util.commonOverlays.setOffset(html, localStorage, util.procDefId + "_" + elementID + "_counter");
    util.commonOverlays.addDraggableFunctionality(localStorage, util.procDefId + "_" + elementID + "_counter", elementID, html);
    util.commonOverlays.addTextElement(overlays, elementID, html, -20, 50);
  },


  /**
   * Creates an HTML line with has a class that includes the elementID
   *
   * @param   {String}  executionSequenceCounter   Variable to be converted.
   * @return  {Object}                             A string which represents an HTML line which will be added later
   */
  createHTML: function (executionSequenceCounter) {
    var html = document.createElement('DIV');
    html.className = "counterText";
    var text = document.createElement('P');
    text.innerText = "Counter: " + executionSequenceCounter;
    html.appendChild(text);

    return html;
  }
});
