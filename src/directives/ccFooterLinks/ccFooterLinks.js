angular.module('sdk.directives.ccFooterLinks', [
    'src/directives/ccFooterLinks/cc-footer-links.tpl.html',
    'sdk.services.configService'
]);

angular
    .module('sdk.directives.ccFooterLinks')
    .directive('ccFooterLinks', ['configService', function(configService) {

        'use strict';

        var defaultIfUndefined = function(scope, property, defaultVal){
            scope[property] = scope[property] === undefined ? defaultVal : scope[property];
        };

        var ABOUT_PAGES = configService.get('aboutPages');

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                items: '=?'
            },
            templateUrl: 'src/directives/ccFooterLinks/cc-footer-links.tpl.html',
            link: function(scope, element, attrs){
                defaultIfUndefined(scope, 'items', ABOUT_PAGES);

                scope.goTo = function(item){
                    window.location.href = '#/pages/' + item.id;
                };
            }
        };
    }]);