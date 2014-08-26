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
 * The `sofa.checkoutservice.CheckoutRequester` takes the `RequestModel` for the checkout
 * and performs the actual API call against the backend API.
 */
sofa.define('sofa.checkoutservice.CheckoutRequester', function ($q, $http, configService, sharedState) {

    var CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    return function (requestModel) {
        return $http({
            method: 'POST',
            url: CHECKOUT_ENDPOINT + '/quotes',
            data: requestModel
        })
        .then(function (data) {
            var wrapper = {
                order: sofa.utils.FormatUtils.toSofaQuoteOrOrder(data.data),
                token: data.headers('X-Auth-Token')
            };
            sharedState.lastOrder = wrapper;

            return wrapper;
        });
    };
});