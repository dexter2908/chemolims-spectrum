angular.module('app').controller('SampleCtrl', function ($scope, sampleService, $log) {
    $scope.countries = [
        {key: "US", value: "United States"},
        {key: "GB", value: "United Kingdom"},
        {key: "FR", value: "France"},
        {key: "DE", value: "Germany"},
        {key: "IT", value: "Italy"},
        {key: "CA", value: "Canada"},
        {key: "AU", value: "Australia"},
        {key: "JP", value: "Japan"},
        {key: "CN", value: "China"},
        {key: "IN", value: "India"},
        {key: "BR", value: "Brazil"}
    ];

    $scope.register = function() {
        sampleService.list().then(function (samples) {
            $scope.countries = [{key: "MY", value: "Malaysia"}];
            $log.log('samples updated via register', $scope.countries);
        });
    };
});