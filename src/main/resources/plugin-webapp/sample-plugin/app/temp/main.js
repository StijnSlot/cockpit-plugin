define(['angular',
    'jquery'], function(angular) {

    var Configuration = [ 'ViewsProvider', function(ViewsProvider) {
        ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.plugin', {
            id: 'runtime',
            priority: 20,
            label: 'Runtime',
            overlay: [
                '$scope', '$http', 'Uri', 'control', 'processData', 'pageData', 'processDiagram',
                function($scope, $http, Uri, control, processData, pageData, processDiagram) {
                    console.log('in configuration');
                    $http.get(Uri.appUri("plugin://sample-plugin/:engine/process-instance"))
                    .success(function(data) {
                        $scope.processInstanceCounts = data;
                        
                        console.log($scope.processInstanceCounts);
                        

                        for (var i = 0; i < $scope.processInstanceCounts.length; i++) {
                            console.log($scope.processInstanceCounts[i]);
                            console.log($scope.processInstanceCounts[i].name);
                        }
                    });


                    
}]
});
}];

var ngModule = angular.module('cockpit.plugin.sample-plugin.temp', []);

ngModule.config(Configuration);

return ngModule;
});