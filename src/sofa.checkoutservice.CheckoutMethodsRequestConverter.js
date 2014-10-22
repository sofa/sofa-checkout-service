'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.checkoutservice.CheckoutMethodsRequestConverter
 * @namespace sofa.checkoutservice
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 *
 *
 * @description
 * The `sofa.checkoutservice.CheckoutMethodsRequestConverter` takes a copy of a `CheckoutModel` 
 * plus an arryay of `BasketItems` and produces a request object for the `getSupportedCheckoutMethods`
 * backend API call. The passed `CheckoutModel` instance is a copy so that mutation is safe to do without
 * mutating foreign state.
 */
sofa.define('sofa.checkoutservice.CheckoutMethodsRequestConverter', function () {

    var setIfDefinedAndNotNull = function (store, key, item) {
        if (sofa.Util.isNotNullNorUndefined(item)) {
            store[key] = item;
        }
    };

    return function (checkoutModel, basketItems) {

        var items = basketItems.map(function (item) {
            return {
                productId: item.product.id,
                quantity: item.quantity,
                variant: item.getVariantID() && { id: item.getVariantID() },
                option: item.getOptionID() && { id: item.getOptionID() }
            };
        });

        var requestModel = {};

        // the API does not like things to be NULL. They should be left off instead
        if (checkoutModel.billingAddress) {
            requestModel.billingAddress = sofa.utils.FormatUtils.toBackendAddress(checkoutModel.billingAddress);
            requestModel.shippingAddress = sofa.utils.FormatUtils.toBackendAddress(checkoutModel.shippingAddress);
        }

        setIfDefinedAndNotNull(requestModel, 'currency', checkoutModel.currency);
        setIfDefinedAndNotNull(requestModel, 'payment', checkoutModel.payment);
        setIfDefinedAndNotNull(requestModel, 'shipping', checkoutModel.selectedShippingMethod);
        setIfDefinedAndNotNull(requestModel, 'items', items);
        setIfDefinedAndNotNull(requestModel, 'discounts', checkoutModel.discounts || []);

        return requestModel;
    };
});
