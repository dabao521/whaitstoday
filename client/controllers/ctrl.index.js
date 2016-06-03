"use strict";

(function(angular){
    angular.module("mainApp", ['ui.router', 'ngResource', 'ngCookies'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $stateProvider.state("barList",{
                url: "/barList",
                templateUrl : "/public/barList.html",
                controller : barListCtrl
            })
            .state("login", {
                url: "/login",
                templateUrl : "/public/login.html",
                controller : loginCtrl
            })
            .state("signup", {
                url: "/signup",
                templateUrl : "/public/signup.html",
                controller : signupCtrl
            });
            $urlRouterProvider.otherwise("/barList");
        }])
        .run(['$rootScope', '$state', '$stateParams', 'Auth', 
                function($rootScope, $state, $stateParams, Auth){
                    $rootScope.$on("$stateChangeStart", function(event, toState, toStateParams){
                        $rootScope.toState = toState;
                        $rootScope.toStateParams = toStateParams;
                        
                        if(toState == "setting") {
                            Auth.authorize();
                        }
                    });
        }])
        .directive("myNavbar", function(){
            return {
                templateUrl : "/public/navbar.html",
                link:navbarCtrl,
                restrict: "E"
            }
        });
        
        function navbarCtrl(){
        }
})(window.angular)