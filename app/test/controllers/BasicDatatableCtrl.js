"use strict";

angular.module('app.test').controller('BasicDatatableCtrl', function(DTOptionsBuilder, DTColumnBuilder, $http) {
    var basicDatatableCtrl = this;

    // 1. Basic configuration: fetching data from a static JSON file or API endpoint
    // Replace 'api/tables/datatables.standard.json' with your actual backend URL
    basicDatatableCtrl.dtOptions = DTOptionsBuilder.fromSource('api/tables/datatables.standard.json')
        .withDOM("<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>" +
                 "t" +
                 "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>")
        .withBootstrap()
        .withOption('responsive', true);

    // 2. Define columns. The 'newColumn' parameter must match the key in your JSON response.
    basicDatatableCtrl.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('No'),
        DTColumnBuilder.newColumn('name').withTitle('Test Name'),
        DTColumnBuilder.newColumn('phone').withTitle('Condition'),
        DTColumnBuilder.newColumn('company').withTitle('Test Method'),
        DTColumnBuilder.newColumn('city').withTitle('Add On Test'),
        DTColumnBuilder.newColumn('date').withTitle('Delete')
    ];

    /**
     * ADVANCED: Server-side processing
     * If you have a large dataset and want to handle pagination, sorting, and filtering on the server:
     * 
     * vm.dtOptions = DTOptionsBuilder.newOptions()
     *     .withOption('ajax', {
     *         url: '/your-backend-api-endpoint',
     *         type: 'POST', // or 'GET'
     *         data: function(d) {
     *             // Add extra parameters to the request if needed
     *             d.extra_param = 'some-value';
     *         }
     *     })
     *     .withDataProp('data') // If your JSON is { "data": [...] } instead of [...]
     *     .withOption('processing', true)
     *     .withOption('serverSide', true)
     *     .withPaginationType('full_numbers')
     *     .withBootstrap();
     */
});
