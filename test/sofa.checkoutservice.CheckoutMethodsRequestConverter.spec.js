'use strict';

describe('sofa.checkoutservice', function () {

    describe('sofa.checkoutservice.CheckoutMethodsRequestConverter', function () {

        var converter,
            checkoutModel,
            storageService,
            configService,
            basketService;

        beforeEach(function () {
            converter = new sofa.checkoutservice.CheckoutMethodsRequestConverter();
            checkoutModel = {
                billingAddress: null,
                shippingAddress: null,
                supportedShippingMethods: [],
                supportedPaymentMethods: [],
                selectedPaymentMethod: null,
                selectedShippingMethod: null,
                surchargeHint: ''
            };
            storageService = new sofa.MemoryStorageService();
            configService = new sofa.ConfigService();
            basketService = new sofa.BasketService(storageService, configService);
        });

        // describe('sofa.checkoutservice.CheckoutMethodsRequestConverter#emptyData', function () {
        //     it('should return correct request data', function () {
        //         var requestData = converter(checkoutModel, []);
        //         expect(requestData.customerId).toBe(null);
        //         expect(requestData.billingAddress).toBe(null);
        //         expect(requestData.shippingAddress).toBe(null);
        //         expect(requestData.payment).toBe(null);
        //         expect(requestData.shipping).toBe(null);
        //         expect(requestData.items.length).toBe(0);
        //         expect(requestData.discounts.length).toBe(0);
        //     });
        // });

        describe('sofa.checkoutservice.CheckoutMethodsRequestConverter#withData', function () {
            it('should return correct request data', function () {

                var mrPink = {
                    company: 'Company X',
                    salutation: 'Mr',
                    surname: 'Pink',
                    name: 'John',
                    street: 'The mission',
                    streetnumber: '1',
                    streetextra: 'block C',
                    city: 'San Francisco',
                    zip: '5677732',
                    country: {value: 'US', label: 'United States'},
                    email: 'pink@themission.com',
                    telephone: '0511-45673623'
                };

                var mrPinkBackend = {
                    company: 'Company X',
                    salutation: 'Mr',
                    firstName: 'John',
                    lastName: 'Pink',
                    street: 'The mission',
                    streetNumber: '1',
                    streetAdditional: 'block C',
                    city: 'San Francisco',
                    zipCode: '5677732',
                    country: 'US',
                    //email: 'pink@themission.com',
                    phone: '0511-45673623',
                    //vatId: null,
                    //fax: null
                };

                var mrBlue = {
                    company: 'Company X',
                    salutation: 'Mr',
                    surname: 'Blue',
                    name: 'John',
                    street: 'The mission',
                    streetnumber: '1',
                    streetextra: 'block C',
                    city: 'San Francisco',
                    zip: '5677732',
                    country: {value: 'DE', label: 'Deutschland'},
                    email: 'pink@themission.com',
                    telephone: '0511-45673623'
                };

                var mrBlueBackend = {
                    company: 'Company X',
                    salutation: 'Mr',
                    firstName: 'John',
                    lastName: 'Blue',
                    street: 'The mission',
                    streetNumber: '1',
                    streetAdditional: 'block C',
                    city: 'San Francisco',
                    zipCode: '5677732',
                    country: 'DE',
                    phone: '0511-45673623',
                    //vatId: null,
                    //fax: null
                };

                checkoutModel.billingAddress = mrPink;
                checkoutModel.shippingAddress = mrBlue;

                var product = new sofa.models.Product();
                product.name = 'Testproduct';
                product.id = 10;
                product.qty = 1;

                var product2 = new sofa.models.Product();
                product2.name = 'Testproduct';
                product2.id = 12;
                product2.qty = 5;

                basketService.addItem(product, 1);
                basketService.addItem(product2, 2);

                var requestData = converter(checkoutModel, basketService.getItems());
                //expect(requestData.customerId).toBe(null);
                expect(requestData.billingAddress).toEqual(mrPinkBackend);
                expect(requestData.shippingAddress).toEqual(mrBlueBackend);
                //expect(requestData.payment).toBe(null);
                //expect(requestData.shipping).toBe(null);
                expect(requestData.items.length).toBe(2);

                expect(requestData.items[0]).toEqual({
                    productId: 10,
                    quantity: 1,
                    variant: null,
                    option: null
                });

                expect(requestData.items[1]).toEqual({
                    productId: 12,
                    quantity: 2,
                    variant: null,
                    option: null
                });

                expect(requestData.discounts.length).toBe(0);
            });
        });


        describe('sofa.checkoutservice.CheckoutMethodsRequestConverter#addressEqual', function () {
            it('should return correct request data', function () {

                var mrPink = {
                    company: 'Company X',
                    salutation: 'Mr',
                    surname: 'Pink',
                    name: 'John',
                    street: 'The mission',
                    streetnumber: '1',
                    streetextra: 'block C',
                    city: 'San Francisco',
                    zip: '5677732',
                    country: {value: 'US', label: 'United States'},
                    email: 'pink@themission.com',
                    telephone: '0511-45673623'
                };

                var mrPinkBackend = {
                    company: 'Company X',
                    salutation: 'Mr',
                    firstName: 'John',
                    lastName: 'Pink',
                    street: 'The mission',
                    streetNumber: '1',
                    streetAdditional: 'block C',
                    city: 'San Francisco',
                    zipCode: '5677732',
                    country: 'US',
                    //email: 'pink@themission.com',
                    phone: '0511-45673623',
                    //vatId: null,
                    //fax: null
                };

                checkoutModel.billingAddress = mrPink;
                checkoutModel.addressEqual = true;

                var product = new sofa.models.Product();
                product.name = 'Testproduct';
                product.id = 10;
                product.qty = 1;

                var product2 = new sofa.models.Product();
                product2.name = 'Testproduct';
                product2.id = 12;
                product2.qty = 5;

                basketService.addItem(product, 1);
                basketService.addItem(product2, 2);

                var requestData = converter(checkoutModel, basketService.getItems());
                //expect(requestData.customerId).toBe(null);
                expect(requestData.billingAddress).toEqual(mrPinkBackend);
                expect(requestData.shippingAddress).toEqual(mrPinkBackend);
                //expect(requestData.payment).toBe(null);
                //expect(requestData.shipping).toBe(null);
                expect(requestData.items.length).toBe(2);

                expect(requestData.items[0]).toEqual({
                    productId: 10,
                    quantity: 1,
                    variant: null,
                    option: null
                });

                expect(requestData.items[1]).toEqual({
                    productId: 12,
                    quantity: 2,
                    variant: null,
                    option: null
                });

                expect(requestData.discounts.length).toBe(0);
            });
        });

    });
});