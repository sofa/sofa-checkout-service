'use strict';
/* global sofa, document */

sofa.define('sofa.checkout.flows.DefaultFlow', function (configService, $q, $http) {

    var self = {},
        CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint');

    self.initialize = function () {
        // This method is called before the payment method is being used
        // It needs to guard itself if it should only be called once per session
    };

    self.createQuote = function (checkoutModel) {

        return $http({
            method: 'POST',
            url: CHECKOUT_ENDPOINT + '/quotes',
            data: checkoutModel
        })
        .then(function (data) {
            var wrapper = {
                quote: data.data,
                token: data.headers('X-Auth-Token')
            };

            return wrapper;
        });
    };

    self.updateQuote = function (checkoutModel, quote, token) {

    }

    return self;
});
