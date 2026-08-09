"use strict";

angular.module('app.test').factory('sampleService', function ($http, $log, APP_CONFIG) {

    var base = APP_CONFIG.apiRootUrl + '/samples';

    return {
        list: function () {
            return $http.get(base + '.json').then(function (response) {
                return response.data;
            }, function () {
                $log.log('Error');
                return [];          // fallback
            });
        },

        get: function (id) {
            return $http.get(base + '/' + id + '.json').then(function (response) {
                return response.data;
            });
        },

        create: function (sample) {
            return $http.post(base, sample).then(function (response) {
                return response.data;
            });
        },

        update: function (id, sample) {
            return $http.put(base + '/' + id, sample).then(function (response) {
                return response.data;
            });
        },

        remove: function (id) {
            return $http.delete(base + '/' + id);
        }
    };
});