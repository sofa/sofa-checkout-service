'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.checkoutservice.QuoteRequester
 * @namespace sofa.checkoutservice
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 *
 *
 * @description
 * The `sofa.checkoutservice.QuoteRequester` takes an `QuoteInfo` holding both the `quoteId and
 * the token and returns the order either from cache or via the backend API.
 */
sofa.define('sofa.checkoutservice.QuoteRequester', function ($q, $http, configService, storageService, sharedState) {

    var CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    return function (quoteInfo) {
        // we use == intentional here to allow both string and number parameters
        /*jshint eqeqeq:false */
        if (sharedState.lastOrder && sharedState.lastOrder.order.id == quoteInfo.quoteId &&
            sharedState.lastOrder.token == quoteInfo.token) {
            /*jshint eqeqeq:true */
            return $q.when(sharedState.lastOrder.order);
        }
        else {
            return $http({
                method: 'GET',
                headers: { 'X-Auth-Token': quoteInfo.token },
                url: CHECKOUT_ENDPOINT + '/quotes/' + quoteInfo.quoteId,
                data: {}
            })
            .then(function (data) {
                return sofa.utils.FormatUtils.toSofaQuoteOrOrder(data.data);
            });
        }
    };
});
