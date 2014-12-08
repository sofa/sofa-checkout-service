'use strict';
/* global sofa, document */

sofa.define('sofa.checkout.DefaultQuoteRequester', function ($q) {

    var self = this;

    self.getQuote = function (quoteInfo, quoteCache) {

        if (quoteCache && quoteCache.token == quoteInfo.token && quoteCache.quote.id == quoteInfo.id) {
            return $q.when(quoteCache)
        }

        var deferred = $q.defer();
        deferred.resolve({ token: '4711', quote: { id: 4712 } });
        return deferred.promise;
    };

    return self;
});
