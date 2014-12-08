// 'use strict';
// /* global sofa */
// /* global AsyncSpec */

// var mrPinkAppRepresentation = {
//     company: 'Company X',
//     salutation: 'Mr',
//     surname: 'Pink',
//     name: 'John',
//     street: 'The mission',
//     streetnumber: '1',
//     streetextra: 'block C',
//     city: 'San Francisco',
//     zip: '5677732',
//     country: {value: 'US', label: 'United States'},
//     email: 'pink@themission.com',
//     telephone: '0511-45673623'
// };

// var mrPinkBackendRepresentation = {
//     /* jshint ignore: start */
//     "company":"Company X",
//     "salutation":"Mr",
//     "surname":"Pink",
//     "name":"John",
//     "street":"The mission",
//     "streetnumber":"1",
//     "streetextra":"block C",
//     "city":"San Francisco",
//     "zip":"5677732",
//     "country":"US",
//     "telephone":"0511-45673623",
//     "email":"pink@themission.com",
//     "countryLabel":"United States"
//     /* jshint ignore: end */
// };

// var createHttpService = function () {
//     return new sofa.mocks.httpService(new sofa.QService());
// };

// describe('sofa.checkoutService', function () {

//     var checkoutService,
//         q,
//         configService,
//         loggingService,
//         basketService,
//         httpService,
//         storageService;

//     var createCheckoutService = function (httpService, basketService) {
//         q = new sofa.QService();
//         loggingService = new sofa.LoggingService(configService);
//         checkoutService = new sofa.CheckoutService(httpService, q, basketService, loggingService, configService);
//         return checkoutService;
//     };

//     beforeEach(function () {
//         configService = new sofa.ConfigService();
//         storageService = new sofa.MemoryStorageService();
//         basketService = new sofa.BasketService(storageService, configService);
//         httpService = createHttpService();
//         checkoutService = createCheckoutService(httpService, basketService);
//     });

//     it('should be defined', function () {
//         expect(checkoutService).toBeDefined();
//     });

//     describe('async tests', function () {

//         var async = new AsyncSpec(this);

//         async.it('getSupportCheckoutMethod sends correct data to the backend', function (done) {

//             httpService.when('POST', sofa.Config.checkoutUrl + 'ajax.php').respond({});
//             basketService.clear();

//             var product = new sofa.models.Product();
//             product.name = 'Testproduct';
//             product.id = 10;

//             basketService.addItem(product, 1);

//             var checkoutModel = {
//                 billingAddress: sofa.Util.clone(mrPinkAppRepresentation),
//                 shippingAddress: {
//                     country: {value: 'DE', label: 'Deutschland'}
//                 },
//                 supportedShippingMethods: [],
//                 supportedPaymentMethods: [],
//                 selectedPaymentMethod: null,
//                 selectedShippingMethod: null,
//                 addressEqual: true
//             };

//             checkoutService.getSupportedCheckoutMethods(checkoutModel)
//                 .then(function (data) {
//                     expect(data).toBe(null);
//                     expect(checkoutModel).toEqual(checkoutModel);
//                     done();
//                 });

//             var httpConfig = httpService.getLastCallParams();
//             var data = httpConfig.data;

//             expect(data.task).toEqual('GETPAYMENTMETHODS');
//             //it's easier to compare the JavaScript objects here instead of the raw JSON strings.
//             expect(JSON.parse(data.invoiceAddress)).toEqual(mrPinkBackendRepresentation);
//             expect(data.quote).toEqual('[{"productID":"10","qty":1,"variantID":null,"optionID":null}]');
//         });

//         async.it('checkoutWithCouchCommerce returns a promise with a token', function (done) {

//             httpService.when('POST', sofa.Config.checkoutUrl + 'ajax.php')
//                 .respond('({"token":"CC_4ee08a71c70c007ce92a0b941eb059fe"})');

//             var checkoutModel = {
//                 billingAddress: {
//                     country: {value: 'DE', label: 'Deutschland'}
//                 },
//                 shippingAddress: {
//                     country: {value: 'DE', label: 'Deutschland'}
//                 },
//                 supportedShippingMethods: [],
//                 supportedPaymentMethods: [],
//                 selectedPaymentMethod: {},
//                 selectedShippingMethod: {},
//                 addressEqual: true
//             };

//             checkoutService.checkoutWithCouchCommerce(checkoutModel)
//                 .then(function (token) {
//                     expect(token).toEqual('CC_4ee08a71c70c007ce92a0b941eb059fe');
//                     done();
//                 });
//         });

//         async.it('getSummary transforms addresses in standard format', function (done) {
//             var response = '({"items":[{"id":"136","name":"Strandbag","price":"24.99","productId":"SW10098","size":"","tax_percent":"19","imageURL":"http:\/\/couchcommerce.shopwaredemo.de\/\/media\/image\/thumbnail\/Einkaufstasche_720x600.jpg","imageAlt1":"","variants":"","qty":1,"taxAmount":3.99,"tax":"24.99","subtotal":"24.99","details":""}],"totals":{"subtotal":"24.99","shipping":"2.90","vat":"4.45","grandtotal":"27.89"},"billing":{"salutation": "Mr", "firstname":"John","lastname":"Pink","company":"Company X", "telephone": "0511-45673623", "email":"pink@themission.com","street":"The mission","streetnumber":"1","streetextra":"block C","city":"San Francisco","zip":"5677732","state":"","0":"","country":"US","countryname":"United States"},"shipping":{ "salutation": "Mr", "firstname":"John","lastname":"Pink","company":"Company X", "telephone": "0511-45673623", "email":"pink@themission.com","street":"The mission","streetnumber":"1","streetextra":"block C","city":"San Francisco","zip":"5677732","state":"","0":"","country":"US","countryname":"United States","id":"cc_standard"},"paymentMethod":"Rechnung","shippingMethod":"Standard"})';

//             httpService.when('POST', sofa.Config.checkoutUrl + 'summaryst.php')
//                 .respond(response);


//             checkoutService
//                 .getSummary('someToken')
//                 .then(function (response) {
//                     expect(response).toBeDefined();
//                     expect(response.invoiceAddress).toEqual(mrPinkAppRepresentation);
//                     done();
//                 });
//         });
//     });
// });
