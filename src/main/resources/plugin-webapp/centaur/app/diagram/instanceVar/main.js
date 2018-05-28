'use strict';

define(['require', 'angular', './util', '../../bottomTabs/options/util'], function(require, angular) {

    /**
     * retrieve the util file containing functions
     */
    var util = require('./util');

    /**
     * retrieve options util, containing getNumValue function
     */
    var optionsUtil = require('../../bottomTabs/options/util');

    /**
     * variable containing all ids of overlays created here
     */
    var overlayIds = [];

    /**
     * variable containing process definition id of the process shown
      */
    var procDefId;

    /**
     * value containing the number of instance variables to show
     */
    var numValue;

    /**
     * Overlay object that contains the elements put on the diagram
     */
    var overlay = ['$scope', '$http', '$window', '$rootScope', 'Uri', 'control', 'processDiagram',
        function($scope, $http, $window, $rootScope, Uri, control, processDiagram) {

            // process definition id is set (HARDCODED nr. of parents)
            procDefId = $scope.$parent.processDefinition.id;

            // get overlay and elements from the diagram
            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');

            // add the activity variable elements to the overlay
            addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri);

            // subscribe to broadcast any options change
            $rootScope.$on("cockpit.plugin.centaur:options:variable-change", function() {
                addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri) });
            $rootScope.$on("cockpit.plugin.centaur:options:var-num-change", function() {
                addActivityElements($window, $http, elementRegistry, processDiagram, overlays, Uri) });
        }
    ];

    /**
     * Adds an element with variables to each activity
     *
     * @param $window           browser window containing localStorage
     * @param $http             http client for GET request
     * @param elementRegistry   registry containing bpmn elements
     * @param processDiagram    diagram containing elements
     * @param overlays          collection of overlays to add to
     * @param Uri               uniform resource identifier to create GET request
     */
    var addActivityElements = function($window, $http, elementRegistry, processDiagram, overlays, Uri) {
        // clear any current overlays displayed
        util.clearOverlays(overlays, overlayIds);

        // get number of instance variables to show
        numValue = optionsUtil.getNumValue($window.localStorage, procDefId + "_var_num");

        // loop over all elements in the diagram
        elementRegistry.forEach(function (shape) {

            // get corresponding element from processDiagram
            var element = processDiagram.bpmnElements[shape.businessObject.id];

            // get all variables attached to this activity
            $http.get(Uri.appUri("plugin://centaur/:engine/instance-variables" +
                "?procDefId=" + procDefId +
                "&actId=" + element.id))
                .success(function (data) {

                    // if data is not empty, add element
                    if(data !== undefined && data.length) {
                        addElement($window, overlays, Uri, element, data);
                    }
                });
        });
    }

    /**
     * Adds overlay to the activity element
     *
     * @param $window       browser window containing localStorage
     * @param overlays      collection of overlays to add to
     * @param Uri           uniform resource identifier to create GET request
     * @param element       Activity element
     * @param data          Variable data
     */
    var addElement = function($window, overlays, Uri,  element, data) {
        // transform each variable
        data = data.map(util.transformVariableData);

        // remove all unselected variables
        data = data.filter(function(x) {
            return util.isSelectedVariable($window.localStorage, procDefId + "_var_" + x.name)
        });

        // create DOM element from data
        var html = util.createDOMElement(Uri, data, numValue);

        // hide children with index higher than numValue
        $(html).children().each(function(i) {
            if(i > numValue) $(this).css("display", "none");
        });

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
                if(i > numValue) $(this).css("display", "none");
            });
        });

        // create element from DOM element and add to overlay
        var elementId = util.addTextElement(overlays, element.id, html);

        // save element ids
        overlayIds.push(elementId);
    };

    /**
     * Configuration object that places plugin
     */
    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            label: 'Instance Variables',
            priority: 20,
            overlay: overlay
        });
    }];

    var ngModule = angular.module('cockpit.plugin.centaur.diagram.instanceVar', []);

    ngModule.config(Configuration);

    return ngModule;
});
