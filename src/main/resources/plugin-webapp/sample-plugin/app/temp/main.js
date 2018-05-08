define(['angular',
    'jquery'], function(angular) {

    console.log('before configuration');

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
                        console.log('Damn success');
                        console.log($scope.processInstanceCounts);
                        console.log($scope.processInstanceCounts.instanceCount);
                    });
}]
});
}];

var ngModule = angular.module('cockpit.plugin.sample-plugin.temp', []);

ngModule.config(Configuration);

return ngModule;
});