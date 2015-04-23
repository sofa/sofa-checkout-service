'use strict';
/* global store */
angular.module('sofa.checkoutService', [
    'sofa.basketService',
    'sofa.loggingService',
    'sofa.core',
    'sofa.userService',
    store.enabled ? 'sofa.storages.localStorageService' : 'sofa.storages.memoryStorageService'
])

.factory('checkoutService', function($http, $q, basketService, loggingService, configService, storageService, userService) {
    return new sofa.CheckoutService($http, $q, basketService, loggingService, configService, storageService, userService);
});
