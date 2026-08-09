'use strict';

angular.module('app.test').controller('ProjectsDemoCtrl', function ($http, $log) {
    var vm = this;

    $http.get('app/test/project-list.json').then(function(res){
        $log.log('Projects data loaded via $http:', res.data);
        vm.projects = res.data;
        vm.tableOptions.data = res.data.data;
    });

    vm.tableOptions =  {
        "data": [],
//            "bDestroy": true,
        "iDisplayLength": 15,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '<button class="btn btn-xs btn-default">Details</button>'
            },
            { "data": "name" },
            { "data": "est" },
            { "data": "contacts" },
            { "data": "status" },
            { "data": "target-actual" },
            { "data": "starts" },
            { "data": "ends" },
            { "data": "tracker" }
        ],
        "order": [[1, 'asc']]
    }
});