'use strict';
/* global sofa */
/* global document */
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
sofa.define('sofa.checkoutservice.QuoteToOrderRequester', function ($q, $http, configService) {

    var CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    var redirect = function (url, method, data) {
        var form = document.createElement('form');
        form.method = method;
        form.action = url;

        if (data) {
            sofa.Util.forEach(data, function (value, key) {
                var input = document.createElement('input');
                input.type = 'text';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
        }

        form.submit();
    };

    return function (orderInfo) {

        return $http({
            method: 'POST',
            headers: {'X-Auth-Token': orderInfo.token },
            url: CHECKOUT_ENDPOINT + '/quotes/' + orderInfo.orderId + '/order',
            data: {}
        })
        .then(function (data) {
            var state = {
                flow: 'local_thankyou',
                data: data.data,
            };

            if (data.data.payment.redirectUrl) {
                state.flow = 'redirect';
                redirect(data.data.payment.redirectUrl, 'POST', data.data.payment.redirectParameters);
            }

            return state;
        });
    };
});