'use strict';
/* global sofa */
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

    var self = {};

    var lastUsedPaymentMethod,
        lastUsedShippingMethod;

    // we pass the shared state to all the requester and converter in order to let them
    // share common state.
    var sharedState = {};

    var checkoutMethodsRequestConverter = new sofa.checkoutservice.CheckoutMethodsRequestConverter(sharedState),
        checkoutMethodsRequester        = new sofa.checkoutservice.CheckoutMethodsRequester($q, $http, configService, sharedState),
        checkoutRequestConverter        = new sofa.checkoutservice.CheckoutRequestConverter(sharedState),
        checkoutRequester               = new sofa.checkoutservice.CheckoutRequester($q, $http, configService, sharedState),
        quoteToOrderRequester           = new sofa.checkoutservice.QuoteToOrderRequester($q, $http, configService, sharedState),
        quoteRequester                  = new sofa.checkoutservice.QuoteRequester($q, $http, configService, sharedState),
        orderRequester                  = new sofa.checkoutservice.OrderRequester($q, $http, configService, sharedState);

    //allow this service to raise events
    sofa.observable.mixin(self);

    //FIXME: This is needed for the CouponService to work
    self.createQuoteData = function () {
        throw new Error('not implemented');
    };

    // LEAVE THIS HERE UNTIL WE FINISHED PORTING ALL THE BIRTHDAY & COUPON STUFF

    //we need to transform the checkoutModel into something the backend understands
    // var createRequestData = function (checkoutModel) {

    //     if (!checkoutModel) {
    //         return null;
    //     }

    //     var modelCopy = sofa.Util.clone(checkoutModel);

    //     if (modelCopy.addressEqual) {
    //         modelCopy.shippingAddress = sofa.Util.clone(modelCopy.billingAddress);
    //     }

    //     var requestModel = {};

    //     var convertBirthDay = function (model) {
    //         // Convert the birthday into the yyyy-mm-dd format
    //         if (model &&
    //             model.birthday &&
    //             model.birthmonth &&
    //             model.birthyear) {
    //             model.birthdate = sofa.utils.FormatUtils.zeroFill(model.birthyear, 4) + '-' +
    //                 sofa.utils.FormatUtils.zeroFill(model.birthmonth, 2) + '-' +
    //                 sofa.utils.FormatUtils.zeroFill(model.birthday, 2);
    //             delete model.birthday;
    //             delete model.birthmonth;
    //             delete model.birthyear;
    //         }
    //     };

    //     convertBirthDay(modelCopy.billingAddress);
    //     convertBirthDay(modelCopy.shippingAddress);

    //     if (modelCopy.billingAddress && modelCopy.billingAddress.country) {
    //         modelCopy.billingAddress.countryLabel = modelCopy.billingAddress.country.label;
    //         modelCopy.billingAddress.country = modelCopy.billingAddress.country.value;
    //         requestModel.invoiceAddress = JSON.stringify(modelCopy.billingAddress);
    //     }

    //     if (modelCopy.shippingAddress && modelCopy.shippingAddress.country) {
    //         modelCopy.shippingAddress.countryLabel = modelCopy.shippingAddress.country.label;
    //         modelCopy.shippingAddress.country = modelCopy.shippingAddress.country.value;
    //         requestModel.shippingAddress = JSON.stringify(modelCopy.shippingAddress);
    //     }

    //     if (modelCopy.selectedPaymentMethod && modelCopy.selectedPaymentMethod.method) {
    //         requestModel.paymentMethod = modelCopy.selectedPaymentMethod.method;
    //     } else {
    //         requestModel.paymentMethod = modelCopy.selectedPaymentMethod;
    //     }

    //     if (modelCopy.selectedShippingMethod && modelCopy.selectedShippingMethod.method) {
    //         requestModel.shippingMethod = modelCopy.selectedShippingMethod.method;
    //     }

    //     requestModel.quote = JSON.stringify(self.createQuoteData());

    //     if (modelCopy.payone) {
    //         if (modelCopy.payone.pseudocardpan && modelCopy.payone.truncatedcardpan) {
    //             requestModel.payonePseudocardpan = modelCopy.payone.pseudocardpan;
    //             requestModel.payoneTruncatedcardpan = modelCopy.payone.truncatedcardpan;
    //         }
    //     }

    //     var coupons = basketService.getActiveCoupons().map(function (coupon) {
    //         return coupon.code;
    //     });
    //     requestModel.coupons = JSON.stringify(coupons);

    //     return requestModel;
    // };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getLastUsedPaymentMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the last used payment method.
     *
     * @example
     * checkoutService.getLastUsedPaymentMethod();
     *
     * @return {object} Last used payment method.
     */
    self.getLastUsedPaymentMethod = function () {
        return lastUsedPaymentMethod || null;
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getLastUsedShippingMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the last used shipping method.
     *
     * @example
     * checkoutService.getLastUsedShippingMethod()
     *
     * @return {object} Last used shipping method.
     */
    self.getLastUsedShippingMethod = function () {
        return lastUsedShippingMethod || null;
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getShippingMethodsForPayPal
     * @memberof sofa.CheckoutService
     *
     * @description
     * This method delegates to {@link sofa.CheckoutService#getSupportedCheckoutMethods sofa.CheckoutService.getSupportedCheckoutMethods} end returns the supported shipping
     * methods for PayPal. One has to pass a shipping country to determine the
     * supported shipping methods.
     *
     * @example
     * var methods = checkoutService.getShippingMethodsForPayPal(shippingCountry);
     *
     * @param {int} shippingCountry Shipping country id.
     *
     * @return {object} A promise.
     */
    self.getShippingMethodsForPayPal = function (shippingCountry) {
        throw new Error('not implemented');
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getSupportedCheckoutMethods
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns supported checkout methods by a given checkout model.
     *
     * @param {object} checkoutModel A full featured checkout model.
     *
     * @return {object} A promise.
     */
    self.getSupportedCheckoutMethods = function (checkoutModel) {
        var requestModel = checkoutMethodsRequestConverter(
                                validateCheckoutModel(checkoutModel), basketService.getItems());

        if (sofa.Util.isObject(checkoutModel.selectedPaymentMethod)) {
            lastUsedPaymentMethod = checkoutModel.selectedPaymentMethod;
        }

        if (sofa.Util.isObject(checkoutModel.selectedShippingMethod)) {
            lastUsedShippingMethod = checkoutModel.selectedShippingMethod;
        }

        return checkoutMethodsRequester(requestModel)
                .then(null, function (fail) {
                    loggingService.error([
                        '[CheckoutService: getSupportedCheckoutMethods]',
                        '[Request Data]',
                        requestModel,
                        '[Service answer]',
                        fail
                    ]);
                    return $q.reject(fail);
                });
    };

    self.checkout = function (checkoutModel) {
        var requestModel = checkoutRequestConverter(
                            validateCheckoutModel(checkoutModel), basketService.getItems());

        return checkoutRequester(requestModel)
                .then(null, function (fail) {
                    loggingService.error([
                        '[CheckoutService: getSupportedCheckoutMethods]',
                        '[Request Data]',
                        requestModel,
                        '[Service answer]',
                        fail
                    ]);
                    return $q.reject(fail);
                });
    };

    var validateCheckoutModel = function (checkoutModel) {
        // we don't want to mess with the original instance
        // as it might be directly bound to UI stuff. We make a copy
        // and perform all manipulations there.
        var modelCopy = sofa.Util.clone(checkoutModel);

        if (modelCopy.addressEqual) {
            modelCopy.shippingAddress = modelCopy.billingAddress;
        }

        return modelCopy;
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getQuote
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    self.getQuote = function (quoteInfo) {
        return quoteRequester(quoteInfo);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#getOrder
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    self.getOrder = function (orderInfo) {
        return orderRequester(orderInfo);
    };

    /**
     * @sofadoc method
     * @name sofa.CheckoutService#placeOrder
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    self.placeOrder = function (orderInfo) {
        return quoteToOrderRequester(orderInfo)
                .then(null, function (fail) {
                    loggingService.error([
                        '[CheckoutService: placeOrder]',
                        '[Request Data]',
                        orderInfo,
                        '[Service answer]',
                        fail
                    ]);
                    return $q.reject(fail);
                });
    };

    return self;
});
