angular.module('sdk.directives.ccSearchField', ['src/directives/ccSearchField/cc-search-field.tpl.html']);

/**
 * Creates a search field which offers some common usability features
 *
 * - shows a search-icon at the input field
 * - provides a clear-button for the input
 * - offers an interface to focus() the input field
 * - binds to a parent model
 * - optional placeholder-text
 *
*/
angular.module('sdk.directives.ccSearchField')
    .directive('ccSearchField', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                focus: '=',
                placeholderText: '=',
                _value: '=ngModel'
            },
            require: '?ngModel',
            templateUrl: 'src/directives/ccSearchField/cc-search-field.tpl.html',
            link: function (scope, element, attrs) {

                var inputField  = element.find('input')[0];

                if (!attrs.ngModel) {
                    return;
                }

                scope.hasValue = function () {
                    return scope._value.length > 0;
                };

                scope.focusField = function () {
                    inputField.focus();
                };

                scope.clearValue = function () {
                    scope._value = '';
                    scope.focusField();
                };

                scope.$watch('focus', function (newValue) {
                    if (newValue) {
                        scope.focusField();
                    }
                });
            }
        };
    });
