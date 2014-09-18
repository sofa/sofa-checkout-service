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
 * The `sofa.checkoutservice.CheckoutMethodsRequester` takes the `RequestModel` for the checkout method retrieval
 * and performs the actual API call against the backend API.
 */
sofa.define('sofa.checkoutservice.CheckoutMethodsRequester', function ($q, $http, configService) {

    var CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    return function (requestModel) {

        // Last minute Reno hack. We need to set the productId to the variantId, because time.
        requestModel.items.forEach(function (item) {
            item.productId = item.variant ? item.variant.id : item.productId;
        });

        return $http({
            method: 'POST',
            url: CHECKOUT_ENDPOINT + '/methods',
            data: requestModel
        })
        .then(function (data) {
            data.data.paymentMethods = sofa.utils.FormatUtils.toSofaPaymentMethods(data.data.paymentMethods);
            data.data.shippingMethods = sofa.utils.FormatUtils.toSofaShippingMethods(data.data.shippingMethods);
            return data.data;
        });
    };
});