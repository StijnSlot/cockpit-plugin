'use strict';

//var fs = require('fs');
var template = './instanceVar.html';

define(['angular'], function(angular) {

    var overlay = [
        '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', 'processDiagram',
        function($scope, $http, Uri, control, processData, pageData, processDiagram) {
            //console.log($scope.$parent);

            var procDefId = $scope.$parent.processDefinition.id;

            var viewer = control.getViewer();
            var overlays = viewer.get('overlays');
            var elementRegistry = viewer.get('elementRegistry');

            elementRegistry.forEach(function(shape) {
                var element = processDiagram.bpmnElements[shape.businessObject.id];
                console.log(procDefId + " " + element.id);
                $http.get(Uri.appUri("plugin://centaur/:engine/instance-variables" +
                    "?procDefId=" + procDefId +
                    "&actId=" + element.id))
                    .success(function(data) {
                        addActivityVariables(shape, element.id, data);
                    });
            });

            function addActivityVariables(shape, elementId, data) {
                //console.log(element, data);
                var htmlText = "<div class='variableText'>"
                for(var i in data) {
                    var variable = getVariableData(data[i]);
                    htmlText += variable.name + ": " + variable.data + "<br>";
                }
                htmlText += "</div>";

                addTextElement(shape, elementId, htmlText);
            }

            function addTextElement(shape, elementId, htmlText) {
                var $html = $(htmlText).css({
                    width: shape.width,
                    height: shape.height
                });
                overlays.add(elementId, {
                    position: {
                        bottom: 20,
                        left: -80
                    },
                    show: {
                        minZoom: -Infinity,
                        maxZoom: +Infinity
                    },
                    html: $html
                });
            }
        }];

    function getVariableData(data) {
        console.log(data);
        var dataString = "";
        switch(data.type) {
            case 'string':
                dataString = String(data.text);
                break;
            case 'long':
                dataString = String(data.long_);
                break;
            case 'double':
                dataString = String(data.double_);
                break;
            default:
                break;
        }
        return {name: data.name, data: dataString};
    }

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
