"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("UserS",function($resource, $cookieStore){
            var token = "";
            var resource = $resource("/api/users/:id", null, {
                get: {
                    method : "GET",
                    params : {
                        id : "me"
                    },
                    headers : {
                        Authorization: "Bearer " + $cookieStore.get("token")
                    }
                },
                signup: {
                    method : "POST"
                },
                updateLocation : {
                    method : "PUT",
                    headers : {
                        Authorization: "Bearer " + $cookieStore.get("token")
                    }
                }
            });
            
            return {
                setToken : function(tk){
                    this.token = tk;  
                }, 
                
                getResource : function(){return resource}
            }
        });
})(window.angular);