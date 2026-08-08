"use strict";

angular.module('app.test', ['ui.router'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('app.test', {
                url: '/sample-test',
                data: {
                    title: 'Sample Test'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/sample-test.html'
                    }
                }
            });
    });