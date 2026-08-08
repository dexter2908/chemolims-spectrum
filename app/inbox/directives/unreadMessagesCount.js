"use strict";

angular.module('app.inbox').directive('unreadMessagesCount', function(InboxConfig){
    return {
        restrict: 'A',
        link: function(scope, element){
            InboxConfig.then(function(response){
                var config = response.data;
                element.html(_.find(config.folders, {key: 'inbox'}).unread);
            })
        }
    }
});