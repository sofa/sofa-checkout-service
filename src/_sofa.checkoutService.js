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
sofa.define('sofa.CheckoutService', function ($http, $q, basketService, loggingService, configService, storageService, userService) {

    var self = {},
        quoteCache = null,
        CHECKOUT_ENDPOINT = configService.get('checkoutEndpoint'),
        STORE_PAYMENT_METHOD_KEY = 'paymentMethod',
        STORE_SHIPPING_METHOD_KEY = 'shippingMethod',
        quoteRequester = new sofa.checkout.DefaultQuoteRequester($q),
        //orderRequester = new sofa.checkout.OrderRequester(),
        router = new sofa.checkout.FlowRouter();

    // Fixme
    self.getLastUsedPaymentMethod = function () {
        return null;
    };

    // Fixme
    self.getLastUsedShippingMethod = function () {
        return null;
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#hasExistingBillingAddress
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns whether there is a billing address available from the storage.
     *
     * @example
     * var hasBillingAddress = checkoutService.hasExistingBillingAddress();
     *
     * @return {boolean}
     */
    self.hasExistingBillingAddress = function () {
        return userService.hasExistingBillingAddress();
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getShippingAddress
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the sh shipping address if it exists in storage.
     *
     * @example
     * var shippingAddress = checkoutService.getShippingAddress();
     *
     * @return {mix} Either an address object or undefined
     */
    self.getShippingAddress = function () {
        return userService.getShippingAddress();
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#updateShippingAddress
     * @memberof sofa.CheckoutService
     *
     * @description
     * Saves the shipping address to the storage.
     *
     * @param {object} model Address model.
     *
     */
    self.updateShippingAddress = function (model) {
        userService.updateShippingAddress(model);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getBillingAddress
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the billing address if it exists in storage.
     *
     * @example
     * var billingAddress = checkoutService.getBillingAddress();
     *
     * @return {mix} Either an address object or undefined
     */
    self.getBillingAddress = function () {
        return userService.getBillingAddress();
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#updateBillingAddress
     * @memberof sofa.CheckoutService
     *
     * @description
     * Saves the billing address to the storage.
     *
     * @param {object} model Address model.
     *
     */
    self.updateBillingAddress = function (model) {
        userService.updateBillingAddress(model);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getPaymentMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the payment method if it exists in storage.
     *
     * @example
     * var paymentMethod = checkoutService.getPaymentMethod();
     *
     * @return {mix} Either a payment method object or undefined
     */
    self.getPaymentMethod = function () {
        return storageService.get(STORE_PAYMENT_METHOD_KEY);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#updatePaymentMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Saves the payment method to the storage.
     *
     * @param {object} paymentMethod Payment method model.
     *
     */
    self.updatePaymentMethod = function (paymentMethod) {
        storageService.set(STORE_PAYMENT_METHOD_KEY, paymentMethod);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getShippingMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the shipping method if it exists in storage.
     *
     * @example
     * var shippingMethod = checkoutService.getShippingMethod();
     *
     * @return {mix} Either a shipping method object or undefined
     */
    self.getShippingMethod = function () {
        return storageService.get(STORE_SHIPPING_METHOD_KEY);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#updateShippingMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Saves the shipping method to the storage.
     *
     * @param {object} shippingMethod Shipping method model.
     *
     */
    self.updateShippingMethod = function (shippingMethod) {
        storageService.set(STORE_SHIPPING_METHOD_KEY, shippingMethod);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getPaymentMethodByCode
     * @memberof sofa.CheckoutService
     *
     * @description
     * Searches an array of available payment methods for a method with a given code. If the method is found
     * it is returned. Otherwise an empty object is returned.
     *
     * @example
     * var availableMethods = [
     *     {
     *         code: 'foo',
     *         title: 'Foo Method'
     *     },
     *     {
     *         code: 'bar',
     *         title: 'Bar Method'
     *     }
     * ];
     * var myPaymentMethod = checkoutService.getPaymentMethodByCode('bar', availableMethods);
     * console.log(myPaymentMethod.title) // --> 'Bar Method'
     *
     * var myOtherPaymentMethod = checkoutService.getPaymentMethodByCode('some code', availableMethods);
     * console.log(myPaymentMethod) // --> {}
     *
     * @return {object} Either a payment method object or an empty object
     */
    self.getPaymentMethodByCode = function (code, supportedMethods) {
        return sofa.Util.find(supportedMethods, function (method) {
            // TODO: new API will use method.methodCode
            return method.code && method.code === code;
        }) || {};
    };

    self.getCleanCheckoutModel = function () {
        return {
            billingAddress: {},
            shippingAddress: {},
            // payment: null,
            // shipping: null,
            items: []
        };
    };

    self.getAvailableCheckoutMethods = function (checkoutModel) {

        checkoutModel.items = basketService.getItems().map(function (item) {
            return {
                productId: item.product.id,
                quantity: item.quantity,
                variant: item.getVariantID() && { id: item.getVariantID() },
                option: item.getOptionID() && { id: item.getOptionID() }
            };
        });

        return $http({
            method: 'POST',
            url: CHECKOUT_ENDPOINT + '/methods',
            data: checkoutModel
        })
        .then(function (data) {
            data.data.paymentMethods = sofa.utils.FormatUtils.toSofaPaymentMethods(data.data.paymentMethods);
            data.data.shippingMethods = sofa.utils.FormatUtils.toSofaShippingMethods(data.data.shippingMethods);
            return data.data;
        });
    };

    self.addFlow = function (flow) {
        router.addFlow(flow);
    };

    self.addFlows = function (flows) {
        router.addFlows(flows);
    };

    self.createQuote = function (checkoutModel) {

        // we don't want to mess with the original instance
        // as it might be directly bound to UI stuff. We make a copy
        // and perform all manipulations there.
        var checkoutModelCopy = augmentCheckoutModel(sofa.Util.clone(checkoutModel));

        var flow = router.matchFlow(checkoutModelCopy);
        return flow
                .createQuote(checkoutModelCopy)
                .then(function (quote) {
                    quoteCache = quote;
                    quoteCache.cached = true;
                    return quote;
                });
    };

    self.updateQuote = function (checkoutModel) {

        var checkoutModelCopy = augmentCheckoutModel(sofa.Util.clone(checkoutModel));

        var flow = router.matchFlow(checkoutModelCopy);
        return flow
                .updateQuote(checkoutModelCopy)
                .then(function (quote) {
                    quoteCache = quote;
                    quoteCache.cached = true;
                    return quote;
                });
    };

    var augmentCheckoutModel = function (checkoutModelCopy) {

        // we alter the models here before we set them to the same instance because afterwards
        // it's not safe anymore to alter them
        if (checkoutModelCopy.billingAddress && checkoutModelCopy.billingAddress.country) {
            checkoutModelCopy.billingAddress.country = checkoutModelCopy.billingAddress.country.value;
        }

        if (checkoutModelCopy.shippingAddress && checkoutModelCopy.shippingAddress.country) {
            checkoutModelCopy.shippingAddress.country = checkoutModelCopy.shippingAddress.country.value;
        }


        // shipping is billing
        if (checkoutModelCopy.addressEqual && sofa.Util.isEmpty(checkoutModelCopy.shippingAddress)) {
            checkoutModelCopy.shippingAddress = checkoutModelCopy.billingAddress;
        // billing is shipping
        } else if (checkoutModelCopy.addressEqual && sofa.Util.isEmpty(checkoutModelCopy.billingAddress)) {
            checkoutModelCopy.billingAddress = checkoutModelCopy.shippingAddress;
        }

        checkoutModelCopy.items = basketService.getItems().map(function (item) {
            return {
                //FIXME: get rid of hack as soon as we have the new API
                productId: item.product.id + '',
                quantity: item.quantity,
                // FIXME: use as soon as Jan fixes all the things 
                //variant: item.getVariantID() && { id: item.getVariantID() },
                //option: item.getOptionID() && { id: item.getOptionID() }
            };
        });

        return checkoutModelCopy;
    }

    // is this likely to have different flows?
    self.getQuote = function (quoteInfo) {
        return quoteRequester.getQuote(quoteInfo, quoteCache);
    };

    // We need to react to different flows here: Either we have a redirectURL or not. See in reno branch.
    self.createOrder = function (quoteInfo) {
        return orderRequester.getOrder(quoteInfo);
    };

    return self;
});


