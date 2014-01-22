angular.module('sdk.services.couponService', ['sdk.services.configService']);

angular
    .module('sdk.services.couponService')
    .factory('couponService', ['$http', '$q', 'basketService', 'checkoutService', 'loggingService', 'configService', function($http, $q, basketService, checkoutService, loggingService, configService){
        return new cc.CouponService($http, $q, basketService, checkoutService, loggingService, configService);
}]);


