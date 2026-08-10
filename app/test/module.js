"use strict";

angular.module('app.test', ['ui.router', 'datatables', 'datatables.bootstrap'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/sample-test', '/sample-test/registration');
        $urlRouterProvider.when('/projects', '/projects/registration');
        $urlRouterProvider.when('/tab', '/tab/table');
        $urlRouterProvider.when('/filter', '/filter/table');
        $stateProvider
            .state('app.formBasicTable', {
                url: '/sample-test',
                data: {
                    title: 'Basic Table'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/form-with-basic-table.html'
                    }
                }
            })
            .state('app.formBasicTable.registration', {
                url: '/registration',
                views: {
                    "registrationForm": {
                        templateUrl: "app/test/views/registration.html",
                        controller: 'RegistrationCtrl as registration'
                    },
                    "basicTable": {
                        templateUrl: 'app/test/views/basic-datatable.html',
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    }
                }
            })
            .state('app.formExpandableTable', {
                url: '/projects',
                controller: 'ExpandableDatatableCtrl',
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/form-with-expandable-table.html'
                    }
                }
            })
            .state('app.formExpandableTable.registration', {
                url: '/registration',
                views: {
                    "registrationForm": {
                        templateUrl: "app/test/views/registration.html",
                        controller: 'RegistrationCtrl as registration'
                    },
                    "expandableTable": {
                        templateUrl: 'app/test/views/expandable-datatable.html',
                        controller: 'ExpandableDatatableCtrl as expandableTableCtrl'
                    }
                }
            })
            .state('app.tab', {
                url: '/tab',
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/tab-with-basic-table.html'
                    }
                }
            })
            .state('app.tab.table', {
                url: '/table',
                views: {
                    "openWorkTable": {
                        templateUrl: "app/test/views/basic-datatable.html",
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    },
                    "ToBeCollectedTable": {
                        templateUrl: 'app/test/views/basic-datatable.html',
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    },
                    "ResultOfShiftTable": {
                        templateUrl: "app/test/views/basic-datatable.html",
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    },
                    "SampleListTable": {
                        templateUrl: "app/test/views/basic-datatable.html",
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    },
                }
            })
            .state('app.formFilter', {
                url: '/filter',
                data: {
                    title: 'Basic Table'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/test/views/form-filter-with-basic-table.html',
                        controller: 'RegistrationCtrl as registration'
                    }
                }
            })
            .state('app.formFilter.tableregistration', {
                url: '/table',
                views: {
                    "registrationForm": {
                        templateUrl: "app/test/views/filter.html",
                        controller: 'RegistrationCtrl as registration'
                    },
                    "basicTable": {
                        templateUrl: 'app/test/views/basic-datatable.html',
                        controller: 'BasicDatatableCtrl as basicDatatableCtrl'
                    }
                }
            });

    });