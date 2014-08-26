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
        return $http({
            method: 'POST',
            url: CHECKOUT_ENDPOINT + '/quotes',
            data: requestModel
        })
        .then(function (data) {
            data.data.paymentMethods = data.data.allowedPaymentMethods;
            data.data.shippingMethods = data.data.allowedShippingMethods;
            return data.data;
        });
    };
});