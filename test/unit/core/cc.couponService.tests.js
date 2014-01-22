module('cc.couponService.tests');

var createHttpService = function() {
    return new cc.mocks.httpService(new cc.QService());
};

var createCouponService = function(httpService, basketService) {
    var configService = new cc.ConfigService();
    basketService = basketService || new cc.BasketService(new cc.LocalStorageService(), configService);
    var checkoutService = new cc.CheckoutService(httpService, new cc.QService(), basketService, new cc.LoggingService(configService), configService);
    return new cc.CouponService(httpService, new cc.QService(), basketService, checkoutService, new cc.LoggingService(configService), configService);
};

test('can create CouponService instance', function() {
    var couponService = createCouponService(createHttpService());

    ok(couponService, 'created couponService instance');
});

asyncTest('submitting a code returns a valid response', function() {
    expect(1);

    var httpService = createHttpService();

    httpService
        .when('POST', cc.Config.checkoutUrl + 'coupon.php')
        .respond({
            amount: 0,
            code: 'TENEURO',
            description: '10 EURO',
            error: null,
            freeShipping: '0',
            name: '10 EURO',
            sortOrder: '0',
            type: 'fix'
        });

    var couponService = createCouponService(httpService);

    couponService.submitCode('TENEURO')
        .then(function(response) {
            ok(response && response.code === 'TENEURO', 'received a valid response');
            start();
        });
});

asyncTest('submitting an empty code returns an error', function() {
    expect(1);

    var httpService = createHttpService();

    httpService
        .when('POST', cc.Config.checkoutUrl + 'coupon.php')
        .respond({
            amount: 0,
            code: 'TENEURO',
            description: '10 EURO',
            error: null,
            freeShipping: '0',
            name: '10 EURO',
            sortOrder: '0',
            type: 'fix'
        });

    var couponService = createCouponService(httpService);

    couponService.submitCode('')
        .then(function(response) {
            ok(false, 'should receive an error');
            start();
        }, function(err) {
            ok(err, 'receives an error');
            start();
        });
});

asyncTest('submitting an invalid code returns an error', function() {
    expect(1);

    var httpService = createHttpService();

    httpService
        .when('POST', cc.Config.checkoutUrl + 'coupon.php')
        .respond({
            amount: null,
            code: null,
            description: null,
            error: 'Invalid',
            freeShipping: null,
            name: null,
            sortOrder: null,
            type: null
        });

    var couponService = createCouponService(httpService);

    couponService.submitCode('ORLY')
        .then(function(response) {
            ok(false, 'should receive an error');
            start();
        }, function(err) {
            ok(err, 'receives an error');
            start();
        });
});

asyncTest('changing an item in the cart also updates the active coupons', function() {
    expect(3);

    var basketService = new cc.BasketService(new cc.LocalStorageService(), new cc.ConfigService());
    basketService.clear();

    var httpService = createHttpService();

    var product = new cc.models.Product();
    product.name = 'Testproduct';
    product.id = 1;
    product.price = 2.5;
    product.tax = 19;

    var basketItem = basketService.addItem(product, 1, null);
    var summary = basketService.getSummary();

    ok(summary.total === 7.5, 'normal: total should equal 7.5');

    httpService
        .when('POST', cc.Config.checkoutUrl + 'coupon.php')
        .respond({
            amount: 2.5,
            code: 'TENEURO',
            description: '10 EURO',
            error: null,
            freeShipping: '0',
            name: '10 EURO',
            sortOrder: '0',
            type: 'fix'
        });

    var couponService = createCouponService(httpService, basketService);

    // Now increase the quantity of the item and check again
    basketService.once('couponAdded', function () {
        var summary = basketService.getSummary();

        ok(summary.total === 5.0, 'pre-change: total should equal 5');

        httpService.clear();
        httpService
            .when('POST', cc.Config.checkoutUrl + 'coupon.php')
            .respond({
                amount: 5.0,
                code: 'TENEURO',
                description: '10 EURO',
                error: null,
                freeShipping: '0',
                name: '10 EURO',
                sortOrder: '0',
                type: 'fix'
            });

        basketService.once('couponAdded', function () {
            var summary = basketService.getSummary();

            ok(summary.total === 5.0, 'post-change: total should still equal 5');
            start();
        });

        basketService.increaseOne(basketItem);
    });

    couponService.submitCode('TENEURO');


});