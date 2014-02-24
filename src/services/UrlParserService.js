angular.module('sdk.services.urlParserService', []);

angular.module('sdk.services.urlParserService')
.factory('urlParserService', function(){
        return new cc.UrlParserService(new sofa.LocationService());
});


