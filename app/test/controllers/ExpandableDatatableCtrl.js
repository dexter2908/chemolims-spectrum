'use strict';

angular.module('app.test').controller('ExpandableDatatableCtrl', function ($http, $log) {
    var vm = this;

    $http.get('app/test/testlist.json').then(function(res){
        $log.log('Projects data loaded via $http:', res.data);

        vm.expandableTableCtrl = res.data;
        vm.tableOptions.data = res.data;
    });

    vm.tableOptions =  {
        "data": [],
        "iDisplayLength": 15,
        "columns": [
            {
                "class":          'details-button-only',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<button class="btn btn-xs btn-default">Details</button>'
            },
            { "data": "testcode", "title": "Test Code" },
            { "data": "testname", "title": "Test Name" },
            { "data": "testmethod", "title": "Method" },
            { "data": "unitofmeasurement", "title": "Unit" },
            { "data": "condition", "title": "Condition" },
            { "data": "externalupperlimit", "title": "Upper Limit" },
            { "data": "testdescription", "title": "Description" }
        ],
        "order": [[1, 'asc']]
    }
});