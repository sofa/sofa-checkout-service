'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.checkoutservice.CheckoutRequestConverter
 * @namespace sofa.checkoutservice
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 *
 *
 * @description
 * The `sofa.checkoutservice.CheckoutRequestConverter` takes a copy of a `CheckoutModel` 
 * plus an arryay of `BasketItems` and produces a request object for the `checkout`
 * backend API call. The passed `CheckoutModel` instance is a copy so that mutation is safe to do without
 * mutating foreign state.
 */
sofa.define('sofa.checkoutservice.CheckoutRequestConverter', function () {
    // for now, we can just use the other converter. If they turn out to
    // be the same thing we will just create a BaseCheckoutModelConverter and delegate
    // to that.
    return new sofa.checkoutservice.CheckoutMethodsRequestConverter();
});