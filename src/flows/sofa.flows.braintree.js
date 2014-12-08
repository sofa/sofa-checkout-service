'use strict';
/* global sofa, document */

sofa.define('sofa.checkout.flows.Braintree', function ($q) {

    var self = {};

    self.initialize = function () {
        // This method is called before the payment method is being used
        // It needs to guard itself if it should only be called once per session
    };

    self.checkout = function (checkoutModel) {
        // This may do anything it feels up to including downloading porn from random servers
        // as long as it returns a promise with a yet-to-be-defined structure
        var deferred = $q.defer();
        deferred.resolve({ token: '4711', quote: { id: 4712 } });
        return deferred.promise;
    };

    return self;
});
