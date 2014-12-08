'use strict';
/* global sofa, document */

sofa.define('sofa.checkout.DefaultOrderRequester', function ($q) {

    var self = this;

    // do we have cases where we can serve orders from cache?
    self.getOrder = function (quoteInfo) {
        var deferred = $q.defer();
        deferred.resolve({ token: '4711', order: { id: 4712 } });
        return deferred.promise;
    };

    return self;
});
