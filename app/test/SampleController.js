angular.module('app').controller('SampleCtrl', function ($scope, sampleService, $log) {
    sampleService.list().then(function (samples) {
        $scope.samples = samples;
        $log.log('samples', samples);
    });
});