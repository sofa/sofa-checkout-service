/**
 * sofa-checkout-service - v0.8.0 - Tue Feb 17 2015 13:59:52 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa.checkoutService', [
    'sofa.basketService',
    'sofa.loggingService'
])

.factory('checkoutService', ["$http", "$q", "basketService", "loggingService", "configService", function ($http, $q, basketService, loggingService, configService) {
    'use strict';
    return new sofa.CheckoutService($http, $q, basketService, loggingService, configService);
}]);
}(angular));
