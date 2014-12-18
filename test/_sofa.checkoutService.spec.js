'use strict';
/* global sofa */
/* global AsyncSpec */


describe('sofa.checkoutService', function () {

    var checkoutService,
        q,
        configService,
        loggingService,
        basketService,
        httpService,
        storageService;

    var createCheckoutService = function (httpService, basketService) {
        q = new sofa.QService();
        loggingService = new sofa.LoggingService(configService);
        checkoutService = new sofa.CheckoutService(httpService, q, basketService, loggingService, configService);

        var flow = new sofa.checkout.flows.DummyFlow(q);
        checkoutService
            .addFlow({
                flow: flow,
                predicate: function () { return true; }
            });

        return checkoutService;
    };

    var createHttpService = function () {
        return new sofa.mocks.httpService(new sofa.QService());
    };

    beforeEach(function () {
        configService = new sofa.ConfigService();
        storageService = new sofa.MemoryStorageService();
        basketService = new sofa.BasketService(storageService, configService);
        httpService = createHttpService();
        checkoutService = createCheckoutService(httpService, basketService);
    });

    it('should be defined', function () {
        expect(checkoutService).toBeDefined();
    });

    describe('createQuote', function () {

        var async = new AsyncSpec(this);

        async.it('returns correct quote', function (done) {

            checkoutService
                .createQuote()
                .then(function (data) {
                    expect(data.token).toBe('4711');
                })
                .then(function () { return checkoutService.getQuote({ token: '4711', id: '4712' }); })
                .then(function (data) {
                    expect(data.token).toBe('4711');
                    expect(data.cached).toBe(true);
                    done();
                });
        });
    });

    describe('getQuote', function () {

        var async = new AsyncSpec(this);

        async.it('returns quote from cache', function (done) {

            checkoutService
                .getQuote({ token: '4711', id: '4712' })
                .then(function (data) {
                    expect(data.token).toBe('4711');
                    expect(data.cached).toBeFalsy();
                    done();
                });
        });
    });

});
