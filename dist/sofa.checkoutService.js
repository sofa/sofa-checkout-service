/**
 * sofa-checkout-service - v0.6.0 - 2014-09-18
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa,undefined) {

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
    self.getShippingMethodsForPayPal = function (/* shippingCountry */) {
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
 * The `sofa.checkoutservice.CheckoutMethodsRequestConverter` takes a copy of a `CheckoutModel` 
 * plus an arryay of `BasketItems` and produces a request object for the `getSupportedCheckoutMethods`
 * backend API call. The passed `CheckoutModel` instance is a copy so that mutation is safe to do without
 * mutating foreign state.
 */
sofa.define('sofa.checkoutservice.CheckoutMethodsRequestConverter', function () {

    var setIfDefinedAndNotNull = function (store, key, item) {
        if (sofa.Util.isNotNullNorUndefined(item)) {
            store[key] = item;
        }
    };

    return function (checkoutModel, basketItems) {

        var items = basketItems.map(function (item) {
            return {
                productId: item.product.id,
                quantity: item.quantity,
                variant: item.getVariantID() && { id: item.getVariantID() },
                option: item.getOptionID() && { id: item.getOptionID() }
            };
        });

        var requestModel = {};

        // the API does not like things to be NULL. They should be left off instead
        if (checkoutModel.billingAddress) {
            requestModel.billingAddress = sofa.utils.FormatUtils.toBackendAddress(checkoutModel.billingAddress);
            requestModel.shippingAddress = sofa.utils.FormatUtils.toBackendAddress(checkoutModel.shippingAddress);
        }

        setIfDefinedAndNotNull(requestModel, 'currency', checkoutModel.currency);
        setIfDefinedAndNotNull(requestModel, 'payment', checkoutModel.selectedPaymentMethod);
        setIfDefinedAndNotNull(requestModel, 'shipping', checkoutModel.selectedShippingMethod);
        setIfDefinedAndNotNull(requestModel, 'items', items);
        setIfDefinedAndNotNull(requestModel, 'discounts', checkoutModel.discounts || []);

        return requestModel;
    };
});
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
'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.checkoutservice.CheckoutRequestConverter
 * @namespace sofa.checkoutservice
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 *
 *
 * @description
 * The `sofa.checkoutservice.CheckoutRequestConverter` takes a copy of a `CheckoutModel` 
 * plus an arryay of `BasketItems` and produces a request object for the `checkout`
 * backend API call. The passed `CheckoutModel` instance is a copy so that mutation is safe to do without
 * mutating foreign state.
 */
sofa.define('sofa.checkoutservice.CheckoutRequestConverter', function () {
    // for now, we can just use the other converter. If they turn out to
    // be the same thing we will just create a BaseCheckoutModelConverter and delegate
    // to that.
    return new sofa.checkoutservice.CheckoutMethodsRequestConverter();
});
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
sofa.define('sofa.checkoutservice.QuoteRequester', function ($q, $http, configService, sharedState) {

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
'use strict';
/* global sofa */
/**
 * @sofadoc class
 * @name sofa.Util.FormatUtils
 * @namespace sofa.Util
 * @package sofa-checkout-service
 * @distFile dist/sofa.checkoutService.js
 * @static
 *
 *
 * @description
 * The `sofa.utils.FormatUtils` provides methods to convert various kinds of data into
 * other formats used throughout the API and backend.
 */
sofa.define('sofa.utils.FormatUtils', {
    /**
     * @sofadoc method
     * @name sofa.Util.FormatUtils#zeroFill
     * @memberof sofa.Utils.FormatUtils
     *
     * @description
     * Turns any number into a string with a specified amount of leading zeros.
     *
     * @example
     * zeroFill(64, 4)
     * => "0064"
     *
     * @return {string} Number with leading zeros
     */
    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + '';
    },
    toBackendAddress: function (sofaAddress) {
        // we currently work around non-null strictness by setting empty strings.
        // Should be fixed soon.
        return sofaAddress && {
            company: sofaAddress.company || '',
            salutation: sofaAddress.salutation || '',
            firstName: sofaAddress.name || '',
            lastName: sofaAddress.surname || '',
            street: sofaAddress.street || '',
            streetNumber: sofaAddress.streetnumber || '',
            streetAdditional: sofaAddress.streetextra || '',
            city: sofaAddress.city || '',
            zipCode: sofaAddress.zip || '',
            country: sofaAddress.country && sofaAddress.country.value,
            phone: sofaAddress.telephone || '',
            vatId: 0
        };
    },
    toSofaAddress: function (backendAddress) {
        return backendAddress && {
            company: backendAddress.company,
            salutation: backendAddress.salutation,
            name: backendAddress.firstName,
            surname: backendAddress.lastName,
            street: backendAddress.street,
            streetnumber: backendAddress.streetNumber,
            streetextra: backendAddress.streetAdditional,
            city: backendAddress.city,
            zip: backendAddress.zipCode,
            country: {
                value: backendAddress.country
            },
            telephone: backendAddress.phone
        };
    },
    toSofaPaymentMethods: function (paymentMethods) {
        return paymentMethods.map(function (method) {
            method.surcharge = method.surcharge / 100;
            return method;
        });
    },
    toSofaShippingMethods: function (shippingMethods) {
        return shippingMethods.map(function (method) {
            method.price = method.price / 100;
            method.taxAmount = method.taxAmount / 100;
            return method;
        });
    },
    toSofaQuoteOrOrder: function (quoteOrOrder) {
        quoteOrOrder.shippingAddress = sofa.utils.FormatUtils.toSofaAddress(quoteOrOrder.shippingAddress);
        quoteOrOrder.billingAddress = sofa.utils.FormatUtils.toSofaAddress(quoteOrOrder.billingAddress);

        if (quoteOrOrder.allowedPaymentMethods) {
            quoteOrOrder._allowedPaymentMethods = quoteOrOrder.allowedPaymentMethods;
            quoteOrOrder.allowedPaymentMethods = sofa.utils.FormatUtils.toSofaPaymentMethods(quoteOrOrder.allowedPaymentMethods);
        }

        if (quoteOrOrder.allowedShippingMethods) {
            quoteOrOrder._allowedShippingMethods = quoteOrOrder.allowedShippingMethods;
            quoteOrOrder.allowedShippingMethods = sofa.utils.FormatUtils.toSofaShippingMethods(quoteOrOrder.allowedShippingMethods);
        }

        var totals = quoteOrOrder.totals;
        quoteOrOrder._totals = totals;

        // FIXME: Temporally map the items
        quoteOrOrder._items = quoteOrOrder.items;
        quoteOrOrder.items = quoteOrOrder.items.map(function (item) {
            item.price = item.price / 100;
            item.subtotal = item.rowTotal / 100;
            return item;
        });

        //FIXME: We just map to the old totals structure for now
        quoteOrOrder.totals = {
            total: totals.grandTotal / 100,
            sum: totals.subTotal / 100,
            shipping: totals.shippingAmount / 100,
            // FIXME
            vat: totals.taxTotals[0].taxAmount / 100
        };
        return quoteOrOrder;
    }
});

} (sofa));
