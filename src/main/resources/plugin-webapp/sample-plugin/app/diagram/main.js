'use strict';

// var instanceCount = require('src\main\resources\plugin-webapp\sample-plugin\app\demoText\brain.js');

define(['angular'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope' ,'control', 'processData', 'pageData', 'processDiagram',
                function($scope, control, processData, pageData, processDiagram) {
                    var bpmnElements;

                    $scope.$watch('processDiagram', function(newValue) {
                        if (newValue && newValue.$loaded !== false) {
                          bpmnElements = newValue.bpmnElements;
                          $scope.diagramData = newValue.bpmnDefinition;
                        }
                      });
                  

                    console.log("Display bpmnElements:");
                    console.log($scope.processDiagram.bpmnElements);

                    // decorateDiagram($scope.processDiagram.bpmnElements);


                    // function decorateDiagram(bpmnElements) {
                    //     angular.forEach(bpmnElements, decorateBpmnElement);
                    // }
                  
                    // function decorateBpmnElement(bpmnElement) {
                  
                    //     // var elem = $scope.control.getElement(bpmnElement.id);

                    //     console.log("BPMN element");
                    //     console.log(bpmnElement);
                  
                    //     // if(elem && $scope.overlayProviders && $scope.overlayProviders.length) {
                    //     //   var childScope = $scope.$new();
                  
                    //     //   childScope.bpmnElement = bpmnElement;
                  
                    //     //   var newOverlay = angular.element(overlay);
                  
                    //     //   newOverlay.css({
                    //     //     width: elem.width,
                    //     //     height: elem.height
                    //     //   });
                  
                    //     //   $compile(newOverlay)(childScope);
                  
                    //     //   try {
                    //     //     $scope.control.createBadge(bpmnElement.id, {
                    //     //       html: newOverlay,
                    //     //       position: {
                    //     //         top: 0,
                    //     //         left: 0
                    //     //       }
                    //     //     });
                    //     //   } catch (exception) {
                    //     //     // do nothing
                    //     //   }
                    //     // }
                    // }

                    console.log("End of decorate element");

                }]
        });
    }];

    var ngModule = angular.module('cockpit.plugin.sample-plugin.diagram', []);

    ngModule.config(Configuration);

    return ngModule;
});
