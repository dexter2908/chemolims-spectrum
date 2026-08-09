"use strict";

angular.module('app.test', ['ui.router', 'datatables', 'datatables.bootstrap'])

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
            })
            .state('app.test.projects', {
                url: '/projects',
                data: {
                    title: 'Projects'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/project-list.html'
                    }
                }
            });
    });