'use strict';
/* global sofa, document */
/**
 * @sofadoc class
 * @name sofa.CheckoutService
 * @package sofa-checkout-service
 *
 * @requiresPackage sofa-http-service
 * @requiresPackage sofa-q-service
 * @requiresPackage sofa-basket-service
 * @requiresPackage sofa-logging-service
 *
 * @requires sofa.HttpService
 * @requires sofa.QService
 * @requires sofa.BasketService
 * @requires sofa.LoggingService
 *
 * @distFile dist/sofa.checkoutService.js
 *
 * @description
 * The `sofa.CheckoutService` provides methods to perform checkouts as well as giving
 * you information about used and last used payment or shipping methods. There are
 * several checkout types supported, all built behind a clean API.
 */
sofa.define('sofa.CheckoutService', function ($http, $q, basketService, loggingService, configService) {

    var self = {},
        quoteCache = null,
        quoteRequester = new sofa.checkout.DefaultQuoteRequester($q),
        orderRequester = new sofa.checkout.OrderRequester(),
        router = new sofa.checkout.FlowRouter();

    self.addFlow = function (flow) {
        router.addFlow(flow);
    };

    self.addFlows = function (flows) {
        router.addFlows(flows);
    };

    self.createQuote = function (checkoutModel) {
        var flow = router.matchFlow(checkoutModel);
        return flow
                .checkout(checkoutModel)
                .then(function (quote) {
                    quoteCache = quote;
                    quoteCache.cached = true;
                    return quote;
                });
    };

    // is this likely to have different flows?
    self.getQuote = function (quoteInfo) {
        return quoteRequester.getQuote(quoteInfo, quoteCache);
    };

    // is this likely to have different flows?
    self.createOrder = function (quoteInfo) {
        return orderRequester.getOrder(quoteInfo);
    };

    return self;
});


