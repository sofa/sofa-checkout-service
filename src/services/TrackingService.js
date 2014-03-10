angular.module('sdk.services.trackingService', []);

angular
    .module('sdk.services.trackingService')
    .factory('trackingService', ['$window', '$http', 'configService', function($window, $http, configService){
        return new cc.tracking.TrackingService($window, $http, configService);
}]);
