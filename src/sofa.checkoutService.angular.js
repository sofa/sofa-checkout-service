angular.module('sofa.checkoutService', [
    'sofa.basketService',
    'sofa.loggingService'
])

.factory('checkoutService', function ($http, $q, basketService, loggingService, configService) {
    'use strict';
    return new sofa.CheckoutService($http, $q, basketService, loggingService, configService);
});
