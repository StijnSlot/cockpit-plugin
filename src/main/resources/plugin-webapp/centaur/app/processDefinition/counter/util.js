define({
  /**
   * common overlays util file
   */
  commonOverlays: {},

  commonOptions: {},

  /**
   * process definition id
   */
  procDefId: "",

  overlayIds: [],

  setCounters: function($scope, $window, $q, $http, Uri, control, processDiagram, util) {
      var viewer = control.getViewer();
      var overlays = viewer.get('overlays');
      var elementRegistry = viewer.get('elementRegistry');

      util.commonOverlays.clearOverlays(overlays, util.overlayIds);

      if(!util.commonOptions.isSelectedVariable($window.localStorage, util.procDefId + "_KPI_Counter")) {
          return;
      }

      /**
       * Angular http.get promise that waits for a JSON object of
       * the executionSequenceCounter.
       */
      $scope.executionSequenceCounter_temp = $http.get(Uri.appUri(
          "plugin://centaur/:engine/execution-sequence-counter"), {
          catch: false
      });

      /**
       * Waits until data is received from http.get request and
       * added to promises.
       *
       * Database quersies take a relative long time. So we have to
       * wait until the data is retrieved before we can continue.
       *
       * @param   {Object}  data   minimal duration of process
       */
      $q.all([$scope.executionSequenceCounter_temp]).then(function(data) {
          $scope.executionSequenceCounter = data[0]; //$scope.processActivityStatistics.data to access array with data from JSON object
          // console.log($scope.executionSequenceCounter);
          /**
           * Extracts data from JSON objects and calls composeHTML()
           * function to add the extracted to the diagram.
           *
           * @param   {Object}  shape   shape of element
           */
          elementRegistry.forEach(function(shape) {
              var element = processDiagram.bpmnElements[shape.businessObject.id];
              for (var i = 0; i < $scope.executionSequenceCounter.data.length; i++) {
                  if ($scope.executionSequenceCounter.data[i].activityId === element.id &&
                      element.$type === 'bpmn:CallActivity' && $scope.executionSequenceCounter.data[i].long_ > 0) {
                      var executionSequenceCounter = $scope.executionSequenceCounter.data[i].long_;
                      util.composeHTML($window.localStorage, util, overlays, executionSequenceCounter, element.id);
                      break;
                  }
              }
          });
      });
  },

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
    util.overlayIds.push(util.commonOverlays.addTextElement(overlays, elementID, html, -20, 50));
    util.commonOverlays.setOffset(html, localStorage, util.procDefId + "_" + elementID + "_counter");
    util.commonOverlays.addDraggableFunctionality(localStorage, util.procDefId + "_" + elementID + "_counter", elementID, html, true);
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
