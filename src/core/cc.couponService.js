/**
 * @name CouponService
 * @namespace cc.CouponService
 *
 * @description
 * A service that allows you to validate coupon codes against the backend.
 */
cc.define('cc.CouponService', function($http, $q, basketService, checkoutService, loggingService, configService) {

    'use strict';

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        CHECKOUT_URL      = configService.get('checkoutUrl'),
        FULL_CHECKOUT_URL = CHECKOUT_URL + 'coupon.php';

    /**
     * @method submitCode
     * @memberof cc.CouponService
     *
     * @description
     * Validates a coupon code against the backend.
     *
     * @example
     * couponService.submitCode(couponCode);
     *
     * @param {object} couponCode The code of the coupon to validate
     */
    self.submitCode = function(couponCode) {

        if ( !couponCode ) {
            return $q.reject(new Error('No couponCode given!'));
        }

        var couponModel = {
            task: 'INFO',
            coupon: couponCode,
            quote: JSON.stringify(checkoutService.createQuoteData())
        };

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: couponModel
        })
        .then(function(response){
            if ( response.data.error ) {
                return $q.reject(response.data.error);
            }
            basketService.addCoupon(response.data);
            return response.data;
        }, function(fail){
            loggingService.error([
                '[CouponService: submitCode]',
                '[Request Data]',
                couponModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    // When the cart changes, refresh the values of the coupons
    // by sending them to the backend along with the new cart
    var updateCoupons = function () {
        var activeCoupons = basketService.getActiveCoupons();

        var oldCouponCodes = activeCoupons.map(function(activeCoupon) {
            return activeCoupon.code;
        });

        basketService.clearCoupons();

        oldCouponCodes.forEach(function(couponCode) {
            self.submitCode(couponCode);
        });
    };

    basketService
        .on('itemAdded', updateCoupons)
        .on('itemRemoved', updateCoupons)
        .on('clear', updateCoupons);

    return self;
});
