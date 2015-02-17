require('shared-sofa-component-tasks')(require('gulp'), {
    pkg: require('./package.json'),
    baseDir: __dirname,
    testDependencyFiles: [
        'node_modules/sofa-testing/mocks/sofa.httpService.mock.js',
        'node_modules/sofa-basket-service/dist/sofaBasketService.js',
        'node_modules/sofa-logging-service/dist/sofaLoggingService.js',
        'node_modules/sofa-q-service/dist/sofa.qService.js'
    ]
});
