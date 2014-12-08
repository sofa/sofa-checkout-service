// 'use strict';
// /* global sofa, document */
// /**
//  * @sofadoc class
//  * @name sofa.CheckoutService
//  * @package sofa-checkout-service
//  *
//  * @requiresPackage sofa-http-service
//  * @requiresPackage sofa-q-service
//  * @requiresPackage sofa-basket-service
//  * @requiresPackage sofa-logging-service
//  *
//  * @requires sofa.HttpService
//  * @requires sofa.QService
//  * @requires sofa.BasketService
//  * @requires sofa.LoggingService
//  *
//  * @distFile dist/sofa.checkoutService.js
//  *
//  * @description
//  * The `sofa.CheckoutService` provides methods to perform checkouts as well as giving
//  * you information about used and last used payment or shipping methods. There are
//  * several checkout types supported, all built behind a clean API.
//  */
// sofa.define('sofa.CheckoutService', function ($http, $q, basketService, loggingService, configService) {

//     var self = {};

//     var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
//         CHECKOUT_URL      = configService.get('checkoutUrl'),
//         FULL_CHECKOUT_URL = configService.get('checkoutUrl') + 'ajax.php';

//     var lastUsedPaymentMethod,
//         lastUsedShippingMethod,
//         lastSummaryResponse;

//     var redirect = null;

//     //allow this service to raise events
//     sofa.observable.mixin(self);

//     self.createQuoteData = function () {

//         var data = basketService
//                     .getItems()
//                     .map(function (item) {
//                         return {
//                             // we always want the productId to be a string and this method
//                             // has a safer handling of undefined and null values
//                             productID: item.product.id + '',
//                             qty: item.quantity,
//                             variantID: item.getVariantID(),
//                             optionID: item.getOptionID()
//                         };
//                     });

//         return data;
//     };

//     //we need to transform the checkoutModel into something the backend understands
//     var createRequestData = function (checkoutModel) {

//         if (!checkoutModel) {
//             return null;
//         }

//         var modelCopy = sofa.Util.clone(checkoutModel);

//         if (modelCopy.addressEqual) {
//             modelCopy.shippingAddress = sofa.Util.clone(modelCopy.billingAddress);
//         }

//         var requestModel = {};

//         var convertBirthDay = function (model) {
//             // Convert the birthday into the yyyy-mm-dd format
//             if (model &&
//                 model.birthday &&
//                 model.birthmonth &&
//                 model.birthyear) {
//                 model.birthdate = sofa.utils.FormatUtils.zeroFill(model.birthyear, 4) + '-' +
//                     sofa.utils.FormatUtils.zeroFill(model.birthmonth, 2) + '-' +
//                     sofa.utils.FormatUtils.zeroFill(model.birthday, 2);
//                 delete model.birthday;
//                 delete model.birthmonth;
//                 delete model.birthyear;
//             }
//         };

//         convertBirthDay(modelCopy.billingAddress);
//         convertBirthDay(modelCopy.shippingAddress);

//         if (modelCopy.billingAddress && modelCopy.billingAddress.country) {
//             modelCopy.billingAddress.countryLabel = modelCopy.billingAddress.country.label;
//             modelCopy.billingAddress.country = modelCopy.billingAddress.country.value;
//             requestModel.invoiceAddress = JSON.stringify(modelCopy.billingAddress);
//         }

//         if (modelCopy.shippingAddress && modelCopy.shippingAddress.country) {
//             modelCopy.shippingAddress.countryLabel = modelCopy.shippingAddress.country.label;
//             modelCopy.shippingAddress.country = modelCopy.shippingAddress.country.value;
//             requestModel.shippingAddress = JSON.stringify(modelCopy.shippingAddress);
//         }

//         if (modelCopy.selectedPaymentMethod && modelCopy.selectedPaymentMethod.method) {
//             requestModel.paymentMethod = modelCopy.selectedPaymentMethod.method;
//         } else {
//             requestModel.paymentMethod = modelCopy.selectedPaymentMethod;
//         }

//         if (modelCopy.selectedShippingMethod && modelCopy.selectedShippingMethod.method) {
//             requestModel.shippingMethod = modelCopy.selectedShippingMethod.method;
//         }

//         requestModel.quote = JSON.stringify(self.createQuoteData());

//         if (modelCopy.payone) {
//             if (modelCopy.payone.pseudocardpan && modelCopy.payone.truncatedcardpan) {
//                 requestModel.payonePseudocardpan = modelCopy.payone.pseudocardpan;
//                 requestModel.payoneTruncatedcardpan = modelCopy.payone.truncatedcardpan;
//             }
//         }

//         var coupons = basketService.getActiveCoupons().map(function (coupon) {
//             return coupon.code;
//         });
//         requestModel.coupons = JSON.stringify(coupons);

//         return requestModel;
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getLastUsedPaymentMethod
//      * @memberof sofa.CheckoutService
//      *
//      * @description
//      * Returns the last used payment method.
//      *
//      * @example
//      * checkoutService.getLastUsedPaymentMethod();
//      *
//      * @return {object} Last used payment method.
//      */
//     self.getLastUsedPaymentMethod = function () {
//         return lastUsedPaymentMethod || null;
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getLastUsedShippingMethod
//      * @memberof sofa.CheckoutService
//      *
//      * @description
//      * Returns the last used shipping method.
//      *
//      * @example
//      * checkoutService.getLastUsedShippingMethod()
//      *
//      * @return {object} Last used shipping method.
//      */
//     self.getLastUsedShippingMethod = function () {
//         return lastUsedShippingMethod || null;
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getShippingMethodsForPayPal
//      * @memberof sofa.CheckoutService
//      *
//      * @description
//      * This method delegates to {@link sofa.CheckoutService#getSupportedCheckoutMethods sofa.CheckoutService.getSupportedCheckoutMethods} end returns the supported shipping
//      * methods for PayPal. One has to pass a shipping country to determine the
//      * supported shipping methods.
//      *
//      * @example
//      * var methods = checkoutService.getShippingMethodsForPayPal(shippingCountry);
//      *
//      * @param {int} shippingCountry Shipping country id.
//      *
//      * @return {object} A promise.
//      */
//     self.getShippingMethodsForPayPal = function (shippingCountry) {
//         var checkoutModel = {
//             billingAddress: {
//                 country: shippingCountry || configService.getDefaultCountry()
//             },
//             shippingAddress: {
//                 country: shippingCountry || configService.getDefaultCountry()
//             },
//             selectedPaymentMethod: 'paypal_express'
//         };

//         return self.getSupportedCheckoutMethods(checkoutModel);
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getSupportedCheckoutMethods
//      * @memberof sofa.CheckoutService
//      *
//      * @description
//      * Returns supported checkout methods by a given checkout model.
//      *
//      * @param {object} checkoutModel A full featured checkout model.
//      *
//      * @return {object} A promise.
//      */
//     self.getSupportedCheckoutMethods = function (checkoutModel) {

//         var requestModel = createRequestData(checkoutModel);
//         requestModel.task = 'GETPAYMENTMETHODS';

//         if (sofa.Util.isObject(checkoutModel.selectedPaymentMethod)) {
//             lastUsedPaymentMethod = checkoutModel.selectedPaymentMethod;
//         }

//         if (sofa.Util.isObject(checkoutModel.selectedShippingMethod)) {
//             lastUsedShippingMethod = checkoutModel.selectedShippingMethod;
//         }

//         return $http({
//             method: 'POST',
//             url: FULL_CHECKOUT_URL,
//             headers: FORM_DATA_HEADERS,
//             transformRequest: cc.Util.toFormData,
//             data: requestModel
//         })
//         .then(function (response) {
//             var data = null;

//             if (response.data) {
//                 data = sofa.Util.toJson(response.data);

//                 if (data) {

//                     //We need to fix some types. It's a bug in the backend
//                     //https://github.com/couchcommerce/admin/issues/42

//                     data.paymentMethods = data.paymentMethods
//                                             .map(function (method) {
//                                                 method.surcharge = parseFloat(method.surcharge);
//                                                 /* jshint ignore: start */
//                                                 if (method.surcharge_percentage) {
//                                                     method.surcharge_percentage = parseFloat(method.surcharge_percentage);
//                                                 }
//                                                 /* jshint ignore: end */
//                                                 return method;
//                                             });

//                     data.shippingMethods = data.shippingMethods
//                                             .map(function (method) {
//                                                 method.price = parseFloat(method.price);
//                                                 return method;
//                                             });
//                 }
//             }

//             return data;
//         }, function (fail) {
//             loggingService.error([
//                 '[CheckoutService: getSupportedCheckoutMethods]',
//                 '[Request Data]',
//                 checkoutModel,
//                 '[Service answer]',
//                 fail
//             ]);
//             return $q.reject(fail);
//         });
//     };

//     var lazyLoadBraintree = function () {
//         var deferred = $q.defer();
//         var bt = document.createElement('script');
//         bt.type = 'text/javascript';
//         bt.async = true;
//         bt.src = 'https://assets.braintreegateway.com/v2/braintree.js';
//         bt.onload = function () {
//             deferred.resolve();
//         };
//         var s = document.getElementsByTagName('script')[0];
//         s.parentNode.insertBefore(bt, s);
//         return deferred.promise;
//     };

//     var getBraintreeNonce = function (token, ccData) {
//         var deferred = $q.defer();
//         var client = new window.braintree.api.Client({
//             clientToken: token
//         });
//         client.tokenizeCard({
//             /* jshint camelcase: false */
//             number: ccData.number,
//             expirationMonth: ccData.expirationMonth,
//             expirationYear: ccData.expirationYear,
//             cvv: ccData.cvv
//             /* jshint camelcase: true */
//         }, function (err, nonce) {
//             if (err) {
//                 deferred.reject(err);
//             }
//             else {
//                 deferred.resolve(nonce);
//             }
//         });
//         return deferred.promise;
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#checkoutWithCouchCommerce
//      * @memberof sofa.CheckoutService
//      *
//      * @return {object} A promise.
//      */
//     self.checkoutWithCouchCommerce = function (checkoutModel) {

//         if (checkoutModel.addressEqual) {
//             checkoutModel.shippingAddress = checkoutModel.billingAddress;
//         }

//         var requestModel = createRequestData(checkoutModel);
//         requestModel.task = 'CHECKOUT';

//         return $q.when().then(function () {
//             if (checkoutModel.selectedPaymentMethod.method === 'braintree_creditcard') {
//                 return $http({
//                     method: 'POST',
//                     headers: FORM_DATA_HEADERS,
//                     url: FULL_CHECKOUT_URL,
//                     transformRequest: cc.Util.toFormData,
//                     data: {
//                         task: 'BRAINTREETOKEN'
//                     }
//                 }).then(function (response) {
//                     var token = response.data.token;

//                     if (!window.braintree) {
//                         return lazyLoadBraintree()
//                         .then(function () {
//                             return $q.when(token);
//                         });
//                     }
//                     else {
//                         return $q.when(token);
//                     }
//                 }).then(function (token) {
//                     return getBraintreeNonce(token, {
//                         number: checkoutModel.braintree.creditcardnumber.replace(/ /g, ''),
//                         cvv: checkoutModel.braintree.creditcardcvc2,
//                         expirationMonth: checkoutModel.braintree.creditcardexpirationmonth.value,
//                         expirationYear: 2000 + checkoutModel.braintree.creditcardexpirationyear.value,
//                     }).then(function (nonce) {
//                         requestModel.braintreeNonce = nonce;
//                     });
//                 });
//             }
//             else {
//                 return $q.when();
//             }
//         })
//         .then(function () {
//             return $http({
//                 method: 'POST',
//                 url: FULL_CHECKOUT_URL,
//                 headers: FORM_DATA_HEADERS,
//                 transformRequest: cc.Util.toFormData,
//                 data: requestModel
//             });
//         })
//         .then(function (response) {
//             var data = null;
//             if (response.data) {
//                 data = sofa.Util.toJson(response.data);
//                 data = data.token || null;
//             }
//             return data;
//         }, function (fail) {
//             loggingService.error([
//                 '[CheckoutService: checkoutWithCouchCommerce]',
//                 '[Request Data]',
//                 checkoutModel,
//                 '[Service answer]',
//                 fail
//             ]);

//             return $q.reject(fail);
//         });
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#checkoutWithPayPal
//      * @memberof sofa.CheckoutService
//      *
//      * @param {object} shippingMethod Shipping method object.
//      * @param {object} shippingCountry Country to ship.
//      */
//     self.checkoutWithPayPal = function (shippingMethod, shippingCountry) {

//         var checkoutModel = {
//             selectedShippingMethod: shippingMethod,
//             selectedPaymentMethod: { method: 'paypal' },
//             shippingAddress: {
//                 country: shippingCountry
//             },
//             billingAddress: {
//                 country: shippingCountry
//             }
//         };

//         var requestModel = createRequestData(checkoutModel);
//         requestModel.task = 'UPDATEQUOTEPP';

//         return $http({
//             method: 'POST',
//             url: FULL_CHECKOUT_URL,
//             headers: FORM_DATA_HEADERS,
//             transformRequest: cc.Util.toFormData,
//             data: requestModel
//         })
//         .then(function (response) {
//             /*jslint eqeq: true*/
//             if (response.data == 1) {
//                 //we set the browser to this backend url and the backend in turn
//                 //redirects the browser to PayPal. Not sure why we don't redirect the
//                 //browser directly.
//                 //TODO: ask Felix
//                 window.location.href = configService.get('checkoutUrl');
//             } else {
//                 return $q.reject(new Error('invalid server response'));
//             }
//         })
//         .then(null, function (fail) {
//             loggingService.error([
//                 '[CheckoutService: checkoutWithPayPal]',
//                 '[Request Data]',
//                 requestModel,
//                 '[Service answer]',
//                 fail
//             ]);
//             return $q.reject(fail);
//         });
//     };

//     var safeUse = function (property) {
//         return property === undefined || property === null ? '' : property;
//     };

//     //unfortunately the backend uses all sorts of different address formats
//     //this one converts an address coming from a summary response to the
//     //generic app address format.
//     var convertAddress = function (backendAddress) {

//         backendAddress = backendAddress || {};

//         var country = {
//             value: safeUse(backendAddress.country),
//             label: safeUse(backendAddress.countryname)
//         };

//         return {
//             company:            safeUse(backendAddress.company),
//             salutation:         safeUse(backendAddress.salutation),
//             surname:            safeUse(backendAddress.lastname),
//             name:               safeUse(backendAddress.firstname),
//             street:             safeUse(backendAddress.street),
//             streetnumber:       safeUse(backendAddress.streetnumber),
//             streetextra:        safeUse(backendAddress.streetextra),
//             zip:                safeUse(backendAddress.zip),
//             city:               safeUse(backendAddress.city),
//             country:            !country.value ? null : country,
//             email:              safeUse(backendAddress.email),
//             telephone:          safeUse(backendAddress.telephone)
//         };
//     };

//     //we want to make sure that the server returned summary can be used
//     //out of the box to work with our summary templates/directives, hence
//     //we have to convert it (similar to how we do it for the addresses).
//     var convertSummary = function (backendSummary) {
//         backendSummary = backendSummary || {};

//         return {
//             sum:            safeUse(backendSummary.subtotal),
//             shipping:       safeUse(backendSummary.shipping),
//             surcharge:      safeUse(backendSummary.surcharge),
//             vat:            safeUse(backendSummary.vat),
//             total:          safeUse(backendSummary.grandtotal)
//         };
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getSummary
//      * @memberof sofa.CheckoutService
//      *
//      * @return {object} A promise.
//      */
//     self.getSummary = function (token) {
//         return $http({
//             method: 'POST',
//             url: CHECKOUT_URL + 'summaryst.php',
//             headers: FORM_DATA_HEADERS,
//             transformRequest: cc.Util.toFormData,
//             data: {
//                 details: 'get',
//                 token: token
//             }
//         })
//         .then(function (response) {
//             var data = {};
//             data.response = sofa.Util.toJson(response.data);
//             data.invoiceAddress = convertAddress(data.response.billing);
//             data.shippingAddress = convertAddress(data.response.shipping);
//             data.summary = convertSummary(data.response.totals);
//             data.token = token;

//             lastSummaryResponse = data;

//             // For providers such as CouchPay
//             if (data.response.redirect) {
//                 redirect = { token: token, redirect: data.response.redirect };
//             } else {
//                 redirect = null;
//             }

//             return data;
//         });
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#getLastSummary
//      * @memberof sofa.CheckoutService
//      *
//      * @return {object} Last summary response.
//      */
//     self.getLastSummary = function () {
//         return lastSummaryResponse;
//     };

//     /**
//      * @sofadoc method
//      * @name sofa.CheckoutService#activateOrder
//      * @memberof sofa.CheckoutService
//      *
//      * @return {object} A promise.
//      */
//     //that's the final step to actually create the order on the backend
//     self.activateOrder = function (token) {

//         // docheckoutst.php cannot be called here if a payment method redirects us
//         // as the backend needs to finalize the order
//         if (redirect && redirect.token === token) {
//             window.location.href = configService.get('checkoutUrl') + redirect.redirect + '?token=' + token;
//             return;
//         }


//         var useNewApi = lastSummaryResponse.response.paymentMethodName === 'PAYONE_CREDIT_CARD';
//         var checkoutUrl = useNewApi ?
//                             configService.get('checkoutUrlNew') + 'orders' :
//                             CHECKOUT_URL + 'docheckoutst.php';

//         return $http({
//             method: 'POST',
//             url: checkoutUrl,
//             headers: FORM_DATA_HEADERS,
//             transformRequest: cc.Util.toFormData,
//             data: {
//                 details: 'get',
//                 token: token,
//                 'storeCode': configService.get('storeCode')
//             }
//         })
//         .then(function (response) {
//             if (useNewApi) {
//                 if (response.data.error) {
//                     return $q.reject(response.data.error);
//                 }

//                 // Some payment methods have redirectUrls here as well.
//                 // Check and redirect if one is present.
//                 if (response.data.redirectUrl) {
//                     window.location.href = response.data.redirectUrl;
//                     return;
//                 }

//                 return response.data;
//             }
//             else {
//                 var json = sofa.Util.toJson(response.data);
//                 return json;
//             }
//         }, function (fail) {
//             loggingService.error([
//                 '[CheckoutService: checkoutWithCouchCommerce]',
//                 '[Request Data]',
//                 token,
//                 '[Service answer]',
//                 fail
//             ]);

//             return $q.reject(fail);
//         });
//     };

//     return self;
// });
