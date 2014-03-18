
angular.module('sdk.directives.ccCheckBox', ['src/directives/ccCheckBox/cc-checkbox.tpl.html']);

angular.module('sdk.directives.ccCheckBox')
    .directive('ccCheckBox', function() {

        'use strict';

        var instanceCount = 0;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '=?',
                value: '=?'
            },
            templateUrl: 'src/directives/ccCheckBox/cc-checkbox.tpl.html',
            link: function(scope, $element, attrs){
                instanceCount++;
                scope.id = instanceCount;
            }
        };
    });