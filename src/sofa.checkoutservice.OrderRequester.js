'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.checkoutservice.OrderRequester
 * @namespace sofa.checkoutservice
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 *
 *
 * @description
 * The `sofa.checkoutservice.OrderRequester` takes an `OrderInfo` holding both the `orderId and
 * returns the order via the backend API.
 */
sofa.define('sofa.checkoutservice.OrderRequester', function ($q, $http, configService) {

    var CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    return function (orderInfo) {
        return $http({
            method: 'GET',
            headers: { 'X-Auth-Token': orderInfo.token },
            url: CHECKOUT_ENDPOINT + '/orders/' + orderInfo.orderId,
            data: {}
        })
        .then(function (data) {
            return data.data;
        });
    };
});