angular.module('sdk.directives.ccPrice', ['src/directives/ccPrice/cc-price.tpl.html']);

/**
 * Creates pricing markup for prices and special prices
 *
 *
 */
angular.module('sdk.directives.ccPrice')
    .directive('ccPrice', function() {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                product: '=',
                selectedVariant: '=?'
            },
            templateUrl: 'src/directives/ccPrice/cc-price.tpl.html',
            link: function ($scope) {

                // We can't have the template directly bind to the product.price because
                // that's leaving out the selected variant which changes dynamically
                // outside of the product model.

                // So what we need to do is to listen manually for changes on the product or
                // the variant and then update the price on our isolated scope.
                var updatePrices = function() {
                    $scope.price = $scope.product.price;
                    $scope.oldPrice = $scope.product.oldPrice;

                    if ($scope.selectedVariant && $scope.selectedVariant.price !== undefined) {
                        $scope.price = $scope.selectedVariant.price;
                    }
                };

                $scope.$watch('product', updatePrices);
                $scope.$watch('selectedVariant', updatePrices);
            }
        };
    });
